// ========================================================
// Pulse Hospital & I.C.U - Clean URL router
//
//   /                               home
//   /facilities                     all facilities
//   /facilities/icu                 one facility page (related ones as sections)
//   /facilities/icu#isolation       ...jumping to a section
//   /departments                    all departments on one page
//   /departments#chest              ...jumping to one department
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
import { flushSync } from 'react-dom';

export const PAGES = [
  'home',
  'facilities',
  'departments',
  'conditions',
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
  'my-booking': 'my-appointments',
  'privacy-policy': 'privacy',
  'terms-and-conditions': 'terms',
  'terms-conditions': 'terms',
  'cashless-mediclaim': 'facilities',
  diseases: 'conditions',
  treatments: 'conditions'
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

/**
 * Height of everything that stays stuck to the top of the screen while
 * scrolling: the site header plus any visible bar marked `data-sticky`
 * that sits above the target (e.g. the department chips on phones).
 */
export function stickyOffset(target) {
  let h = 0;
  const header = document.querySelector('.site-header');
  if (header) h += header.getBoundingClientRect().height;
  document.querySelectorAll('[data-sticky]').forEach((bar) => {
    if (getComputedStyle(bar).display === 'none') return;
    // Only bars that come before the target in the page will be stuck above it
    if (target && !(bar.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
    h += bar.getBoundingClientRect().height;
  });
  return h;
}

/**
 * Scroll to a section by id, just below the sticky header. Retries for a
 * moment because lazily loaded pages render the section slightly later.
 */
export function scrollToId(id, smooth = true) {
  if (!id || typeof window === 'undefined') return;
  const started = Date.now();
  const targetTop = (el) => Math.max(0, el.getBoundingClientRect().top + window.scrollY - stickyOffset(el) - 12);
  const tryScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: targetTop(el), behavior: smooth ? 'smooth' : 'instant' });
      if (smooth) settle(el);
      return;
    }
    if (Date.now() - started < 2000) requestAnimationFrame(tryScroll);
  };
  // On a long glide, content above the section can still change height
  // (images loading, sections fading in). When the glide ends, check the
  // landing spot once and correct it if it is off.
  const settle = (el) => {
    let done = false;
    const inputs = ['wheel', 'touchstart', 'keydown'];
    const cancel = () => { done = true; cleanup(); };
    const cleanup = () => {
      window.removeEventListener('scrollend', check);
      inputs.forEach((ev) => window.removeEventListener(ev, cancel));
    };
    inputs.forEach((ev) => window.addEventListener(ev, cancel, { passive: true, once: true }));
    const check = () => {
      if (done) return;
      done = true;
      cleanup();
      const top = targetTop(el);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (Math.abs(window.scrollY - Math.min(top, maxScroll)) > 6) window.scrollTo({ top, behavior: 'smooth' });
    };
    window.addEventListener('scrollend', check);
    setTimeout(check, 2500);
  };
  tryScroll();
}

/** Section id from the address bar (#kidney), ignoring legacy '#/page' links */
export const currentSection = () =>
  typeof window !== 'undefined' && window.location.hash && !window.location.hash.startsWith('#/')
    ? decodeURIComponent(window.location.hash.slice(1))
    : '';

/** Navigate without a full page load; `hash` jumps to a section on that page */
export function navigateTo(page, param = null, { replace = false, hash = '' } = {}) {
  const path = buildPath(page, param);
  const next = hash ? `${path}#${encodeURIComponent(hash)}` : path;

  // Already on this page: glide to the section, or back to the top
  if (path === window.location.pathname) {
    if (hash) {
      window.history[replace ? 'replaceState' : 'pushState'](null, '', next);
      scrollToId(hash);
    } else if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState(null, '', next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  const go = () => {
    window.history[replace ? 'replaceState' : 'pushState'](null, '', next);
    // Render the new page synchronously so it can be captured for the transition
    flushSync(() => window.dispatchEvent(new Event(NAV_EVENT)));
    if (hash) scrollToId(hash, false);
    else window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Cross-fade between pages where the browser supports it; plain swap otherwise
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!replace && !reduceMotion && document.startViewTransition) {
    // While the browser cross-fades, skip the page's own entrance animation
    // so the two don't stack (one smooth motion instead of two)
    const html = document.documentElement;
    html.classList.add('vt-nav');
    const vt = document.startViewTransition(go);
    vt.finished.finally(() => html.classList.remove('vt-nav'));
  } else {
    go();
  }
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
export function Link({ to = 'home', param = null, hash = '', onClick, children, ...rest }) {
  const href = buildPath(to, param) + (hash ? `#${encodeURIComponent(hash)}` : '');
  const handle = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigateTo(to, param, { hash });
  };
  return createElement('a', { href, onClick: handle, ...rest }, children);
}
