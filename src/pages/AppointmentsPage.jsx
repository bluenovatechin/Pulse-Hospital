import React, { useEffect, useState } from 'react';
import { Calendar, Phone } from 'lucide-react';
import { PageHero } from '../components/ui';
import AppointmentLookup from '../components/AppointmentLookup';
import AppointmentSlip from '../components/AppointmentSlip';
import { Link, navigateTo } from '../router';
import { HOSPITAL_INFO } from '../data/hospitalContent';

const STORAGE_KEY = 'pulse_hospital_appointments';

// /my-appointments          bookings saved in this browser
// /my-appointments/<id>     one printable slip
export default function AppointmentsPage({ appointmentId, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);

  // Bookings live in this browser only, so read them after the page loads
  const [appointment, setAppointment] = useState(undefined); // undefined = not read yet
  useEffect(() => {
    if (!appointmentId) return;
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setAppointment(all.find((a) => a.id === appointmentId) || null);
    } catch {
      setAppointment(null);
    }
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

  if (appointmentId) {
    return (
      <div>
        <PageHero
          crumbs={[{ label: t('My appointments', 'મારી એપોઇન્ટમેન્ટ'), to: 'my-appointments' }, { label: appointmentId }]}
          eyebrow={t('Booking slip', 'બુકિંગ સ્લિપ')}
          title={t(`Appointment ${appointmentId}`, `એપોઇન્ટમેન્ટ ${appointmentId}`)}
          text={t(
            'Print this slip or share it on WhatsApp. Please bring it, with your past reports, when you come for your visit.',
            'આ સ્લિપ પ્રિન્ટ કરો અથવા વોટ્સએપ પર મેળવો. મુલાકાત વખતે જૂના રિપોર્ટ્સ સાથે લાવો.'
          )}
        />
        <section className="section">
          <div className="container-wide">
            {appointment === undefined && <div className="page-loading" style={{ minHeight: 320 }} aria-busy="true" />}
            {appointment === null && (
              <div className="card page-card empty-state">
                <h2>{t('We couldn’t find this booking on this device', 'આ ડિવાઇસ પર આ બુકિંગ મળી નહીં')}</h2>
                <p className="muted">
                  {t(
                    'Booking slips are saved in the browser they were made on. If you booked on another phone, open the link there, or ask reception on WhatsApp.',
                    'બુકિંગ સ્લિપ જે બ્રાઉઝરમાં બુકિંગ કર્યું હોય ત્યાં જ સચવાય છે. બીજા ફોન પરથી બુક કર્યું હોય તો ત્યાં ખોલો અથવા રિસેપ્શનને વોટ્સએપ કરો.'
                  )}
                </p>
                <div className="row" style={{ marginTop: 16 }}>{actions}</div>
              </div>
            )}
            {appointment && <AppointmentSlip appointment={appointment} lang={lang} />}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        crumbs={t('My appointments', 'મારી એપોઇન્ટમેન્ટ')}
        eyebrow={t('My appointments', 'મારી એપોઇન્ટમેન્ટ')}
        title={t('Check, print or cancel a booking', 'બુકિંગ ચેક, પ્રિન્ટ અથવા રદ કરો')}
        text={t(
          'Bookings made on this phone or computer are listed below. Search by mobile number or booking ID (e.g. PLS-920101).',
          'આ ફોન કે કમ્પ્યુટર પરથી કરેલી બુકિંગ નીચે દેખાશે. મોબાઇલ નંબર અથવા બુકિંગ ID (દા.ત. PLS-920101) દ્વારા શોધો.'
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
