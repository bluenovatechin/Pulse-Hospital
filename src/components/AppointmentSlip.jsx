import React, { forwardRef, useRef, useState } from 'react';
import { Printer, Calendar, Clock, ShieldCheck, Building2, FileDown, Share2, XCircle, Search } from 'lucide-react';
import PulseLogo from './PulseLogo';
import { Link } from '../router';
import { HOSPITAL_INFO } from '../data/hospitalContent';
import { cancelAppointment, STATUS } from '../lib/appointments';

/** WhatsApp message sent to reception for a booking */
export function requestText(a) {
  return [
    '🏥 *PULSE HOSPITAL & I.C.U: MODASA*',
    '*Appointment Booking Request*',
    '───────────────────────────────',
    `📋 *Reference ID:* ${a.id}`,
    `👨‍⚕️ *Doctor:* ${a.doctorName}${a.doctorQualification ? ` (${a.doctorQualification})` : ''}`,
    `🏢 *Room:* ${a.room}`,
    `📅 *Date:* ${a.dayFormatted || a.date}`,
    `⏰ *Time Slot:* ${a.timeSlot}`,
    '───────────────────────────────',
    `👤 *Patient Name:* ${a.patientName}`,
    `📞 *Phone Number:* ${a.patientPhone}`,
    `🎂 *Age / Gender:* ${a.patientAge && a.patientAge !== 'N/A' ? `${a.patientAge} yrs` : 'N/A'}, ${a.patientGender}`,
    `📍 *City / Area:* ${a.city || 'Modasa'}`,
    a.bookedBy && a.bookedBy !== 'Patient' ? `🧾 *Booked By:* ${a.bookedBy}${a.bookedByName ? ` (${a.bookedByName})` : ''}` : '',
    a.previousFileNo ? `📁 *Past File No:* ${a.previousFileNo}` : '',
    a.symptoms ? `📝 *Symptoms / Problem:* ${a.symptoms}` : '',
    '───────────────────────────────',
    '_Sent via Pulse Hospital Online Booking Portal_'
  ].filter(Boolean).join('\n');
}

export const requestUrl = (a) => `https://wa.me/${HOSPITAL_INFO.whatsappNumber}?text=${encodeURIComponent(requestText(a))}`;

// ---- PDF of the slip (libraries load only when needed) ----
async function makePdf(node, fileName) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
  const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false });
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 10;
  let w = pageW - margin * 2;
  let h = (canvas.height * w) / canvas.width;
  if (h > pageH - margin * 2) {
    h = pageH - margin * 2;
    w = (canvas.width * h) / canvas.height;
  }
  pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', (pageW - w) / 2, margin, w, h);
  return new File([pdf.output('blob')], fileName, { type: 'application/pdf' });
}

function download(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Download / share helpers for a slip element.
 * Share: phones open the share sheet with the PDF attached (pick WhatsApp);
 * computers download the PDF and open WhatsApp to attach it.
 * Returns a short message to show the user, or '' when nothing to say.
 */
export async function downloadSlipPdf(node, a, lang = 'en') {
  try {
    download(await makePdf(node, `Pulse-Hospital-${a.id}.pdf`));
    return '';
  } catch {
    return lang === 'en' ? 'Could not create the PDF. Please use Print instead.' : 'PDF બનાવી શકાઈ નહીં. કૃપા કરીને પ્રિન્ટ વાપરો.';
  }
}

export async function shareSlipPdf(node, a, lang = 'en') {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const text = t(
    `Appointment slip ${a.id}: ${a.doctorName}, ${a.dayFormatted || a.date}, ${a.timeSlot}. Pulse Hospital & I.C.U, 4th Floor, City Centre, Shamlaji Road, Modasa.`,
    `એપોઇન્ટમેન્ટ સ્લિપ ${a.id}: ${a.doctorName}, ${a.dayFormatted || a.date}, ${a.timeSlot}. પલ્સ હોસ્પિટલ & આઈ.સી.યુ., ૪થો માળ, સીટી સેન્ટર, શામળાજી રોડ, મોડાસા.`
  );
  try {
    const file = await makePdf(node, `Pulse-Hospital-${a.id}.pdf`);
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: `Pulse Hospital ${a.id}`, text });
      return '';
    }
    download(file);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    return t('The PDF was downloaded. In WhatsApp, choose the contact and attach the downloaded PDF.', 'PDF ડાઉનલોડ થઈ ગઈ છે. વોટ્સએપમાં સંપર્ક પસંદ કરી ડાઉનલોડ થયેલી PDF જોડો.');
  } catch (err) {
    if (err && err.name === 'AbortError') return '';
    return t('Could not share the PDF. Please download it and attach it in WhatsApp.', 'PDF શેર થઈ શકી નહીં. કૃપા કરીને ડાઉનલોડ કરી વોટ્સએપમાં જોડો.');
  }
}

/** The slip itself: printed and turned into the PDF */
export const SlipContent = forwardRef(function SlipContent({ appointment: a, lang = 'en' }, ref) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const cancelled = a.status === STATUS.CANCELLED;
  const row = (label, value) => (
    <div className="slip-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );

  return (
    <div className="printable-appointment-slip" ref={ref}>
      <div className="slip-top">
        <div className="slip-brand">
          <PulseLogo size={44} />
          <div className="slip-addr">
            <span>4th Floor, A-block, City Centre, Shamlaji Road, Modasa</span>
            <span>Helpline & WhatsApp: {HOSPITAL_INFO.appointmentNumber} · 24x7 Emergency</span>
          </div>
        </div>
        <div className="slip-ref">
          <small>{t('Booking reference', 'બુકિંગ સંદર્ભ નંબર')}</small>
          <strong>{a.id}</strong>
          <span className={`slip-chip ${cancelled ? 'is-cancelled' : 'is-sent'}`}>
            {cancelled ? t('Cancelled', 'રદ થયેલ') : t('Sent on WhatsApp', 'વોટ્સએપ પર મોકલાયું')}
          </span>
        </div>
      </div>

      <div className="slip-when">
        <div>
          <small>{t('Date of visit', 'મુલાકાતની તારીખ')}</small>
          <strong><Calendar size={16} /> {a.dayFormatted || a.date}</strong>
        </div>
        <div>
          <small>{t('Time slot', 'સમય સ્લોટ')}</small>
          <strong><Clock size={16} /> {a.timeSlot}</strong>
        </div>
        <div>
          <small>{t('Doctor', 'ડૉક્ટર')}</small>
          <strong>{lang === 'en' ? a.doctorName : (a.doctorNameGujarati || a.doctorName)}</strong>
        </div>
        <div>
          <small>{t('Room', 'રૂમ')}</small>
          <strong><Building2 size={16} /> {a.room}</strong>
        </div>
      </div>

      <h4 className="slip-subhead">{t('Patient details', 'દર્દીની વિગત')}</h4>
      <div className="slip-table">
        {row(t('Patient name', 'દર્દીનું નામ'), a.patientName)}
        {row(t('Mobile number', 'મોબાઇલ નંબર'), `+91 ${a.patientPhone}`)}
        {row(t('Age / gender', 'ઉંમર / જાતિ'), `${a.patientAge && a.patientAge !== 'N/A' ? `${a.patientAge} ${t('years', 'વર્ષ')}` : '–'} · ${a.patientGender === 'Female' ? t('Female', 'સ્ત્રી') : a.patientGender === 'Male' ? t('Male', 'પુરુષ') : a.patientGender || '–'}`)}
        {row(t('City / area', 'ગામ / શહેર'), a.city || 'Modasa')}
        {a.previousFileNo && row(t('Hospital file no.', 'હોસ્પિટલ ફાઇલ નંબર'), a.previousFileNo)}
        {a.symptoms && row(t('Reason / symptoms', 'કારણ / લક્ષણો'), a.symptoms)}
      </div>

      <div className="slip-notice">
        <ShieldCheck size={18} />
        <div>
          <p>{t('Reception will reply to you on WhatsApp.', 'રિસેપ્શન તમને વોટ્સએપ પર જવાબ આપશે.')}</p>
          <p>{t('Please arrive 15 minutes before your slot at the 4th floor reception, with this slip and your previous medical reports.', 'કૃપા કરીને સ્લોટથી ૧૫ મિનિટ વહેલા ૪થા માળે રિસેપ્શન પર, આ સ્લિપ અને જૂના રિપોર્ટ્સ સાથે આવો.')}</p>
        </div>
      </div>
    </div>
  );
});

// Full slip view used on /my-appointments/<id> (after ID + mobile check)
export default function AppointmentSlip({ appointment, lang = 'en', onChange }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const slipRef = useRef(null);
  const [busy, setBusy] = useState('');
  const [note, setNote] = useState('');
  if (!appointment) return null;
  const a = appointment;

  const run = async (kind, fn) => {
    setBusy(kind);
    setNote('');
    setNote(await fn(slipRef.current, a, lang));
    setBusy('');
  };

  const handleCancel = () => {
    if (!window.confirm(t('Cancel this appointment? A cancellation message for reception will open in WhatsApp.', 'આ એપોઇન્ટમેન્ટ રદ કરવી છે? રિસેપ્શન માટે રદ કરવાનો સંદેશ વોટ્સએપમાં ખુલશે.'))) return;
    const next = cancelAppointment(a.id);
    if (next && onChange) onChange(next);
    const msg = `Hello Pulse Hospital, I am cancelling my appointment (ID: ${a.id}, ${a.doctorName}, ${a.dayFormatted || a.date}, ${a.timeSlot}). Please release the slot.`;
    window.open(`https://wa.me/${HOSPITAL_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="card page-card slip-card">
      <SlipContent ref={slipRef} appointment={a} lang={lang} />

      <div className="slip-footer no-print">
        <div className="slip-actions">
          <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> {t('Print', 'પ્રિન્ટ')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => run('pdf', downloadSlipPdf)} disabled={!!busy}>
            <FileDown size={16} /> {busy === 'pdf' ? t('Preparing…', 'તૈયાર થાય છે…') : t('Download PDF', 'PDF ડાઉનલોડ')}
          </button>
          <button type="button" className="btn slip-wa" onClick={() => run('share', shareSlipPdf)} disabled={!!busy}>
            <Share2 size={16} /> {busy === 'share' ? t('Preparing…', 'તૈયાર થાય છે…') : t('Share slip on WhatsApp', 'સ્લિપ વોટ્સએપ પર શેર કરો')}
          </button>
        </div>
        <div className="slip-actions">
          {a.status !== STATUS.CANCELLED && (
            <button type="button" className="btn btn-ghost slip-cancel" onClick={handleCancel}>
              <XCircle size={16} /> {t('Cancel booking', 'બુકિંગ રદ કરો')}
            </button>
          )}
          <Link to="my-appointments" className="btn btn-ghost">
            <Search size={16} /> {t('Open another booking', 'બીજી બુકિંગ ખોલો')}
          </Link>
        </div>
        {note && <p className="slip-note" role="status">{note}</p>}
      </div>
    </div>
  );
}
