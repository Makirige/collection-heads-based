
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

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
      this.selectedElement.addEventListener('click', e => {
        e.stopPropagation();
        this.toggle();
      });

      // Add click event to each option
      const options = this.optionsElement.querySelectorAll('.dropdown-option');
      options.forEach(option => {
        option.addEventListener('click', e => {
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
      let icon = null;

      // Récupérer l'icône seulement pour le dropdown des races
      if (this.id === 'raceDropdown') {
        icon = option.querySelector('img')?.src;
      }

      // Update selected display
      this.selectedTextElement.textContent = text;

      // Mettre à jour l'icône seulement si on est dans le dropdown des races
      if (this.id === 'raceDropdown' && this.selectedIconElement && icon) {
        this.selectedIconElement.src = icon;
        this.selectedIconElement.alt = text;
      }
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
        } else {
          // Pour les autres dropdowns, y compris body type (sans icône)
          option.innerHTML = `
          <span>${opt.name} (${opt.count !== undefined ? opt.count : 0})</span>
        `;
        }
        option.addEventListener('click', e => {
          e.stopPropagation();
          this.selectOption(option);
        });
        this.optionsElement.appendChild(option);
      });
    }
  }

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

  /**
   * Helper functions for the application
   */

  /**
   * Get race display name from race ID
   * @param {string} race - Race ID
   * @returns {string} Race display name
   */
  function getRaceName(race) {
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
  function getBodyTypeName(bt) {
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
  function getFileNameFromUrl(url) {
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
  function debounce(func, delay) {
    let timeoutId;
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
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
  function showStatus(type, message, statusElement) {
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
    statusElement.style.display = 'block';
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 5000);
  }

  /**
   * Configuration values and constants
   */

  // Race icons configuration
  const RACE_ICONS = {
    '': 'images/races/150px-Race_Human.png',
    // Default for "All Races"
    'dragonborn': 'images/races/150px-Race_Dragonborn.png',
    'drow': 'images/races/150px-Race_Drow.png',
    'dwarf': 'images/races/150px-Race_Dwarf.png',
    'elf': 'images/races/150px-Race_Elf.png',
    'githyanki': 'images/races/150px-Race_Githyanki.png',
    'gnome': 'images/races/150px-Race_Gnome.png',
    'half-elf': 'images/races/150px-Race_Half-Elf.png',
    'halfling': 'images/races/150px-Race_Halfling.png',
    'half-orc': 'images/races/150px-Race_Half-Orc.png',
    'human': 'images/races/150px-Race_Human.png',
    'tiefling': 'images/races/150px-Race_Tiefling.png'
  };

  // Body type configuration
  const BODY_TYPES = {
    '': {
      name: 'All Types',
      icon: 'images/body_types/body_type_all.png'
    },
    'bt1': {
      name: 'BT1 - Female',
      icon: 'images/body_types/body_type_female.png'
    },
    'bt2': {
      name: 'BT2 - Male',
      icon: 'images/body_types/body_type_male.png'
    },
    'bt4': {
      name: 'BT4 - Male - Strong',
      icon: 'images/body_types/body_type_male_strong.png'
    }
  };

  // Local Storage keys
  const STORAGE_KEYS = {
    SELECTED_PRESETS: 'selectedHeadPresets',
    APP_STATE: 'headPresetState',
    VISITED_BEFORE: 'hasVisitedBefore'
  };

  /**
   * ModList component to render and manage mod cards
   */
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
        const originalLink = mod.originalLink ? `<a href="${mod.originalLink}" class="original-link" target="_blank" title="View original mod" onclick="event.stopPropagation();">
            <i class="fas fa-external-link-alt"></i>
          </a>` : '';

        // Get info link - use mod-specific link if available, otherwise use default
        const infoLink = mod.infoLink || 'https://bg3.wiki';
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
                ${mod.bodyType.toUpperCase()} - ${bodyTypeName}
              </div>
            </div>
            <div class="badge-link-wrapper">
              <div class="badge link-badge">
                <a href="${infoLink}" target="_blank" onclick="event.stopPropagation();">
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

  /**
   * DownloadManager component for generating ZIP packages
   */
  class DownloadManager {
    constructor() {
      // Main progress elements
      this.downloadProgressElement = document.getElementById('downloadProgress');
      this.progressBarElement = document.getElementById('progressBar');
      this.downloadedCountElement = document.getElementById('downloadedCount');
      this.totalCountElement = document.getElementById('totalCount');
      this.progressStatusElement = document.getElementById('progressStatus');
      this.statusMessageElement = document.getElementById('statusMessage');
      this.generateBtnElement = document.getElementById('generateBtn');

      // Modal progress elements
      this.modalDownloadProgressElement = document.getElementById('modalDownloadProgress');
      this.modalProgressBarElement = document.getElementById('modalProgressBar');
      this.modalDownloadedCountElement = document.getElementById('modalDownloadedCount');
      this.modalTotalCountElement = document.getElementById('modalTotalCount');
      this.modalProgressStatusElement = document.getElementById('modalProgressStatus');
      this.modalGenerateBtnElement = document.getElementById('modalGenerateBtn');
      this.isGenerating = false;
    }

    /**
     * Generate a mod pack from selected URLs
     * @param {Array} selectedUrls - Array of URLs to download and package
     * @param {boolean} fromModal - Whether the action was triggered from the modal
     * @returns {Promise<void>} Promise that resolves when pack is generated
     */
    async generatePack(selectedUrls) {
      let fromModal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // Prevent multiple generation attempts
      if (this.isGenerating) return;
      this.isGenerating = true;
      if (selectedUrls.length === 0) {
        showStatus('error', 'Please select at least one preset to generate your pack.', this.statusMessageElement);
        this.isGenerating = false;
        return;
      }
      try {
        // Select the elements to use based on context
        const progressElement = fromModal ? this.modalDownloadProgressElement : this.downloadProgressElement;
        const progressBarElement = fromModal ? this.modalProgressBarElement : this.progressBarElement;
        const downloadedCountElement = fromModal ? this.modalDownloadedCountElement : this.downloadedCountElement;
        const totalCountElement = fromModal ? this.modalTotalCountElement : this.totalCountElement;
        const progressStatusElement = fromModal ? this.modalProgressStatusElement : this.progressStatusElement;
        const generateBtnElement = fromModal ? this.modalGenerateBtnElement : this.generateBtnElement;

        // Initialize progress UI
        downloadedCountElement.textContent = '0';
        totalCountElement.textContent = selectedUrls.length;
        progressBarElement.style.width = '0%';
        progressStatusElement.textContent = 'Initializing download...';
        progressElement.style.display = 'block';
        generateBtnElement.disabled = true;
        const zip = new JSZip();
        const folder = zip.folder("Collection_Heads_Based");
        let failedFiles = [];
        let downloadedCount = 0;
        for (const file of selectedUrls) {
          try {
            // Update status
            progressStatusElement.textContent = `Downloading ${getFileNameFromUrl(file)}...`;
            const response = await fetch(file);
            if (!response.ok) throw new Error('Failed to fetch');
            const blob = await response.blob();
            // Extract the name parameter from the URL if it exists
            let fileName;
            const url = new URL(file);
            const nameParam = url.searchParams.get('n');
            if (nameParam) {
              fileName = decodeURIComponent(nameParam);
            } else {
              fileName = decodeURIComponent(file.split("/").pop().split("?")[0]);
            }
            folder.file(fileName, blob);

            // Update counter and progress bar
            downloadedCount++;
            downloadedCountElement.textContent = downloadedCount;
            const progressPercentage = downloadedCount / selectedUrls.length * 100;
            progressBarElement.style.width = `${progressPercentage}%`;
          } catch (error) {
            console.error("Error fetching", file, error);
            failedFiles.push(file);

            // Update status for failure
            progressStatusElement.textContent = `Failed to download ${getFileNameFromUrl(file)}`;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause to show error
          }
        }

        // Finalize zip
        progressStatusElement.textContent = 'Finalizing your pack...';
        const content = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 5
          },
          // Add progress callback for ZIP generation
          onUpdate: metadata => {
            const compressionPercent = Math.round(metadata.percent);
            progressBarElement.style.width = `${compressionPercent}%`;
          }
        });
        progressStatusElement.textContent = 'Download ready!';
        saveAs(content, "Collection_Heads_Based.zip");
        if (failedFiles.length > 0) {
          showStatus('error', `${failedFiles.length} file(s) could not be downloaded.`, this.statusMessageElement);
        } else {
          showStatus('success', 'Your pack has been generated successfully!', this.statusMessageElement);
        }
      } catch (error) {
        console.error("Error generating pack:", error);
        showStatus('error', 'An error occurred while generating the pack.', this.statusMessageElement);
      } finally {
        // Hide progress UI after a short delay
        setTimeout(() => {
          if (fromModal) {
            this.modalDownloadProgressElement.style.display = 'none';
            this.modalGenerateBtnElement.disabled = false;
          } else {
            this.downloadProgressElement.style.display = 'none';
            this.generateBtnElement.disabled = false;
          }
          this.isGenerating = false;
        }, 2000);
      }
    }
  }

  /**
   * Service to handle mod loading and filtering
   */

  // Fallback mods data for file:// protocol usage
  const FALLBACK_MODS = [{
    "id": "daenerys",
    "name": "daenerys",
    "displayName": "Daenerys Head Preset - JUSTFORTEST",
    "race": "human",
    "bodyType": "bt1",
    "imagePath": "images/head-a.jpg",
    "downloadUrl": "https://f.rpghq.org/zmEqUzvCM0ih.zip?n=Daenerys%20Head%20Preset%202.0.0.zip"
  }, {
    "id": "aurora",
    "name": "aurora_elf",
    "displayName": "Aurora Head Preset - ELF",
    "race": "elf",
    "bodyType": "bt1",
    "imagePath": "images/Aurora-ELF.webp",
    "downloadUrl": "https://f.rpghq.org/ae6HiGBnKRI3.pak?n=Elf_F%20-%20Violet's%20Preset%201%20Aurora%20%5BDONE%5D.pak"
  }, {
    "id": "aurora",
    "name": "aurora_half-elf",
    "displayName": "Aurora Head Preset - HALF-ELF",
    "race": "half-elf",
    "bodyType": "bt1",
    "imagePath": "images/Aurora-HELF.webp",
    "downloadUrl": "https://f.rpghq.org/OltCbM5oJgZa.pak?n=Helf_F%20-%20Violet's%20Preset%201%20Aurora%20%5BDONE%5D.pak"
  }, {
    "id": "akira",
    "name": "akira-human",
    "displayName": "Akira - Head Preset - HUMAN",
    "race": "human",
    "bodyType": "bt1",
    "imagePath": "images/Akira.png",
    "downloadUrl": "https://f.rpghq.org/cDZ6IFLjonhd.pak?n=Human_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"
  }, {
    "id": "akira",
    "name": "akira-tiefling",
    "displayName": "Akira - Head Preset - TIEFLING",
    "race": "tiefling",
    "bodyType": "bt1",
    "imagePath": "images/Akira.png",
    "downloadUrl": "https://f.rpghq.org/yU47qaW2y4nR.pak?n=Tiefling_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"
  }, {
    "id": "akira",
    "name": "akira-drow",
    "displayName": "Akira - Head Preset - DROW",
    "race": "drow",
    "bodyType": "bt1",
    "imagePath": "images/Akira.png",
    "downloadUrl": "https://f.rpghq.org/jTSJty89eKG8.pak?n=Drow_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"
  }, {
    "id": "akira",
    "name": "akira-elf",
    "displayName": "Akira - Head Preset - ELF",
    "race": "elf",
    "bodyType": "bt1",
    "imagePath": "images/Akira.png",
    "downloadUrl": "https://f.rpghq.org/j8SoFD5kJmAs.pak?n=Elf_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"
  }, {
    "id": "akira",
    "name": "akira-half-elf",
    "displayName": "Akira - Head Preset - HELF",
    "race": "half-elf",
    "bodyType": "bt1",
    "imagePath": "images/Akira.png",
    "downloadUrl": "https://f.rpghq.org/aMU9lzKwqGYE.pak?n=Helf_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"
  }];
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
      return raceId.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-');
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
      return {
        raceCounts,
        btCounts
      };
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
  var ModService$1 = new ModService();

  /**
   * SelectionModal component for displaying and managing selected presets
   */
  class SelectionModal {
    /**
     * Create a new selection modal
     * @param {Object} modList - ModList component instance
     * @param {Object} downloadManager - DownloadManager instance
     */
    constructor(modList, downloadManager) {
      // Store references to required components
      this.modList = modList;
      this.downloadManager = downloadManager;

      // DOM elements
      this.modalElement = document.getElementById('selectionModal');
      this.closeBtn = document.getElementById('closeSelectionBtn');
      this.selectedPresetsList = document.getElementById('selectedPresetsList');
      this.modalGenerateBtn = document.getElementById('modalGenerateBtn');
      this.noSelectionsMessage = document.getElementById('noSelectionsMessage');

      // Initialize events
      this.setupEventListeners();
    }

    /**
     * Set up event listeners for the modal
     */
    setupEventListeners() {
      // Close button
      this.closeBtn.addEventListener('click', () => {
        this.hide();
      });

      // Click outside to close
      this.modalElement.addEventListener('click', e => {
        if (e.target === this.modalElement) {
          this.hide();
        }
      });

      // Generate button
      this.modalGenerateBtn.addEventListener('click', () => {
        const selectedUrls = this.modList.getSelectedUrls();
        this.downloadManager.generatePack(selectedUrls, true);
      });

      // Ajouter un écouteur d'événement pour la touche Escape
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !this.modalElement.classList.contains('hidden')) {
          this.hide();
        }
      });
    }

    /**
     * Show the modal and populate it with selected presets
     */
    show() {
      this.populateSelectedPresets();
      this.modalElement.classList.remove('hidden');
      this.modalElement.classList.add('visible');
      document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal

      // Mettre le focus sur le bouton de téléchargement si des préréglages sont sélectionnés
      if (Object.keys(this.modList.currentSelections).length > 0) {
        this.modalGenerateBtn.focus();
      }
    }

    /**
     * Hide the modal
     */
    hide() {
      this.modalElement.classList.remove('visible');
      this.modalElement.classList.add('hidden');
      document.body.style.overflow = '';
    }

    /**
     * Populate the modal with selected presets
     */
    populateSelectedPresets() {
      // Clear previous content
      this.selectedPresetsList.innerHTML = '';

      // Get selected mod IDs and convert to array of mod objects
      const selectedMods = {};
      const selections = this.modList.currentSelections;
      const allMods = ModService$1.getAllMods();

      // Find each selected mod in the full list
      Object.keys(selections).forEach(modId => {
        const modsWithId = allMods.filter(mod => mod.id === modId);
        modsWithId.forEach(mod => {
          selectedMods[mod.id + '-' + mod.name] = mod;
        });
      });
      const selectedModsArray = Object.values(selectedMods);

      // Show message if no selections
      if (selectedModsArray.length === 0) {
        this.noSelectionsMessage.style.display = 'block';
        this.modalGenerateBtn.disabled = true;
        return;
      } else {
        this.noSelectionsMessage.style.display = 'none';
        this.modalGenerateBtn.disabled = false;
      }

      // Create a card for each selected mod
      selectedModsArray.forEach(mod => {
        const card = document.createElement('div');
        card.className = 'mod-card';
        card.dataset.id = mod.id;
        card.dataset.name = mod.name;

        // Get race name and icon
        const raceName = getRaceName(mod.race);
        const raceIcon = RACE_ICONS[mod.race] || 'images/races/150px-Race_Human.png';
        const bodyTypeName = getBodyTypeName(mod.bodyType);

        // Get info link - use mod-specific link if available, otherwise use default
        const infoLink = mod.infoLink || 'https://bg3.wiki';

        // Add original link if it exists
        const originalLink = mod.originalLink ? `<a href="${mod.originalLink}" class="original-link" target="_blank" title="View original mod" onclick="event.stopPropagation();">
            <i class="fas fa-external-link-alt"></i>
          </a>` : '';

        // Format card HTML to match the main site cards
        card.innerHTML = `
        <button class="remove-mod-btn" data-id="${mod.id}" data-name="${mod.name}">
          <i class="fas fa-times"></i>
        </button>
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
                ${mod.bodyType.toUpperCase()} - ${bodyTypeName}
              </div>
            </div>
            <div class="badge-link-wrapper">
              <div class="badge link-badge">
                <a href="${infoLink}" target="_blank" onclick="event.stopPropagation();">
                  <i class="fas fa-info-circle"></i> More info
                </a>
              </div>
            </div>
          </div>
        </div>
      `;

        // Add event listeners for the remove button
        const removeButton = card.querySelector('.remove-mod-btn');
        removeButton.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          this.removeSelectedMod(mod.id, mod.name);
        });
        this.selectedPresetsList.appendChild(card);
      });
    }

    /**
     * Remove a selected mod from the list
     * @param {string} modId - ID of the mod to remove
     * @param {string} modName - Name of the mod to remove
     */
    removeSelectedMod(modId, modName) {
      // Find the corresponding checkbox in the main list
      const modCards = document.querySelectorAll('.mod-card');
      let found = false;
      modCards.forEach(card => {
        if (card.dataset.id === modId) {
          const checkbox = card.querySelector('input[type="checkbox"]');
          if (checkbox && checkbox.checked) {
            checkbox.checked = false;
            this.modList.saveCurrentSelections();
            this.modList.onSelectionChange(this.modList.currentSelections);
            found = true;
          }
        }
      });
      if (found) {
        // Refresh the selected presets list
        this.populateSelectedPresets();
      }
    }
  }

  /**
   * Service to handle localStorage operations
   */
  class StorageService {
    /**
     * Save application state to localStorage
     * @param {string} searchQuery - Current search query
     * @param {string} raceFilter - Selected race filter
     * @param {string} btFilter - Selected body type filter
     */
    saveStateToStorage(searchQuery, raceFilter, btFilter) {
      const state = {
        searchQuery: searchQuery,
        raceFilter: raceFilter,
        btFilter: btFilter
      };
      localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
    }

    /**
     * Save selected mods to localStorage
     * @param {Object} selectedModIds - Object with mod IDs as keys
     */
    saveSelectedModsToStorage(selectedModIds) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_PRESETS, JSON.stringify(selectedModIds));
    }

    /**
     * Load application state from localStorage
     * @returns {Object|null} Saved state or null if not found
     */
    loadStateFromStorage() {
      const savedState = localStorage.getItem(STORAGE_KEYS.APP_STATE);
      return savedState ? JSON.parse(savedState) : null;
    }

    /**
     * Load selected mods from localStorage
     * @returns {Object|null} Selected mod IDs or null if not found
     */
    loadSelectedModsFromStorage() {
      const savedSelectedMods = localStorage.getItem(STORAGE_KEYS.SELECTED_PRESETS);
      return savedSelectedMods ? JSON.parse(savedSelectedMods) : null;
    }

    /**
     * Check if the user has visited the site before
     * @returns {boolean} Whether the user has visited before
     */
    hasVisitedBefore() {
      return !!localStorage.getItem(STORAGE_KEYS.VISITED_BEFORE);
    }

    /**
     * Mark that the user has visited the site
     */
    setVisitedBefore() {
      localStorage.setItem(STORAGE_KEYS.VISITED_BEFORE, 'true');
    }

    /**
     * Clear all storage
     */
    clearStorage() {
      localStorage.removeItem(STORAGE_KEYS.APP_STATE);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_PRESETS);
    }
  }
  var StorageService$1 = new StorageService();

  /**
   * Main application entry point
   */
  class App {
    constructor() {
      // DOM Elements
      this.searchInput = document.getElementById('searchInput');
      this.modCount = document.getElementById('modCount');
      this.selectionCounter = document.getElementById('selectionCounter');
      this.selectedCountElement = document.getElementById('selectedCount');
      this.statusMessage = document.getElementById('statusMessage');
      this.generateBtn = document.getElementById('generateBtn');

      // Components
      this.modList = new ModList(this.handleSelectionChange.bind(this));
      this.raceDropdown = new Dropdown('raceDropdown', this.handleRaceChange.bind(this));
      this.btDropdown = new Dropdown('btDropdown', this.handleBodyTypeChange.bind(this));
      this.raceModal = new RaceModal(this.handleRaceSelect.bind(this), this.handleRaceSkip.bind(this));
      this.downloadManager = new DownloadManager();
      window.downloadManagerInstance = this.downloadManager;
      this.selectionModal = new SelectionModal(this.modList, this.downloadManager);

      // State
      this.currentFilters = {
        search: '',
        race: '',
        bodyType: ''
      };
      this.setupEventListeners();
      this.initializeApp();
    }

    /**
     * Initialize the application
     */
    async initializeApp() {
      try {
        // Load mods
        await ModService$1.loadMods();

        // Render initial mod list
        this.modList.renderMods(ModService$1.getFilteredMods());

        // Update filter dropdowns
        this.setupRaceModal();
        this.updateFilterDropdowns();
        this.updateModCount();

        // Load saved state and selections
        this.loadStateFromStorage();

        // Show success message
        showStatus('success', `${ModService$1.getAllMods().length} head presets loaded successfully!`, this.statusMessage);

        // Check if we need to show race modal (first visit)
        if (!StorageService$1.hasVisitedBefore()) {
          this.raceModal.show();
          StorageService$1.setVisitedBefore();
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        showStatus('error', 'Error loading presets. Please refresh the page.', this.statusMessage);
      }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
      // Search input
      this.searchInput.addEventListener('input', () => {
        this.currentFilters.search = this.searchInput.value;
        this.filterMods();
        this.saveStateToStorage();
      });

      // Generate button
      this.generateBtn.addEventListener('click', debounce(() => {
        const selectedUrls = this.modList.getSelectedUrls();
        this.downloadManager.generatePack(selectedUrls, false);
      }, 1000));

      // Selection counter click (open modal)
      this.selectionCounter.addEventListener('click', () => {
        this.selectionModal.show();
      });

      // Select/Deselect All buttons
      document.querySelector('button[onclick="selectAll(true)"]').addEventListener('click', e => {
        e.preventDefault();
        this.modList.selectAll(true);
      });
      document.querySelector('button[onclick="selectAll(false)"]').addEventListener('click', e => {
        e.preventDefault();
        this.modList.selectAll(false);
      });

      // Clear Storage button
      document.querySelector('button[onclick="clearStorage()"]').addEventListener('click', e => {
        e.preventDefault();
        this.clearStorage();
      });
    }

    /**
     * Handle selection change in mod list
     * @param {Object} selectedMods - Object with selected mod IDs
     */
    handleSelectionChange(selectedMods) {
      // Update selection counter
      const selectedCount = Object.keys(selectedMods).length;
      this.selectedCountElement.textContent = selectedCount;

      // Show/hide counter based on selection
      if (selectedCount > 0) {
        this.selectionCounter.classList.add('show');
      } else {
        this.selectionCounter.classList.remove('show');
      }

      // Update mod count display
      this.updateModCount();

      // Save selections to storage
      StorageService$1.saveSelectedModsToStorage(selectedMods);
    }

    /**
     * Handle race change in dropdown
     * @param {string} race - Selected race
     */
    handleRaceChange(race) {
      this.currentFilters.race = race;
      this.filterMods();
      this.saveStateToStorage();
    }

    /**
     * Handle body type change in dropdown
     * @param {string} bodyType - Selected body type
     */
    handleBodyTypeChange(bodyType) {
      this.currentFilters.bodyType = bodyType;
      this.filterMods();
      this.saveStateToStorage();
    }

    /**
     * Handle race selection from modal
     * @param {string} race - Selected race
     */
    handleRaceSelect(race) {
      if (race) {
        ModService$1.getAvailableRaces().find(r => r.id === race);
        this.raceDropdown.setValue(race);
      }
    }

    /**
     * Handle race selection skip
     */
    handleRaceSkip() {
      // Do nothing, just close the modal
    }

    /**
     * Filter mods based on current filters
     */
    filterMods() {
      const filteredMods = ModService$1.filterMods(this.currentFilters.search, this.currentFilters.race, this.currentFilters.bodyType);
      this.modList.renderMods(filteredMods);
      this.updateModCount();

      // Restore selections after filtering
      const savedSelections = StorageService$1.loadSelectedModsFromStorage();
      if (savedSelections) {
        this.modList.applySelections(savedSelections);
      }
    }

    /**
     * Update mod count display
     */
    updateModCount() {
      const totalMods = ModService$1.getAllMods().length;
      const filteredMods = ModService$1.getFilteredMods().length;
      const selectedMods = this.modList.getSelectedCount();
      this.modCount.textContent = `Showing ${filteredMods} of ${totalMods} presets (${selectedMods} selected)`;
    }

    /**
     * Set up race modal
     */
    setupRaceModal() {
      const races = ModService$1.getAvailableRaces();
      this.raceModal.populateRaces(races);
    }

    /**
     * Update filter dropdowns with available options
     */
    updateFilterDropdowns() {
      // Update race dropdown
      const races = ModService$1.getAvailableRaces();
      this.raceDropdown.updateOptions(races);

      // Update body type dropdown
      const {
        btCounts
      } = ModService$1.getFilterCounts();
      const bodyTypeOptions = Object.keys(BODY_TYPES).map(id => {
        return {
          id: id,
          name: BODY_TYPES[id].name,
          icon: BODY_TYPES[id].icon,
          count: id === '' ? ModService$1.getAllMods().length : btCounts[id] || 0
        };
      });
      this.btDropdown.updateOptions(bodyTypeOptions);
    }

    /**
     * Save state to storage
     */
    saveStateToStorage() {
      StorageService$1.saveStateToStorage(this.currentFilters.search, this.currentFilters.race, this.currentFilters.bodyType);
    }

    /**
     * Load state from storage
     */
    loadStateFromStorage() {
      // Load filter state
      const savedState = StorageService$1.loadStateFromStorage();
      if (savedState) {
        // Set search input
        if (savedState.searchQuery) {
          this.searchInput.value = savedState.searchQuery;
          this.currentFilters.search = savedState.searchQuery;
        }

        // Set race filter
        if (savedState.raceFilter) {
          this.raceDropdown.setValue(savedState.raceFilter);
          this.currentFilters.race = savedState.raceFilter;
        }

        // Set body type filter
        if (savedState.btFilter) {
          this.btDropdown.setValue(savedState.btFilter);
          this.currentFilters.bodyType = savedState.btFilter;
        }

        // Apply filters if any exist
        if (savedState.searchQuery || savedState.raceFilter || savedState.btFilter) {
          this.filterMods();
        }
      }

      // Load selected mods
      const savedSelections = StorageService$1.loadSelectedModsFromStorage();
      if (savedSelections) {
        setTimeout(() => {
          this.modList.applySelections(savedSelections);
        }, 300);
      }
    }

    /**
     * Clear storage and reset app state
     */
    clearStorage() {
      StorageService$1.clearStorage();

      // Reset UI
      this.searchInput.value = '';
      this.currentFilters = {
        search: '',
        race: '',
        bodyType: ''
      };

      // Reset dropdowns
      this.raceDropdown.setValue('');
      this.btDropdown.setValue('');

      // Clear selections
      this.modList.selectAll(false);

      // Apply filters
      this.filterMods();
      showStatus('success', 'Preferences and selections cleared.', this.statusMessage);
    }
  }

  // Initialize app on load
  window.addEventListener('DOMContentLoaded', () => {
    const app = new App();

    // Add global event handlers
    window.selectAll = state => {
      if (app.modList) {
        app.modList.selectAll(state);
      }
    };
    window.clearStorage = () => {
      if (app) {
        app.clearStorage();
      }
    };
  });
  window.clearStorage = () => window.app.clearStorage();

})();
//# sourceMappingURL=bundle.js.map
