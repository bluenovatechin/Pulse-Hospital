import React from 'react';
import { Calendar, Phone, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { PageHero, Media, Icon, Photo, RepBadge, SectionHead } from '../components/ui';
import DoctorMini from '../components/DoctorMini';
import FacilityCard from '../components/FacilityCard';
import Slider from '../components/Slider';
import { Link } from '../router';
import { FACILITY_CATEGORIES, DEPARTMENTS, HOSPITAL_INFO, getDoctor, getFacility } from '../data/hospitalContent';
import { FACILITY_PAGES, FACILITY_PAGE_IDS, departmentLink } from '../data/siteStructure';

const unique = (list) => [...new Map(list.map((x) => [x.id, x])).values()];

// One facility page: /facilities/<id>. Related facilities (e.g. Isolation ICU
// on the ICU page) follow as sections: /facilities/icu#isolation
export default function FacilityPage({ facility: f, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const gu = lang === 'gu';
  const name = gu ? f.nameGu : f.name;
  const cat = FACILITY_CATEGORIES.find((c) => c.id === f.category);
  const members = (FACILITY_PAGES[f.id] || []).map(getFacility).filter(Boolean);
  const all = [f, ...members];
  const doctors = unique(all.flatMap((x) => x.doctorIds.map(getDoctor).filter(Boolean)));
  const departments = DEPARTMENTS.filter((d) => all.some((x) => d.facilityIds.includes(x.id)));
  const isEmergency = f.id === 'emergency';
  const otherPages = FACILITY_PAGE_IDS.filter((id) => id !== f.id).map(getFacility);
  const related = [
    ...otherPages.filter((x) => x.category === f.category),
    ...otherPages.filter((x) => x.category !== f.category)
  ].slice(0, 3);

  return (
    <div>
      <PageHero
        crumbs={[{ label: t('Facilities', 'સુવિધાઓ'), to: 'facilities' }, { label: name }]}
        eyebrow={t(cat?.label, cat?.labelGu)}
        title={name}
        text={t(f.summary, f.summaryGu || f.summary)}
        photo={f.photo}
        photoAlt={f.name}
        aside={f.photo ? null : (
          <Media icon={f.icon} className="hero-frame hero-art" iconSize={84}>
            <span className="hero-art-label">{name}</span>
          </Media>
        )}
        facts={[
          { value: f.is24x7 ? '24x7' : 'OPD', label: f.is24x7 ? t('Open day and night', 'દિવસ-રાત ખુલ્લું') : t('Mon – Sat hours', 'સોમ – શનિ સમય') },
          { value: `${all.reduce((n, x) => n + x.includes.length, 0)}`, label: t('Services included', 'સમાવિષ્ટ સેવાઓ') },
          { value: t('4th floor', '૪થો માળ'), label: t('City Centre, Modasa', 'સીટી સેન્ટર, મોડાસા') }
        ]}
        actions={
          <>
            {(isEmergency || f.is24x7) && (
              <a className="btn btn-emergency" href={HOSPITAL_INFO.phoneHref}>
                <Phone size={17} /> {t('Call now', 'હમણાં કૉલ કરો')}
              </a>
            )}
            {!isEmergency && (
              <Link to="book-appointment" className="btn btn-primary">
                <Calendar size={17} /> {t('Book a consultation', 'એપોઇન્ટમેન્ટ બુક કરો')}
              </Link>
            )}
          </>
        }
      />

      <section className="section">
        <div className="container-wide detail-layout">
          <div className="detail-main">
            {members.length > 0 && (
              <nav className="fp-onpage" aria-label={t('On this page', 'આ પેજ પર')}>
                <span>{t('On this page', 'આ પેજ પર')}:</span>
                <Link to="facilities" param={f.id} hash={f.id}>{name}</Link>
                {members.map((m) => (
                  <Link key={m.id} to="facilities" param={f.id} hash={m.id}>{gu ? m.nameGu : m.name}</Link>
                ))}
              </nav>
            )}

            <article className="detail-block" id={f.id} data-reveal>
              <h2>{t("What's included", 'શું સમાવિષ્ટ છે')}</h2>
              <ul className="tick-list">
                {f.includes.map((i) => <li key={i}><CheckCircle2 size={18} /> <span>{i}</span></li>)}
              </ul>
              <div className="callout" style={{ marginTop: 18 }}>
                <Info size={18} />
                <span><strong>{t("Who it's for: ", 'કોના માટે ઉપયોગી: ')}</strong>{f.goodFor}</span>
              </div>
            </article>

            {/* Related facilities as sections of this page */}
            {members.map((m) => (
              <article key={m.id} id={m.id} className="fp-section" data-reveal>
                {m.photo ? (
                  <span className="fp-photo">
                    <Photo src={m.photo} alt={gu ? m.nameGu : m.name} sizes="(max-width: 720px) 100vw, 320px" />
                    <RepBadge src={m.photo} />
                  </span>
                ) : (
                  <span className="fp-photo fp-photo--art" aria-hidden="true"><Icon name={m.icon} size={40} strokeWidth={1.4} /></span>
                )}
                <div className="fp-text">
                  <div className="fp-title">
                    <h2>{gu ? m.nameGu : m.name}</h2>
                    {m.is24x7 && !/24\s*x\s*7/i.test(m.name) && <span className="fp-tag">24×7</span>}
                  </div>
                  <p className="fp-summary">{t(m.summary, m.summaryGu || m.summary)}</p>
                  <ul className="tick-list">
                    {m.includes.map((i) => <li key={i}><CheckCircle2 size={17} /> <span>{i}</span></li>)}
                  </ul>
                  {m.goodFor && <p className="fp-for"><strong>{t("Who it's for: ", 'કોના માટે ઉપયોગી: ')}</strong>{m.goodFor}</p>}
                </div>
              </article>
            ))}

            {doctors.length > 0 && (
              <article className="detail-block" data-reveal>
                <h2>{t('Doctors who work here', 'અહીં કાર્યરત ડૉક્ટરો')}</h2>
                <Slider className="doc-row doc-row--compact" centred lang={lang} label={t('Doctors', 'ડૉક્ટરો')}>
                  {doctors.map((d) => <DoctorMini key={d.id} doctor={d} lang={lang} />)}
                </Slider>
              </article>
            )}
          </div>

          <aside className="detail-side">
            {departments.length > 0 && (
              <div className="side-group" data-reveal>
                <h3>{t('Departments that use it', 'સંલગ્ન વિભાગો')}</h3>
                <ul className="link-list">
                  {departments.map((d) => (
                    <li key={d.id}>
                      <Link {...departmentLink(d.id)}>
                        <Icon name={d.icon} size={18} /> {gu ? (d.titleGujarati || d.title) : d.title} <ArrowRight size={15} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="side-group" data-reveal>
              <h3>{t('Visit', 'મુલાકાત')}</h3>
              <p className="muted">{gu ? HOSPITAL_INFO.addressGujarati.full : HOSPITAL_INFO.address.full}</p>
              <p style={{ marginTop: 8 }}><a href={HOSPITAL_INFO.phoneHref}><strong>{HOSPITAL_INFO.appointmentNumber}</strong></a></p>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--white">
          <div className="container-wide">
            <SectionHead eyebrow={t('Facilities', 'સુવિધાઓ')} title={t('More at Pulse Hospital', 'પલ્સ હોસ્પિટલની અન્ય સુવિધાઓ')} />
            <div className="grid grid-3">
              {related.map((x) => <FacilityCard key={x.id} facility={x} lang={lang} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
