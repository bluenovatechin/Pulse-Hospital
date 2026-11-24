import React from 'react';
import { CheckCircle2, Calendar, Phone, Scan, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { PageHero, SectionHead, Icon, Avatar, Photo, RepBadge } from '../components/ui';
import { Link } from '../router';
import useSectionNav from '../hooks/useSectionNav';
import {
  FACILITIES, HOSPITAL_FACILITIES, HOSPITAL_INFO, PHOTOS, BED_STATS, getFacility, getDoctor
} from '../data/hospitalContent';
import { FACILITY_PAGES, FACILITY_GROUP_IDS, FACILITY_PAGE_IDS, AMENITY_IDS } from '../data/siteStructure';

const unique = (list) => [...new Map(list.map((x) => [x.id, x])).values()];

// All facilities on one page, like the Departments page: each facility group
// is a section (#icu, #lab, ...) with a side list (desktop) or chips (phone).
// ICU, Emergency, Dialysis and CT also have a detailed page of their own.
export default function FacilitiesPage({ lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const gu = lang === 'gu';
  const groups = FACILITY_GROUP_IDS.map(getFacility);
  const amenities = AMENITY_IDS.map(getFacility);
  const { active, chipsRef, jump } = useSectionNav([...FACILITY_GROUP_IDS, 'more-services']);
  // Short label for the side list and chips
  const short = (f) => (gu ? f.nameGu : f.name.replace(/\s*\(.*\)$/, ''));
  const open24 = FACILITIES.filter((f) => f.is24x7).length;

  return (
    <div>
      <PageHero
        photo={PHOTOS.ot1}
        photoAlt={t('Modular operation theatre at Pulse Hospital', 'પલ્સ હોસ્પિટલનું મોડ્યુલર ઓપરેશન થીયેટર')}
        crumbs={t('Facilities', 'સુવિધાઓ')}
        eyebrow={t('Facilities', 'સુવિધાઓ')}
        title={t('What we have, and what it means for you', 'અમારી સુવિધાઓ અને તમારા માટે તેનો અર્થ')}
        text={t(
          'From a 30-bed ventilator ICU and in-house CT scan to modular theatres, 24x7 dialysis, pathology and comfortable rooms: 41 total beds on one floor in Modasa.',
          '૩૦-બેડ વેન્ટીલેટર ICU, ઈન-હાઉસ CT સ્કેન, મોડ્યુલર OT, ૨૪ કલાક ડાયાલીસીસ, લેબ અને આરામદાયક રૂમ: મોડાસામાં કુલ ૪૧ બેડની અદ્યતન સુવિધા.'
        )}
        facts={[
          { value: `${BED_STATS.total}`, label: t('Total Hospital Beds', 'કુલ હોસ્પિટલ બેડ') },
          { value: `${BED_STATS.icuTotal}`, label: t('Critical Care Beds', 'ક્રિટિકલ કેર બેડ') },
          { value: `${open24}`, label: t('24x7 Services', '૨૪ કલાક સેવાઓ') }
        ]}
        note={{
          icon: <Scan size={20} />,
          title: t('In-house CT scan', 'ઈન-હાઉસ સીટી સ્કેન'),
          text: t('Modasa CT Scan Centre, on the same premises', 'મોડાસા CT સ્કેન સેન્ટર, એ જ પરિસરમાં')
        }}
        actions={
          <>
            <Link to="book-appointment" className="btn btn-primary">
              <Calendar size={17} /> {t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
            </Link>
            <Link to="gallery" className="btn btn-secondary">
              <Eye size={17} /> {t('See the photo tour', 'ફોટો ટૂર જુઓ')}
            </Link>
          </>
        }
      />

      {/* Phone: facility chips */}
      <nav className="dp-chips" data-sticky aria-label={t('Facilities', 'સુવિધાઓ')}>
        <div className="container-wide dp-chips-row" ref={chipsRef}>
          {groups.map((f) => (
            <a key={f.id} href={`#${f.id}`} onClick={(e) => jump(e, f.id)} aria-current={active === f.id ? 'true' : undefined}>
              <Icon name={f.icon} size={15} /> {short(f)}
            </a>
          ))}
          <a href="#more-services" onClick={(e) => jump(e, 'more-services')} aria-current={active === 'more-services' ? 'true' : undefined}>
            <Sparkles size={15} /> {t('More services', 'અન્ય સેવાઓ')}
          </a>
        </div>
      </nav>

      <section className="section dp-wrap">
        <div className="container-wide dp-layout">
          {/* Desktop: sticky side list */}
          <nav className="dp-side" aria-label={t('Facilities', 'સુવિધાઓ')}>
            <p className="dp-side-label">{t('Facilities', 'સુવિધાઓ')}</p>
            {groups.map((f) => (
              <a key={f.id} href={`#${f.id}`} onClick={(e) => jump(e, f.id)} aria-current={active === f.id ? 'true' : undefined}>
                <Icon name={f.icon} size={17} /> <span>{short(f)}</span>
              </a>
            ))}
            <a href="#more-services" onClick={(e) => jump(e, 'more-services')} aria-current={active === 'more-services' ? 'true' : undefined}>
              <Sparkles size={17} /> <span>{t('More services', 'અન્ય સેવાઓ')}</span>
            </a>
          </nav>

          <div className="dp-list">
            {groups.map((f) => {
              const members = (FACILITY_PAGES[f.id] || []).map(getFacility).filter(Boolean);
              const all = [f, ...members];
              const doctors = unique(all.flatMap((x) => x.doctorIds.map(getDoctor).filter(Boolean)));
              const ownPage = FACILITY_PAGE_IDS.includes(f.id);
              const isEmergency = f.id === 'emergency';
              return (
                <article key={f.id} id={f.id} className="dp-card fac-card" data-reveal>
                  <header className="dp-head">
                    <div className="dp-head-text">
                      <span className="dp-icon"><Icon name={f.icon} size={22} /></span>
                      <div>
                        <h2>
                          {gu ? f.nameGu : f.name}
                          {f.is24x7 && !/24\s*x\s*7/i.test(f.name) && <span className="fp-tag">24×7</span>}
                        </h2>
                        <p>{gu ? (f.summaryGu || f.summary) : f.summary}</p>
                      </div>
                    </div>
                    {f.photo && (
                      <span className="dp-photo">
                        <Photo src={f.photo} alt={f.name} sizes="(max-width: 720px) 100vw, 280px" />
                        <RepBadge src={f.photo} />
                      </span>
                    )}
                  </header>

                  <div className="dp-body">
                    <div>
                      <h3>{t("What's included", 'શું સમાવિષ્ટ છે')}</h3>
                      <ul className="dp-ticks">
                        {f.includes.map((i) => <li key={i}><CheckCircle2 size={16} /> {i}</li>)}
                      </ul>
                    </div>
                    <div>
                      {f.goodFor && (
                        <>
                          <h3>{t("Who it's for", 'કોના માટે ઉપયોગી')}</h3>
                          <p className="fac-for">{f.goodFor}</p>
                        </>
                      )}
                      {members.map((m) => (
                        <div key={m.id} id={m.id} className="fac-member">
                          <h3 className="dp-sub">
                            <Icon name={m.icon} size={16} /> {gu ? m.nameGu : m.name}
                            {m.is24x7 && !/24\s*x\s*7/i.test(m.name) && <span className="fp-tag">24×7</span>}
                          </h3>
                          <p>{gu ? (m.summaryGu || m.summary) : m.summary}</p>
                          {m.includes.length > 0 && (
                            <ul className="dp-tags">
                              {m.includes.slice(0, 6).map((i) => <li key={i}>{i}</li>)}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <footer className="dp-foot">
                    <div className="dp-docs">
                      {doctors.map((doc) => (
                        <Link key={doc.id} to="doctors" param={doc.slug} className="dp-doc">
                          <Avatar doctor={doc} size="sm" />
                          <span>
                            <strong>{gu ? doc.nameGujarati : doc.name}</strong>
                            <small>{doc.qualification || t(doc.designation, doc.designationGujarati || doc.designation)}</small>
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="fac-actions">
                      {ownPage && (
                        <Link to="facilities" param={f.id} className="btn btn-secondary">
                          {t('Full details', 'વધુ વિગત')} <ArrowRight size={16} />
                        </Link>
                      )}
                      {isEmergency || f.is24x7 ? (
                        <a className={`btn ${isEmergency ? 'btn-emergency' : 'btn-primary'}`} href={HOSPITAL_INFO.phoneHref}>
                          <Phone size={16} /> {isEmergency ? t('Call emergency', 'ઇમરજન્સી કૉલ') : t('Call the hospital', 'હોસ્પિટલને કૉલ કરો')}
                        </a>
                      ) : (
                        <Link to="book-appointment" className="btn btn-primary">
                          <Calendar size={16} /> {t('Book a consultation', 'એપોઇન્ટમેન્ટ બુક કરો')}
                        </Link>
                      )}
                    </div>
                  </footer>
                </article>
              );
            })}

            {/* Smaller services */}
            <section id="more-services" className="fac-more" aria-labelledby="more-services-title">
              <h2 id="more-services-title">{t('Everyday comforts and services', 'રોજિંદી સુવિધાઓ અને સેવાઓ')}</h2>
              <div className="amenity-grid">
                {amenities.map((f) => (
                  <article key={f.id} id={f.id} className="amenity" data-reveal>
                    <span className="amenity-icon"><Icon name={f.icon} size={20} /></span>
                    <div>
                      <h3>
                        {lang === 'en' ? f.name : f.nameGu}
                        {f.is24x7 && !/24\s*x\s*7/i.test(f.name) && <span className="fp-tag">24×7</span>}
                      </h3>
                      <p>{lang === 'en' ? f.summary : (f.summaryGu || f.summary)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* Bed Distribution section */}
      <section className="section" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="container-wide">
          <SectionHead
            eyebrow={t('Inpatient Infrastructure', 'ઇનપેશન્ટ ઇન્ફ્રાસ્ટ્રક્ચર')}
            title={t('41-Bed Capacity & Ward Breakdown', '૪૧ બેડની હોસ્પિટલ ક્ષમતા અને વોર્ડ વિતરણ')}
            text={t('Pulse Hospital is structured with 30 high-dependency critical care beds, dedicated isolation, and well-appointed private and twin rooms.', 'પલ્સ હોસ્પિટલમાં ૩૦ બેડનું એડવાન્સ ક્રિટિકલ કેર યુનિટ, આઈસોલેશન અને શાંત પ્રાઇવેટ તેમજ ટ્વીન રૂમ ઉપલબ્ધ છે.')}
          />
          <div className="grid grid-3" style={{ marginTop: 28, gap: 20 }}>
            {BED_STATS.breakdown.map((b, i) => (
              <div key={b.key} className="card card-hover" style={{ padding: 24, borderTop: '4px solid var(--primary)', background: '#fff', animationDelay: `${i * 45}ms` }} data-reveal>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="type-tag" style={{ background: 'var(--mint-soft)', color: 'var(--primary)', fontWeight: 600 }}>{b.tag}</span>
                  <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--brand-navy)' }}>
                    {b.count} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>{t(b.key === 'deluxe' || b.key === 'twin' ? 'Rooms' : 'Beds', b.key === 'deluxe' || b.key === 'twin' ? 'રૂમ' : 'બેડ')}</span>
                  </span>
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--brand-navy)' }}>{lang === 'en' ? b.labelEn : b.labelGu}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-body)', lineHeight: 1.5, margin: 0 }}>{lang === 'en' ? b.descEn : b.descGu}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brochure checklist */}
      <section className="section section--white">
        <div className="container-wide">
          <SectionHead
            eyebrow={t('At a glance', 'એક નજરમાં')}
            title={t('The full facility checklist', 'હોસ્પિટલમાં ઉપલબ્ધ મુખ્ય સુવિધાઓ')}
            text={t('As printed in the Pulse Hospital brochure, in Gujarati and English.', 'પલ્સ હોસ્પિટલની બ્રોશર મુજબ.')}
          />
          <details className="checklist-toggle" data-reveal>
            <summary>
              {t(`Show the full brochure checklist (${HOSPITAL_FACILITIES.length})`, `બ્રોશરની પૂરી યાદી જુઓ (${HOSPITAL_FACILITIES.length})`)}
            </summary>
            <div className="checklist">
              {HOSPITAL_FACILITIES.map((f) => (
                <div className="check-item" key={f.en}>
                  <CheckCircle2 size={18} />
                  <div>
                    <strong className="gujarati-text">{f.gu}</strong>
                    <span>{f.en}</span>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container-wide">
          <div className="cta-band" data-reveal>
            <div>
              <h3>{t('Not sure which facility you need?', 'કઈ સુવિધા જોઈએ ખબર નથી?')}</h3>
              <p>{t('Book an OPD consultation and the doctor will guide you, or call the helpline for anything urgent.', 'OPD કન્સલ્ટેશન બુક કરો અથવા હેલ્પલાઇન પર કૉલ કરો.')}</p>
            </div>
            <div className="row">
              <Link to="book-appointment" className="btn btn-primary btn-lg" style={{ background: '#fff', color: 'var(--brand-navy)', borderColor: '#fff' }}>
                <Calendar size={18} /> {t('Book consultation', 'કન્સલ્ટેશન બુક કરો')}
              </Link>
              <a className="btn btn-lg btn-ghost-light" href={HOSPITAL_INFO.phoneHref}><Phone size={18} /> {t('Call', 'કૉલ')}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
