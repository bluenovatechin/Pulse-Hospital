import React from 'react';
import {
  Calendar, Phone, Siren, Users, UserCheck, ArrowRight, ArrowUpRight, CheckCircle2, Plus, Clock, FileText
} from 'lucide-react';
import { SectionHead, Media, Icon, Photo, delay } from '../components/ui';
import DoctorMini from '../components/DoctorMini';
import { Link } from '../router';
import {
  HOSPITAL_INFO, DOCTORS, FACILITIES, DEPARTMENTS, TREATMENTS, FAQS, PHOTOS, getFacility
} from '../data/hospitalContent';

// Facilities featured in the home-page bento grid, in display order
const FEATURED = ['icu', 'ot', 'ct', 'twin', 'dialysis', 'isolation'];

export default function HomePage({ lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const featured = FEATURED.map(getFacility).filter(Boolean);

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="home-hero">
        <div className="container-wide home-hero-grid">
          <div className="page-enter">
            <span className="status-pill">
              <span className="live-beacon" aria-hidden="true" />
              {t('Emergency & ICU open now · 24x7', 'ઇમરજન્સી & ICU હમણાં ખુલ્લું · ૨૪x૭')}
            </span>
            <h1>
              {lang === 'en'
                ? <>Critical care, <em>close to home</em> in Modasa</>
                : <>મોડાસામાં જ, <em>ઘરની નજીક</em> ગંભીર સારવાર</>}
            </h1>
            <p className="lead">
              {t(
                'Pulse Hospital & I.C.U brings a ventilator ICU, in-house CT scan, 24x7 dialysis, modular operation theatres and senior MD physicians together on one floor at City Centre, Shamlaji Road.',
                'વેન્ટીલેટર ICU, ઈન-હાઉસ સીટી સ્કેન, ૨૪ કલાક ડાયાલીસીસ, મોડ્યુલર ઓપરેશન થીયેટર અને અનુભવી એમ.ડી. ડોક્ટરો: બધું સીટી સેન્ટર, શામળાજી રોડ પર એક જ માળે.'
              )}
            </p>
            <div className="hero-ctas">
              <Link to="book-appointment" className="btn btn-primary btn-lg">
                <Calendar size={18} /> {t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
              </Link>
              <Link to="facilities" className="btn btn-secondary btn-lg">
                {t('Explore facilities', 'સુવિધાઓ જુઓ')} <ArrowRight size={18} />
              </Link>
            </div>
            <dl className="hero-facts">
              <div><dt>24x7</dt><dd>{t('Emergency, ICU & dialysis', 'ઇમરજન્સી, ICU & ડાયાલીસીસ')}</dd></div>
              <div><dt>{DOCTORS.length}</dt><dd>{t('Doctors on our panel', 'અમારા ડૉક્ટરો')}</dd></div>
              <div><dt>CT</dt><dd>{t('Scan centre in-house', 'ઈન-હાઉસ સીટી સ્કેન')}</dd></div>
            </dl>
          </div>

          <div className="hero-collage page-enter" style={{ animationDelay: '90ms' }}>
            <div className="hero-frame">
              <Photo src={PHOTOS.icuHall} alt={t('ICU hall with ventilators at Pulse Hospital, Modasa', 'પલ્સ હોસ્પિટલ, મોડાસાનું વેન્ટીલેટર ICU')} eager sizes="(max-width: 1023px) 100vw, 45vw" />
            </div>
            <div className="hero-collage-inset">
              <Photo src={PHOTOS.ot1} alt={t('Modular operation theatre', 'મોડ્યુલર ઓપરેશન થીયેટર')} sizes="20vw" />
            </div>
            <aside className="er-card" aria-label={t('Emergency contact', 'ઇમરજન્સી સંપર્ક')}>
              <span className="er-top"><Siren size={16} /> {t('Emergency · 24x7', 'ઇમરજન્સી · ૨૪x૭')}</span>
              <span className="er-num">{HOSPITAL_INFO.appointmentNumber}</span>
              <small>{t('A doctor is on the floor day and night. No appointment needed.', 'ડૉક્ટર ૨૪ કલાક હાજર. એપોઇન્ટમેન્ટની જરૂર નથી.')}</small>
              <a className="btn btn-emergency btn-block" href={HOSPITAL_INFO.phoneHref}>
                <Phone size={17} /> {t('Call now', 'હમણાં કૉલ કરો')}
              </a>
            </aside>
          </div>
        </div>
      </section>

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
            <span className="icon-tile"><Siren size={22} /></span>
            <span><strong>{t('Emergency', 'ઇમરજન્સી')}</strong><small>{t('No appointment needed: call or walk in', 'એપોઇન્ટમેન્ટ જરૂરી નથી')}</small></span>
          </a>
        </div>
      </div>

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
              <Link to="departments" param={d.id} key={d.id} className="cond-card" style={{ ...delay(i, 50), textAlign: 'left', color: 'inherit', font: 'inherit' }} data-reveal>
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

      {/* ---------- Patient & Visitor Guide (Replaces Fake Reviews) ---------- */}
      <section className="section">
        <div className="container-wide">
          <SectionHead
            center
            eyebrow={t('Patient & Visitor Guide', 'દર્દી & મુલાકાતી માર્ગદર્શિકા')}
            title={t('Essential information before you visit', 'હોસ્પિટલ મુલાકાત વખતે ધ્યાનમાં રાખવા જેવી બાબતો')}
            text={t('Clear clinical protocols designed to save critical minutes and ensure seamless medical care.', 'ઇમરજન્સી અને ઓપીડી દરમિયાન દર્દીઓની સુવિધા માટેના નિયમો.')}
          />
          <div className="grid grid-3">
            <div className="card" style={{ padding: 26, ...delay(0) }} data-reveal>
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

            <div className="card" style={{ padding: 26, ...delay(1) }} data-reveal>
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

            <div className="card" style={{ padding: 26, ...delay(2) }} data-reveal>
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
          <div className="faq" data-reveal>
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{lang === 'en' ? f.q : (f.qGu || f.q)}<Plus size={20} /></summary>
                <div className="answer">{lang === 'en' ? f.a : (f.aGu || f.a)}</div>
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
