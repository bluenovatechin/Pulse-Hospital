// ========================================================
// Pulse Hospital - Staff & Receptionist Admin Controller
// ========================================================

import * as appointmentService from '../services/appointmentService.js';

export function getAdminAppointmentsHandler(req, res) {
  try {
    const data = appointmentService.getAllAppointments(req.query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to query appointments", details: err.message });
  }
}

export function updateAppointmentStatusHandler(req, res) {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Missing status field" });
  }

  try {
    const result = appointmentService.updateAppointmentStatus(req.params.id, status);
    res.status(result.status || 200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status", details: err.message });
  }
}

export function getAdminStatsHandler(req, res) {
  try {
    const stats = appointmentService.getAdminStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate stats", details: err.message });
  }
}
