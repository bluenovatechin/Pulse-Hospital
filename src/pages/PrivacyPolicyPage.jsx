import React from 'react';
import { Shield, Lock, FileText, CheckCircle2, Phone, MapPin } from 'lucide-react';
import { PageHero } from '../components/ui';
import { HOSPITAL_INFO } from '../data/hospitalContent';

export default function PrivacyPolicyPage({ lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);

  return (
    <div>
      <PageHero
        crumbs={t('Privacy Policy', 'પ્રાઇવસી પોલિસી')}
        eyebrow={t('Privacy', 'ગોપનીયતા')}
        title={t('Privacy Policy', 'પ્રાઇવસી પોલિસી')}
        text={t(
          'How Pulse Hospital & I.C.U handles the details you share when you book an appointment or contact us through this website.',
          'આ વેબસાઇટ દ્વારા એપોઇન્ટમેન્ટ બુક કરતી વખતે કે સંપર્ક કરતી વખતે આપેલી માહિતી પલ્સ હોસ્પિટલ કઈ રીતે સંભાળે છે.'
        )}
      />

      <section className="section">
        <div className="container-wide" style={{ maxWidth: 900 }}>
          <div className="card" style={{ padding: '36px 32px', marginBottom: 28 }} data-reveal>
            <div className="row" style={{ gap: 12, marginBottom: 16 }}>
              <span className="icon-tile mint" style={{ width: 40, height: 40 }}>
                <Shield size={20} />
              </span>
              <div>
                <h3 style={{ fontSize: 18, color: 'var(--brand-navy)' }}>
                  {t('Commitment to Patient Confidentiality', 'દર્દીની સંપૂર્ણ ગોપનીયતાની ખાતરી')}
                </h3>
                <small className="muted">{t('Last updated: March 2026', 'છેલ્લો સુધારો: માર્ચ ૨૦૨૬')}</small>
              </div>
            </div>

            <p style={{ color: 'var(--text-body)', lineHeight: 1.7, marginBottom: 16 }}>
              {t(
                'Pulse Hospital & I.C.U (“we”, “our”, or “the hospital”) operates on the 4th Floor, City Centre, Shamlaji Road, Modasa, Gujarat. We hold patient confidentiality and medical ethics to the highest clinical standards under the Indian Digital Personal Data Protection Act (DPDP), Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations, and relevant healthcare privacy frameworks.',
                'પલ્સ હોસ્પિટલ એન્ડ આઈ.સી.યુ. (મોડાસા, ગુજરાત) દર્દીઓની તમામ તબીબી માહિતીની ગોપનીયતા અને ભારતીય કાયદાકીય માર્ગદર્શિકાઓનું ચુસ્તપણે પાલન કરે છે.'
              )}
            </p>
          </div>

          <div className="grid" style={{ gap: 24 }}>
            {/* Section 1 */}
            <div className="card" style={{ padding: '28px' }} data-reveal>
              <h4 style={{ fontSize: 17, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--brand-navy)' }}>
                <span className="icon-tile" style={{ width: 32, height: 32 }}><FileText size={16} /></span>
                1. {t('Information We Collect', 'અમે કઈ માહિતી એકત્રિત કરીએ છીએ')}
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 12 }}>
                {t(
                  'When you schedule an outpatient (OPD) slot, register for an emergency admission, or contact reception, we collect only necessary clinical and contact details:',
                  'જ્યારે તમે એપોઇન્ટમેન્ટ બુક કરો છો અથવા હોસ્પિટલનો સંપર્ક કરો છો ત્યારે નીચે મુજબની જરૂરી વિગતો લેવામાં આવે છે:'
                )}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  t('Patient identification: Full name, age, gender, and contact phone number.', 'દર્દીનું પૂરું નામ, ઉંમર અને મોબાઈલ નંબર.'),
                  t('Clinical context: Reason for visit, primary symptoms, and optional prior hospital file number.', 'મુલાકાતનું કારણ, પ્રાથમિક લક્ષણો અને જૂનો ફાઇલ નંબર.'),
                  t('Appointment parameters: Preferred consulting doctor, chosen date, and 30-minute time slot.', 'પસંદ કરેલ ડૉક્ટર, તારીખ અને સમય સ્લોટ.'),
                  t('Communication history: the WhatsApp messages exchanged with reception.', 'રિસેપ્શન સાથેના વોટ્સએપ સંદેશા.')
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'var(--text-body)' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--mint)', flexShrink: 0, marginTop: 3 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2 */}
            <div className="card" style={{ padding: '28px' }} data-reveal>
              <h4 style={{ fontSize: 17, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--brand-navy)' }}>
                <span className="icon-tile" style={{ width: 32, height: 32 }}><Lock size={16} /></span>
                2. {t('How Your Health Data Is Used', 'આ માહિતીનો ઉપયોગ કઈ રીતે થાય છે')}
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 10 }}>
                {t(
                  'Your data is processed strictly for legitimate clinical, diagnostic, and hospital administration purposes:',
                  'તમારી માહિતી માત્ર તબીબી સેવાઓ અને સારવાર વ્યવસ્થા માટે જ વપરાય છે:'
                )}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  t('Reserving doctor consultation capacity and eliminating waiting room overcrowding.', 'ડૉક્ટરની એપોઇન્ટમેન્ટ સ્લોટ ફાળવણી માટે.'),
                  t('Verifying prior treatment records, allergy history, and ongoing prescriptions at bedside.', 'અગાઉના મેડિકલ રેકોર્ડ અને દવાઓની ચકાસણી માટે.'),
                  t('Confirming your appointment with you on WhatsApp.', 'વોટ્સએપ પર તમારી એપોઇન્ટમેન્ટ કન્ફર્મ કરવા માટે.'),
                  t('Emergency triage coordination if urgent clinical admission is needed.', 'ઇમરજન્સી અને આઈ.સી.યુ. એડમિશન વ્યવસ્થા માટે.')
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
                3. {t('Zero Commercial Sale of Patient Data', 'ડેટાનું કોઈ વ્યવસાયિક વેચાણ નહીં')}
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: 14.5, lineHeight: 1.7 }}>
                {t(
                  'Pulse Hospital does not sell, rent, monetize, or disclose your health data to third-party advertisers, pharmaceutical marketers, or commercial data brokers under any circumstances. Information is accessed solely by treating consultants, resident duty medical officers, in-house laboratory personnel, and authorised reception staff directly involved in your medical care.',
                  'પલ્સ હોસ્પિટલ કોઈપણ તૃતીય પક્ષ કે માર્કેટિંગ એજન્સીને દર્દીઓની વિગતો આપતી નથી. ફક્ત તમારી સારવાર સાથે જોડાયેલા ડૉક્ટરો અને સ્ટાફ જ તેનો ઉપયોગ કરી શકે છે.'
                )}
              </p>
            </div>

            {/* Section 4 */}
            <div className="card" style={{ padding: '28px' }} data-reveal>
              <h4 style={{ fontSize: 17, marginBottom: 12, color: 'var(--brand-navy)' }}>
                4. {t('Data Security & Record Retention', 'ડેટા સુરક્ષા અને સંગ્રહ')}
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: 14.5, lineHeight: 1.7 }}>
                {t(
                  'This website is served over HTTPS and has no database of its own. When you book or send an inquiry, the details are placed in a WhatsApp message that you send to the hospital yourself, and a copy of your booking is kept only in your own browser so you can see it under “My Booking”. Clearing your browser data removes that copy. Records created at the hospital during your visit are kept as required by medical record regulations.',
                  'આ વેબસાઇટ HTTPS પર ચાલે છે અને તેનો પોતાનો કોઈ ડેટાબેઝ નથી. બુકિંગ કે પૂછપરછની વિગતો વોટ્સએપ સંદેશ તરીકે તમે જાતે હોસ્પિટલને મોકલો છો, અને બુકિંગની નકલ ફક્ત તમારા બ્રાઉઝરમાં જ રહે છે. હોસ્પિટલમાં બનતા રેકોર્ડ્સ નિયમો મુજબ સાચવવામાં આવે છે.'
                )}
              </p>
            </div>

            {/* Section 5 */}
            <div className="card" style={{ padding: '28px' }} data-reveal>
              <h4 style={{ fontSize: 17, marginBottom: 12, color: 'var(--brand-navy)' }}>
                5. {t('Your Patient Rights', 'દર્દી તરીકે તમારા અધિકારો')}
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 10 }}>
                {t(
                  'You possess the right to:',
                  'તમને નીચે મુજબના અધિકારો છે:'
                )}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  t('Access and verify your scheduled appointment details through the “My Booking” portal at any time.', '“મારી એપોઇન્ટમેન્ટ” પેનલ દ્વારા તમારો સ્લોટ ગમે ત્યારે ચેક કરવો.'),
                  t('Cancel a booked appointment free of charge before the consultation time.', 'કન્સલ્ટેશન પહેલાં સ્લોટ રદ કરવો જેથી બીજા દર્દીને જગ્યા મળી શકે.'),
                  t('Request corrections to erroneous contact details or spelling mistakes.', 'નામ કે મોબાઈલ નંબરની ભૂલ સુધારવી.'),
                  t('Request copies of your discharge summary, CT scans, and lab reports directly from reception.', 'ડિસ્ચાર્જ સમરી અને લેબ રિપોર્ટની નકલ મેળવવી.')
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'var(--text-body)' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--mint)', flexShrink: 0, marginTop: 3 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 6 */}
            <div className="card" style={{ padding: '28px', background: 'var(--surface-soft)' }} data-reveal>
              <h4 style={{ fontSize: 17, marginBottom: 12, color: 'var(--brand-navy)' }}>
                6. {t('Hospital Privacy Contact & Grievance Officer', 'પ્રાઇવસી સંપર્ક અને મદદ')}
              </h4>
              <p style={{ color: 'var(--text-body)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 14 }}>
                {t(
                  'For inquiries regarding this Privacy Policy, your medical data confidentiality, or data corrections, contact our hospital administrative desk:',
                  'પ્રાઇવસી કે ડેટા સંબંધી કોઈ પણ પ્રશ્ન માટે હોસ્પિટલ પ્રશાસનનો સંપર્ક કરો:'
                )}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--text-main)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={16} style={{ color: 'var(--primary)' }} />
                  <span>{HOSPITAL_INFO.address.full}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={16} style={{ color: 'var(--primary)' }} />
                  <span><a href={HOSPITAL_INFO.phoneHref} style={{ fontWeight: 700 }}>{HOSPITAL_INFO.appointmentNumber}</a> (Reception & Administration Desk)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
