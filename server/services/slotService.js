// ========================================================
// Pulse Hospital - Slot Management Service
// Calculates real-time slot availability for next week
// ========================================================

import { MORNING_SLOTS, EVENING_SLOTS } from '../config/constants.js';
import { calculateNextWeekDates, getDayOfWeek } from '../utils/dateUtils.js';
import { getDb } from '../models/storage.js';

/**
 * Get Next-Week schedule days with summary stats
 */
export function getNextWeekSchedule() {
  const nextDays = calculateNextWeekDates();
  const db = getDb();

  return nextDays.map(day => {
    // Count active appointments on this day
    const dayAppointments = db.appointments.filter(
      a => a.date === day.date && a.status !== 'Cancelled'
    );
    
    // Total potential slots across doctors
    const totalSlots = (MORNING_SLOTS.length + EVENING_SLOTS.length) * (day.isSunday ? 2 : 4);
    const availableSlots = Math.max(0, totalSlots - dayAppointments.length);

    return {
      ...day,
      bookedCount: dayAppointments.length,
      availableSlots
    };
  });
}

/**
 * Get detailed morning & evening slots for a doctor on a specific date
 */
export function getDoctorSlots(doctorId, date) {
  const db = getDb();
  const doctor = db.doctors.find(d => d.id === parseInt(doctorId));

  if (!doctor) {
    return { error: "Doctor not found", status: 404 };
  }

  const dayOfWeek = getDayOfWeek(date);

  // Check if doctor operates on this day
  const isAvailableOnDay = doctor.availableDays.includes(dayOfWeek);
  if (!isAvailableOnDay) {
    return {
      doctorId: doctor.id,
      doctorName: doctor.name,
      date,
      dayOfWeek,
      isDoctorAvailable: false,
      message: `${doctor.name} is not available on ${dayOfWeek}s. Please select another day or doctor.`,
      morningSlots: [],
      eveningSlots: []
    };
  }

  // Find all booked appointments for this doctor on this date
  const bookedAppointments = db.appointments.filter(
    a => a.doctorId === doctor.id && a.date === date && a.status !== 'Cancelled'
  );

  const bookedMap = new Map();
  bookedAppointments.forEach(a => {
    bookedMap.set(a.timeSlot, a.id);
  });

  const morningSlots = MORNING_SLOTS.map(slot => ({
    time: slot,
    session: "Morning",
    isAvailable: !bookedMap.has(slot),
    appointmentId: bookedMap.get(slot) || null
  }));

  // On Sundays, evening slots are reserved for emergency triage
  const isSunday = dayOfWeek === "Sunday";
  const eveningSlots = (isSunday ? [] : EVENING_SLOTS).map(slot => ({
    time: slot,
    session: "Evening",
    isAvailable: !bookedMap.has(slot),
    appointmentId: bookedMap.get(slot) || null
  }));

  const totalAvailable = 
    morningSlots.filter(s => s.isAvailable).length + 
    eveningSlots.filter(s => s.isAvailable).length;

  return {
    doctorId: doctor.id,
    doctorName: doctor.name,
    doctorSpecialty: doctor.specialty,
    room: doctor.room,
    date,
    dayOfWeek,
    isDoctorAvailable: true,
    totalAvailable,
    morningSlots,
    eveningSlots
  };
}
