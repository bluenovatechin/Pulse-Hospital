import { useEffect } from 'react';

// Fades elements marked with `data-reveal` into view as they scroll in.
// Also watches for elements added later (lazy-loaded pages, filtered
// lists), so nothing is left invisible.
export default function useReveal() {
  useEffect(() => {
    const root = document.getElementById('root');
    const pending = () => root.querySelectorAll('[data-reveal]:not(.is-visible):not([data-reveal-watched])');

    if (!('IntersectionObserver' in window)) {
      const showAll = () => pending().forEach((el) => el.classList.add('is-visible'));
      showAll();
      const mo = new MutationObserver(showAll);
      mo.observe(root, { childList: true, subtree: true });
      return () => mo.disconnect();
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    const scan = () =>
      pending().forEach((el) => {
        el.setAttribute('data-reveal-watched', '');
        io.observe(el);
      });

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
