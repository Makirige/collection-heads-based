/**
 * Bootstrap Dropdown component
 * A wrapper around Bootstrap's dropdown component
 */

class BootstrapDropdown {
  /**
   * Create a new Bootstrap dropdown
   * @param {string} id - Dropdown element ID
   * @param {Function} onChange - Callback function when option is selected
   */
  constructor(id, onChange) {
    this.id = id;
    this.dropdownElement = document.getElementById(id);
    this.buttonElement = this.dropdownElement.querySelector('.dropdown-toggle');
    this.menuElement = this.dropdownElement.querySelector('.dropdown-menu');
    this.selectedTextElement = this.buttonElement.querySelector('.dropdown-text');
    this.selectedIconElement = this.buttonElement.querySelector('.dropdown-icon');
    this.onChange = onChange || (() => {});
    
    // Create Bootstrap dropdown
    this.bootstrapDropdown = new bootstrap.Dropdown(this.buttonElement);
    
    this.setupEventListeners();
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Add click event to each option
    const options = this.menuElement.querySelectorAll('.dropdown-item');
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectOption(option);
      });
    });
  }
  
  /**
   * Toggle dropdown open/closed
   */
  toggle() {
    this.bootstrapDropdown.toggle();
  }
  
  /**
   * Close dropdown
   */
  close() {
    this.bootstrapDropdown.hide();
  }
  
  /**
   * Select an option
   * @param {HTMLElement} option - Option element to select
   */
  selectOption(option) {
    const value = option.dataset.value;
    const text = option.querySelector('span').textContent;
    const icon = option.querySelector('img')?.src;
    
    // Update selected display
    this.selectedTextElement.textContent = text;
    if (icon && this.selectedIconElement) {
      this.selectedIconElement.src = icon;
      this.selectedIconElement.alt = text;
    }
    this.buttonElement.dataset.value = value;
    
    // Mark the selected option
    this.menuElement.querySelectorAll('.dropdown-item').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.value === value);
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
    const option = this.menuElement.querySelector(`.dropdown-item[data-value="${value}"]`);
    if (option) {
      this.selectOption(option);
    }
  }
  
  /**
   * Get the current value
   * @returns {string} Current value
   */
  getValue() {
    return this.buttonElement.dataset.value;
  }
  
  /**
   * Update options dynamically
   * @param {Array} options - Array of option objects with id, name, icon, and count properties
   */
  updateOptions(options) {
    // Clear existing options
    this.menuElement.innerHTML = '';
    
    // Create new options
    options.forEach(opt => {
      const option = document.createElement('a');
      option.className = 'dropdown-item';
      option.href = '#';
      option.dataset.value = opt.id;
      
      option.innerHTML = `
        <img src="${opt.icon}" alt="${opt.name}" class="dropdown-icon me-2">
        <span>${opt.name} (${opt.count})</span>
      `;
      
      option.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectOption(option);
      });
      
      this.menuElement.appendChild(option);
    });
  }
}

export default BootstrapDropdown;