import React, { useState } from 'react';
import { Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Navigation, MessageCircle } from 'lucide-react';
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
      setErrorMsg('Please complete all required fields.');
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
      if (!res.ok) throw new Error(data.error || 'Failed to send message.');
      setSuccessMsg(data.message || 'Your inquiry has been submitted. Our receptionist will call you shortly.');
      setForm(EMPTY_FORM);
    } catch (err) {
      setErrorMsg(err.message || 'Error submitting message. Please call our helpline directly.');
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
        eyebrow={t('Get in touch', 'સંપર્ક કરો')}
        title={t('We’re here for you 24x7', 'અમે ૨૪ કલાક તમારી સેવામાં')}
        text={t('Call for anything urgent. For questions about ICU admission, tests or doctor availability, send a message and reception will call you back.', 'તાત્કાલિક હોય તો કૉલ કરો. બાકી સંદેશ મોકલો — રીસેપ્શન તમને કૉલ કરશે.')}
      >
        <div className="hero-ctas" style={{ marginTop: 22 }}>
          <a className="btn btn-emergency btn-lg" href={HOSPITAL_INFO.phoneHref}><Phone size={18} /> {t('Call now', 'કૉલ કરો')}</a>
          <a className="btn btn-lg btn-ghost-light" href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
          <a className="btn btn-lg btn-ghost-light" href={HOSPITAL_INFO.mapsUrl} target="_blank" rel="noreferrer"><Navigation size={18} /> {t('Directions', 'રસ્તો')}</a>
        </div>
      </PageHero>

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

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label" htmlFor="c-name">Full name *</label>
                  <input id="c-name" name="name" className="form-input" placeholder="Your name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                  <div>
                    <label className="form-label" htmlFor="c-phone">Mobile number *</label>
                    <input id="c-phone" type="tel" name="phone" className="form-input" placeholder="10-digit mobile" value={form.phone} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="c-email">Email (optional)</label>
                    <input id="c-email" type="email" name="email" className="form-input" placeholder="email@domain.com" value={form.email} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label className="form-label" htmlFor="c-subject">Topic</label>
                  <select id="c-subject" name="subject" className="form-input" value={form.subject} onChange={handleChange}>
                    <option>General Consultation Inquiry</option>
                    <option>ICU Admission Information</option>
                    <option>CT Scan / Radiology Booking</option>
                    <option>Dialysis Inquiry</option>
                    <option>Doctor Availability Query</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" htmlFor="c-msg">Message *</label>
                  <textarea id="c-msg" name="message" className="form-textarea" rows={4} placeholder="Describe your question or the patient's symptoms…" value={form.message} onChange={handleChange} required />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary btn-lg">
                  <Send size={16} /> {submitting ? 'Sending…' : 'Send inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
