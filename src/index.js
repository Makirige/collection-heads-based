/**
 * Main entry point for Maki's Mugs application
 */
import Dropdown from './components/Dropdown.js';
import RaceModal from './components/RaceModal.js';
import ModList from './components/ModList.js';
import SelectionModal from './components/SelectionModal.js';
import StorageService from './services/StorageService.js';
import ModService from './services/ModService.js';
import DownloadManager from './services/DownloadManager.js';
import { debounce, showStatus } from './utils/helpers.js';

/**
 * Main application class
 */
class App {
  constructor() {
    // Services
    this.storageService = new StorageService();
    this.modService = new ModService();
    this.downloadManager = new DownloadManager();
    
    // UI Components
    this.searchInput = document.getElementById('searchInput');
    this.selectionCounter = document.getElementById('selectionCounter');
    this.generateButton = document.getElementById('generateBtn');
    this.modCountElement = document.getElementById('modCount');
    
    // Component instances
    this.modList = new ModList(this.handleSelectionChange.bind(this));
    this.selectionModal = new SelectionModal(this.modList, this.downloadManager);
    
    // Filter state
    this.searchQuery = '';
    this.raceFilter = '';
    this.bodyTypeFilter = '';
    
    // Initialize the app
    this.initializeApp();
  }

  /**
   * Initialize the application
   */
  async initializeApp() {
    try {
      // Load mods
      await this.modService.loadMods();
      
      // Initialize dropdowns
      this.raceDropdown = new Dropdown('raceDropdown', this.handleRaceChange.bind(this));
      this.btDropdown = new Dropdown('btDropdown', this.handleBodyTypeChange.bind(this));
      
      // Set up race selection modal
      this.setupRaceModal();
      
      // Update filter dropdowns with available options
      this.updateFilterDropdowns();
      
      // Load saved state
      this.loadStateFromStorage();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // First render
      this.filterMods();
      
      // Show loaded count
      this.updateModCount();
      
      // Check if first visit
      if (!this.storageService.hasVisitedBefore()) {
        this.storageService.setVisitedBefore();
        // Show race modal for first-time visitors
        this.raceModal.show();
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      showStatus('error', 'Failed to load presets. Please try refreshing the page.');
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Search input
    if (this.searchInput) {
      const debouncedFilter = debounce(() => {
        this.searchQuery = this.searchInput.value;
        this.filterMods();
        this.saveStateToStorage();
      }, 300);
      
      this.searchInput.addEventListener('input', debouncedFilter);
    }
    
    // Selection counter
    if (this.selectionCounter) {
      this.selectionCounter.addEventListener('click', () => {
        this.selectionModal.show();
      });
    }
    
    // Generate button
    if (this.generateButton) {
      this.generateButton.addEventListener('click', async () => {
        // Show the selection modal
        this.selectionModal.show();
        
        // If there's at least one selection, proceed with download
        if (this.modList.getSelectedCount() > 0) {
          this.selectionModal.progressElement.style.display = 'flex';
          this.selectionModal.generateButton.style.display = 'none';
          
          try {
            const selectedUrls = this.modList.getSelectedUrls();
            await this.downloadManager.generatePack(selectedUrls);
            
            this.selectionModal.progressElement.style.display = 'none';
            this.selectionModal.generateButton.style.display = 'flex';
          } catch (error) {
            console.error('Error generating pack:', error);
            this.selectionModal.progressElement.style.display = 'none';
            this.selectionModal.generateButton.style.display = 'flex';
          }
        }
      });
    }
    
    // Add global functions
    window.selectAll = this.selectAll.bind(this);
    window.clearStorage = this.clearStorage.bind(this);
  }

  /**
   * Handle selection change
   * @param {Map} selectedMods - Map of selected mods
   */
  handleSelectionChange(selectedMods) {
    const count = selectedMods.size;
    
    // Update counter
    const countElement = document.getElementById('selectedCount');
    if (countElement) {
      countElement.textContent = count;
    }
    
    // Toggle counter visibility
    if (this.selectionCounter) {
      if (count > 0) {
        this.selectionCounter.classList.add('show');
      } else {
        this.selectionCounter.classList.remove('show');
      }
    }
    
    // Save selections
    this.modList.saveCurrentSelections();
  }

  /**
   * Handle race dropdown change
   * @param {string} race - Selected race
   */
  handleRaceChange(race) {
    this.raceFilter = race;
    this.filterMods();
    this.saveStateToStorage();
  }

  /**
   * Handle body type dropdown change
   * @param {string} bodyType - Selected body type
   */
  handleBodyTypeChange(bodyType) {
    this.bodyTypeFilter = bodyType;
    this.filterMods();
    this.saveStateToStorage();
  }

  /**
   * Handle race selection from modal
   * @param {string} race - Selected race
   */
  handleRaceSelect(race) {
    // Set race in dropdown
    this.raceDropdown.setValue(race);
    this.raceFilter = race;
    this.filterMods();
    this.saveStateToStorage();
  }

  /**
   * Handle race modal skip
   */
  handleRaceSkip() {
    // Just close the modal without setting a race
    console.log('Race selection skipped');
  }

  /**
   * Filter mods based on current filters
   */
  filterMods() {
    const filteredMods = this.modService.filterMods(
      this.searchQuery,
      this.raceFilter,
      this.bodyTypeFilter
    );
    
    this.modList.renderMods(filteredMods);
    this.updateModCount();
  }

  /**
   * Update mod count display
   */
  updateModCount() {
    const filteredCount = this.modService.getFilteredMods().length;
    const totalCount = this.modService.getAllMods().length;
    
    if (this.modCountElement) {
      this.modCountElement.textContent = 
        `Showing ${filteredCount} of ${totalCount} presets`;
    }
  }

  /**
   * Set up race modal
   */
  setupRaceModal() {
    this.raceModal = new RaceModal(
      this.handleRaceSelect.bind(this),
      this.handleRaceSkip.bind(this)
    );
    
    const races = this.modService.getAvailableRaces();
    this.raceModal.populateRaces(races);
  }

  /**
   * Update filter dropdowns with available options
   */
  updateFilterDropdowns() {
    // Get filter counts
    const {
      races,
      bodyTypes
    } = this.modService.getFilterCounts();
    
    // Update race dropdown
    const raceOptions = [{
      id: '',
      name: 'All races',
      icon: 'images/races/150px-Race_Human.png',
      count: this.modService.getAllMods().length
    }];
    
    races.forEach((count, race) => {
      raceOptions.push({
        id: race,
        name: this.modService.capitalizeRaceName(race),
        icon: `images/races/150px-Race_${race}.png`,
        count
      });
    });
    
    this.raceDropdown.updateOptions(raceOptions);
    
    // Update body type dropdown
    const btOptions = [{
      id: '',
      name: 'All types',
      count: this.modService.getAllMods().length
    }];
    
    bodyTypes.forEach((count, bt) => {
      btOptions.push({
        id: bt,
        name: bt === 'bt1' ? 'BT1 - Female' : 
              bt === 'bt2' ? 'BT2 - Male' : 
              'BT4 - Strong Male',
        count
      });
    });
    
    this.btDropdown.updateOptions(btOptions);
  }

  /**
   * Save current state to storage
   */
  saveStateToStorage() {
    this.storageService.saveStateToStorage(
      this.searchQuery,
      this.raceFilter,
      this.bodyTypeFilter
    );
  }

  /**
   * Load state from storage
   */
  loadStateFromStorage() {
    // Load filters
    const state = this.storageService.loadStateFromStorage();
    if (state) {
      this.searchQuery = state.searchQuery || '';
      this.raceFilter = state.raceFilter || '';
      this.bodyTypeFilter = state.bodyTypeFilter || '';
      
      // Apply to UI
      if (this.searchInput) {
        this.searchInput.value = this.searchQuery;
      }
      
      if (this.raceDropdown) {
        this.raceDropdown.setValue(this.raceFilter);
      }
      
      if (this.btDropdown) {
        this.btDropdown.setValue(this.bodyTypeFilter);
      }
    }
    
    // Load selections
    const selections = this.storageService.loadSelectedModsFromStorage();
    if (selections && selections.length) {
      this.modList.applySelections(selections);
    }
  }

  /**
   * Select or deselect all mods
   * @param {boolean} state - True to select all, false to deselect all
   */
  selectAll(state) {
    this.modList.selectAll(state);
    
    // Show status
    const message = state ? 'All presets selected' : 'All presets deselected';
    showStatus('success', message);
  }

  /**
   * Clear all storage
   */
  clearStorage() {
    this.storageService.clearStorage();
    
    // Reset state
    this.searchQuery = '';
    this.raceFilter = '';
    this.bodyTypeFilter = '';
    
    // Reset UI
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    
    if (this.raceDropdown) {
      this.raceDropdown.setValue('');
    }
    
    if (this.btDropdown) {
      this.btDropdown.setValue('');
    }
    
    // Clear selections
    this.modList.selectedMods.clear();
    this.modList.onSelectionChange(this.modList.selectedMods);
    
    // Update mods display
    this.filterMods();
    
    // Show status
    showStatus('success', 'All settings and selections cleared');
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
}); 