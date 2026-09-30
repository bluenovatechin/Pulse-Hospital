// ========================================================
// Pulse Hospital & I.C.U - Clean URL router
//
//   /                               home
//   /facilities                     all facilities
//   /facilities/icu                 one facility (full page)
//   /departments                    all departments
//   /departments/chest              one department (full page)
//   /doctors                        all doctors
//   /doctors/dr-santosh-prajapati   one doctor's profile (full page)
//   /book-appointment               booking form
//   /book-appointment/dr-paras-patel  booking form with that doctor chosen
//   /my-appointments                look up bookings made on this device
//   /my-appointments/PLS-123456     one appointment slip
//   /gallery /about /contact /privacy /terms
//
// Works under a sub-folder (GitHub Pages: /Pulse-Hospital/...), migrates
// old '#/page' links, and renders on the server at build time
// (see src/entry-server.jsx) by passing the URL in explicitly.
// ========================================================
import { createElement, useCallback, useEffect, useState } from 'react';

export const PAGES = [
  'home',
  'facilities',
  'departments',
  'doctors',
  'gallery',
  'about',
  'contact',
  'privacy',
  'terms',
  'book-appointment',
  'my-appointments'
];

// Old page ids or aliases that should resolve cleanly
const ALIASES = {
  services: 'facilities',
  book: 'book-appointment',
  appointment: 'book-appointment',
  'my-booking': 'my-appointments'
};

export const ROUTE_BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

/** Route for a path like "/Pulse-Hospital/doctors/dr-paras-patel" */
export function parsePath(pathname, hash = '') {
  // Legacy hash links such as #/terms or #facilities
  if (hash && hash.startsWith('#')) {
    const [hPage = '', hParam = null] = hash.replace(/^#\/?/, '').split('/');
    const page = ALIASES[hPage] || hPage;
    if (page && PAGES.includes(page)) return { page, param: hParam ? decodeURIComponent(hParam) : null };
  }

  let path = pathname || '/';
  if (ROUTE_BASE && path.startsWith(ROUTE_BASE)) path = path.slice(ROUTE_BASE.length);
  const clean = path.replace(/\.html$/, '').replace(/^\/+|\/+$/g, '');
  if (!clean || clean === 'index') return { page: 'home', param: null };

  const [rawPage = '', param = null] = clean.split('/');
  const page = ALIASES[rawPage] || rawPage;
  if (PAGES.includes(page)) return { page, param: param ? decodeURIComponent(param) : null };
  return { page: 'notfound', param: null };
}

/** Clean URL for a page (+ optional id / slug) */
export function buildPath(page, param) {
  const sub = !page || page === 'home' ? '/' : `/${page}${param ? `/${encodeURIComponent(param)}` : ''}`;
  return ROUTE_BASE ? `${ROUTE_BASE}${sub}` : sub;
}

// Custom event so every useRoute() stays in sync
const NAV_EVENT = 'pulse-hospital-navigate';

/** Navigate without a full page load */
export function navigateTo(page, param = null, { replace = false } = {}) {
  const next = buildPath(page, param);
  if (next === window.location.pathname && !window.location.hash) return;
  window.history[replace ? 'replaceState' : 'pushState'](null, '', next);
  window.dispatchEvent(new Event(NAV_EVENT));
}

/**
 * Current route. `initialUrl` is only passed when rendering on the server;
 * in the browser the route comes from the address bar.
 */
export function useRoute(initialUrl) {
  const [route, setRoute] = useState(() =>
    initialUrl !== undefined ? parsePath(initialUrl) : parsePath(window.location.pathname, window.location.hash)
  );

  useEffect(() => {
    const sync = () => setRoute(parsePath(window.location.pathname, window.location.hash));
    window.addEventListener('popstate', sync);
    window.addEventListener(NAV_EVENT, sync);

    // Tidy legacy '#/page' links into clean URLs
    if (window.location.hash.startsWith('#/')) {
      const r = parsePath(window.location.pathname, window.location.hash);
      window.history.replaceState(null, '', buildPath(r.page, r.param));
      sync();
    }
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(NAV_EVENT, sync);
    };
  }, []);

  const navigate = useCallback((page, param = null, opts) => navigateTo(page, param, opts), []);
  return [route, navigate];
}

/**
 * A real <a href> link (so search engines can follow it) that navigates
 * in-app on a normal click. Ctrl/Cmd-click still opens a new tab.
 */
export function Link({ to = 'home', param = null, onClick, children, ...rest }) {
  const href = buildPath(to, param);
  const handle = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigateTo(to, param);
  };
  return createElement('a', { href, onClick: handle, ...rest }, children);
}
