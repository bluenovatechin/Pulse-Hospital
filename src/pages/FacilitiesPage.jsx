import React, { useMemo, useState } from 'react';
import { CheckCircle2, LayoutGrid, Calendar, Phone, Scan, Eye } from 'lucide-react';
import FacilityCard from '../components/FacilityCard';
import { PageHero, SectionHead, Icon, delay } from '../components/ui';
import { Link } from '../router';
import {
  FACILITIES, FACILITY_CATEGORIES, HOSPITAL_FACILITIES, HOSPITAL_INFO, PHOTOS, BED_STATS
} from '../data/hospitalContent';

export default function FacilitiesPage({ lang = 'en' }) {
  const [category, setCategory] = useState('all');
  const t = (en, gu) => (lang === 'en' ? en : gu);

  const counts = useMemo(() => {
    const c = { all: FACILITIES.length };
    FACILITIES.forEach((f) => { c[f.category] = (c[f.category] || 0) + 1; });
    return c;
  }, []);

  const shown = category === 'all' ? FACILITIES : FACILITIES.filter((f) => f.category === category);
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

      <section className="section">
        <div className="container-wide">
          {/* Category filter */}
          <div className="filter-bar" role="toolbar" aria-label="Filter facilities" style={{ marginBottom: 28 }}>
            <button className="filter-btn" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
              <LayoutGrid size={15} /> {t('All', 'બધી')} <span className="count">{counts.all}</span>
            </button>
            {FACILITY_CATEGORIES.map((c) => (
              <button key={c.id} className="filter-btn" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
                <Icon name={c.icon} size={15} /> {t(c.label, c.labelGu)} <span className="count">{counts[c.id] || 0}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-3" key={category}>
            {shown.map((f, i) => (
              <div key={f.id} className="page-enter" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
                <FacilityCard facility={f} lang={lang} />
              </div>
            ))}
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
          <div className="checklist">
            {HOSPITAL_FACILITIES.map((f, i) => (
              <div className="check-item" key={f.en} data-reveal style={delay(i, 30)}>
                <CheckCircle2 size={18} />
                <div>
                  <strong className="gujarati-text">{f.gu}</strong>
                  <span>{f.en}</span>
                </div>
              </div>
            ))}
          </div>
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
