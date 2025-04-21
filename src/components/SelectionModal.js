/**
 * Selection modal component to manage the selection preview and download
 */
export default class SelectionModal {
  /**
   * Create a new selection modal
   * @param {ModList} modList - Reference to the ModList instance
   * @param {DownloadManager} downloadManager - Reference to the DownloadManager instance
   */
  constructor(modList, downloadManager) {
    this.modalElement = document.getElementById('selectionModal');
    this.modalContent = document.getElementById('selectedPresetsList');
    this.noSelectionsMessage = document.getElementById('noSelectionsMessage');
    this.closeButton = document.getElementById('closeSelectionBtn');
    this.generateButton = document.getElementById('modalGenerateBtn');
    this.progressElement = document.getElementById('modalDownloadProgress');
    this.cancelNotification = document.getElementById('modalCancelNotification');
    this.modList = modList;
    this.downloadManager = downloadManager;
    this.setupEventListeners();
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Close button
    this.closeButton.addEventListener('click', () => {
      this.hide();
    });

    // Click outside to close
    this.modalElement.addEventListener('click', (e) => {
      if (e.target === this.modalElement) {
        this.hide();
      }
    });

    // Generate button
    this.generateButton.addEventListener('click', async () => {
      // Show progress
      this.progressElement.style.display = 'flex';
      
      // Hide the generate button while downloading
      this.generateButton.style.display = 'none';
      
      try {
        // Get selected URLs
        const selectedUrls = this.modList.getSelectedUrls();
        
        // Call the download manager to generate the pack
        await this.downloadManager.generatePack(selectedUrls);
        
        // Hide progress
        this.progressElement.style.display = 'none';
        
        // Show generate button again
        this.generateButton.style.display = 'flex';
      } catch (error) {
        console.error('Error generating pack:', error);
        
        // Hide progress
        this.progressElement.style.display = 'none';
        
        // Show generate button again
        this.generateButton.style.display = 'flex';
      }
    });
  }

  /**
   * Show the modal
   */
  show() {
    this.modalElement.classList.remove('hidden');
    this.modalElement.style.display = 'flex';
    this.modalElement.classList.add('visible');
    
    // Reset state
    this.progressElement.style.display = 'none';
    this.generateButton.style.display = 'flex';
    
    // Hide the cancel notification if it's visible
    if (this.cancelNotification) {
      this.cancelNotification.style.display = 'none';
    }
    
    // Populate selections
    this.populateSelectedPresets();
  }

  /**
   * Hide the modal
   */
  hide() {
    this.modalElement.classList.add('hidden');
    setTimeout(() => {
      if (this.modalElement.classList.contains('hidden')) {
        this.modalElement.style.display = 'none';
      }
    }, 300);
  }

  /**
   * Populate the selected presets list
   */
  populateSelectedPresets() {
    if (!this.modalContent) return;
    
    // Clear the content
    this.modalContent.innerHTML = '';
    
    // Get selected mods
    const selectedMods = Array.from(this.modList.selectedMods.values());
    
    // Show/hide no selections message
    if (selectedMods.length === 0) {
      if (this.noSelectionsMessage) {
        this.noSelectionsMessage.style.display = 'block';
      }
      
      this.generateButton.disabled = true;
    } else {
      if (this.noSelectionsMessage) {
        this.noSelectionsMessage.style.display = 'none';
      }
      
      this.generateButton.disabled = false;
      
      // Sort by race, then by body type for better organization
      selectedMods.sort((a, b) => {
        if (a.race !== b.race) {
          return a.race.localeCompare(b.race);
        }
        return a.bodyType.localeCompare(b.bodyType);
      });
      
      // Add all selected mods
      selectedMods.forEach(mod => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.setAttribute('data-mod-id', mod.id);
        
        // Create image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'selection-image';
        
        // Create image
        const img = document.createElement('img');
        img.src = mod.imagePath || 'images/placeholder.jpg';
        img.alt = mod.name;
        img.loading = 'lazy';
        imageContainer.appendChild(img);
        
        card.appendChild(imageContainer);
        
        // Create content container
        const content = document.createElement('div');
        content.className = 'selection-content';
        
        // Add title
        const title = document.createElement('div');
        title.className = 'selection-title';
        title.textContent = mod.name;
        content.appendChild(title);
        
        // Add badges
        const badges = document.createElement('div');
        badges.className = 'selection-badges';
        
        if (mod.race) {
          const raceBadge = document.createElement('div');
          raceBadge.className = 'selection-badge';
          raceBadge.textContent = mod.race;
          badges.appendChild(raceBadge);
        }
        
        if (mod.bodyType) {
          const btBadge = document.createElement('div');
          btBadge.className = 'selection-badge';
          btBadge.textContent = mod.bodyType.toUpperCase();
          badges.appendChild(btBadge);
        }
        
        content.appendChild(badges);
        card.appendChild(content);
        
        // Add remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-selection';
        removeButton.innerHTML = '<i class="fas fa-times"></i>';
        removeButton.addEventListener('click', () => {
          this.removeSelectedMod(mod.id, mod.name);
        });
        
        card.appendChild(removeButton);
        
        this.modalContent.appendChild(card);
      });
    }
  }

  /**
   * Remove a selected mod
   * @param {string} modId - Mod ID to remove
   * @param {string} modName - Mod name for UI feedback
   */
  removeSelectedMod(modId, modName) {
    // Remove from the selection
    this.modList.selectedMods.delete(modId);
    
    // Update the main list
    this.modList.onSelectionChange(this.modList.selectedMods);
    
    // Repopulate the modal
    this.populateSelectedPresets();
    
    // Show status message
    const statusElement = document.getElementById('statusMessage');
    if (statusElement) {
      statusElement.textContent = `"${modName}" removed from selection`;
      statusElement.className = 'status warning';
      statusElement.style.display = 'block';
      
      setTimeout(() => {
        statusElement.style.display = 'none';
      }, 2000);
    }
  }
} 