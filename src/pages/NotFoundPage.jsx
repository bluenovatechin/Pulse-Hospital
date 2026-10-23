import React, { useState } from 'react';
import {
  Search,
  Home,
  PhoneCall,
  Stethoscope,
  Building2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  FileQuestion
} from 'lucide-react';
import { Link } from '../router';
import { DOCTORS, FACILITIES, HOSPITAL_INFO } from '../data/hospitalContent';

export default function NotFoundPage({ lang = 'en' }) {
  const [query, setQuery] = useState('');
  const t = (en, gu) => (lang === 'en' ? en : gu);

  // Searchable index of hospital destinations
  const searchableDestinations = [
    { title: 'Home Page', titleGu: 'મુખ્ય પૃષ્ઠ', path: 'home', category: 'Navigation', desc: 'Main hospital overview and key services' },
    { title: 'Find a Specialist Doctor', titleGu: 'તબીબોની યાદી', path: 'doctors', category: 'Doctors', desc: 'Full-time physicians and visiting specialists' },
    { title: 'Book OPD Appointment', titleGu: 'ઓપીડી એપોઇન્ટમેન્ટ બુક કરો', path: 'book-appointment', category: 'Booking', desc: 'Select doctor and reserve 30-min consultation slot' },
    { title: 'ICU & Emergency Facilities', titleGu: 'ICU અને ઇમરજન્સી સુવિધાઓ', path: 'facilities', category: 'Facilities', desc: '30-bed intensive care units and 24x7 trauma desk' },
    { title: 'Departments & Clinical Treatments', titleGu: 'વિભાગો અને સારવાર', path: 'departments', category: 'Departments', desc: 'Medicine, Pulmonology, Critical Care, Dialysis & Surgery' },
    { title: 'Contact & Reception', titleGu: 'સંપર્ક અને રીસેપ્શન', path: 'contact', category: 'Contact', desc: 'Hospital address, helpline numbers, and location map' },
    { title: 'Privacy Policy', titleGu: 'ગોપનીયતા નીતિ', path: 'privacy', category: 'Legal', desc: 'Patient health data protection and privacy standards' },
    { title: 'Terms & Conditions', titleGu: 'નિયમો અને શરતો', path: 'terms', category: 'Legal', desc: 'Hospital service agreements and medical disclaimers' },
    // Index each doctor
    ...DOCTORS.map(doc => ({
      title: `${doc.name} (${doc.qualification}) - ${doc.specialties.join(', ')}`,
      titleGu: `${doc.nameGujarati} - ${doc.specialtiesGujarati ? doc.specialtiesGujarati.join(', ') : ''}`,
      path: `doctors/${doc.slug}`,
      category: 'Doctor',
      desc: `Room ${doc.room} • ${doc.timing || 'OPD Consultation'}`
    })),
    // Index facilities
    ...FACILITIES.map(fac => ({
      title: fac.name,
      titleGu: fac.nameGujarati,
      path: `facilities/${fac.id}`,
      category: 'Facility',
      desc: fac.summary || fac.description || fac.name
    }))
  ];

  const trimmed = query.trim().toLowerCase();
  const searchResults = trimmed
    ? searchableDestinations.filter(item =>
        item.title.toLowerCase().includes(trimmed) ||
        item.titleGu.toLowerCase().includes(trimmed) ||
        item.category.toLowerCase().includes(trimmed) ||
        item.desc.toLowerCase().includes(trimmed)
      ).slice(0, 6)
    : [];

  const quickPaths = [
    {
      title: t('Home Page', 'મુખ્ય પૃષ્ઠ'),
      desc: t('Return to hospital overview & services', 'હોસ્પિટલ મુખ્ય પૃષ્ઠ પર પાછા જાઓ'),
      to: 'home',
      icon: Home,
      badge: t('Main', 'મુખ્ય')
    },
    {
      title: t('Book Appointment', 'એપોઇન્ટમેન્ટ બુક કરો'),
      desc: t('Select doctor, date and 30-min OPD slot', 'ડૉક્ટર અને સમય સ્લોટ પસંદ કરો'),
      to: 'book-appointment',
      icon: Calendar,
      badge: t('Fast', 'ઝડપી')
    },
    {
      title: t('Specialist Doctors', 'નિષ્ણાત તબીબો'),
      desc: t('MD Medicine, Pulmonology & Critical Care', 'એમ.ડી. ફિઝિશિયન અને ક્રિટિકલ કેર'),
      to: 'doctors',
      icon: Stethoscope,
      badge: t('Team', 'ટીમ')
    },
    {
      title: t('Facilities & ICU', 'સુવિધાઓ અને ICU'),
      desc: t('41 beds, 30 ICU beds, Dialysis, CT Scan', '૪૧ બેડ, ૩૦ ICU બેડ, ડાયાલિસિસ'),
      to: 'facilities',
      icon: Building2,
      badge: t('24x7', '૨૪ કલાક')
    },
    {
      title: t('Departments & Care', 'વિભાગો અને સારવાર'),
      desc: t('Chest, cardiac, critical care & stroke', 'હૃદય, ફેફસાં, કિડની અને ક્રિટિકલ કેર'),
      to: 'departments',
      icon: ShieldCheck,
      badge: t('Specialty', 'વિભાગ')
    },
    {
      title: t('Contact & Reception', 'સંપર્ક અને સરનામું'),
      desc: t(HOSPITAL_INFO.address.full, HOSPITAL_INFO.addressGujarati.full),
      to: 'contact',
      icon: PhoneCall,
      badge: t('Help', 'મદદ')
    }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '80vh', padding: '48px 0 72px' }}>
      <div className="container" style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px' }}>
        
        {/* Error Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fee2e2', color: '#dc2626', padding: '6px 16px', borderRadius: '24px', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 16 }}>
            <FileQuestion size={16} />
            <span>{t('HTTP 404 • PAGE NOT FOUND', 'HTTP ૪૦૪ • પેજ મળ્યું નથી')}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {t("We Couldn’t Find the Page You're Looking For", 'તમે જે પેજ શોધી રહ્યા છો તે મળ્યું નથી')}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 580, margin: '0 auto', lineHeight: 1.6 }}>
            {t('The link may have moved, expired, or been mistyped. Use the hospital search bar below or pick one of our direct return paths.', 'લિંક બદલાઈ ગઈ હોઈ શકે છે. નીચે આપેલા સર્ચ બાર દ્વારા શોધો અથવા મુખ્ય પેજ પર પાછા ફરો.')}
          </p>
        </div>

        {/* Interactive Search Box */}
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)', border: '1px solid var(--border-color)', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '2px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '10px 16px', background: '#f8fafc' }}>
            <Search size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('Search doctors, departments, treatments, or facilities...', 'ડૉક્ટર, વિભાગ, સારવાર અથવા સુવિધા શોધો...')}
              style={{ border: 'none', background: 'transparent', width: '100%', fontSize: 15, outline: 'none', color: 'var(--brand-navy)', fontWeight: 500 }}
              aria-label={t('Search hospital website', 'હોસ્પિટલ વેબસાઇટ શોધો')}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                style={{ border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
              >
                {t('Clear', 'સાફ')}
              </button>
            )}
          </div>

          {/* Real-time search results */}
          {query.trim() && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.05em' }}>
                {searchResults.length > 0
                  ? t(`Found ${searchResults.length} matching destinations:`, `${searchResults.length} પરિણામો મળ્યા:`)
                  : t('No matching hospital pages found. Try searching doctor name or facility.', 'કોઈ પરિણામ મળ્યું નથી.')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {searchResults.map((res, i) => (
                  <Link
                    key={i}
                    to={res.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#f8fafc',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-navy)' }}>
                        {lang === 'en' ? res.title : (res.titleGu || res.title)}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{res.desc}</div>
                    </div>
                    <span style={{ fontSize: 11, background: 'var(--primary-soft)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      {res.category}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* One-Click Direct Return Paths */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-navy)', marginBottom: 16 }}>
            {t('Quick Return Paths', 'સીધા ઉપયોગી પેજ')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {quickPaths.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    background: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    textDecoration: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s'
                  }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconComp size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--brand-navy)' }}>{item.title}</span>
                      <span style={{ fontSize: 10, background: '#f1f5f9', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>{item.badge}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 0', lineHeight: 1.4 }}>{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 24x7 Emergency Contact Help Bar */}
        <div style={{ marginTop: 32, background: 'linear-gradient(135deg, var(--brand-navy) 0%, #1e293b 100%)', borderRadius: 'var(--radius-md)', padding: '20px 24px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--accent-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('24x7 Emergency & Critical Care Desk', '૨૪ કલાક ઇમરજન્સી અને ક્રિટિકલ કેર ડેસ્ક')}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
              {t('Need Immediate Medical Assistance?', 'ત્વરિત તબીબી સહાયની જરૂર છે?')}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 }}>
              {t('Casualty and ICU admissions open 24 hours, 365 days a year.', 'કેઝ્યુઅલ્ટી અને આઇસીયુ એડમિશન ૨૪ કલાક ખુલ્લું.')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
              href={HOSPITAL_INFO.phoneHref}
              className="btn"
              style={{ background: '#dc2626', color: '#ffffff', border: 'none', fontWeight: 700, padding: '10px 18px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <PhoneCall size={16} /> {HOSPITAL_INFO.appointmentNumber}
            </a>
            <Link
              to="home"
              className="btn"
              style={{ background: 'rgba(255, 255, 255, 0.12)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.25)', fontWeight: 700, padding: '10px 18px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              {t('Return Home', 'હોમ પેજ')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
