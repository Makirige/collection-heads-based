const fs = require('fs-extra');
const path = require('path');

// Paths
const distDir = path.join(__dirname, 'dist');
const rootDir = __dirname;

// Files to copy to root
const filesToCopy = [
  'index.html',
  'bundle.js',
  'styles.css',
  'mods.json'
];

// Directories to copy
const dirsToCopy = [
  'images'
];

// Copy files
console.log('Starting GitHub Pages deployment...');
console.log('Copying files from dist to root...');

// Copy individual files
filesToCopy.forEach(file => {
  const srcPath = path.join(distDir, file);
  const destPath = path.join(rootDir, file);
  
  if (fs.existsSync(srcPath)) {
    try {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${file}`);
    } catch (err) {
      console.error(`Error copying ${file}:`, err);
    }
  } else {
    console.warn(`Warning: ${file} does not exist in dist directory`);
  }
});

// Copy directories
dirsToCopy.forEach(dir => {
  const srcDir = path.join(distDir, dir);
  const destDir = path.join(rootDir, dir);
  
  if (fs.existsSync(srcDir)) {
    try {
      // Remove existing directory first to avoid merge issues
      if (fs.existsSync(destDir)) {
        fs.removeSync(destDir);
      }
      
      fs.copySync(srcDir, destDir);
      console.log(`Copied directory: ${dir}`);
    } catch (err) {
      console.error(`Error copying directory ${dir}:`, err);
    }
  } else {
    console.warn(`Warning: ${dir} directory does not exist in dist`);
  }
});

console.log('Deployment completed!');