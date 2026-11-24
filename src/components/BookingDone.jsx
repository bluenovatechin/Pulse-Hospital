import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, FileDown, Share2, Plus } from 'lucide-react';
import { WhatsAppIcon } from './ui';
import { SlipContent, downloadSlipPdf, shareSlipPdf, requestUrl } from './AppointmentSlip';

/**
 * Shown on the booking page right after the patient submits (no new page).
 * The request goes to the hospital's WhatsApp automatically; the patient
 * sees the confirmation straight away, with nothing else to press.
 */
export default function BookingDone({ appointment: a, lang = 'en', onBookAnother }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const slipRef = useRef(null);
  const panelRef = useRef(null);
  const [busy, setBusy] = useState('');
  const [note, setNote] = useState('');

  // Bring the panel into view as soon as it appears (below the sticky header)
  useEffect(() => {
    const el = panelRef.current;
    if (el) window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 100), behavior: 'smooth' });
  }, []);

  const run = async (kind, fn) => {
    setBusy(kind);
    setNote('');
    setNote(await fn(slipRef.current, a, lang));
    setBusy('');
  };

  return (
    <div className="booking-done card" role="status" aria-live="polite" ref={panelRef}>
      <div className="booking-done-head">
        <span className="booking-done-icon is-sent">
          <CheckCircle2 size={28} />
        </span>
        <div>
          <h2>{t('Your appointment request has been submitted.', 'તમારી એપોઇન્ટમેન્ટ વિનંતી સબમિટ થઈ ગઈ છે.')}</h2>
          <p>{t('Your details have been sent to Pulse Hospital. Reception will reply to you on WhatsApp.', 'તમારી વિગતો પલ્સ હોસ્પિટલને મોકલાઈ ગઈ છે. રિસેપ્શન તમને વોટ્સએપ પર જવાબ આપશે.')}</p>
        </div>
      </div>

      <dl className="booking-done-summary">
        <div><dt>{t('Booking ID', 'બુકિંગ ID')}</dt><dd>{a.id}</dd></div>
        <div><dt>{t('Doctor', 'ડૉક્ટર')}</dt><dd>{lang === 'en' ? a.doctorName : (a.doctorNameGujarati || a.doctorName)}</dd></div>
        <div><dt>{t('Day', 'દિવસ')}</dt><dd>{a.dayFormatted || a.date}</dd></div>
        <div><dt>{t('Time', 'સમય')}</dt><dd>{a.timeSlot}</dd></div>
      </dl>

      <div className="booking-done-actions">
        <button type="button" className="btn btn-secondary" onClick={() => run('pdf', downloadSlipPdf)} disabled={!!busy}>
          <FileDown size={16} /> {busy === 'pdf' ? t('Preparing…', 'તૈયાર થાય છે…') : t('Download slip (PDF)', 'સ્લિપ ડાઉનલોડ (PDF)')}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => run('share', shareSlipPdf)} disabled={!!busy}>
          <Share2 size={16} /> {busy === 'share' ? t('Preparing…', 'તૈયાર થાય છે…') : t('Share slip on WhatsApp', 'સ્લિપ વોટ્સએપ પર શેર કરો')}
        </button>
      </div>

      {note && <p className="slip-note">{note}</p>}

      <p className="booking-done-resend">
        {t('WhatsApp didn’t open?', 'વોટ્સએપ ન ખૂલ્યું?')}{' '}
        <a href={requestUrl(a)} target="_blank" rel="noreferrer"><WhatsAppIcon size={13} /> {t('Send the details again', 'વિગતો ફરી મોકલો')}</a>
      </p>

      <p className="booking-done-foot">
        {t('To see this slip again later, use “My Booking” with your booking ID and mobile number.', 'આ સ્લિપ ફરી જોવા “મારી એપોઇન્ટમેન્ટ” માં બુકિંગ ID અને મોબાઇલ નંબર લખો.')}
        {' '}
        <button type="button" className="booking-done-again" onClick={onBookAnother}>
          <Plus size={14} /> {t('Book another appointment', 'બીજી એપોઇન્ટમેન્ટ બુક કરો')}
        </button>
      </p>

      {/* The slip used for the PDF, kept off-screen */}
      <div className="booking-done-slip" aria-hidden="true">
        <SlipContent ref={slipRef} appointment={a} lang={lang} />
      </div>
    </div>
  );
}
