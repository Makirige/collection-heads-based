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
  input: 'frontend_src/js/main.js',
  output: {
    file: 'dist/bundle.js',
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
    css({ output: 'dist/styles.css' }),
    
    // Copy static assets
    copy({
      targets: [
        { src: 'frontend_src/index.html', dest: 'dist' },
        { src: 'frontend_src/images/**/*', dest: 'dist/images' },
        { src: 'frontend_src/fonts/**/*', dest: 'dist/fonts' },
        { src: 'mods_feature/mods.json', dest: 'dist' }
      ]
    }),
    
    // In development, start a web server and enable live reloading
    !production && serve({
      open: true,
      contentBase: ['dist'],
      port: 8081,
    }),
    !production && livereload({ watch: 'dist' }),
    
    // If we're building for production, minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};