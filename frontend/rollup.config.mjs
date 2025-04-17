import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy';
import babel from '@rollup/plugin-babel';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/js/main.js',
  output: {
    file: '../dist/bundle.js', // Sortie dans dist/ à la racine
    format: 'iife',
    sourcemap: !production,
    name: 'app'
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    
    // Babel for ES6 compatibility
    babel({ 
      babelHelpers: 'bundled',
      exclude: 'node_modules/**' 
    }),
    
    // Extract CSS into separate file
    css({ output: 'styles.css' }), // Sortie dans dist/ à la racine (nom relatif)
    
    // Copy static assets
    copy({
      targets: [
        { src: 'public/index.html', dest: '../dist' }, // Depuis frontend/public/ vers dist/
        { src: 'images/**/*', dest: '../dist/images' },   // Depuis frontend/images/ vers dist/images/
        { src: 'fonts/**/*', dest: '../dist/fonts' },    // AJOUT: Depuis frontend/fonts/ vers dist/fonts/
        { src: '../backend/mods.json', dest: '../dist' } // Depuis backend/ vers dist/
      ]
    }),
    
    // In development, start a web server and enable live reloading
    !production && serve({
      open: true,
      contentBase: ['../dist'], // Servir depuis dist/ à la racine
      port: 8081,
    }),
    !production && livereload({ watch: '../dist' }), // Surveiller dist/ à la racine
    
    // If we're building for production, minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
}; 