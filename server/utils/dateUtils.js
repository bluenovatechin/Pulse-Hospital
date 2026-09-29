// ========================================================
// Pulse Hospital - Date & Time Utilities
// Solves timezone rollover bugs and calculates Next-Week slots
// ========================================================

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

/**
 * Format a Date object to YYYY-MM-DD in local time (avoids UTC offset day shifts)
 */
export function formatLocalDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get weekday name from YYYY-MM-DD date string
 */
export function getDayOfWeek(dateString) {
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return WEEKDAY_NAMES[d.getDay()];
  }
  return WEEKDAY_NAMES[new Date(dateString).getDay()];
}

/**
 * Calculate the exact 7 calendar dates for NEXT WEEK (Monday through Sunday)
 * This powers the advance next-week slot booking system.
 */
export function calculateNextWeekDates() {
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday

  // Calculate days until next Monday
  // If today is Monday (1), days until next Monday = 7
  // If today is Sunday (0), days until next Monday = 1
  let daysUntilNextMonday = ((1 - currentDayOfWeek + 7) % 7);
  if (daysUntilNextMonday === 0) {
    daysUntilNextMonday = 7; // Next Monday, not today
  }

  const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilNextMonday);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const dateObj = new Date(nextMonday.getFullYear(), nextMonday.getMonth(), nextMonday.getDate() + i);
    const dateStr = formatLocalDate(dateObj);
    const dayName = WEEKDAY_NAMES[dateObj.getDay()];
    const isSunday = dateObj.getDay() === 0;

    const formattedDisplay = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    days.push({
      date: dateStr,
      dayName,
      displayDate: formattedDisplay,
      isSunday,
      isAdvanceWeek: true
    });
  }

  return days;
}

/**
 * Computes recommended reporting time (15 mins prior to slot start)
 */
export function calculateReportingTime(timeSlot) {
  if (!timeSlot) return "15 minutes prior to slot";
  const startTime = timeSlot.split('-')[0]?.trim();
  return `${startTime} (Please arrive 15 minutes early)`;
}
