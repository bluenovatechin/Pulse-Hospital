import React from 'react';
import { Calendar, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageHero, Media, Icon, SectionHead } from '../components/ui';
import DoctorMini from '../components/DoctorMini';
import FacilityCard from '../components/FacilityCard';
import { Link } from '../router';
import { DEPARTMENTS, HOSPITAL_INFO, getDoctor, getFacility } from '../data/hospitalContent';

// Full page for one department: /departments/<id>
export default function DepartmentPage({ department: d, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const title = lang === 'en' ? d.title : (d.titleGujarati || d.title);
  const doctors = d.doctorIds.map(getDoctor).filter(Boolean);
  const facilities = d.facilityIds.map(getFacility).filter(Boolean);
  const photo = facilities.find((f) => f.photo)?.photo;
  const bookable = doctors.find((doc) => doc.type === 'visiting');
  const isEmergency = d.id === 'emergency';
  const others = DEPARTMENTS.filter((x) => x.id !== d.id);

  return (
    <div>
      <PageHero
        crumbs={[{ label: t('Departments', 'વિભાગો'), to: 'departments' }, { label: title }]}
        eyebrow={lang === 'en' ? d.titleGujarati : d.title}
        title={title}
        text={d.intro}
        photo={photo}
        photoAlt={d.title}
        aside={photo ? null : <Media icon={d.icon} className="hero-frame hero-art" iconSize={88} />}
        facts={[
          { value: `${d.conditions.length}`, label: t('Conditions treated', 'સારવાર થતી બીમારીઓ') },
          { value: `${doctors.length || '–'}`, label: t('Doctors', 'ડૉક્ટરો') },
          { value: `${facilities.length}`, label: t('Facilities', 'સુવિધાઓ') }
        ]}
        actions={
          isEmergency || !bookable ? (
            <a className="btn btn-emergency" href={HOSPITAL_INFO.phoneHref}>
              <Phone size={17} /> {t('Call now', 'હમણાં કૉલ કરો')}
            </a>
          ) : (
            <>
              <Link to="book-appointment" param={bookable.slug} className="btn btn-primary">
                <Calendar size={17} /> {t('Book a consultation', 'એપોઇન્ટમેન્ટ બુક કરો')}
              </Link>
              <a className="btn btn-secondary" href={HOSPITAL_INFO.phoneHref}>
                <Phone size={17} /> {t('Call the hospital', 'હોસ્પિટલને કૉલ કરો')}
              </a>
            </>
          )
        }
      />

      <section className="section">
        <div className="container-wide detail-layout">
          <div className="detail-main">
            <article className="detail-block" data-reveal>
              <h2>{t('Conditions treated', 'કઈ બીમારીની સારવાર')}</h2>
              <ul className="tick-list tick-list--cols">
                {d.conditions.map((c) => <li key={c}><CheckCircle2 size={18} /> <span>{c}</span></li>)}
              </ul>
              {d.conditionsGu && <p className="gujarati-text muted" style={{ marginTop: 14 }}>{d.conditionsGu}</p>}
            </article>

            <article className="detail-block" data-reveal>
              <h2>{t('Services', 'સેવાઓ')}</h2>
              <p>{d.services.join(' · ')}</p>
            </article>

            <article className="detail-block" data-reveal>
              <h2>{t('Your doctors', 'ડૉક્ટરો')}</h2>
              {doctors.length > 0 ? (
                <div className="doc-row doc-row--compact">
                  {doctors.map((doc) => <DoctorMini key={doc.id} doctor={doc} lang={lang} />)}
                </div>
              ) : (
                <p className="muted">{t('Surgery is done by visiting surgical teams. Call the hospital to schedule a consultation.', 'સર્જરી વિઝિટિંગ સર્જિકલ ટીમ દ્વારા થાય છે. સમય માટે હોસ્પિટલને કૉલ કરો.')}</p>
              )}
            </article>
          </div>

          <aside className="detail-side">
            <div className="side-group" data-reveal>
              <h3>{t('Other departments', 'અન્ય વિભાગો')}</h3>
              <ul className="link-list">
                {others.map((x) => (
                  <li key={x.id}>
                    <Link to="departments" param={x.id}>
                      <Icon name={x.icon} size={18} /> {lang === 'en' ? x.title : (x.titleGujarati || x.title)} <ArrowRight size={15} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {facilities.length > 0 && (
        <section className="section section--white">
          <div className="container-wide">
            <SectionHead eyebrow={t('Facilities', 'સુવિધાઓ')} title={t('Facilities this department uses', 'આ વિભાગની સુવિધાઓ')} />
            <div className="grid grid-3">
              {facilities.map((f) => <FacilityCard key={f.id} facility={f} lang={lang} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
