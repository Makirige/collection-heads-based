/**
 * Service to handle mod loading and filtering
 */
import { getRaceName, getBodyTypeName } from '../utils/helpers';

// Fallback mods data for file:// protocol usage
const FALLBACK_MODS = [
  {
    "id": "daenerys",
    "name": "daenerys",
    "displayName": "Daenerys Head Preset - JUSTFORTEST",
    "race": "human",
    "bodyType": "bt1",
    "imagePath": "images/head-a.jpg",
    "downloadUrl": "https://f.rpghq.org/zmEqUzvCM0ih.zip?n=Daenerys%20Head%20Preset%202.0.0.zip"
  },
  {
    "id": "aurora",
    "name": "aurora_elf",
    "displayName": "Aurora Head Preset - ELF",
    "race": "elf",
    "bodyType": "bt1",
    "imagePath": "images/Aurora-ELF.webp",
    "downloadUrl": "https://f.rpghq.org/ae6HiGBnKRI3.pak?n=Elf_F%20-%20Violet's%20Preset%201%20Aurora%20%5BDONE%5D.pak"
  },
  {
    "id": "aurora",
    "name": "aurora_half-elf",
    "displayName": "Aurora Head Preset - HALF-ELF",
    "race": "half-elf",
    "bodyType": "bt1",
    "imagePath": "images/Aurora-HELF.webp",
    "downloadUrl": "https://f.rpghq.org/OltCbM5oJgZa.pak?n=Helf_F%20-%20Violet's%20Preset%201%20Aurora%20%5BDONE%5D.pak"
  },
  {
    "id": "akira",
    "name": "akira-human",
    "displayName": "Akira - Head Preset - HUMAN",
    "race": "human",
    "bodyType": "bt1",
    "imagePath": "images/Akira.png",
    "downloadUrl": "https://f.rpghq.org/cDZ6IFLjonhd.pak?n=Human_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"
  },
  {
    "id": "akira",
    "name": "akira-tiefling",
    "displayName": "Akira - Head Preset - TIEFLING",
    "race": "tiefling",
    "bodyType": "bt1",
    "imagePath": "images/Akira.png",
    "downloadUrl": "https://f.rpghq.org/yU47qaW2y4nR.pak?n=Tiefling_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"
  }, 
  {
    "id": "akira",
    "name": "akira-drow",
    "displayName": "Akira - Head Preset - DROW",
    "race": "drow",
    "bodyType": "bt1",
    "imagePath": "images/Akira.png",
    "downloadUrl": "https://f.rpghq.org/jTSJty89eKG8.pak?n=Drow_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"
  },
  {
    "id": "akira",
    "name": "akira-elf",
    "displayName": "Akira - Head Preset - ELF",
    "race": "elf",
    "bodyType": "bt1",
    "imagePath": "images/Akira.png",
    "downloadUrl": "https://f.rpghq.org/j8SoFD5kJmAs.pak?n=Elf_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"
  },
  {
    "id": "akira",
    "name": "akira-half-elf",
    "displayName": "Akira - Head Preset - HELF",
    "race": "half-elf",
    "bodyType": "bt1",
    "imagePath": "images/Akira.png",
    "downloadUrl": "https://f.rpghq.org/aMU9lzKwqGYE.pak?n=Helf_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"
  }
];

class ModService {
  constructor() {
    this.mods = [];
    this.filteredMods = [];
    this.availableRaces = [];
  }
  
  /**
   * Load mods from the JSON file or fallback to embedded data
   * @returns {Promise<Array>} Array of mods
   */
  async loadMods() {
    try {
      // Try to fetch mods.json first
      try {
        const response = await fetch('mods.json');
        if (!response.ok) throw new Error('Failed to load mods data');
        
        this.mods = await response.json();
      } catch (fetchError) {
        // If fetch fails (likely due to file:// protocol), use the fallback data
        console.log("Using embedded mods data instead of fetch due to:", fetchError.message);
        this.mods = FALLBACK_MODS;
      }
      
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
          icon: `images/races/150px-Race_${this.capitalizeRaceName(raceId)}.png`,
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
   * Capitalize each part of a race name that contains hyphens
   * @param {string} raceId - Race identifier (e.g., 'half-elf')
   * @returns {string} Capitalized race name (e.g., 'Half-Elf')
   */
  capitalizeRaceName(raceId) {
    return raceId.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('-');
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