// ========================================================
// SEO: page titles, descriptions and structured data.
// Used in the browser (App.jsx updates <head> on navigation) and at
// build time (vite.config.js writes one HTML file per page, so search
// engines and link previews see the right title without running JS).
// ========================================================
import { HOSPITAL_INFO, DOCTORS, FACILITIES, DEPARTMENTS } from './hospitalContent.js';

// Public address of the live site. Change this if the site moves
// (e.g. to a custom domain); canonical links and the sitemap use it.
export const SITE_URL = 'https://bluenovatechin.github.io/Pulse-Hospital/';

const BRAND = 'Pulse Hospital & I.C.U, Modasa';

export const PAGE_META = {
  home: {
    title: 'Pulse Hospital & I.C.U Modasa | 24x7 ICU, Emergency & Dialysis',
    description:
      '24x7 emergency, ventilator ICU, in-house CT scan, dialysis and modular operation theatres at City Centre, Shamlaji Road, Modasa. Book an OPD appointment on WhatsApp.'
  },
  facilities: {
    title: `Facilities: ICU, CT Scan, Dialysis & Operation Theatre | ${BRAND}`,
    description:
      'ICU with ventilators, isolation ICU, in-house CT scan, 24x7 dialysis, lab and pharmacy, modular OT, physiotherapy and private rooms at Pulse Hospital, Modasa.'
  },
  departments: {
    title: `Departments & Treatments | ${BRAND}`,
    description:
      'Critical care, medicine, heart, chest, kidney, liver, brain & stroke, emergency and surgery departments at Pulse Hospital, Modasa, with the conditions each one treats.'
  },
  doctors: {
    title: `Doctors & OPD Timings | ${BRAND}`,
    description: `Meet the ${DOCTORS.length} doctors at Pulse Hospital, Modasa: MD physicians, a chest and critical care specialist, and a 24x7 medical officer. See OPD timings and book a slot.`
  },
  gallery: {
    title: `Hospital Photo Tour | ${BRAND}`,
    description:
      'Real photographs of the ICU, operation theatres, patient rooms, consulting rooms and reception at Pulse Hospital & I.C.U, 4th floor, City Centre, Modasa.'
  },
  about: {
    title: `About Us | ${BRAND}`,
    description:
      'Pulse Hospital & I.C.U brings 24x7 emergency and critical care, dialysis, CT and specialist doctors to Modasa and the Arvalli district.'
  },
  contact: {
    title: `Contact, Address & Directions | ${BRAND}`,
    description: `Call ${HOSPITAL_INFO.appointmentNumber} for emergencies. Appointments: ${HOSPITAL_INFO.appointmentLines.join(' / ')}. ${HOSPITAL_INFO.address.full}.`
  },
  privacy: {
    title: `Privacy Policy | ${BRAND}`,
    description: 'How Pulse Hospital & I.C.U handles the details you share when booking an appointment or contacting us.'
  },
  terms: {
    title: `Terms & Conditions | ${BRAND}`,
    description: 'Appointment guidelines, emergency protocols and patient responsibilities at Pulse Hospital & I.C.U, Modasa.'
  }
};

// Hero photo number (public/photos/gallery-N) shown at the top of each page.
// vite.config.js preloads it so the first screen paints sooner; keep in
// step with the PHOTOS used by each page's hero.
export const HERO_PHOTO = { home: 12, facilities: 13, departments: 9, doctors: 15, gallery: 2, about: 1, contact: 5 };

// Clean URL path for a page (+ optional detail id), relative to SITE_URL
export const pagePath = (page, param) =>
  page === 'home' ? '' : `${page}${param ? `/${encodeURIComponent(param)}` : ''}`;

/** Title + description for any route, including doctor / facility panels */
export function getPageMeta(page, param) {
  const base = PAGE_META[page] || PAGE_META.home;
  if (page === 'doctors' && param) {
    const d = DOCTORS.find((x) => x.id === Number(param));
    if (d) {
      return {
        title: `${d.name}, ${d.qualification} | ${BRAND}`,
        description: `${d.name} (${d.qualification}), ${d.designation} at Pulse Hospital, Modasa. ${d.timing}. ${d.specialties.join(', ')}.`
      };
    }
  }
  if (page === 'facilities' && param) {
    const f = FACILITIES.find((x) => x.id === param);
    if (f) return { title: `${f.name} | ${BRAND}`, description: f.summary };
  }
  return base;
}

/** Every URL worth indexing, for the sitemap and pre-rendered HTML */
export function allRoutes() {
  return [
    ...Object.keys(PAGE_META).map((page) => ({ page, param: null })),
    ...DOCTORS.map((d) => ({ page: 'doctors', param: String(d.id) })),
    ...FACILITIES.map((f) => ({ page: 'facilities', param: f.id }))
  ];
}

/** schema.org data describing the hospital (Google rich results / Maps) */
export function hospitalJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hospital',
    '@id': `${SITE_URL}#hospital`,
    name: HOSPITAL_INFO.name,
    alternateName: HOSPITAL_INFO.nameGujarati,
    slogan: HOSPITAL_INFO.tagline,
    url: SITE_URL,
    logo: `${SITE_URL}logo.png`,
    image: `${SITE_URL}og-image.jpg`,
    telephone: HOSPITAL_INFO.appointmentNumber.replace(/\s/g, ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: HOSPITAL_INFO.address.line1,
      addressLocality: HOSPITAL_INFO.address.city,
      addressRegion: HOSPITAL_INFO.address.state,
      postalCode: HOSPITAL_INFO.address.pincode,
      addressCountry: 'IN'
    },
    hasMap: HOSPITAL_INFO.mapsUrl,
    isAcceptingNewPatients: true,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59'
      }
    ],
    // Values from schema.org's MedicalSpecialty list
    medicalSpecialty: [
      'Emergency', 'Pulmonary', 'Renal', 'Cardiovascular', 'Neurologic', 'Gastroenterologic',
      'Surgical', 'PlasticSurgery', 'Physiotherapy', 'Radiography', 'Pathology', 'Toxicologic'
    ],
    keywords: DEPARTMENTS.map((d) => d.title).join(', '),
    employee: DOCTORS.map((d) => ({
      '@type': 'Physician',
      name: d.name,
      description: `${d.qualification}, ${d.designation}`
    }))
  };
}
