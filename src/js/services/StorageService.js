/**
 * Service to handle localStorage operations
 */
import { STORAGE_KEYS } from '../utils/constants';

class StorageService {
  /**
   * Save application state to localStorage
   * @param {string} searchQuery - Current search query
   * @param {string} raceFilter - Selected race filter
   * @param {string} btFilter - Selected body type filter
   */
  saveStateToStorage(searchQuery, raceFilter, btFilter) {
    const state = {
      searchQuery: searchQuery,
      raceFilter: raceFilter,
      btFilter: btFilter
    };
    localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
  }
  
  /**
   * Save selected mods to localStorage
   * @param {Object} selectedModIds - Object with mod IDs as keys
   */
  saveSelectedModsToStorage(selectedModIds) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_PRESETS, JSON.stringify(selectedModIds));
  }
  
  /**
   * Load application state from localStorage
   * @returns {Object|null} Saved state or null if not found
   */
  loadStateFromStorage() {
    const savedState = localStorage.getItem(STORAGE_KEYS.APP_STATE);
    return savedState ? JSON.parse(savedState) : null;
  }
  
  /**
   * Load selected mods from localStorage
   * @returns {Object|null} Selected mod IDs or null if not found
   */
  loadSelectedModsFromStorage() {
    const savedSelectedMods = localStorage.getItem(STORAGE_KEYS.SELECTED_PRESETS);
    return savedSelectedMods ? JSON.parse(savedSelectedMods) : null;
  }
  
  /**
   * Check if the user has visited the site before
   * @returns {boolean} Whether the user has visited before
   */
  hasVisitedBefore() {
    return !!localStorage.getItem(STORAGE_KEYS.VISITED_BEFORE);
  }
  
  /**
   * Mark that the user has visited the site
   */
  setVisitedBefore() {
    localStorage.setItem(STORAGE_KEYS.VISITED_BEFORE, 'true');
  }
  
  /**
   * Clear all storage
   */
  clearStorage() {
    localStorage.removeItem(STORAGE_KEYS.APP_STATE);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_PRESETS);
  }
}

export default new StorageService();