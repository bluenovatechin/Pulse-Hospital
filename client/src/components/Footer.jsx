import React from 'react';
import { Phone, MapPin, Clock, Activity, FileText, Lock } from 'lucide-react';
import { HOSPITAL_INFO, FACILITIES } from '../data/hospitalContent';
import { NAV_LINKS } from './Navbar';

export default function Footer({ onNavigate, onOpenBooking, onOpenLookup, onOpenAdmin, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const topFacilities = FACILITIES.filter((f) => f.is24x7).slice(0, 6);

  return (
    <footer className="site-footer">
      <div className="container-wide">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: 16 }}>
              <span className="brand-mark"><Activity size={22} strokeWidth={2.5} /></span>
              <span>
                <span className="brand-name" style={{ display: 'block' }}>PULSE HOSPITAL</span>
                <span className="brand-sub">& I.C.U · Caring for life</span>
              </span>
            </div>
            <p style={{ lineHeight: 1.65 }}>
              {t(
                "Modasa's 24x7 emergency and critical care hospital — ICU, in-house CT scan, dialysis, modular operation theatres and senior MD physicians under one roof.",
                'મોડાસામાં ૨૪ કલાક કાર્યરત આઈ.સી.યુ., સીટી સ્કેન, ડાયાલીસીસ અને અનુભવી એમ.ડી. ફિઝિશિયન ડોક્ટરોની ટીમ.'
              )}
            </p>
          </div>

          <div>
            <h4>{t('Explore', 'પૃષ્ઠો')}</h4>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.id}><button onClick={() => onNavigate(l.id)}>{t(l.en, l.gu)}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{t('Open 24x7', '૨૪ કલાક ઉપલબ્ધ')}</h4>
            <ul>
              {topFacilities.map((f) => (
                <li key={f.id}><button onClick={() => onNavigate('facilities', f.id)}>{f.name}</button></li>
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
                  <br />OPD: {HOSPITAL_INFO.opdHours}
                </span>
              </div>
              <ul style={{ marginTop: 4 }}>
                <li><button onClick={onOpenBooking} style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{t('Book an appointment →', 'એપોઇન્ટમેન્ટ બુક કરો →')}</button></li>
                <li><button onClick={onOpenLookup}>{t('Check or cancel my booking', 'મારી એપોઇન્ટમેન્ટ ચેક કરો')}</button></li>
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
          <span>© {new Date().getFullYear()} Pulse Hospital & I.C.U, Modasa. All rights reserved.</span>
          <button onClick={onOpenAdmin} style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <Lock size={12} /> Staff portal
          </button>
        </div>
      </div>
    </footer>
  );
}
