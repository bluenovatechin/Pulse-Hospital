import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Camera, Eye, Play, Pause, Grid } from 'lucide-react';
import { PageHero, delay, lockScroll, unlockScroll } from '../components/ui';
import { Link } from '../router';
import { GALLERY_IMAGES, GALLERY_CATEGORIES, PHOTOS, photoSrcSet } from '../data/hospitalContent';

export default function GalleryPage({ lang = 'en' }) {
  const [category, setCategory] = useState('All');
  const [index, setIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [touchState, setTouchState] = useState({ startX: 0, startY: 0, deltaX: 0, deltaY: 0, dragging: false });
  const [slideDirection, setSlideDirection] = useState(0); // 1 = next, -1 = prev

  const thumbStripRef = useRef(null);
  const activeThumbRef = useRef(null);

  const t = (en, gu) => (lang === 'en' ? en : gu);

  // List of images currently shown in the grid
  const shown = category === 'All' ? GALLERY_IMAGES : GALLERY_IMAGES.filter((g) => g.category === category);

  // Fallback safe active image
  const safeIndex = index !== null && shown.length > 0 ? ((index % shown.length) + shown.length) % shown.length : null;
  const current = safeIndex !== null ? shown[safeIndex] : null;

  // Navigate to next or previous photo with direction tracking
  const step = useCallback((dir) => {
    if (!shown.length) return;
    setSlideDirection(dir);
    setIndex((prev) => {
      const currentIdx = prev === null ? 0 : prev;
      return (currentIdx + dir + shown.length) % shown.length;
    });
  }, [shown.length]);

  const closeTour = useCallback(() => {
    setIndex(null);
    setIsPlaying(false);
    setTouchState({ startX: 0, startY: 0, deltaX: 0, deltaY: 0, dragging: false });
  }, []);

  // Preload next and previous images into browser cache for instantaneous slide transitions
  useEffect(() => {
    if (safeIndex === null || !shown.length) return;
    const nextIdx = (safeIndex + 1) % shown.length;
    const prevIdx = (safeIndex - 1 + shown.length) % shown.length;
    const preload = (src) => {
      if (!src) return;
      const img = new Image();
      img.src = src;
    };
    preload(shown[nextIdx]?.src);
    preload(shown[prevIdx]?.src);
  }, [safeIndex, shown]);

  // Keyboard navigation & body scroll locking
  useEffect(() => {
    if (safeIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeTour();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    document.addEventListener('keydown', onKey);
    lockScroll();
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [safeIndex, step, closeTour]);

  // Autoplay slideshow timer
  useEffect(() => {
    if (!isPlaying || safeIndex === null) return;
    const timer = setInterval(() => {
      step(1);
    }, 3600);
    return () => clearInterval(timer);
  }, [isPlaying, safeIndex, step]);

  // Keep active thumbnail centered in the bottom filmstrip
  useEffect(() => {
    if (activeThumbRef.current && thumbStripRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [safeIndex]);

  // Touch & Swipe handlers for mobile devices
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    setIsPlaying(false); // pause autoplay when user interacts
    setTouchState({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      deltaX: 0,
      deltaY: 0,
      dragging: true
    });
  };

  const handleTouchMove = (e) => {
    if (!touchState.dragging || !e.touches || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - touchState.startX;
    const deltaY = e.touches[0].clientY - touchState.startY;
    setTouchState((prev) => ({ ...prev, deltaX, deltaY }));
  };

  const handleTouchEnd = () => {
    if (!touchState.dragging) return;
    const { deltaX, deltaY } = touchState;

    // Horizontal swipe threshold: 45px
    if (deltaX < -45) {
      step(1);
    } else if (deltaX > 45) {
      step(-1);
    } else if (deltaY > 75) {
      // Pull down to dismiss
      closeTour();
    }

    setTouchState({ startX: 0, startY: 0, deltaX: 0, deltaY: 0, dragging: false });
  };

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
              className="btn btn-primary"
              onClick={() => {
                setCategory('All');
                setSlideDirection(0);
                setIndex(0);
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
                className="filter-btn"
                aria-pressed={category === c}
                onClick={() => {
                  setCategory(c);
                  if (index !== null) setIndex(0);
                }}
              >
                {t(GALLERY_CAT_MAP[c]?.en || c, GALLERY_CAT_MAP[c]?.gu || c)}
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
                className="masonry-item page-enter"
                style={{ ...delay(i, 40), animationDelay: `${Math.min(i, 10) * 40}ms` }}
                onClick={() => {
                  setSlideDirection(0);
                  setIndex(i);
                }}
                aria-label={t(`Open ${img.title} photo tour`, `${img.titleGujarati} ફોટો જુઓ`)}
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
                    <span>{lang === 'en' ? 'View Tour' : 'મોટું કરો'}</span>
                  </div>
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

      {/* Fullscreen Hospital Tour Slider. Rendered into <body> so no animated
          parent (page transitions use transforms) can trap its fixed position. */}
      {current && createPortal(
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onClick={closeTour}
        >
          {/* Autoplay animated progress bar */}
          {isPlaying && (
            <div className="tour-progress-track">
              <div
                className="tour-progress-bar"
                key={safeIndex}
                style={{
                  width: '100%',
                  transition: 'width 3.6s linear',
                  animation: 'tourProgress 3.6s linear infinite'
                }}
              />
            </div>
          )}

          {/* Top Header Bar */}
          <div className="lightbox-header" onClick={(e) => e.stopPropagation()}>
            <div className="tour-header-meta">
              <span className="tour-badge">
                {t(GALLERY_CAT_MAP[current.category]?.en || current.category, GALLERY_CAT_MAP[current.category]?.gu || current.category)}
              </span>
              <span className="tour-counter">
                {safeIndex + 1} / {shown.length}
              </span>
            </div>

            <div className="tour-header-title">
              <strong>{current.title}</strong>
              <small className="gujarati-text">{current.titleGujarati}</small>
            </div>

            <div className="tour-header-actions">
              <button
                className={`tour-icon-btn ${isPlaying ? 'active' : ''}`}
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                title={isPlaying ? 'Pause slideshow (Space)' : 'Play slideshow (Space)'}
              >
                {isPlaying ? <Pause size={17} /> : <Play size={17} style={{ marginLeft: 2 }} />}
              </button>

              {category !== 'All' && (
                <button
                  className="tour-icon-btn"
                  onClick={() => {
                    const globalIdx = GALLERY_IMAGES.findIndex((g) => g.id === current.id);
                    setCategory('All');
                    setIndex(globalIdx >= 0 ? globalIdx : 0);
                  }}
                  title={t('Show all 16 photos', 'બધા ૧૬ ફોટા જુઓ')}
                  aria-label="Show all photos"
                >
                  <Grid size={17} />
                </button>
              )}

              <button
                className="tour-icon-btn tour-close-btn"
                onClick={closeTour}
                aria-label="Close photo tour (Esc)"
                title="Close (Esc)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Center Stage & Image Slider */}
          <div
            className="lightbox-stage"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left Nav Arrow (Desktop) */}
            <button
              className="tour-nav-btn prev"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
              title="Previous (Left arrow)"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Main Interactive Slide */}
            <div
              className="tour-slide-container"
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: touchState.dragging
                  ? `translate3d(${touchState.deltaX}px, ${touchState.deltaY > 0 ? touchState.deltaY * 0.5 : 0}px, 0)`
                  : 'translate3d(0, 0, 0)',
                opacity: touchState.dragging && touchState.deltaY > 20
                  ? Math.max(0.4, 1 - touchState.deltaY / 300)
                  : 1
              }}
            >
              <img
                key={current.id}
                data-dir={slideDirection}
                src={current.src}
                srcSet={photoSrcSet(current.src)}
                sizes="(max-width: 768px) 100vw, 1080px"
                alt={current.title}
                className="tour-slide-image"
                draggable={false}
              />
            </div>

            {/* Right Nav Arrow (Desktop) */}
            <button
              className="tour-nav-btn next"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
              title="Next (Right arrow)"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Bottom Filmstrip Carousel */}
          <div className="lightbox-bottom" onClick={(e) => e.stopPropagation()}>
            <div className="tour-mobile-title">
              <strong>{current.title}</strong>
              <small className="gujarati-text">{current.titleGujarati}</small>
            </div>

            <div className="tour-thumb-strip" ref={thumbStripRef} role="tablist" aria-label="Photo thumbnails">
              {shown.map((img, i) => {
                const isActive = i === safeIndex;
                return (
                  <button
                    key={img.id}
                    ref={isActive ? activeThumbRef : null}
                    className={`tour-thumb-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setSlideDirection(i > safeIndex ? 1 : -1);
                      setIndex(i);
                    }}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={img.title}
                  >
                    <img src={img.src} alt={img.title} loading="lazy" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
