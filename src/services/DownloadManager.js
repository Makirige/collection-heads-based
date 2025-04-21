/**
 * Service for managing downloads and ZIP generation
 */
export default class DownloadManager {
  constructor() {
    this.totalFiles = 0;
    this.downloadedFiles = 0;
    this.downloadInProgress = false;
    this.zipInstance = null;
    this.controller = null;
    
    // UI Elements
    this.progressElement = document.getElementById('downloadProgress');
    this.modalProgressElement = document.getElementById('modalDownloadProgress');
    this.progressBar = document.getElementById('progressBar');
    this.modalProgressBar = document.getElementById('modalProgressBar');
    this.progressStatus = document.getElementById('progressStatus');
    this.modalProgressStatus = document.getElementById('modalProgressStatus');
    this.downloadedCount = document.getElementById('downloadedCount');
    this.modalDownloadedCount = document.getElementById('modalDownloadedCount');
    this.totalCount = document.getElementById('totalCount');
    this.modalTotalCount = document.getElementById('modalTotalCount');
  }

  /**
   * Generate a download pack from selected URLs
   * @param {Array} selectedUrls - Array of mod download URLs
   * @returns {Promise} - Promise that resolves when pack is generated
   */
  async generatePack(selectedUrls) {
    if (!selectedUrls || selectedUrls.length === 0) {
      this.showStatus('error', 'No presets selected');
      return;
    }
    
    if (this.downloadInProgress) {
      this.showStatus('warning', 'A download is already in progress');
      return;
    }
    
    try {
      // Initialize state
      this.downloadInProgress = true;
      this.totalFiles = selectedUrls.length;
      this.downloadedFiles = 0;
      this.controller = new AbortController();
      const signal = this.controller.signal;
      
      // Initialize UI
      this.showProgress();
      this.updateProgressUI(0);
      
      // Initialize JSZip
      this.zipInstance = new JSZip();
      const dateStr = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const zipName = `Maki_Mugs_Pack_${dateStr}.zip`;
      
      // Signal download started
      if (window.startDownloadProcess) {
        window.startDownloadProcess(selectedUrls, true);
      }
      
      // Download and add files to ZIP
      for (let i = 0; i < selectedUrls.length; i++) {
        if (signal.aborted) {
          throw new Error('Download cancelled');
        }
        
        const url = selectedUrls[i];
        try {
          if (!url || url === '#') {
            this.downloadedFiles++;
            this.updateProgressUI(this.downloadedFiles / this.totalFiles);
            continue;
          }
          
          // Update status
          this.updateStatus(`Downloading file ${i + 1} of ${this.totalFiles}`);
          
          // Fetch the file
          const response = await fetch(url, { signal });
          if (!response.ok) {
            throw new Error(`Failed to download ${url}`);
          }
          
          // Get the file as blob
          const blob = await response.blob();
          
          // Extract filename from URL
          const fileName = this.getFileNameFromUrl(url);
          
          // Add to ZIP
          this.zipInstance.file(fileName, blob);
          
          // Update progress
          this.downloadedFiles++;
          this.updateProgressUI(this.downloadedFiles / this.totalFiles);
        } catch (error) {
          if (signal.aborted) {
            throw new Error('Download cancelled');
          }
          
          console.error(`Error downloading ${url}:`, error);
          
          // Continue with other downloads
          this.downloadedFiles++;
          this.updateProgressUI(this.downloadedFiles / this.totalFiles);
        }
      }
      
      // All files downloaded, generate ZIP
      this.updateStatus('Generating ZIP file...');
      
      // Generate the ZIP file
      const zipContent = await this.zipInstance.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 5 }
      }, (metadata) => {
        // Update progress for ZIP generation (from 100% to 105%)
        const zipProgress = 1 + (metadata.percent / 100) * 0.05;
        this.updateProgressUI(zipProgress);
      });
      
      // Download the ZIP
      this.updateStatus('Download ready!');
      saveAs(zipContent, zipName);
      
      // Clean up
      this.downloadInProgress = false;
      this.hideProgress();
      this.showStatus('success', 'Pack downloaded successfully!');
    } catch (error) {
      console.error('Error generating pack:', error);
      
      // Only show error if not cancelled
      if (error.message !== 'Download cancelled') {
        this.showStatus('error', 'Error generating pack. Please try again.');
      }
      
      // Clean up
      this.downloadInProgress = false;
      this.hideProgress();
    } finally {
      // Clean up resources
      this.zipInstance = null;
      this.controller = null;
    }
  }

  /**
   * Update progress UI elements
   * @param {number} progress - Progress value (0-1)
   */
  updateProgressUI(progress) {
    const percent = Math.min(Math.floor(progress * 100), 100);
    
    // Update progress bars
    if (this.progressBar) {
      this.progressBar.style.width = `${percent}%`;
    }
    
    if (this.modalProgressBar) {
      this.modalProgressBar.style.width = `${percent}%`;
    }
    
    // Update counters
    if (this.downloadedCount) {
      this.downloadedCount.textContent = this.downloadedFiles;
    }
    
    if (this.modalDownloadedCount) {
      this.modalDownloadedCount.textContent = this.downloadedFiles;
    }
    
    if (this.totalCount) {
      this.totalCount.textContent = this.totalFiles;
    }
    
    if (this.modalTotalCount) {
      this.modalTotalCount.textContent = this.totalFiles;
    }
  }

  /**
   * Update status message
   * @param {string} message - Status message
   */
  updateStatus(message) {
    if (this.progressStatus) {
      this.progressStatus.textContent = message;
    }
    
    if (this.modalProgressStatus) {
      this.modalProgressStatus.textContent = message;
    }
  }

  /**
   * Show progress UI
   */
  showProgress() {
    if (this.progressElement) {
      this.progressElement.style.display = 'flex';
    }
    
    if (this.modalProgressElement) {
      this.modalProgressElement.style.display = 'flex';
    }
  }

  /**
   * Hide progress UI
   */
  hideProgress() {
    if (this.progressElement) {
      this.progressElement.style.display = 'none';
    }
    
    if (this.modalProgressElement) {
      this.modalProgressElement.style.display = 'none';
    }
  }

  /**
   * Show status message
   * @param {string} type - Status type (success, error, warning)
   * @param {string} message - Status message
   */
  showStatus(type, message) {
    const statusElement = document.getElementById('statusMessage');
    if (!statusElement) return;
    
    // Clear any existing status classes
    statusElement.className = 'status';
    
    // Add the appropriate class based on type
    if (['success', 'error', 'warning'].includes(type)) {
      statusElement.classList.add(type);
    }
    
    // Set the message text
    statusElement.textContent = message;
    
    // Show the status
    statusElement.style.display = 'block';
    
    // Clear after a few seconds for success and warning messages
    if (type === 'success' || type === 'warning') {
      setTimeout(() => {
        statusElement.style.display = 'none';
      }, 3000);
    }
  }

  /**
   * Extract filename from URL
   * @param {string} url - URL to extract filename from
   * @returns {string} - Extracted filename or generated name
   */
  getFileNameFromUrl(url) {
    if (!url) return `file_${Date.now()}.pak`;
    
    // Try to extract the filename from the URL
    try {
      // Remove query parameters
      const urlWithoutParams = url.split('?')[0];
      
      // Split by slash and get the last part
      const parts = urlWithoutParams.split('/');
      let fileName = parts[parts.length - 1];
      
      // If filename is empty or too short, generate one
      if (!fileName || fileName.length < 3) {
        fileName = `file_${Date.now()}.pak`;
      }
      
      // Ensure it has a .pak extension
      if (!fileName.endsWith('.pak')) {
        fileName += '.pak';
      }
      
      return fileName;
    } catch (error) {
      console.error('Error extracting filename:', error);
      return `file_${Date.now()}.pak`;
    }
  }

  /**
   * Cancel current download
   */
  cancelDownload() {
    if (this.controller) {
      this.controller.abort();
    }
    
    this.downloadInProgress = false;
    this.hideProgress();
  }
} 