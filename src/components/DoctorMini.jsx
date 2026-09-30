import React from 'react';
import { Calendar } from 'lucide-react';
import { Avatar } from './ui';
import { Link } from '../router';
import { DOCTOR_TYPES } from '../data/hospitalContent';

// Compact doctor card: links to the doctor's profile page and to booking
export default function DoctorMini({ doctor: d, lang = 'en', style }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  return (
    <article className="doc-mini" data-reveal style={style}>
      <Link to="doctors" param={d.slug} className="doc-mini-main">
        <Avatar doctor={d} />
        <span className={`type-tag ${d.type}`}>{t(DOCTOR_TYPES[d.type].label, DOCTOR_TYPES[d.type].labelGu)}</span>
        <h3>{lang === 'en' ? d.name : d.nameGujarati}</h3>
        <span className="qual">{d.qualification}</span>
        <span className="role">{t(d.designation, d.designationGujarati || d.designation)}</span>
      </Link>
      <Link to="book-appointment" param={d.slug} className="btn btn-primary btn-sm btn-block">
        <Calendar size={15} /> {t('Book slot', 'સ્લોટ બુક કરો')}
      </Link>
    </article>
  );
}
