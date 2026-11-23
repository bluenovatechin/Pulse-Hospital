import { useEffect } from 'react';

/**
 * Scroll reveal: elements fade and rise into place as they enter the screen.
 *
 * - Anything marked `data-reveal` animates.
 * - Common building blocks (cards, grid items, list rows, gallery photos,
 *   section headings) are picked up automatically, so new pages animate
 *   without extra markup. Items in the same row get a short stagger.
 * - Elements already on screen when the page opens show straight away.
 * - Respects "reduce motion" (handled in CSS) and never leaves content
 *   hidden if the browser can't detect scrolling.
 */

// Blocks that reveal automatically (inside <main> only; never the hero,
// header, menus or footer)
const AUTO = [
  '.section-head',
  '.grid > *',
  '.doc-row > *',
  '.doctor-grid > *',
  '.facility-grid > *',
  '.masonry-item',
  '.check-item',
  '.faq-item',
  '.tick-list > li',
  '.link-list > li',
  '.docp-list > li',
  '.hp-fac',
  '.hp-doc',
  '.hp-dept',
  '.hp-visit',
  '.cta-band',
  '.callout'
].join(',');

const SKIP = '.page-hero, .home-hero, header, nav, footer, .mobile-menu, .nav-dropdown, dialog, [role="dialog"]';

const STEP_MS = 40;   // delay between items in the same row
const MAX_STEPS = 4;  // cap so long lists don't wait too long

// An element counts as "entering" once its top is 8% inside the screen
const enterLine = () => (window.innerHeight || document.documentElement.clientHeight) * 0.92;

export default function useReveal(page, param) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const main = document.querySelector('main') || document.getElementById('root') || document.body;

    // Tag common blocks once, with a stagger based on position among siblings
    const tag = () => {
      main.querySelectorAll(AUTO).forEach((el) => {
        if (el.hasAttribute('data-reveal') || el.closest(SKIP)) return;
        el.setAttribute('data-reveal', '');
        if (!el.style.getPropertyValue('--d')) {
          const siblings = el.parentElement ? [...el.parentElement.children] : [el];
          const i = Math.min(siblings.indexOf(el), MAX_STEPS);
          if (i > 0) el.style.setProperty('--d', `${i * STEP_MS}ms`);
        }
      });
    };

    // "Shown" is stored in an attribute React never touches: if a component
    // later changes its className (e.g. an FAQ item opening), the element
    // must stay visible.
    const pending = () => main.querySelectorAll('[data-reveal]:not([data-revealed])');
    const show = (el) => {
      el.setAttribute('data-revealed', '');
      el.classList.add('is-visible');
    };

    tag();

    if (!('IntersectionObserver' in window)) {
      pending().forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 }
    );

    const observed = new WeakSet();

    const scan = () => {
      tag();
      const line = enterLine();
      pending().forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Already above the entry line (on screen, or scrolled past): show now
        if (rect.top <= line && rect.bottom >= 0) {
          show(el);
          return;
        }
        if (rect.bottom < 0) {
          show(el);
          return;
        }
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
    };

    scan();
    const frameId = requestAnimationFrame(scan);

    // Lazy-loaded pages and late content
    const mo = new MutationObserver(() => requestAnimationFrame(scan));
    mo.observe(main, { childList: true, subtree: true });

    // Safety net: if scrolling can't be detected for some reason, never
    // leave content hidden. Only reveals what is already on screen.
    const safetyTimer = setTimeout(() => {
      const line = enterLine();
      pending().forEach((el) => {
        if (el.getBoundingClientRect().top <= line) show(el);
      });
    }, 1500);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(safetyTimer);
      io.disconnect();
      mo.disconnect();
    };
  }, [page, param]);
}
