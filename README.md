# Collection Heads Based - Pack Creator for Baldur's Gate 3

A simple web tool to create custom head preset packs for Baldur's Gate 3.

## Description

This web application allows you to:

- Browse a collection of head presets for your characters in BG3
- Filter by race and body type
- Search by name
- Select your favorites
- Generate a ready-to-install ZIP pack

## How to Use

1. Browse the collection of available head presets
2. Use the race and body type filters to refine your search
3. Check the boxes of the heads you want to include
4. Click "Generate My Pack" to download your customized collection
5. Install the ZIP file in your BG3 mods folder

## Installing Mods

1. Download the generated pack
2. Extract the ZIP file
3. Place the extracted files in your Baldur's Gate 3 mods folder
   - Usually located at `[Your drive]:\Users\[Username]\AppData\Local\Larian Studios\Baldur's Gate 3\Mods`
4. Launch the game and activate the mods in the mod manager

## How to Add New Presets

To add new presets to the collection:

1. Add the preset image to the `images/` folder
2. Add the mod ZIP file to the `mods/` folder
3. Edit the `mods.json` file to add information about the new preset

Example entry in `mods.json`:

```json
{
  "id": "unique-id",
  "name": "Preset name",
  "displayName": "Display name",
  "race": "human",
  "bodyType": "bt1",
  "imagePath": "images/my-image.jpg",
  "downloadUrl": "mods/My_Mod.zip",
  "originalLink": "https://nexusmods.com/mod-page"
}
```

## Contributions

Contributions are welcome! Feel free to submit pull requests to add new presets or improve the interface.
