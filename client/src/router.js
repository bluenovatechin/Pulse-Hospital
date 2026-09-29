// ========================================================
// Tiny hash router — gives every page (and every doctor /
// facility panel) a real URL so the browser Back button and
// shared links work, without adding a routing dependency.
//
//   #/                     → home
//   #/facilities           → facilities
//   #/facilities/icu       → facilities, ICU panel open
//   #/doctors/4            → doctors, Dr. Santosh's profile open
//   #/departments/chest    → departments, scrolled to Chest
// ========================================================
import { useCallback, useEffect, useState } from 'react';

export const PAGES = ['home', 'facilities', 'departments', 'doctors', 'gallery', 'about', 'contact'];

// Old page ids that should still resolve
const ALIASES = { services: 'facilities' };

export function parseHash(hash = window.location.hash) {
  const [rawPage = '', param = null] = hash.replace(/^#\/?/, '').split('/');
  const page = ALIASES[rawPage] || rawPage;
  return { page: PAGES.includes(page) ? page : 'home', param: param ? decodeURIComponent(param) : null };
}

export function buildHash(page, param) {
  if (page === 'home' && !param) return '#/';
  return `#/${page}${param ? `/${encodeURIComponent(param)}` : ''}`;
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash());

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  // `replace` swaps the current history entry (used when closing a panel)
  const navigate = useCallback((page, param = null, { replace = false } = {}) => {
    const next = buildHash(page, param);
    if (next === window.location.hash || (next === '#/' && !window.location.hash)) return;
    if (replace) {
      window.history.replaceState(null, '', next);
      setRoute(parseHash(next));
    } else {
      window.location.hash = next;
    }
  }, []);

  return [route, navigate];
}
