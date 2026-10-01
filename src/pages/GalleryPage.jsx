import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Camera, Eye, Play, Pause } from 'lucide-react';
import { PageHero, delay, lockScroll, unlockScroll } from '../components/ui';
import { Link } from '../router';
import { GALLERY_IMAGES, GALLERY_CATEGORIES, PHOTOS, photoSrcSet } from '../data/hospitalContent';

const GALLERY_CAT_MAP = {
  All: { en: 'All', gu: 'બધા' },
  ICU: { en: 'ICU', gu: 'આઈ.સી.યુ.' },
  Surgery: { en: 'Surgery', gu: 'ઓપરેશન થિયેટર' },
  Rooms: { en: 'Rooms', gu: 'રૂમ' },
  OPD: { en: 'OPD', gu: 'OPD' },
  Arrival: { en: 'Arrival', gu: 'રિસેપ્શન' }
};

export default function GalleryPage({ lang = 'en' }) {
  const [category, setCategory] = useState('All');
  const [index, setIndex] = useState(null); // null = lightbox closed
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0); // 1 = next, -1 = prev
  const [dragX, setDragX] = useState(0);

  const touchRef = useRef(null);
  const activeThumbRef = useRef(null);
  const closeBtnRef = useRef(null);
  const openerRef = useRef(null);

  const t = (en, gu) => (lang === 'en' ? en : gu);
  const catLabel = (c) => t(GALLERY_CAT_MAP[c]?.en || c, GALLERY_CAT_MAP[c]?.gu || c);

  const shown = category === 'All' ? GALLERY_IMAGES : GALLERY_IMAGES.filter((g) => g.category === category);
  const isOpen = index !== null && shown.length > 0;
  const current = isOpen ? shown[index % shown.length] : null;

  const step = useCallback((dir) => {
    if (!shown.length) return;
    setSlideDirection(dir);
    setIndex((prev) => ((prev ?? 0) + dir + shown.length) % shown.length);
  }, [shown.length]);

  const openAt = (i, autoplay = false) => {
    openerRef.current = document.activeElement;
    setSlideDirection(0);
    setIndex(i);
    setIsPlaying(autoplay);
  };

  const close = useCallback(() => {
    setIndex(null);
    setIsPlaying(false);
    setDragX(0);
  }, []);

  // Lock page scroll while open; move focus in, and restore it on close
  useEffect(() => {
    if (!isOpen) return;
    lockScroll();
    closeBtnRef.current?.focus({ preventScroll: true });
    const opener = openerRef.current;
    return () => {
      unlockScroll();
      opener?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === ' ' && document.activeElement?.tagName !== 'BUTTON') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, step, close]);

  // Slideshow timer
  useEffect(() => {
    if (!isPlaying || !isOpen) return;
    const timer = setInterval(() => step(1), 3600);
    return () => clearInterval(timer);
  }, [isPlaying, isOpen, step]);

  // Preload neighbours so next/prev feel instant
  useEffect(() => {
    if (!isOpen) return;
    [1, -1].forEach((d) => {
      const src = shown[(index + d + shown.length) % shown.length]?.src;
      if (src) new Image().src = src;
    });
  }, [isOpen, index, shown]);

  // Keep the active thumbnail in view
  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [index]);

  // Swipe on touch devices
  const onTouchStart = (e) => {
    setIsPlaying(false);
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchMove = (e) => {
    if (!touchRef.current) return;
    setDragX(e.touches[0].clientX - touchRef.current.x);
  };
  const onTouchEnd = () => {
    if (dragX < -45) step(1);
    else if (dragX > 45) step(-1);
    touchRef.current = null;
    setDragX(0);
  };

  const lightbox = isOpen && current && (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={t('Hospital photo viewer', 'હોસ્પિટલ ફોટો વ્યૂઅર')}
      onClick={(e) => {
        if (e.target === e.currentTarget || e.target.classList.contains('lightbox-stage')) close();
      }}
    >
      {isPlaying && (
        <div className="lightbox-progress">
          <div key={index} className="lightbox-progress-bar" />
        </div>
      )}

      <div className="lightbox-top">
        <span className="lightbox-counter">
          {index + 1} / {shown.length}
        </span>
        <div className="lightbox-actions">
          <button
            type="button"
            className={`lightbox-btn ${isPlaying ? 'active' : ''}`}
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            ref={closeBtnRef}
            type="button"
            className="lightbox-btn"
            onClick={close}
            aria-label={t('Close', 'બંધ કરો')}
            title={t('Close (Esc)', 'બંધ કરો (Esc)')}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div
        className="lightbox-stage"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button type="button" className="lightbox-nav prev" onClick={() => step(-1)} aria-label="Previous photo">
          <ChevronLeft size={28} />
        </button>

        <figure className="lightbox-figure" style={dragX ? { transform: `translate3d(${dragX}px,0,0)` } : undefined}>
          <img
            key={current.id}
            data-dir={slideDirection}
            src={current.src}
            srcSet={photoSrcSet(current.src)}
            sizes="(max-width: 768px) 100vw, 1200px"
            alt={current.title}
            className="lightbox-image"
            draggable={false}
          />
          <figcaption className="lightbox-caption">
            <small>{catLabel(current.category)}</small>
            <strong>{lang === 'en' ? current.title : current.titleGujarati}</strong>
          </figcaption>
        </figure>

        <button type="button" className="lightbox-nav next" onClick={() => step(1)} aria-label="Next photo">
          <ChevronRight size={28} />
        </button>
      </div>

      <div className="lightbox-thumbs" aria-label="Photo thumbnails">
        {shown.map((img, i) => {
          const isActive = i === index;
          return (
            <button
              key={img.id}
              type="button"
              ref={isActive ? activeThumbRef : null}
              className={`lightbox-thumb ${isActive ? 'active' : ''}`}
              onClick={() => {
                setSlideDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={img.title}
              aria-current={isActive}
            >
              <img src={img.src} alt="" loading="lazy" />
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <PageHero
        photo={PHOTOS.waiting}
        photoAlt={t('Patient waiting lounge', 'વેઇટિંગ લાઉન્જ')}
        crumbs={t('Hospital tour', 'ગેલેરી')}
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setCategory('All');
                openAt(0, true);
              }}
            >
              <Eye size={17} /> {t('Start the photo tour', 'ફોટો ટૂર શરૂ કરો')}
            </button>
            <Link to="facilities" className="btn btn-secondary">
              {t('View facilities', 'સુવિધાઓ જુઓ')}
            </Link>
          </>
        }
      />

      <section className="section">
        <div className="container-wide">
          <div className="filter-bar" role="toolbar" aria-label="Filter photos" style={{ marginBottom: 28 }}>
            {GALLERY_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className="filter-btn"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {catLabel(c)}
                <span className="count">
                  {c === 'All' ? GALLERY_IMAGES.length : GALLERY_IMAGES.filter((g) => g.category === c).length}
                </span>
              </button>
            ))}
          </div>

          <div className="masonry" key={category}>
            {shown.map((img, i) => (
              <button
                key={img.id}
                type="button"
                className="masonry-item page-enter"
                style={{ ...delay(i, 40), animationDelay: `${Math.min(i, 10) * 40}ms` }}
                onClick={() => openAt(i)}
                aria-label={t(`View ${img.title}`, `${img.titleGujarati} જુઓ`)}
              >
                <div className="photo zoomable" style={{ aspectRatio: i % 3 === 0 ? '4 / 5' : '4 / 3' }}>
                  <img
                    src={img.src}
                    srcSet={photoSrcSet(img.src)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    alt={img.title}
                    loading="lazy"
                  />
                  <div className="masonry-hover-badge">
                    <Eye size={15} />
                    <span>{t('View photo', 'ફોટો જુઓ')}</span>
                  </div>
                </div>
                <span className="cap">
                  <small>{catLabel(img.category)}</small>
                  <strong>{lang === 'en' ? img.title : img.titleGujarati}</strong>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && createPortal(lightbox, document.body)}
    </div>
  );
}
