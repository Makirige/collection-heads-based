/**
 * Helper utility functions
 */

/**
 * Convert race ID to a user-friendly display name
 * @param {string} race - Race ID
 * @returns {string} - Formatted race name
 */
export function getRaceName(race) {
  const raceMap = {
    'human': 'Human',
    'elf': 'Elf',
    'halfelf': 'Half-Elf',
    'githyanki': 'Githyanki',
    'tiefling': 'Tiefling',
    'drow': 'Drow',
    'dwarf': 'Dwarf',
    'halfling': 'Halfling',
    'gnome': 'Gnome',
    'halforc': 'Half-Orc',
    'dragonborn': 'Dragonborn'
  };
  
  return raceMap[race] || race;
}

/**
 * Convert body type ID to a user-friendly display name
 * @param {string} bt - Body type ID
 * @returns {string} - Formatted body type name
 */
export function getBodyTypeName(bt) {
  const btMap = {
    'bt1': 'BT1 - Female',
    'bt2': 'BT2 - Male',
    'bt4': 'BT4 - Strong Male'
  };
  
  return btMap[bt] || bt;
}

/**
 * Extract filename from URL path
 * @param {string} url - URL string
 * @returns {string} - Extracted filename
 */
export function getFileNameFromUrl(url) {
  if (!url) return '';
  
  // Convert backslashes to forward slashes for consistency
  const normalizedUrl = url.replace(/\\/g, '/');
  
  // Split the URL by slash and get the last part
  const parts = normalizedUrl.split('/');
  const filename = parts[parts.length - 1];
  
  return filename;
}

/**
 * Create a debounced function that delays invoking func
 * until after wait milliseconds have elapsed
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, delay) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}

/**
 * Show status message to the user
 * @param {string} type - Message type (success, error, warning)
 * @param {string} message - Message text
 * @param {HTMLElement} statusElement - Status element (optional)
 */
export function showStatus(type, message, statusElement) {
  const status = statusElement || document.getElementById('statusMessage');
  if (!status) return;
  
  // Clear any existing status classes
  status.className = 'status';
  
  // Add the appropriate class based on type
  if (['success', 'error', 'warning'].includes(type)) {
    status.classList.add(type);
  }
  
  // Set the message text
  status.textContent = message;
  
  // Show the status
  status.style.display = 'block';
  
  // Clear after a few seconds for success messages
  if (type === 'success' || type === 'warning') {
    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  }
} 