const fs = require('fs-extra');
const path = require('path');

// Paths
const distDir = path.join(__dirname, 'dist');
const rootDir = __dirname;

// Liste des éléments à ne pas copier depuis dist/
const excludedItems = [
  'dist' // Éviter de copier dist/dist de manière récursive
];

// Copy files
console.log('Starting GitHub Pages deployment...');
console.log('Copying all files from dist to root...');

try {
  // Lire le contenu du répertoire dist de manière synchrone
  const dirents = fs.readdirSync(distDir, { withFileTypes: true });

  // Copier chaque élément qui n'est pas dans la liste d'exclusion
  dirents.forEach(dirent => {
    const itemName = dirent.name;
    
    // Ignorer les éléments exclus
    if (excludedItems.includes(itemName)) {
      console.log(`Skipping excluded item: ${itemName}`);
      return;
    }
    
    const srcPath = path.join(distDir, itemName);
    const destPath = path.join(rootDir, itemName);
    
    try {
      if (dirent.isDirectory()) {
        // Pour les répertoires, supprimer d'abord s'ils existent déjà
        if (fs.existsSync(destPath)) {
          fs.removeSync(destPath);
          console.log(`Removed existing directory: ${itemName}`);
        }
        
        // Copier le répertoire
        fs.copySync(srcPath, destPath);
        console.log(`Copied directory: ${itemName}`);
      } else {
        // Copier le fichier
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied file: ${itemName}`);
      }
    } catch (copyErr) {
      console.error(`Error copying ${itemName}:`, copyErr);
    }
  });
  
  console.log('Deployment completed successfully!');
} catch (err) {
  console.error('Error during deployment:', err);
}