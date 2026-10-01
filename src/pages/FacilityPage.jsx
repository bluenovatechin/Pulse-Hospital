import React from 'react';
import { Calendar, Phone, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { PageHero, Media, Icon, SectionHead } from '../components/ui';
import DoctorMini from '../components/DoctorMini';
import FacilityCard from '../components/FacilityCard';
import { Link } from '../router';
import { FACILITIES, FACILITY_CATEGORIES, DEPARTMENTS, HOSPITAL_INFO, getDoctor } from '../data/hospitalContent';

// Full page for one facility: /facilities/<id>
export default function FacilityPage({ facility: f, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const name = lang === 'en' ? f.name : f.nameGu;
  const cat = FACILITY_CATEGORIES.find((c) => c.id === f.category);
  const doctors = f.doctorIds.map(getDoctor).filter(Boolean);
  const departments = DEPARTMENTS.filter((d) => d.facilityIds.includes(f.id));
  const related = FACILITIES.filter((x) => x.category === f.category && x.id !== f.id);
  const isEmergency = f.id === 'emergency';

  return (
    <div>
      <PageHero
        crumbs={[{ label: t('Facilities', 'સુવિધાઓ'), to: 'facilities' }, { label: name }]}
        eyebrow={t(cat?.label, cat?.labelGu)}
        title={name}
        text={t(f.summary, f.summaryGu || f.summary)}
        photo={f.photo}
        photoAlt={f.name}
        aside={f.photo ? null : <Media icon={f.icon} className="hero-frame hero-art" iconSize={88} />}
        facts={[
          { value: f.is24x7 ? '24x7' : 'OPD', label: f.is24x7 ? t('Open day and night', 'દિવસ-રાત ખુલ્લું') : t('Mon – Sat hours', 'સોમ – શનિ સમય') },
          { value: `${f.includes.length}`, label: t('Services included', 'સમાવિષ્ટ સેવાઓ') },
          { value: t('4th floor', '૪થો માળ'), label: t('City Centre, Modasa', 'સીટી સેન્ટર, મોડાસા') }
        ]}
        actions={
          <>
            {isEmergency || f.is24x7 ? (
              <a className="btn btn-emergency" href={HOSPITAL_INFO.phoneHref}>
                <Phone size={17} /> {t('Call now', 'હમણાં કૉલ કરો')}
              </a>
            ) : null}
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
            <article className="detail-block" data-reveal>
              <h2>{t("What's included", 'શું સમાવિષ્ટ છે')}</h2>
              <ul className="tick-list">
                {f.includes.map((i) => <li key={i}><CheckCircle2 size={18} /> <span>{i}</span></li>)}
              </ul>
            </article>

            <div className="callout" data-reveal>
              <Info size={18} />
              <span><strong>{t("Who it's for: ", 'કોના માટે ઉપયોગી: ')}</strong>{f.goodFor}</span>
            </div>

            {doctors.length > 0 && (
              <article className="detail-block" data-reveal>
                <h2>{t('Doctors who work here', 'અહીં કાર્યરત ડૉક્ટરો')}</h2>
                <div className="doc-row doc-row--compact">
                  {doctors.map((d) => <DoctorMini key={d.id} doctor={d} lang={lang} />)}
                </div>
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
                      <Link to="departments" param={d.id}>
                        <Icon name={d.icon} size={18} /> {lang === 'en' ? d.title : (d.titleGujarati || d.title)} <ArrowRight size={15} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="side-group" data-reveal>
              <h3>{t('Visit', 'મુલાકાત')}</h3>
              <p className="muted">{lang === 'en' ? HOSPITAL_INFO.address.full : HOSPITAL_INFO.addressGujarati.full}</p>
              <p style={{ marginTop: 8 }}><a href={HOSPITAL_INFO.phoneHref}><strong>{HOSPITAL_INFO.appointmentNumber}</strong></a></p>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--white">
          <div className="container-wide">
            <SectionHead eyebrow={t(cat?.label, cat?.labelGu)} title={t('Related facilities', 'સંબંધિત સુવિધાઓ')} />
            <div className="grid grid-3">
              {related.map((x) => <FacilityCard key={x.id} facility={x} lang={lang} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
