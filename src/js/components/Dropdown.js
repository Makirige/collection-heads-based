/**
 * Dropdown component
 */

class Dropdown {
  /**
   * Create a new dropdown
   * @param {string} id - Dropdown element ID
   * @param {Function} onChange - Callback function when option is selected
   */
  constructor(id, onChange) {
    this.id = id;
    this.dropdownElement = document.getElementById(id);
    this.selectedElement = this.dropdownElement.querySelector('.dropdown-selected');
    this.optionsElement = this.dropdownElement.querySelector('.dropdown-options');
    this.selectedTextElement = this.dropdownElement.querySelector('.dropdown-text');
    this.selectedIconElement = this.dropdownElement.querySelector('.dropdown-icon');
    this.onChange = onChange || (() => {});
    
    this.setupEventListeners();
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Toggle dropdown when the selected element is clicked
    this.selectedElement.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
    
    // Add click event to each option
    const options = this.optionsElement.querySelectorAll('.dropdown-option');
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectOption(option);
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      this.close();
    });
  }
  
  /**
   * Toggle dropdown open/closed
   */
  toggle() {
    // Close all other dropdowns first
    document.querySelectorAll('.dropdown-options').forEach(dropdown => {
      if (dropdown !== this.optionsElement) {
        dropdown.classList.remove('show');
      }
    });
    
    document.querySelectorAll('.dropdown-selected').forEach(selected => {
      if (selected !== this.selectedElement) {
        selected.classList.remove('active');
      }
    });
    
    // Toggle this dropdown
    this.optionsElement.classList.toggle('show');
    this.selectedElement.classList.toggle('active');
  }
  
  /**
   * Close dropdown
   */
  close() {
    this.optionsElement.classList.remove('show');
    this.selectedElement.classList.remove('active');
  }
  
  /**
   * Select an option
   * @param {HTMLElement} option - Option element to select
   */
  selectOption(option) {
    const value = option.dataset.value;
    const text = option.querySelector('span').textContent;
    let icon = option.querySelector('img')?.src;
    
    // If we're in the body type dropdown but there's no icon, use the default one
    if (this.id === 'btDropdown' && !icon) {
      const bodyTypeId = option.dataset.value;
      // Use the icon from the constants if available
      if (bodyTypeId === '') {
        icon = 'images/body_types/body_type_all.png';
      } else if (bodyTypeId === 'bt1') {
        icon = 'images/body_types/body_type_female.png';
      } else if (bodyTypeId === 'bt2') {
        icon = 'images/body_types/body_type_male.png';
      } else if (bodyTypeId === 'bt4') {
        icon = 'images/body_types/body_type_male_strong.png';
      }
    }
    
    // Update selected display
    this.selectedTextElement.textContent = text;
    this.selectedIconElement.src = icon;
    this.selectedIconElement.alt = text;
    this.selectedElement.dataset.value = value;
    
    // Mark the selected option
    this.optionsElement.querySelectorAll('.dropdown-option').forEach(opt => {
      opt.classList.toggle('selected', opt.dataset.value === value);
    });
    
    // Close the dropdown
    this.close();
    
    // Call the change handler
    this.onChange(value, text, icon);
  }
  
  /**
   * Programmatically select an option by value
   * @param {string} value - Value of the option to select
   */
  setValue(value) {
    const option = this.optionsElement.querySelector(`.dropdown-option[data-value="${value}"]`);
    if (option) {
      this.selectOption(option);
    }
  }
  
  /**
   * Get the current value
   * @returns {string} Current value
   */
  getValue() {
    return this.selectedElement.dataset.value;
  }
  
  /**
   * Update options dynamically
   * @param {Array} options - Array of option objects with id, name, icon, and count properties
   */
  updateOptions(options) {
    // Clear existing options
    this.optionsElement.innerHTML = '';
    
    // Create new options
    options.forEach(opt => {
      const option = document.createElement('div');
      option.className = 'dropdown-option';
      option.dataset.value = opt.id;
      
      // Pour le dropdown des races, inclure l'icône
      if (this.id === 'raceDropdown') {
        option.innerHTML = `
          <img src="${opt.icon}" alt="${opt.name}" class="dropdown-icon">
          <span>${opt.name} (${opt.count !== undefined ? opt.count : 0})</span>
        `;
      } else if (this.id === 'btDropdown') {
        // Pour le dropdown des types de corps, inclure l'icône si elle existe
        if (opt.icon) {
          option.innerHTML = `
            <img src="${opt.icon}" alt="${opt.name}" class="dropdown-icon">
            <span>${opt.name} (${opt.count !== undefined ? opt.count : 0})</span>
          `;
        } else {
          option.innerHTML = `
            <span>${opt.name} (${opt.count !== undefined ? opt.count : 0})</span>
          `;
        }
      } else {
        // Pour les autres dropdowns
        option.innerHTML = `
          <span>${opt.name} (${opt.count !== undefined ? opt.count : 0})</span>
        `;
      }
      
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectOption(option);
      });
      
      this.optionsElement.appendChild(option);
    });
  }
}

export default Dropdown;