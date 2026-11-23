import React, { useEffect, useState } from 'react';
import { Calendar, Phone } from 'lucide-react';
import { PageHero } from '../components/ui';
import AppointmentLookup from '../components/AppointmentLookup';
import AppointmentSlip from '../components/AppointmentSlip';
import { Link, navigateTo } from '../router';
import { HOSPITAL_INFO } from '../data/hospitalContent';
import { getUnlocked, pruneOld } from '../lib/appointments';

// /my-appointments          private lookup (booking ID + mobile number)
// /my-appointments/<id>     the slip, only if verified (or just booked) in this tab
export default function AppointmentsPage({ appointmentId, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);

  // Read after the page loads (storage exists only in the browser)
  const [appointment, setAppointment] = useState(undefined); // undefined = not read yet
  useEffect(() => {
    pruneOld();
    if (!appointmentId) return;
    setAppointment(getUnlocked(appointmentId));
  }, [appointmentId]);

  const actions = (
    <>
      <Link to="book-appointment" className="btn btn-primary">
        <Calendar size={17} /> {t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
      </Link>
      <a className="btn btn-secondary" href={HOSPITAL_INFO.phoneHref}>
        <Phone size={17} /> {t('Call reception', 'રિસેપ્શનને કૉલ કરો')}
      </a>
    </>
  );

  const openSlip = (appt) => {
    if (appt.id === appointmentId) setAppointment(appt);
    else navigateTo('my-appointments', appt.id);
  };

  if (appointmentId) {
    return (
      <div>
        <PageHero
          crumbs={[{ label: t('My appointment', 'મારી એપોઇન્ટમેન્ટ'), to: 'my-appointments' }, { label: t('Slip', 'સ્લિપ') }]}
          eyebrow={t('Booking slip', 'બુકિંગ સ્લિપ')}
          title={appointment ? t(`Appointment ${appointment.id}`, `એપોઇન્ટમેન્ટ ${appointment.id}`) : t('Open your booking slip', 'તમારી બુકિંગ સ્લિપ ખોલો')}
          text={appointment
            ? t('Print this slip or share it as a PDF. Please bring it, with your past reports, when you come for your visit.', 'આ સ્લિપ પ્રિન્ટ કરો અથવા PDF તરીકે શેર કરો. મુલાકાત વખતે જૂના રિપોર્ટ્સ સાથે લાવો.')
            : t('For privacy, confirm the mobile number used for this booking.', 'ગોપનીયતા માટે, આ બુકિંગ વખતે આપેલો મોબાઇલ નંબર લખો.')}
        />
        <section className="section">
          <div className="container-wide">
            {appointment === undefined && <div className="page-loading" style={{ minHeight: 320 }} aria-busy="true" />}
            {appointment === null && (
              <AppointmentLookup lang={lang} presetId={appointmentId} onViewSlip={openSlip} />
            )}
            {appointment && (
              <AppointmentSlip appointment={appointment} lang={lang} onChange={setAppointment} />
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        crumbs={t('My appointment', 'મારી એપોઇન્ટમેન્ટ')}
        eyebrow={t('My appointment', 'મારી એપોઇન્ટમેન્ટ')}
        title={t('Check, print or cancel your booking', 'તમારી બુકિંગ ચેક, પ્રિન્ટ અથવા રદ કરો')}
        text={t(
          'Enter your booking ID and mobile number to open your slip. Only you can see your booking.',
          'તમારી સ્લિપ ખોલવા બુકિંગ ID અને મોબાઇલ નંબર લખો. તમારી બુકિંગ ફક્ત તમે જ જોઈ શકો છો.'
        )}
        actions={actions}
      />
      <section className="section">
        <div className="container-wide">
          <AppointmentLookup lang={lang} onViewSlip={(appt) => navigateTo('my-appointments', appt.id)} />
        </div>
      </section>
    </div>
  );
}
