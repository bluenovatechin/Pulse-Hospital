import { useEffect } from 'react';

/**
 * Fades elements marked with `data-reveal` into view as they scroll in.
 * Robust against React StrictMode, page refreshes, and dynamic DOM updates.
 */
export default function useReveal(page, param) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.getElementById('root') || document.body;

    // Clean up any stale data-reveal-watched attributes from prior runs
    root.querySelectorAll('[data-reveal-watched]').forEach((el) => {
      el.removeAttribute('data-reveal-watched');
    });

    const pending = () => root.querySelectorAll('[data-reveal]:not(.is-visible)');

    // In case IntersectionObserver is unsupported, reveal all elements immediately
    if (!('IntersectionObserver' in window)) {
      pending().forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px 100px 0px', threshold: 0.01 }
    );

    // Track observed elements in memory for this effect instance (survives StrictMode remounts)
    const observed = new WeakSet();

    const scan = () => {
      const elements = pending();
      const windowH = window.innerHeight || document.documentElement.clientHeight;

      elements.forEach((el) => {
        // Immediate reveal: if element is within or close to viewport, reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowH + 120 && rect.bottom >= -100) {
          el.classList.add('is-visible');
          return;
        }

        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
    };

    // Run initial scan synchronously and on next tick
    scan();
    const frameId = requestAnimationFrame(scan);

    // Scroll and resize listeners as fast reactive triggers
    window.addEventListener('scroll', scan, { passive: true });
    window.addEventListener('resize', scan, { passive: true });

    // Watch for dynamically added DOM elements (lazy loaded routes, etc.)
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });

    // Safety fallback: ensure nothing ever remains permanently hidden
    const safetyTimer = setTimeout(() => {
      root.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => {
        el.classList.add('is-visible');
      });
    }, 600);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(safetyTimer);
      window.removeEventListener('scroll', scan);
      window.removeEventListener('resize', scan);
      io.disconnect();
      mo.disconnect();
    };
  }, [page, param]);
}
