// ========================================================
// Pulse Hospital - Appointment Controller
// Handles HTTP request/response for booking & slots
// ========================================================

import * as appointmentService from '../services/appointmentService.js';
import * as slotService from '../services/slotService.js';

/**
 * GET /api/next-week-schedule
 * Returns the upcoming 7 days of next week with slot availability
 */
export function getNextWeekScheduleHandler(req, res) {
  try {
    const schedule = slotService.getNextWeekSchedule();
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate schedule", details: err.message });
  }
}

/**
 * GET /api/slots?doctorId=X&date=YYYY-MM-DD
 * Returns morning & evening slots for a doctor on a specific date
 */
export function getSlotsHandler(req, res) {
  const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    return res.status(400).json({
      error: "Missing required query parameters: doctorId and date are required."
    });
  }

  try {
    const result = slotService.getDoctorSlots(doctorId, date);
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to query slots", details: err.message });
  }
}

/**
 * POST /api/appointments
 * Books a dedicated 30-minute slot for next week
 */
export function createAppointmentHandler(req, res) {
  try {
    const result = appointmentService.createAppointment(req.body);
    if (!result.success) {
      return res.status(result.status || 400).json(result);
    }
    res.status(result.status || 201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Booking process failed", details: err.message });
  }
}

/**
 * GET /api/appointments/:id
 * Retrieve appointment by Token ID
 */
export function getAppointmentByIdHandler(req, res) {
  try {
    const appt = appointmentService.getAppointmentById(req.params.id);
    if (!appt) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: "Lookup failed", details: err.message });
  }
}

/**
 * GET /api/appointments-lookup?query=...
 * Search by phone or Token ID
 */
export function lookupAppointmentsHandler(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Please provide a mobile number or Token ID to search." });
  }

  try {
    const list = appointmentService.lookupAppointments(query);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Lookup failed", details: err.message });
  }
}

/**
 * PATCH /api/appointments/:id/cancel
 * Cancel an appointment and release slot
 */
export function cancelAppointmentHandler(req, res) {
  try {
    const result = appointmentService.cancelAppointment(req.params.id);
    res.status(result.status || 200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Cancellation failed", details: err.message });
  }
}
