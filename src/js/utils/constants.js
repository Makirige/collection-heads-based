/**
 * Configuration values and constants
 */

// Race icons configuration
export const RACE_ICONS = {
  '': 'images/races/150px-Race_Human.png', // Default for "All Races"
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
export const BODY_TYPES = {
  '': {
    name: 'All Types',
    icon: 'images/body_types/body_type_all.png'
  },
  'bt1': {
    name: 'Female',
    icon: 'images/body_types/body_type_female.png'
  },
  'bt2': {
    name: 'Male',
    icon: 'images/body_types/body_type_male.png'
  },
  'bt4': {
    name: 'Male - Strong',
    icon: 'images/body_types/body_type_male_strong.png'
  }
};

// Race names mapping
export const RACE_NAMES = {
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
  'tiefling': 'Tiefling',
  '': 'All Races'
};

// Local Storage keys
export const STORAGE_KEYS = {
  SELECTED_PRESETS: 'selectedHeadPresets',
  APP_STATE: 'headPresetState',
  VISITED_BEFORE: 'hasVisitedBefore'
};