import React, { useRef, useState } from 'react';
import { Printer, Calendar, Clock, ShieldCheck, Building2, FileDown, Share2, CheckCircle2, Send, XCircle, Search } from 'lucide-react';
import PulseLogo from './PulseLogo';
import { WhatsAppIcon } from './ui';
import { Link } from '../router';
import { HOSPITAL_INFO } from '../data/hospitalContent';
import { setStatus, cancelAppointment, STATUS } from '../lib/appointments';

// Message the patient sends to reception to request the slot
function requestText(a) {
  return [
    '🏥 *PULSE HOSPITAL & I.C.U: MODASA*',
    '*Appointment Booking Request*',
    '───────────────────────────────',
    `📋 *Reference ID:* ${a.id}`,
    `👨‍⚕️ *Doctor:* ${a.doctorName}`,
    `🏢 *Room:* ${a.room}`,
    `📅 *Date:* ${a.dayFormatted || a.date}`,
    `⏰ *Time Slot:* ${a.timeSlot}`,
    '───────────────────────────────',
    `👤 *Patient Name:* ${a.patientName}`,
    `📞 *Phone Number:* ${a.patientPhone}`,
    `🎂 *Age / Gender:* ${a.patientAge && a.patientAge !== 'N/A' ? `${a.patientAge} yrs` : 'N/A'}, ${a.patientGender}`,
    `📍 *City / Area:* ${a.city || 'Modasa'}`,
    a.previousFileNo ? `📁 *Past File No:* ${a.previousFileNo}` : '',
    a.symptoms ? `📝 *Symptoms / Problem:* ${a.symptoms}` : '',
    '───────────────────────────────',
    '_Sent via Pulse Hospital Online Booking Portal_'
  ].filter(Boolean).join('\n');
}

// Status shown on the slip, with the next step for the patient
const STATUS_UI = {
  [STATUS.PENDING]: { tone: 'pending', en: 'Not sent yet', gu: 'હજુ મોકલાયું નથી' },
  [STATUS.REQUESTED]: { tone: 'requested', en: 'Awaiting confirmation', gu: 'કન્ફર્મેશનની રાહ' },
  [STATUS.CONFIRMED]: { tone: 'confirmed', en: 'Confirmed by reception', gu: 'રિસેપ્શન દ્વારા કન્ફર્મ' },
  [STATUS.CANCELLED]: { tone: 'cancelled', en: 'Cancelled', gu: 'રદ થયેલ' }
};

// Make an A4 PDF of the slip (libraries load only when needed)
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
  const blob = pdf.output('blob');
  return new File([blob], fileName, { type: 'application/pdf' });
}

function download(file) {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// Printable appointment slip (shown on /my-appointments/<id> after verification)
export default function AppointmentSlip({ appointment, lang = 'en', onChange }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const slipRef = useRef(null);
  const [busy, setBusy] = useState('');
  const [note, setNote] = useState('');
  if (!appointment) return null;

  const a = appointment;
  const status = STATUS_UI[a.status] || STATUS_UI[STATUS.REQUESTED];
  const fileName = `Pulse-Hospital-${a.id}.pdf`;

  const update = (next) => next && onChange && onChange(next);

  const sendRequest = () => {
    window.open(`https://wa.me/${HOSPITAL_INFO.whatsappNumber}?text=${encodeURIComponent(requestText(a))}`, '_blank');
  };

  const handlePdf = async () => {
    setBusy('pdf');
    setNote('');
    try {
      download(await makePdf(slipRef.current, fileName));
    } catch {
      setNote(t('Could not create the PDF. Please use Print instead.', 'PDF બનાવી શકાઈ નહીં. કૃપા કરીને પ્રિન્ટ વાપરો.'));
    } finally {
      setBusy('');
    }
  };

  // Phones: share sheet with the PDF attached (pick WhatsApp, then any contact).
  // Computers: download the PDF and open WhatsApp to attach it.
  const handleShare = async () => {
    setBusy('share');
    setNote('');
    const text = t(
      `Appointment slip ${a.id}: ${a.doctorName}, ${a.dayFormatted || a.date}, ${a.timeSlot}. Pulse Hospital & I.C.U, 4th Floor, City Centre, Shamlaji Road, Modasa.`,
      `એપોઇન્ટમેન્ટ સ્લિપ ${a.id}: ${a.doctorName}, ${a.dayFormatted || a.date}, ${a.timeSlot}. પલ્સ હોસ્પિટલ & આઈ.સી.યુ., ૪થો માળ, સીટી સેન્ટર, શામળાજી રોડ, મોડાસા.`
    );
    try {
      const file = await makePdf(slipRef.current, fileName);
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `Pulse Hospital ${a.id}`, text });
      } else {
        download(file);
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        setNote(t('The PDF was downloaded. In WhatsApp, choose the contact and attach the downloaded PDF.', 'PDF ડાઉનલોડ થઈ ગઈ છે. વોટ્સએપમાં સંપર્ક પસંદ કરી ડાઉનલોડ થયેલી PDF જોડો.'));
      }
    } catch (err) {
      if (err && err.name !== 'AbortError') {
        setNote(t('Could not share the PDF. Please download it and attach it in WhatsApp.', 'PDF શેર થઈ શકી નહીં. કૃપા કરીને ડાઉનલોડ કરી વોટ્સએપમાં જોડો.'));
      }
    } finally {
      setBusy('');
    }
  };

  const handleCancel = () => {
    if (!window.confirm(t('Cancel this appointment? A cancellation message for reception will open in WhatsApp.', 'આ એપોઇન્ટમેન્ટ રદ કરવી છે? રિસેપ્શન માટે રદ કરવાનો સંદેશ વોટ્સએપમાં ખુલશે.'))) return;
    update(cancelAppointment(a.id));
    const msg = `Hello Pulse Hospital, I am cancelling my appointment (ID: ${a.id}, ${a.doctorName}, ${a.dayFormatted || a.date}, ${a.timeSlot}). Please release the slot.`;
    window.open(`https://wa.me/${HOSPITAL_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const row = (label, value, extra = {}) => (
    <div className="slip-row" style={extra}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );

  return (
    <div className="card page-card slip-card">
      {/* Status and next step (not printed) */}
      <div className={`slip-status no-print is-${status.tone}`}>
        <div className="slip-status-text">
          <strong>{t(status.en, status.gu)}</strong>
          <span>
            {a.status === STATUS.PENDING && t('Your slot is requested only after you send the WhatsApp message to reception.', 'રિસેપ્શનને વોટ્સએપ સંદેશ મોકલ્યા પછી જ સ્લોટની વિનંતી થાય છે.')}
            {a.status === STATUS.REQUESTED && t('Reception will confirm your slot on WhatsApp.', 'રિસેપ્શન વોટ્સએપ પર તમારો સ્લોટ કન્ફર્મ કરશે.')}
            {a.status === STATUS.CONFIRMED && t('Please arrive 15 minutes early at the 4th floor reception.', 'કૃપા કરીને ૧૫ મિનિટ વહેલા ૪થા માળે રિસેપ્શન પર આવો.')}
            {a.status === STATUS.CANCELLED && t('This booking was cancelled.', 'આ બુકિંગ રદ કરવામાં આવી છે.')}
          </span>
        </div>
        <div className="slip-status-actions">
          {a.status === STATUS.PENDING && (
            <>
              <button type="button" className="btn slip-wa" onClick={sendRequest}><WhatsAppIcon size={17} /> {t('Send on WhatsApp', 'વોટ્સએપ પર મોકલો')}</button>
              <button type="button" className="btn btn-secondary" onClick={() => update(setStatus(a.id, STATUS.REQUESTED))}><Send size={16} /> {t('I’ve sent it', 'મેં મોકલી દીધું')}</button>
            </>
          )}
          {a.status === STATUS.REQUESTED && (
            <>
              <button type="button" className="btn btn-secondary" onClick={() => update(setStatus(a.id, STATUS.CONFIRMED))}><CheckCircle2 size={16} /> {t('Reception confirmed', 'રિસેપ્શને કન્ફર્મ કર્યું')}</button>
              <button type="button" className="btn btn-ghost" onClick={sendRequest}><WhatsAppIcon size={16} /> {t('Send again', 'ફરી મોકલો')}</button>
            </>
          )}
        </div>
      </div>

      {/* Printable / PDF content */}
      <div className="printable-appointment-slip" ref={slipRef}>
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
            <span className={`slip-chip is-${status.tone}`}>{t(status.en, status.gu)}</span>
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
            <p>{t('Please arrive 15 minutes before your slot at the 4th floor reception.', 'કૃપા કરીને તમારા સ્લોટથી ૧૫ મિનિટ વહેલા ૪થા માળે રિસેપ્શન પર આવો.')}</p>
            <p>{t('Please bring this slip and your previous medical reports.', 'કૃપા કરીને આ સ્લિપ અને જૂના તબીબી રિપોર્ટ્સ સાથે લાવો.')}</p>
          </div>
        </div>
      </div>

      {/* Actions (not printed) */}
      <div className="slip-footer no-print">
        <div className="slip-actions">
          <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> {t('Print', 'પ્રિન્ટ')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handlePdf} disabled={!!busy}>
            <FileDown size={16} /> {busy === 'pdf' ? t('Preparing…', 'તૈયાર થાય છે…') : t('Download PDF', 'PDF ડાઉનલોડ')}
          </button>
          <button type="button" className="btn slip-wa" onClick={handleShare} disabled={!!busy}>
            <Share2 size={16} /> {busy === 'share' ? t('Preparing…', 'તૈયાર થાય છે…') : t('Share PDF on WhatsApp', 'PDF વોટ્સએપ પર શેર કરો')}
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
