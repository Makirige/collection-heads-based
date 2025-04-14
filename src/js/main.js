/**
 * Main application entry point
 */
import '../css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Dropdown from './components/Dropdown';
import RaceModal from './components/RaceModal';
import ModList from './components/ModList';
import DownloadManager from './components/DownloadManager';
import ModService from './services/ModService';
import StorageService from './services/StorageService';
import { debounce, showStatus } from './utils/helpers';
import { BODY_TYPES } from './utils/constants';

class App {
  constructor() {
    // DOM Elements
    this.searchInput = document.getElementById('searchInput');
    this.modCount = document.getElementById('modCount');
    this.selectionCounter = document.getElementById('selectionCounter');
    this.selectedCountElement = document.getElementById('selectedCount');
    this.statusMessage = document.getElementById('statusMessage');
    this.generateBtn = document.getElementById('generateBtn');
    
    // Components
    this.modList = new ModList(this.handleSelectionChange.bind(this));
    this.raceDropdown = new Dropdown('raceDropdown', this.handleRaceChange.bind(this));
    this.btDropdown = new Dropdown('btDropdown', this.handleBodyTypeChange.bind(this));
    this.raceModal = new RaceModal(this.handleRaceSelect.bind(this), this.handleRaceSkip.bind(this));
    this.downloadManager = new DownloadManager();
    
    // State
    this.currentFilters = {
      search: '',
      race: '',
      bodyType: ''
    };
    
    this.setupEventListeners();
    this.initializeApp();
  }
  
  /**
   * Initialize the application
   */
  async initializeApp() {
    try {
      // Load mods
      await ModService.loadMods();
      
      // Render initial mod list
      this.modList.renderMods(ModService.getFilteredMods());
      
      // Update filter dropdowns
      this.setupRaceModal();
      this.updateFilterDropdowns();
      this.updateModCount();
      
      // Load saved state and selections
      this.loadStateFromStorage();
      
      // Show success message
      showStatus('success', `${ModService.getAllMods().length} head presets loaded successfully!`, this.statusMessage);
      
      // Check if we need to show race modal (first visit)
      if (!StorageService.hasVisitedBefore()) {
        this.raceModal.show();
        StorageService.setVisitedBefore();
      }
    } catch (error) {
      console.error("Error initializing app:", error);
      showStatus('error', 'Error loading presets. Please refresh the page.', this.statusMessage);
    }
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Search input
    this.searchInput.addEventListener('input', () => {
      this.currentFilters.search = this.searchInput.value;
      this.filterMods();
      this.saveStateToStorage();
    });
    
    // Generate button
    this.generateBtn.addEventListener('click', debounce(() => {
      const selectedUrls = this.modList.getSelectedUrls();
      this.downloadManager.generatePack(selectedUrls);
    }, 1000));
    
    // Select/Deselect All buttons
    document.querySelector('button[onclick="selectAll(true)"]').addEventListener('click', (e) => {
      e.preventDefault();
      this.modList.selectAll(true);
    });
    
    document.querySelector('button[onclick="selectAll(false)"]').addEventListener('click', (e) => {
      e.preventDefault();
      this.modList.selectAll(false);
    });
    
    // Clear Storage button
    document.querySelector('button[onclick="clearStorage()"]').addEventListener('click', (e) => {
      e.preventDefault();
      this.clearStorage();
    });
  }
  
  /**
   * Handle selection change in mod list
   * @param {Object} selectedMods - Object with selected mod IDs
   */
  handleSelectionChange(selectedMods) {
    // Update selection counter
    const selectedCount = Object.keys(selectedMods).length;
    this.selectedCountElement.textContent = selectedCount;
    
    // Show/hide counter based on selection
    if (selectedCount > 0) {
      this.selectionCounter.classList.add('show');
    } else {
      this.selectionCounter.classList.remove('show');
    }
    
    // Update mod count display
    this.updateModCount();
    
    // Save selections to storage
    StorageService.saveSelectedModsToStorage(selectedMods);
  }
  
  /**
   * Handle race change in dropdown
   * @param {string} race - Selected race
   */
  handleRaceChange(race) {
    this.currentFilters.race = race;
    this.filterMods();
    this.saveStateToStorage();
  }
  
  /**
   * Handle body type change in dropdown
   * @param {string} bodyType - Selected body type
   */
  handleBodyTypeChange(bodyType) {
    this.currentFilters.bodyType = bodyType;
    this.filterMods();
    this.saveStateToStorage();
  }
  
  /**
   * Handle race selection from modal
   * @param {string} race - Selected race
   */
  handleRaceSelect(race) {
    if (race) {
      const raceData = ModService.getAvailableRaces().find(r => r.id === race);
      this.raceDropdown.setValue(race);
    }
  }
  
  /**
   * Handle race selection skip
   */
  handleRaceSkip() {
    // Do nothing, just close the modal
  }
  
  /**
   * Filter mods based on current filters
   */
  filterMods() {
    const filteredMods = ModService.filterMods(
      this.currentFilters.search,
      this.currentFilters.race,
      this.currentFilters.bodyType
    );
    
    this.modList.renderMods(filteredMods);
    this.updateModCount();
    
    // Restore selections after filtering
    const savedSelections = StorageService.loadSelectedModsFromStorage();
    if (savedSelections) {
      this.modList.applySelections(savedSelections);
    }
  }
  
  /**
   * Update mod count display
   */
  updateModCount() {
    const totalMods = ModService.getAllMods().length;
    const filteredMods = ModService.getFilteredMods().length;
    const selectedMods = this.modList.getSelectedCount();
    
    this.modCount.textContent = `Showing ${filteredMods} of ${totalMods} presets (${selectedMods} selected)`;
  }
  
  /**
   * Set up race modal
   */
  setupRaceModal() {
    const races = ModService.getAvailableRaces();
    this.raceModal.populateRaces(races);
  }
  
  /**
   * Update filter dropdowns with available options
   */
  updateFilterDropdowns() {
    // Update race dropdown
    const races = ModService.getAvailableRaces();
    this.raceDropdown.updateOptions(races);
    
    // Update body type dropdown
    const { btCounts } = ModService.getFilterCounts();
    const bodyTypeOptions = Object.keys(BODY_TYPES).map(id => {
      return {
        id: id,
        name: BODY_TYPES[id].name,
        icon: BODY_TYPES[id].icon,
        count: id === '' ? ModService.getAllMods().length : (btCounts[id] || 0)
      };
    });
    
    this.btDropdown.updateOptions(bodyTypeOptions);
  }
  
  /**
   * Save state to storage
   */
  saveStateToStorage() {
    StorageService.saveStateToStorage(
      this.currentFilters.search,
      this.currentFilters.race,
      this.currentFilters.bodyType
    );
  }
  
  /**
   * Load state from storage
   */
  loadStateFromStorage() {
    // Load filter state
    const savedState = StorageService.loadStateFromStorage();
    if (savedState) {
      // Set search input
      if (savedState.searchQuery) {
        this.searchInput.value = savedState.searchQuery;
        this.currentFilters.search = savedState.searchQuery;
      }
      
      // Set race filter
      if (savedState.raceFilter) {
        this.raceDropdown.setValue(savedState.raceFilter);
        this.currentFilters.race = savedState.raceFilter;
      }
      
      // Set body type filter
      if (savedState.btFilter) {
        this.btDropdown.setValue(savedState.btFilter);
        this.currentFilters.bodyType = savedState.btFilter;
      }
      
      // Apply filters if any exist
      if (savedState.searchQuery || savedState.raceFilter || savedState.btFilter) {
        this.filterMods();
      }
    }
    
    // Load selected mods
    const savedSelections = StorageService.loadSelectedModsFromStorage();
    if (savedSelections) {
      setTimeout(() => {
        this.modList.applySelections(savedSelections);
      }, 300);
    }
  }
  
  /**
   * Clear storage and reset app state
   */
  clearStorage() {
    StorageService.clearStorage();
    
    // Reset UI
    this.searchInput.value = '';
    this.currentFilters = {
      search: '',
      race: '',
      bodyType: ''
    };
    
    // Reset dropdowns
    this.raceDropdown.setValue('');
    this.btDropdown.setValue('');
    
    // Reload mods view
    this.filterMods();
    this.updateFilterDropdowns();
    
    showStatus('success', 'All filters and selections have been cleared.', this.statusMessage);
  }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

// Make utilities available globally for compatibility with old HTML
window.selectAll = (state) => window.app.modList.selectAll(state);
window.clearStorage = () => window.app.clearStorage();