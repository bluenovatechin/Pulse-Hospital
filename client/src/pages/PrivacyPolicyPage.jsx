import React from 'react';
import { Shield, Lock, FileText, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { PageHero, SectionHead } from '../components/ui';
import { HOSPITAL_INFO, PHOTOS } from '../data/hospitalContent';

export default function PrivacyPolicyPage({ onNavigate, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);

  return (
    <div>
      <PageHero
        photo={PHOTOS.billing}
        crumbs={t('Privacy Policy', 'પ્રાઇવસી પોલિસી')}
        onHome={() => onNavigate('home')}
        eyebrow={t('Patient Data Protection', 'દર્દી ડેટા સુરક્ષા')}
        eyebrowIcon={<Lock size={14} />}
        title={t('Privacy Policy & Health Data Protection', 'પ્રાઇવસી પોલિસી અને દર્દીની ગોપનીયતા')}
        text={t(
          'How Pulse Hospital & I.C.U protects your medical records, appointment details, and personal health information.',
          'પલ્સ હોસ્પિટલ તમારા મેડિકલ રેકોર્ડ્સ અને વ્યક્તિગત માહિતીની સુરક્ષા કઈ રીતે રાખે છે.'
        )}
        cardTitle={t('Security & Standards Assurance', 'સુરક્ષા અને ગુણવત્તા ખાતરી')}
        cardBadge={t('Strict Confidentiality', 'સંપૂર્ણ ગોપનીયતા')}
        cardIcon={<Shield size={18} />}
        stats={[
          { value: '256-bit', label: t('SSL Security', 'SSL સુરક્ષા'), sub: t('End-to-end encrypted', 'સંપૂર્ણ એન્ક્રિપ્ટેડ') },
          { value: '100%', label: t('Confidential', 'ગોપનીયતા'), sub: t('Zero external selling', 'કોઈ ડેટા વેચાણ નહિ') },
          { value: '24x7', label: t('Integrity', 'ડેટા સુરક્ષા'), sub: t('Encrypted records', 'સુરક્ષિત રેકોર્ડ્સ') },
          { value: 'DISHA', label: t('Aligned Standards', 'હેલ્થ ડેટા નિયમો'), sub: t('Healthcare Act', 'ભારતીય નિયમો મુજબ') }
        ]}
        highlights={[
          t('Patient records and lab investigations are never shared or monetised', 'દર્દીના મેડિકલ રેકોર્ડ્સ કે રિપોર્ટ્સ ક્યારેય કોઈ સાથે શેર થતા નથી'),
          t('Appointment lookup is restricted strictly to verified 10-digit mobile numbers', 'એપોઇન્ટમેન્ટ વિગત ફક્ત વેરિફાઇડ ૧૦ આંકડાના મોબાઇલ નંબર પર જ મળે છે'),
          t('Internal medical access restricted strictly to attending clinical personnel', 'મેડિકલ ડેટા ફક્ત સારવાર આપતા ડૉક્ટર્સ અને સ્ટાફ સુધી જ સીમિત રહે છે')
        ]}
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
                  t('Communication history: WhatsApp confirmations, SMS updates, and reception callback requests.', 'વોટ્સએપ અને એસએમએસ કન્ફર્મેશન મેસેજ.')
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
                  t('Transmitting digital appointment slips directly to your designated WhatsApp number.', 'વોટ્સએપ પર બુકિંગ સ્લિપ મોકલવા માટે.'),
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
                  'All digital interactions with this portal are protected with standard transport layer encryption (TLS/HTTPS). Clinical records and appointment history are stored on secure servers with restricted role-based administrative permissions. Patient records are retained in accordance with statutory medical record preservation timelines mandated under National Medical Commission guidelines.',
                  'તમામ ડેટા એન્ક્રિપ્શન સાથે સુરક્ષિત રાખવામાં આવે છે અને ફક્ત અધિકૃત હોસ્પિટલ એડમિન દ્વારા જ તે જોઈ શકાય છે.'
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mail size={16} style={{ color: 'var(--primary)' }} />
                  <span>{HOSPITAL_INFO.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
