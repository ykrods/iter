import type { PluginOption } from "vite";
import type { ChildProcess } from "node:child_process";

import child_process from "node:child_process";
import path from "node:path";

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import copy from "rollup-plugin-simple-copy/vite";


function sw(): PluginOption {
  let proc: ChildProcess | null = null;

  return {
    name: "build-sw",
    apply: "serve",
    buildStart() {
      if (!proc) {
        proc = child_process.spawn("npm", ["run", "build:sw", "--", "--watch"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true
        });
      }
    },
    buildEnd() {
      if (proc) {
        proc.kill()
        proc = null;
      }
    }
  };
}


// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: "$src/", replacement: path.join(__dirname, "src/") },
    ],
  },
  plugins: [
    svelte(),
    sw(),
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
