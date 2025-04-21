/**
 * Service for managing local storage
 */
export default class StorageService {
  /**
   * Storage keys
   */
  constructor() {
    this.STORAGE_KEYS = {
      STATE: 'makimugs_state',
      SELECTIONS: 'selectedMods',
      VISITED: 'hasVisitedBefore'
    };
  }

  /**
   * Save current filter state to storage
   * @param {string} searchQuery - Current search query
   * @param {string} raceFilter - Current race filter
   * @param {string} btFilter - Current body type filter
   */
  saveStateToStorage(searchQuery, raceFilter, btFilter) {
    const state = {
      searchQuery,
      raceFilter,
      bodyTypeFilter: btFilter,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(this.STORAGE_KEYS.STATE, JSON.stringify(state));
  }

  /**
   * Save selected mods to storage
   * @param {Array} selectedModIds - Array of selected mod IDs
   */
  saveSelectedModsToStorage(selectedModIds) {
    localStorage.setItem(this.STORAGE_KEYS.SELECTIONS, JSON.stringify(selectedModIds));
  }

  /**
   * Load saved state from storage
   * @returns {Object|null} - Saved state or null if not found
   */
  loadStateFromStorage() {
    const stateStr = localStorage.getItem(this.STORAGE_KEYS.STATE);
    return stateStr ? JSON.parse(stateStr) : null;
  }

  /**
   * Load selected mods from storage
   * @returns {Array} - Array of selected mod IDs
   */
  loadSelectedModsFromStorage() {
    const selectionsStr = localStorage.getItem(this.STORAGE_KEYS.SELECTIONS);
    return selectionsStr ? JSON.parse(selectionsStr) : [];
  }

  /**
   * Check if user has visited before
   * @returns {boolean} - True if visited before
   */
  hasVisitedBefore() {
    return localStorage.getItem(this.STORAGE_KEYS.VISITED) === 'true';
  }

  /**
   * Set user as having visited before
   */
  setVisitedBefore() {
    localStorage.setItem(this.STORAGE_KEYS.VISITED, 'true');
  }

  /**
   * Clear all storage
   */
  clearStorage() {
    // Keep visited flag to avoid showing welcome/race modal again
    const hasVisited = this.hasVisitedBefore();
    
    localStorage.removeItem(this.STORAGE_KEYS.STATE);
    localStorage.removeItem(this.STORAGE_KEYS.SELECTIONS);
    
    if (hasVisited) {
      this.setVisitedBefore();
    }
  }
} 