// ========================================================
// Pulse Hospital - Database & Persistence Layer
// Stores data in JSON file with safe read/write operations
// ========================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateNextWeekDates } from '../utils/dateUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data file path
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'pulse_hospital_db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Master Specialist Doctors on Roster (from Pulse Hospital brochure)
export const INITIAL_DOCTORS = [
  {
    id: 1,
    name: "Dr. Dipesh S. Patel",
    nameGujarati: "ડૉ. દિપેશ પટેલ",
    qualification: "MD Medicine",
    specialty: "Consultant Physician & Critical Care",
    specialtyGujarati: "કન્સલ્ટન્ટ ફિઝિશિયન & ક્રિટિકલ કેર",
    hospital: "Deep Hospital, Modasa",
    hospitalGujarati: "દીપ હોસ્પિટલ, મોડાસા",
    mobileNumber: "75674 07272",
    mobileGujarati: "૭૫૬૭૪ ૦૭૨૭૨",
    room: "OPD Suite 401",
    experienceYears: 14,
    avatar: "/assets/WhatsApp Image 2026-09-29 at 9.29.53 AM (1).jpeg",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    morningShift: "09:00 AM - 01:00 PM",
    eveningShift: "04:30 PM - 07:30 PM",
    about: "Specialized in emergency internal medicine, diabetic management, hypertension, and acute trauma resuscitation."
  },
  {
    id: 2,
    name: "Dr. Naimuddin N. Kazi",
    nameGujarati: "ડૉ. નઈમુદ્દીન કાઝી",
    qualification: "MD (Medicine)",
    specialty: "Physician & Intensive Care Specialist",
    specialtyGujarati: "ફિઝિશિયન & ઇન્ટેન્સિવ કેર સ્પેશ્યાલીસ્ટ",
    hospital: "Hayat Hospital, Modasa",
    hospitalGujarati: "હયાત હોસ્પિટલ, મોડાસા",
    mobileNumber: "95120 45646",
    mobileGujarati: "૯૫૧૨૦ ૪૫૬૪૬",
    room: "OPD Suite 402",
    experienceYears: 16,
    avatar: "/assets/WhatsApp Image 2026-09-29 at 9.29.53 AM (2).jpeg",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    morningShift: "09:30 AM - 01:30 PM",
    eveningShift: "05:00 PM - 08:00 PM",
    about: "Senior physician leading comprehensive ICU interventions, metabolic emergencies, liver and infectious diseases."
  },
  {
    id: 3,
    name: "Dr. Paras H. Patel",
    nameGujarati: "ડૉ. પારસ પટેલ",
    qualification: "MD (Medicine)",
    specialty: "Consultant Physician & Cardio-Metabolic Care",
    specialtyGujarati: "કન્સલ્ટન્ટ ફિઝિશિયન & કાર્ડિયો-મેટાબોલિક કેર",
    hospital: "Vedant Hospital, Modasa",
    hospitalGujarati: "વેદાંત હોસ્પિટલ, મોડાસા",
    mobileNumber: "81608 10013",
    mobileGujarati: "૮૧૬૦૮ ૧૦૦૧૩",
    room: "OPD Suite 403",
    experienceYears: 12,
    avatar: "/assets/WhatsApp Image 2026-09-29 at 9.29.53 AM (3).jpeg",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    morningShift: "10:00 AM - 01:30 PM",
    eveningShift: "04:30 PM - 07:30 PM",
    about: "Expert in cardiovascular health, stroke rehabilitation, geriatric medicine, and severe vector-borne fevers."
  },
  {
    id: 4,
    name: "Dr. Santosh J. Prajapati",
    nameGujarati: "ડૉ. સંતોષ પ્રજાપતિ",
    qualification: "MBBS, DTCD, FICCM",
    designation: "Chest Physician & Critical Care Specialist",
    specialty: "Pulmonology & Critical Care (ICU)",
    specialtyGujarati: "ફેફસાના રોગોના નિષ્ણાંત & ક્રિટીકલ કેર સ્પેશ્યાલીસ્ટ",
    hospital: "Medicare Hospital & ICU, Modasa",
    hospitalGujarati: "મેડીકેર હોસ્પિટલ & આઈ.સી.યુ., મોડાસા",
    mobileNumber: "82002 40287",
    mobileGujarati: "૮૨૦૦૨ ૪૦૨૮૭",
    room: "Pulmonology Lab & OPD 404",
    experienceYears: 15,
    avatar: "/assets/WhatsApp Image 2026-09-29 at 9.29.53 AM (4).jpeg",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    morningShift: "09:00 AM - 01:00 PM",
    eveningShift: "04:00 PM - 07:00 PM",
    about: "Renowned chest specialist handling Bronchoscopy, PFT, Sleep Study, advanced ventilator management, asthma, and severe COPD cases."
  },
  {
    id: 5,
    name: "Dr. Mohammad Salim Mansuri",
    nameGujarati: "ડૉ. મોહમ્મદ સલીમ મન્સૂરી",
    qualification: "MBBS, PGDEMS",
    designation: "Medical Officer",
    specialty: "Emergency & Critical Care Specialist",
    specialtyGujarati: "ઇમરજન્સી & ક્રિટિકલ કેર સ્પેશ્યાલીસ્ટ",
    hospital: "Pulse Hospital & ICU",
    hospitalGujarati: "પલ્સ હોસ્પિટલ એન્ડ આઈ.સી.યુ.",
    mobileNumber: "63533 44875",
    mobileGujarati: "૬૩૫૩૩ ૪૪૮૭૫",
    room: "ICU Station & Triage",
    experienceYears: 8,
    avatar: "/assets/WhatsApp Image 2026-09-29 at 9.29.53 AM (5).jpeg",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    morningShift: "08:30 AM - 02:00 PM",
    eveningShift: "02:00 PM - 08:30 PM",
    about: "24/7 dedicated Medical Officer managing acute emergency intake, trauma triage, and ICU patient monitoring."
  },
  {
    id: 6,
    name: "Dr. Pulkit Pandya",
    nameGujarati: "ડૉ. પુલકિત પંડ્યા",
    qualification: "MBBS, CCEBDM",
    designation: "Medical Officer",
    specialty: "Critical Care & Inpatient Management",
    specialtyGujarati: "ક્રિટિકલ કેર & ઈનપેશન્ટ મેનેજમેન્ટ",
    hospital: "Pulse Hospital & ICU",
    hospitalGujarati: "પલ્સ હોસ્પિટલ એન્ડ આઈ.સી.યુ.",
    mobileNumber: "63533 44875",
    mobileGujarati: "૬૩૫૩૩ ૪૪૮૭૫",
    room: "Emergency & ICCU Floor",
    experienceYears: 7,
    avatar: "/assets/WhatsApp Image 2026-09-29 at 9.29.53 AM (6).jpeg",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    morningShift: "09:00 AM - 02:00 PM",
    eveningShift: "03:00 PM - 09:00 PM",
    about: "Dedicated critical care resident overseeing ventilator rounds, dialysis patients, and emergency resuscitations."
  }
];

// Helper to seed initial realistic next-week appointments
function generateSeedAppointments() {
  const nextDates = calculateNextWeekDates();
  const sampleMonday = nextDates[0]?.date || "2026-10-05";
  const sampleWednesday = nextDates[2]?.date || "2026-10-07";

  return [
    {
      id: "PLS-920101",
      patientName: "Rameshchandra Patel",
      patientPhone: "9825012345",
      patientEmail: "ramesh.patel@example.com",
      patientAge: 54,
      patientGender: "Male",
      city: "Modasa",
      previousFileNo: "PH-2025-4190",
      doctorId: 1,
      doctorName: "Dr. Dipesh S. Patel",
      department: "Internal Medicine & Diabetes",
      date: sampleMonday,
      timeSlot: "10:00 AM - 10:30 AM",
      session: "Morning",
      status: "Confirmed",
      symptoms: "Routine diabetes checkup & blood sugar fluctuations",
      createdAt: new Date().toISOString(),
      room: "OPD Suite 401"
    },
    {
      id: "PLS-920102",
      patientName: "Kavita Shah",
      patientPhone: "9426098765",
      patientEmail: "kavita.shah@example.com",
      patientAge: 42,
      patientGender: "Female",
      city: "Dhansura",
      previousFileNo: "",
      doctorId: 4,
      doctorName: "Dr. Santosh J. Prajapati",
      department: "Pulmonology & Chest Clinic",
      date: sampleMonday,
      timeSlot: "11:00 AM - 11:30 AM",
      session: "Morning",
      status: "Confirmed",
      symptoms: "Persistent dry cough and shortness of breath",
      createdAt: new Date().toISOString(),
      room: "Pulmonology Lab & OPD 404"
    },
    {
      id: "PLS-920103",
      patientName: "Arvindbhai Joshi",
      patientPhone: "9978123456",
      patientEmail: "arvind.joshi@example.com",
      patientAge: 61,
      patientGender: "Male",
      city: "Bayad",
      previousFileNo: "PH-2024-1182",
      doctorId: 2,
      doctorName: "Dr. Naimuddin N. Kazi",
      department: "Critical Care & Liver Health",
      date: sampleWednesday,
      timeSlot: "05:30 PM - 06:00 PM",
      session: "Evening",
      status: "Confirmed",
      symptoms: "Post-jaundice follow-up and LFT test review",
      createdAt: new Date().toISOString(),
      room: "OPD Suite 402"
    }
  ];
}

/**
 * Read the entire database safely
 */
export function getDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = {
        doctors: INITIAL_DOCTORS,
        appointments: generateSeedAppointments(),
        contactMessages: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database:", err);
    return { doctors: INITIAL_DOCTORS, appointments: [], contactMessages: [] };
  }
}

/**
 * Save database to JSON file
 */
export function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Error saving database:", err);
    return false;
  }
}
