import React, { useState } from 'react';
import { Search, Lock, AlertCircle } from 'lucide-react';
import { WhatsAppIcon } from './ui';
import { HOSPITAL_INFO } from '../data/hospitalContent';
import { findVerified, unlock } from '../lib/appointments';

/**
 * "My appointments": private lookup.
 * Nothing is listed. A booking opens only when BOTH its booking ID and the
 * mobile number used for it match exactly, so on a shared phone or computer
 * nobody can browse other people's bookings.
 */
export default function AppointmentLookup({ onViewSlip, lang = 'en', presetId = '' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const [bookingId, setBookingId] = useState(presetId);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    const id = bookingId.trim();
    const mobile = phone.replace(/\D/g, '');
    if (!id || mobile.length < 10) {
      setError(t('Enter your booking ID and the 10-digit mobile number used for the booking.', 'બુકિંગ ID અને બુકિંગ વખતે આપેલો ૧૦ આંકડાનો મોબાઇલ નંબર લખો.'));
      return;
    }
    const appt = findVerified(id, mobile);
    if (!appt) {
      // Same message whether the ID or the number is wrong (reveals nothing)
      setError(t('No booking matches these details on this device.', 'આ વિગતો સાથે આ ડિવાઇસ પર કોઈ બુકિંગ મળી નથી.'));
      return;
    }
    unlock(appt.id);
    onViewSlip(appt);
  };

  return (
    <div className="card page-card lookup-card">
      <form onSubmit={submit} className="lookup-form" noValidate>
        <div className="lookup-head">
          <span className="lookup-icon"><Lock size={18} /></span>
          <div>
            <h2>{t('Open your booking', 'તમારી બુકિંગ ખોલો')}</h2>
            <p>{t('For privacy, enter both your booking ID and the mobile number used for it.', 'ગોપનીયતા માટે, બુકિંગ ID અને બુકિંગ વખતે આપેલો મોબાઇલ નંબર બંને લખો.')}</p>
          </div>
        </div>

        <div className="lookup-fields">
          <label>
            <span>{t('Booking ID', 'બુકિંગ ID')}</span>
            <input
              className="form-input"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="PLS-123456"
              autoComplete="off"
              autoCapitalize="characters"
            />
          </label>
          <label>
            <span>{t('Mobile number', 'મોબાઇલ નંબર')}</span>
            <input
              className="form-input"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('10-digit number', '૧૦ આંકડાનો નંબર')}
              autoComplete="tel"
            />
          </label>
        </div>

        {error && (
          <p className="lookup-error" role="alert"><AlertCircle size={16} /> {error}</p>
        )}

        <button type="submit" className="btn btn-primary lookup-submit">
          <Search size={16} /> {t('Open booking', 'બુકિંગ ખોલો')}
        </button>

        <p className="lookup-help">
          {t('Bookings are saved only on the phone or computer they were made on. Booked on another device, or lost your ID? ', 'બુકિંગ માત્ર જે ફોન કે કમ્પ્યુટર પરથી કરી હોય તેમાં જ સચવાય છે. બીજા ડિવાઇસ પરથી બુક કર્યું હોય અથવા ID ખોવાઈ ગયું હોય તો ')}
          <a
            href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Pulse Hospital, I want to check my appointment status.')}`}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={14} /> {t('ask reception on WhatsApp', 'રિસેપ્શનને વોટ્સએપ કરો')}
          </a>.
        </p>
      </form>
    </div>
  );
}
