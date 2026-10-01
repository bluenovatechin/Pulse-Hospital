import React from 'react';
import { MapPin, Clock, HeartPulse, ShieldCheck, Users, FileText, Calendar, ArrowRight, Phone } from 'lucide-react';
import { PageHero, SectionHead, delay } from '../components/ui';
import { Link } from '../router';
import { HOSPITAL_INFO, PHOTOS, MILESTONES } from '../data/hospitalContent';

export default function AboutPage({ lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);

  const values = [
    { icon: Clock, title: t('Always open', 'હંમેશા ખુલ્લું'), text: t('Emergency, ICU, lab, pharmacy and dialysis never close, including at night and on Sundays.', 'ઇમરજન્સી, ICU, લેબ, ફાર્મસી અને ડાયાલીસીસ ક્યારેય બંધ નથી.') },
    { icon: HeartPulse, title: t('Critical care nearby', 'નજીકમાં ક્રિટિકલ કેર'), text: t('Ventilators, CT and dialysis in Modasa, so families don’t have to travel 100+ km in a crisis.', 'વેન્ટીલેટર, CT અને ડાયાલીસીસ મોડાસામાં જ.') },
    { icon: Users, title: t('Senior doctors', 'અનુભવી ડૉક્ટરો'), text: t('Experienced MD physicians and a chest specialist, with a medical officer in the ICU around the clock.', 'અનુભવી એમ.ડી. ફિઝિશિયન અને ૨૪ કલાક રેસિડેન્ટ ડૉક્ટરો.') },
    { icon: ShieldCheck, title: t('Safe, clean spaces', 'સ્વચ્છ અને સુરક્ષિત'), text: t('Laminar-airflow theatres, an isolation ICU and strict infection control.', 'લેમિનાર એરફ્લો OT, આઈસોલેશન ICU અને ચેપ નિયંત્રણ.') }
  ];

  return (
    <div>
      <PageHero
        photo={PHOTOS.reception}
        photoAlt={t('Reception and help desk at Pulse Hospital', 'પલ્સ હોસ્પિટલ રીસેપ્શન')}
        crumbs={t('About', 'અમારા વિશે')}
        eyebrow={t('About Pulse Hospital & I.C.U', 'પલ્સ હોસ્પિટલ & આઈ.સી.યુ. વિશે')}
        title={t('Emergency and critical care for Arvalli', 'અરવલ્લી માટે ઇમરજન્સી અને ક્રિટિકલ કેર')}
        text={t(
          'Pulse Hospital & I.C.U is on the 4th floor of City Centre, Shamlaji Road, bringing ICU, dialysis, CT and specialist care to Modasa and the villages around it.',
          'સીટી સેન્ટર, શામળાજી રોડના ૪થા માળે આવેલી પલ્સ હોસ્પિટલ મોડાસા અને આસપાસના ગામો માટે ICU, ડાયાલીસીસ, CT અને નિષ્ણાત સારવાર લાવે છે.'
        )}
        factsLabel={t(MILESTONES.period, MILESTONES.periodGu)}
        facts={MILESTONES.items.map((m) => ({ value: m.value, label: t(m.en, m.gu) }))}
        factsNote={MILESTONES.noteGu}
        note={{
          icon: <HeartPulse size={20} />,
          title: t('Caring for life', 'જીવનની સંભાળ'),
          text: HOSPITAL_INFO.taglineGujarati
        }}
        actions={
          <>
            <a className="btn btn-primary" href={HOSPITAL_INFO.phoneHref}>
              <Phone size={17} /> {t('Call the hospital', 'હોસ્પિટલને કૉલ કરો')}
            </a>
            <a className="btn btn-secondary" href={HOSPITAL_INFO.mapsUrl} target="_blank" rel="noreferrer">
              <MapPin size={17} /> {t('Find us on the map', 'નકશો જુઓ')}
            </a>
          </>
        }
      />

      <section className="section">
        <div className="container-wide">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: 48 }}>
            <div data-reveal>
              <span className="eyebrow">{t('Our story', 'અમારી વાત')}</span>
              <h2 style={{ fontSize: 'clamp(22px, 3.8vw, 36px)', margin: '10px 0 16px', lineHeight: 1.25 }}>{t('Caring for life, in every moment', 'જીવનની સુરક્ષા આપણી પ્રાથમિકતા')}</h2>
              <p style={{ color: 'var(--text-body)', marginBottom: 14 }}>
                {t(
                  'Patients who once had to rush 100+ kilometres to Ahmedabad for ventilator support, emergency dialysis or a CT scan can now receive that care right here in Modasa.',
                  'જે દર્દીઓએ અગાઉ વેન્ટિલેટર, ઇમરજન્સી ડાયાલિસિસ અથવા સીટી સ્કેન માટે ૧૦૦+ કિમી અમદાવાદ જવું પડતું હતું, તેઓને હવે આ તમામ સુવિધા મોડાસામાં જ મળી રહે છે.'
                )}
              </p>
              <p style={{ color: 'var(--text-body)' }}>
                {t(
                  'Our ICU is staffed 24x7 by qualified doctors and experienced critical-care nurses, with invasive and non-invasive ventilators, bedside sonography, 2D Echo and central monitoring.',
                  'અમારું આઈ.સી.યુ. ૨૪x૭ લાયકાત ધરાવતા ડોક્ટરો અને અનુભવી ક્રિટિકલ-કેર નર્સિંગ સ્ટાફ દ્વારા કાર્યરત છે, જેમાં વેન્ટિલેટર, બેડસાઇડ સોનોગ્રાફી, 2D ઇકો અને સેન્ટ્રલ મોનિટરિંગ ઉપલબ્ધ છે.'
                )}
              </p>
              <div className="row" style={{ marginTop: 24 }}>
                <Link to="facilities" className="btn btn-primary">{t('See our facilities', 'સુવિધાઓ જુઓ')} <ArrowRight size={16} /></Link>
                <Link to="doctors" className="btn btn-secondary">{t('Meet the doctors', 'ડૉક્ટરોને મળો')}</Link>
              </div>
            </div>
            <div className="photo" style={{ aspectRatio: '4 / 3', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)' }} data-reveal>
              <img src={PHOTOS.icuWard} alt="Pulse Hospital ICU ward" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container-wide">
          <SectionHead center eyebrow={t('What we stand for', 'અમારા મૂલ્યો')} title={t('Four promises to every patient', 'દરેક દર્દીને ચાર વચન')} />
          <div className="grid grid-4">
            {values.map((v, i) => {
              const I = v.icon;
              return (
                <div key={v.title} className="step" data-reveal style={delay(i)}>
                  <span className="icon-tile mint"><I size={22} /></span>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <div className="grid grid-2">
            <div className="card" style={{ padding: 28 }} data-reveal>
              <span className="icon-tile"><MapPin size={22} /></span>
              <h3 style={{ marginTop: 16 }}>{t('Serving Modasa and nearby towns', 'મોડાસા અને આસપાસના વિસ્તારો')}</h3>
              <p className="muted" style={{ marginTop: 6 }}>{t('Modasa · Dhansura · Bayad · Malpur · Meghraj · Shamlaji', 'મોડાસા · ધનસુરા · બાયડ · માલપુર · મેઘરજ · શામળાજી')}</p>
              <p style={{ marginTop: 12, color: 'var(--text-body)' }}>{lang === 'en' ? HOSPITAL_INFO.address.full : HOSPITAL_INFO.addressGujarati.full}</p>
            </div>
            <div className="card" style={{ padding: 28, background: 'var(--mint-soft)', borderColor: '#c6e9dc' }} data-reveal>
              <span className="icon-tile mint" style={{ background: '#fff' }}><FileText size={22} /></span>
              <h3 style={{ marginTop: 16 }}>{t('Visit notice', 'મુલાકાતી સૂચના')}</h3>
              <p style={{ marginTop: 6, color: 'var(--mint-deep)' }}>{HOSPITAL_INFO.noticeEnglish}</p>
              <p className="gujarati-text" style={{ marginTop: 4, color: 'var(--mint-deep)' }}>{HOSPITAL_INFO.noticeGujarati}</p>
              <Link to="book-appointment" className="btn btn-primary" style={{ marginTop: 18 }}><Calendar size={16} /> {t('Book a slot', 'સ્લોટ બુક કરો')}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
