// ========================================================
// Pulse Hospital - Hospital Info & Health Controller
// ========================================================

import { HOSPITAL_METADATA } from '../config/hospitalInfo.js';

export function getHealthHandler(req, res) {
  res.json({
    status: "healthy",
    hospital: HOSPITAL_METADATA.nameEnglish,
    timestamp: new Date().toISOString()
  });
}

export function getHospitalInfoHandler(req, res) {
  res.json(HOSPITAL_METADATA);
}
