import React, { useEffect, useRef, useState } from 'react';
import { Phone, MapPin, FileText, Siren, Play, Navigation } from 'lucide-react';
import { SectionHead, WhatsAppIcon } from './ui';
import { HOSPITAL_INFO, HOSPITAL_TOUR } from '../data/hospitalContent';

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/**
 * Walkthrough video with chapters. Plays muted only while on screen,
 * never autoplays for people who prefer reduced motion, and downloads
 * nothing until it is near the viewport.
 */
export function HospitalTour({ lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const videoRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);
  const chapters = HOSPITAL_TOUR.chapters;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || typeof IntersectionObserver === 'undefined') return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (v.preload === 'none') v.preload = 'metadata';
        if (!reduce) v.play().then(() => setStarted(true)).catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    }, { threshold: 0.45 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const onTime = () => {
    const v = videoRef.current;
    if (!v) return;
    let idx = 0;
    chapters.forEach((c, i) => { if (v.currentTime >= c.at - 0.05) idx = i; });
    setCurrent(idx);
  };

  const jump = (i) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = chapters[i].at;
    setCurrent(i);
    v.play().then(() => setStarted(true)).catch(() => {});
  };

  return (
    <section className="section section--white tour" aria-labelledby="tour-title">
      <div className="container-wide tour-grid">
        <div className="tour-text">
          <SectionHead
            eyebrow={t('Hospital tour', 'હોસ્પિટલ ટૂર')}
            title={<span id="tour-title">{t('Walk through Pulse Hospital in one minute', 'એક મિનિટમાં પલ્સ હોસ્પિટલ જુઓ')}</span>}
            text={t('Filmed inside the hospital on the 4th floor of City Centre. Tap a place to jump to it.', 'સીટી સેન્ટરના ૪થા માળે આવેલી હોસ્પિટલની અંદરનો વિડિયો. કોઈ જગ્યા પર ક્લિક કરી સીધું ત્યાં જુઓ.')}
          />
          <ol className="tour-chapters">
            {chapters.map((c, i) => (
              <li key={c.at}>
                <button
                  type="button"
                  className={i === current && started ? 'is-current' : ''}
                  aria-current={i === current && started ? 'step' : undefined}
                  onClick={() => jump(i)}
                >
                  <span className="tour-time">{fmt(c.at)}</span>
                  <span>{t(c.en, c.gu)}</span>
                  <Play size={13} className="tour-play" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="tour-media">
          <div className="tour-phone">
            <video
              ref={videoRef}
              src={HOSPITAL_TOUR.src}
              poster={HOSPITAL_TOUR.poster}
              muted
              loop
              playsInline
              controls
              preload="none"
              onTimeUpdate={onTime}
              onPlay={() => setStarted(true)}
              aria-label={t('Video tour of Pulse Hospital & I.C.U, Modasa', 'પલ્સ હોસ્પિટલ & આઈ.સી.યુ., મોડાસાનો વિડિયો ટૂર')}
            />
          </div>
          <p className="tour-note">{t('No sound · 59 seconds', 'અવાજ વગર · ૫૯ સેકન્ડ')}</p>
        </div>
      </div>
    </section>
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
