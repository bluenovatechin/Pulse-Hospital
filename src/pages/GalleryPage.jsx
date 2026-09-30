import React, { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Image, Eye, Sparkles } from 'lucide-react';
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
        crumbs={t('Hospital tour', 'ગેલેરી')}
        onHome={() => onNavigate('home')}
        eyebrow={t('Hospital Tour & Visuals', 'હોસ્પિટલ ટૂર અને ફોટોગ્રાફ્સ')}
        eyebrowIcon={<Camera size={14} />}
        title={t('See the hospital before you visit', 'મુલાકાત પહેલાં હોસ્પિટલ જુઓ')}
        text={t(
          'Real, unedited photographs of our ICU, operation theatres, patient rooms, consulting suites and arrival lounge on the 4th floor.',
          '૪થા માળે આવેલા અમારા ICU, મોડ્યુલર OT, દર્દીના રૂમ, કન્સલ્ટિંગ સુઇટ્સ અને રિસેપ્શનના વાસ્તવિક ફોટોગ્રાફ્સ.'
        )}
        cardTitle={t('Visual Facility Index', 'સુવિધા ફોટો ઇન્ડેક્સ')}
        cardBadge={t('16 Authentic Photos', '૧૬ અસલી ફોટા')}
        cardIcon={<Image size={18} />}
        stats={[
          { value: `${GALLERY_IMAGES.length}`, label: t('Facility Photos', 'હોસ્પિટલ ફોટા'), sub: t('100% Real untouched', 'વાસ્તવિક છબીઓ') },
          { value: '4 Sections', label: t('Key Areas', 'મુખ્ય વિભાગો'), sub: t('ICU, OT, Rooms, OPD', 'ICU, OT, રૂમ, OPD') },
          { value: 'HD', label: t('Image Quality', 'ગુણવત્તા'), sub: t('Full zoom inspection', 'ઝૂમ કરી જુઓ') },
          { value: '4th Floor', label: t('City Centre', 'સિટી સેન્ટર'), sub: t('Modasa, Gujarat', 'મોડાસા, ગુજરાત') }
        ]}
        highlights={[
          t('Advanced 16-bed ventilator ICU and central nursing station', 'અદ્યતન ૧૬-બેડ વેન્ટિલેટર આઈ.સી.યુ. અને સેન્ટ્રલ મોનિટરિંગ'),
          t('Sterile modular laminar-airflow operation theatre with surgical lighting', 'સર્જિકલ લાઇટિંગ સાથે મોડ્યુલર લેમિનર-એરફ્લો OT'),
          t('Air-conditioned deluxe rooms, semi-special, and spacious reception lounge', 'એર-કન્ડિશન્ડ ડીલક્સ રૂમ અને વિશાળ રિસેપ્શન લોબી')
        ]}
        actions={
          <>
            <button className="btn btn-primary" onClick={() => setIndex(0)}>
              <Eye size={17} /> {t('Start Photo Tour', 'ફોટો ટૂર શરૂ કરો')}
            </button>
            <button className="btn btn-ghost-light" onClick={() => onNavigate('facilities')}>
              <Sparkles size={17} /> {t('View Facility Specs', 'સુવિધા વિગત')}
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
