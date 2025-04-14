# Collection Heads Based - BG3

A tool for creating custom head preset packs for Baldur's Gate 3.

## Features

- Browse head presets by race and body type
- Search for specific presets
- Select multiple presets to include in your pack
- Generate a zip file with selected presets
- Compatible with BG3 mod managers

## Development

This project uses Rollup for bundling JavaScript and CSS.

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Project Structure

```
collection-heads-based/
├── src/                  # Source code
│   ├── js/               # JavaScript modules
│   │   ├── components/   # UI components
│   │   ├── services/     # Service modules
│   │   ├── utils/        # Utility functions
│   │   └── main.js       # Main entry point
│   └── css/              # CSS styles
├── public/               # Static files to copy to dist
├── docs/                 # Documentation
└── images/               # Image assets
```

For more details on the architecture, see the [architecture documentation](docs/architecture.md).

## GitHub Pages

This project is deployed to GitHub Pages at:
https://makirige.github.io/collection-heads-based/

## License

ISC