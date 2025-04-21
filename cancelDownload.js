(function() {
    const config = {
      debug: true
    };
  
    function log(...args) {
      if (config.debug) console.log('[CancelDownload]', ...args);
    }
  
    // Variables spécifiques
    let downloadCancelled = false;
    let cancelNotificationTimer = null;
    let fadeOutTimer = null;
  
    function cancelDownload() {
      log('Annulation du téléchargement demandée');
  
      window.blockAllDownloads = true;
      window.shouldCancelDownload = true;
  
      const modalCancelNotification = document.getElementById('modalCancelNotification');
      if (modalCancelNotification) {
        modalCancelNotification.style.display = 'flex';
        modalCancelNotification.style.opacity = '1';
        modalCancelNotification.style.transition = 'opacity 0.5s ease';
  
        // Nettoyer les anciens timers s'il y en a
        if (cancelNotificationTimer) clearTimeout(cancelNotificationTimer);
        if (fadeOutTimer) clearTimeout(fadeOutTimer);
  
        // Commence le fade-out après 4 secondes
        fadeOutTimer = setTimeout(() => {
          modalCancelNotification.style.opacity = '0';
        }, 4000);
  
        // Cache totalement après 5 secondes
        cancelNotificationTimer = setTimeout(() => {
          modalCancelNotification.style.display = 'none';
          modalCancelNotification.style.opacity = '1'; // Remettre prêt pour la prochaine fois
        }, 5000);
      }
  
      // Masquer les éléments de progression
      const progressElements = [
        document.getElementById('downloadProgress'),
        document.getElementById('modalDownloadProgress'),
        document.getElementById('loader')
      ];
      progressElements.forEach(el => {
        if (el) el.style.display = 'none';
      });
  
      // Fermer les modals
      const modals = [
        document.getElementById('raceModal'),
        document.getElementById('selectionModal')
      ];
      modals.forEach(modal => {
        if (modal) {
          modal.classList.add('hidden');
          setTimeout(() => {
            modal.style.display = 'none';
          }, 10);
        }
      });
  
      // Remettre à zéro les barres de progression
      const progressBar = document.getElementById('progressBar');
      const modalProgressBar = document.getElementById('modalProgressBar');
      if (progressBar) progressBar.style.width = '0%';
      if (modalProgressBar) modalProgressBar.style.width = '0%';
  
      // Afficher un message général "Téléchargement annulé"
      const statusMessage = document.getElementById('statusMessage');
      if (statusMessage) {
        statusMessage.textContent = 'Téléchargement annulé';
        statusMessage.className = 'status warning';
        statusMessage.style.display = 'block';
  
        setTimeout(() => {
          statusMessage.style.display = 'none';
        }, 4000);
      }
  
      downloadCancelled = true;
    }
  
    // Ajoute les événements sur les boutons d'annulation
    function setupCancelButtons() {
      const buttons = [
        document.getElementById('cancelDownloadBtn'),
        document.getElementById('mainCancelDownloadBtn')
      ];
      buttons.forEach(btn => {
        if (btn) {
          btn.onclick = cancelDownload;
        }
      });
    }
  
    document.addEventListener('DOMContentLoaded', setupCancelButtons);
  
    // Rendre la fonction accessible globalement
    window.cancelActiveDownload = cancelDownload;
  })();
  