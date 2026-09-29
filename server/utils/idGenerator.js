// ========================================================
// Pulse Hospital - Unique Identifier Generator
// ========================================================

/**
 * Generate human-readable Token ID for hospital appointment slips
 * Format: PLS-XXXXXX (e.g., PLS-782914)
 */
export function generateAppointmentId() {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `PLS-${randomSuffix}`;
}

/**
 * Generate unique inquiry reference for contact form submissions
 * Format: MSG-XXXXXX
 */
export function generateMessageId() {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `MSG-${randomSuffix}`;
}
