import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Media } from './ui';
import { Link } from '../router';
import { FACILITY_CATEGORIES, getFacility } from '../data/hospitalContent';
import { FACILITY_PAGES, facilityLink } from '../data/siteStructure';

export default function FacilityCard({ facility, lang = 'en' }) {
  const cat = FACILITY_CATEGORIES.find((c) => c.id === facility.category);
  const also = (FACILITY_PAGES[facility.id] || []).map(getFacility).filter(Boolean);

  return (
    <Link {...facilityLink(facility.id)} className="card card-hover facility-card">
      <Media photo={facility.photo} icon={facility.icon} alt={facility.name} className="media">
        <span className={`avail ${facility.is24x7 ? 'is-24' : ''}`}>
          {facility.is24x7 ? (
            <><span className="live-dot" /> {lang === 'en' ? 'Open 24x7' : '૨૪x૭ ઉપલબ્ધ'}</>
          ) : (
            lang === 'en' ? 'OPD hours' : 'OPD સમય'
          )}
        </span>
      </Media>
      <div className="body">
        <span className="cat">{lang === 'en' ? cat?.label : cat?.labelGu}</span>
        <h3>{lang === 'en' ? facility.name : facility.nameGu}</h3>
        <p>{lang === 'en' ? facility.summary : (facility.summaryGu || facility.summary)}</p>
        {also.length > 0 && (
          <span className="fc-also">
            {lang === 'en' ? 'Also: ' : 'સાથે: '}{also.map((m) => (lang === 'en' ? m.name : m.nameGu)).join(' · ')}
          </span>
        )}
        <span className="link-arrow more">
          {lang === 'en' ? "What's included" : 'વિગત જુઓ'} <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}
