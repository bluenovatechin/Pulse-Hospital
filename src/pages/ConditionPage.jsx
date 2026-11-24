import React from 'react';
import { Calendar, Phone, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Info, FileWarning } from 'lucide-react';
import { PageHero, Media, Icon } from '../components/ui';
import DoctorMini from '../components/DoctorMini';
import Slider from '../components/Slider';
import { Link } from '../router';
import { HOSPITAL_INFO, getDoctor, getFacility, getDepartment } from '../data/hospitalContent';
import { CONDITIONS, isPublished } from '../data/conditions';
import { departmentLink, facilityLink } from '../data/siteStructure';

const unique = (list) => [...new Map(list.map((x) => [x.id, x])).values()];

/** Doctors for a condition: its department's doctors plus any extra ones */
export const conditionDoctors = (c) => {
  const dept = getDepartment(c.department);
  return unique([...(dept?.doctorIds || []), ...(c.extraDoctorIds || [])].map(getDoctor).filter(Boolean));
};

// One condition: /conditions/<slug>
export default function ConditionPage({ condition: c, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const gu = lang === 'gu';
  const dept = getDepartment(c.department);
  const doctors = conditionDoctors(c);
  const facilities = c.facilityIds.map(getFacility).filter(Boolean);
  const isEmergency = c.department === 'emergency' || c.slug === 'heart-attack' || c.slug === 'stroke';
  const reviewer = c.review?.by && getDoctor(c.review.by);
  const related = CONDITIONS.filter((x) => x.slug !== c.slug && x.department === c.department && (isPublished(x) || !isPublished(c))).slice(0, 4);
  const bookable = doctors.find((d) => d.type === 'visiting');

  return (
    <div>
      <PageHero
        crumbs={[{ label: t('Health conditions', 'રોગો અને સારવાર'), to: 'conditions' }, { label: gu ? c.nameGu : c.name }]}
        eyebrow={gu ? c.name : c.nameGu}
        title={gu ? c.nameGu : c.name}
        text={gu ? c.summaryGu : c.summary}
        aside={
          <Media icon={dept?.icon || 'HeartPulse'} className="hero-frame hero-art" iconSize={84}>
            <span className="hero-art-label">{gu ? (dept?.titleGujarati || dept?.title) : dept?.title}</span>
          </Media>
        }
        actions={
          <>
            {isEmergency && (
              <a className="btn btn-emergency" href={HOSPITAL_INFO.phoneHref}>
                <Phone size={17} /> {t('Emergency: call now', 'ઇમરજન્સી: હમણાં કૉલ કરો')}
              </a>
            )}
            {bookable ? (
              <Link to="book-appointment" param={bookable.slug} className={`btn ${isEmergency ? 'btn-secondary' : 'btn-primary'}`}>
                <Calendar size={17} /> {t('Book a consultation', 'એપોઇન્ટમેન્ટ બુક કરો')}
              </Link>
            ) : !isEmergency && (
              <a className="btn btn-primary" href={HOSPITAL_INFO.phoneHref}>
                <Phone size={17} /> {t('Call the hospital', 'હોસ્પિટલને કૉલ કરો')}
              </a>
            )}
          </>
        }
      />

      <section className="section">
        <div className="container-wide detail-layout">
          <div className="detail-main">
            {!isPublished(c) && (
              <div className="cond-draft" role="note">
                <FileWarning size={18} />
                <span>
                  <strong>Draft: awaiting medical review.</strong> This page is hidden from search engines and site menus until a Pulse Hospital doctor has reviewed it.
                </span>
              </div>
            )}

            {gu && (
              <p className="callout blue cond-gu-note">
                <Info size={18} />
                <span>આ પાનાની વિગતવાર માહિતી હાલ અંગ્રેજીમાં છે. કોઈ પણ પ્રશ્ન માટે હોસ્પિટલને કૉલ કરો.</span>
              </p>
            )}

            <article className="detail-block" data-reveal>
              <h2>{t(`What are the symptoms of ${c.name.toLowerCase()}?`, 'લક્ષણો')}</h2>
              <ul className="tick-list">
                {c.symptoms.map((s) => <li key={s}><CheckCircle2 size={18} /> <span>{s}</span></li>)}
              </ul>
            </article>

            <article className="cond-warning" data-reveal>
              <h2><AlertTriangle size={20} /> {t('When to go to the emergency room', 'ક્યારે તરત ઇમરજન્સીમાં આવવું')}</h2>
              <ul>
                {c.warning.map((w) => <li key={w}>{w}</li>)}
              </ul>
              <a className="btn btn-emergency" href={HOSPITAL_INFO.phoneHref}>
                <Phone size={16} /> {t('24x7 emergency', '૨૪x૭ ઇમરજન્સી')}: {HOSPITAL_INFO.appointmentNumber}
              </a>
            </article>

            <article className="detail-block" data-reveal>
              <h2>{t('Causes and risk factors', 'કારણો અને જોખમ')}</h2>
              <ul className="tick-list">
                {c.causes.map((s) => <li key={s}><CheckCircle2 size={18} /> <span>{s}</span></li>)}
              </ul>
            </article>

            <article className="detail-block" data-reveal>
              <h2>{t('How it is diagnosed at Pulse Hospital', 'પલ્સ હોસ્પિટલમાં નિદાન')}</h2>
              <ul className="tick-list">
                {c.diagnosis.map((s) => <li key={s}><CheckCircle2 size={18} /> <span>{s}</span></li>)}
              </ul>
            </article>

            <article className="detail-block" data-reveal>
              <h2>{t('Treatment at Pulse Hospital, Modasa', 'પલ્સ હોસ્પિટલ, મોડાસામાં સારવાર')}</h2>
              <p>{c.treatment}</p>
            </article>

            <article className="detail-block" data-reveal>
              <h2>{t('Prevention', 'બચાવ')}</h2>
              <ul className="tick-list">
                {c.prevention.map((s) => <li key={s}><ShieldCheck size={18} /> <span>{s}</span></li>)}
              </ul>
            </article>

            <article className="detail-block cond-faq" data-reveal>
              <h2>{t('Questions patients ask', 'દર્દીઓના પ્રશ્નો')}</h2>
              {c.faqs.map((f) => (
                <div key={f.q} className="cond-qa">
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </article>

            {doctors.length > 0 && (
              <article className="detail-block" data-reveal>
                <h2>{t('Doctors who treat it', 'સારવાર કરતા ડૉક્ટરો')}</h2>
                <Slider className="doc-row doc-row--compact" centred lang={lang} label={t('Doctors', 'ડૉક્ટરો')}>
                  {doctors.map((d) => <DoctorMini key={d.id} doctor={d} lang={lang} />)}
                </Slider>
              </article>
            )}

            <p className="cond-disclaimer">
              {reviewer
                ? <>{t('Medically reviewed by', 'તબીબી સમીક્ષા:')} <Link to="doctors" param={reviewer.slug}>{reviewer.name}</Link>{reviewer.qualification ? `, ${reviewer.qualification}` : ''}{c.review.date ? ` · ${c.review.date}` : ''}. </>
                : null}
              {t(
                'This page is general information, not a diagnosis. Please see a doctor for advice about your own health.',
                'આ સામાન્ય માહિતી છે, નિદાન નથી. તમારા સ્વાસ્થ્ય માટે ડૉક્ટરની સલાહ લો.'
              )}
            </p>
          </div>

          <aside className="detail-side">
            {dept && (
              <div className="side-group" data-reveal>
                <h3>{t('Department', 'વિભાગ')}</h3>
                <ul className="link-list">
                  <li>
                    <Link {...departmentLink(dept.id)}>
                      <Icon name={dept.icon} size={18} /> {gu ? (dept.titleGujarati || dept.title) : dept.title} <ArrowRight size={15} />
                    </Link>
                  </li>
                </ul>
              </div>
            )}
            {facilities.length > 0 && (
              <div className="side-group" data-reveal>
                <h3>{t('Facilities used', 'ઉપયોગમાં લેવાતી સુવિધાઓ')}</h3>
                <ul className="link-list">
                  {facilities.map((f) => (
                    <li key={f.id}>
                      <Link {...facilityLink(f.id)}>
                        <Icon name={f.icon} size={18} /> {gu ? f.nameGu : f.name} <ArrowRight size={15} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {related.length > 0 && (
              <div className="side-group" data-reveal>
                <h3>{t('Related conditions', 'સંબંધિત રોગો')}</h3>
                <ul className="link-list">
                  {related.map((x) => (
                    <li key={x.slug}>
                      <Link to="conditions" param={x.slug}>{gu ? x.nameGu : x.name} <ArrowRight size={15} /></Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="side-group" data-reveal>
              <h3>{t('Visit', 'મુલાકાત')}</h3>
              <p className="muted">{gu ? HOSPITAL_INFO.addressGujarati.full : HOSPITAL_INFO.address.full}</p>
              <p style={{ marginTop: 8 }}><a href={HOSPITAL_INFO.phoneHref}><strong>{HOSPITAL_INFO.appointmentNumber}</strong></a></p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
