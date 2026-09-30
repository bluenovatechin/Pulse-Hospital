import React, { useEffect, useState } from 'react';
import { Calendar, Phone, ArrowRight, HeartPulse } from 'lucide-react';
import { PageHero, Icon, Avatar } from '../components/ui';
import { DEPARTMENTS, HOSPITAL_INFO, PHOTOS, getDoctor, getFacility } from '../data/hospitalContent';

export default function DepartmentsPage({ param, onNavigate, onOpenFacility, onBook, lang = 'en' }) {
  const [active, setActive] = useState(param || DEPARTMENTS[0].id);
  const t = (en, gu) => (lang === 'en' ? en : gu);

  // Deep link: #/departments/chest scrolls to that section
  useEffect(() => {
    if (!param) return;
    const el = document.getElementById(`dept-${param}`);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }, [param]);

  // Highlight the section currently in view
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace('dept-', ''));
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    DEPARTMENTS.forEach((d) => {
      const el = document.getElementById(`dept-${d.id}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const jump = (id) => {
    window.history.replaceState(null, '', `#/departments/${id}`);
    document.getElementById(`dept-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <PageHero
        photo={PHOTOS.icuBeds}
        photoAlt={t('ICU beds with bedside monitors', 'આઈ.સી.યુ. બેડ અને મોનિટર')}
        crumbs={t('Departments', 'વિભાગો')}
        onHome={() => onNavigate('home')}
        eyebrow={t('Departments', 'વિભાગો')}
        title={t('Find the right department for your condition', 'તમારી તકલીફ માટે યોગ્ય વિભાગ')}
        text={t(
          'Each department lists the conditions it treats, the services it offers, the facilities it relies on and the doctors you will meet.',
          'દરેક વિભાગમાં કઈ બીમારીની સારવાર થાય છે, કઈ સેવાઓ છે અને કયા ડૉક્ટરો છે તે જુઓ.'
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
            <button className="btn-primary" onClick={() => onBook(null)}>
              <Calendar size={17} /> {t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
            </button>
            <a className="btn btn-secondary" href={HOSPITAL_INFO.phoneHref}>
              <Phone size={17} /> {t('Call the hospital', 'હોસ્પિટલને કૉલ કરો')}
            </a>
          </>
        }
      />

      <section className="section">
        <div className="container-wide">
          {/* Mobile: horizontal jump bar */}
          <div className="dept-nav-mobile">
            <div className="filter-bar">
              {DEPARTMENTS.map((d) => (
                <button key={d.id} className="filter-btn" aria-pressed={active === d.id} onClick={() => jump(d.id)}>
                  <Icon name={d.icon} size={15} /> {lang === 'en' ? d.title : (d.titleGujarati || d.title)}
                </button>
              ))}
            </div>
          </div>

          <div className="dept-layout">
            {/* Desktop: sticky side nav */}
            <nav className="dept-nav" aria-label="Departments">
              {DEPARTMENTS.map((d) => (
                <button key={d.id} aria-current={active === d.id} onClick={() => jump(d.id)}>
                  <Icon name={d.icon} size={17} /> {lang === 'en' ? d.title : (d.titleGujarati || d.title)}
                </button>
              ))}
            </nav>

            <div>
              {DEPARTMENTS.map((d) => {
                const doctors = d.doctorIds.map(getDoctor).filter(Boolean);
                const facilities = d.facilityIds.map(getFacility).filter(Boolean);
                const bookable = doctors.find((doc) => doc.type === 'visiting');
                return (
                  <article key={d.id} id={`dept-${d.id}`} className="card dept-section" data-reveal>
                    <div className="dept-head">
                      <span className="icon-tile lg mint"><Icon name={d.icon} size={26} /></span>
                      <div>
                        <h2>{lang === 'en' ? d.title : d.titleGujarati}</h2>
                        <div className="gujarati-text muted" style={{ fontSize: 14 }}>{lang === 'en' ? d.titleGujarati : d.title}</div>
                        <p className="intro">{d.intro}</p>
                      </div>
                    </div>

                    <div className="dept-cols">
                      <div>
                        <h4>{t('Conditions treated', 'કઈ બીમારીની સારવાર')}</h4>
                        <div className="tag-cloud">{d.conditions.map((c) => <span key={c} className="chip chip-blue">{c}</span>)}</div>
                        {d.conditionsGu && <p className="gujarati-text muted" style={{ fontSize: 13, marginTop: 10 }}>{d.conditionsGu}</p>}
                      </div>
                      <div>
                        <h4>{t('Services & facilities', 'સેવાઓ & સુવિધાઓ')}</h4>
                        <div className="tag-cloud">
                          {d.services.map((s) => <span key={s} className="chip">{s}</span>)}
                          {facilities.map((f) => (
                            <button key={f.id} className="chip chip-mint" style={{ border: 'none' }} onClick={() => onOpenFacility(f.id)}>
                              <Icon name={f.icon} size={13} /> {lang === 'en' ? f.name : f.nameGu} <ArrowRight size={12} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="dept-foot">
                      <div>
                        <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 10, fontFamily: 'var(--font-body)' }}>
                          {t('Your doctors', 'ડૉક્ટરો')}
                        </h4>
                        {doctors.length > 0 ? (
                          <div className="mini-docs">
                            {doctors.map((doc) => (
                              <button key={doc.id} className="mini-doc" onClick={() => onNavigate('doctors', doc.id)}>
                                <Avatar doctor={doc} /> {lang === 'en' ? doc.name : doc.nameGujarati}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="muted" style={{ fontSize: 14 }}>{t('Visiting surgical team: call the helpline to schedule.', 'વિઝિટિંગ સર્જિકલ ટીમ: સમય માટે કૉલ કરો.')}</span>
                        )}
                      </div>
                      {d.id === 'emergency' || !bookable ? (
                        <a className="btn btn-emergency" href={HOSPITAL_INFO.phoneHref}><Phone size={16} /> {t('Call now', 'કૉલ કરો')}</a>
                      ) : (
                        <button className="btn-primary" onClick={() => onBook(bookable.id)}><Calendar size={16} /> {t('Book consultation', 'કન્સલ્ટેશન બુક કરો')}</button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
