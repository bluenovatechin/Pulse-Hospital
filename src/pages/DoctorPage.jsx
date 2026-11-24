import React from 'react';
import {
  Calendar, Phone, Clock, MapPin, CheckCircle2, ArrowRight, ChevronRight, Activity,
  Stethoscope, GraduationCap, ShieldCheck, Award, HeartPulse, Building2
} from 'lucide-react';
import { Icon, SectionHead, WhatsAppIcon, delay } from '../components/ui';
import DoctorMini from '../components/DoctorMini';
import Slider from '../components/Slider';
import { Link } from '../router';
import { DOCTORS, DOCTOR_TYPES, DEPARTMENTS, FACILITIES, HOSPITAL_INFO } from '../data/hospitalContent';
import { departmentLink, facilityLink } from '../data/siteStructure';

const unique = (list) => [...new Set(list.filter(Boolean))];

/** Big portrait, or a branded monogram panel until the photo is added */
function DoctorPortrait({ d, badge }) {
  const [failed, setFailed] = React.useState(false);
  const [c1, c2] = d.colors || [];
  const showPhoto = d.photo && !failed;
  return (
    <div className={`docp-photo ${showPhoto ? 'has-photo' : ''}`} style={{ '--av1': c1, '--av2': c2 }}>
      {showPhoto ? (
        <img src={d.photo} alt={`${d.name}${d.qualification ? `, ${d.qualification}` : ''}, ${d.designation}, Pulse Hospital & I.C.U, Modasa`} onError={() => setFailed(true)} fetchPriority="high" />
      ) : (
        <div className="docp-monogram" aria-hidden="true">
          <Stethoscope className="docp-monogram-icon" strokeWidth={1.1} />
          <span>{d.initials}</span>
        </div>
      )}
      {badge && (
        <span className="docp-badge"><Activity size={15} /> {badge}</span>
      )}
    </div>
  );
}

// Full profile page for one doctor: /doctors/<slug>
export default function DoctorPage({ doctor: d, lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const gu = lang === 'gu';
  const name = gu ? d.nameGujarati : d.name;
  const isResident = d.type === 'resident';
  const departments = DEPARTMENTS.filter((x) => d.departmentIds.includes(x.id));
  const facilities = FACILITIES.filter((f) => f.doctorIds.includes(d.id));
  const others = DOCTORS.filter((x) => x.id !== d.id);
  const specialties = gu && d.specialtiesGujarati ? d.specialtiesGujarati : d.specialties;
  const designation = t(d.designation, d.designationGujarati || d.designation);
  const bio = t(d.bio, d.bioGujarati || d.bio);
  const badge = departments[0] ? (gu ? departments[0].titleGujarati : departments[0].title) : specialties[0];

  // What the doctor treats: their own list first, then their departments' conditions
  const treatments = gu
    ? unique(d.whatTheyDoGujarati || d.whatTheyDo)
    : unique([...d.whatTheyDo, ...departments.flatMap((x) => x.conditions)]).slice(0, 9);

  // Training & experience, built only from facts on record
  const training = [
    d.qualification && (d.medicalCollege
      ? `${d.qualification} – ${t(d.medicalCollege, d.medicalCollegeGujarati || d.medicalCollege)}`
      : d.qualification),
    d.gmcNumber && t(`Gujarat Medical Council Reg. No. ${d.gmcNumber}`, `ગુજરાત મેડિકલ કાઉન્સિલ રજી. નં. ${d.gmcNumber}`),
    d.experience && t(`${d.experience} of clinical experience`, `${d.experienceGujarati || d.experience} નો તબીબી અનુભવ`),
    t(`${d.designation} at Pulse Hospital & I.C.U, Modasa`, `પલ્સ હોસ્પિટલ & આઈ.સી.યુ., મોડાસા ખાતે ${designation}`),
    !isResident && d.hospital && t(`Also consults at ${d.hospital}`, `${d.hospitalGujarati || d.hospital} ખાતે પણ સેવા આપે છે`)
  ].filter(Boolean);

  const waText = encodeURIComponent(`Hello Pulse Hospital, I would like a consultation with ${d.name}.`);
  const whatsapp = `https://wa.me/${HOSPITAL_INFO.whatsappNumber}?text=${waText}`;

  return (
    <div className="docp">
      {/* ---------- Profile hero ---------- */}
      <section className="docp-hero-wrap">
        <div className="container-wide">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="home">{t('Home', 'મુખ્ય પૃષ્ઠ')}</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link to="doctors">{t('Doctors', 'ડૉક્ટરો')}</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">{name}</span>
          </nav>

          <div className="docp-hero page-enter">
            <DoctorPortrait d={d} badge={badge} />

            <div className="docp-info">
              <span className={`docp-type ${d.type}`}>{t(DOCTOR_TYPES[d.type].label, DOCTOR_TYPES[d.type].labelGu)}</span>
              <h1 className="docp-name">{name}</h1>
              {gu && <span className="docp-name-alt">{d.name}</span>}
              <p className="docp-qual">{d.qualification || designation}</p>
              {d.qualification && <p className="docp-role">{designation}</p>}

              <div className="docp-panel">
                <h2 className="docp-panel-title"><Stethoscope size={17} /> {t('Professional background', 'વ્યાવસાયિક પરિચય')}</h2>
                <p className="docp-bio">{bio}</p>
                {!gu && d.bioGujarati && <p className="docp-bio-gu gujarati-text">{d.bioGujarati}</p>}

                <div className="docp-mini-grid">
                  <div className="docp-mini">
                    <span className="docp-mini-icon"><GraduationCap size={18} /></span>
                    <div>
                      <small>{t('Clinical experience', 'તબીબી અનુભવ')}</small>
                      <strong>{t(d.experience, d.experienceGujarati || d.experience)}</strong>
                      <span>{d.qualification ? `${d.qualification} · ` : ''}{t('Pulse Hospital & ICU', 'પલ્સ હોસ્પિટલ & ICU')}</span>
                    </div>
                  </div>
                  <div className="docp-mini">
                    <span className="docp-mini-icon"><ShieldCheck size={18} /></span>
                    <div>
                      <small>{t('Specialist care', 'વિશેષ સારવાર')}</small>
                      <strong>{specialties.slice(0, 2).join(' & ')}</strong>
                      {!gu && d.specialtiesGujarati && <span className="gujarati-text">{d.specialtiesGujarati.slice(0, 2).join(' અને ')}</span>}
                    </div>
                  </div>
                </div>

                <div className="docp-focus">
                  <span className="docp-focus-label">{t('Key focus', 'મુખ્ય ધ્યાન')}:</span>
                  {specialties.map((s, i) => (
                    <span className="docp-chip" key={s}>
                      {[<Activity key="a" size={14} />, <HeartPulse key="h" size={14} />, <ShieldCheck key="s" size={14} />][i % 3]} {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="docp-timing">
                <Clock size={18} />
                <span>
                  <strong>{isResident ? t('Availability', 'ઉપલબ્ધતા') : t('OPD consultation', 'OPD કન્સલ્ટેશન')}:</strong>{' '}
                  {t(d.timing, d.timingGujarati || d.timing)}
                  {' · '}<strong>{t('Emergency', 'ઇમરજન્સી')}:</strong> {t('24x7 available', '૨૪ કલાક ઉપલબ્ધ')}
                </span>
              </div>
              <div className="docp-where">
                <MapPin size={16} /> {t(d.room, d.roomGujarati || d.room)}, {t('4th floor, City Centre, Shamlaji Road, Modasa', '૪થો માળ, સીટી સેન્ટર, શામળાજી રોડ, મોડાસા')}
              </div>

              <div className="docp-actions">
                <Link to="book-appointment" param={d.slug} className="btn btn-primary btn-lg docp-book">
                  <Calendar size={18} /> {t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
                </Link>
                <a className="btn btn-lg docp-call" href={HOSPITAL_INFO.phoneHref}>
                  <Phone size={18} /> {t('Call OPD', 'OPD કૉલ')} · {HOSPITAL_INFO.appointmentNumber}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Training & experience ---------- */}
      <section className="docp-section">
        <div className="container-wide">
          <div className="docp-card" data-reveal>
            <span className="docp-eyebrow violet">{t('Qualifications & training', 'લાયકાત અને તાલીમ')}</span>
            <h2 className="docp-h2"><Award size={26} /> {t('Clinical training & experience', 'તબીબી તાલીમ અને અનુભવ')}</h2>
            <p className="docp-sub gujarati-text">અદ્યતન સારવાર અને નિષ્ણાત તબીબી અનુભવ સાથે દર્દી-કેન્દ્રિત સેવા.</p>
            <ul className="docp-list cols-2">
              {training.map((item, i) => (
                <li key={item} style={delay(i, 40)} data-reveal><CheckCircle2 size={20} /> <span>{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Treatments ---------- */}
      <section className="docp-section">
        <div className="container-wide">
          <div className="docp-card" data-reveal>
            <span className="docp-eyebrow">{t('Specialised care', 'વિશેષ સારવાર')}</span>
            <h2 className="docp-h2"><Stethoscope size={26} /> {t('Key treatments & clinical care', 'મુખ્ય સારવાર અને તબીબી સેવાઓ')}</h2>
            <p className="docp-sub gujarati-text">એકીકૃત અભિગમ દ્વારા દર્દીને શ્રેષ્ઠ અને સંપૂર્ણ સારવાર.</p>
            <ul className="docp-list cols-3 bullets">
              {treatments.map((item, i) => (
                <li key={item} style={delay(i, 40)} data-reveal><span className="docp-dot" aria-hidden="true" /> <span>{item}</span></li>
              ))}
            </ul>

            {(departments.length > 0 || facilities.length > 0) && (
              <div className="docp-where-list">
                <span className="docp-focus-label">{t('Works in', 'સેવા વિભાગો')}:</span>
                {departments.map((x) => (
                  <Link key={x.id} {...departmentLink(x.id)} className="docp-chip link">
                    <Icon name={x.icon} size={14} /> {gu ? x.titleGujarati : x.title}
                  </Link>
                ))}
                {facilities.map((f) => (
                  <Link key={f.id} {...facilityLink(f.id)} className="docp-chip link">
                    <Building2 size={14} /> {gu ? f.nameGu : f.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Consultation band ---------- */}
      <section className="docp-section is-last">
        <div className="container-wide">
          <div className="docp-cta" data-reveal>
            <div>
              <span className="docp-cta-eyebrow"><MapPin size={15} /> {t('Pulse Hospital & I.C.U, Modasa', 'પલ્સ હોસ્પિટલ & આઈ.સી.યુ., મોડાસા')}</span>
              <h2>{t(`Need a consultation with ${d.name}?`, `${d.nameGujarati} ની સલાહ લેવી છે?`)}</h2>
              <p className="gujarati-text docp-cta-gu">સલાહ અને સારવાર માટે સીધો સંપર્ક કરો</p>
              <p>{t('Visit us on the 4th floor, City Centre, Shamlaji Road, Modasa, or message the desk to book a slot.', 'સીટી સેન્ટર, શામળાજી રોડ, મોડાસા – ૪થા માળે આવો અથવા સ્લોટ બુક કરવા મેસેજ કરો.')}</p>
            </div>
            <div className="docp-cta-actions">
              <a className="btn btn-lg docp-wa" href={whatsapp} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={18} /> {t('WhatsApp enquiry', 'વોટ્સએપ પૂછપરછ')}
              </a>
              <a className="btn btn-lg btn-ghost-light" href={HOSPITAL_INFO.phoneHref}>
                <Phone size={18} /> {t('Call', 'કૉલ')}: {HOSPITAL_INFO.appointmentNumber}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Other doctors ---------- */}
      <section className="section section--white">
        <div className="container-wide">
          <SectionHead eyebrow={t('Our doctors', 'અમારા ડૉક્ટરો')} title={t('Other doctors at Pulse Hospital', 'પલ્સ હોસ્પિટલના અન્ય ડૉક્ટરો')} />
          <Slider className="doc-row" centred lang={lang} label={t('Other doctors', 'અન્ય ડૉક્ટરો')}>
            {others.map((o) => <DoctorMini key={o.id} doctor={o} lang={lang} />)}
          </Slider>
          <div style={{ marginTop: 24 }}>
            <Link to="doctors" className="btn btn-outline">{t('All doctors & timetable', 'બધા ડૉક્ટરો અને સમયપત્રક')} <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
