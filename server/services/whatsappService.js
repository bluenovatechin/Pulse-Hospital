// ========================================================
// Pulse Hospital - WhatsApp Appointment Notification Service
// Sends a WhatsApp message to hospital staff whenever a new
// appointment is booked.
//
// Pick a provider with environment variables (see server/.env.example):
//
//   WHATSAPP_PROVIDER=callmebot   Free, 2-minute setup, messages only
//                                 numbers that activated CallMeBot.
//     CALLMEBOT_RECIPIENTS=919876543210:APIKEY1,919812345678:APIKEY2
//
//   WHATSAPP_PROVIDER=meta        Official WhatsApp Cloud API (Meta).
//     META_WA_TOKEN, META_WA_PHONE_NUMBER_ID, WHATSAPP_NOTIFY_TO,
//     optional META_WA_TEMPLATE (+ META_WA_TEMPLATE_LANG)
//
// With no provider set, the message is only printed in the server log.
// A failed send never blocks or fails the booking.
// ========================================================

import { HOSPITAL_METADATA } from '../config/hospitalInfo.js';

// Hospital's WhatsApp desk used for the patient-side "click to chat" link.
// (Hospital's original numbers 95120 45641 & 95120 45642 are commented out.)
export const ACTIVE_WHATSAPP_NUMBER = process.env.HOSPITAL_WHATSAPP_NUMBER || "916353344875";

const PROVIDER = (process.env.WHATSAPP_PROVIDER || '').trim().toLowerCase();
const META_API_VERSION = 'v21.0';

/**
 * Full booking message (used in the click-to-chat link and CallMeBot / Meta text messages)
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

const csv = (value) => (value || '').split(',').map((s) => s.trim()).filter(Boolean);
const digitsOnly = (phone) => String(phone).replace(/\D/g, '');

// ---------- CallMeBot ----------
async function sendViaCallMeBot(text) {
  const recipients = csv(process.env.CALLMEBOT_RECIPIENTS).map((entry) => {
    const [phone, apikey] = entry.split(':').map((s) => s.trim());
    return { phone: digitsOnly(phone), apikey };
  });
  if (!recipients.length) throw new Error('CALLMEBOT_RECIPIENTS is empty (format: 919876543210:APIKEY)');

  return Promise.all(recipients.map(async ({ phone, apikey }) => {
    const url = `https://api.callmebot.com/whatsapp.php?phone=%2B${phone}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const body = await res.text();
    if (!res.ok || /error|invalid|not\s+active/i.test(body)) {
      throw new Error(`CallMeBot → +${phone}: HTTP ${res.status} ${body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200)}`);
    }
    return `+${phone}`;
  }));
}

// ---------- Meta WhatsApp Cloud API ----------
async function sendViaMeta(appointment, text) {
  const token = process.env.META_WA_TOKEN;
  const phoneNumberId = process.env.META_WA_PHONE_NUMBER_ID;
  const recipients = csv(process.env.WHATSAPP_NOTIFY_TO).map(digitsOnly);
  if (!token || !phoneNumberId) throw new Error('META_WA_TOKEN and META_WA_PHONE_NUMBER_ID are required');
  if (!recipients.length) throw new Error('WHATSAPP_NOTIFY_TO is empty (format: 919876543210)');

  const template = process.env.META_WA_TEMPLATE;
  // Business-initiated messages need an approved template. Its body must have
  // 5 variables: {{1}} token ID, {{2}} patient, {{3}} phone, {{4}} doctor, {{5}} date & slot.
  const message = template
    ? {
        type: 'template',
        template: {
          name: template,
          language: { code: process.env.META_WA_TEMPLATE_LANG || 'en' },
          components: [{
            type: 'body',
            parameters: [
              appointment.id,
              appointment.patientName,
              `+91 ${appointment.patientPhone}`,
              appointment.doctorName,
              `${appointment.date}, ${appointment.timeSlot}`
            ].map((t) => ({ type: 'text', text: String(t) }))
          }]
        }
      }
    : { type: 'text', text: { body: text } };

  return Promise.all(recipients.map(async (to) => {
    const res = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', to, ...message }),
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(`Meta → +${to}: HTTP ${res.status} ${body.error?.message || ''}`);
    }
    return `+${to}`;
  }));
}

/**
 * Sends the "new appointment" message to staff. Resolves (never rejects)
 * with { sent, sentTo, error } so callers can fire-and-forget.
 */
export async function notifyStaffOfAppointment(appointment) {
  const text = formatAppointmentWhatsAppMessage(appointment);
  try {
    let sentTo = [];
    if (PROVIDER === 'callmebot') sentTo = await sendViaCallMeBot(text);
    else if (PROVIDER === 'meta') sentTo = await sendViaMeta(appointment, text);
    else {
      console.log(`\n📲 [WHATSAPP] No WHATSAPP_PROVIDER set — booking ${appointment.id} logged only.`);
      return { sent: false, sentTo: [], error: 'No WHATSAPP_PROVIDER configured' };
    }
    console.log(`📲 [WHATSAPP] Booking ${appointment.id} sent to ${sentTo.join(', ')} via ${PROVIDER}`);
    return { sent: true, sentTo, error: null };
  } catch (err) {
    console.error(`📲 [WHATSAPP] Failed to send booking ${appointment.id}: ${err.message}`);
    return { sent: false, sentTo: [], error: err.message };
  }
}

