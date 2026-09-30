import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Plugin to duplicate index.html to 404.html so GitHub Pages routes directly on refresh
function githubPagesSpaFallback() {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      try {
        copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'))
      } catch (err) {
        // Ignored if dist doesn't exist yet
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), githubPagesSpaFallback()],
  // Served from / locally or on Vercel. `npm run deploy` builds with
  // --base=/Pulse-Hospital/ for https://bluenovatechin.github.io/Pulse-Hospital/
  base: '/',
  server: {
    port: 5173,
  },
})

