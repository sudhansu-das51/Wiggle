/**
 * Parses the first clock time in a string and returns minutes since midnight.
 * Examples:
 *   "9:00 am" -> 540
 *   "9.30 AM" -> 570
 *   "12:00 pm to 12:30 pm" -> 720
 *   "12:00 am" -> 0
 *   "1:15 pm" -> 795
 *
 * @param {string} str
 * @returns {number|null} Minutes since midnight (0..1439) or null if unreadable.
 */
export function parseTimeToMinutes(str) {
  if (!str || typeof str !== 'string') return null;

  // Match pattern: 1-2 digits, optional [:.] and 2 digits, optional spaces, and am/pm (case insensitive)
  const match = str.match(/(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3].toLowerCase();

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
    return null;
  }

  if (meridiem === 'am') {
    if (hours === 12) hours = 0;
  } else if (meridiem === 'pm') {
    if (hours !== 12) hours += 12;
  }

  return hours * 60 + minutes;
}

/**
 * Parses time range strings such as "10:00 am to 12:00 pm" or "9:30 am - 1:00 pm".
 *
 * @param {string} str
 * @returns {{ start: number|null, end: number|null }}
 */
export function parseTimeRange(str) {
  if (!str || typeof str !== 'string') {
    return { start: null, end: null };
  }

  // Find all clock time tokens in the string
  const timeRegex = /\b(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)\b/gi;
  const matches = [...str.matchAll(timeRegex)];

  if (matches.length === 0) {
    return { start: null, end: null };
  }

  const parseMatch = (match) => {
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const meridiem = match[3].toLowerCase();

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
      return null;
    }

    if (meridiem === 'am') {
      if (hours === 12) hours = 0;
    } else if (meridiem === 'pm') {
      if (hours !== 12) hours += 12;
    }

    return hours * 60 + minutes;
  };

  const start = parseMatch(matches[0]);
  const end = matches.length > 1 ? parseMatch(matches[1]) : null;

  return { start, end };
}
