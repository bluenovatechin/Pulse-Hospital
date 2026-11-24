import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, FileDown, Share2, Plus } from 'lucide-react';
import { WhatsAppIcon } from './ui';
import { SlipContent, downloadSlipPdf, shareSlipPdf, requestUrl } from './AppointmentSlip';

/**
 * Shown on the booking page right after "Send on WhatsApp" (no new page).
 * WhatsApp opens with the details already typed; when the patient comes
 * back to the site, the panel switches to "sent".
 */
export default function BookingDone({ appointment: a, lang = 'en', onBookAnother }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const slipRef = useRef(null);
  const panelRef = useRef(null);
  const [sent, setSent] = useState(false);

  // Bring the panel into view as soon as it appears (below the sticky header)
  useEffect(() => {
    const el = panelRef.current;
    if (el) window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 100), behavior: 'smooth' });
  }, []);
  const [busy, setBusy] = useState('');
  const [note, setNote] = useState('');

  // The site can't see inside WhatsApp, so treat "came back to the site
  // after WhatsApp opened" as sent
  useEffect(() => {
    let left = false;
    const away = () => { left = true; };
    const back = () => { if (left) setSent(true); };
    const onVisibility = () => (document.visibilityState === 'hidden' ? away() : back());
    window.addEventListener('blur', away);
    window.addEventListener('focus', back);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('blur', away);
      window.removeEventListener('focus', back);
      document.removeEventListener('visibilitychange', onVisibility);
    };
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
        <span className={`booking-done-icon ${sent ? 'is-sent' : ''}`}>
          {sent ? <CheckCircle2 size={28} /> : <WhatsAppIcon size={26} />}
        </span>
        <div>
          <h2>
            {sent
              ? t('Your details have been sent on WhatsApp.', 'તમારી વિગતો વોટ્સએપ પર મોકલાઈ ગઈ છે.')
              : t('Your details are ready in WhatsApp. Press Send to submit.', 'તમારી વિગતો વોટ્સએપમાં તૈયાર છે. સબમિટ કરવા Send દબાવો.')}
          </h2>
          <p>
            {sent
              ? t('Reception will reply to you on WhatsApp.', 'રિસેપ્શન તમને વોટ્સએપ પર જવાબ આપશે.')
              : t('If WhatsApp did not open, tap the button below.', 'જો વોટ્સએપ ન ખૂલ્યું હોય તો નીચેનું બટન દબાવો.')}
          </p>
        </div>
      </div>

      <dl className="booking-done-summary">
        <div><dt>{t('Booking ID', 'બુકિંગ ID')}</dt><dd>{a.id}</dd></div>
        <div><dt>{t('Doctor', 'ડૉક્ટર')}</dt><dd>{lang === 'en' ? a.doctorName : (a.doctorNameGujarati || a.doctorName)}</dd></div>
        <div><dt>{t('Day', 'દિવસ')}</dt><dd>{a.dayFormatted || a.date}</dd></div>
        <div><dt>{t('Time', 'સમય')}</dt><dd>{a.timeSlot}</dd></div>
      </dl>

      <div className="booking-done-actions">
        {!sent && (
          <a className="btn slip-wa" href={requestUrl(a)} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={17} /> {t('Open WhatsApp', 'વોટ્સએપ ખોલો')}
          </a>
        )}
        <button type="button" className="btn btn-secondary" onClick={() => run('pdf', downloadSlipPdf)} disabled={!!busy}>
          <FileDown size={16} /> {busy === 'pdf' ? t('Preparing…', 'તૈયાર થાય છે…') : t('Download slip (PDF)', 'સ્લિપ ડાઉનલોડ (PDF)')}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => run('share', shareSlipPdf)} disabled={!!busy}>
          <Share2 size={16} /> {busy === 'share' ? t('Preparing…', 'તૈયાર થાય છે…') : t('Share slip on WhatsApp', 'સ્લિપ વોટ્સએપ પર શેર કરો')}
        </button>
      </div>

      {note && <p className="slip-note">{note}</p>}

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
