import svelte from 'rollup-plugin-svelte';
import nodeResolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';

import importText from './rollup-plugin-import-text.js';

const production = !process.env.ROLLUP_WATCH;

export default [{
  input: 'src/main.js',
  output: {
    sourcemap: true,
    name: 'app', // export window.app
    format: 'esm',
    dir: 'public/dist',
    chunkFileNames: '[name].js'
  },
  external: [],
  plugins: [
    // make text importable as module
    importText({ extensions: ['txt', 'py', 'html']}),

    svelte({
      extensions: ['.svelte', '.svg'],
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),

    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'dist/bundle.css' }),

    // to import packages in node_modules
    nodeResolve({
      browser: true,
      dedupe: ['svelte']
    }),
  ],
  watch: {
    include: 'src/**',
    chokidar: false,
    clearScreen: false,
  },
}, {
  input: 'src/converter/worker.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'converter',
    file: 'public/dist/converter.js'
  },
  external: [],
  plugins: [
    // make text importable as module
    importText({ extensions: ['py']}),

    // to import packages in node_modules
    nodeResolve({
      browser: true,
      dedupe: ['svelte']
    }),
  ],
  watch: {
    include: 'src/converter/**',
    chokidar: false,
    clearScreen: false,
  },
}];
