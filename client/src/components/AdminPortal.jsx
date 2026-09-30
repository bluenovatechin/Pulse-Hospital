import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  X, 
  RefreshCw,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { DOCTORS } from '../data/hospitalContent';
import { API } from '../api';

export default function AdminPortal({ onClose }) {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsKey, setNeedsKey] = useState(false);
  const [filterDoc, setFilterDoc] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Staff key (the server's ADMIN_KEY). Kept only for this browser tab.
  const [staffKey, setStaffKey] = useState(() => {
    try { return sessionStorage.getItem('pulseStaffKey') || ''; } catch { return ''; }
  });
  const [keyInput, setKeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const authHeaders = (key = staffKey) => (key ? { 'x-admin-key': key } : {});

  const loadData = async (key = staffKey) => {
    setLoading(true);
    try {
      const [apptsRes, statsRes] = await Promise.all([
        fetch(API + '/api/admin/appointments', { headers: authHeaders(key) }),
        fetch(API + '/api/admin/stats', { headers: authHeaders(key) })
      ]);

      if (apptsRes.status === 401 || apptsRes.status === 503) {
        const body = await apptsRes.json().catch(() => ({}));
        setAuthError(apptsRes.status === 401 && key ? 'That staff key is not correct.' : (body.error || ''));
        setStaffKey('');
        try { sessionStorage.removeItem('pulseStaffKey'); } catch { /* storage unavailable */ }
        setAppointments([]);
        setStats(null);
        setNeedsKey(true);
        return;
      }
      setNeedsKey(false);
      setAuthError('');

      if (apptsRes.ok) {
        const data = await apptsRes.json();
        setAppointments(data.appointments || []);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API}/api/admin/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      alert("Error updating status");
    }
  };

  const submitKey = (e) => {
    e.preventDefault();
    const key = keyInput.trim();
    if (!key) return;
    setStaffKey(key);
    try { sessionStorage.setItem('pulseStaffKey', key); } catch { /* storage unavailable */ }
    setKeyInput('');
    loadData(key);
  };

  if (needsKey) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: 420, padding: 28 }} role="dialog" aria-modal="true" aria-label="Staff sign in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ fontSize: 20 }}>Staff portal</h3>
            <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><X size={20} /></button>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Enter the staff key to see patient appointments.</p>
          <form onSubmit={submitKey} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label className="form-label" htmlFor="staff-key">Staff key</label>
            <input id="staff-key" type="password" className="form-input" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} autoFocus autoComplete="current-password" />
            {authError && <div style={{ color: '#be123c', fontSize: 13, fontWeight: 600 }}>{authError}</div>}
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Checking...' : 'Open staff portal'}</button>
          </form>
        </div>
      </div>
    );
  }

  const filteredAppointments = appointments.filter(a => {
    const matchDoc = !filterDoc || a.doctorId === parseInt(filterDoc);
    const matchStatus = !filterStatus || a.status.toLowerCase() === filterStatus.toLowerCase();
    const matchSource = !filterSource || (a.bookedBy || 'Patient').toLowerCase() === filterSource.toLowerCase();
    const matchSearch = !searchTerm || 
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.patientPhone.includes(searchTerm) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDoc && matchStatus && matchSource && matchSearch;
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '960px', padding: '0', maxHeight: '92vh' }}>
        
        {/* Header */}
        <div style={{
          background: 'var(--brand-navy)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--primary)', color: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>
                STAFF DESK
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                Pulse Hospital Reception & Appointment Console
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
              Real-time slot manager, patient flow tracking, and doctor schedule oversight
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => loadData()}
              title="Refresh"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

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
        </div>

        {/* Quick KPI stats */}
        <div style={{ padding: '20px 24px', background: '#f8fafc', borderBottom: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Bookings</span>
            <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--brand-navy)', marginTop: '2px' }}>
              {stats ? stats.total : appointments.length}
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Next Week Advance</span>
            <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--primary)', marginTop: '2px' }}>
              {stats ? stats.nextWeekBookings : 0}
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Confirmed Active</span>
            <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--success)', marginTop: '2px' }}>
              {stats ? stats.confirmed : 0}
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Doctors on Roster</span>
            <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--accent)', marginTop: '2px' }}>
              {DOCTORS.length} Specialists
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ padding: '16px 24px', display: 'flex', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', background: '#ffffff' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              style={{ height: '40px', paddingLeft: '34px', fontSize: '13px' }}
              placeholder="Search by Patient Name, Phone or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
          </div>

          <select
            value={filterDoc}
            onChange={(e) => setFilterDoc(e.target.value)}
            className="form-input"
            style={{ width: 'auto', minWidth: '180px', height: '40px', fontSize: '13px' }}
          >
            <option value="">All Doctors</option>
            {DOCTORS.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input"
            style={{ width: 'auto', minWidth: '140px', height: '40px', fontSize: '13px' }}
          >
            <option value="">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="form-input"
            style={{ width: 'auto', minWidth: '150px', height: '40px', fontSize: '13px' }}
          >
            <option value="">All Origins (Who Booked)</option>
            <option value="Patient">Patient (Online)</option>
            <option value="Staff">Hospital Staff / Reception</option>
            <option value="Doctor">Doctor / OPD</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ padding: '16px 24px', overflowX: 'auto' }}>
          {filteredAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
              No appointments matching criteria.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '10px 8px' }}>Ref ID</th>
                  <th style={{ padding: '10px 8px' }}>Patient</th>
                  <th style={{ padding: '10px 8px' }}>Origin / Booked By</th>
                  <th style={{ padding: '10px 8px' }}>Doctor</th>
                  <th style={{ padding: '10px 8px' }}>Date & Slot</th>
                  <th style={{ padding: '10px 8px' }}>Room</th>
                  <th style={{ padding: '10px 8px' }}>Status</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 800, color: 'var(--primary)' }}>
                      {appt.id}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--brand-navy)' }}>{appt.patientName}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>+91 {appt.patientPhone}</div>
                      {appt.previousFileNo && (
                        <span style={{ fontSize: '10px', color: '#854d0e', backgroundColor: '#fef9c3', padding: '1px 5px', borderRadius: '3px' }}>
                          File: {appt.previousFileNo}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      {appt.bookedBy === 'Staff' ? (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#334155' }}>
                            Staff
                          </span>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {appt.bookedByName || 'Reception'}
                          </div>
                        </div>
                      ) : appt.bookedBy === 'Doctor' ? (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#ecfdf5', color: '#047857' }}>
                            Doctor
                          </span>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {appt.bookedByName || 'OPD Desk'}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#eff6ff', color: '#0369a1' }}>
                            Patient
                          </span>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Online Self-Booking
                          </div>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontWeight: 600 }}>{appt.doctorName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{appt.doctorSpecialty}</div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontWeight: 700 }}>{appt.date}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--primary)' }}>{appt.timeSlot}</div>
                    </td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>
                      {appt.room}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '10px',
                        backgroundColor: 
                          appt.status === 'Confirmed' ? '#dcfce7' : 
                          appt.status === 'Completed' ? '#dbeafe' : '#fee2e2',
                        color:
                          appt.status === 'Confirmed' ? '#15803d' : 
                          appt.status === 'Completed' ? '#1e40af' : '#b91c1c'
                      }}>
                        {appt.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'Completed')}
                            style={{
                              background: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              color: '#1d4ed8',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Mark Visited
                          </button>
                        )}
                        {appt.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'Cancelled')}
                            style={{
                              background: '#fff1f2',
                              border: '1px solid #fecdd3',
                              color: '#e11d48',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
