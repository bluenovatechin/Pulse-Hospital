import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import { API } from '../api';

export default function AppointmentLookupModal({ onClose, onViewSlip, lang = 'en' }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API}/api/appointments-lookup?query=${encodeURIComponent(query.trim())}`);
      if (!res.ok) {
        throw new Error('Failed to find appointment records.');
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setErrorMsg(err.message || 'Error looking up appointment.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    const confirmPrompt = lang === 'en'
      ? 'Are you sure you want to cancel this appointment slot? The slot will be released for other patients.'
      : 'શું તમે ખરેખર આ એપોઇન્ટમેન્ટ સ્લોટ રદ કરવા માંગો છો? આ સ્લોટ અન્ય દર્દીઓ માટે ઉપલબ્ધ થઈ જશે.';

    if (!window.confirm(confirmPrompt)) {
      return;
    }

    setCancellingId(id);
    try {
      const res = await fetch(`${API}/api/appointments/${id}/cancel`, {
        method: 'PATCH'
      });
      if (res.ok) {
        // update local list
        setResults(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
      }
    } catch (err) {
      alert(lang === 'en' ? 'Error cancelling appointment.' : 'એપોઇન્ટમેન્ટ રદ કરવામાં ક્ષતિ આવી.');
    } finally {
      setCancellingId(null);
    }
  };

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
              src={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/rendered.png`} 
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

        {/* Search Bar */}
        <div style={{ padding: '20px 18px' }}>
          <form onSubmit={handleSearch} className="lookup-form">
            <div style={{ position: 'relative', flex: 1, width: '100%' }}>
              <input
                type="text"
                className="form-input"
                placeholder={lang === 'en' ? 'Enter Mobile Number or PLS-XXXXXX' : '૧૦ આંકડાનો મોબાઇલ નંબર અથવા PLS-XXXXXX લખો'}
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
                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
                  <AlertCircle size={32} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                  <p style={{ fontWeight: 600 }}>
                    {lang === 'en' ? `No appointments found matching "${query}"` : `"${query}" માટે કોઈ એપોઇન્ટમેન્ટ મળી નથી`}
                  </p>
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>
                    {lang === 'en'
                      ? 'Please verify the mobile number or booking reference ID and try again.'
                      : 'કૃપા કરીને મોબાઇલ નંબર અથવા બુકિંગ સંદર્ભ નંબર ચકાસી ફરી પ્રયાસ કરો.'}
                  </p>
                </div>
              ) : (
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
                          <span>{appt.date}</span>
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
                          <span>{appt.room}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                        <button
                          onClick={() => {
                            if (onViewSlip) onViewSlip(appt);
                          }}
                          style={{
                            background: 'rgba(2, 132, 199, 0.1)',
                            border: 'none',
                            color: 'var(--primary)',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <FileText size={13} />
                          <span>{lang === 'en' ? 'View Slip' : 'સ્લિપ જુઓ'}</span>
                        </button>

                        {appt.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleCancelAppointment(appt.id)}
                            disabled={cancellingId === appt.id}
                            style={{
                              background: '#fee2e2',
                              border: 'none',
                              color: '#b91c1c',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={13} />
                            <span>{cancellingId === appt.id ? (lang === 'en' ? 'Cancelling...' : 'રદ થઈ રહ્યું છે...') : (lang === 'en' ? 'Cancel Slot' : 'સ્લોટ રદ કરો')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
