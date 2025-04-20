# Éditeur de Mod Heads

Application de gestion des mods de têtes pour le fichier `mods.json`.

## Fonctionnalités

- Visualisation des mods existants
- Ajout de nouveaux mods
- Modification des mods existants
- Suppression de mods
- Filtrage par ID ou par race
- Prévisualisation des images des mods
- Validation des données saisies

## Installation

1. Assurez-vous d'avoir Python 3.8 ou plus récent installé
2. Installez les dépendances :

```bash
pip install -r requirements.txt
```

## Utilisation

Lancez l'application avec la commande suivante :

```bash
cd mod_editor
python main.py
```

## Structure du projet

```
mod_editor/
├── models/              # Modèles de données
│   ├── __init__.py
│   └── data_model.py    # Gestion des données JSON
├── views/               # Interfaces utilisateur
│   ├── __init__.py
│   ├── main_window.py   # Fenêtre principale
│   └── mod_editor.py    # Formulaire d'édition
├── controllers/         # Contrôleurs
│   ├── __init__.py
│   └── mod_controller.py # Liaison modèle-vue
├── utils/               # Utilitaires
│   ├── __init__.py
│   ├── image_utils.py   # Gestion des images
│   └── validators.py    # Validation des entrées
├── __init__.py
└── main.py              # Point d'entrée principal
```

## Format des données

Chaque entrée de mod possède les champs suivants :

- `id` : Identifiant unique du mod
- `name` : Nom technique
- `displayName` : Nom d'affichage
- `race` : Type de race (human, elf, etc.)
- `bodyType` : Type de corps
- `imagePath` : Chemin vers l'image
- `downloadUrl` : URL de téléchargement