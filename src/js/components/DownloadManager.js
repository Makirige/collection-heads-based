/**
 * DownloadManager component for generating ZIP packages
 */
import { getFileNameFromUrl, showStatus } from '../utils/helpers';

class DownloadManager {
  constructor() {
    // Main progress elements
    this.downloadProgressElement = document.getElementById('downloadProgress');
    this.progressBarElement = document.getElementById('progressBar');
    this.downloadedCountElement = document.getElementById('downloadedCount');
    this.totalCountElement = document.getElementById('totalCount');
    this.progressStatusElement = document.getElementById('progressStatus');
    this.statusMessageElement = document.getElementById('statusMessage');
    this.generateBtnElement = document.getElementById('generateBtn');
    
    // Modal progress elements
    this.modalDownloadProgressElement = document.getElementById('modalDownloadProgress');
    this.modalProgressBarElement = document.getElementById('modalProgressBar');
    this.modalDownloadedCountElement = document.getElementById('modalDownloadedCount');
    this.modalTotalCountElement = document.getElementById('modalTotalCount');
    this.modalProgressStatusElement = document.getElementById('modalProgressStatus');
    this.modalGenerateBtnElement = document.getElementById('modalGenerateBtn');
    
    this.isGenerating = false;
  }
  
  /**
   * Generate a mod pack from selected URLs
   * @param {Array} selectedUrls - Array of URLs to download and package
   * @param {boolean} fromModal - Whether the action was triggered from the modal
   * @returns {Promise<void>} Promise that resolves when pack is generated
   */
  async generatePack(selectedUrls, fromModal = false) {
    // Prevent multiple generation attempts
    if (this.isGenerating) return;
    this.isGenerating = true;
    
    if (selectedUrls.length === 0) {
      showStatus('error', 'Please select at least one preset to generate your pack.', this.statusMessageElement);
      this.isGenerating = false;
      return;
    }
    
    try {
      // Select the elements to use based on context
      const progressElement = fromModal ? this.modalDownloadProgressElement : this.downloadProgressElement;
      const progressBarElement = fromModal ? this.modalProgressBarElement : this.progressBarElement;
      const downloadedCountElement = fromModal ? this.modalDownloadedCountElement : this.downloadedCountElement;
      const totalCountElement = fromModal ? this.modalTotalCountElement : this.totalCountElement;
      const progressStatusElement = fromModal ? this.modalProgressStatusElement : this.progressStatusElement;
      const generateBtnElement = fromModal ? this.modalGenerateBtnElement : this.generateBtnElement;
      
      // Initialize progress UI
      downloadedCountElement.textContent = '0';
      totalCountElement.textContent = selectedUrls.length;
      progressBarElement.style.width = '0%';
      progressStatusElement.textContent = 'Initializing download...';
      progressElement.style.display = 'block';
      generateBtnElement.disabled = true;
      
      const zip = new JSZip();
      const folder = zip.folder("Collection_Heads_Based");
      let failedFiles = [];
      let downloadedCount = 0;
      
      for (const file of selectedUrls) {
        try {
          // Update status
          progressStatusElement.textContent = `Downloading ${getFileNameFromUrl(file)}...`;
          
          const response = await fetch(file);
          if (!response.ok) throw new Error('Failed to fetch');
          
          const blob = await response.blob();
          // Extract the name parameter from the URL if it exists
          let fileName;
          const url = new URL(file);
          const nameParam = url.searchParams.get('n');
          if (nameParam) {
            fileName = decodeURIComponent(nameParam);
          } else {
            fileName = decodeURIComponent(file.split("/").pop().split("?")[0]);
          }
          folder.file(fileName, blob);
          
          // Update counter and progress bar
          downloadedCount++;
          downloadedCountElement.textContent = downloadedCount;
          const progressPercentage = (downloadedCount / selectedUrls.length) * 100;
          progressBarElement.style.width = `${progressPercentage}%`;
        } catch (error) {
          console.error("Error fetching", file, error);
          failedFiles.push(file);
          
          // Update status for failure
          progressStatusElement.textContent = `Failed to download ${getFileNameFromUrl(file)}`;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause to show error
        }
      }
      
      // Finalize zip
      progressStatusElement.textContent = 'Finalizing your pack...';
      
      const content = await zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 5 },
        // Add progress callback for ZIP generation
        onUpdate: metadata => {
          const compressionPercent = Math.round(metadata.percent);
          progressBarElement.style.width = `${compressionPercent}%`;
        }
      });
      
      progressStatusElement.textContent = 'Download ready!';
      saveAs(content, "Collection_Heads_Based.zip");
      
      if (failedFiles.length > 0) {
        showStatus('error', `${failedFiles.length} file(s) could not be downloaded.`, this.statusMessageElement);
      } else {
        showStatus('success', 'Your pack has been generated successfully!', this.statusMessageElement);
      }
    } catch (error) {
      console.error("Error generating pack:", error);
      showStatus('error', 'An error occurred while generating the pack.', this.statusMessageElement);
    } finally {
      // Hide progress UI after a short delay
      setTimeout(() => {
        if (fromModal) {
          this.modalDownloadProgressElement.style.display = 'none';
          this.modalGenerateBtnElement.disabled = false;
        } else {
          this.downloadProgressElement.style.display = 'none';
          this.generateBtnElement.disabled = false;
        }
        this.isGenerating = false;
      }, 2000);
    }
  }
}

export default DownloadManager;