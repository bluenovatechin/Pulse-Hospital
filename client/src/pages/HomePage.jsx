import React from 'react';
import {
  Calendar, Phone, Siren, Users, UserCheck, ArrowRight, ArrowUpRight, CheckCircle2, Plus, Building2
} from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import { SectionHead, Media, Icon, delay } from '../components/ui';
import {
  HOSPITAL_INFO, DOCTORS, FACILITIES, DEPARTMENTS, TESTIMONIALS, FAQS, PHOTOS, getFacility
} from '../data/hospitalContent';

// Facilities featured in the home-page bento grid, in display order
const FEATURED = ['icu', 'ot', 'ct', 'twin', 'dialysis', 'isolation'];

export default function HomePage({ onNavigate, onBook, onOpenLookup, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const featured = FEATURED.map(getFacility).filter(Boolean);
  const consultants = DOCTORS.filter((d) => d.type === 'visiting');

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="home-hero">
        <div className="home-hero-bg" aria-hidden="true">
          <img src={PHOTOS.icuHall} alt="" />
        </div>
        <div className="container-wide">
          <div className="home-hero-grid">
            <div className="page-enter">
              <span className="chip chip-dark"><span className="live-dot" style={{ color: '#fb7185' }} /> {t('Emergency & ICU open now · 24x7', 'ઇમરજન્સી & ICU હમણાં ખુલ્લું · ૨૪x૭')}</span>
              <h1>
                {lang === 'en' ? <>Critical care, <em>close to home</em> in Modasa.</> : <>મોડાસામાં જ <em>અદ્યતન ICU</em> અને ઇમરજન્સી સારવાર.</>}
              </h1>
              <p className="lead">
                {t(
                  'ICU with ventilators, in-house CT scan, 24x7 dialysis, modular operation theatres and senior MD physicians — all on one floor, so no one has to rush to Ahmedabad.',
                  'વેન્ટીલેટર ICU, ઈન-હાઉસ સીટી સ્કેન, ૨૪ કલાક ડાયાલીસીસ, મોડ્યુલર ઓપરેશન થીયેટર અને અનુભવી એમ.ડી. ડોક્ટરો — બધું એક જ જગ્યાએ.'
                )}
              </p>
              <div className="hero-ctas">
                <button className="btn-primary btn-lg" onClick={() => onBook(null)}>
                  <Calendar size={18} /> {t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
                </button>
                <button className="btn btn-lg btn-ghost-light" onClick={() => onNavigate('facilities')}>
                  <Building2 size={18} /> {t('Explore facilities', 'સુવિધાઓ જુઓ')}
                </button>
              </div>
              <div className="hero-ticks">
                <span><CheckCircle2 size={16} /> {t('In-house CT scan', 'ઈન-હાઉસ સીટી સ્કેન')}</span>
                <span><CheckCircle2 size={16} /> {t('24x7 dialysis & lab', '૨૪ કલાક ડાયાલીસીસ & લેબ')}</span>
                <span><CheckCircle2 size={16} /> {t('Laminar-flow OT', 'મોડ્યુલર OT')}</span>
              </div>
            </div>

            <aside className="er-card page-enter" style={{ animationDelay: '120ms' }} aria-label="Emergency contact">
              <div className="er-top">
                <span className="er-icon"><Siren size={22} /></span>
                <div>
                  <h3>{t('Emergency? Call us now', 'ઇમરજન્સી? હમણાં કૉલ કરો')}</h3>
                  <small style={{ color: 'rgba(255,255,255,0.7)' }}>{t('Doctor on the floor, day and night', 'ડૉક્ટર ૨૪ કલાક હાજર')}</small>
                </div>
              </div>
              <div className="er-num">{HOSPITAL_INFO.appointmentNumber}</div>
              <small style={{ color: 'rgba(255,255,255,0.65)' }}>{t('Helpline & WhatsApp', 'હેલ્પલાઇન & વોટ્સએપ')}</small>
              <a className="btn btn-emergency btn-block" style={{ marginTop: 16 }} href={HOSPITAL_INFO.phoneHref}>
                <Phone size={17} /> {t('Call emergency desk', 'ઇમરજન્સી કૉલ')}
              </a>
              <div className="er-list">
                {['Accidents & trauma', 'Snakebite & poisoning', 'Stroke & chest pain', 'Breathlessness'].map((x) => (
                  <span key={x}><Plus size={13} /> {x}</span>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------- Quick actions ---------- */}
      <div className="container-wide quick-actions">
        <div className="quick-grid">
          <button className="quick-card" onClick={() => onBook(null)} data-reveal style={delay(0)}>
            <span className="icon-tile"><Calendar size={22} /></span>
            <span><strong>{t('Book a slot', 'સ્લોટ બુક કરો')}</strong><small>{t('Pick a doctor, day & 30-min time', 'ડૉક્ટર, દિવસ અને સમય પસંદ કરો')}</small></span>
          </button>
          <button className="quick-card" onClick={() => onNavigate('doctors')} data-reveal style={delay(1)}>
            <span className="icon-tile mint"><Users size={22} /></span>
            <span><strong>{t('Find a doctor', 'ડૉક્ટર શોધો')}</strong><small>{t('See who treats what, and when', 'કોણ શું સારવાર કરે છે')}</small></span>
          </button>
          <button className="quick-card" onClick={onOpenLookup} data-reveal style={delay(2)}>
            <span className="icon-tile"><UserCheck size={22} /></span>
            <span><strong>{t('My booking', 'મારી એપોઇન્ટમેન્ટ')}</strong><small>{t('View slip or cancel with your mobile no.', 'સ્લિપ જુઓ અથવા રદ કરો')}</small></span>
          </button>
          <a className="quick-card is-er" href={HOSPITAL_INFO.phoneHref} data-reveal style={delay(3)}>
            <span className="icon-tile"><Siren size={22} /></span>
            <span><strong>{t('Emergency', 'ઇમરજન્સી')}</strong><small>{t('No appointment needed — call or walk in', 'એપોઇન્ટમેન્ટ જરૂરી નથી')}</small></span>
          </a>
        </div>
      </div>

      {/* ---------- Stats ---------- */}
      <section className="section--tight" style={{ paddingTop: 56 }}>
        <div className="container-wide">
          <div className="stats">
            {[
              ['24x7', t('Emergency, ICU, lab & pharmacy', 'ઇમરજન્સી, ICU, લેબ & ફાર્મસી')],
              [`${FACILITIES.length}`, t('Facilities on one floor', 'સુવિધાઓ એક જ જગ્યાએ')],
              [`${DOCTORS.length}`, t('Doctors, incl. 24x7 residents', 'ડૉક્ટરો')],
              [`${DEPARTMENTS.length}`, t('Clinical departments', 'વિભાગો')]
            ].map(([n, l], i) => (
              <div className="stat" key={l} data-reveal style={delay(i)}>
                <strong>{n}</strong><span>{l}</span>
              </div>
            ))}
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
            <button className="btn-outline" onClick={() => onNavigate('facilities')} data-reveal>
              {t(`All ${FACILITIES.length} facilities`, 'બધી સુવિધાઓ')} <ArrowRight size={16} />
            </button>
          </div>

          <div className="bento">
            {featured.map((f, i) => (
              <button key={f.id} className="bento-tile" onClick={() => onNavigate('facilities', f.id)} data-reveal style={delay(i)}>
                <Media photo={f.photo} icon={f.icon} alt={f.name} iconSize={i === 0 ? 96 : 64} />
                <span className="go" aria-hidden="true"><ArrowUpRight size={18} /></span>
                <span className="inner">
                  {f.is24x7 && <span className="chip chip-dark"><span className="live-dot" style={{ color: 'var(--mint)' }} /> 24x7</span>}
                  <h3>{lang === 'en' ? f.name : f.nameGu}</h3>
                  <p>{f.summary}</p>
                </span>
              </button>
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
              text={t('Senior MD consultants for OPD and ICU, backed by resident doctors in Emergency and ICU around the clock.', 'OPD અને ICU માટે એમ.ડી. કન્સલ્ટન્ટ, અને ૨૪ કલાક રેસિડેન્ટ ડૉક્ટરો.')}
            />
            <button className="btn-outline" onClick={() => onNavigate('doctors')} data-reveal>
              {t('All doctors & timetable', 'બધા ડૉક્ટરો')} <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-4">
            {consultants.map((d, i) => (
              <div key={d.id} data-reveal style={delay(i)}>
                <DoctorCard doctor={d} lang={lang} compact onBook={onBook} onOpenProfile={(id) => onNavigate('doctors', id)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How booking works ---------- */}
      <section className="section">
        <div className="container-wide">
          <SectionHead
            center
            eyebrow={t('Skip the queue', 'લાઈન વગર')}
            title={t('Book your OPD visit in four steps', 'ચાર સ્ટેપમાં એપોઇન્ટમેન્ટ')}
          />
          <div className="steps">
            {[
              [t('Choose a doctor', 'ડૉક્ટર પસંદ કરો'), t('Pick the specialist you need, or start from a doctor’s profile.', 'તમને જરૂરી નિષ્ણાંત પસંદ કરો.')],
              [t('Pick a day', 'દિવસ પસંદ કરો'), t('Any day in the coming week, Monday to Sunday.', 'આવતા અઠવાડિયાનો કોઈ પણ દિવસ.')],
              [t('Select a 30-min slot', 'સમય સ્લોટ પસંદ કરો'), t('Morning or evening — booked slots are shown struck-through.', 'સવાર કે સાંજ — ૩૦ મિનિટનો સ્લોટ.')],
              [t('Get your slip', 'સ્લિપ મેળવો'), t('Receive a booking ID; print it or share it on WhatsApp.', 'બુકિંગ ID મેળવો, પ્રિન્ટ કે વોટ્સએપ કરો.')]
            ].map(([h, p], i) => (
              <div className="step" key={h} data-reveal style={delay(i)}>
                <span className="num">{i + 1}</span>
                <h4>{h}</h4>
                <p>{p}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }} data-reveal>
            <button className="btn-primary btn-lg" onClick={() => onBook(null)}>
              <Calendar size={18} /> {t('Start booking', 'બુકિંગ શરૂ કરો')}
            </button>
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
          <div className="grid grid-4">
            {DEPARTMENTS.map((d, i) => (
              <button
                key={d.id}
                className="cond-card"
                style={{ ...delay(i, 50), textAlign: 'left', color: 'inherit', font: 'inherit' }}
                onClick={() => onNavigate('departments', d.id)}
                data-reveal
              >
                <h4><span className="icon-tile dark" style={{ width: 36, height: 36 }}><Icon name={d.icon} size={18} /></span>{d.title}</h4>
                <div className="gu gujarati-text">{d.titleGujarati}</div>
                <p>{d.conditions.slice(0, 4).join(' · ')}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="section">
        <div className="container-wide">
          <SectionHead center eyebrow={t('Patient stories', 'દર્દીઓના પ્રતિભાવો')} title={t('Trusted by families across Arvalli', 'અરવલ્લીના પરિવારોનો વિશ્વાસ')} />
          <div className="grid grid-3">
            {TESTIMONIALS.map((q, i) => (
              <figure key={q.id} className="card quote-card" data-reveal style={delay(i)}>
                <div className="stars" aria-label={`${q.rating} out of 5`}>{'★'.repeat(q.rating)}</div>
                <blockquote>“{q.comment}”</blockquote>
                <footer>
                  <span className="icon-tile mint" style={{ fontWeight: 800 }}>{q.name[0]}</span>
                  <span><strong>{q.name}</strong><span>{q.city} · {q.treatment}</span></span>
                </footer>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section section--white">
        <div className="container-wide" style={{ maxWidth: 860 }}>
          <SectionHead center eyebrow="FAQ" title={t('Questions patients often ask', 'વારંવાર પુછાતા પ્રશ્નો')} />
          <div className="faq" data-reveal>
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}<Plus size={20} /></summary>
                <div className="answer">{f.a}</div>
              </details>
            ))}
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
              <button className="btn-primary btn-lg" onClick={() => onBook(null)} style={{ background: '#fff', color: 'var(--brand-navy)', borderColor: '#fff' }}>
                <Calendar size={18} /> {t('Book a slot', 'સ્લોટ બુક કરો')}
              </button>
              <a className="btn btn-lg btn-ghost-light" href={HOSPITAL_INFO.phoneHref}><Phone size={18} /> {HOSPITAL_INFO.appointmentNumber}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
