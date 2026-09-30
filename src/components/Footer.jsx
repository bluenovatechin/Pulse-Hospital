import React from 'react';
import { Phone, MapPin, Clock, FileText } from 'lucide-react';
import { HOSPITAL_INFO, FACILITIES, DOCTORS, DEPARTMENTS } from '../data/hospitalContent';
import { Link } from '../router';
import { NAV_LINKS } from './Navbar';
import PulseLogo from './PulseLogo';

export default function Footer({ lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const topFacilities = FACILITIES.filter((f) => f.is24x7).slice(0, 6);

  return (
    <footer className="site-footer">
      <div className="container-wide">
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: 16 }}>
              <PulseLogo size={44} variant="light" lang={lang} />
            </div>
            <p style={{ lineHeight: 1.65 }}>
              {t(
                "Modasa's 24x7 emergency and critical care hospital: ICU, in-house CT scan, dialysis, modular operation theatres and senior MD physicians under one roof.",
                'મોડાસામાં ૨૪ કલાક કાર્યરત આઈ.સી.યુ., સીટી સ્કેન, ડાયાલીસીસ અને અનુભવી એમ.ડી. ફિઝિશિયન ડોક્ટરોની ટીમ.'
              )}
            </p>
            <h4 style={{ marginTop: 22 }}>{t('Departments', 'વિભાગો')}</h4>
            <ul className="footer-inline">
              {DEPARTMENTS.map((d) => (
                <li key={d.id}><Link to="departments" param={d.id}>{lang === 'en' ? d.title : (d.titleGujarati || d.title)}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{t('Explore', 'પૃષ્ઠો')}</h4>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.id}><Link to={l.id}>{t(l.en, l.gu)}</Link></li>
              ))}
              <li><Link to="book-appointment">{t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}</Link></li>
            </ul>
          </div>

          <div>
            <h4>{t('Our doctors', 'અમારા ડૉક્ટરો')}</h4>
            <ul>
              {DOCTORS.map((d) => (
                <li key={d.id}><Link to="doctors" param={d.slug}>{lang === 'en' ? d.name : d.nameGujarati}</Link></li>
              ))}
            </ul>
            <h4 style={{ marginTop: 22 }}>{t('Open 24x7', '૨૪ કલાક ઉપલબ્ધ')}</h4>
            <ul>
              {topFacilities.map((f) => (
                <li key={f.id}><Link to="facilities" param={f.id}>{lang === 'en' ? f.name : (f.nameGu || f.name)}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{t('Visit & Contact', 'સંપર્ક')}</h4>
            <div className="footer-contact">
              <div>
                <MapPin size={17} />
                <span>{lang === 'en' ? HOSPITAL_INFO.address.full : HOSPITAL_INFO.addressGujarati.full}</span>
              </div>
              <div>
                <Phone size={17} />
                <span>
                  <a href={HOSPITAL_INFO.phoneHref} style={{ color: '#fff', fontWeight: 700 }}>{HOSPITAL_INFO.appointmentNumber}</a>
                  <br />{t('Appointments, WhatsApp & emergency', 'એપોઇન્ટમેન્ટ, વોટ્સએપ & ઇમરજન્સી')}
                </span>
              </div>
              <div>
                <Clock size={17} />
                <span>
                  <strong style={{ color: '#fff' }}>{t('Emergency: 24 hours, 365 days', 'ઇમરજન્સી: ૨૪ કલાક')}</strong>
                  <br />{t('OPD: ', 'OPD: ')}{lang === 'en' ? HOSPITAL_INFO.opdHours : (HOSPITAL_INFO.opdHoursGujarati || HOSPITAL_INFO.opdHours)}
                </span>
              </div>
              <ul style={{ marginTop: 4 }}>
                <li><Link to="book-appointment" style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{t('Book an appointment →', 'એપોઇન્ટમેન્ટ બુક કરો →')}</Link></li>
                <li><Link to="my-appointments">{t('Check or cancel my booking', 'મારી એપોઇન્ટમેન્ટ ચેક કરો')}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-notice">
          <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', color: '#fff' }}>
            <FileText size={16} /> {HOSPITAL_INFO.noticeEnglish}
          </span>
          <span className="gujarati-text" style={{ color: 'var(--primary-light)' }}>{HOSPITAL_INFO.noticeGujarati}</span>
        </div>

        <div className="footer-bottom">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <span>© {new Date().getFullYear()} Pulse Hospital & I.C.U, Modasa. {t('All rights reserved.', 'સર્વાધિકાર સુરક્ષિત.')}</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <Link to="privacy" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              {t('Privacy Policy', 'પ્રાઇવસી પોલિસી')}
            </Link>
            <span style={{ opacity: 0.4 }}>|</span>
            <Link to="terms" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              {t('Terms & Conditions', 'નિયમો અને શરતો')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
