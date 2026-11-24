import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Phone, HeartPulse, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageHero, Icon, Avatar, Photo, RepBadge } from '../components/ui';
import { Link, scrollToId } from '../router';
import { DEPARTMENTS, HOSPITAL_INFO, PHOTOS, getDoctor, getFacility } from '../data/hospitalContent';
import { facilityLink } from '../data/siteStructure';

// All departments on one page. Each has its own section (#critical-care,
// #kidney, ...); a side list (desktop) or chips (phone) jump between them.
export default function DepartmentsPage({ lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const gu = lang === 'gu';
  const [active, setActive] = useState(DEPARTMENTS[0].id);
  const chipsRef = useRef(null);
  // True while the page glides to a department after a tap. Chrome stops a
  // page's smooth scroll if another area (the chip row) starts scrolling, so
  // the chip row and the highlight wait until the page has arrived.
  const jumping = useRef(false);

  // Keep the active chip in view inside the chip row (phones)
  useEffect(() => {
    if (jumping.current) return;
    const row = chipsRef.current;
    const chip = row && row.querySelector('[aria-current="true"]');
    if (!row || !chip || getComputedStyle(row).display === 'none') return;
    const left = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active]);

  // Highlight the department being read
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0] && !jumping.current) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    DEPARTMENTS.forEach((d) => {
      const el = document.getElementById(d.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const jump = (e, id) => {
    e.preventDefault();
    window.history.replaceState(null, '', `#${id}`);
    jumping.current = true;
    setActive(id);
    scrollToId(id);
    // Release once the page stops moving (scrollend, with a fallback)
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener('scrollend', finish);
      jumping.current = false;
      setActive((a) => a);
      const row = chipsRef.current;
      const chip = row && row.querySelector(`a[href="#${id}"]`);
      if (row && chip && getComputedStyle(row).display !== 'none') {
        row.scrollTo({ left: Math.max(0, chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2), behavior: 'smooth' });
      }
    };
    window.addEventListener('scrollend', finish);
    setTimeout(finish, 1200);
  };

  return (
    <div>
      <PageHero
        photo={PHOTOS.icuBeds}
        photoAlt={t('ICU beds with bedside monitors', 'આઈ.સી.યુ. બેડ અને મોનિટર')}
        crumbs={t('Departments', 'વિભાગો')}
        eyebrow={t('Departments', 'વિભાગો')}
        title={t('Find the right department for your condition', 'તમારી તકલીફ માટે યોગ્ય વિભાગ')}
        text={t(
          'Nine departments, one floor. See what each one treats, the doctors you will meet and the facilities behind it.',
          'નવ વિભાગો, એક જ માળે. દરેક વિભાગમાં કઈ સારવાર થાય છે, કયા ડૉક્ટરો છે અને કઈ સુવિધાઓ છે તે જુઓ.'
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

      {/* Phone: department chips */}
      <nav className="dp-chips" data-sticky aria-label={t('Departments', 'વિભાગો')}>
        <div className="container-wide dp-chips-row" ref={chipsRef}>
          {DEPARTMENTS.map((d) => (
            <a key={d.id} href={`#${d.id}`} onClick={(e) => jump(e, d.id)} aria-current={active === d.id ? 'true' : undefined}>
              <Icon name={d.icon} size={15} /> {gu ? d.titleGujarati : d.title}
            </a>
          ))}
        </div>
      </nav>

      <section className="section dp-wrap">
        <div className="container-wide dp-layout">
          {/* Desktop: sticky side list */}
          <nav className="dp-side" aria-label={t('Departments', 'વિભાગો')}>
            <p className="dp-side-label">{t('Departments', 'વિભાગો')}</p>
            {DEPARTMENTS.map((d) => (
              <a key={d.id} href={`#${d.id}`} onClick={(e) => jump(e, d.id)} aria-current={active === d.id ? 'true' : undefined}>
                <Icon name={d.icon} size={17} /> <span>{gu ? d.titleGujarati : d.title}</span>
              </a>
            ))}
          </nav>

          <div className="dp-list">
            {DEPARTMENTS.map((d) => {
              const doctors = d.doctorIds.map(getDoctor).filter(Boolean);
              const facilities = d.facilityIds.map(getFacility).filter(Boolean);
              const bookable = doctors.find((doc) => doc.type === 'visiting');
              const isEmergency = d.id === 'emergency';
              return (
                <article key={d.id} id={d.id} className="dp-card" data-reveal>
                  <header className="dp-head">
                    <div className="dp-head-text">
                      <span className="dp-icon"><Icon name={d.icon} size={22} /></span>
                      <div>
                        <h2>{gu ? d.titleGujarati : d.title}</h2>
                        <p>{d.intro}</p>
                      </div>
                    </div>
                    {d.photo && (
                      <span className="dp-photo">
                        <Photo src={d.photo} alt="" sizes="(max-width: 720px) 100vw, 280px" />
                        <RepBadge src={d.photo} />
                      </span>
                    )}
                  </header>

                  <div className="dp-body">
                    <div>
                      <h3>{t('Conditions treated', 'કઈ બીમારીની સારવાર')}</h3>
                      {gu && d.conditionsGu ? (
                        <p className="dp-gu">{d.conditionsGu}</p>
                      ) : (
                        <ul className="dp-ticks">
                          {d.conditions.map((c) => <li key={c}><CheckCircle2 size={16} /> {c}</li>)}
                        </ul>
                      )}
                    </div>
                    <div>
                      <h3>{t('Services', 'સેવાઓ')}</h3>
                      <ul className="dp-tags">
                        {d.services.map((s) => <li key={s}>{s}</li>)}
                      </ul>
                      {facilities.length > 0 && (
                        <>
                          <h3 className="dp-sub">{t('Facilities used', 'ઉપયોગમાં લેવાતી સુવિધાઓ')}</h3>
                          <ul className="dp-links">
                            {facilities.map((f) => (
                              <li key={f.id}>
                                <Link {...facilityLink(f.id)}>{gu ? f.nameGu : f.name} <ArrowRight size={13} /></Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>

                  <footer className="dp-foot">
                    <div className="dp-docs">
                      {doctors.length > 0 ? doctors.map((doc) => (
                        <Link key={doc.id} to="doctors" param={doc.slug} className="dp-doc">
                          <Avatar doctor={doc} size="sm" />
                          <span>
                            <strong>{gu ? doc.nameGujarati : doc.name}</strong>
                            <small>{doc.qualification || t(doc.designation, doc.designationGujarati || doc.designation)}</small>
                          </span>
                        </Link>
                      )) : (
                        <p className="dp-note">{t('Surgery is done by visiting surgical teams. Call the hospital to schedule a consultation.', 'સર્જરી વિઝિટિંગ સર્જિકલ ટીમ દ્વારા થાય છે. સમય માટે હોસ્પિટલને કૉલ કરો.')}</p>
                      )}
                    </div>
                    {isEmergency || !bookable ? (
                      <a className={`btn ${isEmergency ? 'btn-emergency' : 'btn-secondary'}`} href={HOSPITAL_INFO.phoneHref}>
                        <Phone size={16} /> {isEmergency ? t('Call emergency', 'ઇમરજન્સી કૉલ') : t('Call the hospital', 'હોસ્પિટલને કૉલ કરો')}
                      </a>
                    ) : (
                      <Link to="book-appointment" param={bookable.slug} className="btn btn-primary">
                        <Calendar size={16} /> {t('Book a consultation', 'એપોઇન્ટમેન્ટ બુક કરો')}
                      </Link>
                    )}
                  </footer>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
