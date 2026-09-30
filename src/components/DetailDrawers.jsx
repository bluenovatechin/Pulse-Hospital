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
            <span className="chip chip-mint">{lang === 'en' ? cat?.label : cat?.labelGu}</span>
            {facility.is24x7 ? (
              <span className="chip chip-blue"><span className="live-dot" /> {lang === 'en' ? 'Open 24x7' : '૨૪x૭ ઉપલબ્ધ'}</span>
            ) : (
              <span className="chip">{lang === 'en' ? 'OPD hours' : 'OPD સમય'}</span>
            )}
          </div>
          <h2 style={{ marginTop: 12 }}>{lang === 'en' ? facility.name : facility.nameGu}</h2>
          <div className="gujarati-text muted" style={{ fontSize: 14, marginTop: 2 }}>
            {lang === 'en' ? facility.nameGu : facility.name}
          </div>
        </div>

        <p className="lede">{facility.summary}</p>

        <div>
          <h4>{lang === 'en' ? "What's included" : "શું સમાવિષ્ટ છે"}</h4>
          <ul className="tick-list">
            {facility.includes.map((i) => <li key={i}><CheckCircle2 size={17} /> <span>{i}</span></li>)}
          </ul>
        </div>

        <div className="callout">
          <Info size={18} />
          <span><strong>{lang === 'en' ? "Who it's for: " : "કોના માટે ઉપયોગી: "}</strong>{facility.goodFor}</span>
        </div>

        {doctors.length > 0 && (
          <div>
            <h4>{lang === 'en' ? "Doctors who work here" : "અહીં કાર્યરત તબીબો"}</h4>
            <div className="mini-docs">
              {doctors.map((d) => (
                <button key={d.id} className="mini-doc" onClick={() => onOpenDoctor(d.id)}>
                  <Avatar doctor={d} /> {lang === 'en' ? d.name : d.nameGujarati}
                </button>
              ))}
            </div>
          </div>
        )}

        {departments.length > 0 && (
          <div>
            <h4>{lang === 'en' ? "Used by these departments" : "સંલગ્ન વિભાગો"}</h4>
            <div className="tag-cloud">
              {departments.map((d) => (
                <span key={d.id} className="chip">
                  <Icon name={d.icon} size={13} /> {lang === 'en' ? d.title : (d.titleGu || d.title)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="drawer-foot">
        {isEmergency || facility.is24x7 ? (
          <a className="btn btn-emergency" href={HOSPITAL_INFO.phoneHref}>
            <Phone size={16} /> {lang === 'en' ? "Call now" : "હમણાં કૉલ કરો"}
          </a>
        ) : null}
        {!isEmergency && (
          <button className="btn-primary" onClick={() => onBook(null)}>
            <Calendar size={16} /> {lang === 'en' ? "Book a consultation" : "એપોઇન્ટમેન્ટ બુક કરો"}
          </button>
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
    <Drawer onClose={onClose} label={lang === 'en' ? doctor.name : doctor.nameGujarati}>
      <div className="art" style={{ padding: '40px 26px 28px', justifyContent: 'flex-start', alignItems: 'flex-end', flexShrink: 0 }}>
        <div className="row" style={{ position: 'relative', gap: 18 }}>
          <Avatar doctor={doctor} size="lg" />
          <div>
            <span className="chip chip-dark">
              {lang === 'en' ? DOCTOR_TYPES[doctor.type].label : DOCTOR_TYPES[doctor.type].labelGu}
            </span>
            <h2 style={{ color: '#fff', fontSize: 24, marginTop: 8 }}>{lang === 'en' ? doctor.name : doctor.nameGujarati}</h2>
            <div style={{ color: 'var(--primary-light)', fontWeight: 700, fontSize: 14 }}>
              {doctor.qualification} · {lang === 'en' ? doctor.experience : (doctor.experienceGujarati || doctor.experience)}
            </div>
          </div>
        </div>
      </div>

      <div className="drawer-body">
        <div>
          <div style={{ fontWeight: 700, color: 'var(--brand-navy)' }}>
            {lang === 'en' ? doctor.designation : (doctor.designationGujarati || doctor.designation)}
          </div>
          <p className="lede" style={{ marginTop: 8 }}>
            {lang === 'en' ? doctor.bio : (doctor.bioGujarati || doctor.bio)}
          </p>
        </div>

        <div>
          <h4>{lang === 'en' ? "What they do" : "તેઓ શું કરે છે"}</h4>
          <ul className="tick-list">
            {(lang === 'gu' && doctor.whatTheyDoGujarati ? doctor.whatTheyDoGujarati : doctor.whatTheyDo).map((i) => (
              <li key={i}><CheckCircle2 size={17} /> <span>{i}</span></li>
            ))}
          </ul>
        </div>

        <div className="info-grid">
          <div className="info-cell">
            <small><Clock size={11} /> {lang === 'en' ? "Timings" : "સમય"}</small>
            <strong>{lang === 'en' ? doctor.timing : (doctor.timingGujarati || doctor.timing)}</strong>
          </div>
          <div className="info-cell">
            <small><MapPin size={11} /> {lang === 'en' ? "Where to find" : "ક્યાં મળવું"}</small>
            <strong>{lang === 'en' ? doctor.room : (doctor.roomGujarati || doctor.room)}</strong>
          </div>
          <div className="info-cell">
            <small><Building2 size={11} /> {lang === 'en' ? "Affiliated hospital" : "મુખ્ય હોસ્પિટલ"}</small>
            <strong>{lang === 'en' ? doctor.hospital : (doctor.hospitalGujarati || doctor.hospital)}</strong>
          </div>
          <div className="info-cell">
            <small><Phone size={11} /> {lang === 'en' ? "Direct line" : "સીધો સંપર્ક નંબર"}</small>
            <strong>{doctor.mobileFormatted}</strong>
          </div>
        </div>

        <div>
          <h4>{lang === 'en' ? "Specialties" : "વિશેષતા"}</h4>
          <div className="tag-cloud">
            {(lang === 'gu' && doctor.specialtiesGujarati ? doctor.specialtiesGujarati : doctor.specialties).map((s) => (
              <span key={s} className="chip chip-blue">{s}</span>
            ))}
          </div>
        </div>

        {departments.length > 0 && (
          <div>
            <h4>{lang === 'en' ? "Departments" : "વિભાગો"}</h4>
            <div className="tag-cloud">
              {departments.map((d) => (
                <span key={d.id} className="chip">
                  <Icon name={d.icon} size={13} /> {lang === 'en' ? d.title : (d.titleGu || d.title)}
                </span>
              ))}
            </div>
          </div>
        )}

        {facilities.length > 0 && (
          <div>
            <h4>{lang === 'en' ? "Facilities they use" : "ઉપલબ્ધ સુવિધાઓ"}</h4>
            <div className="tag-cloud">
              {facilities.map((f) => (
                <button key={f.id} className="chip chip-mint" style={{ border: 'none' }} onClick={() => onOpenFacility(f.id)}>
                  <Icon name={f.icon} size={13} /> {lang === 'en' ? f.name : f.nameGu}
                </button>
              ))}
            </div>
          </div>
        )}

        {isResident && (
          <div className="callout blue">
            <Users size={18} />
            <span>
              {lang === 'en'
                ? "Resident doctors are based in Emergency and the ICU around the clock. In an emergency you don't need an appointment: come straight in or call."
                : "રેસિડેન્ટ તબીબો ઇમરજન્સી અને આઈ.સી.યુ.માં ૨૪ કલાક હાજર રહે છે. કટોકટીમાં એપોઇન્ટમેન્ટની જરૂર નથી: સીધા હોસ્પિટલ આવો અથવા કૉલ કરો."}
            </span>
          </div>
        )}
      </div>

      <div className="drawer-foot">
        {isResident && (
          <a className="btn btn-emergency" href={HOSPITAL_INFO.phoneHref}>
            <Siren size={16} /> {lang === 'en' ? "Call emergency" : "ઇમરજન્સી કૉલ"}
          </a>
        )}
        <button className={isResident ? 'btn-secondary' : 'btn-primary'} onClick={() => onBook(doctor.id)}>
          <Calendar size={16} /> {
            lang === 'en'
              ? (isResident ? 'Book a slot' : `Book with ${doctor.name.split(' ').slice(0, 2).join(' ')}`)
              : (isResident ? 'સ્લોટ બુક કરો' : `${doctor.nameGujarati.split(' ').slice(0, 2).join(' ')} સાથે સ્લોટ બુક કરો`)
          }
        </button>
      </div>
    </Drawer>
  );
}
