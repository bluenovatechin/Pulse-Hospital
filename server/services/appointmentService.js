// ========================================================
// Pulse Hospital - Appointment Business Logic Service
// Handles booking, collision detection, and persistence
// ========================================================

import { getDb, saveDb } from '../models/storage.js';
import { generateAppointmentId } from '../utils/idGenerator.js';
import { calculateReportingTime, calculateNextWeekDates } from '../utils/dateUtils.js';
import { generateWhatsAppLink } from './whatsappService.js';

/**
 * Create a new Advance Slot Appointment
 */
export function createAppointment(data) {
  const {
    doctorId,
    date,
    timeSlot,
    patientName,
    patientPhone,
    patientEmail,
    patientAge,
    patientGender,
    city,
    department,
    symptoms,
    previousFileNo,
    bookedBy,
    bookingChannel,
    bookedByName
  } = data;

  // Validation
  if (!doctorId || !date || !timeSlot || !patientName || !patientPhone) {
    return {
      status: 400,
      error: "Missing required fields: doctorId, date, timeSlot, patientName, patientPhone are required."
    };
  }

  const cleanPhone = String(patientPhone).replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return {
      status: 400,
      error: "Please provide a valid 10-digit mobile number."
    };
  }

  const db = getDb();
  const doctor = db.doctors.find(d => d.id === parseInt(doctorId));
  if (!doctor) {
    return { status: 404, error: "Selected doctor not found." };
  }

  // Anti-collision check: Ensure slot is not already taken
  const collision = db.appointments.find(
    a => a.doctorId === doctor.id && a.date === date && a.timeSlot === timeSlot && a.status !== 'Cancelled'
  );

  if (collision) {
    return {
      status: 409,
      error: "Slot Already Booked",
      message: `The slot ${timeSlot} on ${date} for ${doctor.name} has already been reserved. Please pick another slot.`
    };
  }

  // Generate unique appointment ID
  const appointmentId = generateAppointmentId();

  const isMorning = timeSlot.includes("AM") || timeSlot.startsWith("12:00") || timeSlot.startsWith("12:30");
  const session = isMorning ? "Morning" : "Evening";

  const newAppointment = {
    id: appointmentId,
    patientName: patientName.trim(),
    patientPhone: cleanPhone,
    patientEmail: (patientEmail || "").trim(),
    patientAge: patientAge ? parseInt(patientAge) : null,
    patientGender: patientGender || "Not Specified",
    city: (city || "Modasa").trim(),
    previousFileNo: (previousFileNo || "").trim(),
    doctorId: doctor.id,
    doctorName: doctor.name,
    doctorSpecialty: doctor.specialty,
    room: doctor.room,
    department: department || doctor.specialty,
    date,
    timeSlot,
    session,
    symptoms: (symptoms || "General medical consultation").trim(),
    status: "Confirmed",
    reportingTime: calculateReportingTime(timeSlot),
    bookedBy: bookedBy || "Patient",
    bookingChannel: bookingChannel || "Online Website",
    bookedByName: (bookedByName || "").trim() || (bookedBy === 'Staff' ? 'Reception Desk' : bookedBy === 'Doctor' ? 'Doctor OPD' : 'Self (Online)'),
    createdAt: new Date().toISOString(),
    instructions: "Please arrive 15 minutes before your scheduled slot. Bring your previous hospital file or medical documents."
  };

  // Click-to-chat link to the hospital's WhatsApp desk
  newAppointment.whatsappLink = generateWhatsAppLink(newAppointment);

  // Save to database
  db.appointments.unshift(newAppointment);
  saveDb(db);

  return {
    status: 201,
    success: true,
    message: "Appointment confirmed successfully!",
    appointment: newAppointment
  };
}

/**
 * Get appointment by ID
 */
export function getAppointmentById(id) {
  const db = getDb();
  return db.appointments.find(a => a.id.toUpperCase() === id.toUpperCase());
}

/**
 * Lookup appointments by phone or Token ID
 */
export function lookupAppointments(query) {
  const cleanQuery = query.trim().toUpperCase();
  const cleanDigits = query.replace(/\D/g, '');
  const db = getDb();

  return db.appointments.filter(a => {
    const phoneMatch = cleanDigits.length >= 6 && a.patientPhone.includes(cleanDigits);
    const idMatch = a.id.toUpperCase() === cleanQuery;
    return phoneMatch || idMatch;
  });
}

/**
 * Cancel an appointment (releases slot)
 */
export function cancelAppointment(id) {
  const db = getDb();
  const index = db.appointments.findIndex(a => a.id.toUpperCase() === id.toUpperCase());
  if (index === -1) {
    return { status: 404, error: "Appointment not found." };
  }

  db.appointments[index].status = "Cancelled";
  db.appointments[index].cancelledAt = new Date().toISOString();
  saveDb(db);

  return {
    status: 200,
    success: true,
    message: "Appointment cancelled successfully. The slot is now released.",
    appointment: db.appointments[index]
  };
}

/**
 * Admin: Get all appointments with optional filters
 */
export function getAllAppointments(filters = {}) {
  const { doctorId, date, status, search } = filters;
  const db = getDb();
  let list = [...db.appointments];

  if (doctorId) {
    list = list.filter(a => a.doctorId === parseInt(doctorId));
  }
  if (date) {
    list = list.filter(a => a.date === date);
  }
  if (status) {
    list = list.filter(a => a.status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(a =>
      a.patientName.toLowerCase().includes(s) ||
      a.patientPhone.includes(s) ||
      a.id.toLowerCase().includes(s)
    );
  }

  return {
    total: list.length,
    appointments: list
  };
}

/**
 * Admin: Update appointment status
 */
export function updateAppointmentStatus(id, newStatus) {
  const db = getDb();
  const index = db.appointments.findIndex(a => a.id.toUpperCase() === id.toUpperCase());
  if (index === -1) {
    return { status: 404, error: "Appointment not found" };
  }

  db.appointments[index].status = newStatus;
  db.appointments[index].updatedAt = new Date().toISOString();
  saveDb(db);

  return {
    status: 200,
    success: true,
    appointment: db.appointments[index]
  };
}

/**
 * Admin: Summary statistics
 */
export function getAdminStats() {
  const db = getDb();
  const total = db.appointments.length;
  const confirmed = db.appointments.filter(a => a.status === "Confirmed").length;
  const completed = db.appointments.filter(a => a.status === "Completed").length;
  const cancelled = db.appointments.filter(a => a.status === "Cancelled").length;

  const nextWeekDays = calculateNextWeekDates().map(d => d.date);
  const nextWeekBookings = db.appointments.filter(
    a => nextWeekDays.includes(a.date) && a.status !== "Cancelled"
  ).length;

  return {
    total,
    confirmed,
    completed,
    cancelled,
    nextWeekBookings,
    totalDoctors: db.doctors.length
  };
}
