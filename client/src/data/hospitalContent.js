// ========================================================
// Pulse Hospital & I.C.U — Website Content
// Single source of truth for everything the pages display.
// To add a doctor / facility / department / photo, add an
// entry to the matching array below — pages pick it up
// automatically.
// ========================================================

export const HOSPITAL_INFO = {
  name: "Pulse Hospital & I.C.U",
  nameGujarati: "પલ્સ હોસ્પિટલ એન્ડ આઈ.સી.યુ.",
  tagline: "Caring For Life",
  taglineGujarati: "જીવનની સંભાળ, આપણો વિશ્વાસ",
  badge: "24x7 Emergency & Trauma Care",
  badgeGujarati: "૨૪ કલાક ઇમરજન્સી & ટ્રોમા કેર",
  address: {
    line1: "4th Floor, A-block, City Centre, Shamlaji Road",
    city: "Modasa",
    district: "Arvalli",
    pincode: "383315",
    state: "Gujarat",
    full: "4th Floor, A-block, City Centre, Shamlaji Road, Modasa, Arvalli - 383315"
  },
  addressGujarati: {
    line1: "ચોથો માળ, એ-બ્લોક, સીટી સેન્ટર, શામળાજી રોડ",
    city: "મોડાસા",
    district: "અરવલ્લી",
    pincode: "૩૮૩૩૧૫",
    full: "ચોથો માળ, એ-બ્લોક, સીટી સેન્ટર, શામળાજી રોડ, મોડાસા, અરવલ્લી - ૩૮૩૩૧૫"
  },
  // Active testing number for appointments & WhatsApp sending.
  // Original brochure lines: +91 95120 45641 / +91 95120 45642
  appointmentNumber: "+91 63533 44875",
  phoneHref: "tel:+916353344875",
  whatsappNumber: "916353344875",
  phones: ["+91 63533 44875"],
  email: "care@pulsehospitalmodasa.com",
  mapsUrl: "https://maps.google.com/?q=City+Centre+Shamlaji+Road+Modasa+Gujarat",
  mapsEmbed: "https://maps.google.com/maps?q=City+Centre+Shamlaji+Road+Modasa&t=&z=15&ie=UTF8&iwloc=&output=embed",
  opdHours: "Mon – Sat · 09:00 AM – 01:30 PM & 04:30 PM – 08:00 PM",
  timings: "Monday - Saturday: 08:30 AM - 08:30 PM | Emergency: 24 Hours Open",
  noticeEnglish: "Please bring this file and all past medical reports on your next visit.",
  noticeGujarati: "કૃપા કરીને આગલી મુલાકાતે આ ફાઇલ અને જુના રિપોર્ટ્સ સાથે લાવવા વિનંતી."
};

// --------------------------------------------------------
// Real hospital photographs (public/assets/gallery-N.jpeg)
// ASSET_BASE keeps paths working when the site is served from a
// sub-folder (GitHub Pages: https://<user>.github.io/<repo>/).
// --------------------------------------------------------
const ASSET_BASE = import.meta.env.BASE_URL;
export const PHOTOS = {
  reception: `${ASSET_BASE}assets/gallery-1.jpeg`,
  waiting: `${ASSET_BASE}assets/gallery-2.jpeg`,
  corridor: `${ASSET_BASE}assets/gallery-3.jpeg`,
  nursingIsolation: `${ASSET_BASE}assets/gallery-4.jpeg`,
  billing: `${ASSET_BASE}assets/gallery-5.jpeg`,
  isolation: `${ASSET_BASE}assets/gallery-6.jpeg`,
  twinRoom: `${ASSET_BASE}assets/gallery-7.jpeg`,
  icuStation: `${ASSET_BASE}assets/gallery-8.jpeg`,
  icuBeds: `${ASSET_BASE}assets/gallery-9.jpeg`,
  icuWard: `${ASSET_BASE}assets/gallery-10.jpeg`,
  surgicalUnit: `${ASSET_BASE}assets/gallery-11.jpeg`,
  icuHall: `${ASSET_BASE}assets/gallery-12.jpeg`,
  ot1: `${ASSET_BASE}assets/gallery-13.jpeg`,
  ot2: `${ASSET_BASE}assets/gallery-14.jpeg`,
  consult1: `${ASSET_BASE}assets/gallery-15.jpeg`,
  consult2: `${ASSET_BASE}assets/gallery-16.jpeg`
};

// --------------------------------------------------------
// Doctors
// `id` must match the server's doctor ids (used for slot booking).
// --------------------------------------------------------
export const DOCTORS = [
  {
    id: 1,
    name: "Dr. Dipesh S. Patel",
    nameGujarati: "ડૉ. દિપેશ એસ. પટેલ",
    initials: "DP",
    colors: ["#0a78c2", "#3fae8c"],
    type: "visiting",
    qualification: "MD Medicine",
    designation: "Consultant Physician & Critical Care Specialist",
    hospital: "Deep Hospital, Modasa",
    hospitalGujarati: "દીપ હોસ્પિટલ, મોડાસા",
    mobile: "75674 07272",
    mobileFormatted: "+91 75674 07272",
    room: "OPD Suite 401",
    experience: "14+ Years",
    specialties: ["General Medicine", "Diabetes & Thyroid", "Hypertension", "ICU Care"],
    whatTheyDo: [
      "Diagnoses and treats adult medical illnesses in the OPD",
      "Long-term care for diabetes, thyroid and blood pressure",
      "Leads ICU treatment for critically ill medical patients",
      "Treats fevers and infections such as dengue, malaria and typhoid"
    ],
    departmentIds: ["critical-care", "medicine", "cardiac"],
    timing: "Mon - Sat (09:00 AM - 01:00 PM & 04:30 PM - 07:30 PM)",
    bio: "Renowned physician in Modasa with extensive expertise in treating internal medical emergencies, complex lifestyle metabolic disorders, and critical care management."
  },
  {
    id: 2,
    name: "Dr. Naimuddin N. Kazi",
    nameGujarati: "ડૉ. નઈમુદ્દીન એન. કાઝી",
    initials: "NK",
    colors: ["#173a63", "#0a78c2"],
    type: "visiting",
    qualification: "MD (Medicine)",
    designation: "Consultant Physician & Intensive Care Specialist",
    hospital: "Hayat Hospital, Modasa",
    hospitalGujarati: "હયાત હોસ્પિટલ, મોડાસા",
    mobile: "95120 45646",
    mobileFormatted: "+91 95120 45646",
    room: "OPD Suite 402",
    experience: "16+ Years",
    specialties: ["Infectious Diseases", "Liver & Renal Health", "Intensive Care", "Geriatric Medicine"],
    whatTheyDo: [
      "Treats serious infections, including sepsis and septic shock",
      "Manages liver disease (jaundice, hepatic encephalopathy) and kidney problems",
      "Provides intensive care and advanced life support",
      "Medical care for elderly patients"
    ],
    departmentIds: ["critical-care", "medicine", "kidney", "gastro"],
    timing: "Mon - Sat (09:30 AM - 01:30 PM & 05:00 PM - 08:00 PM)",
    bio: "Senior medical specialist with decades of leadership in multi-system infection management, septic shock, hepatic encephalopathy, and advanced life support."
  },
  {
    id: 3,
    name: "Dr. Paras H. Patel",
    nameGujarati: "ડૉ. પારસ એચ. પટેલ",
    initials: "PP",
    colors: ["#be123c", "#f59e0b"],
    type: "visiting",
    qualification: "MD (Medicine)",
    designation: "Consultant Physician & Cardio-Metabolic Expert",
    hospital: "Vedant Hospital, Modasa",
    hospitalGujarati: "વેદાંત હોસ્પિટલ, મોડાસા",
    mobile: "81608 10013",
    mobileFormatted: "+91 81608 10013",
    room: "OPD Suite 403",
    experience: "12+ Years",
    specialties: ["Cardiac Care", "Stroke & Neuro Recovery", "Metabolic Diseases", "Emergency Trauma"],
    whatTheyDo: [
      "Preventive heart care and management of BP emergencies",
      "Treats stroke and guides recovery afterwards",
      "Manages metabolic disease such as diabetes and cholesterol",
      "Handles acute medical emergencies"
    ],
    departmentIds: ["cardiac", "neuro", "medicine"],
    timing: "Mon - Sat (10:00 AM - 01:30 PM & 04:30 PM - 07:30 PM)",
    bio: "Specialist physician dedicated to preventive cardiology, acute hypertensive crises, stroke recovery, and advanced medical diagnostics."
  },
  {
    id: 4,
    name: "Dr. Santosh J. Prajapati",
    nameGujarati: "ડૉ. સંતોષ જે. પ્રજાપતિ",
    initials: "SP",
    colors: ["#1f7a60", "#5cc0f5"],
    type: "visiting",
    qualification: "MBBS, DTCD, FICCM",
    designation: "Chest Physician & Critical Care Specialist",
    hospital: "Medicare Hospital & ICU, Modasa",
    hospitalGujarati: "મેડીકેર હોસ્પિટલ & આઈ.સી.યુ., મોડાસા",
    mobile: "82002 40287",
    mobileFormatted: "+91 82002 40287",
    room: "Pulmonology Lab & OPD 404",
    experience: "15+ Years",
    specialties: ["Pulmonology / Lungs", "Bronchoscopy", "Asthma & COPD", "Sleep Study (Polysomnography)"],
    whatTheyDo: [
      "Treats lung and breathing problems: asthma, COPD, pneumonia",
      "Performs bronchoscopy (a camera test of the airways)",
      "Runs PFT breathing tests and overnight sleep studies",
      "Drains fluid collected around the lungs (pleural effusion)",
      "Manages ventilator care for ICU patients"
    ],
    departmentIds: ["chest", "critical-care"],
    timing: "Mon - Sat (09:00 AM - 01:00 PM & 04:00 PM - 07:00 PM)",
    bio: "Chest physician performing fiberoptic bronchoscopy, PFT breathing tests, pleural effusion thoracentesis, and specialised critical lung interventions."
  },
  {
    id: 5,
    name: "Dr. Mohammad Salim Mansuri",
    nameGujarati: "ડૉ. મોહમ્મદ સલીમ મન્સૂરી",
    initials: "SM",
    colors: ["#e11d48", "#173a63"],
    type: "resident",
    qualification: "MBBS, PGDEMS",
    designation: "Resident Medical Officer (Critical Care)",
    hospital: "Pulse Hospital & ICU",
    hospitalGujarati: "પલ્સ હોસ્પિટલ એન્ડ આઈ.સી.યુ.",
    mobile: "95120 45641",
    mobileFormatted: "+91 95120 45641",
    room: "ICU Station & Triage",
    experience: "8+ Years",
    specialties: ["Emergency Triage", "Intubation & Ventilation", "CPR"],
    whatTheyDo: [
      "First doctor at the bedside in an emergency, day or night",
      "Stabilises critical patients: CPR, intubation, ventilator set-up",
      "Triage: decides who needs care first on arrival",
      "Round-the-clock monitoring of ICU patients"
    ],
    departmentIds: ["emergency", "critical-care"],
    timing: "Available 24x7 in Emergency & ICU Rotation",
    bio: "Stationed in Pulse ICU ensuring immediate round-the-clock emergency patient stabilisation, ventilator synchronisation, and swift bedside clinical management."
  },
  {
    id: 6,
    name: "Dr. Pulkit Pandya",
    nameGujarati: "ડૉ. પુલકિત પંડ્યા",
    initials: "PK",
    colors: ["#075f9c", "#3fae8c"],
    type: "resident",
    qualification: "MBBS, CCEBDM",
    designation: "Resident Medical Officer (Critical Care)",
    hospital: "Pulse Hospital & ICU",
    hospitalGujarati: "પલ્સ હોસ્પિટલ એન્ડ આઈ.સી.યુ.",
    mobile: "95120 45642",
    mobileFormatted: "+91 95120 45642",
    room: "Emergency & ICCU Floor",
    experience: "7+ Years",
    specialties: ["Trauma Resuscitation", "Dialysis Monitoring", "Post-Surgical ICU Care"],
    whatTheyDo: [
      "Resuscitates and stabilises accident and trauma patients",
      "Monitors patients during dialysis",
      "Looks after patients in the ICU after surgery",
      "Runs antidote protocols for poisoning cases"
    ],
    departmentIds: ["emergency", "critical-care", "kidney"],
    timing: "Available 24x7 in Emergency & ICU Rotation",
    bio: "Specialised in emergency medicine and trauma stabilisation, continuous arterial line monitoring, and acute poison antidote protocols."
  }
];

export const DOCTOR_TYPES = {
  visiting: { label: "Visiting Consultant", labelGu: "વિઝિટિંગ કન્સલ્ટન્ટ" },
  resident: { label: "Resident Medical Officer · 24x7", labelGu: "રેસિડેન્ટ મેડિકલ ઓફિસર · ૨૪x૭" }
};

// --------------------------------------------------------
// Facilities — what the hospital physically has
// `photo: null` renders an illustrated tile instead of a photo.
// --------------------------------------------------------
export const FACILITY_CATEGORIES = [
  { id: "critical", label: "Critical Care", labelGu: "ક્રિટિકલ કેર", icon: "HeartPulse" },
  { id: "diagnostics", label: "Diagnostics", labelGu: "નિદાન", icon: "Scan" },
  { id: "surgery", label: "Surgery", labelGu: "સર્જરી", icon: "Scissors" },
  { id: "stay", label: "Rooms & Stay", labelGu: "રૂમ સુવિધા", icon: "BedDouble" },
  { id: "support", label: "Patient Services", labelGu: "દર્દી સેવાઓ", icon: "HandHeart" }
];

export const FACILITIES = [
  {
    id: "icu",
    category: "critical",
    name: "Intensive Care Unit (ICU)",
    nameGu: "આઈ.સી.યુ. અને ક્રિટીકલ કેર",
    icon: "Activity",
    photo: PHOTOS.icuHall,
    is24x7: true,
    summary: "Multi-bed critical care with ventilators, central monitoring and specialist doctors on duty around the clock.",
    includes: [
      "I.C.C.U. (heart), M.I.C.U. (medical) and S.I.C.U. (surgical) beds",
      "Invasive and non-invasive ventilators",
      "Multipara central monitoring and defibrillator",
      "Central oxygen and suction at every bed",
      "Bedside 2D Echo, sonography and X-ray",
      "Bedside dialysis inside the ICU"
    ],
    goodFor: "Patients who need continuous monitoring or life support — severe infection, heart attack, breathing failure, poisoning, or recovery after major surgery.",
    doctorIds: [1, 2, 4, 5, 6]
  },
  {
    id: "isolation",
    category: "critical",
    name: "Isolation ICU",
    nameGu: "આઈસોલેશન આઈ.સી.યુ.",
    icon: "ShieldPlus",
    photo: PHOTOS.isolation,
    is24x7: true,
    summary: "A glass-walled, separately entered ICU room for patients with infectious illness, protecting them and everyone else.",
    includes: [
      "Separate glass-door entry from the main ICU",
      "Full ICU bed with monitor, oxygen and suction",
      "Bedside ultrasound and ventilator support",
      "Dedicated infection-control nursing protocol"
    ],
    goodFor: "Patients with contagious or high-risk infections who need ICU-level care without sharing space.",
    doctorIds: [2, 5]
  },
  {
    id: "emergency",
    category: "critical",
    name: "Emergency & Trauma",
    nameGu: "ટ્રોમા & ઇમરજન્સી વિભાગ",
    icon: "Siren",
    photo: null,
    is24x7: true,
    summary: "A casualty desk with an immediate doctor response for accidents, poisoning, snakebite, burns, stroke and high fever.",
    includes: [
      "Road accident and multiple-injury (polytrauma) care",
      "Snakebite protocol with anti-snake venom",
      "Poisoning management and antidotes",
      "Acute stroke and brain haemorrhage care",
      "Burns, electric shock and heat stroke",
      "Triage on arrival with a doctor on the floor 24x7"
    ],
    goodFor: "Anyone who needs urgent medical attention. No appointment needed — come straight in or call ahead.",
    doctorIds: [5, 6, 3]
  },
  {
    id: "nursing",
    category: "critical",
    name: "Nursing Station & Central Monitoring",
    nameGu: "નર્સિંગ સ્ટેશન અને સેન્ટ્રલ મોનિટરિંગ",
    icon: "MonitorDot",
    photo: PHOTOS.icuStation,
    is24x7: true,
    summary: "Experienced ICU nurses watch every bed's vitals on a central screen and respond within moments.",
    includes: [
      "Central monitor showing every ICU bed's vitals",
      "Qualified ICU nursing staff on every shift",
      "Emergency crash cart and medicine trolley on the floor",
      "Duty roster board for clear handovers"
    ],
    goodFor: "Every admitted patient — this is the team at your bedside between doctor rounds.",
    doctorIds: []
  },
  {
    id: "dialysis",
    category: "critical",
    name: "24x7 Dialysis Unit",
    nameGu: "૨૪x૭ ડાયાલીસીસ યુનિટ",
    icon: "Droplets",
    photo: null,
    is24x7: true,
    summary: "Emergency and scheduled haemodialysis, supported by a dedicated RO water plant.",
    includes: [
      "Emergency dialysis for sudden kidney failure",
      "Scheduled maintenance dialysis sessions",
      "Dedicated RO water treatment plant",
      "ICU bedside dialysis for critically ill patients",
      "Separate machine for seropositive patients"
    ],
    goodFor: "Patients with kidney failure — both regular dialysis patients and emergencies.",
    doctorIds: [2, 6]
  },
  {
    id: "ct",
    category: "diagnostics",
    name: "In-House CT Scan",
    nameGu: "ઈન-હાઉસ સીટી સ્કેન",
    icon: "Scan",
    photo: null,
    is24x7: true,
    summary: "Modasa CT Scan Centre on the same premises — no ambulance transfer for a scan.",
    includes: [
      "Brain and head CT for stroke and bleeding",
      "HRCT chest for pneumonia and lung disease",
      "Abdomen and pelvis CT (with contrast)",
      "Spine and bone CT",
      "Priority reporting for emergency cases"
    ],
    goodFor: "Head injury, suspected stroke, chest infections, abdominal pain, and trauma cases that need fast imaging.",
    doctorIds: [3, 4]
  },
  {
    id: "lab",
    category: "diagnostics",
    name: "24x7 Pathology Laboratory",
    nameGu: "૨૪ કલાક લેબોરેટરી",
    icon: "Microscope",
    photo: null,
    is24x7: true,
    summary: "Automated blood testing that runs day and night, so treatment decisions are never waiting on a report.",
    includes: [
      "Automated biochemistry and haematology",
      "Arterial blood gas (ABG) analysis",
      "Cardiac troponin (heart attack marker)",
      "Dengue / malaria / typhoid panels and platelet counts"
    ],
    goodFor: "Routine check-ups, fever work-ups, and emergency tests for ICU patients.",
    doctorIds: []
  },
  {
    id: "imaging",
    category: "diagnostics",
    name: "Digital X-Ray, 2D Echo & Sonography",
    nameGu: "ડિજિટલ એક્સ-રે, 2D ઇકો & સોનોગ્રાફી",
    icon: "HeartPulse",
    photo: null,
    is24x7: true,
    summary: "Heart ultrasound, abdominal sonography and digital X-ray — including portable machines that come to the bed.",
    includes: [
      "2D Echocardiography with colour Doppler",
      "Abdominal and emergency (FAST) sonography",
      "Digital X-ray and mobile bedside X-ray",
      "Heart failure and valve function assessment"
    ],
    goodFor: "Chest pain, breathlessness, abdominal complaints, injuries, and ICU patients who cannot be moved.",
    doctorIds: [3, 1]
  },
  {
    id: "pulmo-lab",
    category: "diagnostics",
    name: "Lung Function & Bronchoscopy Lab",
    nameGu: "ફેફસાં તપાસ લેબ (બ્રોન્કોસ્કોપી, PFT)",
    icon: "Wind",
    photo: null,
    is24x7: false,
    summary: "Specialist lung testing led by the chest physician: bronchoscopy, spirometry and sleep studies.",
    includes: [
      "Fiberoptic video bronchoscopy (દુરબીન દ્વારા ફેફસાની તપાસ)",
      "PFT / spirometry (ફુંક દ્વારા ફેફસાની ક્ષમતા તપાસ)",
      "Overnight sleep study (polysomnography)",
      "Pleural fluid drainage"
    ],
    goodFor: "Long-standing cough, asthma, COPD, snoring or sleep apnoea, and unexplained breathlessness.",
    doctorIds: [4]
  },
  {
    id: "ot",
    category: "surgery",
    name: "Modular Operation Theatre",
    nameGu: "અદ્યતન મોડ્યુલર ઓપરેશન થીયેટર",
    icon: "Scissors",
    photo: PHOTOS.ot1,
    is24x7: true,
    summary: "Sterile modular theatres with laminar airflow, LED surgical lights and a full anaesthesia workstation.",
    includes: [
      "Laminar airflow ceiling for infection control",
      "IITV (live X-ray) for orthopaedic surgery",
      "Anaesthesia workstation and cardiac monitors",
      "Emergency and high-risk surgery"
    ],
    goodFor: "Planned and emergency operations, including fracture fixation and abdominal surgery.",
    doctorIds: []
  },
  {
    id: "lap-endo",
    category: "surgery",
    name: "Laparoscopy, Endoscopy & Specialty Surgery",
    nameGu: "લેપ્રોસ્કોપી, એન્ડોસ્કોપી & સ્પેશ્યાલિટી સર્જરી",
    icon: "Stethoscope",
    photo: PHOTOS.ot2,
    is24x7: false,
    summary: "Keyhole surgery and camera procedures, plus neuro/spine and maxillofacial (dental) surgical wings.",
    includes: [
      "Laparoscopic (keyhole) surgery",
      "Endoscopy for stomach and intestine",
      "Gastroenterology & hepatology procedures",
      "Neuro and spine surgery",
      "Maxillofacial (jaw & dental) surgery"
    ],
    goodFor: "Patients who benefit from smaller cuts and faster recovery, and specialist surgical cases.",
    doctorIds: [2]
  },
  {
    id: "deluxe",
    category: "stay",
    name: "Deluxe Private Rooms",
    nameGu: "ડીલક્ષ પ્રાઇવેટ રૂમ",
    icon: "BedSingle",
    photo: PHOTOS.corridor,
    is24x7: true,
    summary: "Private air-conditioned rooms for a quiet recovery, with space for a family member.",
    includes: [
      "Air-conditioned private room with attached bath",
      "Motorised bed with nurse-call button",
      "Central oxygen and suction supply",
      "Seating for one attendant"
    ],
    goodFor: "Patients who prefer privacy during their stay.",
    doctorIds: []
  },
  {
    id: "twin",
    category: "stay",
    name: "Semi-Special & Twin-Sharing Rooms",
    nameGu: "સેમી-સ્પેશિયલ & ટ્વીન શેરિંગ રૂમ",
    icon: "BedDouble",
    photo: PHOTOS.twinRoom,
    is24x7: true,
    summary: "Bright, curtained two-bed rooms with the same medical fittings as private rooms.",
    includes: [
      "Privacy curtains around each bed",
      "Motorised Fowler beds",
      "Oxygen and suction at every bed",
      "24x7 nursing on the floor"
    ],
    goodFor: "Comfortable, more affordable inpatient stays.",
    doctorIds: []
  },
  {
    id: "opd",
    category: "support",
    name: "Consultation Rooms (OPD)",
    nameGu: "કન્સલ્ટેશન રૂમ (OPD)",
    icon: "ClipboardPlus",
    photo: PHOTOS.consult1,
    is24x7: false,
    summary: "Private consulting rooms with an examination couch, where you meet your doctor for a booked 30-minute slot.",
    includes: [
      "Private, air-conditioned consulting room",
      "Examination couch behind a privacy curtain",
      "Computerised records at the desk",
      "Book a slot online to skip the queue"
    ],
    goodFor: "OPD visits, follow-ups, and routine check-ups.",
    doctorIds: [1, 2, 3, 4]
  },
  {
    id: "pharmacy",
    category: "support",
    name: "24x7 Pharmacy",
    nameGu: "૨૪ કલાક મેડિકલ & ફાર્મસી",
    icon: "Pill",
    photo: null,
    is24x7: true,
    summary: "An in-house medical store that stays open all night, so prescriptions never wait for morning.",
    includes: [
      "Open 24 hours, every day",
      "ICU and emergency medicines stocked",
      "Anti-snake venom and antidotes available"
    ],
    goodFor: "Admitted patients, emergency cases, and OPD prescriptions.",
    doctorIds: []
  },
  {
    id: "arrival",
    category: "support",
    name: "Reception, Billing & Waiting Lounge",
    nameGu: "રીસેપ્શન, બિલિંગ & વેઇટિંગ લાઉન્જ",
    icon: "Armchair",
    photo: PHOTOS.reception,
    is24x7: true,
    summary: "A calm, air-conditioned arrival area with a help desk, a separate billing counter and a spacious waiting lounge.",
    includes: [
      "Reception and help desk",
      "Separate billing section",
      "Large seated waiting lounge for families",
      "Lift access, wheelchair assistance and ample parking"
    ],
    goodFor: "Everyone — this is where your visit starts.",
    doctorIds: []
  }
];

// Brochure checklist (kept verbatim in Gujarati, with an English line)
export const HOSPITAL_FACILITIES = [
  { gu: "24x7 એમ.ડી. I.C.U. સ્પેશ્યાલીસ્ટ ડોક્ટર ઉપલબ્ધ", en: "MD ICU specialist available 24x7" },
  { gu: "24x7 કલાક ડાયાલિસીસની સુવિધા ઉપલબ્ધ", en: "Dialysis available 24x7" },
  { gu: "24x7 લેબોરેટરી કાર્યરત", en: "Laboratory open 24x7" },
  { gu: "24x7 કલાક મેડિકલ અને ફાર્મસી સુવિધા", en: "Medical store & pharmacy 24x7" },
  { gu: "ક્વોલિફાઇડ સ્ટાફ દ્વારા I.C.U. ની દેખરેખ", en: "ICU supervised by qualified staff" },
  { gu: "અનુભવી નર્સીંગ સ્ટાફ અને સેન્ટ્રલ મોનિટરિંગ", en: "Experienced nurses & central monitoring" },
  { gu: "અત્ય અધતન સુસજ્જ મોડ્યુલર ઓપરેશન થીયેટર", en: "Fully equipped modular operation theatre" },
  { gu: "ઓર્થોપેડીક સર્જરી માટે IITV ની સુવિધા", en: "IITV for orthopaedic surgery" },
  { gu: "લેપ્રોસ્કોપીક તેમજ એન્ડોસ્કોપી સુવિધા", en: "Laparoscopy & endoscopy" },
  { gu: "ગેસ્ટ્રોલોજી અને હેપેટોલોજી સુવિધા", en: "Gastroenterology & hepatology" },
  { gu: "ન્યુરો / મણકાની સર્જરી વિભાગ", en: "Neuro / spine surgery" },
  { gu: "મેક્સિલો ફેશિયલ (ડેન્ટલ) સર્જન વિભાગ", en: "Maxillofacial (dental) surgery" },
  { gu: "કાર્ડિયોલોજી અને 2D Echo સોનોગ્રાફી", en: "Cardiology & 2D Echo" },
  { gu: "ઇન્ફેક્શન રોગ સારવાર અને આઇસોલેશન સુવિધા", en: "Infectious disease care & isolation" },
  { gu: "ઈન-હાઉસ સીટી સ્કેન (મોડાસા CT સ્કેન સેન્ટર)", en: "In-house CT scan (Modasa CT Scan Centre)" },
  { gu: "પાર્કિંગની વિશાળ સુવિધા", en: "Ample parking" }
];

// --------------------------------------------------------
// Departments — clinical specialties and what they treat
// --------------------------------------------------------
export const DEPARTMENTS = [
  {
    id: "critical-care",
    title: "Critical Care & ICU",
    titleGujarati: "ક્રિટિકલ કેર & આઈ.સી.યુ.",
    icon: "Activity",
    intro: "For patients whose life is at risk and who need round-the-clock monitoring, ventilator support or organ support.",
    conditions: ["Sepsis & septic shock", "Respiratory failure", "Multi-organ failure", "Post-surgery ICU care", "Severe poisoning"],
    conditionsGu: "",
    services: ["Ventilator support", "Central monitoring", "Bedside dialysis", "Isolation ICU"],
    facilityIds: ["icu", "isolation", "nursing", "dialysis"],
    doctorIds: [1, 2, 4, 5, 6]
  },
  {
    id: "medicine",
    title: "General & Internal Medicine",
    titleGujarati: "જનરલ મેડિસિન",
    icon: "Stethoscope",
    intro: "The starting point for most adult illnesses: diagnosis, long-term disease control and fever care.",
    conditions: ["Uncontrolled diabetes", "Thyroid disorders", "High blood pressure", "Dengue with low platelets", "Malaria & typhoid", "Chikungunya"],
    conditionsGu: "તાવ: ઝેરી મેલેરીયા, ડેન્ગ્યુમાં પ્લેટલેટ ઘટી જવા, ટાઇફોઇડ, ચિકનગુનીયા · અનિયંત્રિત ડાયાબીટીસ, થાઇરોઇડ",
    services: ["OPD consultation", "Lab work-ups", "Admission if needed"],
    facilityIds: ["opd", "lab"],
    doctorIds: [1, 2, 3]
  },
  {
    id: "cardiac",
    title: "Heart & Cardio-Metabolic Care",
    titleGujarati: "હૃદય રોગો / એન્ડોક્રાઇન",
    icon: "HeartPulse",
    intro: "Emergency and ongoing care for the heart, blood pressure and related metabolic conditions.",
    conditions: ["Heart attack", "Hypertensive crisis", "Heart failure", "Cholesterol & metabolic disease"],
    conditionsGu: "હાર્ટ એટેક, બી.પી. (હાઈપરટેન્શન), થાઇરોઇડ, અનિયંત્રિત ડાયાબીટીસ",
    services: ["2D Echo & Doppler", "I.C.C.U. (cardiac ICU)", "Cardiac troponin testing"],
    facilityIds: ["icu", "imaging", "lab"],
    doctorIds: [3, 1]
  },
  {
    id: "chest",
    title: "Chest & Pulmonology",
    titleGujarati: "ફેફસાના રોગો (ચેસ્ટ & પલ્મોનોલોજી)",
    icon: "Wind",
    intro: "Everything to do with the lungs and breathing — from long-term asthma to ICU ventilation.",
    conditions: ["Breathlessness", "Pneumonia", "Fluid in the lungs", "Asthma", "COPD", "Sleep apnoea", "Post-COVID lung fibrosis"],
    conditionsGu: "શ્વાસ ચડવો, ન્યુમોનીયા, ફેફસામા પાણી ભરાવુ, અસ્થમા, સીઓપીડી (COPD)",
    services: ["Bronchoscopy", "PFT / spirometry", "Sleep study", "HRCT chest"],
    facilityIds: ["pulmo-lab", "ct", "icu"],
    doctorIds: [4]
  },
  {
    id: "kidney",
    title: "Kidney Care & Dialysis",
    titleGujarati: "કીડનીને લગતા રોગો",
    icon: "Droplets",
    intro: "Diagnosis and treatment of kidney disease, with a dialysis unit that is open around the clock.",
    conditions: ["Kidney stones", "Kidney swelling", "Urinary infection", "Acute renal failure"],
    conditionsGu: "પથરી, કીડની પર સોજો, પેશાબમાં રસી થવી, એક્યુટ રીનલ ફેલ્યોર",
    services: ["Emergency dialysis", "Maintenance dialysis", "ICU bedside dialysis"],
    facilityIds: ["dialysis", "lab"],
    doctorIds: [2, 6]
  },
  {
    id: "gastro",
    title: "Liver & Stomach (Gastro)",
    titleGujarati: "લીવર / પેટના રોગો",
    icon: "Soup",
    intro: "Care for the digestive system and liver, supported by endoscopy.",
    conditions: ["Jaundice", "Diarrhoea & vomiting", "Bowel inflammation", "Bleeding in the stomach"],
    conditionsGu: "કમળો, ઝાડા-ઉલ્ટી, આંતરડાનો સોજો, પેટમાં રક્તસ્ત્રાવ",
    services: ["Endoscopy", "Gastroenterology & hepatology", "Abdominal CT & sonography"],
    facilityIds: ["lap-endo", "ct", "imaging"],
    doctorIds: [2]
  },
  {
    id: "neuro",
    title: "Brain & Stroke Care",
    titleGujarati: "મગજના રોગો",
    icon: "Brain",
    intro: "Fast diagnosis and treatment for stroke and other brain emergencies — the in-house CT saves critical minutes.",
    conditions: ["Paralysis (stroke)", "Brain haemorrhage", "Fits / seizures", "Encephalitis (brain fever)"],
    conditionsGu: "લકવો (Paralysis), મગજનું હેમરેજ, ખેંચ (Fits), મગજનો તાવ (Encephalitis)",
    services: ["Emergency brain CT", "Stroke thrombolysis", "Neuro / spine surgery"],
    facilityIds: ["ct", "icu", "lap-endo"],
    doctorIds: [3]
  },
  {
    id: "emergency",
    title: "Emergency, Trauma & Poisoning",
    titleGujarati: "ટ્રોમા / ઈમરજન્સી & પોઇઝનીંગ",
    icon: "Siren",
    intro: "Immediate care for accidents, bites and poisoning. Walk in any time — no appointment needed.",
    conditions: ["Road accident injuries", "Burns", "Electric shock", "Heat stroke", "Snakebite", "Insect bites", "Pesticide / drug poisoning"],
    conditionsGu: "અકસ્માત ઈજા, દાઝી જવું, વીજ કરંટ લાગવો, હીટ સ્ટ્રોક · સાપ કરડવો, ઝેરી દવાની અસર",
    services: ["24x7 casualty desk", "Anti-snake venom", "Antidote protocols", "Trauma surgery"],
    facilityIds: ["emergency", "ct", "ot", "pharmacy"],
    doctorIds: [5, 6]
  },
  {
    id: "surgery",
    title: "Surgery",
    titleGujarati: "સર્જરી વિભાગ",
    icon: "Scissors",
    intro: "Planned and emergency operations in modular theatres, including keyhole, orthopaedic, spine and jaw surgery.",
    conditions: ["Fractures", "Abdominal surgery", "Hernia & gallbladder", "Spine problems", "Jaw & dental surgery"],
    conditionsGu: "",
    services: ["Laparoscopic surgery", "Orthopaedic surgery with IITV", "Neuro & spine surgery", "Maxillofacial surgery"],
    facilityIds: ["ot", "lap-endo", "icu"],
    doctorIds: []
  }
];

// Legacy grouped view of treatable conditions (used on the home page)
export const MEDICAL_CONDITIONS = DEPARTMENTS
  .filter((d) => d.conditionsGu)
  .map((d) => ({ id: d.id, icon: d.icon, category: d.title, categoryGu: d.titleGujarati, conditions: d.conditionsGu }));

// --------------------------------------------------------
// Photo gallery
// --------------------------------------------------------
export const GALLERY_CATEGORIES = ["All", "ICU", "Surgery", "Rooms", "OPD", "Arrival"];

export const GALLERY_IMAGES = [
  { id: 12, title: "ICU hall with ventilators", titleGujarati: "વેન્ટીલેટર સાથે આઈ.સી.યુ.", category: "ICU", src: PHOTOS.icuHall },
  { id: 9, title: "ICU beds with bedside monitors", titleGujarati: "આઈ.સી.યુ. બેડ અને મોનિટર", category: "ICU", src: PHOTOS.icuBeds },
  { id: 10, title: "ICU ward with central oxygen", titleGujarati: "સેન્ટ્રલ ઓક્સિજન સાથે આઈ.સી.યુ.", category: "ICU", src: PHOTOS.icuWard },
  { id: 6, title: "Isolation ICU room", titleGujarati: "આઈસોલેશન રૂમ", category: "ICU", src: PHOTOS.isolation },
  { id: 8, title: "ICU nursing station", titleGujarati: "આઈ.સી.યુ. નર્સિંગ સ્ટેશન", category: "ICU", src: PHOTOS.icuStation },
  { id: 4, title: "Nursing station & isolation entry", titleGujarati: "નર્સિંગ સ્ટેશન", category: "ICU", src: PHOTOS.nursingIsolation },
  { id: 13, title: "Modular operation theatre", titleGujarati: "મોડ્યુલર ઓપરેશન થીયેટર", category: "Surgery", src: PHOTOS.ot1 },
  { id: 14, title: "Operation theatre with laminar airflow", titleGujarati: "લેમિનાર એરફ્લો ઓપરેશન થીયેટર", category: "Surgery", src: PHOTOS.ot2 },
  { id: 11, title: "Surgical unit entrance", titleGujarati: "સર્જિકલ યુનિટ", category: "Surgery", src: PHOTOS.surgicalUnit },
  { id: 7, title: "Twin-sharing patient room", titleGujarati: "ટ્વીન શેરિંગ રૂમ", category: "Rooms", src: PHOTOS.twinRoom },
  { id: 3, title: "Corridor to the deluxe rooms", titleGujarati: "ડીલક્ષ રૂમ કોરિડોર", category: "Rooms", src: PHOTOS.corridor },
  { id: 15, title: "Doctor consultation room", titleGujarati: "કન્સલ્ટિંગ રૂમ", category: "OPD", src: PHOTOS.consult1 },
  { id: 16, title: "Consultation room with exam couch", titleGujarati: "કન્સલ્ટિંગ રૂમ", category: "OPD", src: PHOTOS.consult2 },
  { id: 1, title: "Reception & help desk", titleGujarati: "રીસેપ્શન", category: "Arrival", src: PHOTOS.reception },
  { id: 5, title: "Billing section", titleGujarati: "બિલિંગ સેક્શન", category: "Arrival", src: PHOTOS.billing },
  { id: 2, title: "Patient waiting lounge", titleGujarati: "વેઇટિંગ લાઉન્જ", category: "Arrival", src: PHOTOS.waiting }
];

// --------------------------------------------------------
// Testimonials & FAQs
// --------------------------------------------------------
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Jigneshbhai Patel",
    city: "Modasa",
    comment: "When my father had acute breathlessness at 2 AM, Pulse Hospital's ICU team admitted him immediately. Dr. Santosh Prajapati and the nursing team were exceptional. The CT scan and dialysis were right inside the hospital.",
    rating: 5,
    treatment: "Severe Pneumonia & Respiratory Care"
  },
  {
    id: 2,
    name: "Dr. K. M. Solanki",
    city: "Dhansura",
    comment: "Booking next week's slot in advance online made our consultation with Dr. Dipesh Patel completely effortless. No waiting in long queues. The staff is polite and facilities match top Ahmedabad hospitals.",
    rating: 5,
    treatment: "Diabetic Care & Health Screening"
  },
  {
    id: 3,
    name: "Fatima Mansuri",
    city: "Bayad",
    comment: "Pulse Hospital saved my brother after a critical pesticide poisoning emergency. Within 10 minutes of arrival, Dr. Salim Mansuri and the ICU specialists started intensive resuscitation.",
    rating: 5,
    treatment: "Emergency Poisoning Resuscitation"
  }
];

export const FAQS = [
  {
    q: "How does advance slot booking work?",
    a: "Choose a doctor, pick any day in the coming week, and select a free 30-minute morning or evening slot. You'll get a booking ID (e.g. PLS-920101) and a slip you can print or share on WhatsApp."
  },
  {
    q: "Do I need an appointment for an emergency?",
    a: "No. The emergency desk, ICU, CT scan, lab, pharmacy and dialysis run 24x7. Come straight to the 4th floor, City Centre, or call ahead so the team is ready."
  },
  {
    q: "Can I check or cancel my booking?",
    a: "Yes. Use “My Booking” at the top of the page and search with your mobile number or booking ID. You can view the slip or cancel the slot, which frees it for another patient."
  },
  {
    q: "What should I bring to my appointment?",
    a: "Please bring your hospital file and all previous medical reports, any recent lab tests and prescriptions, and a photo ID."
  },
  {
    q: "Where is Pulse Hospital located?",
    a: "4th Floor, A-block, City Centre, Shamlaji Road, Modasa, Arvalli - 383315. Lift access, wheelchair assistance and ample parking are available."
  }
];

// --------------------------------------------------------
// Helpers
// --------------------------------------------------------
export const getDoctor = (id) => DOCTORS.find((d) => d.id === Number(id));
export const getFacility = (id) => FACILITIES.find((f) => f.id === id);
export const getDepartment = (id) => DEPARTMENTS.find((d) => d.id === id);
