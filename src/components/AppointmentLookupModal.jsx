import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Calendar, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Building2, 
  Trash2,
  FileText,
  MessageCircle
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalContent';

export default function AppointmentLookupModal({ onClose, onViewSlip, lang = 'en' }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [localHistory, setLocalHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  // Load recent bookings from localStorage on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('pulse_hospital_appointments') || '[]');
      setLocalHistory(stored);
      if (stored.length > 0 && results === null) {
        setResults(stored);
      }
    } catch (e) {
      setLocalHistory([]);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults(localHistory);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const stored = JSON.parse(localStorage.getItem('pulse_hospital_appointments') || '[]');
      const matches = stored.filter(a => 
        (a.id && a.id.toLowerCase().includes(q)) ||
        (a.patientPhone && a.patientPhone.includes(q)) ||
        (a.patientName && a.patientName.toLowerCase().includes(q))
      );
      setResults(matches);
    } catch (err) {
      setErrorMsg(err.message || 'Error looking up appointment.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = (id) => {
    const confirmPrompt = lang === 'en'
      ? 'Are you sure you want to cancel this appointment slot? We will also prepare a cancellation message for the hospital WhatsApp.'
      : 'શું તમે ખરેખર આ એપોઇન્ટમેન્ટ સ્લોટ રદ કરવા માંગો છો? હોસ્પિટલ વોટ્સએપ માટે પણ રદ કરવાનો સંદેશ તૈયાર થશે.';

    if (!window.confirm(confirmPrompt)) {
      return;
    }

    setCancellingId(id);
    try {
      const stored = JSON.parse(localStorage.getItem('pulse_hospital_appointments') || '[]');
      const updated = stored.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a);
      localStorage.setItem('pulse_hospital_appointments', JSON.stringify(updated));
      setResults(prev => (prev || []).map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
      setLocalHistory(updated);

      // Notify hospital desk via WhatsApp
      const cancelMsg = `Hello Pulse Hospital, I would like to inform that I am cancelling my appointment (ID: ${id}). Please release the slot.`;
      const waUrl = `https://wa.me/${HOSPITAL_INFO.whatsappNumber}?text=${encodeURIComponent(cancelMsg)}`;
      window.open(waUrl, '_blank');
    } catch (err) {
      alert(lang === 'en' ? 'Error updating appointment.' : 'એપોઇન્ટમેન્ટ રદ કરવામાં ક્ષતિ આવી.');
    } finally {
      setCancellingId(null);
    }
  };

  const logoSrc = `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/rendered.png`;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', padding: '0' }}>
        
        {/* Header */}
        <div style={{
          background: 'var(--brand-navy)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src={logoSrc} 
              alt="Pulse Hospital" 
              style={{ width: 38, height: 38, objectFit: 'contain', flexShrink: 0 }} 
            />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                {lang === 'en' ? 'Track My Appointment' : 'મારી એપોઇન્ટમેન્ટ ચેક કરો'}
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                {lang === 'en'
                  ? 'Search using your 10-digit mobile number or Booking ID (e.g. PLS-920101)'
                  : '૧૦ આંકડાનો મોબાઇલ નંબર અથવા બુકિંગ ID (દા.ત. PLS-920101) દ્વારા શોધો'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search input form */}
        <div style={{ padding: '24px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="form-input"
                placeholder={lang === 'en' ? 'Mobile number or Booking ID...' : 'મોબાઇલ નંબર અથવા બુકિંગ ID...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                style={{ width: '100%' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Search size={16} />
              <span>{loading ? (lang === 'en' ? 'Searching...' : 'શોધાઈ રહ્યું છે...') : (lang === 'en' ? 'Search' : 'શોધો')}</span>
            </button>
          </form>

          {/* Results list */}
          {errorMsg && (
            <div style={{ padding: '12px', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          {results !== null && (
            <div>
              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--text-muted)' }}>
                  <AlertCircle size={32} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                  <p style={{ fontWeight: 600 }}>
                    {query 
                      ? (lang === 'en' ? `No bookings found matching "${query}"` : `"${query}" માટે કોઈ બુકિંગ મળ્યું નથી`)
                      : (lang === 'en' ? 'No saved bookings found on this device.' : 'આ ડિવાઇસ પર કોઈ બુકિંગ રેકોર્ડ મળ્યો નથી.')}
                  </p>
                  <p style={{ fontSize: '12px', marginTop: '6px', maxWidth: '380px', margin: '6px auto 16px' }}>
                    {lang === 'en'
                      ? 'Did you book through another phone or need help? You can directly chat with Pulse Hospital reception desk on WhatsApp.'
                      : 'જો આપે અન્ય ફોનથી બુકિંગ કર્યું હોય તો સીધા હોસ્પિટલ રિસેપ્શન વોટ્સએપ પર સંપર્ક કરી શકો છો.'}
                  </p>
                  <a
                    href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber}?text=${encodeURIComponent(query ? `Hello Pulse Hospital, I want to verify my appointment for: ${query}` : `Hello Pulse Hospital, I want to check my appointment status.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#16a34a',
                      color: '#ffffff',
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700,
                      fontSize: '13px',
                      textDecoration: 'none'
                    }}
                  >
                    <MessageCircle size={16} />
                    <span>{lang === 'en' ? 'Chat with Reception on WhatsApp' : 'વોટ્સએપ પર રિસેપ્શનનો સંપર્ક કરો'}</span>
                  </a>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {query 
                      ? (lang === 'en' ? `Search Results (${results.length})` : `પરિણામો (${results.length})`)
                      : (lang === 'en' ? `Your Bookings on this Device (${results.length})` : `તમારી બુકિંગ્સ (${results.length})`)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '380px', overflowY: 'auto' }}>
                    {results.map((appt) => (
                      <div
                        key={appt.id}
                        style={{
                          border: '1.5px solid var(--border-color)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '16px',
                          background: appt.status === 'Cancelled' ? '#f8fafc' : '#ffffff',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
                              {appt.id}
                            </span>
                            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                              {appt.patientName}
                            </h4>
                          </div>

                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            backgroundColor: appt.status === 'Cancelled' ? '#fee2e2' : '#dcfce7',
                            color: appt.status === 'Cancelled' ? '#b91c1c' : '#15803d'
                          }}>
                            {appt.status === 'Cancelled' ? (lang === 'en' ? 'CANCELLED' : 'રદ થયેલ') : (lang === 'en' ? 'CONFIRMED' : 'કન્ફર્મ થયેલ')}
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)', margin: '10px 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Calendar size={14} color="var(--primary)" />
                            <span>{appt.dayFormatted || appt.date}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Clock size={14} color="var(--accent)" />
                            <span>{appt.timeSlot}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <User size={14} />
                            <span>{appt.doctorName}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Building2 size={14} />
                            <span>{appt.room || 'OPD Room'}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                          {appt.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleCancelAppointment(appt.id)}
                              disabled={cancellingId === appt.id}
                              style={{
                                background: 'transparent',
                                border: '1px solid #fca5a5',
                                color: '#dc2626',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <Trash2 size={13} />
                              <span>{cancellingId === appt.id ? 'Cancelling...' : (lang === 'en' ? 'Cancel Slot' : 'સ્લોટ રદ કરો')}</span>
                            </button>
                          )}

                          <button
                            onClick={() => onViewSlip(appt)}
                            className="btn-primary"
                            style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                          >
                            <FileText size={13} />
                            <span>{lang === 'en' ? 'View Slip' : 'સ્લિપ જુઓ'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
