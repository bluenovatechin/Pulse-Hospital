// ========================================================
// Pulse Hospital - WhatsApp click-to-chat link
// Builds the "click to chat" link stored on each appointment.
// Nothing is sent automatically.
// ========================================================

import { HOSPITAL_METADATA } from '../config/hospitalInfo.js';

// Hospital's WhatsApp desk (original numbers 95120 45641 & 95120 45642 are commented out)
export const ACTIVE_WHATSAPP_NUMBER = "916353344875";

/**
 * Format the structured appointment message for WhatsApp
 */
export function formatAppointmentWhatsAppMessage(appointment) {
  return (
    `🏥 *NEW APPOINTMENT BOOKED - PULSE HOSPITAL & I.C.U*\n` +
    `-----------------------------------------\n` +
    `🆔 *Token ID:* ${appointment.id}\n` +
    `👤 *Patient Name:* ${appointment.patientName}\n` +
    `📞 *Patient Phone:* +91 ${appointment.patientPhone}\n` +
    `🎂 *Age / Gender:* ${appointment.patientAge ? appointment.patientAge + ' Yrs' : 'N/A'} • ${appointment.patientGender}\n` +
    `📍 *City / Area:* ${appointment.city || 'Modasa'}\n` +
    (appointment.previousFileNo ? `📁 *Previous File No:* ${appointment.previousFileNo}\n` : '') +
    `🩺 *Consulting Doctor:* ${appointment.doctorName}\n` +
    `🔬 *Specialty:* ${appointment.doctorSpecialty}\n` +
    `📅 *Scheduled Date:* ${appointment.date}\n` +
    `⏰ *Slot Time:* ${appointment.timeSlot}\n` +
    `🏢 *Room:* ${appointment.room}\n` +
    `📝 *Symptoms / Reason:* ${appointment.symptoms || 'General consultation'}\n` +
    `📋 *Booked By:* ${appointment.bookedBy === 'Staff' ? '🏥 Hospital Staff / Reception' : appointment.bookedBy === 'Doctor' ? '🩺 Doctor / OPD Desk' : '👤 Patient (Self / Online)'} (${appointment.bookedByName || appointment.bookingChannel || 'Online'})\n` +
    `-----------------------------------------\n` +
    `⚠️ *Important Notice:* "Please bring this file and previous medical reports on your next visit."\n` +
    `📍 *Location:* 4th Floor, City Centre, Shamlaji Road, Modasa\n` +
    `📞 *Hospital Contact:* ${HOSPITAL_METADATA.appointmentNumber}`
  );
}

/**
 * Click-to-chat URL (stored on the appointment record)
 */
export function generateWhatsAppLink(appointment) {
  const encodedText = encodeURIComponent(formatAppointmentWhatsAppMessage(appointment));
  return `https://api.whatsapp.com/send?phone=${ACTIVE_WHATSAPP_NUMBER}&text=${encodedText}`;
}
