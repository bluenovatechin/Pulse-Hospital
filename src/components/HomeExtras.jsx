import React, { useEffect, useRef, useState } from 'react';
import { Phone, MapPin, FileText, Siren, Play, Pause, Navigation } from 'lucide-react';
import { WhatsAppIcon } from './ui';
import { HOSPITAL_INFO, HOSPITAL_TOUR } from '../data/hospitalContent';

// Index of the chapter playing at time `s`
const chapterAt = (chapters, s) => {
  let idx = 0;
  chapters.forEach((c, i) => { if (s >= c.at - 0.05) idx = i; });
  return idx;
};

/**
 * Hero walkthrough video. The video is portrait (9:16), so on tablets and
 * desktops it is shown whole in a frame (nothing cropped) while a blurred,
 * live copy fills the background. On phones it fills the hero behind the text.
 * - plays muted, loops, pauses when scrolled away
 * - no autoplay for reduced-motion or data-saver users (play button instead)
 * - a caption names each place as it appears
 */
export function HeroVideo({ lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [progress, setProgress] = useState(0);
  const chapters = HOSPITAL_TOUR.chapters;

  // Autoplay when allowed and on screen; pause when scrolled away
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const saveData = navigator.connection?.saveData;
    if (reduce || saveData) {
      userPaused.current = true;
      v.preload = 'metadata';
    }
    const tryPlay = () => { if (!userPaused.current) v.play().catch(() => {}); };
    if (typeof IntersectionObserver === 'undefined') { tryPlay(); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) tryPlay();
      else if (!v.paused) v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // Blurred ambient background: copy the video into a tiny canvas a few
  // times a second (tablet/desktop only). Starts with the poster image.
  useEffect(() => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    const wide = window.matchMedia?.('(min-width: 700px)');
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const poster = new Image();
    poster.onload = () => ctx.drawImage(poster, 0, 0, c.width, c.height);
    poster.src = HOSPITAL_TOUR.poster;

    let raf = 0;
    let last = 0;
    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (!wide?.matches || v.paused || v.readyState < 2 || now - last < 120) return;
      last = now;
      ctx.drawImage(v, 0, 0, c.width, c.height);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onTime = () => {
    const v = videoRef.current;
    if (!v) return;
    const i = chapterAt(chapters, v.currentTime);
    const start = chapters[i].at;
    const end = chapters[i + 1] ? chapters[i + 1].at : v.duration || 59;
    setChapter(i);
    setProgress(Math.min(1, Math.max(0, (v.currentTime - start) / (end - start))));
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  const c = chapters[chapter];

  return (
    <>
      <canvas ref={canvasRef} className="hero-ambient" width="36" height="64" aria-hidden="true" />
      <figure className={`hero-video ${playing ? 'is-playing' : ''}`}>
        <video
          ref={videoRef}
          src={HOSPITAL_TOUR.src}
          poster={HOSPITAL_TOUR.poster}
          muted
          loop
          playsInline
          preload="auto"
          onTimeUpdate={onTime}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-label={t('Video walkthrough of Pulse Hospital & I.C.U, Modasa', 'પલ્સ હોસ્પિટલ & આઈ.સી.યુ., મોડાસાનો વિડિયો')}
        />
        <figcaption className="hero-scene" aria-live="off">
          <span className="hero-scene-kicker">{t('Inside Pulse Hospital', 'પલ્સ હોસ્પિટલની અંદર')}</span>
          <span className="hero-scene-name" key={`${chapter}-${lang}`}>{t(c.en, c.gu)}</span>
          <span className="hero-scene-bar" aria-hidden="true">
            {chapters.map((x, i) => (
              <span key={x.at} className="hero-scene-seg">
                <span style={{ transform: `scaleX(${i < chapter ? 1 : i === chapter ? progress : 0})` }} />
              </span>
            ))}
          </span>
        </figcaption>
        <button
          type="button"
          className="hero-video-toggle"
          onClick={toggle}
          aria-label={playing ? t('Pause video', 'વિડિયો રોકો') : t('Play video', 'વિડિયો ચલાવો')}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </figure>
    </>
  );
}

/** "What to do in an emergency": three plain steps with big actions */
export function EmergencySteps({ lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const steps = [
    {
      icon: Phone,
      title: t('Call us right away', 'તરત કૉલ કરો'),
      text: t('Tell us the patient’s condition so the ICU team is ready when you arrive.', 'દર્દીની હાલત જણાવો, જેથી તમે પહોંચો ત્યારે ICU ટીમ તૈયાર હોય.'),
      action: (
        <a className="btn btn-emergency er-step-btn" href={HOSPITAL_INFO.phoneHref}>
          <Phone size={17} /> {HOSPITAL_INFO.appointmentNumber}
        </a>
      )
    },
    {
      icon: MapPin,
      title: t('Come to the 4th floor', '૪થા માળે આવો'),
      text: t('City Centre, A-block, Shamlaji Road, Modasa. Take the lift to the 4th floor. No appointment needed.', 'સીટી સેન્ટર, એ-બ્લોક, શામળાજી રોડ, મોડાસા. લિફ્ટમાં ૪થા માળે આવો. એપોઇન્ટમેન્ટની જરૂર નથી.'),
      action: (
        <a className="btn btn-secondary er-step-btn" href={HOSPITAL_INFO.mapsUrl} target="_blank" rel="noreferrer">
          <Navigation size={16} /> {t('Get directions', 'રસ્તો જુઓ')}
        </a>
      )
    },
    {
      icon: FileText,
      title: t('Bring old reports & medicines', 'જૂના રિપોર્ટ અને દવા સાથે લાવો'),
      text: t('Old files, recent reports and the medicines the patient takes help the doctor decide faster.', 'જૂની ફાઇલ, તાજા રિપોર્ટ અને ચાલુ દવાઓ સાથે હોય તો ડૉક્ટર ઝડપથી નિર્ણય લઈ શકે.'),
      action: (
        <a className="btn btn-secondary er-step-btn" href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber}?text=${encodeURIComponent('Emergency: we are coming to Pulse Hospital.')}`} target="_blank" rel="noreferrer">
          <WhatsAppIcon size={16} /> {t('Send reports on WhatsApp', 'રિપોર્ટ વોટ્સએપ કરો')}
        </a>
      )
    }
  ];

  return (
    <section className="er-steps-wrap" aria-labelledby="er-title">
      <div className="container-wide">
        <div className="er-steps" data-reveal>
          <div className="er-steps-head">
            <span className="er-steps-icon"><Siren size={22} /></span>
            <div>
              <h2 id="er-title">{t('In an emergency, do this', 'ઇમરજન્સીમાં આટલું કરો')}</h2>
              <p>{t('Emergency, ICU, CT scan, lab and dialysis are open 24 hours, every day.', 'ઇમરજન્સી, ICU, CT સ્કેન, લેબ અને ડાયાલિસિસ દરરોજ ૨૪ કલાક ચાલુ છે.')}</p>
            </div>
          </div>
          <ol className="er-step-list">
            {steps.map((s, i) => {
              const I = s.icon;
              return (
                <li key={s.title} className="er-step">
                  <span className="er-step-num" aria-hidden="true">{i + 1}</span>
                  <span className="er-step-icon"><I size={22} /></span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  {s.action}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
