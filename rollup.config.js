import child_process from 'child_process';

import svelte from "rollup-plugin-svelte";
import nodeResolve from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-css-only";
import copy from "rollup-plugin-simple-copy";
import terser from "@rollup/plugin-terser";

const production = !process.env.ROLLUP_WATCH;

export default [{
  input: "src/main.js",
  output: {
    sourcemap: true,
    name: "app", // export window.app
    format: "esm",
    dir: "public",
    chunkFileNames: "[name].js"
  },
  external: [
  ],
  plugins: [
    svelte({
      extensions: [".svelte", ".svg"],
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),

    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),

    copy({
      targets: [
        {
          src: "src/static",
          dest: "public",
        },
        {
          src: "node_modules/@shoelace-style/shoelace/dist/assets",
          dest: "public/shoelace/assets",
          filter(src) {
            const re = /.+\/(sun|moon|list|check2-circle|plus-square)\.svg$/;
            return re.test(src);
          }
        },
        {
          src: "node_modules/@shoelace-style/shoelace/dist/themes",
          dest: "public/shoelace/themes",
        },
      ]
    }),

    // to import packages in node_modules
    nodeResolve({
      browser: true,
      dedupe: ["svelte"]
    }),

    !production && serve(),
    production && terser(),
  ],
  watch: {
    include: "src/**",
    chokidar: false,
    clearScreen: false,
  },
}];

function serve() {
  let started = false;
  return {
    writeBundle() {
      if (!started) {
        started = true;

        child_process.spawn("npm", ["run", "start"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true
        });
      }
    }
  };
}
