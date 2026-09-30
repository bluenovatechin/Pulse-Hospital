import React from 'react';
import { Calendar, Phone, ArrowRight, HeartPulse } from 'lucide-react';
import { PageHero, Icon, Avatar, delay } from '../components/ui';
import { Link } from '../router';
import { DEPARTMENTS, HOSPITAL_INFO, PHOTOS, getDoctor } from '../data/hospitalContent';

// Overview of all departments; each card links to /departments/<id>
export default function DepartmentsPage({ lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);

  return (
    <div>
      <PageHero
        photo={PHOTOS.icuBeds}
        photoAlt={t('ICU beds with bedside monitors', 'આઈ.સી.યુ. બેડ અને મોનિટર')}
        crumbs={t('Departments', 'વિભાગો')}
        eyebrow={t('Departments', 'વિભાગો')}
        title={t('Find the right department for your condition', 'તમારી તકલીફ માટે યોગ્ય વિભાગ')}
        text={t(
          'Each department has its own page with the conditions it treats, the services it offers, the facilities it relies on and the doctors you will meet.',
          'દરેક વિભાગના પેજ પર કઈ બીમારીની સારવાર થાય છે, કઈ સેવાઓ છે અને કયા ડૉક્ટરો છે તે જુઓ.'
        )}
        facts={[
          { value: `${DEPARTMENTS.length}`, label: t('Clinical departments', 'તબીબી વિભાગો') },
          { value: '24x7', label: t('Emergency & ICU', 'ઇમરજન્સી & ICU') },
          { value: 'OPD', label: t('Mon – Sat, 2 sessions', 'સોમ – શનિ, ૨ સત્ર') }
        ]}
        note={{
          icon: <HeartPulse size={20} />,
          title: t('Not sure which department?', 'કયો વિભાગ ખબર નથી?'),
          text: t('Book an OPD visit and the doctor will guide you', 'OPD બુક કરો, ડૉક્ટર માર્ગદર્શન આપશે')
        }}
        actions={
          <>
            <Link to="book-appointment" className="btn btn-primary">
              <Calendar size={17} /> {t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
            </Link>
            <a className="btn btn-secondary" href={HOSPITAL_INFO.phoneHref}>
              <Phone size={17} /> {t('Call the hospital', 'હોસ્પિટલને કૉલ કરો')}
            </a>
          </>
        }
      />

      <section className="section">
        <div className="container-wide">
          <div className="grid grid-3">
            {DEPARTMENTS.map((d, i) => {
              const doctors = d.doctorIds.map(getDoctor).filter(Boolean);
              return (
                <Link key={d.id} to="departments" param={d.id} className="card card-hover dept-card" data-reveal style={delay(i, 50)}>
                  <span className="icon-tile mint"><Icon name={d.icon} size={22} /></span>
                  <h2>{lang === 'en' ? d.title : d.titleGujarati}</h2>
                  <span className="gujarati-text muted dept-card-sub">{lang === 'en' ? d.titleGujarati : d.title}</span>
                  <p>{d.intro}</p>
                  <p className="dept-card-conditions">{d.conditions.slice(0, 4).join(' · ')}</p>
                  <span className="dept-card-foot">
                    {doctors.length > 0 && (
                      <span className="avatar-stack" aria-hidden="true">
                        {doctors.slice(0, 4).map((doc) => <Avatar key={doc.id} doctor={doc} size="sm" />)}
                      </span>
                    )}
                    <span className="link-arrow">{t('View department', 'વિભાગ જુઓ')} <ArrowRight size={15} /></span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
