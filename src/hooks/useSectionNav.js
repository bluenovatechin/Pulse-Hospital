import { useEffect, useRef, useState } from 'react';
import { scrollToId } from '../router';

/**
 * In-page section navigation (Departments and Facilities pages):
 * a side list on desktop and a sticky chip row on phones.
 * - highlights the section being read
 * - `jump(e, id)` glides to a section and keeps the chip row in step
 *
 * While the page glides after a tap, the chip row and the highlight wait:
 * Chrome stops a page's smooth scroll if another area (the chip row)
 * starts scrolling at the same time.
 */
export default function useSectionNav(ids) {
  const [active, setActive] = useState(ids[0]);
  const chipsRef = useRef(null);
  const jumping = useRef(false);

  const centreChip = (chip) => {
    const row = chipsRef.current;
    if (!row || !chip || getComputedStyle(row).display === 'none') return;
    row.scrollTo({ left: Math.max(0, chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2), behavior: 'smooth' });
  };

  // Keep the active chip in view inside the chip row (phones)
  useEffect(() => {
    if (jumping.current) return;
    centreChip(chipsRef.current?.querySelector('[aria-current="true"]'));
  }, [active]);

  // Highlight the section being read
  const key = ids.join('|');
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0] && !jumping.current) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const jump = (e, id) => {
    e.preventDefault();
    window.history.replaceState(null, '', `#${id}`);
    jumping.current = true;
    setActive(id);
    scrollToId(id);
    // Release once the page stops moving (scrollend, with a fallback)
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener('scrollend', finish);
      jumping.current = false;
      centreChip(chipsRef.current?.querySelector(`a[href="#${id}"]`));
    };
    window.addEventListener('scrollend', finish);
    setTimeout(finish, 1200);
  };

  return { active, chipsRef, jump };
}
