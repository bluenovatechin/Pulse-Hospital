import React, { useState, useEffect, useRef } from 'react';
import {
  Phone, MapPin, Calendar, Menu, X, Siren, UserCheck, Globe, ChevronDown, ArrowRight,
  Home, Building2, Stethoscope, Users, Images, Info, Mail
} from 'lucide-react';
import { HOSPITAL_INFO, DOCTORS, FACILITIES, DEPARTMENTS } from '../data/hospitalContent';
import { lockScroll, unlockScroll, Avatar, Icon, WhatsAppIcon } from './ui';
import PulseLogo from './PulseLogo';
import { Link } from '../router';

export const NAV_LINKS = [
  { id: 'home', en: 'Home', gu: 'મુખ્ય પૃષ્ઠ', icon: Home },
  { id: 'facilities', en: 'Facilities', gu: 'સુવિધાઓ', icon: Building2 },
  { id: 'departments', en: 'Departments', gu: 'વિભાગો', icon: Stethoscope },
  { id: 'doctors', en: 'Doctors', gu: 'ડૉક્ટરો', icon: Users },
  { id: 'gallery', en: 'Gallery', gu: 'ગેલેરી', icon: Images },
  { id: 'about', en: 'About', gu: 'અમારા વિશે', icon: Info },
  { id: 'contact', en: 'Contact', gu: 'સંપર્ક', icon: Mail }
];

// Facilities listed in the mobile menu (the full list is one tap away)
const MENU_FACILITIES = ['icu', 'emergency', 'dialysis', 'ct', 'lab', 'ot', 'pharmacy', 'ambulance'];

const CLOSE_MS = 260;

/** Compact doctor row used in the desktop dropdown and the mobile menu */
function DoctorMenuCard({ d, lang, onClick }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  return (
    <Link to="doctors" param={d.slug} className="menu-doc" onClick={onClick}>
      <Avatar doctor={d} size="sm" />
      <span className="menu-doc-text">
        <strong>{lang === 'en' ? d.name : d.nameGujarati}</strong>
        {d.qualification && <span className="menu-doc-qual">{d.qualification}</span>}
        <span className="menu-doc-role">{t(d.designation, d.designationGujarati || d.designation)}</span>
        <span className="menu-doc-link">{t('View profile', 'પ્રોફાઇલ જુઓ')} <ArrowRight size={13} /></span>
      </span>
    </Link>
  );
}

/**
 * One section of the mobile menu. Tapping the name opens that page
 * (e.g. /doctors); the arrow button beside it shows the quick list.
 */
function MenuGroup({ id, label, icon: I, to, active, onNavigate, open, onToggle, style, showLabel, hideLabel, children }) {
  return (
    <div className={`mm-group ${open ? 'is-open' : ''}`} style={style}>
      <div className={`mm-item mm-split ${active ? 'is-active' : ''}`}>
        <Link to={to} className="mm-split-link" onClick={onNavigate} aria-current={active ? 'page' : undefined}>
          <I size={18} /> <span>{label}</span>
        </Link>
        <button
          type="button"
          className="mm-split-toggle"
          aria-expanded={open}
          aria-controls={`mm-${id}`}
          aria-label={open ? hideLabel : showLabel}
          onClick={onToggle}
        >
          <ChevronDown size={20} className="mm-chev" aria-hidden="true" />
        </button>
      </div>
      <div className="mm-collapse" id={`mm-${id}`} role="region" aria-label={label}>
        <div className="mm-collapse-inner">{children}</div>
      </div>
    </div>
  );
}

export default function Navbar({ activePage, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const closeTimer = useRef(null);
  const t = (en, gu) => (lang === 'en' ? en : gu);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const open = () => {
    clearTimeout(closeTimer.current);
    setClosing(false);
    setOpenGroup(null); // every section starts closed; tap one to open it
    setMenuOpen(true);
  };

  // Play the exit animation, then unmount
  const close = () => {
    if (closing) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduce) { setMenuOpen(false); return; }
    setClosing(true);
    closeTimer.current = setTimeout(() => { setMenuOpen(false); setClosing(false); }, CLOSE_MS);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    lockScroll();
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
    // close() only reads state that is reset on each open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  const toggleGroup = (id) => setOpenGroup((g) => (g === id ? null : id));
  const whatsapp = `https://wa.me/${HOSPITAL_INFO.whatsappNumber}`;
  const stagger = (i) => ({ '--i': i });

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
            <PulseLogo size={42} />
          </Link>

          <nav className="main-nav" aria-label="Main">
            {NAV_LINKS.map((l) =>
              l.id === 'doctors' ? (
                <div className="nav-item has-menu" key={l.id}>
                  <Link to="doctors" className="nav-link" aria-current={activePage === 'doctors' ? 'page' : undefined}>
                    {t(l.en, l.gu)} <ChevronDown size={14} className="nav-chev" aria-hidden="true" />
                  </Link>
                  <div className="nav-dropdown">
                    <div className="nav-dd-head">
                      <strong>{t('Our doctors', 'અમારા ડૉક્ટરો')}</strong>
                      <span>{t('OPD Mon–Sat · Emergency & ICU 24x7', 'OPD સોમ–શનિ · ઇમરજન્સી & ICU ૨૪ કલાક')}</span>
                    </div>
                    <div className="nav-dd-grid">
                      {DOCTORS.map((d) => <DoctorMenuCard key={d.id} d={d} lang={lang} />)}
                    </div>
                    <Link to="doctors" className="nav-dd-all">
                      {t('View all doctors & OPD timetable', 'બધા ડૉક્ટરો અને OPD સમયપત્રક જુઓ')} <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ) : (
                <Link
                  key={l.id}
                  to={l.id}
                  className="nav-link"
                  aria-current={activePage === l.id ? 'page' : undefined}
                >
                  {t(l.en, l.gu)}
                </Link>
              )
            )}
          </nav>

          <div className="header-actions">
            <Link to="book-appointment" className="btn btn-primary header-book" style={{ padding: '11px 18px', fontSize: 14 }}>
              <Calendar size={16} />
              {t('Book Appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
            </Link>
            <button className="menu-toggle" onClick={open} aria-label="Open menu" aria-expanded={menuOpen}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={`mobile-menu ${closing ? 'is-closing' : ''}`} onClick={close}>
          <div className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label={t('Menu', 'મેનુ')} onClick={(e) => e.stopPropagation()}>
            {/* Emergency strip */}
            <div className="mm-strip">
              <a href={HOSPITAL_INFO.phoneHref} className="mm-strip-call">
                <span className="mm-dot" aria-hidden="true" /> 24x7: {HOSPITAL_INFO.appointmentNumber}
              </a>
              <a href={whatsapp} target="_blank" rel="noreferrer" className="mm-strip-wa">
                <WhatsAppIcon size={15} /> WhatsApp
              </a>
            </div>

            <div className="mm-head">
              <Link to="home" onClick={close} aria-label="Home"><PulseLogo size={34} /></Link>
              <button className="mm-close" onClick={close} aria-label={t('Close menu', 'મેનુ બંધ કરો')}><X size={22} /></button>
            </div>

            <nav className="mm-list" aria-label={t('Main', 'મુખ્ય')}>
              <Link to="home" className="mm-item" style={stagger(0)} aria-current={activePage === 'home' ? 'page' : undefined} onClick={close}>
                <Home size={18} /> <span>{t('Home', 'મુખ્ય પૃષ્ઠ')}</span>
              </Link>

              <MenuGroup
                id="doctors" to="doctors" icon={Users} style={stagger(1)}
                label={t('Our Doctors', 'અમારા ડૉક્ટરો')}
                active={activePage === 'doctors'} onNavigate={close}
                open={openGroup === 'doctors'} onToggle={() => toggleGroup('doctors')}
                showLabel={t('Show doctors list', 'ડૉક્ટરોની યાદી બતાવો')} hideLabel={t('Hide doctors list', 'યાદી છુપાવો')}
              >
                <div className="mm-docs">
                  {DOCTORS.map((d) => <DoctorMenuCard key={d.id} d={d} lang={lang} onClick={close} />)}
                </div>
              </MenuGroup>

              <MenuGroup
                id="facilities" to="facilities" icon={Building2} style={stagger(2)}
                label={t('Facilities', 'સુવિધાઓ')}
                active={activePage === 'facilities'} onNavigate={close}
                open={openGroup === 'facilities'} onToggle={() => toggleGroup('facilities')}
                showLabel={t('Show facilities list', 'સુવિધાઓની યાદી બતાવો')} hideLabel={t('Hide facilities list', 'યાદી છુપાવો')}
              >
                <ul className="mm-links mm-links-2">
                  {MENU_FACILITIES.map((id) => FACILITIES.find((f) => f.id === id)).filter(Boolean).map((f) => (
                    <li key={f.id}>
                      <Link to="facilities" param={f.id} onClick={close}><Icon name={f.icon} size={16} /> {lang === 'en' ? f.name : f.nameGu}</Link>
                    </li>
                  ))}
                </ul>
                <Link to="facilities" className="mm-all" onClick={close}>
                  {t(`See all ${FACILITIES.length} facilities`, 'બધી સુવિધાઓ જુઓ')} <ArrowRight size={15} />
                </Link>
              </MenuGroup>

              <MenuGroup
                id="departments" to="departments" icon={Stethoscope} style={stagger(3)}
                label={t('Departments', 'વિભાગો')}
                active={activePage === 'departments'} onNavigate={close}
                open={openGroup === 'departments'} onToggle={() => toggleGroup('departments')}
                showLabel={t('Show departments list', 'વિભાગોની યાદી બતાવો')} hideLabel={t('Hide departments list', 'યાદી છુપાવો')}
              >
                <ul className="mm-links mm-links-2">
                  {DEPARTMENTS.map((d) => (
                    <li key={d.id}>
                      <Link to="departments" param={d.id} onClick={close}><Icon name={d.icon} size={16} /> {lang === 'en' ? d.title : d.titleGujarati}</Link>
                    </li>
                  ))}
                </ul>
              </MenuGroup>

              <Link to="gallery" className="mm-item" style={stagger(4)} aria-current={activePage === 'gallery' ? 'page' : undefined} onClick={close}>
                <Images size={18} /> <span>{t('Photo Gallery', 'ફોટો ગેલેરી')}</span>
              </Link>
              <Link to="about" className="mm-item" style={stagger(5)} aria-current={activePage === 'about' ? 'page' : undefined} onClick={close}>
                <Info size={18} /> <span>{t('About Us', 'અમારા વિશે')}</span>
              </Link>
              <Link to="contact" className="mm-item" style={stagger(6)} aria-current={activePage === 'contact' ? 'page' : undefined} onClick={close}>
                <Mail size={18} /> <span>{t('Contact & Directions', 'સંપર્ક અને સરનામું')}</span>
              </Link>
              <Link to="my-appointments" className="mm-item" style={stagger(7)} aria-current={activePage === 'my-appointments' ? 'page' : undefined} onClick={close}>
                <UserCheck size={18} /> <span>{t('Check / Cancel My Booking', 'મારી એપોઇન્ટમેન્ટ ચેક કરો')}</span>
              </Link>
            </nav>

            <div className="mm-actions" style={stagger(8)}>
              <Link to="book-appointment" className="btn btn-primary btn-lg" onClick={close}>
                <Calendar size={18} /> {t('Book Appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
              </Link>
              <a className="btn btn-emergency" href={HOSPITAL_INFO.phoneHref}>
                <Phone size={17} /> {t('Call Emergency', 'ઇમરજન્સી કૉલ')}
              </a>
              <button type="button" className="mm-lang" onClick={() => setLang(lang === 'en' ? 'gu' : 'en')}>
                <Globe size={15} /> {lang === 'en' ? 'ગુજરાતીમાં જુઓ' : 'View in English'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
