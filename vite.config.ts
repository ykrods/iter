import path from "node:path"
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import copy from "rollup-plugin-simple-copy/vite"

import spawn from "./vite-plugin-spawn"

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: "$src/", replacement: path.join(__dirname, "src/") },
    ],
  },
  plugins: [
    svelte(),
    spawn("npm", ["run", "build:sw", "--", "--watch"]),
    copy({
      extMap: {
        ".svg": "image/svg+xml",
        ".html": "text/html", // for pyodide console.html
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".json": "application/json",
        ".zip": "application/zip",
        ".wasm": "application/wasm",
      },
      targets: [
        {
          src: "node_modules/pyodide",
          dest: "_/static/pyodide",
        },
        {
          src: "node_modules/@shoelace-style/shoelace/dist/assets",
          dest: "shoelace/assets",
          filter(src) {
            const re = /.+\/(sun|moon|list|check2-circle|plus-square|x|trash|folder|arrow-clockwise|pencil|layout-split|code-square)\.svg$/;
            return re.test(src);
          },
        }
      ]
    })
  ],
})
