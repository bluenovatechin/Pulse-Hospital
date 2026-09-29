// ========================================================
// Slide-in detail panels for a facility and a doctor
// ========================================================
import React from 'react';
import { CheckCircle2, Calendar, Phone, Clock, MapPin, Building2, Users, Info, Siren } from 'lucide-react';
import { Drawer, Media, Avatar, Icon } from './ui';
import {
  HOSPITAL_INFO, DOCTOR_TYPES, FACILITY_CATEGORIES, DEPARTMENTS, FACILITIES, getDoctor
} from '../data/hospitalContent';

export function FacilityDrawer({ facility, onClose, onBook, onOpenDoctor, lang = 'en' }) {
  const cat = FACILITY_CATEGORIES.find((c) => c.id === facility.category);
  const doctors = facility.doctorIds.map(getDoctor).filter(Boolean);
  const departments = DEPARTMENTS.filter((d) => d.facilityIds.includes(facility.id));
  const isEmergency = facility.id === 'emergency';

  return (
    <Drawer onClose={onClose} label={facility.name}>
      <Media photo={facility.photo} icon={facility.icon} alt={facility.name} className="drawer-media" iconSize={72} />

      <div className="drawer-body">
        <div>
          <div className="row" style={{ gap: 8 }}>
            <span className="chip chip-mint">{cat?.label}</span>
            {facility.is24x7 ? <span className="chip chip-blue"><span className="live-dot" /> Open 24x7</span> : <span className="chip">OPD hours</span>}
          </div>
          <h2 style={{ marginTop: 12 }}>{lang === 'en' ? facility.name : facility.nameGu}</h2>
          <div className="gujarati-text muted" style={{ fontSize: 14, marginTop: 2 }}>{lang === 'en' ? facility.nameGu : facility.name}</div>
        </div>

        <p className="lede">{facility.summary}</p>

        <div>
          <h4>What's included</h4>
          <ul className="tick-list">
            {facility.includes.map((i) => <li key={i}><CheckCircle2 size={17} /> <span>{i}</span></li>)}
          </ul>
        </div>

        <div className="callout">
          <Info size={18} />
          <span><strong>Who it's for: </strong>{facility.goodFor}</span>
        </div>

        {doctors.length > 0 && (
          <div>
            <h4>Doctors who work here</h4>
            <div className="mini-docs">
              {doctors.map((d) => (
                <button key={d.id} className="mini-doc" onClick={() => onOpenDoctor(d.id)}>
                  <Avatar doctor={d} /> {d.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {departments.length > 0 && (
          <div>
            <h4>Used by these departments</h4>
            <div className="tag-cloud">
              {departments.map((d) => <span key={d.id} className="chip"><Icon name={d.icon} size={13} /> {d.title}</span>)}
            </div>
          </div>
        )}
      </div>

      <div className="drawer-foot">
        {isEmergency || facility.is24x7 ? (
          <a className="btn btn-emergency" href={HOSPITAL_INFO.phoneHref}><Phone size={16} /> Call now</a>
        ) : null}
        {!isEmergency && (
          <button className="btn-primary" onClick={() => onBook(null)}><Calendar size={16} /> Book a consultation</button>
        )}
      </div>
    </Drawer>
  );
}

export function DoctorDrawer({ doctor, onClose, onBook, onOpenFacility, lang = 'en' }) {
  const isResident = doctor.type === 'resident';
  const departments = DEPARTMENTS.filter((d) => doctor.departmentIds.includes(d.id));
  const facilities = FACILITIES.filter((f) => f.doctorIds.includes(doctor.id));

  return (
    <Drawer onClose={onClose} label={doctor.name}>
      <div className="art" style={{ padding: '40px 26px 28px', justifyContent: 'flex-start', alignItems: 'flex-end', flexShrink: 0 }}>
        <div className="row" style={{ position: 'relative', gap: 18 }}>
          <Avatar doctor={doctor} size="lg" />
          <div>
            <span className="chip chip-dark">{DOCTOR_TYPES[doctor.type].label}</span>
            <h2 style={{ color: '#fff', fontSize: 24, marginTop: 8 }}>{lang === 'en' ? doctor.name : doctor.nameGujarati}</h2>
            <div style={{ color: 'var(--primary-light)', fontWeight: 700, fontSize: 14 }}>{doctor.qualification} · {doctor.experience}</div>
          </div>
        </div>
      </div>

      <div className="drawer-body">
        <div>
          <div style={{ fontWeight: 700, color: 'var(--brand-navy)' }}>{doctor.designation}</div>
          <p className="lede" style={{ marginTop: 8 }}>{doctor.bio}</p>
        </div>

        <div>
          <h4>What they do</h4>
          <ul className="tick-list">
            {doctor.whatTheyDo.map((i) => <li key={i}><CheckCircle2 size={17} /> <span>{i}</span></li>)}
          </ul>
        </div>

        <div className="info-grid">
          <div className="info-cell"><small><Clock size={11} /> Timings</small><strong>{doctor.timing}</strong></div>
          <div className="info-cell"><small><MapPin size={11} /> Where to find</small><strong>{doctor.room}</strong></div>
          <div className="info-cell"><small><Building2 size={11} /> Affiliated hospital</small><strong>{doctor.hospital}</strong></div>
          <div className="info-cell"><small><Phone size={11} /> Direct line</small><strong>{doctor.mobileFormatted}</strong></div>
        </div>

        <div>
          <h4>Specialties</h4>
          <div className="tag-cloud">{doctor.specialties.map((s) => <span key={s} className="chip chip-blue">{s}</span>)}</div>
        </div>

        {departments.length > 0 && (
          <div>
            <h4>Departments</h4>
            <div className="tag-cloud">
              {departments.map((d) => <span key={d.id} className="chip"><Icon name={d.icon} size={13} /> {d.title}</span>)}
            </div>
          </div>
        )}

        {facilities.length > 0 && (
          <div>
            <h4>Facilities they use</h4>
            <div className="tag-cloud">
              {facilities.map((f) => (
                <button key={f.id} className="chip chip-mint" style={{ border: 'none' }} onClick={() => onOpenFacility(f.id)}>
                  <Icon name={f.icon} size={13} /> {f.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {isResident && (
          <div className="callout blue">
            <Users size={18} />
            <span>Resident doctors are based in Emergency and the ICU around the clock. In an emergency you don't need an appointment — come straight in or call.</span>
          </div>
        )}
      </div>

      <div className="drawer-foot">
        {isResident && (
          <a className="btn btn-emergency" href={HOSPITAL_INFO.phoneHref}><Siren size={16} /> Call emergency</a>
        )}
        <button className={isResident ? 'btn-secondary' : 'btn-primary'} onClick={() => onBook(doctor.id)}>
          <Calendar size={16} /> {isResident ? 'Book a slot' : `Book with ${doctor.name.split(' ').slice(0, 2).join(' ')}`}
        </button>
      </div>
    </Drawer>
  );
}
