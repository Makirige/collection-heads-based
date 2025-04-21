# Maki's Mugs Collection

A web application for browsing and downloading head presets for Baldur's Gate 3.

## Project Structure

The application is organized with a modular architecture for better maintainability:

```
project/
├── src/
│   ├── components/        # UI components
│   │   ├── Dropdown.js    # Dropdown menu component
│   │   ├── ModList.js     # Mod listing and selection component
│   │   ├── RaceModal.js   # Race selection modal component
│   │   └── SelectionModal.js # Selection preview component
│   ├── services/          # Business logic services
│   │   ├── DownloadManager.js # Handles download and ZIP generation
│   │   ├── ModService.js  # Handles mod data and filtering
│   │   └── StorageService.js # Handles local storage
│   ├── utils/             # Utility functions
│   │   └── helpers.js     # General helper functions
│   └── index.js           # Main application entry point
├── images/               # Image assets
│   └── races/            # Race icons
├── fonts/                # Custom fonts
├── styles.css            # Main stylesheet
├── index.html            # Main HTML page
├── notifications.js      # Notification system
├── cancelDownload.js     # Download cancellation utility
├── mods.json             # Mod data (presets)
└── bundle.js             # Compiled JavaScript bundle
```

## Features

- Browse head presets with image previews
- Filter by race, body type, and search term
- Select multiple presets to download as a pack
- Automatic ZIP file generation
- Selection preview with ability to remove items
- Download progress tracking
- Download cancellation support
- Persistent state with local storage

## Components

### UI Components

- **Dropdown**: Reusable dropdown component for filters
- **ModList**: Grid display of available presets with selection capabilities
- **RaceModal**: Popup for selecting a race with visual icons
- **SelectionModal**: Preview of selected presets before download

### Services

- **DownloadManager**: Handles fetching preset files and creating ZIP archives
- **ModService**: Manages preset data, filtering, and sorting
- **StorageService**: Handles saving and loading state from local storage

## Development

The application uses vanilla JavaScript with a component-based architecture for better organization and maintainability. The code is structured to separate concerns:

- UI components handle rendering and user interaction
- Services handle business logic and data management
- Utilities provide common helper functions

## Build Process

The source files in the `src/` directory can be built into a single bundle using a JavaScript bundler like Rollup, Webpack, or Parcel. The pre-built bundle is included as `bundle.js`.

## Usage

1. Open `index.html` in a web browser
2. Browse available presets using filters
3. Select the presets you want by clicking on them
4. Click the selection counter or "Generate my pack" button to preview selections
5. Click "Generate my pack" in the modal to download the selected presets as a ZIP file 