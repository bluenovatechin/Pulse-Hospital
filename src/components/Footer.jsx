import React, { useState } from 'react';
import { Phone, MapPin, Clock, FileText, ChevronDown, Calendar } from 'lucide-react';
import { HOSPITAL_INFO, FACILITIES, DOCTORS, DEPARTMENTS } from '../data/hospitalContent';
import { Link } from '../router';
import { NAV_LINKS } from './Navbar';
import PulseLogo from './PulseLogo';
import { departmentLink, facilityLink } from '../data/siteStructure';

/**
 * A footer link group. Desktop: always-open column with a heading.
 * Phones: a compact row that folds open when tapped.
 */
function Group({ id, title, open, onToggle, children }) {
  return (
    <div className={`fgroup ${open ? 'is-open' : ''}`}>
      <h4>
        <button type="button" className="fgroup-toggle" aria-expanded={open} aria-controls={`fg-${id}`} onClick={onToggle}>
          <span>{title}</span>
          <ChevronDown size={18} className="fgroup-chev" aria-hidden="true" />
        </button>
      </h4>
      <div className="fgroup-body" id={`fg-${id}`}>
        <div className="fgroup-inner">{children}</div>
      </div>
    </div>
  );
}

export default function Footer({ lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const topFacilities = FACILITIES.filter((f) => f.is24x7).slice(0, 6);
  const [open, setOpen] = useState(null);
  const toggle = (id) => setOpen((o) => (o === id ? null : id));

  return (
    <footer className="site-footer">
      <div className="container-wide">
        <div className="footer-grid">
          {/* Brand */}
          <div className="f-brand">
            <PulseLogo size={44} variant="light" />
            <p>
              {t(
                "Modasa's 24x7 emergency and critical care hospital: ICU, in-house CT scan, dialysis, modular operation theatres and senior MD physicians under one roof.",
                'મોડાસામાં ૨૪ કલાક કાર્યરત આઈ.સી.યુ., સીટી સ્કેન, ડાયાલીસીસ અને અનુભવી એમ.ડી. ફિઝિશિયન ડોક્ટરોની ટીમ.'
              )}
            </p>
          </div>

          {/* Contact (first thing on phones) */}
          <div className="f-contact">
            <h4 className="f-contact-title">{t('Visit & Contact', 'સંપર્ક')}</h4>
            <a className="f-call" href={HOSPITAL_INFO.phoneHref}>
              <Phone size={18} />
              <span>
                <strong>{HOSPITAL_INFO.appointmentNumber}</strong>
                <small>{t('Appointments, WhatsApp & emergency', 'એપોઇન્ટમેન્ટ, વોટ્સએપ & ઇમરજન્સી')}</small>
              </span>
            </a>
            <div className="f-line">
              <MapPin size={16} />
              <span>{lang === 'en' ? HOSPITAL_INFO.address.full : HOSPITAL_INFO.addressGujarati.full}</span>
            </div>
            <div className="f-line">
              <Clock size={16} />
              <span>
                <strong>{t('Emergency: 24 hours, 365 days', 'ઇમરજન્સી: ૨૪ કલાક')}</strong>
                <br />{t('OPD: ', 'OPD: ')}{lang === 'en' ? HOSPITAL_INFO.opdHours : (HOSPITAL_INFO.opdHoursGujarati || HOSPITAL_INFO.opdHours)}
              </span>
            </div>
            <div className="f-actions">
              <Link to="book-appointment" className="f-book"><Calendar size={15} /> {t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}</Link>
              <Link to="my-appointments" className="f-mine">{t('My booking', 'મારી એપોઇન્ટમેન્ટ')}</Link>
            </div>
          </div>

          {/* Link groups */}
          <div className="f-links">
            <Group id="departments" title={t('Departments', 'વિભાગો')} open={open === 'departments'} onToggle={() => toggle('departments')}>
              <ul>
                {DEPARTMENTS.map((d) => (
                  <li key={d.id}><Link {...departmentLink(d.id)}>{lang === 'en' ? d.title : (d.titleGujarati || d.title)}</Link></li>
                ))}
              </ul>
            </Group>
            <Group id="pages" title={t('Explore', 'પૃષ્ઠો')} open={open === 'pages'} onToggle={() => toggle('pages')}>
              <ul>
                {NAV_LINKS.map((l) => (
                  <li key={l.id}><Link to={l.id}>{t(l.en, l.gu)}</Link></li>
                ))}
              </ul>
            </Group>
            <Group id="doctors" title={t('Our doctors', 'અમારા ડૉક્ટરો')} open={open === 'doctors'} onToggle={() => toggle('doctors')}>
              <ul>
                {DOCTORS.map((d) => (
                  <li key={d.id}><Link to="doctors" param={d.slug}>{lang === 'en' ? d.name : d.nameGujarati}</Link></li>
                ))}
              </ul>
            </Group>
            <Group id="open247" title={t('Open 24x7', '૨૪ કલાક ઉપલબ્ધ')} open={open === 'open247'} onToggle={() => toggle('open247')}>
              <ul>
                {topFacilities.map((f) => (
                  <li key={f.id}><Link {...facilityLink(f.id)}>{lang === 'en' ? f.name : (f.nameGu || f.name)}</Link></li>
                ))}
              </ul>
            </Group>
          </div>
        </div>

        <div className="footer-notice">
          <span className="footer-notice-en"><FileText size={16} /> {HOSPITAL_INFO.noticeEnglish}</span>
          <span className="gujarati-text footer-notice-gu">{HOSPITAL_INFO.noticeGujarati}</span>
        </div>

        <div className="footer-bottom f-bottom">
          <span>© {new Date().getFullYear()} Pulse Hospital & I.C.U, Modasa. {t('All rights reserved.', 'સર્વાધિકાર સુરક્ષિત.')}</span>
          <nav className="f-legal" aria-label={t('Legal', 'કાનૂની')}>
            <Link to="privacy">{t('Privacy Policy', 'પ્રાઇવસી પોલિસી')}</Link>
            <Link to="terms">{t('Terms & Conditions', 'નિયમો અને શરતો')}</Link>
            <button type="button" onClick={() => typeof window !== 'undefined' && window.openPulseCookieSettings && window.openPulseCookieSettings()}>
              {t('Cookie Settings', 'કુકીઝ પસંદગી')}
            </button>
            <span>
              {t('Maintained by', 'સંચાલિત:')} <strong className="f-credit">BlueNova Tech</strong>
            </span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
