// ========================================================
// Pre-render: after `vite build` (browser files) and `vite build --ssr`
// (dist-ssr/entry-server.js), write a complete HTML file for every page:
//
//   dist/index.html, dist/doctors.html, dist/doctors/dr-paras-patel.html,
//   dist/departments/chest.html, dist/facilities/icu.html, ...
//
// Each file has the page's own title, description, structured data and the
// full page content, so search engines and link previews read it without
// running JavaScript. Also writes 404.html, sitemap.xml and robots.txt.
// ========================================================
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render, allRoutes, seoHead, SEO_BLOCK, pagePath, SITE_URL, BASE } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!SEO_BLOCK.test(template) || !template.includes('<div id="root"><!--app--></div>')) {
  throw new Error('dist/index.html is missing the <!--seo:start--> block or the <!--app--> placeholder');
}

async function page(route) {
  const html = await render(BASE + pagePath(route.page, route.param));
  // data-route tells the browser which page this HTML is, so it only reuses it for that URL
  const tag = `<div id="root" data-route="${pagePath(route.page, route.param) || 'home'}">`;
  return template
    .replace(SEO_BLOCK, () => seoHead(route, BASE))
    .replace('<div id="root"><!--app--></div>', () => `${tag}${html}</div>`);
}

const write = (rel, content) => {
  const file = path.join(dist, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

const routes = allRoutes();
for (const route of routes) {
  const rel = route.page === 'home' ? 'index.html' : `${pagePath(route.page, route.param)}.html`;
  write(rel, await page(route));
}

// Any other URL: GitHub Pages serves 404.html. It shows the "not found" page
// (and still boots the app, so appointment slip links keep working).
write('404.html', await page({ page: 'notfound', param: null }));

const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .filter((r) => r.index)
  .map((r) => `  <url><loc>${SITE_URL}${pagePath(r.page, r.param)}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n');
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`;
write('sitemap.xml', sitemapXml);
write('robots.txt', robotsTxt);
fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), sitemapXml);
fs.writeFileSync(path.join(root, 'public', 'robots.txt'), robotsTxt);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`Pre-rendered ${routes.length + 1} pages (${routes.filter((r) => r.index).length} in sitemap.xml)`);
