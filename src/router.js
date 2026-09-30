// ========================================================
// Pulse Hospital & I.C.U - Clean HTML5 Path Router
//
// Clean path-based routing (NO '#' in URLs):
//   /                     → home
//   /facilities           → facilities
//   /facilities/icu       → facilities, ICU panel open
//   /doctors/4            → doctors, Dr. Santosh's profile open
//   /departments/chest    → departments, scrolled to Chest
//   /privacy              → privacy policy
//   /terms                → terms and conditions
//
// Automatically intercepts and migrates legacy '#' hashes to clean paths.
// ========================================================
import { useCallback, useEffect, useState } from 'react';

export const PAGES = [
  'home',
  'facilities',
  'departments',
  'doctors',
  'gallery',
  'about',
  'contact',
  'privacy',
  'terms'
];

// Old page ids or aliases that should resolve cleanly
const ALIASES = {
  services: 'facilities'
};

const ROUTE_BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

/**
 * Parse the current path and optional param from window.location.pathname
 * If an old hash link (e.g. #/terms) is present, it extracts it and cleans up the URL.
 */
export function parsePath(pathname = window.location.pathname, hash = window.location.hash) {
  // Check for legacy hash like #/terms or #facilities
  if (hash && hash.startsWith('#')) {
    const hashClean = hash.replace(/^#\/?/, '');
    const [hPage = '', hParam = null] = hashClean.split('/');
    const resolvedHPage = ALIASES[hPage] || hPage;
    if (resolvedHPage && PAGES.includes(resolvedHPage)) {
      const cleanPath = buildPath(resolvedHPage, hParam);
      try {
        window.history.replaceState(null, '', cleanPath);
      } catch (e) {
        // Fallback if replaceState is restricted
      }
      return {
        page: resolvedHPage,
        param: hParam ? decodeURIComponent(hParam) : null
      };
    }
  }

  // Strip base prefix if hosted on GitHub Pages subfolder (e.g. /Pulse-Hospital)
  let effectivePath = pathname;
  if (ROUTE_BASE && effectivePath.startsWith(ROUTE_BASE)) {
    effectivePath = effectivePath.slice(ROUTE_BASE.length);
  }

  // Parse path segments: /facilities/icu -> ['facilities', 'icu']
  const cleanPath = effectivePath.replace(/^\/+|\/+$/g, '');
  if (!cleanPath) {
    return { page: 'home', param: null };
  }

  const [rawPage = '', param = null] = cleanPath.split('/');
  const page = ALIASES[rawPage] || rawPage;

  if (PAGES.includes(page)) {
    return {
      page,
      param: param ? decodeURIComponent(param) : null
    };
  }

  return { page: 'home', param: null };
}

/**
 * Build a clean URL path without '#'
 */
export function buildPath(page, param) {
  let sub = '/';
  if (!page || page === 'home') {
    sub = param ? `/${encodeURIComponent(param)}` : '/';
  } else {
    sub = `/${page}${param ? `/${encodeURIComponent(param)}` : ''}`;
  }
  return ROUTE_BASE ? `${ROUTE_BASE}${sub}` : sub;
}

// Custom event to sync route state across components
const NAV_EVENT = 'pulse-hospital-navigate';

export function useRoute() {
  const [route, setRoute] = useState(() => parsePath());

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath());
    };

    const handleCustomNav = () => {
      setRoute(parsePath());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener(NAV_EVENT, handleCustomNav);

    // Initial check to clean any legacy hash in address bar
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const parsed = parsePath();
      setRoute(parsed);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener(NAV_EVENT, handleCustomNav);
    };
  }, []);

  const navigate = useCallback((page, param = null, { replace = false } = {}) => {
    const nextPath = buildPath(page, param);
    const currentPath = window.location.pathname;

    if (nextPath === currentPath && !window.location.hash) return;

    if (replace) {
      window.history.replaceState(null, '', nextPath);
    } else {
      window.history.pushState(null, '', nextPath);
    }

    setRoute(parsePath(nextPath, ''));
    window.dispatchEvent(new Event(NAV_EVENT));
  }, []);

  return [route, navigate];
}

// Backwards-compatible export
export const useHashRoute = useRoute;
export const parseHash = parsePath;
export const buildHash = buildPath;
