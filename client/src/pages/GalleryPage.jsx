import React, { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHero, delay, lockScroll, unlockScroll } from '../components/ui';
import { GALLERY_IMAGES, GALLERY_CATEGORIES, PHOTOS } from '../data/hospitalContent';

export default function GalleryPage({ onNavigate, lang = 'en' }) {
  const [category, setCategory] = useState('All');
  const [index, setIndex] = useState(null);
  const t = (en, gu) => (lang === 'en' ? en : gu);

  const shown = category === 'All' ? GALLERY_IMAGES : GALLERY_IMAGES.filter((g) => g.category === category);
  const current = index !== null ? shown[index] : null;

  const step = useCallback((dir) => setIndex((i) => (i + dir + shown.length) % shown.length), [shown.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setIndex(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    lockScroll();
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [index, step]);

  return (
    <div>
      <PageHero
        photo={PHOTOS.waiting}
        crumbs={t('Hospital tour', 'ગેલેરી')}
        onHome={() => onNavigate('home')}
        eyebrow={t('Hospital tour', 'હોસ્પિટલ ટૂર')}
        title={t('See the hospital before you visit', 'મુલાકાત પહેલાં હોસ્પિટલ જુઓ')}
        text={t('Real photographs of our ICU, operation theatres, rooms, consulting rooms and reception.', 'અમારા ICU, ઓપરેશન થીયેટર, રૂમ અને રીસેપ્શનના વાસ્તવિક ફોટા.')}
      />

      <section className="section">
        <div className="container-wide">
          <div className="filter-bar" role="toolbar" aria-label="Filter photos" style={{ marginBottom: 28 }}>
            {GALLERY_CATEGORIES.map((c) => (
              <button key={c} className="filter-btn" aria-pressed={category === c} onClick={() => setCategory(c)}>
                {c}
                <span className="count">{c === 'All' ? GALLERY_IMAGES.length : GALLERY_IMAGES.filter((g) => g.category === c).length}</span>
              </button>
            ))}
          </div>

          <div className="masonry" key={category}>
            {shown.map((img, i) => (
              <button key={img.id} className="masonry-item page-enter" style={{ ...delay(i, 40), animationDelay: `${Math.min(i, 10) * 40}ms` }} onClick={() => setIndex(i)}>
                <div className="photo zoomable" style={{ aspectRatio: i % 3 === 0 ? '4 / 5' : '4 / 3' }}>
                  <img src={img.src} alt={img.title} loading="lazy" />
                </div>
                <span className="cap">
                  <small>{img.category}</small>
                  <strong>{lang === 'en' ? img.title : img.titleGujarati}</strong>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.title} onClick={() => setIndex(null)}>
          <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <button className="lb-btn lb-prev" onClick={() => step(-1)} aria-label="Previous photo"><ChevronLeft size={22} /></button>
            <div className="photo" key={current.id} style={{ animation: 'fade-in .3s ease' }}>
              <img src={current.src} alt={current.title} />
            </div>
            <button className="lb-btn lb-next" onClick={() => step(1)} aria-label="Next photo"><ChevronRight size={22} /></button>
          </div>
          <div className="lightbox-bar" onClick={(e) => e.stopPropagation()}>
            <div>
              <strong>{current.title}</strong>
              <small className="gujarati-text">{current.titleGujarati} · {index + 1} / {shown.length}</small>
            </div>
            <button className="lb-btn" onClick={() => setIndex(null)} aria-label="Close"><X size={20} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
