// Appointment storage on this device only (no server).
//
// Privacy rules:
// - Nothing is listed automatically. A booking opens only when BOTH its
//   booking ID and the mobile number used for it match exactly.
// - Once verified (or right after booking), the booking is "unlocked" for
//   this browser tab only (sessionStorage). Closing the tab locks it again.
// - Bookings are deleted from the device 30 days after the visit date.

const KEY = 'pulse_hospital_appointments';
const UNLOCK_KEY = 'pulse_unlocked_appointments';
const KEEP_DAYS_AFTER_VISIT = 30;

const digits = (s) => String(s || '').replace(/\D/g, '');
// Compare Indian mobile numbers on their last 10 digits (ignores +91 / 0)
const samePhone = (a, b) => {
  const x = digits(a).slice(-10);
  const y = digits(b).slice(-10);
  return x.length === 10 && x === y;
};
const sameId = (a, b) => String(a || '').trim().toUpperCase() === String(b || '').trim().toUpperCase();

function readAll() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked: nothing else to do */
  }
}

/** Remove bookings whose visit date is more than 30 days ago */
export function pruneOld() {
  const cutoff = Date.now() - KEEP_DAYS_AFTER_VISIT * 24 * 60 * 60 * 1000;
  const all = readAll();
  const kept = all.filter((a) => {
    const t = Date.parse(a.date || a.bookedAt || '');
    return Number.isNaN(t) || t >= cutoff;
  });
  if (kept.length !== all.length) writeAll(kept);
}

export function saveAppointment(appt) {
  pruneOld();
  writeAll([appt, ...readAll().filter((a) => a.id !== appt.id)]);
  unlock(appt.id);
}

/** Exact match on booking ID + mobile number; returns the booking or null */
export function findVerified(id, phone) {
  pruneOld();
  return readAll().find((a) => sameId(a.id, id) && samePhone(a.patientPhone, phone)) || null;
}

function unlockedSet() {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(UNLOCK_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

export function unlock(id) {
  try {
    const s = unlockedSet();
    s.add(String(id).toUpperCase());
    sessionStorage.setItem(UNLOCK_KEY, JSON.stringify([...s]));
  } catch {
    /* ignore */
  }
}

/** The booking, only if it was verified (or made) in this tab */
export function getUnlocked(id) {
  if (!unlockedSet().has(String(id || '').toUpperCase())) return null;
  return readAll().find((a) => sameId(a.id, id)) || null;
}

export function cancelAppointment(id) {
  const all = readAll().map((a) => (sameId(a.id, id) ? { ...a, status: 'Cancelled' } : a));
  writeAll(all);
  return all.find((a) => sameId(a.id, id)) || null;
}

// Booking status: a new booking is "Requested" (sent to reception on
// WhatsApp); it can be "Cancelled" by the patient.
export const STATUS = { REQUESTED: 'Requested', CANCELLED: 'Cancelled' };

/** Slots this device has already booked for a doctor on a date: { "09:00 AM - 09:30 AM": status } */
export function deviceBookedSlots(doctorId, date) {
  const map = {};
  readAll().forEach((a) => {
    if (Number(a.doctorId) === Number(doctorId) && a.date === date && a.status !== STATUS.CANCELLED) {
      map[a.timeSlot] = a.status;
    }
  });
  return map;
}
