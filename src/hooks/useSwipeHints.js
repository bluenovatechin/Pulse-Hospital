import { useCallback, useEffect, useState } from 'react';

/**
 * Makes a horizontal scroll row look and feel swipeable (phones):
 * - whether the row can scroll and whether it is at the start / end
 *   (for the arrow buttons)
 * - one gentle "nudge" (slides a little and back) the first time the row
 *   comes into view, skipped for reduced-motion users
 * - the index of the item in view, for dots
 * Does nothing while the row fits on screen (tablets / desktops).
 */
// Centred sliders snap each card to the middle (scroll-snap-align: center)
const isCentred = (row) => {
  const first = row.firstElementChild;
  return !!first && getComputedStyle(first).scrollSnapAlign.includes('center');
};

export default function useSwipeHints(ref, { nudge = true } = {}) {
  const [state, setState] = useState({ scrollable: false, atStart: true, atEnd: false, index: 0, count: 0, touched: false });

  const measure = useCallback(() => {
    const row = ref.current;
    if (!row) return;
    const max = row.scrollWidth - row.clientWidth;
    const scrollable = max > 4;
    const atStart = row.scrollLeft <= 4;
    const atEnd = row.scrollLeft >= max - 4;
    const items = [...row.children];
    const centred = isCentred(row);
    let index = 0;
    if (atEnd) index = items.length - 1;
    else if (atStart) index = 0;
    else {
      // The card nearest the row's start (or its middle, for centred sliders)
      const r = row.getBoundingClientRect();
      const anchor = centred ? r.left + r.width / 2 : r.left;
      let best = Infinity;
      items.forEach((el, i) => {
        const b = el.getBoundingClientRect();
        const d = Math.abs((centred ? b.left + b.width / 2 : b.left) - anchor);
        if (d < best) { best = d; index = i; }
      });
    }
    setState((s) => (s.scrollable === scrollable && s.atStart === atStart && s.atEnd === atEnd && s.index === index && s.count === items.length
      ? s
      : { ...s, scrollable, atStart, atEnd, index, count: items.length }));
  }, [ref]);

  useEffect(() => {
    const row = ref.current;
    if (!row) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const onTouch = () => setState((s) => (s.touched ? s : { ...s, touched: true }));
    measure();
    row.addEventListener('scroll', onScroll, { passive: true });
    row.addEventListener('pointerdown', onTouch, { passive: true });
    row.addEventListener('touchstart', onTouch, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(row);
    window.addEventListener('resize', measure);

    // One gentle nudge when the row first comes into view
    let io = null;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (nudge && !reduce && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (row.scrollWidth - row.clientWidth <= 4 || row.scrollLeft > 4) return;
        setTimeout(() => {
          if (row.scrollLeft > 4) return; // the visitor is already swiping
          // Scroll snapping would pull a small slide straight back, so pause it
          const snap = row.style.scrollSnapType;
          row.style.scrollSnapType = 'none';
          row.scrollTo({ left: 56, behavior: 'smooth' });
          setTimeout(() => {
            if (row.scrollLeft <= 60) row.scrollTo({ left: 0, behavior: 'smooth' });
            setTimeout(() => { row.style.scrollSnapType = snap; }, 600);
          }, 520);
        }, 450);
      }, { threshold: 0.6 });
      io.observe(row);
    }

    return () => {
      cancelAnimationFrame(raf);
      row.removeEventListener('scroll', onScroll);
      row.removeEventListener('pointerdown', onTouch);
      row.removeEventListener('touchstart', onTouch);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
      io?.disconnect();
    };
  }, [ref, measure, nudge]);

  /** Scroll so that item `i` is at the start of the row */
  const goTo = useCallback((i) => {
    const row = ref.current;
    const el = row?.children[Math.max(0, Math.min(i, row.children.length - 1))];
    if (!row || !el) return;
    setState((s) => ({ ...s, touched: true }));
    const r = row.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const left = isCentred(row)
      ? b.left + b.width / 2 - (r.left + r.width / 2) + row.scrollLeft
      : b.left - r.left + row.scrollLeft;
    row.scrollTo({ left, behavior: 'smooth' });
  }, [ref]);

  return { ...state, goTo };
}
