import React, { useState, useEffect } from 'react';
import {
  Phone, MapPin, Calendar, Menu, X, Siren, UserCheck, Globe, Lock,
  Home, Building2, Stethoscope, Users, Images, Info, Mail
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalContent';
import { lockScroll, unlockScroll } from './ui';
import PulseLogo from './PulseLogo';

export const NAV_LINKS = [
  { id: 'home', en: 'Home', gu: 'મુખ્ય પૃષ્ઠ', icon: Home },
  { id: 'facilities', en: 'Facilities', gu: 'સુવિધાઓ', icon: Building2 },
  { id: 'departments', en: 'Departments', gu: 'વિભાગો', icon: Stethoscope },
  { id: 'doctors', en: 'Doctors', gu: 'ડૉક્ટરો', icon: Users },
  { id: 'gallery', en: 'Hospital Tour', gu: 'ગેલેરી', icon: Images },
  { id: 'about', en: 'About', gu: 'અમારા વિશે', icon: Info },
  { id: 'contact', en: 'Contact', gu: 'સંપર્ક', icon: Mail }
];

export default function Navbar({ activePage, onNavigate, onOpenBooking, onOpenLookup, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = (en, gu) => (lang === 'en' ? en : gu);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    lockScroll();
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [menuOpen]);

  const go = (id) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Info bar */}
      <div className="topbar">
        <div className="container-wide topbar-inner">
          <div className="topbar-left">
            <span className="er"><Siren size={14} /> {t('24x7 Emergency & ICU', '૨૪ કલાક ઇમરજન્સી & ICU')}</span>
            <a href={HOSPITAL_INFO.phoneHref} className="hide-sm"><Phone size={13} /> {HOSPITAL_INFO.appointmentNumber}</a>
            <span className="hide-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={13} /> {t('City Centre, Shamlaji Road, Modasa', 'સીટી સેન્ટર, શામળાજી રોડ, મોડાસા')}
            </span>
          </div>
          <div className="topbar-right">
            <button onClick={onOpenLookup} className="hide-sm"><UserCheck size={14} /> {t('My Booking', 'મારી એપોઇન્ટમેન્ટ')}</button>
            <button className="lang-btn" onClick={() => setLang(lang === 'en' ? 'gu' : 'en')} title="Toggle Gujarati / English">
              <Globe size={13} /> {lang === 'en' ? 'ગુજરાતી' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky header */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container-wide header-inner">
          <button className="brand" onClick={() => go('home')} aria-label="Pulse Hospital home">
            <PulseLogo size={42} lang={lang} />
          </button>

          <nav className="main-nav" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                className="nav-link"
                aria-current={activePage === l.id ? 'page' : undefined}
                onClick={() => go(l.id)}
              >
                {t(l.en, l.gu)}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <button onClick={onOpenBooking} className="btn-primary header-book" style={{ padding: '11px 18px', fontSize: 14 }}>
              <Calendar size={16} />
              {t('Book Appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
            </button>
            <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Menu" onClick={(e) => e.stopPropagation()}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
              <PulseLogo size={32} lang={lang} tagline={false} />
              <button className="menu-toggle" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={22} /></button>
            </div>

            {NAV_LINKS.map((l) => {
              const I = l.icon;
              return (
                <button key={l.id} className="nav-link" aria-current={activePage === l.id ? 'page' : undefined} onClick={() => go(l.id)}>
                  <I size={18} /> {t(l.en, l.gu)}
                </button>
              );
            })}

            <div className="menu-divider" />

            <button className="btn-primary btn-lg" onClick={() => { setMenuOpen(false); onOpenBooking(); }}>
              <Calendar size={18} /> {t('Book Appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
            </button>
            <button className="btn-secondary" style={{ marginTop: 8 }} onClick={() => { setMenuOpen(false); onOpenLookup(); }}>
              <UserCheck size={17} /> {t('Check / Cancel My Booking', 'મારી એપોઇન્ટમેન્ટ ચેક કરો')}
            </button>
            <a className="btn btn-emergency" style={{ marginTop: 8 }} href={HOSPITAL_INFO.phoneHref}>
              <Phone size={17} /> {t('Call Emergency', 'ઇમરજન્સી કૉલ')}
            </a>

            <button
              className="nav-link"
              style={{ marginTop: 'auto', fontSize: 13, color: 'var(--text-muted)' }}
              onClick={() => { setMenuOpen(false); onOpenAdmin(); }}
            >
              <Lock size={15} /> {t('Staff & Reception Portal', 'સ્ટાફ & રિસેપ્શન પોર્ટલ')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
