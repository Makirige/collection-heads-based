/**
 * Mod list component to manage the grid of preset cards
 */
export default class ModList {
  /**
   * Create a new mod list
   * @param {Function} onSelectionChange - Callback when selection changes
   */
  constructor(onSelectionChange) {
    this.modListElement = document.getElementById('modList');
    this.selectedMods = new Map();
    this.onSelectionChange = onSelectionChange || (() => {});
    this.allMods = [];
    this.filteredMods = [];
  }

  /**
   * Render mods to the UI
   * @param {Array} mods - Array of mod objects
   */
  renderMods(mods) {
    this.allMods = mods;
    this.filteredMods = [...mods];
    
    if (!this.modListElement) return;
    
    // Clear the list
    this.modListElement.innerHTML = '';
    
    // Add all mods
    mods.forEach(mod => {
      const card = document.createElement('div');
      card.className = 'mod-card';
      card.setAttribute('data-mod-id', mod.id);
      
      // Create a checkbox for selection
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = mod.downloadUrl;
      checkbox.checked = this.selectedMods.has(mod.id);
      
      // Add event listener to checkbox
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          this.selectedMods.set(mod.id, {
            id: mod.id,
            name: mod.name,
            downloadUrl: mod.downloadUrl,
            race: mod.race,
            bodyType: mod.bodyType,
            imagePath: mod.imagePath
          });
        } else {
          this.selectedMods.delete(mod.id);
        }
        
        // Trigger callback
        this.onSelectionChange(this.selectedMods);
      });
      
      card.appendChild(checkbox);
      
      // Create image container
      const imageContainer = document.createElement('div');
      imageContainer.className = 'image-container';
      
      // Create image
      const img = document.createElement('img');
      img.src = mod.imagePath || 'images/placeholder.jpg';
      img.alt = mod.displayName;
      img.loading = 'lazy';
      imageContainer.appendChild(img);
      
      card.appendChild(imageContainer);
      
      // Create content container
      const content = document.createElement('div');
      content.className = 'content';
      
      // Add title
      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = mod.displayName;
      content.appendChild(title);
      
      // Add badges if available
      if (mod.race || mod.bodyType) {
        const badges = document.createElement('div');
        badges.className = 'badges';
        
        if (mod.race) {
          const raceBadge = document.createElement('div');
          raceBadge.className = 'badge race-badge';
          raceBadge.textContent = mod.race;
          badges.appendChild(raceBadge);
        }
        
        if (mod.bodyType) {
          const btBadge = document.createElement('div');
          btBadge.className = 'badge body-type-code';
          btBadge.textContent = mod.bodyType.toUpperCase();
          badges.appendChild(btBadge);
        }
        
        content.appendChild(badges);
      }
      
      card.appendChild(content);
      
      // Add click event to the card body (excluding checkbox)
      card.addEventListener('click', (e) => {
        // Ignore if click was on checkbox
        if (e.target !== checkbox && e.target.parentNode !== checkbox) {
          checkbox.checked = !checkbox.checked;
          
          // Trigger change event manually
          const event = new Event('change');
          checkbox.dispatchEvent(event);
        }
      });
      
      this.modListElement.appendChild(card);
    });
    
    if (mods.length === 0) {
      this.modListElement.innerHTML = '<div class="no-results">No results found. Try adjusting your filters.</div>';
    }
  }

  /**
   * Save current selections to be restored later
   */
  saveCurrentSelections() {
    const selectedModIds = Array.from(this.selectedMods.keys());
    localStorage.setItem('selectedMods', JSON.stringify(selectedModIds));
  }

  /**
   * Apply saved selections
   * @param {Array} selections - Array of mod IDs to select
   */
  applySelections(selections) {
    this.selectedMods.clear();
    
    selections.forEach(modId => {
      const mod = this.allMods.find(m => m.id === modId);
      if (mod) {
        this.selectedMods.set(mod.id, {
          id: mod.id,
          name: mod.name,
          downloadUrl: mod.downloadUrl,
          race: mod.race,
          bodyType: mod.bodyType,
          imagePath: mod.imagePath
        });
      }
    });
    
    this.onSelectionChange(this.selectedMods);
  }

  /**
   * Select or deselect all mods
   * @param {boolean} state - True to select all, false to deselect all
   */
  selectAll(state) {
    if (state) {
      this.filteredMods.forEach(mod => {
        this.selectedMods.set(mod.id, {
          id: mod.id,
          name: mod.name,
          downloadUrl: mod.downloadUrl,
          race: mod.race,
          bodyType: mod.bodyType,
          imagePath: mod.imagePath
        });
      });
    } else {
      this.selectedMods.clear();
    }
    
    this.onSelectionChange(this.selectedMods);
    this.renderMods(this.filteredMods);
  }

  /**
   * Get URLs of all selected mods
   * @returns {Array} - Array of download URLs
   */
  getSelectedUrls() {
    return Array.from(this.selectedMods.values()).map(mod => mod.downloadUrl);
  }

  /**
   * Get count of selected mods
   * @returns {number} - Number of selected mods
   */
  getSelectedCount() {
    return this.selectedMods.size;
  }
} 