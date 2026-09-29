// ========================================================
// Pulse Hospital - Doctor Controller
// Provides doctor directory and individual doctor data
// ========================================================

import { getDb } from '../models/storage.js';

export function getAllDoctorsHandler(req, res) {
  try {
    const db = getDb();
    res.json(db.doctors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctors", details: err.message });
  }
}

export function getDoctorByIdHandler(req, res) {
  try {
    const db = getDb();
    const doc = db.doctors.find(d => d.id === parseInt(req.params.id));
    if (!doc) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctor", details: err.message });
  }
}
