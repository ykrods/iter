import path from "node:path";

import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: "$src/", replacement: path.join(__dirname, "src/") },
    ],
  },
  build: {
    outDir: "public",
    emptyOutDir: false,
    target: "esnext",
    lib: {
      name: "sw",
      entry: "src/worker/sw.js",
      formats: ["es"],
      fileName: () => `sw.js`,
    },
  },
});
