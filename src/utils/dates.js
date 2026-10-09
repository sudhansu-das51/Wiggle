/**
 * Formats an ISO date string (YYYY-MM-DD) into display components for tickets and cards.
 * @param {string} isoString - Date string like "2026-11-15"
 * @returns {{ day: string, month: string, weekday: string, full: string }}
 */
export function formatEventDate(isoString) {
  if (!isoString) {
    return { day: '--', month: '---', weekday: '---', full: 'Date to be announced' };
  }

  // Use parts from split or Date object safely across timezones
  const [year, monthNum, dayNum] = isoString.split('-').map(Number);
  const date = new Date(year, monthNum - 1, dayNum);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const day = String(dayNum).padStart(2, '0');
  const month = months[monthNum - 1] || 'Jan';
  const weekday = weekdays[date.getDay()] || '';
  const fullMonth = fullMonths[monthNum - 1] || '';
  const full = `${day} ${fullMonth} ${year}`;

  return { day, month, weekday, full };
}

/**
 * Checks whether a role's closing date is still open (today or later, or null).
 * Uses local date construction to avoid timezone shifts.
 * @param {string | null} closing - "YYYY-MM-DD" or null
 * @returns {boolean}
 */
export function isRoleOpen(closing) {
  if (!closing) return true;
  const parts = closing.split('-').map(Number);
  if (parts.length !== 3) return true;
  const [year, month, day] = parts;
  const closingDate = new Date(year, month - 1, day, 23, 59, 59, 999);
  return closingDate >= new Date();
}

/**
 * Formats a role's closing date into "Apply by {date}" or "Open until filled".
 * @param {string | null} closing - "YYYY-MM-DD" or null
 * @returns {string}
 */
export function formatClosingDate(closing) {
  if (!closing) return 'Open until filled';
  const { full } = formatEventDate(closing);
  return `Apply by ${full}`;
}
