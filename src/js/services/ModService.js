/**
 * Service to handle mod loading and filtering
 */
import { getRaceName, getBodyTypeName } from '../utils/helpers';

class ModService {
  constructor() {
    this.mods = [];
    this.filteredMods = [];
    this.availableRaces = [];
  }
  
  /**
   * Load mods from the JSON file
   * @returns {Promise<Array>} Array of mods
   */
  async loadMods() {
    try {
      const response = await fetch('mods.json');
      if (!response.ok) throw new Error('Failed to load mods data');
      
      this.mods = await response.json();
      this.filteredMods = [...this.mods];
      
      // Identify available races
      this.identifyAvailableRaces();
      
      return this.mods;
    } catch (error) {
      console.error("Error loading mods:", error);
      throw error;
    }
  }
  
  /**
   * Identify available races from loaded mods
   */
  identifyAvailableRaces() {
    // Add "All Races" option by default
    this.availableRaces = [{ 
      id: '', 
      name: 'All Races', 
      icon: 'images/races/150px-Race_Human.png',
      count: this.mods.length
    }];
    
    // Count occurrences of each race
    const raceCounts = {};
    this.mods.forEach(mod => {
      if (mod.race) {
        raceCounts[mod.race] = (raceCounts[mod.race] || 0) + 1;
      }
    });
    
    // Create entries for races that have presets
    for (const raceId in raceCounts) {
      if (raceCounts[raceId] > 0) {
        this.availableRaces.push({
          id: raceId,
          name: getRaceName(raceId),
          icon: `images/races/150px-Race_${raceId.charAt(0).toUpperCase() + raceId.slice(1)}.png`,
          count: raceCounts[raceId]
        });
      }
    }
    
    // Sort races alphabetically (after "All Races")
    this.availableRaces.sort((a, b) => {
      if (a.id === '') return -1;
      if (b.id === '') return 1;
      return a.name.localeCompare(b.name);
    });
    
    return this.availableRaces;
  }
  
  /**
   * Filter mods based on search query and selected filters
   * @param {string} query - Search query
   * @param {string} race - Selected race filter
   * @param {string} bodyType - Selected body type filter
   * @returns {Array} Filtered mods
   */
  filterMods(query, race, bodyType) {
    const normalizedQuery = query.toLowerCase();
    
    this.filteredMods = this.mods.filter(mod => {
      const matchName = mod.name.toLowerCase().includes(normalizedQuery);
      const matchRace = race === "" || mod.race === race;
      const matchBT = bodyType === "" || mod.bodyType === bodyType;
      
      return matchName && matchRace && matchBT;
    });
    
    return this.filteredMods;
  }
  
  /**
   * Get counts for each filter option
   * @returns {Object} Object containing race and body type counts
   */
  getFilterCounts() {
    // Count races
    const raceCounts = {};
    this.mods.forEach(mod => {
      raceCounts[mod.race] = (raceCounts[mod.race] || 0) + 1;
    });
    
    // Count body types
    const btCounts = {};
    this.mods.forEach(mod => {
      btCounts[mod.bodyType] = (btCounts[mod.bodyType] || 0) + 1;
    });
    
    return { raceCounts, btCounts };
  }
  
  /**
   * Get available races
   * @returns {Array} Available races with counts
   */
  getAvailableRaces() {
    return this.availableRaces;
  }
  
  /**
   * Get all mods
   * @returns {Array} All mods
   */
  getAllMods() {
    return this.mods;
  }
  
  /**
   * Get filtered mods
   * @returns {Array} Filtered mods
   */
  getFilteredMods() {
    return this.filteredMods;
  }
}

export default new ModService();