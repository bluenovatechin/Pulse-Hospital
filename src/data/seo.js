// ========================================================
// SEO: page titles, descriptions, structured data and the list of
// pages to pre-render. Used in the browser (App.jsx updates <head>
// on navigation) and at build time (scripts/prerender.js writes a
// complete HTML file for every page).
// ========================================================
import { FACILITY_PAGE_IDS, facilityLink } from './siteStructure.js';
import { HOSPITAL_INFO, DOCTORS, DEPARTMENTS, FACILITIES, FAQS, HOSPITAL_TOUR, GALLERY_IMAGES, isRepresentative, getDoctor, getFacility, getDepartment } from './hospitalContent.js';
import { CONDITIONS, PUBLISHED_CONDITIONS, getCondition, isPublished } from './conditions.js';

/**
 * Old addresses that are now sections of another page. The build writes a
 * small forwarding file for each, so old links and search results still
 * land in the right place: { from: 'facilities/lab', page: 'facilities', hash: 'lab' }
 */
export function legacyRedirects() {
  const list = [];
  FACILITIES.forEach((f) => {
    if (FACILITY_PAGE_IDS.includes(f.id)) return;
    const l = facilityLink(f.id);
    list.push({ from: `facilities/${f.id}`, page: 'facilities', param: l.param || null, hash: l.hash || '' });
  });
  DEPARTMENTS.forEach((d) => list.push({ from: `departments/${d.id}`, page: 'departments', param: null, hash: d.id }));
  return list;
}

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
      'ICU with ventilators, 24x7 emergency, in-house CT scan, 24x7 dialysis, pathology lab, modular operation theatre, lung function lab, physiotherapy, pharmacy and private rooms at Pulse Hospital, Modasa, Aravalli.'
  },
  departments: {
    title: `Departments & Treatments | ${BRAND}`,
    description:
      'Critical care, medicine, heart, chest, kidney, liver, brain & stroke, emergency and surgery departments at Pulse Hospital, Modasa, with the conditions each one treats.'
  },
  conditions: {
    title: `Diseases & Conditions Treated in Modasa | ${BRAND}`,
    description:
      'Symptoms, warning signs, tests, treatment and prevention for dengue, malaria, typhoid, diabetes, high BP, heart attack, stroke, kidney failure, asthma, pneumonia, snakebite and poisoning, treated at Pulse Hospital, Modasa, Aravalli.',
    // Hidden from search engines until at least one page is doctor-reviewed
    noindex: PUBLISHED_CONDITIONS.length === 0
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
      'Pulse Hospital & I.C.U brings 24x7 emergency and critical care, dialysis, CT and specialist doctors to Modasa and the Aravalli district: 2000+ critical patients, 5000+ OPD consultations and 70+ complicated surgeries in one year.'
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
// Home has no hero photo: it opens with the walkthrough video (its poster is preloaded)
export const HERO_PHOTO = { facilities: 13, departments: 9, conditions: 15, doctors: 15, gallery: 2, about: 17, contact: 5 };

/** Title, description and indexing rule for any route */
export function getPageMeta(page, param) {
  if (page === 'doctors' && param) {
    const d = getDoctor(param);
    if (d) {
      return {
        title: `${[d.name, d.qualification].filter(Boolean).join(', ')} | ${d.designation.split(' & ')[0]} in Modasa | Pulse Hospital`,
        description: `${d.name} (${d.nameGujarati})${d.qualification ? `, ${d.qualification}` : ''}${d.medicalCollege ? ` (${d.medicalCollege})` : ''}: ${d.designation} at Pulse Hospital & I.C.U, Modasa${d.experience ? `, ${d.experience.toLowerCase()} of experience` : ''}. Treats ${d.specialties.join(', ')}. OPD: ${d.timing}. Book an appointment online.`
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
  if (page === 'conditions' && param) {
    const c = getCondition(param);
    if (c) {
      return {
        title: `${c.name} Treatment in Modasa: Symptoms, Tests & Care | Pulse Hospital`,
        description: `${c.summary} Treated at Pulse Hospital & I.C.U, Modasa, Aravalli.`,
        // Drafts stay out of search results until a doctor has reviewed them
        noindex: !isPublished(c)
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
  if ((page === 'doctors' || page === 'facilities' || page === 'departments' || page === 'conditions') && param) return PAGE_META.notfound;
  return PAGE_META[page] || PAGE_META.notfound;
}

/** Every page to pre-render at build time. `index: false` ones stay out of the sitemap. */
export function allRoutes() {
  const main = ['home', 'doctors', 'departments', 'facilities', 'book-appointment', 'gallery', 'about', 'contact', 'privacy', 'terms'];
  return [
    ...main.map((page) => ({ page, param: null, index: true })),
    // Condition pages are pre-rendered for review, but only doctor-reviewed
    // ones are indexed and listed in the sitemap
    { page: 'conditions', param: null, index: PUBLISHED_CONDITIONS.length > 0 },
    ...CONDITIONS.map((c) => ({ page: 'conditions', param: c.slug, index: isPublished(c) })),
    ...DOCTORS.map((d) => ({ page: 'doctors', param: d.slug, index: true })),
    // Departments are sections of /departments; ICU, Emergency, Dialysis and
    // CT also have their own pages (see data/siteStructure.js)
    ...FACILITY_PAGE_IDS.map((id) => ({ page: 'facilities', param: id, index: true })),
    ...DOCTORS.map((d) => ({ page: 'book-appointment', param: d.slug, index: false })),
    { page: 'my-appointments', param: null, index: false }
  ];
}

// Absolute address of a photo / portrait / video file (works whatever the
// sub-folder the site is built for)
const absUrl = (src) => (src ? SITE_URL + src.replace(/^.*?(photos|doctors|video)\//, '$1/') : null);

/** Caption used for a doctor's portrait (image search, share previews) */
const doctorCaption = (d) =>
  `${d.name}${d.qualification ? `, ${d.qualification}` : ''}, ${d.designation} at Pulse Hospital & I.C.U, Modasa`;

// Real photos only: AI illustrations ("Representative image") are never
// offered to image search as pictures of this hospital
const realFacilityPhotos = () => {
  const seen = new Set();
  return FACILITIES.filter((f) => f.photo && !isRepresentative(f.photo) && !seen.has(f.photo) && seen.add(f.photo));
};

/** Images to list for a route in the sitemap (absolute URLs) */
export function routeImages({ page, param }) {
  const photoUrl = (n) => `${SITE_URL}photos/gallery-${n}.webp`;
  const doctorImages = () => DOCTORS.filter((d) => d.photo).map((d) => ({ loc: absUrl(d.photo), title: doctorCaption(d) }));
  if (page === 'doctors' && param) {
    const d = getDoctor(param);
    return d && d.photo ? [{ loc: absUrl(d.photo), title: doctorCaption(d) }] : [];
  }
  if (page === 'facilities' && param) {
    const f = getFacility(param);
    return f && f.photo && !isRepresentative(f.photo) ? [{ loc: absUrl(f.photo), title: `${f.name}, Pulse Hospital & I.C.U, Modasa` }] : [];
  }
  if (page === 'home') return [{ loc: `${SITE_URL}video/hospital-tour-poster.webp`, title: 'Pulse Hospital & I.C.U, Modasa' }, ...doctorImages()];
  if (page === 'doctors') return doctorImages();
  if (page === 'gallery') {
    return GALLERY_IMAGES.filter((g) => !isRepresentative(g.src)).map((g) => ({ loc: absUrl(g.src), title: `${g.title}, Pulse Hospital & I.C.U, Modasa` }));
  }
  if (page === 'facilities') {
    return realFacilityPhotos().map((f) => ({ loc: absUrl(f.photo), title: `${f.name}, Pulse Hospital & I.C.U, Modasa` }));
  }
  const n = !param && HERO_PHOTO[page];
  const hero = n ? [{ loc: photoUrl(n), title: 'Pulse Hospital & I.C.U, Modasa' }] : [];
  return page === 'about' ? [...hero, ...doctorImages()] : hero;
}

// ---------- schema.org structured data ----------
const HOSPITAL_ID = `${SITE_URL}#hospital`;

/** A photo described for search engines and AI tools: what it shows, where, and whose it is */
function imageObject(src, caption, extra = {}) {
  const url = absUrl(src);
  return {
    '@type': 'ImageObject',
    url,
    contentUrl: url,
    name: caption,
    caption,
    creditText: HOSPITAL_INFO.name,
    copyrightNotice: `© ${HOSPITAL_INFO.name}, Modasa`,
    creator: { '@id': HOSPITAL_ID },
    contentLocation: { '@id': HOSPITAL_ID },
    ...extra
  };
}

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
    alternateName: [
      HOSPITAL_INFO.nameGujarati,
      'Pulse Hospital Modasa',
      'Pulse Hospital and ICU',
      'Pulse Hospital & I.C.U, Modasa',
      'પલ્સ હોસ્પિટલ મોડાસા'
    ],
    slogan: HOSPITAL_INFO.tagline,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}logo-full.png`,
      contentUrl: `${SITE_URL}logo-full.png`,
      caption: 'Pulse Hospital & I.C.U Logo'
    },
    image: [
      {
        '@type': 'ImageObject',
        '@id': `${SITE_URL}#og-image`,
        url: `${SITE_URL}og-image.png`,
        contentUrl: `${SITE_URL}og-image.png`,
        caption: 'Specialist MD Doctors & 24x7 Critical Care Team at Pulse Hospital & I.C.U Modasa',
        description: 'Doctors at Pulse Hospital & I.C.U Modasa: Dr. Dipesh Patel, Dr. Naimuddin Kazi, Dr. Paras Patel, Dr. Santosh Prajapati, Dr. Saurabh Goswami and Dr. Pulkit Pandya, with 24x7 ICU, in-house CT scan, dialysis and modular operation theatres.',
        width: 1200,
        height: 630
      }
    ],
    telephone,
    address,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.4614,
      longitude: 73.3031
    },
    hasMap: HOSPITAL_INFO.mapsUrl,
    ...(HOSPITAL_INFO.sameAs?.length ? { sameAs: HOSPITAL_INFO.sameAs } : {}),
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
    // A doctor (Person) who practises medicine (Physician)
    '@type': ['Physician', 'Person'],
    '@id': `${SITE_URL}doctors/${d.slug}#physician`,
    name: d.name,
    honorificPrefix: 'Dr.',
    alternateName: d.nameGujarati,
    url: `${SITE_URL}doctors/${d.slug}`,
    jobTitle: d.designation,
    description: `${d.name} (${d.nameGujarati}): ${[d.qualification, d.designation].filter(Boolean).join(', ')}. ${d.bio} Experience: ${d.experience}.${d.gmcNumber ? ` GMC: ${d.gmcNumber}.` : ''}`,
    medicalSpecialty: d.specialties,
    knowsAbout: [...d.specialties, ...(d.whatTheyDo || [])],
    ...(d.medicalCollege ? { alumniOf: { '@type': 'CollegeOrUniversity', name: d.medicalCollege } } : {}),
    identifier: d.gmcNumber,
    hasCredential: [
      d.qualification && {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: d.qualification,
        ...(d.medicalCollege ? { recognizedBy: { '@type': 'CollegeOrUniversity', name: d.medicalCollege } } : {})
      },
      d.gmcNumber && {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'license',
        name: `Gujarat Medical Council registration ${d.gmcNumber}`,
        identifier: d.gmcNumber,
        recognizedBy: { '@type': 'Organization', name: 'Gujarat Medical Council' }
      }
    ].filter(Boolean),
    hasOccupation: {
      '@type': 'Occupation',
      name: d.designation,
      occupationLocation: { '@type': 'City', name: 'Modasa' },
      ...(d.experience ? { description: `${d.experience.toLowerCase()} of experience` } : {})
    },
    hospitalAffiliation: { '@id': HOSPITAL_ID },
    worksFor: { '@id': HOSPITAL_ID },
    ...(d.photo ? { image: imageObject(d.photo, doctorCaption(d), { '@id': `${SITE_URL}doctors/${d.slug}#portrait`, width: 800, height: 1000 }) } : {}),
    address,
    telephone: d.mobileFormatted || telephone,
    availableService: {
      '@type': 'MedicalProcedure',
      name: `Consultation with ${d.name}`,
      description: `${d.timing}. Room: ${d.room}`
    }
  };
}

function siteNavigation() {
  const links = [
    { name: 'Doctors & Specialists', description: 'Consultant MD Physicians and Critical Care Specialists in Modasa', url: `${SITE_URL}doctors` },
    { name: 'Facilities & Infrastructure', description: '30+ Bed ICU, In-house CT Scan, 24x7 Dialysis and Modular OTs', url: `${SITE_URL}facilities` },
    { name: 'Clinical Departments', description: 'ICU Critical Care, Cardiology, Pulmonology, Nephrology and Emergency', url: `${SITE_URL}departments` },
    { name: 'Book OPD Appointment', description: 'Book a 30-minute doctor consultation online with direct WhatsApp confirmation', url: `${SITE_URL}book-appointment` },
    { name: 'About Pulse Hospital', description: '2000+ Critical patients treated in one year at City Centre, Modasa', url: `${SITE_URL}about` },
    { name: 'Contact & 24x7 Emergency', description: '24x7 Emergency helpline 95120 45641, location map and directions', url: `${SITE_URL}contact` },
    ...(PUBLISHED_CONDITIONS.length ? [{ name: 'Diseases & Conditions', description: 'Symptoms, tests and treatment for conditions treated at Pulse Hospital, Modasa', url: `${SITE_URL}conditions` }] : []),
    { name: 'Hospital Photo Tour', description: 'Real photography of ICU ward, operation theatre, rooms and reception', url: `${SITE_URL}gallery` }
  ];

  return {
    '@type': 'ItemList',
    '@id': `${SITE_URL}#sitelinks`,
    name: 'Pulse Hospital Navigation & Sitelinks',
    description: 'Quick links to main sections of Pulse Hospital & I.C.U Modasa website',
    itemListElement: links.map((link, index) => ({
      '@type': 'SiteNavigationElement',
      position: index + 1,
      name: link.name,
      description: link.description,
      url: link.url
    }))
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
  const { title, description } = getPageMeta(page, param);
  const url = SITE_URL + pagePath(page, param);
  const dateModified = '2026-10-24T12:00:00+05:30';

  const graph = [
    hospital(),
    {
      '@type': 'MedicalWebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      datePublished: '2026-03-01T00:00:00+05:30',
      dateModified,
      inLanguage: ['en-IN', 'gu-IN'],
      isPartOf: { '@id': `${SITE_URL}#website` }
    }
  ];

  if (page === 'home') {
    graph.push({
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: HOSPITAL_INFO.name,
      alternateName: ['Pulse Hospital Modasa', 'પલ્સ હોસ્પિટલ મોડાસા', 'Pulse Hospital & ICU', 'Pulse Hospital'],
      description: '24x7 Emergency, Critical Care ICU, CT Scan and Dialysis Hospital in Modasa, Aravalli, Gujarat.',
      inLanguage: ['en-IN', 'gu-IN'],
      publisher: { '@id': HOSPITAL_ID }
    });
    graph.push(siteNavigation());
    graph.push({
      '@type': 'VideoObject',
      name: 'Pulse Hospital & I.C.U, Modasa: one-minute hospital tour',
      description: 'Walkthrough of Pulse Hospital & I.C.U at City Centre, Shamlaji Road, Modasa: entrance, nursing station, X-ray, 24x7 laboratory, medical ICU, modular operation theatre, wards, emergency room, ICCU and 24x7 pharmacy.',
      thumbnailUrl: `${SITE_URL}video/hospital-tour-poster.webp`,
      contentUrl: `${SITE_URL}video/hospital-tour.mp4`,
      uploadDate: '2026-11-23T12:00:00+05:30',
      duration: HOSPITAL_TOUR.durationIso,
      publisher: { '@id': HOSPITAL_ID },
      hasPart: HOSPITAL_TOUR.chapters.map((c, i, all) => ({
        '@type': 'Clip',
        name: c.en,
        startOffset: Math.floor(c.at),
        endOffset: Math.floor(all[i + 1] ? all[i + 1].at : 59),
        url: `${SITE_URL}#t=${Math.floor(c.at)}`
      }))
    });
    graph.push({
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
    });
  } else if (page === 'doctors') {
    const d = param && getDoctor(param);
    if (d) {
      // A doctor's own page is their profile page (how Google and AI tools
      // tell that the page is about this person)
      graph[1] = {
        ...graph[1],
        '@type': ['MedicalWebPage', 'ProfilePage'],
        mainEntity: { '@id': `${SITE_URL}doctors/${d.slug}#physician` },
        ...(d.photo ? { primaryImageOfPage: { '@id': `${SITE_URL}doctors/${d.slug}#portrait` } } : {})
      };
    }
    graph.push(...(d ? [d] : DOCTORS).map(physician));
    graph.push(breadcrumbs([['Home', ''], ['Doctors', 'doctors'], ...(d ? [[d.name, `doctors/${d.slug}`]] : [])]));
  } else if (page === 'facilities') {
    const f = param && getFacility(param);
    const shown = f ? (f.photo && !isRepresentative(f.photo) ? [f] : []) : realFacilityPhotos();
    if (shown.length) graph[1] = { ...graph[1], image: shown.map((x) => imageObject(x.photo, `${x.name}, Pulse Hospital & I.C.U, Modasa`)) };
    graph.push(breadcrumbs([['Home', ''], ['Facilities', 'facilities'], ...(f ? [[f.name, `facilities/${f.id}`]] : [])]));
  } else if (page === 'departments') {
    const d = param && getDepartment(param);
    graph.push(breadcrumbs([['Home', ''], ['Departments', 'departments'], ...(d ? [[d.title, `departments/${d.id}`]] : [])]));
  } else if (page === 'conditions') {
    const c = param && getCondition(param);
    if (c) {
      const reviewer = c.review?.by && getDoctor(c.review.by);
      const dept = getDepartment(c.department);
      graph[1] = {
        ...graph[1],
        about: {
          '@type': 'MedicalCondition',
          name: c.name,
          alternateName: [c.nameGu, ...c.alt],
          description: c.summary,
          signOrSymptom: c.symptoms.map((x) => ({ '@type': 'MedicalSignOrSymptom', name: x })),
          possibleTreatment: { '@type': 'MedicalTherapy', name: `${c.name} treatment`, description: c.treatment },
          ...(dept ? { relevantSpecialty: dept.title } : {})
        },
        audience: { '@type': 'Patient' },
        ...(reviewer ? { lastReviewed: c.review.date, reviewedBy: { '@id': `${SITE_URL}doctors/${reviewer.slug}#physician` } } : {})
      };
      graph.push({
        '@type': 'FAQPage',
        mainEntity: c.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
      });
    }
    graph.push(breadcrumbs([['Home', ''], ['Health conditions', 'conditions'], ...(c ? [[c.name, `conditions/${c.slug}`]] : [])]));
  } else if (page === 'about' || page === 'contact' || page === 'gallery' || page === 'privacy' || page === 'terms') {
    if (page === 'gallery') {
      // Every real photo with what it shows, for Google Images and AI tools
      graph[1] = {
        ...graph[1],
        '@type': ['MedicalWebPage', 'ImageGallery'],
        associatedMedia: GALLERY_IMAGES.filter((g) => !isRepresentative(g.src)).map((g) =>
          imageObject(g.src, `${g.title}, Pulse Hospital & I.C.U, Modasa`, { alternateName: g.titleGujarati, keywords: g.category })
        )
      };
    }
    const label = title.split(' | ')[0];
    graph.push(breadcrumbs([['Home', ''], [label, pagePath(page, param)]]));
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
  const dateModified = '2026-10-24T12:00:00+05:30';
  const n = !param && HERO_PHOTO[page];
  const photo = (w) => `${base}photos/gallery-${n}${w ? `-${w}` : ''}.webp`;
  const preload = n
    ? `\n    <link rel="preload" as="image" href="${photo()}" imagesrcset="${photo(640)} 640w, ${photo(800)} 800w, ${photo()} 1100w" imagesizes="(max-width: 1023px) 100vw, 45vw" fetchpriority="high" />`
    : page === 'home' && !param
      ? `\n    <link rel="preload" as="image" href="${base}video/hospital-tour-poster.webp" fetchpriority="high" />`
      : '';
  const jsonLd = JSON.stringify(jsonLdFor(page, param)).replace(/</g, '\u003c');
  // Share preview (WhatsApp, Facebook, AI tools): a doctor's page shows the
  // doctor, a facility page its photo, every other page the hospital card
  const doc = page === 'doctors' && param && getDoctor(param);
  const fac = page === 'facilities' && param && getFacility(param);
  const share = doc && doc.photo
    ? { url: absUrl(doc.photo), type: 'image/webp', w: 800, h: 1000, alt: doctorCaption(doc) }
    : fac && fac.photo && !isRepresentative(fac.photo)
      ? { url: absUrl(fac.photo), type: 'image/webp', alt: `${fac.name}, Pulse Hospital & I.C.U, Modasa` }
      : null;
  const ogImgUrl = share ? share.url : `${SITE_URL}og-image.png`;
  const ogImgAlt = share ? share.alt : 'Pulse Hospital & I.C.U Modasa - Specialist Doctors & 24x7 Critical Care Team';
  const ogImgType = share ? share.type : 'image/png';
  const ogSize = (w, h) => `\n    <meta property="og:image:width" content="${w}" />\n    <meta property="og:image:height" content="${h}" />`;
  const ogImgSize = share ? (share.w ? ogSize(share.w, share.h) : '') : ogSize(1200, 630);
  // Apps that cannot show the first image fall back to the hospital card
  const ogFallback = share ? `\n    <meta property="og:image" content="${SITE_URL}og-image.png" />` : '';

  return `<!--seo:start-->
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Pulse Hospital & I.C.U Modasa" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:locale:alternate" content="gu_IN" />
    <meta property="og:image" content="${ogImgUrl}" />
    <meta property="og:image:secure_url" content="${ogImgUrl}" />
    <meta property="og:image:type" content="${ogImgType}" />${ogImgSize}
    <meta property="og:image:alt" content="${esc(ogImgAlt)}" />${ogFallback}
    <meta property="article:modified_time" content="${dateModified}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${ogImgUrl}" />
    <meta name="twitter:image:alt" content="${esc(ogImgAlt)}" />
    <meta name="image" content="${ogImgUrl}" />${preload}
    <script type="application/ld+json">${jsonLd}</script>
    <!--seo:end-->`;
}

export const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;

// ---------- llms.txt (plain summary for AI search tools) ----------
// Built from the same data as the website at every build, so it never
// says anything the site itself does not.
export function llmsText(full = false) {
  const H = HOSPITAL_INFO;
  const lines = [
    `# ${H.name}, Modasa`,
    '',
    `> ${H.name} (${H.nameGujarati}) is a ${H.bedCount.total}-bed hospital for 24x7 emergency and critical care on the 4th floor of City Centre, Shamlaji Road, Modasa, Aravalli district, Gujarat, India. It has a ${H.bedCount.icuTotal}-bed critical care department with ventilators, an in-house CT scan, a 24x7 dialysis unit, a 24x7 laboratory and pharmacy, and modular operation theatres, with MD physicians, a DM cardiologist and a chest physician.`,
    '',
    '## Contact',
    `- Address: ${H.address.full}, Gujarat, India`,
    `- Emergency, appointments and WhatsApp: +91 ${H.appointmentLines.join(' / +91 ')}`,
    `- WhatsApp: https://wa.me/${H.whatsappNumber}`,
    '- Emergency, ICU, dialysis, laboratory and pharmacy: open 24 hours, every day',
    `- OPD: ${H.opdHours}`,
    `- Map: ${H.mapsUrl}`,
    `- Website: ${SITE_URL}`,
    '',
    '## Main pages',
    `- [Doctors](${SITE_URL}doctors): ${DOCTORS.length} doctors with OPD timings`,
    `- [Departments](${SITE_URL}departments): ${DEPARTMENTS.map((d) => d.title).join(', ')}`,
    `- [Facilities](${SITE_URL}facilities): ICU, emergency, dialysis, CT scan, laboratory, operation theatres, rooms and more`,
    ...FACILITY_PAGE_IDS.map((id) => { const f = getFacility(id); return `- [${f.name}](${SITE_URL}facilities/${id}): ${f.summary}`; }),
    ...(PUBLISHED_CONDITIONS.length ? [`- [Health conditions](${SITE_URL}conditions): patient guides reviewed by the hospital's doctors`] : []),
    `- [Book an appointment](${SITE_URL}book-appointment): choose a doctor, day and time; the request is sent on WhatsApp`,
    `- [Contact and directions](${SITE_URL}contact)`,
    ''
  ];
  if (!full) {
    lines.push(`Full details: ${SITE_URL}llms-full.txt`, '');
    return lines.join('\n');
  }
  lines.push('## Doctors', '');
  DOCTORS.forEach((d) => {
    lines.push(`### ${d.name} (${d.nameGujarati})`);
    if (d.qualification) lines.push(`- Qualification: ${d.qualification}${d.medicalCollege ? `, ${d.medicalCollege}` : ''}`);
    lines.push(`- Role: ${d.designation}`);
    if (d.gmcNumber) lines.push(`- Gujarat Medical Council registration: ${d.gmcNumber}`);
    if (d.experience) lines.push(`- Experience: ${d.experience}`);
    if (d.specialties?.length) lines.push(`- Treats: ${d.specialties.join(', ')}`);
    if (d.timing) lines.push(`- OPD: ${d.timing}`);
    if (d.photo) lines.push(`- Photo: ${absUrl(d.photo)}`);
    lines.push(`- Profile: ${SITE_URL}doctors/${d.slug}`, '');
  });
  lines.push('## Departments and conditions treated', '');
  DEPARTMENTS.forEach((d) => {
    lines.push(`### ${d.title}`, d.intro, `- Conditions: ${d.conditions.join(', ')}`, `- Services: ${d.services.join(', ')}`, `- Page: ${SITE_URL}departments#${d.id}`, '');
  });
  lines.push('## Facilities', '');
  FACILITIES.forEach((f) => {
    lines.push(`- ${f.name}${f.is24x7 && !/24\s*x\s*7/i.test(f.name) ? ' (24x7)' : ''}: ${f.summary}`);
  });
  lines.push('');
  if (PUBLISHED_CONDITIONS.length) {
    lines.push('## Patient guides', '');
    PUBLISHED_CONDITIONS.forEach((c) => lines.push(`- [${c.name}](${SITE_URL}conditions/${c.slug}): ${c.summary}`));
    lines.push('');
  }
  lines.push('## Frequently asked questions', '');
  FAQS.forEach((f) => lines.push(`### ${f.q}`, f.a, ''));
  return lines.join('\n');
}
