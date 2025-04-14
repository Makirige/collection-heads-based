# Maintenance Guide for Collection Heads Based

This document explains how to maintain and extend the "Collection Heads Based" project.

## Project Structure

```
collection-heads-based/
├── index.html      # Main user interface
├── mods.json       # Head preset data
├── images/         # Preview images
├── mods/           # Mod ZIP files
└── docs/           # Documentation
```

## Adding a New Preset

To add a new head preset:

1. **Add the preview image**
   - Place the image in the `images/` folder
   - Recommended format: JPG or PNG, square dimensions (ideally 300x300px)

2. **Add the mod ZIP file**
   - Place the mod file in the `mods/` folder
   - Alternatively, use an external URL

3. **Update the mods.json file**
   - Add a new entry to the JSON array with the following information:

```json
{
  "id": "unique-id",                    // Unique identifier
  "name": "search-friendly-name",       // Name used for searching (lowercase)
  "displayName": "Display Name",        // Name shown in the interface
  "race": "human",                      // Race (see list below)
  "bodyType": "bt1",                    // Body type (bt1, bt2, bt3, or bt4)
  "imagePath": "images/my-image.jpg",   // Path to the preview image
  "downloadUrl": "mods/My_Mod.zip"      // URL or path to the ZIP file
}
```

## Available Races

Accepted values for the `race` field:
- `dragonborn` - Dragonborn
- `drow` - Drow
- `duergar` - Duergar
- `dwarf` - Dwarf
- `elf` - Elf
- `githyanki` - Githyanki
- `gnome` - Gnome
- `half-elf` - Half-Elf
- `halfling` - Halfling
- `half-orc` - Half-Orc
- `human` - Human
- `tiefling` - Tiefling

## Body Types

Accepted values for the `bodyType` field:
- `bt1` - BT1 (typically feminine slim)
- `bt2` - BT2 (typically masculine slim)
- `bt3` - BT3 (typically feminine strong)
- `bt4` - BT4 (typically masculine strong)

## Technical Considerations

- External URLs must be accessible without CORS restrictions
- For external links, ensure they are stable and permanent
- Mod filenames will be automatically extracted from URLs/paths

## Interface Customization

To modify the appearance:
- CSS variables are defined in the `<style>` section of index.html
- To add new races or body types, update:
  1. The selection options in the HTML
  2. The `getRaceName()` function in the JavaScript