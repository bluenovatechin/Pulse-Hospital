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

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), githubPagesSpaFallback()],
  // Automatically use /Pulse-Hospital/ on GitHub Actions, and / locally or on Vercel
  base: isGitHubActions ? '/Pulse-Hospital/' : '/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})

