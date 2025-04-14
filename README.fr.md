# Collection Heads Based - Créateur de Packs pour Baldur's Gate 3

Un outil web simple pour créer des packs de préréglages de têtes personnalisés pour Baldur's Gate 3.

## Description

Cette application web vous permet de :

- Parcourir une collection de préréglages de têtes pour vos personnages dans BG3
- Filtrer par race et type de corps
- Rechercher par nom
- Sélectionner vos favoris
- Générer un pack ZIP prêt à installer

## Comment Utiliser

1. Parcourez la collection de préréglages de têtes disponibles
2. Utilisez les filtres de race et de type de corps pour affiner votre recherche
3. Cochez les cases des têtes que vous souhaitez inclure
4. Cliquez sur "Générer Mon Pack" pour télécharger votre collection personnalisée
5. Installez le fichier ZIP dans votre dossier de mods BG3

## Installation des Mods

1. Téléchargez le pack généré
2. Extrayez le fichier ZIP
3. Placez les fichiers extraits dans votre dossier de mods Baldur's Gate 3
   - Généralement situé à `[Votre disque]:\Users\[Nom d'utilisateur]\AppData\Local\Larian Studios\Baldur's Gate 3\Mods`
4. Lancez le jeu et activez les mods dans le gestionnaire de mods

## Comment Ajouter de Nouveaux Préréglages

Pour ajouter de nouveaux préréglages à la collection :

1. Ajoutez l'image du préréglage dans le dossier `images/`
2. Ajoutez le fichier ZIP du mod dans le dossier `mods/`
3. Modifiez le fichier `mods.json` pour ajouter des informations sur le nouveau préréglage

Exemple d'entrée dans `mods.json` :

```json
{
  "id": "unique-id",
  "name": "Preset name",
  "displayName": "Display name",
  "race": "human",
  "bodyType": "bt1",
  "imagePath": "images/my-image.jpg",
  "downloadUrl": "mods/My_Mod.zip"
}
```

## Contributions

Les contributions sont les bienvenues ! N'hésitez pas à soumettre des pull requests pour ajouter de nouveaux préréglages ou améliorer l'interface.