import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  Info,
  CalendarCheck,
  Stethoscope
} from 'lucide-react';
import PulseLogo from './PulseLogo';
import { DOCTORS, HOSPITAL_INFO } from '../data/hospitalContent';
import { saveAppointment, deviceBookedSlots, STATUS } from '../lib/appointments';
import { Avatar, WhatsAppIcon } from './ui';

const GUJARATI_MONTHS_SHORT = ["જાન્યુ", "ફેબ્રુ", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઑગસ્ટ", "સપ્ટે", "ઑક્ટો", "નવે", "ડિસે"];

// Client-side schedule generator for current date through next 15 days
function generateUpcomingSchedule(lang = 'en') {
  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayNamesGujarati = ["રવિવાર", "સોમવાર", "મંગળવાર", "બુધવાર", "ગુરુવાર", "શુક્રવાર", "શનિવાર"];
  const dayNamesGujaratiShort = ["રવિ", "સોમ", "મંગળ", "બુધ", "ગુરુ", "શુક્ર", "શનિ"];
  const days = [];

  // Generate today (day 0) through the next 15 days (day 1..15) -> 16 selectable days total
  for (let i = 0; i <= 15; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const monthName = d.toLocaleString('en-US', { month: 'short' });
    const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday

    let displayBadge = null;
    if (i === 0) {
      displayBadge = lang === 'en' ? "Today" : "આજે";
    } else if (i === 1) {
      displayBadge = lang === 'en' ? "Tomorrow" : "આવતીકાલે";
    }

    days.push({
      date: dateStr,
      dayName: dayNames[dayOfWeek],
      dayNameGujarati: dayNamesGujarati[dayOfWeek],
      dayNameGujaratiShort: dayNamesGujaratiShort[dayOfWeek],
      formatted: `${dayNames[dayOfWeek].slice(0, 3)}, ${monthName} ${d.getDate()}`,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isSunday: dayOfWeek === 0,
      displayBadge,
      availableSlots: 45
    });
  }
  return days;
}

// ---- Slots: built from each doctor's real OPD hours (DOCTORS[].timing) ----
const DEFAULT_RANGES = [['09:00 AM', '01:00 PM'], ['04:30 PM', '08:00 PM']];

const toMinutes = (t) => {
  const m = String(t).trim().match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') h += 12;
  return h * 60 + Number(m[2]);
};

const toLabel = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

const localDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// "Mon - Sat (09:00 AM - 01:00 PM & 04:30 PM - 07:30 PM)" -> two ranges.
// Doctors without listed times use the hospital's standard OPD hours.
function doctorRanges(doc) {
  const found = [...String(doc?.timing || '').matchAll(/(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)/gi)]
    .map((m) => [m[1], m[2]]);
  return found.length ? found : DEFAULT_RANGES;
}

function generateDoctorSlots(docId, date) {
  const doc = DOCTORS.find((d) => d.id === Number(docId));
  const base = { doctorId: docId, date, morningSlots: [], eveningSlots: [] };

  // OPD runs Monday to Saturday
  if (new Date(`${date}T00:00:00`).getDay() === 0) {
    return { ...base, isDoctorAvailable: false, closedSunday: true };
  }

  const now = new Date();
  const isToday = date === localDate(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const slots = [];

  const ranges = doctorRanges(doc);
  ranges.forEach(([from, to], idx) => {
    const start = toMinutes(from);
    const end = toMinutes(to);
    if (start == null || end == null) return;
    // Session follows the doctor's own sittings (first = morning, second =
    // evening), so a 12:30 PM slot in a 9:00–1:00 sitting stays "Morning"
    const session = ranges.length > 1 ? (idx === 0 ? 'Morning' : 'Evening') : (start < 12 * 60 ? 'Morning' : 'Evening');
    for (let t = start; t + 30 <= end; t += 30) {
      slots.push({
        time: `${toLabel(t)} - ${toLabel(t + 30)}`,
        start: t,
        session,
        // Today: a slot that has already started can't be booked
        isPast: isToday && t < nowMin
      });
    }
  });

  const morningSlots = slots.filter((s) => s.session === 'Morning');
  const eveningSlots = slots.filter((s) => s.session === 'Evening');
  const range = (list) => (list.length ? `${toLabel(list[0].start)} – ${toLabel(list[list.length - 1].start + 30)}` : '');

  return {
    ...base,
    isDoctorAvailable: true,
    morningSlots,
    eveningSlots,
    morningRange: range(morningSlots),
    eveningRange: range(eveningSlots),
    allPast: slots.length > 0 && slots.every((s) => s.isPast)
  };
}

export default function NextWeekBooking({ preselectedDoctorId = null, onBookingSuccess, lang = 'en', showHeader = true }) {
  const [scheduleDays, setScheduleDays] = useState(() => generateUpcomingSchedule(lang));
  const [selectedDate, setSelectedDate] = useState(() => {
    const days = generateUpcomingSchedule(lang);
    return days.length > 0 ? days[0].date : '';
  });
  const [selectedDoctorId, setSelectedDoctorId] = useState(preselectedDoctorId || 1);
  const [slotsData, setSlotsData] = useState(() => generateDoctorSlots(preselectedDoctorId || 1, selectedDate));
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const formMountTime = useRef(0);

  useEffect(() => {
    formMountTime.current = Date.now();
  }, []);

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
    bookedBy: 'Patient',
    bookedByName: '',
    website_url: '' // Anti-bot honeypot
  });

  // Re-generate schedule when language changes
  useEffect(() => {
    const days = generateUpcomingSchedule(lang);
    setScheduleDays(days);
    if (!selectedDate && days.length > 0) {
      setSelectedDate(days[0].date);
    }
  }, [lang]);

  // Update selected doctor if preselectedDoctorId changes
  useEffect(() => {
    if (preselectedDoctorId) {
      setSelectedDoctorId(preselectedDoctorId);
    }
  }, [preselectedDoctorId]);

  // Update slots when doctor or date changes
  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) return;
    setLoadingSlots(true);
    setSelectedSlot('');
    setErrorMsg('');

    const timer = setTimeout(() => {
      setSlotsData(generateDoctorSlots(selectedDoctorId, selectedDate));
      setLoadingSlots(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [selectedDoctorId, selectedDate]);

  // Keep "time passed" accurate while the page stays open
  useEffect(() => {
    const id = setInterval(() => {
      setSlotsData(generateDoctorSlots(selectedDoctorId, selectedDate));
    }, 60000);
    return () => clearInterval(id);
  }, [selectedDoctorId, selectedDate]);

  // If the chosen slot's time passes while filling the form, clear it
  useEffect(() => {
    const all = [...(slotsData.morningSlots || []), ...(slotsData.eveningSlots || [])];
    const chosen = all.find((x) => x.time === selectedSlot);
    if (chosen && chosen.isPast) setSelectedSlot('');
  }, [slotsData, selectedSlot]);

  const selectedDoctor = DOCTORS.find(d => d.id === parseInt(selectedDoctorId)) || DOCTORS[0];
  // Slots this device has already booked (shown in colour, not bookable again)
  const myDeviceSlots = deviceBookedSlots(selectedDoctorId, selectedDate);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Honeypot spam verification
    if (formData.website_url) {
      console.warn('Bot submission blocked via honeypot.');
      return;
    }

    // Minimum submission delay check (1.2s minimum human reading/filling time)
    if (Date.now() - formMountTime.current < 1200) {
      setErrorMsg(lang === 'en' ? 'Submission was too fast. Please verify your details.' : 'ફોર્મ ખૂબ ઝડપથી સબમિટ થયું. વિગતો ફરી ચકાસો.');
      return;
    }

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

    const apptId = `PLS-${Math.floor(100000 + Math.random() * 900000)}`;
    const selectedDayObj = scheduleDays.find(d => d.date === selectedDate);
    const dayLabel = selectedDayObj ? `${selectedDayObj.dayName}, ${selectedDayObj.formatted.split(', ')[1]}` : selectedDate;

    const appointment = {
      id: apptId,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorNameGujarati: selectedDoctor.nameGujarati,
      specialties: selectedDoctor.specialties,
      room: selectedDoctor.room,
      date: selectedDate,
      dayFormatted: dayLabel,
      timeSlot: selectedSlot,
      patientName: formData.patientName.trim(),
      patientPhone: cleanPhone,
      patientEmail: formData.patientEmail ? formData.patientEmail.trim() : '',
      patientAge: formData.patientAge || 'N/A',
      patientGender: formData.patientGender || 'Male',
      city: formData.city || 'Modasa',
      previousFileNo: formData.previousFileNo || '',
      symptoms: formData.symptoms || '',
      bookedAt: new Date().toISOString(),
      status: STATUS.PENDING
    };

    // Save on this device only, and unlock it for this tab so the slip opens.
    // Status starts as "Pending" until the patient confirms the WhatsApp
    // message was actually sent.
    saveAppointment(appointment);

    // Build structured WhatsApp message to hospital reception
    const waText = 
`🏥 *PULSE HOSPITAL & I.C.U: MODASA*
*Appointment Booking Request*
───────────────────────────────
📋 *Reference ID:* ${apptId}
👨‍⚕️ *Doctor:* ${selectedDoctor.name}${selectedDoctor.qualification ? ` (${selectedDoctor.qualification})` : ''}
🏢 *Room:* ${selectedDoctor.room}
📅 *Date:* ${dayLabel}
⏰ *Time Slot:* ${selectedSlot}
───────────────────────────────
👤 *Patient Name:* ${formData.patientName.trim()}
📞 *Phone Number:* ${cleanPhone}
🎂 *Age / Gender:* ${formData.patientAge ? formData.patientAge + ' yrs' : 'N/A'}, ${formData.patientGender}
📍 *City / Area:* ${formData.city || 'Modasa'}
${formData.bookedBy !== 'Patient' ? `🧾 *Booked By:* ${formData.bookedBy}${formData.bookedByName ? ` (${formData.bookedByName})` : ''}\n` : ''}${formData.previousFileNo ? `📁 *Past File No:* ${formData.previousFileNo}\n` : ''}${formData.symptoms ? `📝 *Symptoms / Problem:* ${formData.symptoms}\n` : ''}───────────────────────────────
_Sent via Pulse Hospital Online Booking Portal_`;

    const whatsappUrl = `https://wa.me/${HOSPITAL_INFO.whatsappNumber}?text=${encodeURIComponent(waText)}`;
    
    // Open WhatsApp directly in new tab/window
    window.open(whatsappUrl, '_blank');

    // Confetti celebration (loaded only when someone actually books)
    import('canvas-confetti')
      .then(({ default: confetti }) => confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }))
      .catch(() => {});

    // Show appointment slip modal
    if (onBookingSuccess) {
      onBookingSuccess(appointment);
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
      symptoms: '',
      bookedBy: 'Patient',
      bookedByName: ''
    });
    setSelectedSlot('');
    setSubmitting(false);
  };

  return (
    <div className="next-week-card" id="booking-section">
      
      {/* Header Banner (hidden on the booking page, which has its own header) */}
      {showHeader && <div className="booking-header-banner">
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, transparent 70%)', filter: 'blur(35px)', pointerEvents: 'none' }} />

        <div className="booking-header-content">
          <div className="booking-header-main">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <PulseLogo size={36} variant="light" showText={false} />
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <Sparkles size={14} color="var(--accent-light)" />
                <span>{lang === 'en' ? 'Today & 15-Day Advance Booking' : 'આજે અને આગામી ૧૫ દિવસ માટે એડવાન્સ બુકિંગ'}</span>
              </div>
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
              {lang === 'en' ? 'Book Your OPD Appointment' : 'તમારો OPD એપોઇન્ટમેન્ટ સ્લોટ બુક કરો'}
            </h2>

            <p style={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: '14px', maxWidth: '620px', lineHeight: 1.55 }}>
              {lang === 'en' 
                ? 'Select your doctor, pick any date from today through the next 15 days, and reserve a dedicated 30-minute OPD slot to eliminate waiting time at the hospital.'
                : 'તમારા મનપસંદ ડૉક્ટર પસંદ કરો, આજથી આગામી ૧૫ દિવસમાંથી અનુકૂળ તારીખ અને સમય સ્લોટ પસંદ કરી હોસ્પિટલમાં રાહ જોયા વિના કન્સલ્ટેશન મેળવો.'}
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
      </div>}

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
                      background: isSelected ? 'linear-gradient(180deg, #f1f8f4 0%, #ffffff 100%)' : '#ffffff',
                      boxShadow: isSelected ? '0 6px 18px rgba(14, 101, 92, 0.14)' : 'none'
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
                        {[doc.qualification, doc.experience && (lang === 'en' ? doc.experience : (doc.experienceGujarati || doc.experience))].filter(Boolean).join(' • ')}
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

          {/* STEP 2: Choose Date (Today & Next 15 Days) */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>
                  2
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                    {lang === 'en' ? 'Select Date (Today & Next 15 Days)' : 'તારીખ પસંદ કરો (આજે અને આગામી ૧૫ દિવસ)'}
                  </h3>
                </div>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(14, 101, 92, 0.08)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                <CalendarCheck size={14} />
                <span>{lang === 'en' ? '15-Day Booking Window' : '૧૫ દિવસની એડવાન્સ સુવિધા'}</span>
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
                        {day.displayBadge}
                      </span>
                    )}

                    <span style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {lang === 'en' ? day.dayName.slice(0, 3) : (day.dayNameGujaratiShort || day.dayNameGujarati)}
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
                        {lang === 'en' ? 'OPD closed' : 'OPD બંધ'}
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

              {/* Slot legend */}
              <div className="slot-legend">
                <span><i className="sl-dot available" />{lang === 'en' ? 'Available' : 'ઉપલબ્ધ'}</span>
                <span><i className="sl-dot selected" />{lang === 'en' ? 'Selected' : 'પસંદ કરેલ'}</span>
                <span><i className="sl-dot mine" />{lang === 'en' ? 'Your booking' : 'તમારી બુકિંગ'}</span>
                <span><i className="sl-dot past" />{lang === 'en' ? 'Time passed' : 'સમય પૂરો'}</span>
              </div>
            </div>

            {loadingSlots ? (
              <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: 'var(--radius-lg)' }}>
                <p>{lang === 'en' ? 'Loading the doctor’s OPD slots…' : 'ડૉક્ટરના OPD સ્લોટ લોડ થઈ રહ્યા છે…'}</p>
              </div>
            ) : !slotsData.isDoctorAvailable ? (
              <div style={{ padding: '24px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 'var(--radius-lg)', color: '#b45309', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Info size={24} />
                <div>
                  {slotsData.closedSunday
                    ? (lang === 'en'
                      ? <><strong>OPD is closed on Sunday.</strong> Emergency and ICU are open 24×7: come straight to the 4th floor or call {HOSPITAL_INFO.appointmentNumber}. Please pick another day for an OPD slot.</>
                      : <><strong>રવિવારે OPD બંધ છે.</strong> ઇમરજન્સી અને ICU ૨૪ કલાક ચાલુ છે: સીધા ૪થા માળે આવો અથવા {HOSPITAL_INFO.appointmentNumber} પર કૉલ કરો. OPD સ્લોટ માટે બીજો દિવસ પસંદ કરો.</>)
                    : (lang === 'en' ? 'Doctor is not available on this day. Please pick another day or doctor.' : 'આ દિવસે ડૉક્ટર ઉપલબ્ધ નથી. કૃપા કરીને અન્ય દિવસ અથવા ડૉક્ટર પસંદ કરો.')}
                </div>
              </div>
            ) : (
              <>
                {slotsData.allPast && (
                  <div className="slot-note">
                    {lang === 'en'
                      ? 'All of today’s OPD slots for this doctor have passed. Please choose tomorrow or another day.'
                      : 'આજના આ ડૉક્ટરના બધા OPD સ્લોટનો સમય પૂરો થઈ ગયો છે. કૃપા કરીને આવતીકાલ અથવા બીજો દિવસ પસંદ કરો.'}
                  </div>
                )}
                <div className="booking-sessions-grid">
                  {[
                    { key: 'Morning', list: slotsData.morningSlots, range: slotsData.morningRange, en: 'Morning session', gu: 'સવારનું સત્ર', color: 'var(--primary)' },
                    { key: 'Evening', list: slotsData.eveningSlots, range: slotsData.eveningRange, en: 'Evening session', gu: 'સાંજનું સત્ર', color: 'var(--accent)' }
                  ].filter((sess) => sess.list && sess.list.length > 0).map((sess) => (
                    <div className="booking-session-panel" key={sess.key}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--brand-navy)', fontWeight: 700, fontSize: '14px' }}>
                        <Clock size={16} color={sess.color} />
                        <span>{lang === 'en' ? sess.en : sess.gu} ({sess.range})</span>
                      </div>
                      <div className="booking-slots-grid">
                        {sess.list.map((s) => {
                          const mine = myDeviceSlots[s.time];
                          const isSelected = selectedSlot === s.time;
                          const state = s.isPast ? 'past' : mine ? `mine mine-${mine.toLowerCase()}` : isSelected ? 'selected' : 'available';
                          const clickable = !s.isPast && !mine;
                          const note = s.isPast
                            ? (lang === 'en' ? 'Time passed' : 'સમય પૂરો')
                            : mine === STATUS.CONFIRMED ? (lang === 'en' ? 'Confirmed' : 'કન્ફર્મ')
                              : mine === STATUS.REQUESTED ? (lang === 'en' ? 'Awaiting' : 'રાહ જુઓ')
                                : mine ? (lang === 'en' ? 'Not sent' : 'મોકલાયું નથી') : null;
                          return (
                            <button
                              type="button"
                              key={s.time}
                              disabled={!clickable}
                              onClick={() => clickable && setSelectedSlot(s.time)}
                              className={`slot-pill ${state}`}
                              aria-pressed={isSelected}
                              title={note || undefined}
                            >
                              <span>{s.time.split(' - ')[0]}</span>
                              {isSelected && clickable ? <CheckCircle2 size={15} /> : note ? <small className="slot-note-tag">{note}</small> : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
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
                        background: isSelected ? '#eef7f2' : '#ffffff',
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

              {/* Bot prevention honeypot trap field */}
              <div style={{ position: 'absolute', width: '1px', height: '1px', margin: '-1px', padding: 0, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }} aria-hidden="true">
                <label htmlFor="booking_hp">Leave this empty</label>
                <input
                  id="booking_hp"
                  type="text"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div role="alert" aria-live="assertive" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                background: '#16a34a',
                borderColor: '#15803d',
                color: '#ffffff',
                opacity: (!selectedSlot || submitting) ? 0.6 : 1,
                cursor: (!selectedSlot || submitting) ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? (
                <>
                  <Clock size={18} className="animate-spin" />
                  <span>{lang === 'en' ? 'Preparing WhatsApp Booking...' : 'વોટ્સએપ બુકિંગ તૈયાર થઈ રહ્યું છે...'}</span>
                </>
              ) : (
                <>
                  <WhatsAppIcon size={20} />
                  <span>{lang === 'en' ? 'Book Slot via WhatsApp' : 'વોટ્સએપ દ્વારા સ્લોટ બુક કરો'}</span>
                </>
              )}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {lang === 'en'
                ? '⚡ Generates your official printable appointment slip and forwards booking directly to hospital reception WhatsApp.'
                : '⚡ તમારી સત્તાવાર એપોઇન્ટમેન્ટ સ્લિપ જનરેટ થશે અને વિગતો સીધી હોસ્પિટલ રિસેપ્શન વોટ્સએપ પર જશે.'}
            </span>
          </div>

        </form>
      </div>

    </div>
  );
}
