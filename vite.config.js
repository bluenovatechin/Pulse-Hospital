import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { SITE_URL, seoHead } from './src/data/seo.js'

/**
 * Fills the <head> of index.html with the home page's SEO tags. After the
 * build, scripts/prerender.mjs uses this file as the template for every page
 * (its own title, description, structured data and full HTML content).
 */
function seoHeadPlugin() {
  let base = '/'
  return {
    name: 'pulse-seo-head',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml(html) {
      return html.replace('<!--seo-->', seoHead({ page: 'home', param: null }, base)).replaceAll('%SITE_URL%', SITE_URL)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoHeadPlugin()],
  // Served from / locally or on Vercel. `npm run deploy` builds with
  // --base=/Pulse-Hospital/ for https://bluenovatechin.github.io/Pulse-Hospital/
  base: '/',
  server: {
    port: 5173,
  },
})
