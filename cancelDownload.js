/**
 * Download cancellation management module
 * Allows for clean cancellation of ongoing downloads
 */

(function() {
  // Configuration
  const config = {
    debug: true, // Enable for debugging
    useConsoleLog: true
  };

  // Custom logger
  function log(...args) {
    if (config.debug && config.useConsoleLog) {
      console.log('[CancelDownload]', ...args);
    }
  }

  // State variables
  let downloadInProgress = false;
  let downloadCancelled = false;
  let currentDownloadController = null;
  let activeDownloadRequests = [];
  
  // Save original functions
  const originalCreateObjectURL = window.URL.createObjectURL;
  const originalFetch = window.fetch;
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  const originalCreateElement = document.createElement;
  
  // Intercept FileSaver.js - CRITICAL to block downloads
  if (window.saveAs) {
    log('FileSaver.js detected - Intercepting...');
    const originalSaveAs = window.saveAs;
    window.saveAs = function(blob, filename, opts) {
      if (window.blockAllDownloads || downloadCancelled) {
        log('Download blocked via saveAs:', filename);
        return Promise.reject(new Error('Download cancelled'));
      }
      return originalSaveAs(blob, filename, opts);
    };
  }
  
  // Global interception of other download methods
  function interceptDownloads() {
    // Direct interception of all known download methods
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
            log(`Download blocked via ${funcName}`);
            return Promise.reject(new Error('Download cancelled'));
          }
          return original.apply(this, args);
        };
        log(`Function intercepted: ${funcName}`);
      }
    });
    
    // Specific interception for JSZip
    if (window.JSZip) {
      log('JSZip detected - Intercepting...');
      
      // Intercept the generateAsync method that creates the final zip
      const originalGenerateAsync = window.JSZip.prototype.generateAsync;
      window.JSZip.prototype.generateAsync = function(...args) {
        if (window.blockAllDownloads || downloadCancelled) {
          log('ZIP generation blocked via generateAsync');
          return Promise.reject(new Error('Download cancelled'));
        }
        
        // Store the promise so it can be cancelled later
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
  
  // Main cancellation function
  function cancelDownload() {
    log('Download cancellation requested');
    
    // Mark cancellation clearly
    downloadInProgress = false;
    downloadCancelled = true;
    window.shouldCancelDownload = true;
    window.isGenerating = false;
    
    // Immediately block all downloads
    window.blockAllDownloads = true;
    
    // Stop ongoing requests
    if (currentDownloadController) {
      try {
        currentDownloadController.abort();
        log('AbortController triggered');
      } catch (e) {
        console.error('Error when cancelling via AbortController:', e);
      }
    }
    
    // Interrupt active fetch requests
    try {
      if (activeDownloadRequests && activeDownloadRequests.length) {
        activeDownloadRequests.forEach(req => {
          if (req && req.abort) req.abort();
        });
        log(`${activeDownloadRequests.length} requests cancelled`);
      }
      activeDownloadRequests = [];
    } catch (e) {
      console.error('Error when cancelling fetch requests:', e);
    }
    
    // Stop all downloads in progress
    try {
      // Remove existing download links
      document.querySelectorAll('a[download][href^="blob:"]').forEach(el => {
        log('Removing a download link:', el);
        URL.revokeObjectURL(el.href);
        el.remove();
      });
      
      // Remove download iframes
      document.querySelectorAll('iframe[src^="blob:"]').forEach(el => {
        log('Removing a download iframe:', el);
        el.remove();
      });
      
      // Cancel pending tasks in the download queue
      if (window.downloadQueue) {
        log(`Cancelling ${window.downloadQueue.length} pending tasks`);
        window.downloadQueue = [];
      }
      
      if (window.currentDownloads) {
        log(`Stopping ${window.currentDownloads.length} downloads in progress`);
        window.currentDownloads = [];
      }
      
      if (window.pendingDownloads) {
        log(`Cancelling ${window.pendingDownloads.length} pending downloads`);
        window.pendingDownloads = [];
      }
      
      // Interrupt ZIP generation if in progress
      if (window.zip && typeof window.zip.abort === 'function') {
        window.zip.abort();
        log('ZIP generation interrupted');
      }
      
      // RADICAL SOLUTION: Temporarily replace FileSaver.js
      if (window.saveAs) {
        window.originalSaveAs = window.saveAs;
        window.saveAs = function() {
          log('Download attempt blocked');
          return Promise.reject(new Error('Download cancelled'));
        };
        log('FileSaver.js temporarily disabled');
      }
      
      // Also disable Blob.prototype.slice which is used in file generation
      if (Blob.prototype.slice) {
        const originalSlice = Blob.prototype.slice;
        Blob.prototype.slice = function(...args) {
          if (window.blockAllDownloads) {
            log('Blob.slice blocked during cancellation');
            return new Blob([], { type: 'application/octet-stream' });
          }
          return originalSlice.apply(this, args);
        };
      }
    } catch (e) {
      console.error('Error when stopping downloads in progress:', e);
    }
    
    // Also block navigator.msSaveBlob for IE
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob = function() {
        log('msSaveBlob blocked');
        return false;
      };
    }
    
    // Reset interface
    const elements = {
      progressBars: ['downloadProgress', 'modalDownloadProgress', 'loader'],
      modals: ['raceModal', 'selectionModal']
    };
    
    // Hide progress elements
    elements.progressBars.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    
    // Close modals
    elements.modals.forEach(id => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.add('hidden');
        setTimeout(() => {
          modal.style.display = 'none';
        }, 10);
      }
    });
    
    // Reset progress bars
    const progressBar = document.getElementById('progressBar');
    const modalProgressBar = document.getElementById('modalProgressBar');
    if (progressBar) progressBar.style.width = '0%';
    if (modalProgressBar) modalProgressBar.style.width = '0%';
    
    // Display a message to the user
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
      statusMessage.textContent = 'Download cancelled';
      statusMessage.style.display = 'block';
      statusMessage.className = 'status warning';
      
      setTimeout(() => {
        statusMessage.style.display = 'none';
      }, 3000);
    }
    
    // Also display the message in the modal if present
    const modalCancelNotification = document.getElementById('modalCancelNotification');
    if (modalCancelNotification && window.notificationSystem) {
      // Use the notification system
      window.notificationSystem.show('modalCancelNotification', 2000);
      log('Cancellation message displayed in modal via notification system');
    } else if (modalCancelNotification) {
      // Fallback in case the notification system is not loaded
      modalCancelNotification.style.display = 'flex';
      log('Cancellation message displayed in modal (traditional method)');
      
      // Hide the message after 2 seconds
      if (window.cancelNotificationTimer) {
        clearTimeout(window.cancelNotificationTimer);
      }
      
      window.cancelNotificationTimer = setTimeout(function() {
        modalCancelNotification.style.display = 'none';
        log('Cancellation message hidden after 2 seconds');
      }, 2000);
    }
    
    // Custom callbacks
    if (typeof window.onDownloadCancelled === 'function') {
      try {
        window.onDownloadCancelled();
        log('Cancellation callback executed');
      } catch (e) {
        console.error('Error in cancellation callback:', e);
      }
    }
    
    // Stop potentially problematic timers excluding notification ones
    for (let i = 1; i < 1000; i++) {
      const isProtectedTimer = window.cancelNotificationTimer === i || 
                             (window.protectNotificationTimers && 
                              window.protectNotificationTimers().includes(i));
      
      if (!isProtectedTimer) {
        window.clearTimeout(i);
        window.clearInterval(i);
      }
    }
    
    // DEFINITIVE RADICAL SOLUTION: Break the JSZip object
    if (window.JSZip) {
      // Backup original methods just in case
      if (!window._originalJSZip) {
        window._originalJSZip = {
          generateAsync: window.JSZip.prototype.generateAsync,
          file: window.JSZip.prototype.file,
          folder: window.JSZip.prototype.folder
        };
      }
      
      // Replace main methods with failing versions
      window.JSZip.prototype.generateAsync = function() {
        log('JSZip.generateAsync blocked');
        return Promise.reject(new Error('Download cancelled'));
      };
      
      window.JSZip.prototype.file = function() {
        log('JSZip.file blocked');
        return this;
      };
      
      window.JSZip.prototype.folder = function() {
        log('JSZip.folder blocked');
        return this;
      };
      
      log('JSZip disabled');
    }
    
    // Reset state after a longer delay to ensure everything is stopped
    setTimeout(() => {
      // Restore original functions
      if (window.originalSaveAs) {
        window.saveAs = window.originalSaveAs;
        window.originalSaveAs = null;
      }
      
      if (window._originalJSZip) {
        window.JSZip.prototype.generateAsync = window._originalJSZip.generateAsync;
        window.JSZip.prototype.file = window._originalJSZip.file;
        window.JSZip.prototype.folder = window._originalJSZip.folder;
      }
      
      // Re-enable future downloads
      window.blockAllDownloads = false;
      
      // Reset state flags
      downloadCancelled = false;
      downloadInProgress = false;
      window.shouldCancelDownload = false;
      currentDownloadController = null;
      
      log('State reset after cancellation');
      
      // Restart interceptors
      initDownloadInterceptors();
    }, 1000);
    
    return false;
  }
  
  // Download interceptors
  function initDownloadInterceptors() {
    // Intercept downloads via createObjectURL
    window.URL.createObjectURL = function(object) {
      if (window.blockAllDownloads || downloadCancelled) {
        log('Object URL creation blocked');
        return null;
      }
      return originalCreateObjectURL(object);
    };
    
    // Intercept fetch requests
    window.fetch = function(...args) {
      if (window.blockAllDownloads || downloadCancelled) {
        log('Fetch request blocked because download cancelled');
        return Promise.reject(new Error('Download cancelled'));
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
    
    // Intercept creation of elements that could be used for downloads
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(document, tagName);
      
      if (tagName.toLowerCase() === 'a') {
        const originalClick = element.click;
        element.click = function() {
          if (this.getAttribute('download') && (window.blockAllDownloads || downloadCancelled)) {
            log('Download click blocked');
            return false;
          }
          return originalClick.apply(this, arguments);
        };
        
        // Monitor href attribute
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
          if (name === 'href' && this.hasAttribute('download') && 
              (window.blockAllDownloads || downloadCancelled)) {
            log('Download URL attribution blocked');
            return;
          }
          return originalSetAttribute.call(this, name, value);
        };
      }
      
      return element;
    };
    
    // Intercept XMLHttpRequest requests
    XMLHttpRequest.prototype.open = function(...args) {
      this._url = args[1]; // Save URL for later checking
      return originalXHROpen.apply(this, args);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
      if (window.blockAllDownloads || downloadCancelled) {
        log('XHR request blocked:', this._url);
        this.abort();
        return;
      }
      return originalXHRSend.apply(this, args);
    };
    
    // Intercept specific download libraries
    interceptDownloads();
  }
  
  // Initialize cancellation system
  function initCancelation() {
    log('Initializing cancellation system');
    
    // Initialize download interceptors
    initDownloadInterceptors();
    
    // Function to attach events
    function attachCancelEvents() {
      const buttons = [
        document.getElementById('cancelDownloadBtn'),
        document.getElementById('mainCancelDownloadBtn')
      ];
      
      buttons.forEach(btn => {
        if (btn) {
          // Cancel any existing event and attach the new one
          btn.removeEventListener('click', cancelDownload);
          btn.addEventListener('click', cancelDownload);
          
          // Ensure onclick attribute is also defined
          btn.onclick = cancelDownload;
          
          log(`Cancellation event attached to ${btn.id}`);
        }
      });
    }
    
    // Attach events immediately
    attachCancelEvents();
    
    // Periodically check for dynamically added elements
    setInterval(attachCancelEvents, 800);
    
    // Expose cancellation API globally
    window.cancelActiveDownload = cancelDownload;
    
    // Initialize state variables
    window.startDownloadProcess = function(selectedMods, isModalContext) {
      downloadInProgress = true;
      downloadCancelled = false;
      window.blockAllDownloads = false;
      
      // Reset cancellation message in modal
      if (window.notificationSystem) {
        window.notificationSystem.hide('modalCancelNotification');
        log('Cancellation message reset via notification system');
      } else {
        const modalCancelNotification = document.getElementById('modalCancelNotification');
        if (modalCancelNotification) {
          modalCancelNotification.style.display = 'none';
          log('Cancellation message reset (traditional method)');
        }
      }
      
      currentDownloadController = new AbortController();
      log('Download initialized with cancellation support');
      
      return currentDownloadController.signal;
    };
    
    log('Cancellation system successfully initialized');
  }
  
  // CRITICAL: Immediately intercept FileSaver.js even before DOM loading
  if (window.saveAs) {
    const originalSaveAs = window.saveAs;
    window.saveAs = function(blob, filename, opts) {
      if (window.blockAllDownloads || downloadCancelled) {
        console.log('[CancelDownload] Download via saveAs blocked:', filename);
        return false;
      }
      return originalSaveAs(blob, filename, opts);
    };
  }
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCancelation);
  } else {
    // If DOM is already loaded, initialize immediately
    initCancelation();
  }
  
  // CRITICAL: Immediately expose cancellation function
  window.cancelActiveDownload = cancelDownload;
  window.blockAllDownloads = false;
})(); 