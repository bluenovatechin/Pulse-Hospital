import React from 'react';
import { CheckCircle, Printer, Share2, X, Calendar, Clock, ShieldCheck, Building2 } from 'lucide-react';
import PulseLogo from './PulseLogo';

export default function AppointmentSlipModal({ appointment, onClose, lang = 'en' }) {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `*Pulse Hospital & I.C.U - Appointment Confirmation*\n` +
      `-----------------------------------------\n` +
      `*Token ID:* ${appointment.id}\n` +
      `*Patient:* ${appointment.patientName}\n` +
      `*Doctor:* ${appointment.doctorName}\n` +
      `*Date:* ${appointment.date}\n` +
      `*Slot:* ${appointment.timeSlot}\n` +
      `*Room:* ${appointment.room}\n` +
      `*Location:* 4th Floor, City Centre, Shamlaji Road, Modasa\n` +
      `*Appointment / WhatsApp Desk:* +91 63533 44875\n` +
      `-----------------------------------------\n` +
      `*Important:* Please bring this file and previous medical reports on your visit.`
    );
    // Directly targeted to user test WhatsApp number: 63533 44875
    window.open(`https://api.whatsapp.com/send?phone=916353344875&text=${message}`, '_blank');
  };

  return (
    <div className="modal-overlay">
      {/* Header and action bar stay put; the slip between them scrolls */}
      <div className="modal-content slip-modal" style={{ maxWidth: '640px', padding: '0' }} role="dialog" aria-modal="true" aria-label="Appointment confirmed">
        
        {/* Modal Top Bar */}
        <div className="no-print" style={{ 
          flexShrink: 0,
          background: 'linear-gradient(135deg, var(--brand-navy) 0%, var(--primary) 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={22} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                {lang === 'en' ? 'Appointment Confirmed!' : 'એપોઇન્ટમેન્ટ કન્ફર્મ થઈ ગઈ!'}
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                {lang === 'en' ? 'Official Advance Booking Receipt & Slip' : 'સત્તાવાર એડવાન્સ બુકિંગ પાવતી & સ્લીપ'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Hospital Receipt Content */}
        <div className="printable-appointment-slip slip-scroll" style={{ padding: '28px' }}>
          
          {/* Hospital Header */}
          <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <PulseLogo size={46} lang={lang} />
              <div style={{ borderLeft: '1.5px solid var(--border-color)', paddingLeft: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  4th Floor, A-block, City Centre, Shamlaji Road, Modasa
                </div>
                <div style={{ fontSize: '11px', color: 'var(--brand-olive)', fontWeight: 700 }}>
                  Helpline & WhatsApp: +91 63533 44875 • 24x7 Emergency Care
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-block', border: '2px dashed var(--primary)', borderRadius: '10px', padding: '8px 16px', background: '#f1f8f4' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  {lang === 'en' ? 'Booking Reference' : 'બુકિંગ સંદર્ભ નંબર'}
                </span>
                <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.05em' }}>
                  {appointment.id}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {lang === 'en' ? 'Status: ' : 'સ્થિતિ: '}<span style={{ color: 'var(--success)', fontWeight: 700 }}>{lang === 'en' ? 'CONFIRMED' : 'કન્ફર્મ થયેલ'}</span>
              </div>
            </div>
          </div>

          {/* Appointment Schedule Box */}
          <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                {lang === 'en' ? 'Date of Visit (Next Week)' : 'મુલાકાતની તારીખ (આગામી સપ્તાહ)'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', fontWeight: 800, color: 'var(--brand-navy)', marginTop: '2px' }}>
                <Calendar size={18} color="var(--primary)" />
                <span>{appointment.date}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                {lang === 'en' ? 'Scheduled Slot Time' : 'નિયત સમય સ્લોટ'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                <Clock size={18} />
                <span>{appointment.timeSlot}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                {lang === 'en' ? 'Consulting Doctor' : 'કન્સલ્ટિંગ તબીબ'}
              </span>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-navy)', marginTop: '2px' }}>
                {appointment.doctorName}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {appointment.doctorSpecialty}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                {lang === 'en' ? 'Assigned Consultation Room' : 'ઓપીડી રૂમ નંબર'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: 800, color: 'var(--brand-navy)', marginTop: '2px' }}>
                <Building2 size={16} color="var(--accent)" />
                <span>{appointment.room}</span>
              </div>
            </div>
          </div>

          {/* Patient Details Table */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
              {lang === 'en' ? 'Patient Record' : 'દર્દીનો રેકોર્ડ'}
            </h4>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', borderBottom: '1px solid var(--border-color)', padding: '8px 12px', fontSize: '13.5px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{lang === 'en' ? 'Patient Name:' : 'દર્દીનું નામ:'}</span>
                <span style={{ fontWeight: 700, color: 'var(--brand-navy)' }}>{appointment.patientName}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', borderBottom: '1px solid var(--border-color)', padding: '8px 12px', fontSize: '13.5px', background: '#f8fafc' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{lang === 'en' ? 'Booking Origin:' : 'બુકિંગ માધ્યમ:'}</span>
                <span style={{ fontWeight: 700, color: appointment.bookedBy === 'Staff' ? 'var(--primary)' : appointment.bookedBy === 'Doctor' ? '#059669' : 'var(--primary)' }}>
                  {appointment.bookedBy === 'Staff'
                    ? (lang === 'en' ? 'Hospital Reception Desk' : 'હોસ્પિટલ રિસેપ્શન કાઉન્ટર')
                    : appointment.bookedBy === 'Doctor'
                    ? (lang === 'en' ? 'Doctor / OPD Follow-up' : 'ડૉક્ટર / OPD ફોલો-અપ')
                    : (lang === 'en' ? 'Patient Self-Booking (Online)' : 'દર્દી પોતે (ઓનલાઈન વેબસાઇટ)')}
                  {appointment.bookedByName && appointment.bookedByName !== 'Self (Online)' ? ` • ${appointment.bookedByName}` : ''}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', borderBottom: '1px solid var(--border-color)', padding: '8px 12px', fontSize: '13.5px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{lang === 'en' ? 'Mobile Number:' : 'મોબાઇલ નંબર:'}</span>
                <span style={{ fontWeight: 700 }}>+91 {appointment.patientPhone}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', borderBottom: '1px solid var(--border-color)', padding: '8px 12px', fontSize: '13.5px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{lang === 'en' ? 'Age / Gender:' : 'ઉંમર અને જાતિ:'}</span>
                <span>
                  {appointment.patientAge ? `${appointment.patientAge} ${lang === 'en' ? 'Years' : 'વર્ષ'}` : (lang === 'en' ? 'N/A' : '-')} • {
                    appointment.patientGender === 'Male'
                      ? (lang === 'en' ? 'Male' : 'પુરુષ')
                      : appointment.patientGender === 'Female'
                      ? (lang === 'en' ? 'Female' : 'સ્ત્રી')
                      : (lang === 'en' ? appointment.patientGender : 'અન્ય')
                  }
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', borderBottom: '1px solid var(--border-color)', padding: '8px 12px', fontSize: '13.5px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{lang === 'en' ? 'City / Area:' : 'ગામ / શહેર:'}</span>
                <span>{appointment.city || 'Modasa'}</span>
              </div>
              {appointment.previousFileNo && (
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', borderBottom: appointment.symptoms ? '1px solid var(--border-color)' : 'none', padding: '8px 12px', fontSize: '13.5px', background: '#fefce8' }}>
                  <span style={{ color: '#854d0e', fontWeight: 600 }}>{lang === 'en' ? 'Hospital File No:' : 'હોસ્પિટલ ફાઇલ નંબર:'}</span>
                  <span style={{ fontWeight: 800, color: '#854d0e' }}>{appointment.previousFileNo}</span>
                </div>
              )}
              {appointment.symptoms && (
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', padding: '8px 12px', fontSize: '13.5px' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{lang === 'en' ? 'Reason / Symptoms:' : 'મુલાકાતનું કારણ / લક્ષણો:'}</span>
                  <span>{appointment.symptoms}</span>
                </div>
              )}
            </div>
          </div>

          {/* Mandatory Brochure Notice Highlight */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(14, 101, 92, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)',
            borderLeft: '4px solid var(--primary)',
            padding: '12px 16px',
            borderRadius: '0 8px 8px 0',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                  {lang === 'en' ? 'Important Instructions (સૂચના):' : 'મહત્વપૂર્ણ સૂચનાઓ:'}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {lang === 'en' 
                    ? '• Please arrive 15 minutes prior to your allocated slot at the 4th Floor reception.' 
                    : '• કૃપા કરીને આપના ફાળવેલ સમય સ્લોટ કરતાં ૧૫ મિનિટ વહેલા ૪થા માળે રિસેપ્શન પર પહોંચવું.'}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
                  {lang === 'en'
                    ? '• "Please bring this file and previous medical reports on your next visit."'
                    : '• "કૃપા કરીને આ ફાઇલ અને તમામ જૂના રિપોર્ટ્સ તમારી મુલાકાત વખતે સાથે લાવવા વિનંતી."'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="slip-footer no-print">
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              className="btn-outline"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              <Printer size={15} />
              <span>{lang === 'en' ? 'Print Slip' : 'સ્લિપ પ્રિન્ટ કરો'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#25D366',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Share2 size={15} />
              <span>{lang === 'en' ? 'Share to WhatsApp' : 'વ્હોટ્સએપ પર મેળવો'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '8px 24px', fontSize: '13px' }}
          >
            {lang === 'en' ? 'Done' : 'પૂર્ણ'}
          </button>
        </div>

      </div>
    </div>
  );
}
