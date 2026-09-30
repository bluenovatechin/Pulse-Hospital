import React, { useState } from 'react';
import { Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Navigation, MessageCircle } from 'lucide-react';
import { PageHero } from '../components/ui';
import { HOSPITAL_INFO, PHOTOS } from '../data/hospitalContent';

const EMPTY_FORM = { name: '', phone: '', email: '', subject: 'General Consultation Inquiry', message: '' };

export default function ContactPage({ onNavigate, lang = 'en' }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const t = (en, gu) => (lang === 'en' ? en : gu);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (!form.name || !form.phone || !form.message) {
      setErrorMsg(t('Please complete all required fields.', 'કૃપા કરીને જરૂરી તમામ વિગતો ભરો.'));
      return;
    }

    const cleanPhone = form.phone.replace(/\D/g, '');
    const waText = 
`🏥 *PULSE HOSPITAL & I.C.U — PATIENT INQUIRY*
───────────────────────────────
👤 *Name:* ${form.name.trim()}
📞 *Phone:* ${cleanPhone}
${form.email ? `✉️ *Email:* ${form.email.trim()}\n` : ''}📌 *Subject:* ${form.subject || 'General Consultation Inquiry'}
───────────────────────────────
📝 *Message:*
${form.message.trim()}
───────────────────────────────
_Sent via Pulse Hospital Website_`;

    const whatsappUrl = `https://wa.me/${HOSPITAL_INFO.whatsappNumber}?text=${encodeURIComponent(waText)}`;
    window.open(whatsappUrl, '_blank');

    setSuccessMsg(t('Your inquiry is opening in WhatsApp to send directly to Pulse Hospital reception desk.', 'તમારી પૂછપરછ સીધી પલ્સ હોસ્પિટલ રિસેપ્શન વોટ્સએપ પર મોકલવા માટે ખુલી રહી છે.'));
    setForm(EMPTY_FORM);
  };

  const cards = [
    {
      icon: Phone, tone: 'red', title: t('Phone & emergency', 'ફોન & ઇમરજન્સી'),
      body: (
        <>
          <a href={HOSPITAL_INFO.phoneHref} style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-navy)' }}>{HOSPITAL_INFO.appointmentNumber}</a>
          <br />{t('Emergencies, helpline and WhatsApp', 'ઇમરજન્સી, હેલ્પલાઇન અને વોટ્સએપ')}
          <br />
          {t('Appointments: ', 'એપોઇન્ટમેન્ટ: ')}
          {HOSPITAL_INFO.appointmentLines.map((n, i) => (
            <React.Fragment key={n}>
              {i > 0 && ' / '}
              <a href={HOSPITAL_INFO.appointmentLinesHref[i]} style={{ fontWeight: 700, color: 'var(--brand-navy)' }}>{n}</a>
            </React.Fragment>
          ))}
        </>
      )
    },
    {
      icon: MapPin, tone: '', title: t('Address', 'સરનામું'),
      body: <>{HOSPITAL_INFO.address.full}<br /><span className="gujarati-text" style={{ color: 'var(--primary)' }}>{HOSPITAL_INFO.addressGujarati.full}</span></>
    },
    {
      icon: Clock, tone: 'mint', title: t('Hours', 'સમય'),
      body: <><strong>{t('Emergency & ICU: 24 hours, 365 days', 'ઇમરજન્સી & ICU: ૨૪ કલાક')}</strong><br />OPD: {HOSPITAL_INFO.opdHours}</>
    }
  ];

  return (
    <div>
      <PageHero
        photo={PHOTOS.billing}
        photoAlt={t('Reception and billing counter', 'રીસેપ્શન અને બિલિંગ કાઉન્ટર')}
        crumbs={t('Contact', 'સંપર્ક')}
        onHome={() => onNavigate('home')}
        eyebrow={t('Contact', 'સંપર્ક')}
        title={t('We’re here for you, day and night', 'અમે ૨૪ કલાક તમારી સેવામાં')}
        text={t(
          'Call for anything urgent. For questions about ICU admission, tests or doctor availability, send us a WhatsApp message and reception will reply.',
          'તાત્કાલિક હોય તો કૉલ કરો. ICU એડમિશન, ટેસ્ટ કે ડૉક્ટર વિશે પૂછવા વોટ્સએપ સંદેશ મોકલો, રીસેપ્શન જવાબ આપશે.'
        )}
        facts={[
          { value: '24x7', label: t('Emergency & ICU', 'ઇમરજન્સી & ICU') },
          { value: t('Mon–Sat', 'સોમ–શનિ'), label: t('OPD, morning & evening', 'OPD, સવાર & સાંજ') },
          { value: t('4th floor', '૪થો માળ'), label: t('City Centre, Shamlaji Rd', 'સીટી સેન્ટર, શામળાજી રોડ') }
        ]}
        note={{
          icon: <Phone size={20} />,
          title: t('Appointment lines', 'એપોઇન્ટમેન્ટ નંબર'),
          text: HOSPITAL_INFO.appointmentLines.join(' / ')
        }}
        actions={
          <>
            <a className="btn btn-emergency" href={HOSPITAL_INFO.phoneHref}>
              <Phone size={17} /> {t('Call now', 'હમણાં કૉલ કરો')}
            </a>
            <a className="btn btn-secondary" href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber}`} target="_blank" rel="noreferrer">
              <MessageCircle size={17} /> WhatsApp
            </a>
            <a className="btn btn-secondary" href={HOSPITAL_INFO.mapsUrl} target="_blank" rel="noreferrer">
              <Navigation size={17} /> {t('Directions', 'રસ્તો જુઓ')}
            </a>
          </>
        }
      />

      <section className="section">
        <div className="container-wide">
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {cards.map((c) => {
                const I = c.icon;
                return (
                  <div key={c.title} className="card" style={{ padding: 22, display: 'flex', gap: 16 }} data-reveal>
                    <span className={`icon-tile ${c.tone}`}><I size={22} /></span>
                    <div>
                      <h4 style={{ fontSize: 16 }}>{c.title}</h4>
                      <div style={{ fontSize: 14, color: 'var(--text-body)', marginTop: 4, lineHeight: 1.6 }}>{c.body}</div>
                    </div>
                  </div>
                );
              })}
              <div className="card photo" style={{ height: 260, padding: 0 }} data-reveal>
                <iframe title="Pulse Hospital location" src={HOSPITAL_INFO.mapsEmbed} width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
              </div>
            </div>

            <div className="card" style={{ padding: 28 }} data-reveal>
              <h3 style={{ fontSize: 22 }}>{t('Send an inquiry / request a call-back', 'પૂછપરછ મોકલો')}</h3>
              <p className="muted" style={{ fontSize: 14, marginTop: 4, marginBottom: 20 }}>{t('Reception will respond as soon as possible.', 'રીસેપ્શન જલદી જવાબ આપશે.')}</p>

              {successMsg && (
                <div className="callout" style={{ marginBottom: 16 }}><CheckCircle2 size={18} /> <span>{successMsg}</span></div>
              )}
              {errorMsg && (
                <div className="callout" style={{ marginBottom: 16, background: 'var(--pulse-red-soft)', color: '#be123c' }}><AlertCircle size={18} /> <span>{errorMsg}</span></div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
                <div style={{ width: '100%' }}>
                  <label className="form-label" htmlFor="c-name">{t('Full name *', 'દર્દી / મુલાકાતીનું નામ *')}</label>
                  <input id="c-name" name="name" className="form-input" placeholder={t('Your name', 'તમારું પૂરું નામ')} value={form.name} onChange={handleChange} required style={{ width: '100%' }} />
                </div>
                <div className="booking-form-grid" style={{ gap: 14 }}>
                  <div style={{ width: '100%' }}>
                    <label className="form-label" htmlFor="c-phone">{t('Mobile number *', 'મોબાઇલ નંબર *')}</label>
                    <input id="c-phone" type="tel" name="phone" className="form-input" placeholder={t('10-digit mobile', '૧૦ અંકનો મોબાઈલ')} value={form.phone} onChange={handleChange} required style={{ width: '100%' }} />
                  </div>
                  <div style={{ width: '100%' }}>
                    <label className="form-label" htmlFor="c-email">{t('Email (optional)', 'ઇમેઇલ (મરજિયાત)')}</label>
                    <input id="c-email" type="email" name="email" className="form-input" placeholder="email@domain.com" value={form.email} onChange={handleChange} style={{ width: '100%' }} />
                  </div>
                </div>
                <div style={{ width: '100%' }}>
                  <label className="form-label" htmlFor="c-subject">{t('Topic', 'વિષય')}</label>
                  <select id="c-subject" name="subject" className="form-input" value={form.subject} onChange={handleChange} style={{ width: '100%' }}>
                    <option value="General Consultation Inquiry">{t('General Consultation Inquiry', 'સામાન્ય તપાસ / પરામર્શ')}</option>
                    <option value="ICU Admission Information">{t('ICU Admission Information', 'ICU એડમિશન માહિતી')}</option>
                    <option value="CT Scan / Radiology Booking">{t('CT Scan / Radiology Booking', 'સીટી સ્કેન / રેડિયોલોજી બુકિંગ')}</option>
                    <option value="Dialysis Inquiry">{t('Dialysis Inquiry', 'ડાયાલીસીસ પૂછપરછ')}</option>
                    <option value="Doctor Availability Query">{t('Doctor Availability Query', 'ડોક્ટર ઉપલબ્ધતા પૂછપરછ')}</option>
                  </select>
                </div>
                <div style={{ width: '100%' }}>
                  <label className="form-label" htmlFor="c-msg">{t('Message *', 'સંદેશ / પ્રશ્ન *')}</label>
                  <textarea id="c-msg" name="message" className="form-textarea" rows={4} placeholder={t("Describe your question or the patient's symptoms...", "તમારો પ્રશ્ન અથવા દર્દીના લક્ષણો વિગતે જણાવો...")} value={form.message} onChange={handleChange} required style={{ width: '100%' }} />
                </div>
                <button type="submit" className="btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={16} /> {t('Send on WhatsApp', 'વોટ્સએપ પર મોકલો')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
