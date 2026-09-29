// ========================================================
// Pulse Hospital - Global Server & Schedule Constants
// ========================================================

export const SERVER_CONFIG = {
  PORT: process.env.PORT || 5000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};

// 30-Minute OPD Morning Slots (09:00 AM - 01:00 PM)
export const MORNING_SLOTS = [
  "09:00 AM - 09:30 AM",
  "09:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "12:00 PM - 12:30 PM",
  "12:30 PM - 01:00 PM"
];

// 30-Minute OPD Evening Slots (04:30 PM - 08:00 PM)
export const EVENING_SLOTS = [
  "04:30 PM - 05:00 PM",
  "05:00 PM - 05:30 PM",
  "05:30 PM - 06:00 PM",
  "06:00 PM - 06:30 PM",
  "06:30 PM - 07:00 PM",
  "07:00 PM - 07:30 PM",
  "07:30 PM - 08:00 PM"
];

export const ALL_SLOTS = [...MORNING_SLOTS, ...EVENING_SLOTS];

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
