import React, { useState } from 'react';
import { Search, Calendar, Siren, Users, Stethoscope, UserCheck, Clock } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import { PageHero, SectionHead, Avatar, Icon } from '../components/ui';
import { DOCTORS, DEPARTMENTS, HOSPITAL_INFO, PHOTOS } from '../data/hospitalContent';

export default function DoctorsPage({ onNavigate, onOpenDoctor, onBook, lang = 'en' }) {
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

  const groups = ['visiting', 'resident']
    .map((type) => ({ type, doctors: filtered.filter((d) => d.type === type) }))
    .filter((g) => g.doctors.length);

  return (
    <div>
      <PageHero
        photo={PHOTOS.consult1}
        crumbs={t('Doctors', 'ડૉક્ટરો')}
        onHome={() => onNavigate('home')}
        eyebrow={t('Our Specialist Doctors', 'અમારા નિષ્ણાત ડૉક્ટરો')}
        eyebrowIcon={<Stethoscope size={14} />}
        title={t('Meet the doctors, and what each one does', 'ડૉક્ટરોને મળો: કોણ શું કરે છે')}
        text={t(
          'Senior MD consultants see patients in the OPD and lead ICU care. Resident medical officers are on duty in Emergency and ICU 24x7.',
          'એમ.ડી. કન્સલ્ટન્ટ OPD અને ICU સંભાળે છે. રેસિડેન્ટ ડૉક્ટરો ૨૪ કલાક ઇમરજન્સી અને ICUમાં હાજર હોય છે.'
        )}
        cardTitle={t('Clinical Faculty Telemetry', 'તબીબી પેનલ અને OPD ટેલિમેટ્રી')}
        cardBadge={t('Slots Open For Next Week', 'આગામી સપ્તાહનું બુકિંગ ચાલુ')}
        cardIcon={<UserCheck size={18} />}
        stats={[
          { value: `${DOCTORS.length}`, label: t('Specialist Doctors', 'નિષ્ણાત તબીબો'), sub: t('MD & Chest Specialists', 'MD અને ફેફસાંના તબીબ') },
          { value: '24x7', label: t('ICU Cover', 'ICU કવરેજ'), sub: t('Resident Doctors On Duty', 'રેસિડેન્ટ ડૉક્ટર્સ હાજર') },
          { value: '30 min', label: t('Slot Windows', 'સ્લોટ સમય'), sub: t('Dedicated Consultation', 'વ્યક્તિગત તપાસ') },
          { value: '4 Suites', label: t('OPD Floor (4th)', 'OPD ફ્લોર (૪થો)'), sub: t('Suites 401 to 404', 'સુઇટ ૪૦૧ થી ૪૦૪') }
        ]}
        highlights={[
          t('Book 30-min consultation slots online for next week (Mon - Sat)', 'આગામી સપ્તાહ (સોમ - શનિ) માટે ૩૦ મિનિટનો સ્લોટ ઓનલાઇન બુક કરો'),
          t('Consultation hours: 09:00 AM - 01:00 PM & 04:30 PM - 07:30 PM', 'તપાસ સમય: સવારે ૦૯:૦૦ - ૦૧:૦૦ અને સાંજે ૦૪:૩૦ - ૦૭:૩૦'),
          t('Emergency trauma cases admitted immediately without prior appointment', 'ઇમરજન્સી અકસ્માત કેસોમાં એપોઇન્ટમેન્ટ વગર ૨૪ કલાક તાત્કાલિક સારવાર')
        ]}
        actions={
          <>
            <button className="btn btn-primary" onClick={() => onBook(null)}>
              <Calendar size={17} /> {t('Book Doctor Slot', 'સ્લોટ બુક કરો')}
            </button>
            <button 
              className="btn btn-ghost-light" 
              onClick={() => document.querySelector('input[type="search"]')?.focus()}
            >
              <Search size={17} /> {t('Search by Condition', 'બીમારી મુજબ શોધો')}
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

          {groups.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <p className="muted">{t('No doctor matches that search.', 'કોઈ ડૉક્ટર મળ્યા નહીં.')}</p>
              <button className="link-arrow" style={{ marginTop: 10 }} onClick={() => { setQuery(''); setDept('all'); }}>{t('Clear filters', 'ફિલ્ટર દૂર કરો')}</button>
            </div>
          )}

          {groups.map((g) => (
            <div key={g.type} style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                {g.type === 'resident' ? <Siren size={16} color="var(--pulse-red)" /> : <Calendar size={16} color="var(--primary)" />}
                {g.type === 'resident'
                  ? t('24x7 Emergency & ICU doctors', '૨૪x૭ ઇમરજન્સી & ICU ડૉક્ટરો')
                  : t('Consultants: book an OPD slot', 'કન્સલ્ટન્ટ: OPD સ્લોટ બુક કરો')}
                <span className="chip" style={{ fontSize: 11 }}>{g.doctors.length}</span>
              </h3>
              <div className="grid grid-3">
                {g.doctors.map((d, i) => (
                  <div key={d.id} className="page-enter" style={{ animationDelay: `${i * 50}ms` }}>
                    <DoctorCard doctor={d} lang={lang} onBook={onBook} onOpenProfile={onOpenDoctor} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly timetable */}
      <section className="section section--white">
        <div className="container-wide">
          <SectionHead
            eyebrow={t('OPD timetable', 'OPD સમયપત્રક')}
            title={t('When each doctor is available', 'ડૉક્ટરો ક્યારે ઉપલબ્ધ છે')}
            text={t('Consultants see OPD patients Monday to Saturday. Book a 30-minute slot to avoid waiting.', 'સોમથી શનિ OPD. રાહ ટાળવા સ્લોટ બુક કરો.')}
          />
          <div className="card table-wrap" data-reveal>
            <table className="timetable">
              <thead>
                <tr>
                  <th>{t('Doctor', 'ડૉક્ટર')}</th>
                  <th>{t('Focus', 'વિશેષતા')}</th>
                  <th>{t('Where', 'ક્યાં')}</th>
                  <th>{t('Hours', 'સમય')}</th>
                  <th style={{ textAlign: 'right' }}></th>
                </tr>
              </thead>
              <tbody>
                {DOCTORS.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <button className="row" style={{ background: 'none', border: 'none', gap: 10, flexWrap: 'nowrap', textAlign: 'left' }} onClick={() => onOpenDoctor(d.id)}>
                        <Avatar doctor={d} size="sm" />
                        <span>
                          <strong style={{ color: 'var(--brand-navy)', display: 'block' }}>{lang === 'en' ? d.name : d.nameGujarati}</strong>
                          <span style={{ fontSize: 12.5, color: 'var(--primary)', fontWeight: 600 }}>{d.qualification}</span>
                        </span>
                      </button>
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
                      {d.type === 'visiting' ? (
                        <button className="btn-primary btn-sm" onClick={() => onBook(d.id)}><Calendar size={14} /> {t('Book', 'બુક')}</button>
                      ) : (
                        <a className="btn btn-sm btn-emergency" href={HOSPITAL_INFO.phoneHref}><Siren size={14} /> 24x7</a>
                      )}
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
