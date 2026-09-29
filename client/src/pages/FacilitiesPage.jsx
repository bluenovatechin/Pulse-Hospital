import React, { useMemo, useState } from 'react';
import { CheckCircle2, LayoutGrid, Calendar, Phone } from 'lucide-react';
import FacilityCard from '../components/FacilityCard';
import { PageHero, SectionHead, Icon, delay } from '../components/ui';
import {
  FACILITIES, FACILITY_CATEGORIES, HOSPITAL_FACILITIES, HOSPITAL_INFO, PHOTOS
} from '../data/hospitalContent';

export default function FacilitiesPage({ onNavigate, onOpenFacility, onBook, lang = 'en' }) {
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
        crumbs={t('Facilities', 'સુવિધાઓ')}
        onHome={() => onNavigate('home')}
        eyebrow={t('Hospital facilities', 'હોસ્પિટલ સુવિધાઓ')}
        title={t('What we have, and what it means for you', 'અમારી સુવિધાઓ અને તમારા માટે તેનો અર્થ')}
        text={t(
          'From a ventilator ICU and in-house CT scan to modular theatres and private rooms — each facility below explains what it includes and who it is for.',
          'વેન્ટીલેટર ICU, ઈન-હાઉસ CT સ્કેનથી લઈને મોડ્યુલર OT અને પ્રાઇવેટ રૂમ સુધી — દરેક સુવિધાની વિગત નીચે.'
        )}
      >
        <div className="hero-stats">
          <span className="chip chip-dark"><span className="live-dot" style={{ color: 'var(--mint)' }} /> {open24} {t('facilities open 24x7', 'સુવિધાઓ ૨૪x૭')}</span>
          <span className="chip chip-dark">{FACILITIES.length} {t('facilities on one floor', 'સુવિધાઓ')}</span>
          <span className="chip chip-dark">{t('No transfer needed for CT or dialysis', 'CT કે ડાયાલીસીસ માટે બહાર જવાની જરૂર નથી')}</span>
        </div>
      </PageHero>

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
                <FacilityCard facility={f} onOpen={onOpenFacility} lang={lang} />
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
              <p>{t('Book an OPD consultation and the doctor will guide you — or call the helpline for anything urgent.', 'OPD કન્સલ્ટેશન બુક કરો અથવા હેલ્પલાઇન પર કૉલ કરો.')}</p>
            </div>
            <div className="row">
              <button className="btn-primary btn-lg" onClick={() => onBook(null)} style={{ background: '#fff', color: 'var(--brand-navy)', borderColor: '#fff' }}>
                <Calendar size={18} /> {t('Book consultation', 'કન્સલ્ટેશન બુક કરો')}
              </button>
              <a className="btn btn-lg btn-ghost-light" href={HOSPITAL_INFO.phoneHref}><Phone size={18} /> {t('Call', 'કૉલ')}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
