import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useSwipeHints from '../hooks/useSwipeHints';

/**
 * A row of cards that becomes a swipeable slider on phones.
 * `className` is the row's own layout class (e.g. "hp-doc-grid"), which
 * decides when it scrolls. While it scrolls, the slider shows:
 *   - round arrow buttons floating over the edges that have more cards
 *   - dots for the cards, with the one in view highlighted
 *   - a "Swipe for more" label until the visitor first swipes
 * On wider screens the row fits, and none of this is shown.
 */
export default function Slider({ className = '', children, lang = 'en', label }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const ref = useRef(null);
  const { scrollable, atStart, atEnd, index, count, touched, goTo } = useSwipeHints(ref);

  const show = scrollable && count > 1;

  return (
    <div className="slider">
      <div className="slider-stage">
        <div ref={ref} className={`${className} slider-track`} role="region" aria-label={label} tabIndex={scrollable ? 0 : undefined}>
          {children}
        </div>
        {show && (
          <>
            <button
              type="button"
              className={`slider-arrow slider-arrow--prev ${atStart ? 'is-off' : ''}`}
              onClick={() => goTo(index - 1)}
              tabIndex={atStart ? -1 : 0}
              aria-hidden={atStart}
              aria-label={t('Previous', 'પાછળ')}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className={`slider-arrow slider-arrow--next ${atEnd ? 'is-off' : ''}`}
              onClick={() => goTo(index + 1)}
              tabIndex={atEnd ? -1 : 0}
              aria-hidden={atEnd}
              aria-label={t('Next', 'આગળ')}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      {show && (
        <div className="slider-ui" aria-hidden="true">
          <div className="slider-dots">
            {Array.from({ length: count }, (_, i) => (
              <span key={i} className={i === index ? 'is-active' : undefined} />
            ))}
          </div>
          <span className={`slider-hint ${touched || index > 0 ? 'is-hidden' : ''}`}>
            {t('Swipe for more', 'વધુ જોવા સ્વાઇપ કરો')} <ChevronRight size={14} />
          </span>
        </div>
      )}
    </div>
  );
}
