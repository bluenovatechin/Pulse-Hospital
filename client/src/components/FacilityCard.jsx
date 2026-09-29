import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Media } from './ui';
import { FACILITY_CATEGORIES } from '../data/hospitalContent';

export default function FacilityCard({ facility, onOpen, lang = 'en' }) {
  const cat = FACILITY_CATEGORIES.find((c) => c.id === facility.category);

  return (
    <button className="card card-hover facility-card" onClick={() => onOpen(facility.id)} aria-label={`${facility.name} — details`}>
      <Media photo={facility.photo} icon={facility.icon} alt={facility.name} className="media">
        <span className={`avail ${facility.is24x7 ? 'is-24' : ''}`}>
          {facility.is24x7 ? <><span className="live-dot" /> Open 24x7</> : 'OPD hours'}
        </span>
      </Media>
      <div className="body">
        <span className="cat">{lang === 'en' ? cat?.label : cat?.labelGu}</span>
        <h3>{lang === 'en' ? facility.name : facility.nameGu}</h3>
        <p>{facility.summary}</p>
        <span className="link-arrow more">
          {lang === 'en' ? "What's included" : 'વિગત જુઓ'} <ArrowRight size={15} />
        </span>
      </div>
    </button>
  );
}
