import React from 'react';
import { AlertCircle, Calendar, Phone, CheckCircle2, FileText, Scale, MapPin } from 'lucide-react';
import { PageHero } from '../components/ui';
import { HOSPITAL_INFO, PHOTOS } from '../data/hospitalContent';

export default function TermsPage({ onNavigate, onBook, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);

  return (
    <div>
      <PageHero
        photo={PHOTOS.reception}
        crumbs={t('Terms & Conditions', 'નિયમો અને શરતો')}
        onHome={() => onNavigate('home')}
        eyebrow={t('Hospital Guidelines & Policies', 'હોસ્પિટલ માર્ગદર્શિકા અને નીતિ')}
        eyebrowIcon={<Scale size={14} />}
        title={t('Terms & Conditions of Service', 'સેવાના નિયમો અને શરતો')}
        text={t(
          'Operating terms, appointment guidelines, emergency protocols, and patient responsibilities at Pulse Hospital & I.C.U.',
          'પલ્સ હોસ્પિટલના એપોઇન્ટમેન્ટ નિયમો, ઇમરજન્સી પ્રોટોકોલ અને દર્દી માર્ગદર્શિકા.'
        )}
        cardTitle={t('Clinical Governance & Terms', 'હોસ્પિટલ નિયમાવલી અને શરતો')}
        cardBadge={t('Transparent Guidelines', 'પારદર્શક નિયમો')}
        cardIcon={<FileText size={18} />}
        stats={[
          { value: '24x7', label: t('Emergency Triage', 'ઇમરજન્સી ટ્રાયજ'), sub: t('Priority medical care', 'પ્રાથમિકતા સારવાર') },
          { value: '30 min', label: t('OPD Window', 'OPD સ્લોટ સમય'), sub: t('Reporting 10m before', '૧૦ મિનિટ પહેલાં આવવું') },
          { value: '0 Fee', label: t('Online Booking', 'ઓનલાઇન બુકિંગ'), sub: t('Pay at hospital desk', 'હોસ્પિટલ કાઉન્ટરે ચુકવણી') },
          { value: '100%', label: t('Accountability', 'જવાબદારી'), sub: t('Clear printed slips', 'પ્રિન્ટેડ સ્લિપ સાથે') }
        ]}
        highlights={[
          t('Slot bookings can be verified or cancelled online at zero charge', 'સ્લોટ બુકિંગ કોઈપણ ચાર્જ વગર ઓનલાઇન રદ કે તપાસી શકાય છે'),
          t('Critical trauma & emergency patients receive immediate triage priority', 'ગંભીર ઇમરજન્સી દર્દીઓને તાત્કાલિક પ્રથમ પ્રાથમિકતા મળે છે'),
          t('Official hospital slips generated with tamper-proof booking references', 'સુરક્ષિત બુકિંગ રેફરન્સ સાથે માન્ય હોસ્પિટલ સ્લિપ ઉપલબ્ધ')
        ]}
      />

      <section className="section">
        <div className="container-wide" style={{ maxWidth: 900 }}>
          {/* Emergency Alert Box */}
          <div
            className="card"
            style={{
              padding: '24px',
              borderLeft: '4px solid var(--pulse-red)',
              background: 'var(--pulse-red-soft)',
              marginBottom: 28
            }}
            data-reveal
          >
            <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
              <span className="icon-tile red" style={{ width: 38, height: 38, flexShrink: 0 }}>
                <AlertCircle size={20} />
              </span>
              <div>
                <h3 style={{ fontSize: 17, color: '#be123c', marginBottom: 6 }}>
                  {t('CRITICAL EMERGENCY NOTICE', 'મહત્વપૂર્ણ ઇમરજન્સી સૂચના')}
                </h3>
                <p style={{ color: '#9f1239', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  {t(
                    'Online slot booking is strictly for stable, non-emergency outpatient (OPD) visits. In situations involving acute chest pain, heart attacks, breathing difficulty, stroke symptoms, major trauma, heavy bleeding, snakebites, or poisoning, DO NOT wait for an online appointment. Bring the patient straight to the 24x7 Emergency Room on the 4th Floor, City Centre, Modasa or dial our emergency desk immediately.',
                    'ઓનલાઈન સ્લોટ બુકિંગ માત્ર રૂટિન OPD તપાસ માટે છે. ગંભીર ઇમરજન્સી, છાતીમાં દુખાવો, અકસ્માત કે ઝેરી જીવજંતુના ડંખમાં સીધા હોસ્પિટલના ૨૪ કલાક ઇમરજન્સી વોર્ડમાં આવો અથવા તાત્કાલિક કૉલ કરો.'
                  )}
                </p>
                <div style={{ marginTop: 12 }}>
                  <a className="btn btn-emergency btn-sm" href={HOSPITAL_INFO.phoneHref}>
                    <Phone size={14} /> {t('Call Emergency: ', 'ઇમરજન્સી કૉલ: ')} {HOSPITAL_INFO.appointmentNumber}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid" style={{ gap: 24 }}>
            {/* Section 1 */}
            <div className="card" style={{ padding: '28px' }} data-reveal>
              <h4 style={{ fontSize: 17, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--brand-navy)' }}>
                <span className="icon-tile" style={{ width: 32, height: 32 }}><FileText size={16} /></span>
                1. {t('Scope of Digital Appointment Portal', 'ઓનલાઈન પોર્ટલનો વ્યાપ')}
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: 14.5, lineHeight: 1.7 }}>
                {t(
                  'The website provides transparent information regarding hospital clinical departments, consultant physician timetables, and available facilities. The booking system enables patients and their family members to reserve a 30-minute consultation window with senior visiting MD consultants for the upcoming week.',
                  'આ વેબસાઇટ હોસ્પિટલના વિભાગો, ડૉક્ટરોના સમયપત્રક અને આગામી અઠવાડિયા માટે ૩૦ મિનિટનો OPD સમય સ્લોટ બુક કરવાની સુવિધા પૂરી પાડે છે.'
                )}
              </p>
            </div>

            {/* Section 2 */}
            <div className="card" style={{ padding: '28px' }} data-reveal>
              <h4 style={{ fontSize: 17, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--brand-navy)' }}>
                <span className="icon-tile" style={{ width: 32, height: 32 }}><Calendar size={16} /></span>
                2. {t('Patient Arrival & Slot Timing Guidelines', 'સમયપાલન અને મુલાકાત નિયમો')}
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 12 }}>
                {t(
                  'To respect everyone’s time and eliminate waiting hall congestion, please observe the following:',
                  'રાહ જોવાનો સમય ઘટાડવા અને વ્યવસ્થા જાળવવા નીચેના નિયમોનું પાલન કરો:'
                )}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  t('Reporting time: Arrive at the 4th-floor reception desk 10 to 15 minutes before your scheduled slot.', 'બુક કરેલ સ્લોટ કરતાં ૧૦ થી ૧૫ મિનિટ વહેલા રિસેપ્શન પર પહોંચવું.'),
                  t('Identification: Present your digital booking slip or booking reference ID (e.g. PLS-920101) to reception staff.', 'રિસેપ્શન પર બુકિંગ સ્લિપ અથવા રેફરન્સ ID બતાવવું.'),
                  t('Documentation: Carry your hospital patient file, previous doctor prescriptions, discharge summaries, and lab/CT reports.', 'જૂની મેડિકલ ફાઇલ, રિપોર્ટ્સ અને દવાઓની યાદી સાથે લાવવી.'),
                  t('Late arrival: If you arrive more than 20 minutes past your booked window, reception will accommodate you in the next open slot.', 'મોડા પહોંચવાના સંજોગોમાં આગળના ઉપલબ્ધ સ્લોટમાં વારો આપવામાં આવશે.')
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'var(--text-body)' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 3 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3 */}
            <div className="card" style={{ padding: '28px' }} data-reveal>
              <h4 style={{ fontSize: 17, marginBottom: 12, color: 'var(--brand-navy)' }}>
                3. {t('Emergency Priority Protocol', 'ઇમરજન્સી કેસની પ્રાથમિકતા')}
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: 14.5, lineHeight: 1.7 }}>
                {t(
                  'Pulse Hospital is an active critical-care and trauma center. When a life-threatening clinical crisis arrives (such as acute cardiac arrest, emergency intubation, or acute poisoning resuscitation), the attending consultant or intensivist may be summoned to the ICU or emergency bay immediately. In such situations, scheduled OPD consultations may experience brief delays. Unstable emergency patients receive highest clinical priority at all times.',
                  'પલ્સ હોસ્પિટલ એક ૨૪ કલાકનું ક્રિટિકલ કેર સેન્ટર છે. ગંભીર ઇમરજન્સી કેસમાં ડૉક્ટરે તાત્કાલિક ICUમાં જવું પડી શકે છે. તેવા સમયે OPDમાં થોડી વાર થઈ શકે છે. માનવ જીવન બચાવવું એ અમારી સર્વોચ્ચ પ્રાથમિકતા છે.'
                )}
              </p>
            </div>

            {/* Section 4 */}
            <div className="card" style={{ padding: '28px' }} data-reveal>
              <h4 style={{ fontSize: 17, marginBottom: 12, color: 'var(--brand-navy)' }}>
                4. {t('Cancellations & Slot Fair Use', 'સ્લોટ કેન્સલેશન નિયમ')}
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: 14.5, lineHeight: 1.7 }}>
                {t(
                  'If you are unable to attend your appointment, please use the “My Booking” lookup tool on this website or inform reception via phone. Cancelling your slot instantly releases the consultation capacity for another patient in need. There are no cancellation penalties.',
                  'જો તમે આવી શકો તેમ ન હો તો કૃપા કરીને “મારી એપોઇન્ટમેન્ટ” પેનલ અથવા ફોન દ્વારા સ્લોટ રદ કરો જેથી બીજા દર્દીને સારવાર મળી શકે.'
                )}
              </p>
            </div>

            {/* Section 5 */}
            <div className="card" style={{ padding: '28px' }} data-reveal>
              <h4 style={{ fontSize: 17, marginBottom: 12, color: 'var(--brand-navy)' }}>
                5. {t('Hospital Facilities & Diagnostics', 'સુવિધાઓ અને તપાસ')}
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: 14.5, lineHeight: 1.7 }}>
                {t(
                  'In-house diagnostic facilities, including Modasa CT Scan Centre, digital X-Ray, 2D Echocardiography, hemodialysis unit, and pathology testing are subject to standard medical protocol and consultant prescription. Modasa CT Scan Centre operates directly on hospital premises, preventing the need for ambulance transfer.',
                  'સીટી સ્કેન, એક્સ-રે, ડાયાલીસીસ અને લેબ તપાસ ડૉક્ટરની સલાહ મુજબ જ કરવામાં આવે છે. સીટી સ્કેન હોસ્પિટલમાં જ ઉપલબ્ધ હોવાથી બહાર જવાની જરૂર નથી.'
                )}
              </p>
            </div>

            {/* Section 6 */}
            <div className="card" style={{ padding: '28px', background: 'var(--surface-soft)' }} data-reveal>
              <h4 style={{ fontSize: 17, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--brand-navy)' }}>
                <span className="icon-tile" style={{ width: 32, height: 32 }}><Scale size={16} /></span>
                6. {t('Governing Law & Legal Jurisdiction', 'કાયદાકીય અધિકારક્ષેત્ર')}
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 14 }}>
                {t(
                  'These terms and all hospital services are governed by the laws of India. Any disputes arising in connection with services rendered shall fall under the exclusive jurisdiction of the competent courts in Modasa, Arvalli District, Gujarat.',
                  'તમામ સેવાઓ અને નિયમો ભારતીય કાયદા અનુસાર સંચાલિત થાય છે અને તેનું અધિકારક્ષેત્ર મોડાસા, જિલ્લો અરવલ્લી, ગુજરાત રહેશે.'
                )}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-muted)' }}>
                <MapPin size={16} style={{ color: 'var(--primary)' }} />
                <span>{HOSPITAL_INFO.address.full}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
