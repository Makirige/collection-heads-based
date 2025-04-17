/**
 * Helper functions for the application
 */

/**
 * Get race display name from race ID
 * @param {string} race - Race ID
 * @returns {string} Race display name
 */
export function getRaceName(race) {
  const raceMap = {
    'dragonborn': 'Dragonborn',
    'drow': 'Drow',
    'dwarf': 'Dwarf',
    'elf': 'Elf',
    'githyanki': 'Githyanki',
    'gnome': 'Gnome',
    'half-elf': 'Half-Elf',
    'halfling': 'Halfling',
    'half-orc': 'Half-Orc',
    'human': 'Human',
    'tiefling': 'Tiefling'
  };
  return raceMap[race] || race;
}

/**
 * Get body type display name from body type ID
 * @param {string} bt - Body type ID
 * @returns {string} Body type display name
 */
export function getBodyTypeName(bt) {
  const btMap = {
    'bt1': 'Female',
    'bt2': 'Male',
    'bt4': 'Male - Strong'
  };
  return btMap[bt] || bt.toUpperCase();
}

/**
 * Get filename from URL
 * @param {string} url - URL to extract filename from
 * @returns {string} Filename
 */
export function getFileNameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const nameParam = urlObj.searchParams.get('n');
    if (nameParam) {
      return decodeURIComponent(nameParam);
    }
    return decodeURIComponent(url.split("/").pop().split("?")[0]);
  } catch (e) {
    return url.split("/").pop().split("?")[0];
  }
}

/**
 * Create a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Show a status message
 * @param {string} type - Message type ('success' or 'error')
 * @param {string} message - Message text
 * @param {HTMLElement} statusElement - Status element
 */
export function showStatus(type, message, statusElement) {
  statusElement.textContent = message;
  statusElement.className = `status ${type}`;
  statusElement.style.display = 'block';
  
  setTimeout(() => {
    statusElement.style.display = 'none';
  }, 5000);
}