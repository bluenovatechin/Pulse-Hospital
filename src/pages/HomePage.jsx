import React, { useState } from 'react';
import {
  Calendar, Phone, Siren, ArrowRight, Plus, Clock, FileText,
  HeartPulse, Activity, Scan, Droplets, Scissors
} from 'lucide-react';
import { Icon, Photo, CountUp, delay } from '../components/ui';
import { HeroVideo } from '../components/HomeExtras';
import Slider from '../components/Slider';
import { Link } from '../router';
import {
  HOSPITAL_INFO, DOCTORS, DOCTOR_TYPES, FACILITIES, DEPARTMENTS, FAQS, MILESTONES, PHOTOS, photoSrcSet, getFacility
} from '../data/hospitalContent';

const guDigits = (n) => String(n).replace(/\d/g, (d) => '૦૧૨૩૪૫૬૭૮૯'[d]);
import { departmentLink, facilityLink } from '../data/siteStructure';

// Facilities featured on the home page (all have real photos), in display order
const FEATURED = ['icu', 'ot', 'dialysis', 'lab', 'imaging', 'pharmacy'];

export default function HomePage({ lang = 'en' }) {
  const [openFaq, setOpenFaq] = useState(0);

  const t = (en, gu) => (lang === 'en' ? en : gu);
  const featured = FEATURED.map(getFacility).filter(Boolean);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? -1 : index));
  };

  return (
    <div>
      {/* ---------- Hero with Background Slider (100% View Height on Mobile) ---------- */}
      <section
        className="home-hero home-hero--slider home-hero--video"
        aria-label={t('Pulse Hospital Introduction', 'પલ્સ હોસ્પિટલ પરિચય')}
      >
        {/* Blurred ambient layer + overlay (the video itself sits beside the text) */}
        <div className="hero-slider-bg" aria-hidden="true">
          <div className="hero-slider-overlay" />
        </div>

        {/* Foreground Content */}
        <div className="container-wide home-hero-content hero-video-layout">
          {/* Tablet/desktop: video framed between two real photos, with two
              small floating cards. Phones: only the video (the rest is hidden). */}
          <div className="hero-stage">
            <HeroVideo lang={lang} />
            <span className="hero-shot hero-shot--a" aria-hidden="true">
              <img src={PHOTOS.icuWard} srcSet={photoSrcSet(PHOTOS.icuWard)} sizes="260px" alt="" decoding="async" />
            </span>
            <span className="hero-shot hero-shot--b" aria-hidden="true">
              <img src={PHOTOS.ot1} srcSet={photoSrcSet(PHOTOS.ot1)} sizes="260px" alt="" decoding="async" />
            </span>
            <div className="hero-float hero-float--open">
              <span className="live-beacon" aria-hidden="true" />
              <span>
                <strong>{t('Open now', 'હમણાં ખુલ્લું')}</strong>
                <small>{t('Emergency · ICU · Dialysis, 24x7', 'ઇમરજન્સી · ICU · ડાયાલિસિસ, ૨૪x૭')}</small>
              </span>
            </div>
            <Link to="doctors" className="hero-float hero-float--docs">
              <span className="hero-float-faces" aria-hidden="true">
                {DOCTORS.map((d) => (
                  <img key={d.id} src={d.photoSmall || d.photo} alt="" decoding="async" />
                ))}
              </span>
              <span>
                <strong>{t(`${DOCTORS.length} specialist doctors`, `${guDigits(DOCTORS.length)} નિષ્ણાત ડૉક્ટરો`)}</strong>
                <small>{t('MD physicians & chest specialist', 'MD ફિઝિશિયન અને છાતીના નિષ્ણાત')}</small>
              </span>
            </Link>
          </div>
          <div className="hero-compact-wrap page-enter">
            {/* Top Badge: Live Status & Location with Icon */}
            <div className="hero-status-pill">
              <span className="live-beacon" aria-hidden="true" />
              <HeartPulse size={14} className="hero-status-icon" aria-hidden="true" />
              <span>{t('24x7 Emergency & ICU · Modasa', '૨૪x૭ ઇમરજન્સી & ICU · મોડાસા')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              {lang === 'en' ? (
                <>Critical care, <span className="hero-title-accent">close to home</span> in Modasa</>
              ) : (
                <>મોડાસામાં જ, <span className="hero-title-accent">ઘરની નજીક</span> ગંભીર સારવાર</>
              )}
            </h1>

            {/* Lead text */}
            <p className="hero-description">
              {t(
                'Ventilator ICU, in-house CT scan, 24x7 dialysis & senior MD physicians at City Centre, Modasa.',
                'વેન્ટીલેટર ICU, ઈન-હાઉસ સીટી સ્કેન, ૨૪ કલાક ડાયાલીસીસ અને અનુભવી MD ફિઝિશિયન: સીટી સેન્ટર, મોડાસા.'
              )}
            </p>

            {/* Key Clinical Capabilities (Desktop only - hidden on mobile to guarantee 100% viewport fit) */}
            <div className="hero-capabilities desktop-only" aria-label={t('Key hospital infrastructure', 'મુખ્ય સુવિધાઓ')}>
              <div className="cap-pill">
                <Activity size={13} className="cap-icon" />
                <span>{t('30+ ICU & Ventilators', '૩૦+ ICU & વેન્ટિલેટર')}</span>
              </div>
              <div className="cap-pill">
                <Scan size={13} className="cap-icon" />
                <span>{t('In-house CT Scan', 'ઈન-હાઉસ CT સ્કેન')}</span>
              </div>
              <div className="cap-pill">
                <Droplets size={13} className="cap-icon" />
                <span>{t('24x7 Dialysis', '૨૪ કલાક ડાયાલિસીસ')}</span>
              </div>
              <div className="cap-pill">
                <Scissors size={13} className="cap-icon" />
                <span>{t('Modular OTs', 'મોડ્યુલર OT')}</span>
              </div>
            </div>

            {/* Minimized, Streamlined Buttons (Zero horizontal overflow on mobile) */}
            <div className="hero-action-buttons">
              <Link to="book-appointment" className="btn btn-hero-primary">
                <Calendar size={15} /> <span>{t('Book Appointment', 'એપોઇન્ટમેન્ટ')}</span>
              </Link>
              <a href={HOSPITAL_INFO.phoneHref} className="btn btn-hero-emergency">
                <Phone size={14} /> <span>{t('24/7 Emergency', '૨૪x૭ ઇમરજન્સી')}</span>
              </a>
              <Link to="facilities" className="btn btn-hero-outline desktop-only">
                {t('Explore facilities', 'સુવિધાઓ જુઓ')} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Trust strip: real numbers, no boxes ---------- */}
      <section className="hp-trust" aria-label={t('Pulse Hospital in numbers', 'આંકડામાં પલ્સ હોસ્પિટલ')}>
        <div className="container-wide hp-trust-inner" data-reveal>
          <p className="hp-trust-label">{t(MILESTONES.period, MILESTONES.periodGu)}</p>
          <dl className="hp-trust-list">
            {MILESTONES.items.map((m) => (
              <div key={m.en} className="hp-trust-item">
                <dt><CountUp value={m.value} /></dt>
                <dd>{t(m.en, m.gu)}</dd>
              </div>
            ))}
            <div className="hp-trust-item">
              <dt>24×7</dt>
              <dd>{t('Emergency, ICU & dialysis', 'ઇમરજન્સી, ICU અને ડાયાલિસિસ')}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ---------- Key facilities: photo, then text (never text on photo) ---------- */}
      <section className="hp-section">
        <div className="container-wide">
          <header className="hp-head" data-reveal>
            <div>
              <p className="hp-kicker">{t('Facilities', 'સુવિધાઓ')}</p>
              <h2 className="hp-title">{t('Everything critical, under one roof', 'જરૂરી બધી સુવિધા, એક જ છત નીચે')}</h2>
            </div>
            <Link to="facilities" className="hp-link">
              {t(`All ${FACILITIES.length} facilities`, 'બધી સુવિધાઓ')} <ArrowRight size={16} />
            </Link>
          </header>

          <Slider className="hp-fac-grid" lang={lang} label={t('Facilities', 'સુવિધાઓ')}>
            {featured.map((f, i) => (
              <Link {...facilityLink(f.id)} key={f.id} className="hp-fac" data-reveal style={delay(i, 80)}>
                <span className="hp-fac-img">
                  <Photo src={f.photo} alt={lang === 'en' ? f.name : f.nameGu} sizes="(max-width: 720px) 100vw, 33vw" />
                  {f.is24x7 && <span className="hp-fac-tag">24×7</span>}
                </span>
                <span className="hp-fac-body">
                  <h3>{lang === 'en' ? f.name : f.nameGu}</h3>
                  <p>{lang === 'en' ? f.summary : (f.summaryGu || f.summary)}</p>
                  <span className="hp-more">{t('View details', 'વિગત જુઓ')} <ArrowRight size={15} /></span>
                </span>
              </Link>
            ))}
          </Slider>
        </div>
      </section>

      {/* ---------- Doctors ---------- */}
      <section className="hp-section hp-section--tint">
        <div className="container-wide">
          <header className="hp-head" data-reveal>
            <div>
              <p className="hp-kicker">{t('Our doctors', 'અમારા ડૉક્ટરો')}</p>
              <h2 className="hp-title">{t('Know who is treating you', 'તમારી સારવાર કોણ કરે છે')}</h2>
            </div>
            <Link to="doctors" className="hp-link">
              {t('All doctors & timetable', 'બધા ડૉક્ટરો અને સમયપત્રક')} <ArrowRight size={16} />
            </Link>
          </header>

          <Slider className="hp-doc-grid" lang={lang} label={t('Our doctors', 'અમારા ડૉક્ટરો')}>
            {DOCTORS.map((d, i) => (
              <Link to="doctors" param={d.slug} key={d.id} className="hp-doc" data-reveal style={delay(i, 80)}>
                <span className="hp-doc-photo">
                  {d.photo
                    ? <img src={d.photo} alt={d.name} loading="lazy" decoding="async" />
                    : <span className="hp-doc-mono" aria-hidden="true">{d.initials}</span>}
                </span>
                <span className="hp-doc-body">
                  <span className="hp-doc-type">{t(DOCTOR_TYPES[d.type].label, DOCTOR_TYPES[d.type].labelGu)}</span>
                  <h3>{lang === 'en' ? d.name : d.nameGujarati}</h3>
                  <span className="hp-doc-qual">{d.qualification || t(d.designation, d.designationGujarati || d.designation)}</span>
                  {d.qualification && <span className="hp-doc-role">{t(d.designation, d.designationGujarati || d.designation)}</span>}
                </span>
              </Link>
            ))}
          </Slider>
        </div>
      </section>

      {/* ---------- What we treat: compact, scannable ---------- */}
      <section className="hp-section">
        <div className="container-wide">
          <header className="hp-head" data-reveal>
            <div>
              <p className="hp-kicker">{t('What we treat', 'ઉપલબ્ધ સારવાર')}</p>
              <h2 className="hp-title">{t('Care by department', 'વિભાગ પ્રમાણે સારવાર')}</h2>
            </div>
            <Link to="departments" className="hp-link">
              {t('All departments', 'બધા વિભાગો')} <ArrowRight size={16} />
            </Link>
          </header>

          <div className="hp-dept-grid">
            {DEPARTMENTS.map((d, i) => (
              <Link {...departmentLink(d.id)} key={d.id} className="hp-dept" data-reveal style={delay(i, 50)}>
                <span className="hp-dept-icon"><Icon name={d.icon} size={20} /></span>
                <span className="hp-dept-body">
                  <h3>{lang === 'en' ? d.title : d.titleGujarati}</h3>
                  <p>{lang === 'gu' && d.conditionsGu ? d.conditionsGu : d.conditions.slice(0, 3).join(' · ')}</p>
                </span>
                <ArrowRight size={17} className="hp-dept-arrow" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Plan your visit ---------- */}
      <section className="hp-section hp-section--tint">
        <div className="container-wide">
          <header className="hp-head" data-reveal>
            <div>
              <p className="hp-kicker">{t('Plan your visit', 'મુલાકાતની તૈયારી')}</p>
              <h2 className="hp-title">{t('Good to know before you come', 'આવતાં પહેલાં જાણવા જેવું')}</h2>
            </div>
          </header>

          <div className="hp-visit-grid">
            <article className="hp-visit is-er" data-reveal style={delay(0, 80)}>
              <Siren size={22} />
              <h3>{t('In an emergency', 'ઇમરજન્સીમાં')}</h3>
              <p>{t('No appointment needed. Come straight to the 4th floor, City Centre, or call ahead so the ICU team is ready.', 'એપોઇન્ટમેન્ટની જરૂર નથી. સીધા ૪થા માળે, સીટી સેન્ટર આવો અથવા આવતાં પહેલાં કૉલ કરો જેથી ICU ટીમ તૈયાર રહે.')}</p>
              <a href={HOSPITAL_INFO.phoneHref} className="hp-visit-link">{HOSPITAL_INFO.appointmentNumber} <ArrowRight size={15} /></a>
            </article>
            <article className="hp-visit" data-reveal style={delay(1, 80)}>
              <Clock size={22} />
              <h3>{t('OPD hours', 'OPD સમય')}</h3>
              <p>{t('Monday to Saturday. Morning 09:00 – 01:30 and evening 04:30 – 08:00. Book a 30-minute slot to avoid waiting.', 'સોમવારથી શનિવાર. સવારે ૦૯:૦૦ – ૦૧:૩૦ અને સાંજે ૦૪:૩૦ – ૦૮:૦૦. રાહ ટાળવા ૩૦ મિનિટનો સ્લોટ બુક કરો.')}</p>
              <Link to="book-appointment" className="hp-visit-link">{t('Book a slot', 'સ્લોટ બુક કરો')} <ArrowRight size={15} /></Link>
            </article>
            <article className="hp-visit" data-reveal style={delay(2, 80)}>
              <FileText size={22} />
              <h3>{t('What to bring', 'સાથે શું લાવવું')}</h3>
              <p>{t('Your hospital file, recent reports, previous ECG or CT scans, and the list of medicines you take.', 'હોસ્પિટલ ફાઇલ, તાજેતરના રિપોર્ટ, અગાઉના ECG કે CT અને ચાલુ દવાઓની યાદી.')}</p>
              <a href={HOSPITAL_INFO.mapsUrl} target="_blank" rel="noreferrer" className="hp-visit-link">{t('Get directions', 'રસ્તો જુઓ')} <ArrowRight size={15} /></a>
            </article>
          </div>

          <ol className="hp-steps" data-reveal>
            {[
              t('Choose a doctor', 'ડૉક્ટર પસંદ કરો'),
              t('Pick a day', 'દિવસ પસંદ કરો'),
              t('Select a 30-min slot', '૩૦ મિનિટનો સ્લોટ પસંદ કરો'),
              t('Send on WhatsApp', 'વોટ્સએપ પર મોકલો')
            ].map((s, i) => (
              <li key={s}><span>{i + 1}</span>{s}</li>
            ))}
            <li className="hp-steps-cta">
              <Link to="book-appointment" className="btn btn-primary">
                <Calendar size={17} /> {t('Start booking', 'બુકિંગ શરૂ કરો')}
              </Link>
            </li>
          </ol>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="hp-section">
        <div className="container-wide hp-faq-wrap">
          <header className="hp-head hp-head--stack" data-reveal>
            <p className="hp-kicker">FAQ</p>
            <h2 className="hp-title">{t('Questions patients often ask', 'વારંવાર પુછાતા પ્રશ્નો')}</h2>
          </header>
          <div className="faq" data-reveal role="region" aria-label="Frequently Asked Questions">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              const question = lang === 'en' ? f.q : (f.qGu || f.q);
              const answer = lang === 'en' ? f.a : (f.aGu || f.a);
              return (
                <div key={f.q} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleFaq(i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                  >
                    <span>{question}</span>
                    <span className="faq-toggle-icon" aria-hidden="true">
                      <Plus size={18} />
                    </span>
                  </button>
                  <div id={`faq-answer-${i}`} className="faq-collapse" role="region" aria-labelledby={`faq-question-${i}`}>
                    <div className="faq-collapse-inner">
                      <div className="faq-answer-content">{answer}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="hp-cta-wrap">
        <div className="container-wide">
          <div className="hp-cta" data-reveal>
            <div>
              <h2>{t('Need a doctor this week?', 'આ અઠવાડિયે ડૉક્ટરની જરૂર છે?')}</h2>
              <p>{t('Reserve a 30-minute slot now, or call if it’s urgent.', 'હમણાં જ ૩૦ મિનિટનો સ્લોટ બુક કરો, અથવા તાત્કાલિક હોય તો કૉલ કરો.')}</p>
            </div>
            <div className="hp-cta-actions">
              <Link to="book-appointment" className="btn btn-lg hp-cta-primary">
                <Calendar size={18} /> {t('Book a slot', 'સ્લોટ બુક કરો')}
              </Link>
              <a className="btn btn-lg btn-ghost-light" href={HOSPITAL_INFO.phoneHref}><Phone size={18} /> {HOSPITAL_INFO.appointmentNumber}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
