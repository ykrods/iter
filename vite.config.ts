import child_process from "node:child_process";
import path from "node:path";

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';


function sw() {
  let proc;

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
  ],
})
