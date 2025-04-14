# Utiliser Cursor et Claude pour la Refactorisation

## Comment démarrer une refactorisation avec Claude

Pour demander à Claude de refactoriser un projet, utilisez des instructions simples et claires:

```
"This has become unmaintainable. Let's install rollup and change the architecture of this project"
```

Claude comprendra le besoin et commencera à:
1. Créer les dossiers nécessaires
2. Installer les packages requis
3. Structurer le code de manière modulaire

## Guider Claude pendant le processus

Si vous remarquez un problème potentiel, n'hésitez pas à le signaler:

```
"Don't we need it to override index.html so this still works? 
https://makirige.github.io/collection-heads-based/"
```

Claude peut adapter sa solution aux contraintes spécifiques comme la compatibilité avec GitHub Pages.

## Avantages de cette approche

- Gain de temps considérable
- Restructuration complète du code en quelques minutes
- Documentation générée automatiquement
- Solution aux problèmes techniques complexes

## Conseils pour travailler avec Claude sur Cursor

1. Commencez par une demande simple et claire
2. Posez des questions si quelque chose n'est pas clair
3. Précisez les contraintes spécifiques (comme GitHub Pages)
4. Demandez de la documentation pour comprendre les changements