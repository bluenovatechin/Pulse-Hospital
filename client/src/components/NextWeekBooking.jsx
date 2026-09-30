import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Sparkles, 
  ChevronRight,
  Info,
  CalendarCheck,
  Stethoscope,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DOCTORS } from '../data/hospitalContent';
import { Avatar } from './ui';
import { API } from '../api';

const GUJARATI_MONTHS_SHORT = ["જાન્યુ", "ફેબ્રુ", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઑગસ્ટ", "સપ્ટે", "ઑક્ટો", "નવે", "ડિસે"];

export default function NextWeekBooking({ preselectedDoctorId = null, onBookingSuccess, lang = 'en' }) {
  const [scheduleDays, setScheduleDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(preselectedDoctorId || 1);
  const [slotsData, setSlotsData] = useState({ morningSlots: [], eveningSlots: [], isDoctorAvailable: true });
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientAge: '',
    patientGender: 'Male',
    city: 'Modasa',
    previousFileNo: '',
    symptoms: '',
    bookedBy: 'Patient', // 'Patient' | 'Staff' | 'Doctor'
    bookedByName: ''
  });

  // Load Next Week Days from API or Fallback
  useEffect(() => {
    async function fetchNextWeek() {
      try {
        const res = await fetch(API + '/api/next-week-schedule');
        if (res.ok) {
          const days = await res.json();
          setScheduleDays(days);
          if (days.length > 0 && !selectedDate) {
            setSelectedDate(days[0].date); // Default to Next Monday
          }
        } else {
          generateFallbackSchedule();
        }
      } catch (err) {
        console.warn("Using client-side schedule generator", err);
        generateFallbackSchedule();
      }
    }
    fetchNextWeek();
  }, []);

  // Update selected doctor if preselectedDoctorId changes
  useEffect(() => {
    if (preselectedDoctorId) {
      setSelectedDoctorId(preselectedDoctorId);
    }
  }, [preselectedDoctorId]);

  // Client-side fallback schedule generator for next week
  function generateFallbackSchedule() {
    const today = new Date();
    const currentDay = today.getDay();
    const daysUntilNextMonday = (8 - currentDay) % 7 || 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);

    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dayNamesGujarati = ["સોમવાર", "મંગળવાર", "બુધવાર", "ગુરુવાર", "શુક્રવાર", "શનિવાર", "રવિવાર"];
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(nextMonday);
      d.setDate(nextMonday.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const monthName = d.toLocaleString('en-US', { month: 'short' });
      days.push({
        date: dateStr,
        dayName: dayNames[i],
        dayNameGujarati: dayNamesGujarati[i],
        formatted: `${dayNames[i].slice(0, 3)}, ${monthName} ${d.getDate()}`,
        isWeekend: i === 5 || i === 6,
        isSunday: i === 6,
        displayBadge: i === 0 ? "Next Week Start" : null,
        availableSlots: 45
      });
    }
    setScheduleDays(days);
    if (!selectedDate && days.length > 0) {
      setSelectedDate(days[0].date);
    }
  }

  // Fetch slots whenever selectedDoctorId or selectedDate changes
  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) return;

    let isMounted = true;
    setLoadingSlots(true);
    setErrorMsg('');
    setSelectedSlot('');

    async function loadSlots() {
      try {
        const res = await fetch(`${API}/api/slots?doctorId=${selectedDoctorId}&date=${selectedDate}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setSlotsData(data);
          }
        } else {
          if (isMounted) {
            setSlotsData(generateLocalSlots(selectedDoctorId, selectedDate));
          }
        }
      } catch (err) {
        if (isMounted) {
          setSlotsData(generateLocalSlots(selectedDoctorId, selectedDate));
        }
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    }

    loadSlots();
    return () => { isMounted = false; };
  }, [selectedDoctorId, selectedDate]);

  // Local fallback slots
  function generateLocalSlots(docId, date) {
    const morningSlots = [
      "09:00 AM - 09:30 AM", "09:30 AM - 10:00 AM", "10:00 AM - 10:30 AM",
      "10:30 AM - 11:00 AM", "11:00 AM - 11:30 AM", "11:30 AM - 12:00 PM",
      "12:00 PM - 12:30 PM", "12:30 PM - 01:00 PM"
    ].map((slot, index) => ({
      time: slot,
      session: "Morning",
      isAvailable: index !== 2
    }));

    const eveningSlots = [
      "04:30 PM - 05:00 PM", "05:00 PM - 05:30 PM", "05:30 PM - 06:00 PM",
      "06:00 PM - 06:30 PM", "06:30 PM - 07:00 PM", "07:00 PM - 07:30 PM",
      "07:30 PM - 08:00 PM"
    ].map((slot) => ({
      time: slot,
      session: "Evening",
      isAvailable: true
    }));

    return {
      doctorId: docId,
      date,
      isDoctorAvailable: true,
      morningSlots,
      eveningSlots
    };
  }

  const selectedDoctor = DOCTORS.find(d => d.id === parseInt(selectedDoctorId)) || DOCTORS[0];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedSlot) {
      setErrorMsg(lang === 'en' ? 'Please select an available time slot.' : 'કૃપા કરીને એપોઇન્ટમેન્ટનો સમય સ્લોટ પસંદ કરો.');
      return;
    }

    if (!formData.patientName.trim()) {
      setErrorMsg(lang === 'en' ? 'Please enter the patient full name.' : 'કૃપા કરીને દર્દીનું પૂરું નામ લખો.');
      return;
    }

    const cleanPhone = formData.patientPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg(lang === 'en' ? 'Please enter a valid 10-digit mobile number.' : 'કૃપા કરીને માન્ય ૧૦ આંકડાનો મોબાઇલ નંબર લખો.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        doctorId: selectedDoctor.id,
        date: selectedDate,
        timeSlot: selectedSlot,
        patientName: formData.patientName,
        patientPhone: cleanPhone,
        patientEmail: formData.patientEmail,
        patientAge: formData.patientAge,
        patientGender: formData.patientGender,
        city: formData.city,
        previousFileNo: formData.previousFileNo,
        symptoms: formData.symptoms,
        department: selectedDoctor.specialties[0],
        bookedBy: formData.bookedBy || 'Patient',
        bookingChannel: formData.bookedBy === 'Staff' ? 'Hospital Reception Counter' : formData.bookedBy === 'Doctor' ? 'Doctor OPD Consultation' : 'Online Website',
        bookedByName: formData.bookedByName ? formData.bookedByName.trim() : (formData.bookedBy === 'Staff' ? 'Reception Desk' : formData.bookedBy === 'Doctor' ? 'OPD Desk' : 'Patient (Self)')
      };

      const res = await fetch(API + '/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to book slot.');
      }

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      if (onBookingSuccess) {
        onBookingSuccess(data.appointment);
      }

      // Reset form
      setFormData({
        patientName: '',
        patientPhone: '',
        patientEmail: '',
        patientAge: '',
        patientGender: 'Male',
        city: 'Modasa',
        previousFileNo: '',
        symptoms: ''
      });
      setSelectedSlot('');

    } catch (err) {
      setErrorMsg(err.message || (lang === 'en' ? 'Error booking appointment. Please try another slot.' : 'એપોઇન્ટમેન્ટ બુક કરવામાં સમસ્યા આવી. કૃપા કરીને અન્ય સ્લોટ અજમાવો.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="next-week-card" id="booking-section">
      
      {/* Header Banner */}
      <div className="booking-header-banner">
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, transparent 70%)', filter: 'blur(35px)', pointerEvents: 'none' }} />

        <div className="booking-header-content">
          <div className="booking-header-main">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              <Sparkles size={14} color="var(--accent-light)" />
              <span>{lang === 'en' ? 'Advance Slot-Wise Scheduling' : 'આગામી સપ્તાહ માટે એડવાન્સ સ્લોટ બુકિંગ'}</span>
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
              {lang === 'en' ? 'Book Your Appointment for Next Week' : 'આગામી સપ્તાહ માટે તમારો સ્લોટ બુક કરો'}
            </h2>

            <p style={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: '14px', maxWidth: '620px', lineHeight: 1.55 }}>
              {lang === 'en' 
                ? 'Select your doctor, pick your preferred date in next week, and reserve a dedicated 30-minute OPD slot to eliminate waiting time at the hospital.'
                : 'તમારા મનપસંદ ડૉક્ટર પસંદ કરો, આગામી અઠવાડિયાની તારીખ અને અનુકૂળ સમય સ્લોટ પસંદ કરી હોસ્પિટલમાં રાહ જોયા વિના સીધા કન્સલ્ટેશન મેળવો.'}
            </p>
          </div>

          <div className="booking-opd-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <Clock size={13} />
              <span>{lang === 'en' ? 'Hospital OPD Timing' : 'હોસ્પિટલ OPD સમય'}</span>
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
              {lang === 'en' ? 'Morning: 09:00 AM – 01:30 PM' : 'સવારે: ૦૯:૦૦ AM – ૦૧:૩૦ PM'}
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
              {lang === 'en' ? 'Evening: 04:30 PM – 08:00 PM' : 'સાંજે: ૦૪:૩૦ PM – ૦૮:૦૦ PM'}
            </div>
          </div>
        </div>
      </div>

      <div className="booking-body">
        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: Select Specialist Doctor */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>
                  1
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                  {lang === 'en' ? 'Select Doctor / Specialist' : 'સ્પેશ્યાલીસ્ટ ડૉક્ટર પસંદ કરો'}
                </h3>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {DOCTORS.length} {lang === 'en' ? 'Specialists Available' : 'નિષ્ણાત તબીબો ઉપલબ્ધ'}
              </span>
            </div>

            <div className="booking-doctor-grid">
              {DOCTORS.map((doc) => {
                const isSelected = selectedDoctorId === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className="booking-doctor-card"
                    style={{
                      border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--border-color)',
                      background: isSelected ? 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)' : '#ffffff',
                      boxShadow: isSelected ? '0 6px 18px rgba(2, 132, 199, 0.14)' : 'none'
                    }}
                  >
                    <Avatar doctor={doc} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lang === 'en' ? doc.name : doc.nameGujarati}
                        </h4>
                        {isSelected && (
                          <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                        )}
                      </div>

                      <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                        {doc.qualification} {doc.experience ? `• ${lang === 'en' ? doc.experience : (doc.experienceGujarati || doc.experience)}` : ''}
                      </div>

                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Building2 size={12} style={{ flexShrink: 0 }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lang === 'en' ? doc.hospital : doc.hospitalGujarati}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Choose Advance Date for Next Week */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>
                  2
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                    {lang === 'en' ? 'Select Date in Next Week' : 'આગામી સપ્તાહની તારીખ પસંદ કરો'}
                  </h3>
                </div>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(2, 132, 199, 0.08)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                <CalendarCheck size={14} />
                <span>{lang === 'en' ? 'Advance Calendar (Mon – Sun)' : 'એડવાન્સ કેલેન્ડર (સોમ – રવિ)'}</span>
              </div>
            </div>

            {/* Horizontal Scrollable Day Tabs */}
            <div className="booking-days-scroller">
              {scheduleDays.map((day) => {
                const isSelected = selectedDate === day.date;
                return (
                  <div
                    key={day.date}
                    onClick={() => setSelectedDate(day.date)}
                    className={`calendar-day-tab ${isSelected ? 'active' : ''}`}
                    style={{ flexShrink: 0 }}
                  >
                    {day.displayBadge && (
                      <span style={{
                        position: 'absolute',
                        top: '-9px',
                        fontSize: '9px',
                        fontWeight: 800,
                        backgroundColor: 'var(--accent)',
                        color: '#ffffff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap'
                      }}>
                        {lang === 'en' ? day.displayBadge : (day.displayBadge === 'Next Week Start' ? 'નવું સપ્તાહ શરૂ' : day.displayBadge)}
                      </span>
                    )}

                    <span style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {lang === 'en' ? day.dayName.slice(0, 3) : day.dayNameGujarati}
                    </span>

                    <span style={{ fontSize: '20px', fontWeight: 800, color: isSelected ? 'var(--primary)' : 'var(--brand-navy)', margin: '4px 0' }}>
                      {day.date.split('-')[2]}
                    </span>

                    <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: 600 }}>
                      {lang === 'en'
                        ? new Date(`${day.date}T00:00:00`).toLocaleString('en-US', { month: 'short' })
                        : GUJARATI_MONTHS_SHORT[new Date(`${day.date}T00:00:00`).getMonth()]}
                    </span>

                    {day.isSunday ? (
                      <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 700, marginTop: '4px' }}>
                        {lang === 'en' ? 'Emergency' : 'ઇમરજન્સી'}
                      </span>
                    ) : (
                      <span style={{ fontSize: '10px', color: 'var(--success)', fontWeight: 700, marginTop: '4px' }}>
                        {lang === 'en' ? 'Open OPD' : 'OPD ચાલુ'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Time Slot Selection (Slot-Wise) */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>
                  3
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                    {lang === 'en' ? 'Select 30-Minute Time Slot' : '૩૦ મિનિટનો સમય સ્લોટ પસંદ કરો'}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    {lang === 'en' ? selectedDoctor.name : selectedDoctor.nameGujarati} • {lang === 'en' ? selectedDoctor.room : (selectedDoctor.roomGujarati || selectedDoctor.room)}
                  </p>
                </div>
              </div>

              {/* Slot Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', border: '1.5px solid #cbd5e1', background: '#ffffff' }} />
                  <span style={{ color: 'var(--text-muted)' }}>{lang === 'en' ? 'Available' : 'ઉપલબ્ધ'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--primary)' }} />
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{lang === 'en' ? 'Selected' : 'પસંદ કરેલ'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#e2e8f0', textDecoration: 'line-through' }} />
                  <span style={{ color: '#94a3b8' }}>{lang === 'en' ? 'Booked' : 'બુક થયેલ'}</span>
                </div>
              </div>
            </div>

            {loadingSlots ? (
              <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: 'var(--radius-lg)' }}>
                <Clock size={28} className="animate-spin" style={{ margin: '0 auto 10px', color: 'var(--primary)' }} />
                <p>{lang === 'en' ? 'Checking live slot availability with hospital schedule...' : 'હોસ્પિટલ શિડ્યુલ મુજબ સ્લોટ તપાસી રહ્યાં છીએ...'}</p>
              </div>
            ) : !slotsData.isDoctorAvailable ? (
              <div style={{ padding: '24px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 'var(--radius-lg)', color: '#b45309', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Info size={24} />
                <div>
                  <strong>{lang === 'en' ? 'Doctor Schedule Notice:' : 'ડૉક્ટર શિડ્યુલ સૂચના:'}</strong> {slotsData.message || (lang === 'en' ? 'Doctor is not available on this day. Please pick another day or doctor.' : 'આ દિવસે ડૉક્ટર ઉપલબ્ધ નથી. કૃપા કરીને અન્ય દિવસ અથવા ડૉક્ટર પસંદ કરો.')}
                </div>
              </div>
            ) : (
              <div className="booking-sessions-grid">
                
                {/* Morning Slots Panel */}
                <div className="booking-session-panel">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--brand-navy)', fontWeight: 700, fontSize: '14px' }}>
                    <Clock size={16} color="var(--primary)" />
                    <span>{lang === 'en' ? 'Morning Session (09:00 AM – 01:00 PM)' : 'સવારનું સત્ર (સવારે ૦૯:૦૦ AM – ૦૧:૦૦ PM)'}</span>
                  </div>

                  <div className="booking-slots-grid">
                    {slotsData.morningSlots && slotsData.morningSlots.map((s) => {
                      const isSelected = selectedSlot === s.time;
                      return (
                        <div
                          key={s.time}
                          onClick={() => {
                            if (s.isAvailable) setSelectedSlot(s.time);
                          }}
                          className={`slot-pill ${!s.isAvailable ? 'booked' : (isSelected ? 'selected' : 'available')}`}
                        >
                          <span>{s.time.split(' - ')[0]}</span>
                          {isSelected ? (
                            <CheckCircle2 size={15} />
                          ) : !s.isAvailable ? (
                            <span style={{ fontSize: '10px', textDecoration: 'none' }}>
                              {lang === 'en' ? 'Reserved' : 'બુક થયેલ'}
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Evening Slots Panel */}
                <div className="booking-session-panel">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--brand-navy)', fontWeight: 700, fontSize: '14px' }}>
                    <Clock size={16} color="var(--accent)" />
                    <span>{lang === 'en' ? 'Evening Session (04:30 PM – 08:00 PM)' : 'સાંજનું સત્ર (સાંજે ૦૪:૩૦ PM – ૦૮:૦૦ PM)'}</span>
                  </div>

                  {slotsData.eveningSlots && slotsData.eveningSlots.length > 0 ? (
                    <div className="booking-slots-grid">
                      {slotsData.eveningSlots.map((s) => {
                        const isSelected = selectedSlot === s.time;
                        return (
                          <div
                            key={s.time}
                            onClick={() => {
                              if (s.isAvailable) setSelectedSlot(s.time);
                            }}
                            className={`slot-pill ${!s.isAvailable ? 'booked' : (isSelected ? 'selected' : 'available')}`}
                          >
                            <span>{s.time.split(' - ')[0]}</span>
                            {isSelected ? (
                              <CheckCircle2 size={15} />
                            ) : !s.isAvailable ? (
                              <span style={{ fontSize: '10px', textDecoration: 'none' }}>
                                {lang === 'en' ? 'Reserved' : 'બુક થયેલ'}
                              </span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                      {lang === 'en'
                        ? 'Sunday evenings are reserved for Emergency & Trauma triage only.'
                        : 'રવિવારે સાંજે માત્ર ઇમરજન્સી અને ટ્રોમા સારવાર જ ઉપલબ્ધ છે.'}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* STEP 4: Patient Details */}
          <div className="booking-patient-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                4
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                  {lang === 'en' ? 'Patient Information' : 'દર્દીની વિગત'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {lang === 'en' ? 'Enter correct phone number to receive appointment SMS and WhatsApp ticket' : 'એપોઇન્ટમેન્ટ SMS અને વ્હોટ્સએપ ટિકિટ મેળવવા સાચો નંબર લખો'}
                </p>
              </div>
            </div>

            {/* Booking Source / Who is booking this appointment */}
            <div style={{ marginBottom: '18px', padding: '12px 14px', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <label className="form-label" style={{ marginBottom: '8px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800 }}>{lang === 'en' ? 'Who is filling this appointment?' : 'આ એપોઇન્ટમેન્ટ કોણ ભરી રહ્યું છે?'}</span>
              </label>
              
              <div className="booking-who-grid">
                {[
                  { id: 'Patient', labelEn: 'Patient / Self (Online)', labelGu: 'દર્દી પોતે (ઓનલાઈન)', icon: User },
                  { id: 'Staff', labelEn: 'Hospital Staff / Reception', labelGu: 'હોસ્પિટલ સ્ટાફ / રિસેપ્શન', icon: Building2 },
                  { id: 'Doctor', labelEn: 'Doctor / OPD Follow-up', labelGu: 'ડૉક્ટર / OPD ફોલો-અપ', icon: Stethoscope }
                ].map((item) => {
                  const isSelected = (formData.bookedBy || 'Patient') === item.id;
                  const ItemIcon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setFormData({ ...formData, bookedBy: item.id })}
                      className="booking-who-btn"
                      style={{
                        fontWeight: isSelected ? 800 : 600,
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        color: isSelected ? 'var(--primary)' : 'var(--text-main)'
                      }}
                    >
                      <ItemIcon size={15} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0 }} />
                      <span>{lang === 'en' ? item.labelEn : item.labelGu}</span>
                    </button>
                  );
                })}
              </div>

              {formData.bookedBy !== 'Patient' && (
                <div style={{ marginTop: '10px' }}>
                  <input
                    type="text"
                    name="bookedByName"
                    className="form-input"
                    placeholder={
                      formData.bookedBy === 'Staff' 
                        ? (lang === 'en' ? 'Staff Name / Counter No. (e.g. Counter 1 - Reception)' : 'સ્ટાફનું નામ અથવા કાઉન્ટર નંબર')
                        : (lang === 'en' ? 'Doctor / OPD Room (e.g. Dr. Dipesh Patel OPD Suite 401)' : 'ડૉક્ટર અથવા OPD સુઇટ')
                    }
                    value={formData.bookedByName}
                    onChange={handleInputChange}
                    style={{ fontSize: '13px', height: '42px' }}
                  />
                </div>
              )}
            </div>

            <div className="booking-form-grid">
              <div className="booking-field-group">
                <label className="form-label">{lang === 'en' ? 'Patient Full Name *' : 'દર્દીનું પૂરું નામ *'}</label>
                <input
                  type="text"
                  name="patientName"
                  className="form-input"
                  placeholder={lang === 'en' ? 'e.g. Rameshchandra Patel' : 'દા.ત. રમેશભાઈ પટેલ'}
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="booking-field-group">
                <label className="form-label">{lang === 'en' ? 'Mobile Number (10 Digits) *' : 'મોબાઇલ નંબર (૧૦ આંકડા) *'}</label>
                <input
                  type="tel"
                  name="patientPhone"
                  className="form-input"
                  placeholder={lang === 'en' ? 'e.g. 98250 12345' : 'દા.ત. ૯૮૨૫૦ ૧૨૩૪૫'}
                  value={formData.patientPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="booking-field-group">
                <label className="form-label">{lang === 'en' ? 'Age & Gender *' : 'ઉંમર અને જાતિ *'}</label>
                <div className="booking-age-gender-row">
                  <input
                    type="number"
                    name="patientAge"
                    className="form-input"
                    placeholder={lang === 'en' ? 'Age (Years)' : 'ઉંમર (વર્ષ)'}
                    min="1"
                    max="120"
                    value={formData.patientAge}
                    onChange={handleInputChange}
                  />
                  <select
                    name="patientGender"
                    className="form-input"
                    value={formData.patientGender}
                    onChange={handleInputChange}
                  >
                    <option value="Male">{lang === 'en' ? 'Male (પુરુષ)' : 'પુરુષ'}</option>
                    <option value="Female">{lang === 'en' ? 'Female (સ્ત્રી)' : 'સ્ત્રી'}</option>
                    <option value="Other">{lang === 'en' ? 'Other' : 'અન્ય'}</option>
                  </select>
                </div>
              </div>

              <div className="booking-field-group">
                <label className="form-label">{lang === 'en' ? 'City / Village' : 'ગામ / શહેર / વિસ્તાર'}</label>
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  placeholder={lang === 'en' ? 'e.g. Modasa, Dhansura, Bayad' : 'દા.ત. મોડાસા, ધનસુરા, બાયડ, મેઘરજ...'}
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="booking-field-group">
                <label className="form-label">
                  {lang === 'en' ? 'Previous Hospital File No. (If Any)' : 'જૂની હોસ્પિટલ ફાઇલ / કેસ નંબર (જો હોય તો)'}
                </label>
                <input
                  type="text"
                  name="previousFileNo"
                  className="form-input"
                  placeholder={lang === 'en' ? 'e.g. PH-2025-XXXX' : 'દા.ત. PH-૨૦૨૫-XXXX'}
                  value={formData.previousFileNo}
                  onChange={handleInputChange}
                />
                <span style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                  <Info size={13} style={{ flexShrink: 0 }} /> {lang === 'en' ? 'Notice: Please bring this file and previous reports on your visit.' : 'સૂચના: કૃપા કરીને આ ફાઇલ અને જૂના રિપોર્ટ્સ મુલાકાત વખતે સાથે લાવવા વિનંતી.'}
                </span>
              </div>

              <div className="booking-field-group">
                <label className="form-label">{lang === 'en' ? 'Email Address (Optional)' : 'ઇમેઇલ સરનામું (મરજિયાત)'}</label>
                <input
                  type="email"
                  name="patientEmail"
                  className="form-input"
                  placeholder={lang === 'en' ? 'e.g. patient@example.com' : 'દા.ત. patient@example.com'}
                  value={formData.patientEmail}
                  onChange={handleInputChange}
                />
              </div>

              <div className="booking-field-group booking-field-full">
                <label className="form-label">{lang === 'en' ? 'Brief Reason for Visit / Symptoms' : 'મુલાકાતનું કારણ / રોગના લક્ષણો'}</label>
                <textarea
                  name="symptoms"
                  className="form-textarea"
                  placeholder={lang === 'en' ? 'e.g. Routine sugar checkup, cough since 3 days, blood pressure consultation...' : 'દા.ત. ડાયાબિટીસ નિયમિત તપાસ, શ્વાસની તકલીફ, છાતીમાં દુખાવો, તાવ, બ્લડ પ્રેશર ચેકઅપ...'}
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{errorMsg}</span>
            </div>
          )}

          {/* Submission Bar */}
          <div className="booking-submit-bar">
            <div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                {lang === 'en' ? 'Selected Slot for Next Week:' : 'પસંદ કરેલ સ્લોટ:'}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-navy)', marginTop: '2px' }}>
                {selectedDate ? `${selectedDate} ` : ''} 
                {selectedSlot ? `• ${selectedSlot}` : (lang === 'en' ? '(No slot chosen yet)' : '(હજુ કોઈ સ્લોટ પસંદ નથી કર્યો)')}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                {lang === 'en' ? 'Doctor:' : 'તબીબ:'} {lang === 'en' ? selectedDoctor.name : selectedDoctor.nameGujarati} ({lang === 'en' ? selectedDoctor.room : (selectedDoctor.roomGujarati || selectedDoctor.room)})
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedSlot}
              className="btn-primary booking-submit-btn"
              style={{
                opacity: (!selectedSlot || submitting) ? 0.6 : 1,
                cursor: (!selectedSlot || submitting) ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? (
                <>
                  <Clock size={18} className="animate-spin" />
                  <span>{lang === 'en' ? 'Reserving Slot...' : 'સ્લોટ બુક થઈ રહ્યો છે...'}</span>
                </>
              ) : (
                <>
                  <CalendarCheck size={18} />
                  <span>{lang === 'en' ? 'Confirm Advance Slot Booking' : 'એપોઇન્ટમેન્ટ સ્લોટ કન્ફર્મ કરો'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
