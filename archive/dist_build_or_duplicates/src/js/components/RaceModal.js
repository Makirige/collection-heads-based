/**
 * Race selection modal component
 */

class RaceModal {
  /**
   * Create a new race modal
   * @param {Function} onSelect - Callback when race is selected
   * @param {Function} onSkip - Callback when selection is skipped
   */
  constructor(onSelect, onSkip) {
    this.modalElement = document.getElementById('raceModal');
    this.gridElement = document.getElementById('raceGrid');
    this.confirmButton = document.getElementById('confirmRaceBtn');
    this.skipButton = document.getElementById('skipRaceBtn');
    this.selectedRace = '';
    this.onSelect = onSelect || (() => {});
    this.onSkip = onSkip || (() => {});
    
    this.setupEventListeners();
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    this.confirmButton.addEventListener('click', () => {
      if (this.selectedRace) {
        this.onSelect(this.selectedRace);
        this.hide();
      }
    });
    
    this.skipButton.addEventListener('click', () => {
      this.onSkip();
      this.hide();
    });
  }
  
  /**
   * Populate the modal with race options
   * @param {Array} races - Array of race objects with id, name, and icon properties
   */
  populateRaces(races) {
    // Clear existing options
    this.gridElement.innerHTML = '';
    
    // Add new options (excluding "All Races")
    races.filter(race => race.id !== '').forEach(race => {
      const option = document.createElement('div');
      option.className = 'race-option';
      option.dataset.race = race.id;
      
      option.innerHTML = `
        <img src="${race.icon}" alt="${race.name}" onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2220%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E${race.name.charAt(0)}%3C%2Ftext%3E%3C%2Fsvg%3E';">
        <div class="race-name">${race.name}</div>
      `;
      
      option.addEventListener('click', () => {
        // Deselect all others
        document.querySelectorAll('.race-option').forEach(el => {
          el.classList.remove('active');
        });
        
        // Select this one
        option.classList.add('active');
        this.selectedRace = race.id;
        
        // Enable the confirm button
        this.confirmButton.disabled = false;
      });
      
      this.gridElement.appendChild(option);
    });
  }
  
  /**
   * Show the modal
   */
  show() {
    this.modalElement.style.display = 'flex';
    this.selectedRace = '';
    this.confirmButton.disabled = true;
    
    // Deselect all options
    document.querySelectorAll('.race-option').forEach(el => {
      el.classList.remove('active');
    });
  }
  
  /**
   * Hide the modal
   */
  hide() {
    this.modalElement.style.display = 'none';
  }
}

export default RaceModal;