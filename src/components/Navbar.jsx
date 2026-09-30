import React, { useState, useEffect } from 'react';
import {
  Phone, MapPin, Calendar, Menu, X, Siren, UserCheck, Globe,
  Home, Building2, Stethoscope, Users, Images, Info, Mail
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalContent';
import { lockScroll, unlockScroll } from './ui';
import PulseLogo from './PulseLogo';
import { Link } from '../router';

export const NAV_LINKS = [
  { id: 'home', en: 'Home', gu: 'મુખ્ય પૃષ્ઠ', icon: Home },
  { id: 'facilities', en: 'Facilities', gu: 'સુવિધાઓ', icon: Building2 },
  { id: 'departments', en: 'Departments', gu: 'વિભાગો', icon: Stethoscope },
  { id: 'doctors', en: 'Doctors', gu: 'ડૉક્ટરો', icon: Users },
  { id: 'gallery', en: 'Hospital Tour', gu: 'ગેલેરી', icon: Images },
  { id: 'about', en: 'About', gu: 'અમારા વિશે', icon: Info },
  { id: 'contact', en: 'Contact', gu: 'સંપર્ક', icon: Mail }
];

export default function Navbar({ activePage, lang, setLang }) {
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

  const close = () => setMenuOpen(false);

  return (
    <>
      {/* Info bar */}
      <div className="topbar">
        <div className="container-wide topbar-inner">
          <div className="topbar-left">
            <span className="er"><Siren size={14} /> {t('24x7 Emergency & ICU', '૨૪ કલાક ઇમરજન્સી & ICU')}</span>
            <a href={HOSPITAL_INFO.phoneHref} className="hide-sm"><Phone size={13} /> {HOSPITAL_INFO.appointmentNumber}</a>
            <span className="hide-sm topbar-addr">
              <MapPin size={13} /> {t('City Centre, Shamlaji Road, Modasa', 'સીટી સેન્ટર, શામળાજી રોડ, મોડાસા')}
            </span>
          </div>
          <div className="topbar-right">
            <Link to="my-appointments" className="hide-sm"><UserCheck size={14} /> {t('My Booking', 'મારી એપોઇન્ટમેન્ટ')}</Link>
            <button className="lang-btn" onClick={() => setLang(lang === 'en' ? 'gu' : 'en')} title="Toggle Gujarati / English">
              <Globe size={13} /> {lang === 'en' ? 'ગુજરાતી' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky header */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container-wide header-inner">
          <Link to="home" className="brand" title="Home">
            <PulseLogo size={42} lang={lang} />
          </Link>

          <nav className="main-nav" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.id}
                to={l.id}
                className="nav-link"
                aria-current={activePage === l.id ? 'page' : undefined}
              >
                {t(l.en, l.gu)}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link to="book-appointment" className="btn btn-primary header-book" style={{ padding: '11px 18px', fontSize: 14 }}>
              <Calendar size={16} />
              {t('Book Appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
            </Link>
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
                <Link key={l.id} to={l.id} className="nav-link" aria-current={activePage === l.id ? 'page' : undefined} onClick={close}>
                  <I size={18} /> {t(l.en, l.gu)}
                </Link>
              );
            })}

            <div className="menu-divider" />

            <Link to="book-appointment" className="btn btn-primary btn-lg" onClick={close}>
              <Calendar size={18} /> {t('Book Appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
            </Link>
            <Link to="my-appointments" className="btn btn-secondary" style={{ marginTop: 8 }} onClick={close}>
              <UserCheck size={17} /> {t('Check / Cancel My Booking', 'મારી એપોઇન્ટમેન્ટ ચેક કરો')}
            </Link>
            <a className="btn btn-emergency" style={{ marginTop: 8 }} href={HOSPITAL_INFO.phoneHref}>
              <Phone size={17} /> {t('Call Emergency', 'ઇમરજન્સી કૉલ')}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
