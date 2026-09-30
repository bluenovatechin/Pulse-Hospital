import React, { useState } from 'react';
import { Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Navigation, MessageCircle, Siren } from 'lucide-react';
import { PageHero } from '../components/ui';
import { HOSPITAL_INFO, PHOTOS } from '../data/hospitalContent';
import { API } from '../api';

const EMPTY_FORM = { name: '', phone: '', email: '', subject: 'General Consultation Inquiry', message: '' };

export default function ContactPage({ onNavigate, lang = 'en' }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const t = (en, gu) => (lang === 'en' ? en : gu);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (!form.name || !form.phone || !form.message) {
      setErrorMsg(t('Please complete all required fields.', 'કૃપા કરીને જરૂરી તમામ વિગતો ભરો.'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(API + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('Failed to send message.', 'સંદેશ મોકલવામાં નિષ્ફળતા.'));
      setSuccessMsg(data.message || t('Your inquiry has been submitted. Our receptionist will call you shortly.', 'તમારી પૂછપરછ નોંધાઈ ગઈ છે. અમારો સ્ટાફ ટૂંક સમયમાં તમને સંપર્ક કરશે.'));
      setForm(EMPTY_FORM);
    } catch (err) {
      setErrorMsg(err.message || t('Error submitting message. Please call our helpline directly.', 'સંદેશ મોકલવામાં ક્ષતિ થઈ. કૃપા કરીને સીધા હેલ્પલાઈન પર કૉલ કરો.'));
    } finally {
      setSubmitting(false);
    }
  };

  const cards = [
    {
      icon: Phone, tone: 'red', title: t('Phone & emergency', 'ફોન & ઇમરજન્સી'),
      body: <><a href={HOSPITAL_INFO.phoneHref} style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-navy)' }}>{HOSPITAL_INFO.appointmentNumber}</a><br />{t('Appointments, emergencies and WhatsApp', 'એપોઇન્ટમેન્ટ, ઇમરજન્સી અને વોટ્સએપ')}</>
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
        photo={PHOTOS.waiting}
        crumbs={t('Contact', 'સંપર્ક')}
        onHome={() => onNavigate('home')}
        eyebrow={t('Contact & Immediate Assistance', 'સંપર્ક અને તાત્કાલિક સહાય')}
        eyebrowIcon={<Phone size={14} />}
        title={t('We’re here for you 24x7', 'અમે ૨૪ કલાક તમારી સેવામાં')}
        text={t(
          'Call for anything urgent. For questions about ICU admission, tests or doctor availability, send a message and reception will call you back.',
          'તાત્કાલિક હોય તો કૉલ કરો. બાકી સંદેશ મોકલો, રીસેપ્શન તમને કૉલ કરશે.'
        )}
        cardTitle={t('Emergency Lines & Direct Desk', 'ઇમરજન્સી હેલ્પલાઇન અને સહાય')}
        cardBadge={t('Live 24x7 Desk Active', '૨૪x૭ હેલ્પલાઇન કાર્યરત')}
        cardIcon={<Siren size={18} />}
        stats={[
          { value: '24x7', label: t('Emergency Line', 'ઇમરજન્સી લાઇન'), sub: '95120 45641' },
          { value: 'Trauma', label: t('Ambulance Care', 'એમ્બ્યુલન્સ લાઇન'), sub: '95120 45642' },
          { value: 'OPD Desk', label: t('Appointments', 'એપોઇન્ટમેન્ટ'), sub: '75674 07272' },
          { value: '4th Floor', label: t('City Centre', 'સિટી સેન્ટર'), sub: t('Shamlaji Road', 'શામળાજી રોડ') }
        ]}
        highlights={[
          t('Resident doctor stationed bedside on the 4th floor day & night', 'ડૉક્ટર ૨૪ કલાક આઈ.સી.યુ. ફ્લોર પર હાજર'),
          t('Ambulance equipped with emergency oxygen & resuscitation support', 'ઓક્સિજન અને લાઈફ સપોર્ટ સુવિધા સાથે એમ્બ્યુલન્સ'),
          t('Direct WhatsApp desk for test reports, inquiries and location help', 'રિપોર્ટ્સ અને પૂછપરછ માટે વોટ્સએપ હેલ્પડેસ્ક')
        ]}
        actions={
          <>
            <a className="btn btn-emergency" href={HOSPITAL_INFO.phoneHref}>
              <Phone size={17} /> {t('Call Emergency Desk', 'ઇમરજન્સી કૉલ')}
            </a>
            <a className="btn btn-ghost-light" href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber}`} target="_blank" rel="noreferrer">
              <MessageCircle size={17} /> WhatsApp
            </a>
            <a className="btn btn-ghost-light" href={HOSPITAL_INFO.mapsUrl} target="_blank" rel="noreferrer">
              <Navigation size={17} /> {t('GPS Directions', 'રસ્તો જુઓ')}
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
                <button type="submit" disabled={submitting} className="btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={16} /> {submitting ? t('Sending...', 'મોકલાઈ રહ્યું છે...') : t('Send inquiry', 'પૂછપરછ મોકલો')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
