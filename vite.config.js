import child_process from "node:child_process";
import path from "node:path";

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { copy } from "rollup-plugin-simple-copy/vite";

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

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: "$src/", replacement: path.join(__dirname, "src/") },
    ],
  },
  plugins: [
    svelte(),
    copy({
      extMap: {
        ".svg": "image/svg+xml",
      },
      targets: [
        {
          src: "node_modules/@shoelace-style/shoelace/dist/assets",
          dest: "shoelace/assets",
          filter(src) {
            const re = /.+\/(sun|moon|list|check2-circle|plus-square|x|trash|folder|arrow-clockwise)\.svg$/;
            return re.test(src);
          },
        }
      ],
    }),
    sw(),
  ],
})
