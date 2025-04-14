# Personnalisation des Badges avec Icônes

## Introduction aux Badges d'Interface

Les badges sont des éléments d'interface utilisateur essentiels pour afficher des informations condensées comme les races, les types de corps ou d'autres attributs dans notre application. Ce tutoriel explique comment ajouter et personnaliser des icônes pour ces badges.

## Ajouter des Icônes aux Badges de Race

### Contexte

Les badges de race affichaient initialement seulement du texte:

```html
<div class="badge race-badge">
  ${raceName}
</div>
```

Pour améliorer l'expérience utilisateur, nous avons ajouté des petites icônes.

### Solution Technique

La meilleure approche consiste à utiliser des images d'arrière-plan CSS plutôt que des balises `<img>`:

```html
<div class="badge race-badge" style="background-image: url(${raceIcon}); background-size: 12px; background-repeat: no-repeat; background-position: 5px center; padding-left: 22px;">
  ${raceName}
</div>
```

### Pourquoi cette Approche?

1. **Éviter les Conflits CSS**: L'utilisation de balises `<img>` peut créer des conflits avec d'autres règles CSS ciblant les images
2. **Contrôle Précis**: Les propriétés d'arrière-plan permettent un positionnement précis
3. **Performance**: Les images d'arrière-plan sont généralement mieux optimisées pour les petites icônes

## Configuration des Icônes de Race

Les icônes de race sont définies dans le fichier `src/js/utils/constants.js`:

```javascript
// Configuration des icônes de race
export const RACE_ICONS = {
  '': 'images/races/150px-Race_Human.png', // Par défaut pour "Toutes les Races"
  'dragonborn': 'images/races/150px-Race_Dragonborn.png',
  'drow': 'images/races/150px-Race_Drow.png',
  'dwarf': 'images/races/150px-Race_Dwarf.png',
  // ...autres races
};
```

## Ajouter une Nouvelle Race

Pour ajouter une nouvelle race:

1. Ajoutez l'icône dans le dossier `images/races/`
2. Ajoutez une entrée dans `RACE_ICONS` dans `constants.js`
3. Ajoutez également une entrée dans `RACE_NAMES` pour la traduction

```javascript
export const RACE_NAMES = {
  // Races existantes...
  'nouvelle-race': 'Nom Affiché de la Race'
};
```

## Personnalisation des Styles de Badge

Si vous souhaitez personnaliser davantage les badges, modifiez le CSS dans `src/css/styles.css`:

```css
.badge {
  background-color: var(--badge-bg);
  color: var(--badge-color);
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.race-badge {
  padding-left: 0.4rem;
  display: flex;
  align-items: center;
}
```

## Conseils pour le Développement

1. **Testez sur Plusieurs Appareils**: Assurez-vous que les icônes sont visibles sur les écrans mobiles
2. **Optimisez les Images**: Utilisez des formats comme WebP pour de meilleures performances
3. **Considérez l'Accessibilité**: Assurez-vous que les badges sont compréhensibles même sans icônes

## Déploiement des Modifications

Après avoir modifié les badges ou ajouté de nouvelles icônes:

1. Testez localement avec `npm run dev`
2. Construisez avec `npm run build`
3. Déployez avec `npm run deploy` 
4. Committez et poussez les changements vers GitHub