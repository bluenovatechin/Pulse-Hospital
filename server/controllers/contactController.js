// ========================================================
// Pulse Hospital - Contact & Inquiry Controller
// ========================================================

import { getDb, saveDb } from '../models/storage.js';
import { generateMessageId } from '../utils/idGenerator.js';

export function submitContactHandler(req, res) {
  const { name, phone, email, subject, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ error: "Name, phone, and message are required." });
  }

  try {
    const db = getDb();
    const contactMsg = {
      id: generateMessageId(),
      name: name.trim(),
      phone: phone.trim(),
      email: (email || "").trim(),
      subject: subject || "General Inquiry",
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    db.contactMessages.unshift(contactMsg);
    saveDb(db);

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out to Pulse Hospital. Our reception desk will contact you shortly."
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit message", details: err.message });
  }
}
