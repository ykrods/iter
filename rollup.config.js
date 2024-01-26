import child_process from "node:child_process";
import path from "node:path";
import url from "node:url";

import alias from "@rollup/plugin-alias";
import copy from "rollup-plugin-simple-copy";
import css from "rollup-plugin-css-only";
import fetch from "rollup-plugin-fetch";
import importText from './rollup-plugin-import-text.js';
import nodeResolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";


const dirname = path.dirname(url.fileURLToPath(import.meta.url));

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "src/main.js",
    output: {
      sourcemap: true,
      name: "app", // export window.app
      format: "esm",
      dir: "public/_/",
      chunkFileNames: "[name].js"
    },
    external: [
    ],
    plugins: [
      alias({
        entries: {
          // Resolve `import "$src/foo.js"`
          "$src": path.resolve(dirname, "src"),
        }
      }),

      svelte({
        extensions: [".svelte"],
        compilerOptions: {
          // enable run-time checks when not in production
          dev: !production,
        },
        onwarn: (warning, handler) => {
          // FIXME: Suppress warning for shoelace components
          if (warning.code === "a11y-click-events-have-key-events") {
            return;
          }
          handler(warning);
        }
      }),

      // to import packages in node_modules
      nodeResolve({
        browser: true,
        dedupe: ["svelte"]
      }),

      // we'll extract any component CSS out into
      // a separate file - better for performance
      css({ output: "bundle.css" }),

      copy({
        targets: [
          {
            src: "src/static/public",
            dest: "public",
          },
          {
            src: "node_modules/@shoelace-style/shoelace/dist/assets",
            dest: "public/_/shoelace/assets",
            filter(src) {
              const re = /.+\/(sun|moon|list|check2-circle|plus-square|x|trash|folder|arrow-clockwise)\.svg$/;
              return re.test(src);
            }
          },
          {
            src: "node_modules/@shoelace-style/shoelace/dist/themes",
            dest: "public/_/shoelace/themes",
          },
        ]
      }),

      fetch({
        targets: [
          {
            url: "https://sourceforge.net/p/docutils/code/HEAD/tree/tags/docutils-0.20.1/docutils/writers/html5_polyglot/math.css?format=raw",
            dest: "public/math.css",
          },
        ],
      }),

      !production && serve(),
    ],
    watch: {
      include: "src/**",
      chokidar: false,
      clearScreen: false,
    },
  },
  {
    input: "src/worker/sw.js",
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'sw',
      file: 'public/sw.js'
    },
    external: [],
    plugins: [
      // make text importable as module
      // importText({ extensions: ['py']}),

      alias({
        entries: {
          // Resolve `import "$src/foo.js"`
          "$src": path.resolve(dirname, "src"),
        }
      }),

      // to import packages in node_modules
      nodeResolve({
        browser: true,
        dedupe: ['svelte']
      }),

      // make text importable as module
      importText({ extensions: ['py', "html"]}),
    ],
    watch: {
      include: 'src/**',
      chokidar: false,
      clearScreen: false,
    },
  }
];


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
