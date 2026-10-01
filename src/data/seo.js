// ========================================================
// SEO: page titles, descriptions, structured data and the list of
// pages to pre-render. Used in the browser (App.jsx updates <head>
// on navigation) and at build time (scripts/prerender.js writes a
// complete HTML file for every page).
// ========================================================
import { HOSPITAL_INFO, DOCTORS, FACILITIES, DEPARTMENTS, FAQS, getDoctor, getFacility, getDepartment } from './hospitalContent.js';

// Public address of the live site. Change this if the site moves
// (e.g. to a custom domain); canonical links and the sitemap use it.
export const SITE_URL = 'https://bluenovatechin.github.io/Pulse-Hospital/';

const BRAND = 'Pulse Hospital & I.C.U, Modasa';

const PAGE_META = {
  home: {
    title: 'Pulse Hospital & I.C.U Modasa | 24x7 ICU, Emergency & Dialysis',
    description:
      'Pulse Hospital & I.C.U (પલ્સ હોસ્પિટલ), City Centre, Shamlaji Road, Modasa: 2000+ critical patients treated and 5000+ OPD consultations in one year. 24x7 emergency, ventilator ICU, in-house CT scan, dialysis and operation theatres. Book an appointment online.'
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
    title: `Doctors in Modasa: Physicians & Critical Care Specialists | ${BRAND}`,
    description: `Meet the ${DOCTORS.length} doctors at Pulse Hospital, Modasa: ${DOCTORS.map((d) => d.name).join(', ')}. See OPD timings and book an appointment.`
  },
  gallery: {
    title: `Hospital Photo Tour | ${BRAND}`,
    description:
      'Real photographs of the ICU, operation theatres, patient rooms, consulting rooms and reception at Pulse Hospital & I.C.U, 4th floor, City Centre, Modasa.'
  },
  about: {
    title: `About Us | ${BRAND}`,
    description:
      'Pulse Hospital & I.C.U brings 24x7 emergency and critical care, dialysis, CT and specialist doctors to Modasa and the Arvalli district: 2000+ critical patients, 5000+ OPD consultations and 70+ complicated surgeries in one year.'
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
  },
  'book-appointment': {
    title: `Book a Doctor Appointment in Modasa | ${BRAND}`,
    description: `Book a 30-minute OPD appointment at Pulse Hospital, Modasa with ${DOCTORS.map((d) => d.name).join(', ')}. Choose a day and time, and send the request on WhatsApp.`
  },
  'my-appointments': {
    title: `My Appointments | ${BRAND}`,
    description: 'View, print or cancel the appointments you booked on this device.',
    noindex: true
  },
  notfound: {
    title: `Page not found | ${BRAND}`,
    description: 'The page you were looking for could not be found.',
    noindex: true
  }
};

// Clean URL path for a page, relative to SITE_URL
export const pagePath = (page, param) =>
  page === 'home' ? '' : `${page}${param ? `/${encodeURIComponent(param)}` : ''}`;

// Hero photo number (public/photos/gallery-N) at the top of each page, so
// the pre-rendered HTML can preload it. Keep in step with the pages' heroes.
export const HERO_PHOTO = { home: 12, facilities: 13, departments: 9, doctors: 15, gallery: 2, about: 1, contact: 5 };

/** Title, description and indexing rule for any route */
export function getPageMeta(page, param) {
  if (page === 'doctors' && param) {
    const d = getDoctor(param);
    if (d) {
      return {
        title: `${d.name}, ${d.qualification} | ${d.designation.split(' & ')[0]} in Modasa | Pulse Hospital`,
        description: `${d.name} (${d.nameGujarati}), ${d.qualification}: ${d.designation} at Pulse Hospital & I.C.U, Modasa. ${d.timing}. ${d.specialties.join(', ')}. Book an appointment online.`
      };
    }
  }
  if (page === 'facilities' && param) {
    const f = getFacility(param);
    if (f) return { title: `${f.name} in Modasa | ${BRAND}`, description: f.summary };
  }
  if (page === 'departments' && param) {
    const d = getDepartment(param);
    if (d) {
      return {
        title: `${d.title} in Modasa: ${d.conditions.slice(0, 3).join(', ')} | Pulse Hospital`,
        description: `${d.intro} Treated at Pulse Hospital & I.C.U, Modasa: ${d.conditions.join(', ')}.`
      };
    }
  }
  if (page === 'book-appointment' && param) {
    const d = getDoctor(param);
    if (d) {
      // Thin variant of the booking page: keep it out of search results
      return { title: `Book an appointment with ${d.name} | ${BRAND}`, description: PAGE_META['book-appointment'].description, noindex: true };
    }
  }
  if (page === 'my-appointments' && param) return { ...PAGE_META['my-appointments'], title: `Appointment ${param} | ${BRAND}` };
  if ((page === 'doctors' || page === 'facilities' || page === 'departments') && param) return PAGE_META.notfound;
  return PAGE_META[page] || PAGE_META.notfound;
}

/** Every page to pre-render at build time. `index: false` ones stay out of the sitemap. */
export function allRoutes() {
  const main = ['home', 'doctors', 'departments', 'facilities', 'book-appointment', 'gallery', 'about', 'contact', 'privacy', 'terms'];
  return [
    ...main.map((page) => ({ page, param: null, index: true })),
    ...DOCTORS.map((d) => ({ page: 'doctors', param: d.slug, index: true })),
    ...DEPARTMENTS.map((d) => ({ page: 'departments', param: d.id, index: true })),
    ...FACILITIES.map((f) => ({ page: 'facilities', param: f.id, index: true })),
    ...DOCTORS.map((d) => ({ page: 'book-appointment', param: d.slug, index: false })),
    { page: 'my-appointments', param: null, index: false }
  ];
}

// ---------- schema.org structured data ----------
const HOSPITAL_ID = `${SITE_URL}#hospital`;

const address = {
  '@type': 'PostalAddress',
  streetAddress: HOSPITAL_INFO.address.line1,
  addressLocality: HOSPITAL_INFO.address.city,
  addressRegion: HOSPITAL_INFO.address.state,
  postalCode: HOSPITAL_INFO.address.pincode,
  addressCountry: 'IN'
};
const telephone = HOSPITAL_INFO.appointmentNumber.replace(/\s/g, '');

function hospital() {
  return {
    '@type': 'Hospital',
    '@id': HOSPITAL_ID,
    name: HOSPITAL_INFO.name,
    alternateName: [HOSPITAL_INFO.nameGujarati, 'Pulse Hospital Modasa', 'Pulse Hospital and ICU'],
    slogan: HOSPITAL_INFO.tagline,
    url: SITE_URL,
    logo: `${SITE_URL}logo-full.png`,
    image: `${SITE_URL}og-image.jpg`,
    telephone,
    address,
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
    employee: DOCTORS.map((d) => ({ '@id': `${SITE_URL}doctors/${d.slug}#physician` }))
  };
}

function physician(d) {
  return {
    '@type': 'Physician',
    '@id': `${SITE_URL}doctors/${d.slug}#physician`,
    name: d.name,
    alternateName: d.nameGujarati,
    url: `${SITE_URL}doctors/${d.slug}`,
    description: `${d.qualification}, ${d.designation}. ${d.bio}`,
    knowsAbout: d.specialties,
    hospitalAffiliation: { '@id': HOSPITAL_ID },
    address,
    telephone
  };
}

function breadcrumbs(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE_URL + path }))
  };
}

/** JSON-LD graph for a route (always includes the hospital itself) */
export function jsonLdFor(page, param) {
  const graph = [hospital()];
  if (page === 'home') {
    graph.push({ '@type': 'WebSite', '@id': `${SITE_URL}#website`, url: SITE_URL, name: HOSPITAL_INFO.name, inLanguage: ['en-IN', 'gu-IN'] });
    graph.push({
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
    });
  }
  if (page === 'doctors') {
    const d = param && getDoctor(param);
    graph.push(...(d ? [d] : DOCTORS).map(physician));
    graph.push(breadcrumbs([['Home', ''], ['Doctors', 'doctors'], ...(d ? [[d.name, `doctors/${d.slug}`]] : [])]));
  }
  if (page === 'facilities') {
    const f = param && getFacility(param);
    graph.push(breadcrumbs([['Home', ''], ['Facilities', 'facilities'], ...(f ? [[f.name, `facilities/${f.id}`]] : [])]));
  }
  if (page === 'departments') {
    const d = param && getDepartment(param);
    graph.push(breadcrumbs([['Home', ''], ['Departments', 'departments'], ...(d ? [[d.title, `departments/${d.id}`]] : [])]));
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

// ---------- <head> tags ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Everything between <!--seo:start--> and <!--seo:end--> in index.html:
 * title, description, robots, canonical, share tags, structured data and
 * a preload for the hero photo. `base` is the site's sub-path ("/Pulse-Hospital/").
 */
export function seoHead({ page, param }, base = '/') {
  const { title, description, noindex } = getPageMeta(page, param);
  const url = SITE_URL + pagePath(page, param);
  const n = !param && HERO_PHOTO[page];
  const photo = (w) => `${base}photos/gallery-${n}${w ? `-${w}` : ''}.webp`;
  const preload = n
    ? `\n    <link rel="preload" as="image" href="${photo()}" imagesrcset="${photo(640)} 640w, ${photo(800)} 800w, ${photo()} 1100w" imagesizes="(max-width: 1023px) 100vw, 45vw" fetchpriority="high" />`
    : '';
  const jsonLd = JSON.stringify(jsonLdFor(page, param)).replace(/</g, '\u003c');
  return `<!--seo:start-->
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />${preload}
    <script type="application/ld+json">${jsonLd}</script>
    <!--seo:end-->`;
}

export const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
