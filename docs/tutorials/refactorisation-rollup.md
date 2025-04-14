# Refactorisation avec Rollup et Compatibilité GitHub Pages

## Pourquoi cette refactorisation?

Le projet était devenu difficile à maintenir car tout le code JavaScript était dans un seul fichier. La structure originale:
- Un fichier HTML avec des scripts intégrés
- Pas de modularité
- Difficile à développer et à maintenir

## Comment j'ai demandé à Claude de faire ce changement

```
Utilisateur: "This has become unmaintainable. Let's install rollup and change the architecture of this project"
```

Cette simple instruction a conduit Claude à:
1. Créer une structure de dossiers appropriée (src, dist, etc.)
2. Installer Rollup et ses plugins
3. Diviser le code en modules réutilisables
4. Configurer le processus de build

## Le problème avec GitHub Pages

Après la refactorisation, j'ai remarqué un problème potentiel:

```
Utilisateur: "Don't we need it to override index.html so this still works? https://makirige.github.io/collection-heads-based/"
```

GitHub Pages a besoin que les fichiers soient à la racine du projet ou dans un dossier `/docs`, mais notre build Rollup envoyait tout dans `/dist`.

## La solution

Claude a créé:
1. Un script de déploiement (`deploy.js`) qui copie les fichiers de `/dist` vers la racine
2. Une commande `npm run deploy` pour simplifier le processus
3. Une documentation expliquant le processus

## Structure finale du projet

```
collection-heads-based/
├── src/              # Code source (JS modulaire)
├── dist/             # Fichiers générés (non versionnés)
├── public/           # Fichiers statiques
├── images/           # Images
└── docs/tutorials/   # Documentation et tutoriels
```

## Comment utiliser le projet maintenant

1. Pour développer: `npm run dev`
2. Pour construire: `npm run build`
3. Pour déployer sur GitHub Pages: `npm run deploy` (puis commit et push)

## Ce que nous avons appris

- Comment structurer un projet JavaScript avec Rollup
- Comment gérer la compatibilité avec GitHub Pages
- Comment utiliser Cursor et Claude pour refactoriser un projet rapidement