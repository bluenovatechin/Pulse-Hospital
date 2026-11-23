import React, { useState, useEffect } from 'react';
import {
  Calendar, Phone, Siren, Users, UserCheck, ArrowRight, ArrowUpRight, CheckCircle2, Plus, Clock, FileText,
  HeartPulse, Activity, Scan, Droplets, Scissors, Sparkles, ShieldCheck, ChevronLeft, ChevronRight, Images,
  Stethoscope, Eye
} from 'lucide-react';
import { SectionHead, Media, Icon, Photo, CountUp, delay } from '../components/ui';
import DoctorMini from '../components/DoctorMini';
import { Link } from '../router';
import {
  HOSPITAL_INFO, DOCTORS, FACILITIES, DEPARTMENTS, TREATMENTS, FAQS, PHOTOS, MILESTONES, getFacility
} from '../data/hospitalContent';

// Facilities featured in the home-page bento grid, in display order
const FEATURED = ['icu', 'ot', 'dialysis', 'lab', 'imaging', 'pharmacy'];

// 4 Core Clinical Pillars featured in the cinematic Hero Story Slider
const HERO_STORIES = [
  {
    id: 'icu',
    src: PHOTOS.icuHall,
    alt: 'Pulse Hospital ICU Hall & Critical Care Unit',
    eyebrowEn: '24×7 INTENSIVE CARE UNIT · MODASA',
    eyebrowGu: '૨૪ કલાક ઇન્ટેન્સિવ કેર યુનિટ · મોડાસા',
    titleEn: 'Critical Care, Close to Home in Modasa',
    titleGu: 'મોડાસામાં જ, ઘરની નજીક ગંભીર સારવાર',
    accentTextEn: 'close to home',
    accentTextGu: 'ઘરની નજીક',
    subTitleEn: '30+ ICU & Ventilator beds, multi-para monitors, and senior MD physician teams on standby day & night.',
    subTitleGu: '૩૦+ ICU & વેન્ટિલેટર બેડ્સ, મલ્ટી-પેરા મોનિટર અને રાત-દિવસ ઉપલબ્ધ સિનિયર MD ફિઝિશિયન ટીમ.',
    badgeEn: 'Dr. Dipesh Patel & Dr. Naimuddin Kazi (MD Physicians)',
    badgeGu: 'ડૉ. દિપેશ પટેલ & ડૉ. નઈમુદ્દીન કાઝી (MD ફિઝિશિયન)',
    accent: '#2dd4bf',
    ctaLink: 'book-appointment',
    ctaTextEn: 'Book OPD Slot',
    ctaTextGu: 'એપોઇન્ટમેન્ટ બુક કરો'
  },
  {
    id: 'ct-scan',
    src: PHOTOS.xray,
    alt: 'Advanced 16-Slice Spiral CT Scan & Diagnostics',
    eyebrowEn: 'ADVANCED RADIOLOGY & IMAGING',
    eyebrowGu: 'અદ્યતન રેડિયોલોજી & ઇમેજિંગ',
    titleEn: 'Instant 16-Slice Spiral CT Scan & X-Ray',
    titleGu: 'ચોવીસેય કલાક ૧૬-સ્લાઈસ સીટી સ્કેન અને એક્સ-રે',
    accentTextEn: 'Instant 16-Slice',
    accentTextGu: 'ચોવીસેય કલાક ૧૬-સ્લાઈસ',
    subTitleEn: 'Zero-delay emergency trauma imaging, digital X-ray, and 24x7 in-house pathology lab on the same floor.',
    subTitleGu: 'તાત્કાલિક ઇમરજન્સી ટ્રોમા ઇમેજિંગ, ડિજિટલ એક્સ-રે અને એક જ ફ્લોર પર ૨૪ કલાક પેથોલોજી લેબ.',
    badgeEn: '24×7 In-House CT & Digital Imaging Active',
    badgeGu: '૨૪x૭ ઈન-હાઉસ સીટી સ્કેન અને ઇમેજિંગ કાર્યરત',
    accent: '#38bdf8',
    ctaLink: 'facilities',
    ctaTextEn: 'Explore Diagnostics',
    ctaTextGu: 'સુવિધાઓ જુઓ'
  },
  {
    id: 'ot',
    src: PHOTOS.ot1,
    alt: 'Modular Operation Theatres with Laminar Air Flow',
    eyebrowEn: 'SURGICAL & TRAUMA EXCELLENCE',
    eyebrowGu: 'સર્જિકલ & ટ્રોમા ઉત્કૃષ્ટતા',
    titleEn: 'Modern Modular Operation Theatres',
    titleGu: 'અત્યાધુનિક મોડ્યુલર ઓપરેશન થીયેટર',
    accentTextEn: 'Modular Theatres',
    accentTextGu: 'મોડ્યુલર થીયેટર',
    subTitleEn: 'Laminar airflow with HEPA filtration, C-Arm fluoroscopy, and dedicated surgical recovery care.',
    subTitleGu: 'લેમિનર એરફ્લો, હેપા ફિલ્ટરેશન, C-Arm મશીન અને ડેડિકેટેડ સર્જિકલ રિકવરી યુનિટ.',
    badgeEn: 'Sterile Multi-Specialty Surgical Unit',
    badgeGu: 'સ્ટેરાઇલ મલ્ટી-સ્પેશિયાલિટી સર્જિકલ યુનિટ',
    accent: '#a7f3d0',
    ctaLink: 'facilities',
    ctaTextEn: 'View Surgical Unit',
    ctaTextGu: 'ઓટી વિગત જુઓ'
  },
  {
    id: 'medicine-opd',
    src: PHOTOS.twinRoom,
    alt: 'Specialist Physician Consultation & Inpatient Rooms',
    eyebrowEn: 'SENIOR PHYSICIAN OPD & CARDIAC CARE',
    eyebrowGu: 'સિનિયર ફિઝિશિયન કન્સલ્ટેશન & હૃદય સંભાળ',
    titleEn: 'Comprehensive Diabetes, Heart & Medical Care',
    titleGu: 'ડાયાબિટીસ, હૃદય અને તબીબી રોગોની નિષ્ણાત સારવાર',
    accentTextEn: 'Heart & Medical Care',
    accentTextGu: 'હૃદય અને તબીબી રોગો',
    subTitleEn: 'Personalized physician care led by experienced consultants from Deep Hospital, Hayat Hospital & Vedant Hospital.',
    subTitleGu: 'દીપ હોસ્પિટલ, હયાત હોસ્પિટલ અને વેદાંત હોસ્પિટલના અનુભવી સિનિયર કન્સલ્ટન્ટ્સ દ્વારા વ્યક્તિગત સારવાર.',
    badgeEn: 'Dr. Paras Patel · Dr. Dipesh Patel · Dr. Naimuddin Kazi',
    badgeGu: 'ડૉ. પારસ પટેલ · ડૉ. દિપેશ પટેલ · ડૉ. નઈમુદ્દીન કાઝી',
    accent: '#fde68a',
    ctaLink: 'doctors',
    ctaTextEn: 'Consult Physicians',
    ctaTextGu: 'ડૉક્ટર સાથે વાત કરો'
  }
];

export default function HomePage({ lang = 'en' }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const t = (en, gu) => (lang === 'en' ? en : gu);
  const featured = FEATURED.map(getFacility).filter(Boolean);

  // Auto-advance hero slides every 5.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_STORIES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [activeSlide]);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? -1 : index));
  };

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % HERO_STORIES.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + HERO_STORIES.length) % HERO_STORIES.length);

  const current = HERO_STORIES[activeSlide];

  return (
    <div>
      {/* ---------- Hero: Cinematic Multi-Slide Storytelling ---------- */}
      <section
        className="home-hero home-hero--slider"
        aria-label={t('Pulse Hospital Introduction', 'પલ્સ હોસ્પિટલ પરિચય')}
      >
        {/* Background Slides */}
        <div className="hero-slider-bg" aria-hidden="true">
          {HERO_STORIES.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-slide-item ${index === activeSlide ? 'is-active' : ''}`}
            >
              <Photo
                src={slide.src}
                alt={slide.alt}
                eager={index === 0}
                sizes="100vw"
                className="hero-slide-img"
              />
            </div>
          ))}
          {/* Scrim Overlay: high contrast on the left, clear vibrant hospital photo on the right */}
          <div className="hero-slider-overlay" />
        </div>

        {/* Foreground Content */}
        <div className="container-wide home-hero-content">
          <div className="hero-compact-wrap hero-text-enter" key={activeSlide}>
            {/* Top Eyebrow Badge */}
            <div className="hero-story-eyebrow">
              <span className="live-beacon" aria-hidden="true" style={{ background: current.accent, boxShadow: `0 0 8px ${current.accent}` }} />
              <span style={{ color: current.accent }}>{t(current.eyebrowEn, current.eyebrowGu)}</span>
            </div>

            {/* Doctor / Clinical Team Spotlight Tag */}
            <div className="hero-story-badge">
              <Sparkles size={13} style={{ color: current.accent }} />
              <span>{t(current.badgeEn, current.badgeGu)}</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              {lang === 'en' ? (
                <>
                  {current.titleEn.replace(current.accentTextEn, '')}
                  <span className="hero-title-accent" style={{ background: `linear-gradient(135deg, ${current.accent} 0%, #34d399 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {current.accentTextEn}
                  </span>
                </>
              ) : (
                <>
                  {current.titleGu.replace(current.accentTextGu, '')}
                  <span className="hero-title-accent" style={{ background: `linear-gradient(135deg, ${current.accent} 0%, #34d399 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {current.accentTextGu}
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle in Gujarati/English with distinct clinical tone */}
            <p className="hero-story-sub gujarati-text" style={{ color: current.accent }}>
              {t(current.subTitleEn, current.subTitleGu)}
            </p>

            {/* Action Buttons */}
            <div className="hero-action-buttons">
              <Link to={current.ctaLink} className="btn btn-hero-primary">
                <Calendar size={15} /> <span>{t(current.ctaTextEn, current.ctaTextGu)}</span>
              </Link>
              <a href={HOSPITAL_INFO.phoneHref} className="btn btn-hero-emergency">
                <Phone size={14} /> <span>{t('24/7 Emergency', '૨૪x૭ ઇમરજન્સી')}</span>
              </a>
              <Link to="facilities" className="btn btn-hero-outline desktop-only">
                {t('All facilities', 'બધી સુવિધાઓ')} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Circular Prev/Next Glass Arrows (Desktop) */}
        <button
          type="button"
          className="hero-arrow-btn hero-arrow-prev desktop-only"
          onClick={prevSlide}
          aria-label={t('Previous slide', 'પાછલી સ્લાઇડ')}
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          className="hero-arrow-btn hero-arrow-next desktop-only"
          onClick={nextSlide}
          aria-label={t('Next slide', 'આગલી સ્લાઇડ')}
        >
          <ChevronRight size={22} />
        </button>

        {/* Slide Indicators with Progress Fill (Similar to Vedant Hospital) */}
        <div className="hero-slider-nav" role="tablist" aria-label={t('Hero slides', 'મુખ્ય સ્લાઇડ્સ')}>
          {HERO_STORIES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              className={`hero-slider-dot ${idx === activeSlide ? 'is-active' : ''}`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Slide ${idx + 1}: ${slide.titleEn}`}
            >
              {idx === activeSlide && <span className="hero-progress-fill" key={activeSlide} />}
            </button>
          ))}
        </div>
      </section>

      {/* ---------- Milestone Stats (Right Below Hero Fold) ---------- */}
      <div className="hero-milestones-bar">
        <div className="container-wide">
          <div className="metrics-strip-card">
            <div className="metrics-intro">
              <span className="metrics-period-badge">
                <Sparkles size={13} /> {t(MILESTONES.period, MILESTONES.periodGu)}
              </span>
              <p className="metrics-trust-label gujarati-text">{MILESTONES.noteGu}</p>
            </div>
            <div className="metrics-grid">
              {MILESTONES.items.map((m, idx) => {
                const icons = [HeartPulse, Users, ShieldCheck];
                const IconCmp = icons[idx] || Activity;
                return (
                  <div key={m.en} className="metric-item">
                    <div className="metric-icon-wrap"><IconCmp size={15} /></div>
                    <div className="metric-info">
                      <span className="metric-value"><CountUp value={m.value} /></span>
                      <span className="metric-title">{t(m.en, m.gu)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Quick actions ---------- */}
      <div className="container-wide quick-actions">
        <div className="quick-grid">
          <Link to="book-appointment" className="quick-card" data-reveal style={delay(0)}>
            <span className="icon-tile"><Calendar size={22} /></span>
            <span><strong>{t('Book a slot', 'સ્લોટ બુક કરો')}</strong><small>{t('Pick a doctor, day & 30-min time', 'ડૉક્ટર, દિવસ અને સમય પસંદ કરો')}</small></span>
          </Link>
          <Link to="doctors" className="quick-card" data-reveal style={delay(1)}>
            <span className="icon-tile mint"><Users size={22} /></span>
            <span><strong>{t('Find a doctor', 'ડૉક્ટર શોધો')}</strong><small>{t('See who treats what, and when', 'કોણ શું સારવાર કરે છે')}</small></span>
          </Link>
          <Link to="my-appointments" className="quick-card" data-reveal style={delay(2)}>
            <span className="icon-tile"><UserCheck size={22} /></span>
            <span><strong>{t('My booking', 'મારી એપોઇન્ટમેન્ટ')}</strong><small>{t('View slip or cancel with your mobile no.', 'સ્લિપ જુઓ અથવા રદ કરો')}</small></span>
          </Link>
          <a className="quick-card is-er" href={HOSPITAL_INFO.phoneHref} data-reveal style={delay(3)}>
            <span className="icon-tile red"><Siren size={22} /></span>
            <span><strong>{t('Emergency', 'ઇમરજન્સી')}</strong><small>{t('No appointment needed: call or walk in', 'એપોઇન્ટમેન્ટ જરૂરી નથી')}</small></span>
          </a>
        </div>
      </div>

      {/* ---------- NEW: Advanced Clinical Infrastructure & Diagnostics Showcase ---------- */}
      <section className="infra-section">
        <div className="container-wide">
          <SectionHead
            center
            eyebrow={t('Hospital Infrastructure & Care', 'અદ્યતન સુવિધાઓ & ડાયગ્નોસ્ટિક્સ')}
            title={t('In-House Diagnostics & Critical Care Under One Roof', 'મોડાસામાં જ અદ્યતન ડાયગ્નોસ્ટિક્સ અને ક્રિટિકલ કેર')}
            text={t(
              'Zero delay emergency investigations: in-house 16-slice spiral CT scan, digital X-ray, 24x7 dialysis and pathology laboratory on 4th floor, City Centre.',
              'તાત્કાલિક સચોટ નિદાન માટે ૪થા માળે સીટી સ્કેન, ડિજિટલ એક્સ-રે, ડાયાલિસીસ અને ૨૪ કલાક લેબોરેટરી ઉપલબ્ધ છે.'
            )}
          />

          <div className="infra-grid">
            {/* Card 1: 16-Slice CT Scan */}
            <div className="infra-card" data-reveal style={delay(0)}>
              <div>
                <div className="infra-card-header">
                  <div className="infra-icon-box"><Scan size={24} /></div>
                  <span className="infra-spec-badge">16-Slice Spiral</span>
                </div>
                <h3>{t('In-House CT Scan', 'ઈન-હાઉસ સીટી સ્કેન')}</h3>
                <p className="infra-card-gu gujarati-text">{t('Immediate Trauma & Brain Scans', 'ઇમરજન્સી અને ટ્રોમા માટે તાત્કાલિક સ્કેન')}</p>
                <p className="infra-card-desc">
                  {t(
                    'High-resolution spiral CT imaging for rapid detection of head trauma, stroke, abdominal emergencies, and chest infections with zero patient transit delay.',
                    'માથાની ઇજા, પેરાલિસિસ (સ્ટ્રોક) અને છાતીના રોગો માટે ૨૪ કલાક તાત્કાલિક સીટી સ્કેન ઉપલબ્ધ છે.'
                  )}
                </p>
              </div>
              <div className="infra-card-foot">
                <span className="badge-pulse-assured">Pulse Assured</span>
                <span className="badge-247-active"><span className="live-dot" /> {t('24×7 Active', '૨૪x૭ ઉપલબ્ધ')}</span>
              </div>
            </div>

            {/* Card 2: 24x7 Pathology Laboratory */}
            <div className="infra-card" data-reveal style={delay(1)}>
              <div>
                <div className="infra-card-header">
                  <div className="infra-icon-box"><Activity size={24} /></div>
                  <span className="infra-spec-badge">Automated Lab</span>
                </div>
                <h3>{t('24×7 Pathology Lab', '૨૪ કલાક પેથોલોજી લેબ')}</h3>
                <p className="infra-card-gu gujarati-text">{t('Zero-Delay Critical Blood Work', 'ઝડપી બ્લડ ટેસ્ટ અને ચોક્કસ પરિણામ')}</p>
                <p className="infra-card-desc">
                  {t(
                    'Fully automated biochemistry, CBC cell counters, cardiac markers (Troponin), and electrolyte testing providing critical blood results in minutes.',
                    'કાર્ડિયાક માર્કર્સ, સીબીસી, લિવર-કિડની પ્રોફાઇલ અને ઇલેક્ટ્રોલાઇટ ટેસ્ટિંગના સચોટ રિપોર્ટ્સ મિનિટોમાં ઉપલબ્ધ.'
                  )}
                </p>
              </div>
              <div className="infra-card-foot">
                <span className="badge-pulse-assured">Pulse Assured</span>
                <span className="badge-247-active"><span className="live-dot" /> {t('24×7 Active', '૨૪x૭ ઉપલબ્ધ')}</span>
              </div>
            </div>

            {/* Card 3: Digital X-Ray & 2D Echo */}
            <div className="infra-card" data-reveal style={delay(2)}>
              <div>
                <div className="infra-card-header">
                  <div className="infra-icon-box"><HeartPulse size={24} /></div>
                  <span className="infra-spec-badge">Digital Imaging</span>
                </div>
                <h3>{t('Digital X-Ray & 2D Echo', 'ડિજિટલ એક્સ-રે અને 2D ઇકો')}</h3>
                <p className="infra-card-gu gujarati-text">{t('Bedside ICU & Routine Radiology', 'હૃદય અને છાતીના રોગોનું સચોટ ઇમેજિંગ')}</p>
                <p className="infra-card-desc">
                  {t(
                    'Low-radiation digital radiography for fracture and chest evaluation, plus 2D echocardiography for cardiac health assessment and ICU monitoring.',
                    'હાડકાંના ફ્રેક્ચર, છાતીનું ઇન્ફેક્શન અને હૃદયના કાર્યક્ષમતા માટે અદ્યતન ડિજિટલ રેડિયોલોજી સુવિધા.'
                  )}
                </p>
              </div>
              <div className="infra-card-foot">
                <span className="badge-pulse-assured">Pulse Assured</span>
                <span className="badge-247-active"><span className="live-dot" /> {t('24×7 Active', '૨૪x૭ ઉપલબ્ધ')}</span>
              </div>
            </div>

            {/* Card 4: 24x7 Hemodialysis */}
            <div className="infra-card" data-reveal style={delay(3)}>
              <div>
                <div className="infra-card-header">
                  <div className="infra-icon-box"><Droplets size={24} /></div>
                  <span className="infra-spec-badge">Multi-Station</span>
                </div>
                <h3>{t('24×7 Hemodialysis Unit', '૨૪ કલાક ડાયાલિસીસ યુનિટ')}</h3>
                <p className="infra-card-gu gujarati-text">{t('Renal Care & ICU Dialysis', 'કિડનીના દર્દીઓ માટે નિષ્ણાત સંભાળ')}</p>
                <p className="infra-card-desc">
                  {t(
                    'Round-the-clock hemodialysis stations for acute kidney injuries, fluid overload, and chronic renal care under continuous doctor supervision.',
                    'કિડની ફેલ્યોર અને એક્યુટ પોઇઝનિંગના ગંભીર દર્દીઓ માટે ૨૪ કલાક મોનિટરિંગ સાથે ડાયાલિસીસ સેવા.'
                  )}
                </p>
              </div>
              <div className="infra-card-foot">
                <span className="badge-pulse-assured">Pulse Assured</span>
                <span className="badge-247-active"><span className="live-dot" /> {t('24×7 Active', '૨૪x૭ ઉપલબ્ધ')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Facilities bento ---------- */}
      <section className="section">
        <div className="container-wide">
          <div className="row-between" style={{ marginBottom: 32 }}>
            <SectionHead
              eyebrow={t('Facilities', 'સુવિધાઓ')}
              title={t('Everything critical, under one roof', 'જરૂરી બધી સુવિધા, એક જ છત નીચે')}
              text={t('Tap any facility to see what it includes, who it is for, and which doctors work there.', 'કોઈપણ સુવિધા પર ક્લિક કરી વિગત જુઓ.')}
            />
            <Link to="facilities" className="btn btn-outline" data-reveal>
              {t(`All ${FACILITIES.length} facilities`, 'બધી સુવિધાઓ')} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bento">
            {featured.map((f, i) => (
              <Link to="facilities" param={f.id} key={f.id} className="bento-tile" data-reveal style={delay(i)}>
                <Media photo={f.photo} icon={f.icon} alt={f.name} iconSize={i === 0 ? 96 : 64} />
                <span className="go" aria-hidden="true"><ArrowUpRight size={18} /></span>
                <span className="inner">
                  {f.is24x7 && <span className="chip chip-dark"><span className="live-dot" style={{ color: 'var(--mint)' }} /> 24x7</span>}
                  <h3>{lang === 'en' ? f.name : f.nameGu}</h3>
                  <p>{f.summary}</p>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Doctors ---------- */}
      <section className="section section--white">
        <div className="container-wide">
          <div className="row-between" style={{ marginBottom: 32 }}>
            <SectionHead
              eyebrow={t('Our doctors', 'અમારા ડૉક્ટરો')}
              title={t('Know who is treating you', 'તમારી સારવાર કોણ કરે છે')}
              text={t(`Our ${DOCTORS.length} doctors care for patients in the OPD, the ICU and Emergency, day and night.`, `અમારા ${DOCTORS.length} ડૉક્ટરો OPD, ICU અને ઇમરજન્સીમાં દિવસ-રાત દર્દીઓની સંભાળ રાખે છે.`)}
            />
            <Link to="doctors" className="btn btn-outline" data-reveal>
              {t('All doctors & timetable', 'બધા ડૉક્ટરો')} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="doc-row">
            {DOCTORS.map((d, i) => <DoctorMini key={d.id} doctor={d} lang={lang} style={delay(i)} />)}
          </div>
        </div>
      </section>

      {/* ---------- How booking works ---------- */}
      <section className="section how-to-book">
        <div className="container-wide">
          <SectionHead
            center
            eyebrow={t('Skip the queue', 'લાઈન વગર')}
            title={t('Book your OPD visit in four steps', 'ચાર સ્ટેપમાં એપોઇન્ટમેન્ટ')}
          />
          <div className="steps">
            {[
              [t('Choose a doctor', 'ડૉક્ટર પસંદ કરો'), t('Pick the specialist you need, or start from a doctor’s profile.', 'તમને જરૂરી નિષ્ણાંત પસંદ કરો.')],
              [t('Pick a day', 'દિવસ પસંદ કરો'), t('Today or any of the next 15 days.', 'આજે અથવા આગામી ૧૫ દિવસમાંથી કોઈપણ દિવસ.')],
              [t('Select a 30-min slot', 'સમય સ્લોટ પસંદ કરો'), t('Morning or evening, whichever suits you.', 'સવાર કે સાંજ: ૩૦ મિનિટનો સ્લોટ.')],
              [t('Send on WhatsApp', 'વોટ્સએપ પર મોકલો'), t('Your request goes to reception, who confirm the slot. Keep the booking slip.', 'વિનંતી રિસેપ્શનને જશે અને તેઓ સ્લોટ કન્ફર્મ કરશે. બુકિંગ સ્લિપ સાચવો.')]
            ].map(([h, p], i) => (
              <div className="step" key={h} data-reveal style={delay(i)}>
                <span className="num">{i + 1}</span>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }} data-reveal>
            <Link to="book-appointment" className="btn btn-primary btn-lg">
              <Calendar size={18} /> {t('Start booking', 'બુકિંગ શરૂ કરો')}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Conditions treated ---------- */}
      <section className="section section--navy">
        <div className="container-wide">
          <SectionHead
            center
            eyebrow={t('What we treat', 'ઉપલબ્ધ સારવાર')}
            title={t('Conditions treated at Pulse Hospital', 'હોસ્પિટલમાં ઉપલબ્ધ મુખ્ય સારવારો')}
            text={t('Grouped by department. Tap one to see the doctors and facilities behind it.', 'વિભાગ પ્રમાણે. વિગત માટે ક્લિક કરો.')}
          />
          <div className="grid grid-3">
            {DEPARTMENTS.map((d, i) => (
              <Link to="departments" param={d.id} key={d.id} className="cond-card has-photo" style={{ ...delay(i, 50), textAlign: 'left', color: 'inherit', font: 'inherit' }} data-reveal>
                {d.photo ? (
                  <span className="cond-photo">
                    <Photo src={d.photo} alt="" sizes="(max-width: 720px) 100vw, 33vw" />
                  </span>
                ) : (
                  <span className="cond-photo is-art" aria-hidden="true"><Icon name={d.icon} size={44} strokeWidth={1.4} /></span>
                )}
                <h3><span className="icon-tile dark" style={{ width: 36, height: 36 }}><Icon name={d.icon} size={18} /></span>{d.title}</h3>
                <div className="gu gujarati-text">{d.titleGujarati}</div>
                <p>{d.conditions.slice(0, 4).join(' · ')}</p>
              </Link>
            ))}
          </div>

          <div className="treatments" data-reveal>
            <h3>{t('Also treated here', 'ઉપલબ્ધ સારવાર')}</h3>
            <ul>
              {TREATMENTS.map((x) => (
                <li key={x.en}><CheckCircle2 size={16} /> {lang === 'en' ? x.en : <span className="gujarati-text">{x.gu}</span>}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- NEW: Luxury Dark-Themed Photo Gallery Preview ---------- */}
      <section className="gallery-preview-dark">
        <div className="container-wide">
          <div className="gallery-preview-header">
            <div>
              <span className="gallery-cat-pill" style={{ marginBottom: 8 }}>
                {t('Real Hospital Infrastructure', 'હોસ્પિટલ ઇન્ફ્રાસ્ટ્રક્ચર')}
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 800, margin: '6px 0 0', letterSpacing: '-0.02em' }}>
                {t('Real Photo Gallery Tour', 'હોસ્પિટલ ફોટો ટૂર')}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(13px, 1.2vw, 15px)', marginTop: 6, maxWidth: 640 }}>
                {t(
                  'Explore our 41-bed critical care centre, ventilator ICU, in-house CT scan, modular operation theatres, and patient care rooms at City Centre, Modasa.',
                  '૪૧ બેડની ક્રિટિકલ કેર હોસ્પિટલ, મોડ્યુલર ઓટી, સીટી સ્કેન અને રૂમ્સની વાસ્તવિક તસવીરો જુઓ.'
                )}
              </p>
            </div>
            <Link to="gallery" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#fff', whiteSpace: 'nowrap' }}>
              <Images size={16} /> {t('View All Photos', 'બધા ફોટો જુઓ')} <ArrowRight size={15} />
            </Link>
          </div>

          <div className="gallery-preview-grid">
            <Link to="gallery" className="gallery-card-dark" data-reveal style={delay(0)}>
              <div className="gallery-card-media">
                <img src={PHOTOS.icuHall} alt="Pulse Hospital ICU Hall" className="gallery-card-img" loading="lazy" />
                <div className="gallery-card-scrim" />
                <div className="gallery-card-content">
                  <span className="gallery-cat-pill">ICU & Critical Care</span>
                  <h3 className="gallery-card-title">{t('30-Bed Advanced ICU Hall', '૩૦ બેડ અદ્યતન આઈ.સી.યુ. હોલ')}</h3>
                </div>
              </div>
            </Link>

            <Link to="gallery" className="gallery-card-dark" data-reveal style={delay(1)}>
              <div className="gallery-card-media">
                <img src={PHOTOS.ot1} alt="Modular Operation Theatre" className="gallery-card-img" loading="lazy" />
                <div className="gallery-card-scrim" />
                <div className="gallery-card-content">
                  <span className="gallery-cat-pill">Surgical Suite</span>
                  <h3 className="gallery-card-title">{t('Laminar Airflow Modular OT', 'મોડ્યુલર ઓપરેશન થીયેટર')}</h3>
                </div>
              </div>
            </Link>

            <Link to="gallery" className="gallery-card-dark" data-reveal style={delay(2)}>
              <div className="gallery-card-media">
                <img src={PHOTOS.xray} alt="16-Slice CT Scan & X-Ray" className="gallery-card-img" loading="lazy" />
                <div className="gallery-card-scrim" />
                <div className="gallery-card-content">
                  <span className="gallery-cat-pill">Diagnostics & CT</span>
                  <h3 className="gallery-card-title">{t('16-Slice CT Scan & Digital X-Ray', '૧૬-સ્લાઈસ સીટી સ્કેન અને એક્સ-રે')}</h3>
                </div>
              </div>
            </Link>

            <Link to="gallery" className="gallery-card-dark" data-reveal style={delay(3)}>
              <div className="gallery-card-media">
                <img src={PHOTOS.twinRoom} alt="Patient Deluxe Room" className="gallery-card-img" loading="lazy" />
                <div className="gallery-card-scrim" />
                <div className="gallery-card-content">
                  <span className="gallery-cat-pill">Patient Rooms</span>
                  <h3 className="gallery-card-title">{t('Deluxe Inpatient Care Suite', 'સ્પેશિયલ દર્દી સંભાળ રૂમ')}</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Patient & Visitor Guide ---------- */}
      <section className="section">
        <div className="container-wide">
          <SectionHead
            center
            eyebrow={t('Patient & Visitor Guide', 'દર્દી & મુલાકાતી માર્ગદર્શિકા')}
            title={t('Essential information before you visit', 'હોસ્પિટલ મુલાકાત વખતે ધ્યાનમાં રાખવા જેવી બાબતો')}
            text={t('Clear clinical protocols designed to save critical minutes and ensure coordinated medical care.', 'ઇમરજન્સી અને ઓપીડી દરમિયાન દર્દીઓની સુવિધા માટેના નિયમો.')}
          />
          <div className="grid grid-3">
            <div className="card card-hover" style={{ padding: 26, ...delay(0) }} data-reveal>
              <span className="icon-tile red" style={{ width: 42, height: 42, marginBottom: 16 }}>
                <Siren size={20} />
              </span>
              <h3 style={{ fontSize: 18, color: 'var(--brand-navy)', marginBottom: 8 }}>
                {t('Emergency Protocol', 'ઇમરજન્સી પ્રોટોકોલ')}
              </h3>
              <p style={{ color: 'var(--text-body)', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                {t(
                  'No prior appointment needed for acute emergencies. Walk directly into the casualty bay on 4th Floor, City Centre or call ahead so our ICU and trauma team is alerted before arrival.',
                  'તાત્કાલિક ઇમરજન્સીમાં એપોઇન્ટમેન્ટની જરૂર નથી. સીધા ૪થા માળે ઇમરજન્સી ડેસ્ક પર આવો અથવા આવતાં પહેલાં કૉલ કરો.'
                )}
              </p>
              <div style={{ fontSize: 13, color: 'var(--pulse-red)', fontWeight: 700 }}>
                {t('24x7 doctor on the floor', '૨૪ કલાક ડૉક્ટર હાજર')}
              </div>
            </div>

            <div className="card card-hover" style={{ padding: 26, ...delay(1) }} data-reveal>
              <span className="icon-tile" style={{ width: 42, height: 42, marginBottom: 16 }}>
                <Clock size={20} />
              </span>
              <h3 style={{ fontSize: 18, color: 'var(--brand-navy)', marginBottom: 8 }}>
                {t('OPD Consultations', 'OPD કન્સલ્ટેશન')}
              </h3>
              <p style={{ color: 'var(--text-body)', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                {t(
                  'Senior visiting MD consultants consult Monday to Saturday in designated morning and evening sessions. Reserve a 30-minute advance slot to avoid prolonged waiting room delays.',
                  'સોમવારથી શનિવાર એમ.ડી. ફિઝિશિયન ઉપલબ્ધ છે. લાઈનમાં રાહ જોવાનો સમય બચાવવા ૩૦ મિનિટનો એડવાન્સ સ્લોટ બુક કરો.'
                )}
              </p>
              <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700 }}>
                {t('Morning: 09:00 - 01:30 | Evening: 04:30 - 08:00', 'સવારે ૦૯:૦૦ - ૦૧:૩૦ | સાંજે ૦૪:૩૦ - ૦૮:૦૦')}
              </div>
            </div>

            <div className="card card-hover" style={{ padding: 26, ...delay(2) }} data-reveal>
              <span className="icon-tile mint" style={{ width: 42, height: 42, marginBottom: 16 }}>
                <FileText size={20} />
              </span>
              <h3 style={{ fontSize: 18, color: 'var(--brand-navy)', marginBottom: 8 }}>
                {t('What to Bring', 'સાથે લાવવાના દસ્તાવેજ')}
              </h3>
              <p style={{ color: 'var(--text-body)', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                {t(
                  'Please carry your past hospital file, recent blood test reports, prior ECG or CT scans, and a list of ongoing medications so the doctor can evaluate treatment continuity accurately.',
                  'તબીબી તપાસ માટે જૂની હોસ્પિટલ ફાઇલ, અગાઉના રિપોર્ટ્સ અને હાલ ચાલતી દવાઓની યાદી સાથે લાવવી.'
                )}
              </p>
              <div style={{ fontSize: 13, color: 'var(--mint-deep)', fontWeight: 700 }}>
                {t('In-house CT, digital X-ray & lab on same floor', 'સીટી સ્કેન, એક્સ-રે અને લેબ એક જ જગ્યાએ')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section section--white">
        <div className="container-wide" style={{ maxWidth: 860 }}>
          <SectionHead center eyebrow="FAQ" title={t('Questions patients often ask', 'વારંવાર પુછાતા પ્રશ્નો')} />
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
                  <div
                    id={`faq-answer-${i}`}
                    className="faq-collapse"
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                  >
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
      <section className="section" style={{ paddingTop: 0, background: 'var(--surface-white)' }}>
        <div className="container-wide">
          <div className="cta-band" data-reveal>
            <div>
              <h3>{t('Need a doctor this week?', 'આ અઠવાડિયે ડૉક્ટરની જરૂર છે?')}</h3>
              <p>{t('Reserve a 30-minute slot now, or call the helpline if it’s urgent.', 'હમણાં જ ૩૦ મિનિટનો સ્લોટ બુક કરો, અથવા તાત્કાલિક હોય તો કૉલ કરો.')}</p>
            </div>
            <div className="row">
              <Link to="book-appointment" className="btn btn-primary btn-lg" style={{ background: '#fff', color: 'var(--brand-navy)', borderColor: '#fff' }}>
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
