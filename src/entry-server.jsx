// Server entry, used only at build time by scripts/prerender.mjs to turn every
// page into complete HTML (so search engines see the content without JS).
import React from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import App from './App';

export { allRoutes, seoHead, SEO_BLOCK, pagePath, SITE_URL } from './data/seo';
export const BASE = import.meta.env.BASE_URL;

/** Render the app for one URL, waiting for lazily loaded pages to finish */
export async function render(url) {
  const { prelude } = await prerenderToNodeStream(
    <React.StrictMode>
      <App url={url} />
    </React.StrictMode>
  );
  let html = '';
  for await (const chunk of prelude) html += chunk;
  return html;
}
