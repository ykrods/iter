import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import spawn from "./vite-plugin-spawn"
import copy from "rollup-plugin-simple-copy/vite"

// https://vite.dev/config/
export default defineConfig({
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
      ]
    })
  ],
})
