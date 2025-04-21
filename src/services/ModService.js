/**
 * Service for managing mods data
 */
export default class ModService {
  constructor() {
    this.mods = [];
    this.filteredMods = [];
    this.availableRaces = new Map();
  }

  /**
   * Load mods from data source (currently mods.json)
   * @returns {Promise<Array>} - Array of loaded mods
   */
  async loadMods() {
    try {
      // Fetch mods from JSON file
      const response = await fetch('mods.json');
      if (!response.ok) {
        throw new Error('Failed to load mods data');
      }
      
      const modsData = await response.json();
      
      // Process mods data
      this.mods = modsData.map(mod => ({
        id: mod.id || `mod-${Math.random().toString(36).substr(2, 9)}`,
        name: mod.name || 'Unnamed Preset',
        displayName: mod.displayName || mod.name || 'Unnamed Preset',
        race: mod.race || 'unknown',
        bodyType: mod.bodyType || '',
        imagePath: mod.imagePath || 'images/placeholder.jpg',
        downloadUrl: mod.downloadUrl || '#'
      }));
      
      // Identify available races
      this.identifyAvailableRaces();
      
      // Initialize filtered mods with all mods
      this.filteredMods = [...this.mods];
      
      return this.mods;
    } catch (error) {
      console.error('Error loading mods:', error);
      throw error;
    }
  }

  /**
   * Identify available races from mods data
   */
  identifyAvailableRaces() {
    this.availableRaces.clear();
    
    // Count by race
    const raceCount = new Map();
    this.mods.forEach(mod => {
      const race = mod.race || 'unknown';
      raceCount.set(race, (raceCount.get(race) || 0) + 1);
    });
    
    // Generate race options
    raceCount.forEach((count, race) => {
      if (race !== 'unknown' && count > 0) {
        this.availableRaces.set(race, {
          id: race,
          name: this.capitalizeRaceName(race),
          icon: `images/races/150px-Race_${race}.png`,
          count
        });
      }
    });
  }

  /**
   * Capitalize race name and apply special formatting
   * @param {string} raceId - Race ID
   * @returns {string} - Formatted race name
   */
  capitalizeRaceName(raceId) {
    if (!raceId) return '';
    
    // Handle special cases
    if (raceId === 'halfelf') return 'Half-Elf';
    if (raceId === 'halforc') return 'Half-Orc';
    
    // Capitalize first letter
    return raceId.charAt(0).toUpperCase() + raceId.slice(1);
  }

  /**
   * Filter mods based on search, race, and body type
   * @param {string} query - Search query
   * @param {string} race - Race filter
   * @param {string} bodyType - Body type filter
   * @returns {Array} - Filtered array of mods
   */
  filterMods(query, race, bodyType) {
    this.filteredMods = this.mods.filter(mod => {
      // Match search query
      const matchesQuery = !query || 
        mod.name.toLowerCase().includes(query.toLowerCase()) ||
        mod.displayName.toLowerCase().includes(query.toLowerCase());
      
      // Match race
      const matchesRace = !race || mod.race === race;
      
      // Match body type
      const matchesBodyType = !bodyType || mod.bodyType === bodyType;
      
      return matchesQuery && matchesRace && matchesBodyType;
    });
    
    return this.filteredMods;
  }

  /**
   * Get counts of mods by different filters
   * @returns {Object} - Object with race and body type counts
   */
  getFilterCounts() {
    const races = new Map();
    const bodyTypes = new Map();
    
    // Count by race and body type
    this.mods.forEach(mod => {
      // Count by race
      const race = mod.race || 'unknown';
      races.set(race, (races.get(race) || 0) + 1);
      
      // Count by body type
      const bt = mod.bodyType || 'unknown';
      bodyTypes.set(bt, (bodyTypes.get(bt) || 0) + 1);
    });
    
    return {
      races,
      bodyTypes
    };
  }

  /**
   * Get available races for race dropdown
   * @returns {Array} - Array of race objects
   */
  getAvailableRaces() {
    return Array.from(this.availableRaces.values());
  }

  /**
   * Get all mods
   * @returns {Array} - Array of all mods
   */
  getAllMods() {
    return this.mods;
  }

  /**
   * Get filtered mods
   * @returns {Array} - Array of filtered mods
   */
  getFilteredMods() {
    return this.filteredMods;
  }
} 