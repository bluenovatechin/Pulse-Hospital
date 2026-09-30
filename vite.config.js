import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { HERO_PHOTO, SITE_URL, allRoutes, getPageMeta, hospitalJsonLd, pagePath } from './src/data/seo.js'

let base = '/'
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// Everything between <!--seo:start--> and <!--seo:end--> in index.html
function seoHead({ page, param }) {
  const { title, description } = getPageMeta(page, param)
  const url = SITE_URL + pagePath(page, param)
  // Preload the hero photo so the browser fetches it before the app's JS runs
  const n = HERO_PHOTO[page]
  const photo = (w) => `${base}photos/gallery-${n}${w ? `-${w}` : ''}.webp`
  const preload = n
    ? `
    <link rel="preload" as="image" href="${photo()}" imagesrcset="${photo(640)} 640w, ${photo(800)} 800w, ${photo()} 1100w" imagesizes="(max-width: 1023px) 100vw, 45vw" fetchpriority="high" />`
    : ''
  return `<!--seo:start-->
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />${preload}
    <!--seo:end-->`
}

const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/

/**
 * SEO for a single-page app on GitHub Pages:
 *  - fills the home page <head> (title, description, share tags, schema.org data)
 *  - after the build, writes one HTML file per page (doctors.html,
 *    facilities/icu.html, ...) with that page's own title and description, so
 *    each URL returns HTTP 200 with the right metadata before any JS runs
 *  - writes 404.html (SPA fallback, not indexed), sitemap.xml and robots.txt
 */
function seoPages() {
  let outDir = 'dist'
  return {
    name: 'pulse-seo-pages',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
      base = config.base
    },
    transformIndexHtml(html) {
      return html
        .replace('<!--seo-->', seoHead({ page: 'home', param: null }))
        .replace('<!--jsonld-->', `<script type="application/ld+json">${JSON.stringify(hospitalJsonLd())}</script>`)
        .replaceAll('%SITE_URL%', SITE_URL)
    },
    closeBundle() {
      let index
      try {
        index = readFileSync(resolve(outDir, 'index.html'), 'utf8')
      } catch {
        return // dev server or a failed build: nothing to write
      }
      const routes = allRoutes()
      for (const route of routes) {
        if (route.page === 'home') continue
        const file = resolve(outDir, `${pagePath(route.page, route.param)}.html`)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, index.replace(SEO_BLOCK, seoHead(route)))
      }

      // Unknown URLs fall back to the app, but shouldn't be indexed
      writeFileSync(
        resolve(outDir, '404.html'),
        index.replace('<meta name="robots" content="index, follow, max-image-preview:large" />', '<meta name="robots" content="noindex" />')
      )

      const today = new Date().toISOString().slice(0, 10)
      const urls = routes
        .map(({ page, param }) => `  <url><loc>${SITE_URL}${pagePath(page, param)}</loc><lastmod>${today}</lastmod></url>`)
        .join('\n')
      writeFileSync(
        resolve(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      )
      writeFileSync(resolve(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoPages()],
  // Served from / locally or on Vercel. `npm run deploy` builds with
  // --base=/Pulse-Hospital/ for https://bluenovatechin.github.io/Pulse-Hospital/
  base: '/',
  server: {
    port: 5173,
  },
})
