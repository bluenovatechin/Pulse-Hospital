import React, { useState } from 'react';
import { Search, Calendar, Users } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import { PageHero, SectionHead, Avatar, Icon } from '../components/ui';
import { Link } from '../router';
import { DOCTORS, DEPARTMENTS, PHOTOS } from '../data/hospitalContent';

export default function DoctorsPage({ lang = 'en' }) {
  const [dept, setDept] = useState('all');
  const [query, setQuery] = useState('');
  const t = (en, gu) => (lang === 'en' ? en : gu);

  // Only offer department filters that actually have doctors
  const deptFilters = DEPARTMENTS.filter((d) => DOCTORS.some((doc) => doc.departmentIds.includes(d.id)));

  const q = query.trim().toLowerCase();
  const filtered = DOCTORS.filter((d) => {
    const inDept = dept === 'all' || d.departmentIds.includes(dept);
    const haystack = [d.name, d.nameGujarati, d.qualification, d.designation, d.hospital, ...d.specialties, ...d.whatTheyDo].join(' ').toLowerCase();
    return inDept && (!q || haystack.includes(q));
  });

  return (
    <div>
      <PageHero
        photo={PHOTOS.consult1}
        photoAlt={t('Doctor consultation room at Pulse Hospital', 'પલ્સ હોસ્પિટલનો કન્સલ્ટિંગ રૂમ')}
        crumbs={t('Doctors', 'ડૉક્ટરો')}
        eyebrow={t('Our doctors', 'અમારા ડૉક્ટરો')}
        title={t('Meet the doctors, and what each one does', 'ડૉક્ટરોને મળો: કોણ શું કરે છે')}
        text={t(
          `Our ${DOCTORS.length} doctors work as one team across the OPD, ICU and Emergency, day and night. Choose any of them to book a 30-minute visit.`,
          `અમારા ${DOCTORS.length} ડૉક્ટરો OPD, ICU અને ઇમરજન્સીમાં એક ટીમ તરીકે દિવસ-રાત કાર્યરત છે. કોઈપણ ડૉક્ટર સાથે ૩૦ મિનિટનો સ્લોટ બુક કરો.`
        )}
        facts={[
          { value: `${DOCTORS.length}`, label: t('Doctors on our panel', 'અમારા ડૉક્ટરો') },
          { value: t('Mon–Sat', 'સોમ–શનિ'), label: t('OPD, morning & evening', 'OPD, સવાર & સાંજ') },
          { value: '24x7', label: t('Emergency & ICU', 'ઇમરજન્સી & ICU') }
        ]}
        note={{
          icon: <Calendar size={20} />,
          title: t('Book a 30-minute OPD slot', '૩૦ મિનિટનો OPD સ્લોટ બુક કરો'),
          text: t('Monday to Saturday, morning or evening', 'સોમ થી શનિ, સવાર કે સાંજ')
        }}
        actions={
          <>
            <Link to="book-appointment" className="btn btn-primary">
              <Calendar size={17} /> {t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
            </Link>
            <button className="btn-secondary" onClick={() => document.querySelector('input[type="search"]')?.focus()}>
              <Search size={17} /> {t('Search by condition', 'બીમારી મુજબ શોધો')}
            </button>
          </>
        }
      />

      <section className="section">
        <div className="container-wide">
          <div className="row" style={{ marginBottom: 28, alignItems: 'stretch' }}>
            <div className="search" style={{ flex: '1 1 260px', maxWidth: 380 }}>
              <Search size={17} />
              <input
                type="search"
                className="form-input"
                placeholder={t('Search name, condition or skill (e.g. asthma)', 'નામ કે બીમારી શોધો')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search doctors"
              />
            </div>
            <div className="filter-bar" style={{ flex: '1 1 400px' }} role="toolbar" aria-label="Filter by department">
              <button className="filter-btn" aria-pressed={dept === 'all'} onClick={() => setDept('all')}>
                <Users size={15} /> {t('All', 'બધા')}
              </button>
              {deptFilters.map((d) => (
                <button key={d.id} className="filter-btn" aria-pressed={dept === d.id} onClick={() => setDept(d.id)}>
                  <Icon name={d.icon} size={15} /> {lang === 'en' ? d.title : (d.titleGujarati || d.title)}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <p className="muted">{t('No doctor matches that search.', 'કોઈ ડૉક્ટર મળ્યા નહીં.')}</p>
              <button className="link-arrow" style={{ marginTop: 10 }} onClick={() => { setQuery(''); setDept('all'); }}>{t('Clear filters', 'ફિલ્ટર દૂર કરો')}</button>
            </div>
          )}

          {filtered.length > 0 && (
            <>
              <h2 style={{ fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={16} color="var(--primary)" />
                {filtered.length === DOCTORS.length
                  ? t(`Our ${DOCTORS.length} doctors`, `અમારા ${DOCTORS.length} ડૉક્ટરો`)
                  : t(`${filtered.length} of ${DOCTORS.length} doctors`, `${DOCTORS.length} માંથી ${filtered.length} ડૉક્ટરો`)}
              </h2>
              <div className="doctor-grid">
                {filtered.map((d, i) => (
                  <div key={d.id} className="page-enter" style={{ animationDelay: `${i * 50}ms` }}>
                    <DoctorCard doctor={d} lang={lang} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Weekly timetable */}
      <section className="section section--white">
        <div className="container-wide">
          <SectionHead
            eyebrow={t('OPD timetable', 'OPD સમયપત્રક')}
            title={t('When each doctor is available', 'ડૉક્ટરો ક્યારે ઉપલબ્ધ છે')}
            text={t('All five doctors at a glance. Book a 30-minute slot to avoid waiting.', 'પાંચેય ડૉક્ટરો એક નજરમાં. રાહ ટાળવા સ્લોટ બુક કરો.')}
          />
          <div className="card table-wrap" data-reveal>
            <table className="timetable">
              <thead>
                <tr>
                  <th>{t('Doctor', 'ડૉક્ટર')}</th>
                  <th>{t('Focus', 'વિશેષતા')}</th>
                  <th>{t('Where', 'ક્યાં')}</th>
                  <th>{t('Hours', 'સમય')}</th>
                  <th style={{ textAlign: 'right' }}><span className="sr-only">{t('Book', 'બુક')}</span></th>
                </tr>
              </thead>
              <tbody>
                {DOCTORS.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <Link to="doctors" param={d.slug} className="row" style={{ background: 'none', border: 'none', gap: 10, flexWrap: 'nowrap', textAlign: 'left' }}>
                        <Avatar doctor={d} size="sm" />
                        <span>
                          <strong style={{ color: 'var(--brand-navy)', display: 'block' }}>{lang === 'en' ? d.name : d.nameGujarati}</strong>
                          <span style={{ fontSize: 12.5, color: 'var(--primary)', fontWeight: 600 }}>{d.qualification}</span>
                        </span>
                      </Link>
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {(lang === 'gu' && d.specialtiesGujarati ? d.specialtiesGujarati : d.specialties).slice(0, 2).join(', ')}
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 600 }}>
                      {lang === 'en' ? d.room : (d.roomGujarati || d.room)}
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {lang === 'en' ? d.timing : (d.timingGujarati || d.timing)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to="book-appointment" param={d.slug} className="btn btn-primary btn-sm"><Calendar size={14} /> {t('Book', 'બુક')}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
