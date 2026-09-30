import React from 'react';
import { MapPin, Clock, HeartPulse, ShieldCheck, Users, FileText, Calendar, ArrowRight, Phone } from 'lucide-react';
import { PageHero, SectionHead, delay } from '../components/ui';
import { HOSPITAL_INFO, PHOTOS } from '../data/hospitalContent';

export default function AboutPage({ onNavigate, onBook, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);

  const values = [
    { icon: Clock, title: t('Always open', 'હંમેશા ખુલ્લું'), text: t('Emergency, ICU, lab, pharmacy and dialysis never close, including at night and on Sundays.', 'ઇમરજન્સી, ICU, લેબ, ફાર્મસી અને ડાયાલીસીસ ક્યારેય બંધ નથી.') },
    { icon: HeartPulse, title: t('Critical care nearby', 'નજીકમાં ક્રિટિકલ કેર'), text: t('Ventilators, CT and dialysis in Modasa, so families don’t have to travel 100+ km in a crisis.', 'વેન્ટીલેટર, CT અને ડાયાલીસીસ મોડાસામાં જ.') },
    { icon: Users, title: t('Senior doctors', 'અનુભવી ડૉક્ટરો'), text: t('Experienced MD physicians and a chest specialist, with resident doctors in the ICU around the clock.', 'અનુભવી એમ.ડી. ફિઝિશિયન અને ૨૪ કલાક રેસિડેન્ટ ડૉક્ટરો.') },
    { icon: ShieldCheck, title: t('Safe, clean spaces', 'સ્વચ્છ અને સુરક્ષિત'), text: t('Laminar-airflow theatres, an isolation ICU and strict infection control.', 'લેમિનાર એરફ્લો OT, આઈસોલેશન ICU અને ચેપ નિયંત્રણ.') }
  ];

  return (
    <div>
      <PageHero
        photo={PHOTOS.reception}
        crumbs={t('About', 'અમારા વિશે')}
        onHome={() => onNavigate('home')}
        eyebrow={t('About Pulse Hospital & I.C.U', 'પલ્સ હોસ્પિટલ & આઈ.સી.યુ. વિશે')}
        eyebrowIcon={<HeartPulse size={14} />}
        title={t('Emergency and critical care for Arvalli', 'અરવલ્લી માટે ઇમરજન્સી અને ક્રિટિકલ કેર')}
        text={t('Pulse Hospital & I.C.U was set up on the 4th floor of City Centre, Shamlaji Road, to bring tertiary critical care to Modasa and the villages around it.', 'મોડાસા અને આસપાસના ગ્રામ્ય વિસ્તારો માટે ઉચ્ચ સ્તરીય ક્રિટિકલ કેર અને નિષ્ણાત તબીબોની સેવા.')}
        cardTitle={t('Institution Profile & Credentials', 'સંસ્થા પરિચય અને સિદ્ધિઓ')}
        cardBadge={t('Caring For Life', 'જીવનની કાળજી')}
        cardIcon={<ShieldCheck size={18} />}
        stats={[
          { value: '24x7', label: t('Emergency Cover', 'ઇમરજન્સી કવરેજ'), sub: t('Always open 365 days', 'હંમેશા ખુલ્લું') },
          { value: '4th Floor', label: t('City Centre Modasa', 'સિટી સેન્ટર મોડાસા'), sub: t('Shamlaji Road', 'શામળાજી રોડ') },
          { value: '16 Beds', label: t('ICU Life Support', 'ICU લાઈફ સપોર્ટ'), sub: t('Ventilator monitored', 'વેન્ટિલેટર સજ્જ') },
          { value: '100%', label: t('Local Critical Care', 'સ્થાનિક સારવાર'), sub: t('Arvalli & Sabarkantha', 'અરવલ્લી & સાબરકાંઠા') }
        ]}
        highlights={[
          t('Built to eliminate hazardous 100+ km emergency journeys to Ahmedabad', 'કટોકટીમાં અમદાવાદ દોડવાની લાચારી દૂર કરવાનો અડગ સંકલ્પ'),
          t('Experienced critical-care consultants & round-the-clock ICU nurses', 'અનુભવી ક્રિટિકલ કેર ડોક્ટરો અને ૨૪ કલાક પ્રશિક્ષિત નર્સિંગ સ્ટાફ'),
          t('Transparent medical care with digital billing & appointment slips', 'પારદર્શક સારવાર અને ડિજિટલ સ્લિપ સુવિધા')
        ]}
        actions={
          <>
            <a className="btn btn-primary" href={HOSPITAL_INFO.phoneHref}>
              <Phone size={17} /> {t('Call Hospital', 'સંપર્ક કરો')}
            </a>
            <a className="btn btn-ghost-light" href={HOSPITAL_INFO.mapsUrl} target="_blank" rel="noreferrer">
              <MapPin size={17} /> {t('Find On Map', 'નકશો જુઓ')}
            </a>
          </>
        }
      />

      <section className="section">
        <div className="container-wide">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: 48 }}>
            <div data-reveal>
              <span className="eyebrow">{t('Our story', 'અમારી વાત')}</span>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', margin: '10px 0 16px' }}>{t('Caring for life, in every moment', 'જીવનની સુરક્ષા આપણી પ્રાથમિકતા')}</h2>
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
                <button className="btn-primary" onClick={() => onNavigate('facilities')}>{t('See our facilities', 'સુવિધાઓ જુઓ')} <ArrowRight size={16} /></button>
                <button className="btn-secondary" onClick={() => onNavigate('doctors')}>{t('Meet the doctors', 'ડૉક્ટરોને મળો')}</button>
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
                  <h4>{v.title}</h4>
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
              <button className="btn-primary" style={{ marginTop: 18 }} onClick={() => onBook(null)}><Calendar size={16} /> {t('Book a slot', 'સ્લોટ બુક કરો')}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
