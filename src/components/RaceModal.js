/**
 * Race selection modal component
 */
export default class RaceModal {
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
      this.hide();
      this.onSkip();
    });

    // Close modal if user clicks outside
    this.modalElement.addEventListener('click', (e) => {
      if (e.target === this.modalElement) {
        this.hide();
        this.onSkip();
      }
    });
  }

  /**
   * Populate the race selection grid
   * @param {Array} races - Array of race objects with id, name, and icon properties
   */
  populateRaces(races) {
    this.gridElement.innerHTML = '';
    races.forEach(race => {
      const raceElement = document.createElement('div');
      raceElement.className = 'race-option';
      raceElement.dataset.race = race.id;
      raceElement.innerHTML = `
        <img src="${race.icon}" alt="${race.name}">
        <div class="race-name">${race.name}</div>
      `;
      
      raceElement.addEventListener('click', () => {
        // Remove active class from all options
        this.gridElement.querySelectorAll('.race-option').forEach(el => {
          el.classList.remove('active');
        });
        
        // Add active class to this option
        raceElement.classList.add('active');
        
        // Enable confirm button
        this.confirmButton.disabled = false;
        
        // Store selected race
        this.selectedRace = race.id;
      });
      
      this.gridElement.appendChild(raceElement);
    });
  }

  /**
   * Show the modal
   */
  show() {
    this.modalElement.style.display = 'flex';
    this.modalElement.classList.remove('hidden');
    
    // Reset state
    this.selectedRace = '';
    this.confirmButton.disabled = true;
    this.gridElement.querySelectorAll('.race-option').forEach(el => {
      el.classList.remove('active');
    });
  }

  /**
   * Hide the modal
   */
  hide() {
    this.modalElement.classList.add('hidden');
    setTimeout(() => {
      if (this.modalElement.classList.contains('hidden')) {
        this.modalElement.style.display = 'none';
      }
    }, 300);
  }
} 