import React, { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Eye } from 'lucide-react';
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

  const GALLERY_CAT_MAP = {
    All: { en: 'All', gu: 'બધા' },
    ICU: { en: 'ICU', gu: 'આઈ.સી.યુ.' },
    Surgery: { en: 'Surgery', gu: 'ઓપરેશન થિયેટર' },
    Rooms: { en: 'Rooms', gu: 'રૂમ' },
    OPD: { en: 'OPD', gu: 'OPD' },
    Arrival: { en: 'Arrival', gu: 'રિસેપ્શન' }
  };

  return (
    <div>
      <PageHero
        photo={PHOTOS.waiting}
        photoAlt={t('Patient waiting lounge', 'વેઇટિંગ લાઉન્જ')}
        crumbs={t('Hospital tour', 'ગેલેરી')}
        onHome={() => onNavigate('home')}
        eyebrow={t('Hospital tour', 'હોસ્પિટલ ટૂર')}
        title={t('See the hospital before you visit', 'મુલાકાત પહેલાં હોસ્પિટલ જુઓ')}
        text={t(
          'Real photographs of our ICU, operation theatres, patient rooms, consulting rooms and arrival lounge on the 4th floor.',
          '૪થા માળે આવેલા અમારા ICU, ઓપરેશન થીયેટર, દર્દીના રૂમ, કન્સલ્ટિંગ રૂમ અને રિસેપ્શનના વાસ્તવિક ફોટોગ્રાફ્સ.'
        )}
        facts={[
          { value: `${GALLERY_IMAGES.length}`, label: t('Photos', 'ફોટા') },
          { value: `${GALLERY_CATEGORIES.length - 1}`, label: t('Areas of the hospital', 'હોસ્પિટલના વિભાગો') },
          { value: t('4th floor', '૪થો માળ'), label: t('City Centre, Modasa', 'સીટી સેન્ટર, મોડાસા') }
        ]}
        note={{
          icon: <Camera size={20} />,
          title: t('Real photographs', 'વાસ્તવિક ફોટોગ્રાફ્સ'),
          text: t('Taken inside Pulse Hospital', 'પલ્સ હોસ્પિટલની અંદરના ફોટા')
        }}
        actions={
          <>
            <button className="btn-primary" onClick={() => setIndex(0)}>
              <Eye size={17} /> {t('Start the photo tour', 'ફોટો ટૂર શરૂ કરો')}
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('facilities')}>
              {t('View facilities', 'સુવિધાઓ જુઓ')}
            </button>
          </>
        }
      />

      <section className="section">
        <div className="container-wide">
          <div className="filter-bar" role="toolbar" aria-label="Filter photos" style={{ marginBottom: 28 }}>
            {GALLERY_CATEGORIES.map((c) => (
              <button key={c} className="filter-btn" aria-pressed={category === c} onClick={() => setCategory(c)}>
                {t(GALLERY_CAT_MAP[c]?.en || c, GALLERY_CAT_MAP[c]?.gu || c)}
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
                  <small>{t(GALLERY_CAT_MAP[img.category]?.en || img.category, GALLERY_CAT_MAP[img.category]?.gu || img.category)}</small>
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
