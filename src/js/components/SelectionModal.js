/**
 * SelectionModal component for displaying and managing selected presets
 */
import { getRaceName, getBodyTypeName } from '../utils/helpers';
import { RACE_ICONS } from '../utils/constants';
import ModService from '../services/ModService';

class SelectionModal {
  /**
   * Create a new selection modal
   * @param {Object} modList - ModList component instance
   * @param {Object} downloadManager - DownloadManager instance
   */
  constructor(modList, downloadManager) {
    // Store references to required components
    this.modList = modList;
    this.downloadManager = downloadManager;
    
    // DOM elements
    this.modalElement = document.getElementById('selectionModal');
    this.closeBtn = document.getElementById('closeSelectionBtn');
    this.selectedPresetsList = document.getElementById('selectedPresetsList');
    this.modalGenerateBtn = document.getElementById('modalGenerateBtn');
    this.noSelectionsMessage = document.getElementById('noSelectionsMessage');
    
    // Initialize events
    this.setupEventListeners();
  }
  
  /**
   * Set up event listeners for the modal
   */
  setupEventListeners() {
    // Close button
    this.closeBtn.addEventListener('click', () => {
      this.hide();
    });
    
    // Click outside to close
    this.modalElement.addEventListener('click', (e) => {
      if (e.target === this.modalElement) {
        this.hide();
      }
    });
    
    // Generate button
    this.modalGenerateBtn.addEventListener('click', () => {
      const selectedUrls = this.modList.getSelectedUrls();
      this.downloadManager.generatePack(selectedUrls, true);
    });
    
    // Add an event listener for the Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modalElement.classList.contains('hidden')) {
        this.hide();
      }
    });
  }
  
  /**
   * Show the modal and populate it with selected presets
   */
  show() {
    this.populateSelectedPresets();
    this.modalElement.classList.remove('hidden');
    this.modalElement.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    
    // Focus on the download button if presets are selected
    if (Object.keys(this.modList.currentSelections).length > 0) {
      this.modalGenerateBtn.focus();
    }
  }
  
  /**
   * Hide the modal
   */
  hide() {
    this.modalElement.classList.remove('visible');
    this.modalElement.classList.add('hidden');
    document.body.style.overflow = '';
  }
  
  /**
   * Populate the modal with selected presets
   */
  populateSelectedPresets() {
    // Clear previous content
    this.selectedPresetsList.innerHTML = '';
    
    // Get selected mod IDs and convert to array of mod objects
    const selectedMods = {};
    const selections = this.modList.currentSelections;
    const allMods = ModService.getAllMods();
    
    // Find each selected mod in the full list
    Object.keys(selections).forEach(modId => {
      const modsWithId = allMods.filter(mod => mod.id === modId);
      modsWithId.forEach(mod => {
        selectedMods[mod.id + '-' + mod.name] = mod;
      });
    });
    
    const selectedModsArray = Object.values(selectedMods);
    
    // Show message if no selections
    if (selectedModsArray.length === 0) {
      this.noSelectionsMessage.style.display = 'block';
      this.modalGenerateBtn.disabled = true;
      return;
    } else {
      this.noSelectionsMessage.style.display = 'none';
      this.modalGenerateBtn.disabled = false;
    }
    
    // Create a card for each selected mod
    selectedModsArray.forEach(mod => {
      const card = document.createElement('div');
      card.className = 'mod-card';
      card.dataset.id = mod.id;
      card.dataset.name = mod.name;
      
      // Get race name and icon
      const raceName = getRaceName(mod.race);
      const raceIcon = RACE_ICONS[mod.race] || 'images/races/150px-Race_Human.png';
      const bodyTypeName = getBodyTypeName(mod.bodyType);
      
      // Get info link - use mod-specific link if available, otherwise use default
      const infoLink = mod.infoLink || 'https://bg3.wiki';
      
      // Add original link if it exists
      const originalLink = mod.originalLink 
        ? `<a href="${mod.originalLink}" class="original-link" target="_blank" title="View original mod" onclick="event.stopPropagation();">
            <i class="fas fa-external-link-alt"></i>
          </a>` 
        : '';
      
      // Format card HTML to match the main site cards
      card.innerHTML = `
        <button class="remove-mod-btn" data-id="${mod.id}" data-name="${mod.name}">
          <i class="fas fa-times"></i>
        </button>
        <div class="image-container">
          <img src="${mod.imagePath}" alt="${mod.displayName}" />
          ${originalLink}
        </div>
        <div class="content">
          <div class="title">${mod.displayName}</div>
          <div class="badges-container">
            <div class="badges">
              <div class="badge race-badge" style="background-image: url(${raceIcon}); background-size: 12px; background-repeat: no-repeat; background-position: 5px center; padding-left: 22px;">
                ${raceName}
              </div>
              <div class="badge body-type-badge">
                ${mod.bodyType.toUpperCase()} - ${bodyTypeName}
              </div>
            </div>
            <div class="badge-link-wrapper">
              <div class="badge link-badge">
                <a href="${infoLink}" target="_blank" onclick="event.stopPropagation();">
                  <i class="fas fa-info-circle"></i> More info
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add event listeners for the remove button
      const removeButton = card.querySelector('.remove-mod-btn');
      removeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.removeSelectedMod(mod.id, mod.name);
      });
      
      this.selectedPresetsList.appendChild(card);
    });
  }
  
  /**
   * Remove a selected mod from the list
   * @param {string} modId - ID of the mod to remove
   * @param {string} modName - Name of the mod to remove
   */
  removeSelectedMod(modId, modName) {
    // Find the corresponding checkbox in the main list
    const modCards = document.querySelectorAll('.mod-card');
    let found = false;
    
    modCards.forEach(card => {
      if (card.dataset.id === modId) {
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
          checkbox.checked = false;
          this.modList.saveCurrentSelections();
          this.modList.onSelectionChange(this.modList.currentSelections);
          found = true;
        }
      }
    });
    
    if (found) {
      // Refresh the selected presets list
      this.populateSelectedPresets();
    }
  }
}

export default SelectionModal; 