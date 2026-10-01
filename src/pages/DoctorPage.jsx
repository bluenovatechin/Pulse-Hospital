import React from 'react';
import { Calendar, Phone, Clock, MapPin, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageHero, Avatar, Icon, SectionHead } from '../components/ui';
import DoctorMini from '../components/DoctorMini';
import { Link } from '../router';
import { DOCTORS, DOCTOR_TYPES, DEPARTMENTS, FACILITIES, HOSPITAL_INFO } from '../data/hospitalContent';

// Full profile page for one doctor: /doctors/<slug>
export default function DoctorPage({ doctor: d, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const name = lang === 'en' ? d.name : d.nameGujarati;
  const firstName = d.name.split(' ').slice(0, 2).join(' ');
  const isResident = d.type === 'resident';
  const departments = DEPARTMENTS.filter((x) => d.departmentIds.includes(x.id));
  const facilities = FACILITIES.filter((f) => f.doctorIds.includes(d.id));
  const others = DOCTORS.filter((x) => x.id !== d.id);
  const does = lang === 'gu' && d.whatTheyDoGujarati ? d.whatTheyDoGujarati : d.whatTheyDo;
  const specialties = lang === 'gu' && d.specialtiesGujarati ? d.specialtiesGujarati : d.specialties;

  const profileCard = (
    <div className="card profile-card">
      <div className="profile-card-head">
        <Avatar doctor={d} size="lg" />
        <div>
          <strong>{d.name}</strong>
          <span className="gujarati-text">{d.nameGujarati}</span>
        </div>
      </div>
      <dl className="profile-facts">
        <div>
          <dt><Clock size={15} /> {t('Timings', 'સમય')}</dt>
          <dd>{t(d.timing, d.timingGujarati || d.timing)}</dd>
        </div>
        <div>
          <dt><MapPin size={15} /> {t('Where to find', 'ક્યાં મળવું')}</dt>
          <dd>{t(d.room, d.roomGujarati || d.room)}, {t('Pulse Hospital, 4th floor, City Centre', 'પલ્સ હોસ્પિટલ, ૪થો માળ, સીટી સેન્ટર')}</dd>
        </div>
        {!isResident && (
          <div>
            <dt><Building2 size={15} /> {t('Own hospital', 'સંલગ્ન હોસ્પિટલ')}</dt>
            <dd>{t(d.hospital, d.hospitalGujarati || d.hospital)}</dd>
          </div>
        )}
        <div>
          <dt><Phone size={15} /> {d.mobileFormatted ? t('Clinic line', 'સંપર્ક નંબર') : t('Hospital line', 'હોસ્પિટલ નંબર')}</dt>
          <dd>
            {d.mobileFormatted
              ? <a href={`tel:${d.mobileFormatted.replace(/\s/g, '')}`}>{d.mobileFormatted}</a>
              : <a href={HOSPITAL_INFO.phoneHref}>{HOSPITAL_INFO.appointmentNumber}</a>}
          </dd>
        </div>
      </dl>
      <Link to="book-appointment" param={d.slug} className="btn btn-primary btn-block">
        <Calendar size={17} /> {t(`Book with ${firstName}`, 'એપોઇન્ટમેન્ટ બુક કરો')}
      </Link>
    </div>
  );

  return (
    <div>
      <PageHero
        crumbs={[{ label: t('Doctors', 'ડૉક્ટરો'), to: 'doctors' }, { label: name }]}
        eyebrow={t(DOCTOR_TYPES[d.type].label, DOCTOR_TYPES[d.type].labelGu)}
        title={name}
        text={`${d.qualification} · ${t(d.designation, d.designationGujarati || d.designation)}`}
        facts={[
          { value: t(d.experience, d.experienceGujarati || d.experience), label: t('Experience', 'અનુભવ') },
          { value: isResident ? '24x7' : t('Mon–Sat', 'સોમ–શનિ'), label: isResident ? t('Emergency & ICU', 'ઇમરજન્સી & ICU') : t('OPD, 2 sessions', 'OPD, ૨ સત્ર') },
          { value: `${departments.length}`, label: t('Departments', 'વિભાગો') }
        ]}
        actions={
          <>
            <Link to="book-appointment" param={d.slug} className="btn btn-primary">
              <Calendar size={17} /> {t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
            </Link>
            <a className="btn btn-secondary" href={HOSPITAL_INFO.phoneHref}>
              <Phone size={17} /> {t('Call the hospital', 'હોસ્પિટલને કૉલ કરો')}
            </a>
          </>
        }
        aside={profileCard}
      />

      <section className="section">
        <div className="container-wide detail-layout">
          {/* One continuous profile: about, what they do, specialties */}
          <article className="detail-main prose" data-reveal>
            <h2>{t(`About ${d.name}`, `${d.nameGujarati} વિશે`)}</h2>
            <p className="lede">{t(d.bio, d.bioGujarati || d.bio)}</p>
            {lang === 'en' && d.bioGujarati && <p className="gujarati-text muted">{d.bioGujarati}</p>}

            <h3>{t(`What ${firstName} does`, 'તેઓ શું કરે છે')}</h3>
            <ul className="tick-list">
              {does.map((i) => <li key={i}><CheckCircle2 size={18} /> <span>{i}</span></li>)}
            </ul>

            <h3>{t('Specialties', 'વિશેષતા')}</h3>
            <p>{specialties.join(' · ')}</p>
          </article>

          <aside className="detail-side">
            {departments.length > 0 && (
              <div className="side-group" data-reveal>
                <h3>{t('Departments', 'વિભાગો')}</h3>
                <ul className="link-list">
                  {departments.map((x) => (
                    <li key={x.id}>
                      <Link to="departments" param={x.id}>
                        <Icon name={x.icon} size={18} /> {lang === 'en' ? x.title : (x.titleGujarati || x.title)} <ArrowRight size={15} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {facilities.length > 0 && (
              <div className="side-group" data-reveal>
                <h3>{t('Facilities they work in', 'સુવિધાઓ')}</h3>
                <ul className="link-list">
                  {facilities.map((f) => (
                    <li key={f.id}>
                      <Link to="facilities" param={f.id}>
                        <Icon name={f.icon} size={18} /> {lang === 'en' ? f.name : f.nameGu} <ArrowRight size={15} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {isResident && (
              <div className="callout blue" data-reveal>
                <Clock size={18} />
                <span>{t('In an emergency you don’t need an appointment: come straight to the 4th floor or call the hospital.', 'ઇમરજન્સીમાં એપોઇન્ટમેન્ટની જરૂર નથી: સીધા ૪થા માળે આવો અથવા હોસ્પિટલને કૉલ કરો.')}</span>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="section section--white">
        <div className="container-wide">
          <SectionHead eyebrow={t('Our doctors', 'અમારા ડૉક્ટરો')} title={t('Other doctors at Pulse Hospital', 'પલ્સ હોસ્પિટલના અન્ય ડૉક્ટરો')} />
          <div className="doc-row">
            {others.map((o) => <DoctorMini key={o.id} doctor={o} lang={lang} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
