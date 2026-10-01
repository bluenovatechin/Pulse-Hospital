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
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        if (url === '/robots.txt' || url === `${base}robots.txt`.replace('//', '/')) {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`)
          return
        }
        next()
      })
    },
    transformIndexHtml(html, ctx) {
      const raw = (ctx?.originalUrl || ctx?.path || '/').split('?')[0].split('#')[0]
      const cleanBase = base.replace(/\/$/, '')
      let path = cleanBase && raw.startsWith(cleanBase) ? raw.slice(cleanBase.length) : raw
      const clean = path.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '')
      let page = 'home'
      let param = null
      if (clean && clean !== 'index') {
        const parts = clean.split('/')
        page = parts[0]
        param = parts[1] ? decodeURIComponent(parts[1]) : null
      }
      const route = { page, param }

      return html.replace('<!--seo-->', seoHead(route, base)).replaceAll('%SITE_URL%', SITE_URL)
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
