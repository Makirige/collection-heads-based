/**
 * ModList component to render and manage mod cards
 */
import { getRaceName, getBodyTypeName } from '../utils/helpers';
import { RACE_ICONS } from '../utils/constants';

class ModList {
  /**
   * Create a new mod list
   * @param {Function} onSelectionChange - Callback when selection changes
   */
  constructor(onSelectionChange) {
    this.modListElement = document.getElementById('modList');
    this.onSelectionChange = onSelectionChange || (() => {});
    this.currentSelections = {};
  }
  
  /**
   * Render mod cards
   * @param {Array} mods - Array of mods to render
   */
  renderMods(mods) {
    // Save current selections before clearing
    this.saveCurrentSelections();
    
    // Clear the list
    this.modListElement.innerHTML = '';
    
    // Show message if no mods found
    if (mods.length === 0) {
      this.modListElement.innerHTML = `
        <p style="grid-column: 1/-1; text-align: center; padding: 2rem;">
          No presets found matching these criteria.
        </p>`;
      return;
    }
    
    // Render each mod
    mods.forEach(mod => {
      const card = document.createElement('label');
      card.className = 'mod-card';
      card.dataset.id = mod.id;
      
      // Get race name and icon
      const raceName = getRaceName(mod.race);
      const raceIcon = RACE_ICONS[mod.race] || 'images/races/150px-Race_Human.png';
      const bodyTypeName = getBodyTypeName(mod.bodyType);
      
      // Check if this mod was previously selected
      const isChecked = this.currentSelections[mod.id] ? 'checked' : '';
      
      // Add original link if it exists
      const originalLink = mod.originalLink 
        ? `<a href="${mod.originalLink}" class="original-link" target="_blank" title="View original mod" onclick="event.stopPropagation();">
            <i class="fas fa-external-link-alt"></i>
          </a>` 
        : '';
      
      card.innerHTML = `
        <input type="checkbox" value="${mod.downloadUrl}" ${isChecked} />
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
                <i class="fas fa-venus-mars"></i> ${mod.bodyType.toUpperCase()} - ${bodyTypeName}
              </div>
            </div>
            <div class="badge-link-wrapper">
              <div class="badge link-badge">
                <a href="https://bg3.wiki" target="_blank" onclick="event.stopPropagation();">
                  <i class="fas fa-info-circle"></i> More info
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add event listener for checkbox changes
      const checkbox = card.querySelector('input[type=checkbox]');
      checkbox.addEventListener('change', () => {
        this.saveCurrentSelections();
        this.onSelectionChange(this.currentSelections);
      });
      
      this.modListElement.appendChild(card);
    });
  }
  
  /**
   * Save current selections
   */
  saveCurrentSelections() {
    this.currentSelections = {};
    this.modListElement.querySelectorAll('.mod-card input[type=checkbox]:checked').forEach(checkbox => {
      const modId = checkbox.closest('.mod-card').dataset.id;
      this.currentSelections[modId] = true;
    });
  }
  
  /**
   * Apply stored selections
   * @param {Object} selections - Object with mod IDs as keys
   */
  applySelections(selections) {
    if (!selections) return;
    
    this.modListElement.querySelectorAll('.mod-card').forEach(card => {
      const modId = card.dataset.id;
      if (selections[modId]) {
        const checkbox = card.querySelector('input[type=checkbox]');
        if (checkbox) {
          checkbox.checked = true;
        }
      }
    });
    
    this.saveCurrentSelections();
    this.onSelectionChange(this.currentSelections);
  }
  
  /**
   * Select or deselect all mods
   * @param {boolean} state - Whether to select (true) or deselect (false)
   */
  selectAll(state) {
    this.modListElement.querySelectorAll(".mod-card input[type=checkbox]").forEach(checkbox => {
      checkbox.checked = state;
    });
    
    this.saveCurrentSelections();
    this.onSelectionChange(this.currentSelections);
  }
  
  /**
   * Get selected mod URLs
   * @returns {Array} Array of selected mod URLs
   */
  getSelectedUrls() {
    return [...this.modListElement.querySelectorAll('input[type=checkbox]:checked')].map(el => el.value);
  }
  
  /**
   * Get selected mod count
   * @returns {number} Number of selected mods
   */
  getSelectedCount() {
    return Object.keys(this.currentSelections).length;
  }
}

export default ModList;