/**
 * Module de gestion d'annulation de téléchargement
 * Permet d'annuler proprement les téléchargements en cours
 */

(function() {
  // Configuration
  const config = {
    debug: true, // Activer pour déboguer
    useConsoleLog: true
  };

  // Logger personnalisé
  function log(...args) {
    if (config.debug && config.useConsoleLog) {
      console.log('[CancelDownload]', ...args);
    }
  }

  // Variables d'état
  let downloadInProgress = false;
  let downloadCancelled = false;
  let currentDownloadController = null;
  let activeDownloadRequests = [];
  
  // Sauvegarder les fonctions originales
  const originalCreateObjectURL = window.URL.createObjectURL;
  const originalFetch = window.fetch;
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  const originalCreateElement = document.createElement;
  
  // Intercepter FileSaver.js - CRITIQUE pour bloquer les téléchargements
  if (window.saveAs) {
    log('FileSaver.js détecté - Interception...');
    const originalSaveAs = window.saveAs;
    window.saveAs = function(blob, filename, opts) {
      if (window.blockAllDownloads || downloadCancelled) {
        log('Téléchargement bloqué via saveAs:', filename);
        return Promise.reject(new Error('Téléchargement annulé'));
      }
      return originalSaveAs(blob, filename, opts);
    };
  }
  
  // Interception globale d'autres méthodes de téléchargement
  function interceptDownloads() {
    // Interception directe de toutes les méthodes de téléchargement connues
    [
      'saveAs', 
      'download', 
      'downloadFile', 
      'generateDownload', 
      'exportFile', 
      'generateZip', 
      'createDownload'
    ].forEach(funcName => {
      if (window[funcName] && typeof window[funcName] === 'function') {
        const original = window[funcName];
        window[funcName] = function(...args) {
          if (window.blockAllDownloads || downloadCancelled) {
            log(`Téléchargement bloqué via ${funcName}`);
            return Promise.reject(new Error('Téléchargement annulé'));
          }
          return original.apply(this, args);
        };
        log(`Fonction interceptée: ${funcName}`);
      }
    });
    
    // Interception spécifique pour JSZip
    if (window.JSZip) {
      log('JSZip détecté - Interception...');
      
      // Intercepter la méthode generateAsync qui crée le zip final
      const originalGenerateAsync = window.JSZip.prototype.generateAsync;
      window.JSZip.prototype.generateAsync = function(...args) {
        if (window.blockAllDownloads || downloadCancelled) {
          log('Génération de ZIP bloquée via generateAsync');
          return Promise.reject(new Error('Téléchargement annulé'));
        }
        
        // Stocker la promesse pour pouvoir l'annuler plus tard
        const zipPromise = originalGenerateAsync.apply(this, args);
        activeDownloadRequests.push(zipPromise);
        
        zipPromise.finally(() => {
          const index = activeDownloadRequests.indexOf(zipPromise);
          if (index > -1) {
            activeDownloadRequests.splice(index, 1);
          }
        });
        
        return zipPromise;
      };
    }
  }
  
  // Fonction principale d'annulation
  function cancelDownload() {
    log('Annulation du téléchargement demandée');
    
    // Marquer l'annulation clairement
    downloadInProgress = false;
    downloadCancelled = true;
    window.shouldCancelDownload = true;
    window.isGenerating = false;
    
    // Bloquer immédiatement tous les téléchargements
    window.blockAllDownloads = true;
    
    // Arrêter les requêtes en cours
    if (currentDownloadController) {
      try {
        currentDownloadController.abort();
        log('AbortController déclenché');
      } catch (e) {
        console.error('Erreur lors de l\'annulation via AbortController:', e);
      }
    }
    
    // Interrompre les requêtes fetch actives
    try {
      if (activeDownloadRequests && activeDownloadRequests.length) {
        activeDownloadRequests.forEach(req => {
          if (req && req.abort) req.abort();
        });
        log(`${activeDownloadRequests.length} requêtes annulées`);
      }
      activeDownloadRequests = [];
    } catch (e) {
      console.error('Erreur lors de l\'annulation des requêtes fetch:', e);
    }
    
    // Arrêter tous les téléchargements en cours
    try {
      // Supprimer les liens de téléchargement existants
      document.querySelectorAll('a[download][href^="blob:"]').forEach(el => {
        log('Suppression d\'un lien de téléchargement:', el);
        URL.revokeObjectURL(el.href);
        el.remove();
      });
      
      // Supprimer les iframes de téléchargement
      document.querySelectorAll('iframe[src^="blob:"]').forEach(el => {
        log('Suppression d\'un iframe de téléchargement:', el);
        el.remove();
      });
      
      // Annuler les tâches en attente dans la file de téléchargement
      if (window.downloadQueue) {
        log(`Annulation de ${window.downloadQueue.length} tâches en attente`);
        window.downloadQueue = [];
      }
      
      if (window.currentDownloads) {
        log(`Arrêt de ${window.currentDownloads.length} téléchargements en cours`);
        window.currentDownloads = [];
      }
      
      if (window.pendingDownloads) {
        log(`Annulation de ${window.pendingDownloads.length} téléchargements en attente`);
        window.pendingDownloads = [];
      }
      
      // Interrompre la génération du ZIP si elle est en cours
      if (window.zip && typeof window.zip.abort === 'function') {
        window.zip.abort();
        log('Génération du ZIP interrompue');
      }
      
      // SOLUTION RADICALE: Remplacer temporairement FileSaver.js
      if (window.saveAs) {
        window.originalSaveAs = window.saveAs;
        window.saveAs = function() {
          log('Tentative de téléchargement bloquée');
          return Promise.reject(new Error('Téléchargement annulé'));
        };
        log('FileSaver.js désactivé temporairement');
      }
      
      // Désactiver également Blob.prototype.slice qui est utilisé dans la génération de fichiers
      if (Blob.prototype.slice) {
        const originalSlice = Blob.prototype.slice;
        Blob.prototype.slice = function(...args) {
          if (window.blockAllDownloads) {
            log('Blob.slice bloqué pendant l\'annulation');
            return new Blob([], { type: 'application/octet-stream' });
          }
          return originalSlice.apply(this, args);
        };
      }
    } catch (e) {
      console.error('Erreur lors de l\'arrêt des téléchargements en cours:', e);
    }
    
    // Bloquer aussi navigator.msSaveBlob pour IE
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob = function() {
        log('msSaveBlob bloqué');
        return false;
      };
    }
    
    // Réinitialiser l'interface
    const elements = {
      progressBars: ['downloadProgress', 'modalDownloadProgress', 'loader'],
      modals: ['raceModal', 'selectionModal']
    };
    
    // Masquer les éléments de progression
    elements.progressBars.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    
    // Fermer les modals
    elements.modals.forEach(id => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.add('hidden');
        setTimeout(() => {
          modal.style.display = 'none';
        }, 10);
      }
    });
    
    // Réinitialiser les barres de progression
    const progressBar = document.getElementById('progressBar');
    const modalProgressBar = document.getElementById('modalProgressBar');
    if (progressBar) progressBar.style.width = '0%';
    if (modalProgressBar) modalProgressBar.style.width = '0%';
    
    // Afficher un message à l'utilisateur
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
      statusMessage.textContent = 'Téléchargement annulé';
      statusMessage.style.display = 'block';
      statusMessage.className = 'status warning';
      
      setTimeout(() => {
        statusMessage.style.display = 'none';
      }, 3000);
    }
    
    // Afficher également le message dans le modal si présent
    const modalCancelNotification = document.getElementById('modalCancelNotification');
    if (modalCancelNotification && window.notificationSystem) {
      // Utiliser le système de notification
      window.notificationSystem.show('modalCancelNotification', 2000);
      log('Message d\'annulation affiché dans le modal via le système de notification');
    } else if (modalCancelNotification) {
      // Fallback au cas où le système de notification n'est pas chargé
      modalCancelNotification.style.display = 'flex';
      log('Message d\'annulation affiché dans le modal (méthode traditionnelle)');
      
      // Faire disparaître le message après 2 secondes
      if (window.cancelNotificationTimer) {
        clearTimeout(window.cancelNotificationTimer);
      }
      
      window.cancelNotificationTimer = setTimeout(function() {
        modalCancelNotification.style.display = 'none';
        log('Message d\'annulation masqué après 2 secondes');
      }, 2000);
    }
    
    // Callbacks personnalisés
    if (typeof window.onDownloadCancelled === 'function') {
      try {
        window.onDownloadCancelled();
        log('Callback d\'annulation exécuté');
      } catch (e) {
        console.error('Erreur dans le callback d\'annulation:', e);
      }
    }
    
    // Arrêter les timers potentiellement problématiques en excluant ceux de notification
    for (let i = 1; i < 1000; i++) {
      const isProtectedTimer = window.cancelNotificationTimer === i || 
                             (window.protectNotificationTimers && 
                              window.protectNotificationTimers().includes(i));
      
      if (!isProtectedTimer) {
        window.clearTimeout(i);
        window.clearInterval(i);
      }
    }
    
    // SOLUTION DÉFINITIVE RADICALE: Briser l'objet JSZip
    if (window.JSZip) {
      // Sauvegarde des méthodes originales au cas où
      if (!window._originalJSZip) {
        window._originalJSZip = {
          generateAsync: window.JSZip.prototype.generateAsync,
          file: window.JSZip.prototype.file,
          folder: window.JSZip.prototype.folder
        };
      }
      
      // Remplacer les méthodes principales par des versions qui échouent
      window.JSZip.prototype.generateAsync = function() {
        log('JSZip.generateAsync bloqué');
        return Promise.reject(new Error('Téléchargement annulé'));
      };
      
      window.JSZip.prototype.file = function() {
        log('JSZip.file bloqué');
        return this;
      };
      
      window.JSZip.prototype.folder = function() {
        log('JSZip.folder bloqué');
        return this;
      };
      
      log('JSZip désactivé');
    }
    
    // Réinitialiser l'état après un délai plus long pour assurer que tout est arrêté
    setTimeout(() => {
      // Restaurer les fonctions originales
      if (window.originalSaveAs) {
        window.saveAs = window.originalSaveAs;
        window.originalSaveAs = null;
      }
      
      if (window._originalJSZip) {
        window.JSZip.prototype.generateAsync = window._originalJSZip.generateAsync;
        window.JSZip.prototype.file = window._originalJSZip.file;
        window.JSZip.prototype.folder = window._originalJSZip.folder;
      }
      
      // Réactiver les téléchargements futurs
      window.blockAllDownloads = false;
      
      // Réinitialiser les drapeaux d'état
      downloadCancelled = false;
      downloadInProgress = false;
      window.shouldCancelDownload = false;
      currentDownloadController = null;
      
      log('État réinitialisé après annulation');
      
      // Redémarrer les intercepteurs
      initDownloadInterceptors();
    }, 1000);
    
    return false;
  }
  
  // Intercepteurs de téléchargement
  function initDownloadInterceptors() {
    // Intercepter les téléchargements via createObjectURL
    window.URL.createObjectURL = function(object) {
      if (window.blockAllDownloads || downloadCancelled) {
        log('Création d\'URL d\'objet bloquée');
        return null;
      }
      return originalCreateObjectURL(object);
    };
    
    // Intercepter les requêtes fetch
    window.fetch = function(...args) {
      if (window.blockAllDownloads || downloadCancelled) {
        log('Requête fetch bloquée car téléchargement annulé');
        return Promise.reject(new Error('Téléchargement annulé'));
      }
      
      const fetchPromise = originalFetch.apply(this, args);
      activeDownloadRequests.push(fetchPromise);
      
      fetchPromise.finally(() => {
        const index = activeDownloadRequests.indexOf(fetchPromise);
        if (index > -1) {
          activeDownloadRequests.splice(index, 1);
        }
      });
      
      return fetchPromise;
    };
    
    // Intercepter la création d'éléments qui pourraient être utilisés pour le téléchargement
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(document, tagName);
      
      if (tagName.toLowerCase() === 'a') {
        const originalClick = element.click;
        element.click = function() {
          if (this.getAttribute('download') && (window.blockAllDownloads || downloadCancelled)) {
            log('Clic de téléchargement bloqué');
            return false;
          }
          return originalClick.apply(this, arguments);
        };
        
        // Surveiller l'attribut href
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
          if (name === 'href' && this.hasAttribute('download') && 
              (window.blockAllDownloads || downloadCancelled)) {
            log('Attribution d\'URL de téléchargement bloquée');
            return;
          }
          return originalSetAttribute.call(this, name, value);
        };
      }
      
      return element;
    };
    
    // Intercepter les requêtes XMLHttpRequest
    XMLHttpRequest.prototype.open = function(...args) {
      this._url = args[1]; // Sauvegarder l'URL pour vérification ultérieure
      return originalXHROpen.apply(this, args);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
      if (window.blockAllDownloads || downloadCancelled) {
        log('Requête XHR bloquée:', this._url);
        this.abort();
        return;
      }
      return originalXHRSend.apply(this, args);
    };
    
    // Intercepter les bibliothèques de téléchargement spécifiques
    interceptDownloads();
  }
  
  // Initialisation du système d'annulation
  function initCancelation() {
    log('Initialisation du système d\'annulation');
    
    // Initialiser les intercepteurs de téléchargement
    initDownloadInterceptors();
    
    // Fonction pour attacher les événements
    function attachCancelEvents() {
      const buttons = [
        document.getElementById('cancelDownloadBtn'),
        document.getElementById('mainCancelDownloadBtn')
      ];
      
      buttons.forEach(btn => {
        if (btn) {
          // Annule tout événement existant et attache le nouveau
          btn.removeEventListener('click', cancelDownload);
          btn.addEventListener('click', cancelDownload);
          
          // S'assurer que l'attribut onclick est également défini
          btn.onclick = cancelDownload;
          
          log(`Événement d'annulation attaché à ${btn.id}`);
        }
      });
    }
    
    // Attacher les événements immédiatement
    attachCancelEvents();
    
    // Vérifier périodiquement pour les éléments ajoutés dynamiquement
    setInterval(attachCancelEvents, 800);
    
    // Exposer l'API d'annulation globalement
    window.cancelActiveDownload = cancelDownload;
    
    // Initialiser les variables d'état
    window.startDownloadProcess = function(selectedMods, isModalContext) {
      downloadInProgress = true;
      downloadCancelled = false;
      window.blockAllDownloads = false;
      
      // Réinitialiser le message d'annulation dans le modal
      if (window.notificationSystem) {
        window.notificationSystem.hide('modalCancelNotification');
        log('Message d\'annulation réinitialisé via le système de notification');
      } else {
        const modalCancelNotification = document.getElementById('modalCancelNotification');
        if (modalCancelNotification) {
          modalCancelNotification.style.display = 'none';
          log('Message d\'annulation réinitialisé (méthode traditionnelle)');
        }
      }
      
      currentDownloadController = new AbortController();
      log('Téléchargement initialisé avec support d\'annulation');
      
      return currentDownloadController.signal;
    };
    
    log('Système d\'annulation initialisé avec succès');
  }
  
  // CRITICAL: Intercepter immédiatement FileSaver.js avant même le chargement du DOM
  if (window.saveAs) {
    const originalSaveAs = window.saveAs;
    window.saveAs = function(blob, filename, opts) {
      if (window.blockAllDownloads || downloadCancelled) {
        console.log('[CancelDownload] Téléchargement via saveAs bloqué:', filename);
        return false;
      }
      return originalSaveAs(blob, filename, opts);
    };
  }
  
  // Initialiser lorsque le DOM est chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCancelation);
  } else {
    // Si le DOM est déjà chargé, initialiser immédiatement
    initCancelation();
  }
  
  // CRITICAL: Exposer immédiatement la fonction d'annulation
  window.cancelActiveDownload = cancelDownload;
  window.blockAllDownloads = false;
})(); 