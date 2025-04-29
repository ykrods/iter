import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import spawn from "./vite-plugin-spawn"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    spawn("npm", ["run", "build:sw", "--", "--watch"]),
  ],
})
