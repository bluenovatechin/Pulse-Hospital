import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, Siren } from 'lucide-react';
import { Avatar } from './ui';
import { DOCTOR_TYPES, HOSPITAL_INFO } from '../data/hospitalContent';

export default function DoctorCard({ doctor, onBook, onOpenProfile, lang = 'en', compact = false }) {
  const isResident = doctor.type === 'resident';
  const t = (en, gu) => (lang === 'en' ? en : gu);

  return (
    <article className="card card-hover doctor-card">
      <div className="head">
        <Avatar doctor={doctor} />
        <div style={{ minWidth: 0 }}>
          <span className={`type-tag ${doctor.type}`}>{t(DOCTOR_TYPES[doctor.type].label, DOCTOR_TYPES[doctor.type].labelGu)}</span>
          <h3>{lang === 'en' ? doctor.name : doctor.nameGujarati}</h3>
          <div className="qual">{doctor.qualification} · {doctor.experience}</div>
        </div>
      </div>

      <div className="role">{doctor.designation}</div>

      <div>
        <div className="eyebrow" style={{ fontSize: 11, marginBottom: 8 }}>{t('What they do', 'તેઓ શું કરે છે')}</div>
        <ul className="does">
          {doctor.whatTheyDo.slice(0, compact ? 3 : 4).map((item) => (
            <li key={item}><CheckCircle2 size={15} /> <span>{item}</span></li>
          ))}
        </ul>
      </div>

      <div className="meta">
        <span><Clock size={14} /> {doctor.timing}</span>
        <span><MapPin size={14} /> {doctor.room}{!isResident && ` · ${lang === 'en' ? doctor.hospital : doctor.hospitalGujarati}`}</span>
      </div>

      <div className="actions">
        <button className="btn-secondary btn-sm" onClick={() => onOpenProfile(doctor.id)}>
          {t('View profile', 'પ્રોફાઇલ જુઓ')}
        </button>
        {isResident ? (
          <a className="btn btn-sm btn-emergency" href={HOSPITAL_INFO.phoneHref}>
            <Siren size={15} /> {t('Emergency', 'ઇમરજન્સી')}
          </a>
        ) : (
          <button className="btn-primary btn-sm" onClick={() => onBook(doctor.id)}>
            <Calendar size={15} /> {t('Book slot', 'સ્લોટ બુક કરો')}
          </button>
        )}
      </div>
    </article>
  );
}
