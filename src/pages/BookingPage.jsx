import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Phone, CalendarCheck } from 'lucide-react';
import { PageHero, Avatar, WhatsAppIcon } from '../components/ui';
import { Link, navigateTo } from '../router';
import { DOCTORS, HOSPITAL_INFO } from '../data/hospitalContent';

const NextWeekBooking = lazy(() => import('../components/NextWeekBooking'));

// Full booking page: /book-appointment (optionally /book-appointment/<doctor-slug>)
export default function BookingPage({ doctor, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);

  // The form shows real dates for the coming week, so it only renders in the
  // browser; the pre-rendered page shows the doctor list in its place.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const placeholder = (
    <div className="card booking-placeholder">
      <p className="muted">{t('Choose a doctor to book a 30-minute OPD slot:', '૩૦ મિનિટનો OPD સ્લોટ બુક કરવા ડૉક્ટર પસંદ કરો:')}</p>
      <ul className="booking-doctor-links">
        {DOCTORS.map((d) => (
          <li key={d.id}>
            <Link to="book-appointment" param={d.slug}>
              <Avatar doctor={d} size="sm" />
              <span><strong>{lang === 'en' ? d.name : d.nameGujarati}</strong><small>{d.qualification} · {d.designation}</small></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <PageHero
        crumbs={doctor
          ? [{ label: t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો'), to: 'book-appointment' }, { label: lang === 'en' ? doctor.name : doctor.nameGujarati }]
          : t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
        eyebrow={t('OPD appointment', 'OPD એપોઇન્ટમેન્ટ')}
        title={doctor
          ? t(`Book an appointment with ${doctor.name}`, `${doctor.nameGujarati} સાથે એપોઇન્ટમેન્ટ બુક કરો`)
          : t('Book a doctor appointment', 'ડૉક્ટરની એપોઇન્ટમેન્ટ બુક કરો')}
        text={t(
          'Pick a doctor, any day from today through the next 15 days, and a 30-minute morning or evening slot. Your request opens directly in WhatsApp for hospital confirmation.',
          'ડૉક્ટર, આજથી આગામી ૧૫ દિવસમાંથી કોઈપણ દિવસ અને ૩૦ મિનિટનો સ્લોટ પસંદ કરો. વિનંતી વોટ્સએપ પર રિસેપ્શનને જશે અને તેઓ સ્લોટ કન્ફર્મ કરશે.'
        )}
        facts={[
          { value: '30 min', label: t('Per consultation', 'દરેક મુલાકાત') },
          { value: t('15 Days', '૧૫ દિવસ'), label: t('Advance calendar', 'એડવાન્સ કેલેન્ડર') },
          { value: 'WhatsApp', label: t('Confirmed by reception', 'રિસેપ્શન કન્ફર્મ કરે') }
        ]}
        aside={
          <div className="card booking-side">
            <span className="hero-note-icon"><CalendarCheck size={20} /></span>
            <h2>{t('Emergency?', 'ઇમરજન્સી?')}</h2>
            <p className="muted">{t('No appointment is needed. Come straight to the 4th floor or call now.', 'એપોઇન્ટમેન્ટની જરૂર નથી. સીધા ૪થા માળે આવો અથવા કૉલ કરો.')}</p>
            <a className="btn btn-emergency btn-block" href={HOSPITAL_INFO.phoneHref}><Phone size={17} /> {HOSPITAL_INFO.appointmentNumber}</a>
            <a className="btn btn-secondary btn-block" href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber}`} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> {t('Ask on WhatsApp', 'વોટ્સએપ પર પૂછો')}</a>
          </div>
        }
      />

      <section className="section">
        <div className="container-wide booking-page-body">
          {ready ? (
            <Suspense fallback={placeholder}>
              <NextWeekBooking
                key={doctor?.id || 'any'}
                preselectedDoctorId={doctor?.id || null}
                onBookingSuccess={(appt) => navigateTo('my-appointments', appt.id)}
                lang={lang}
                showHeader={false}
              />
            </Suspense>
          ) : placeholder}
        </div>
      </section>
    </div>
  );
}
