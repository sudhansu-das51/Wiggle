import { parseTimeRange } from './time.js';
import { siteConfig } from '../config/siteConfig.js';

/**
 * Safely parses an ISO date string "YYYY-MM-DD" into local numerical parts.
 * Never uses new Date(string) to avoid timezone shifts.
 *
 * @param {string} dateStr
 * @returns {{ year: number, monthIndex: number, day: number } | null}
 */
export function parseDateParts(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [year, month, day] = parts;
  return { year, monthIndex: month - 1, day };
}

/**
 * Returns a local Date object representing the start of an event.
 * If time is unreadable, returns 00:00:00 on the event date.
 *
 * @param {{ date: string, time?: string }} event
 * @returns {Date}
 */
export function getEventStart(event) {
  const parts = parseDateParts(event?.date);
  if (!parts) return new Date();

  const { start } = parseTimeRange(event?.time);
  if (start === null) {
    // All-day event starts at 00:00:00 local time
    return new Date(parts.year, parts.monthIndex, parts.day, 0, 0, 0, 0);
  }

  const hours = Math.floor(start / 60);
  const minutes = start % 60;
  return new Date(parts.year, parts.monthIndex, parts.day, hours, minutes, 0, 0);
}

/**
 * Returns a local Date object representing the end of an event.
 * If time is unreadable, returns 23:59:59 on the event date.
 * If end time is missing, defaults to start time + 2 hours.
 *
 * @param {{ date: string, time?: string }} event
 * @returns {Date}
 */
export function getEventEnd(event) {
  const parts = parseDateParts(event?.date);
  if (!parts) return new Date();

  const { start, end } = parseTimeRange(event?.time);
  if (start === null) {
    // All-day event ends at 23:59:59 local time
    return new Date(parts.year, parts.monthIndex, parts.day, 23, 59, 59, 999);
  }

  if (end !== null) {
    const hours = Math.floor(end / 60);
    const minutes = end % 60;
    return new Date(parts.year, parts.monthIndex, parts.day, hours, minutes, 0, 0);
  }

  // Fallback: start plus 2 hours
  const hours = Math.floor(start / 60) + 2;
  const minutes = start % 60;
  return new Date(parts.year, parts.monthIndex, parts.day, hours, minutes, 0, 0);
}

/**
 * Determines whether an event is upcoming or currently active.
 *
 * @param {{ date: string, time?: string }} event
 * @param {Date} [now=new Date()]
 * @returns {boolean}
 */
export function isUpcoming(event, now = new Date()) {
  const end = getEventEnd(event);
  return end.getTime() >= now.getTime();
}

/**
 * Sorts an array of events chronologically by start date/time.
 *
 * @param {Array<Object>} events
 * @returns {Array<Object>}
 */
export function sortEvents(events) {
  if (!Array.isArray(events)) return [];
  return [...events].sort((a, b) => getEventStart(a).getTime() - getEventStart(b).getTime());
}

/**
 * Returns a formatted "YYYY-MM" string for a Date or date string.
 *
 * @param {Date|string} date
 * @returns {string}
 */
export function monthKey(date) {
  if (typeof date === 'string') {
    const parts = parseDateParts(date);
    if (parts) {
      const m = String(parts.monthIndex + 1).padStart(2, '0');
      return `${parts.year}-${m}`;
    }
  }
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

/**
 * Builds a 6-week x 7-day grid (42 days) for a given year and month.
 *
 * @param {number} year - Full year (e.g. 2026)
 * @param {number} month - 0-indexed month (0 = Jan .. 11 = Dec)
 * @param {number} [weekStartsOn=1] - 0 = Sunday, 1 = Monday
 * @returns {Array<{
 *   date: Date,
 *   iso: string,
 *   dayNumber: number,
 *   inMonth: boolean,
 *   isWeekend: boolean,
 *   isToday: boolean,
 *   year: number,
 *   month: number
 * }>} Flat array of 42 days with .rows property containing 6 arrays of 7 days.
 */
export function buildMonthGrid(year, month, weekStartsOn = 1) {
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sun .. 6 = Sat

  // Offset from week start
  const startOffset = (firstDayWeekday - weekStartsOn + 7) % 7;

  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const days = [];
  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(year, month, 1 - startOffset + i);
    const cellYear = cellDate.getFullYear();
    const cellMonth = cellDate.getMonth();
    const cellDayNumber = cellDate.getDate();
    const iso = `${cellYear}-${String(cellMonth + 1).padStart(2, '0')}-${String(cellDayNumber).padStart(2, '0')}`;
    const weekday = cellDate.getDay();
    const isWeekend = weekday === 0 || weekday === 6;

    days.push({
      date: cellDate,
      iso,
      dayNumber: cellDayNumber,
      inMonth: cellMonth === month,
      isWeekend,
      isToday: iso === todayIso,
      year: cellYear,
      month: cellMonth,
    });
  }

  // Create rows convenience property
  const rows = [];
  for (let r = 0; r < 6; r++) {
    rows.push(days.slice(r * 7, (r + 1) * 7));
  }
  days.rows = rows;

  return days;
}

/**
 * Builds a Google Calendar URL with floating local times or all-day dates.
 *
 * @param {Object} event
 * @returns {string}
 */
export function buildGoogleCalendarUrl(event) {
  if (!event) return '#';

  const parts = parseDateParts(event.date);
  if (!parts) return '#';

  const { start: startMinutes } = parseTimeRange(event.time);
  const pad2 = (n) => String(n).padStart(2, '0');

  let datesParam = '';
  if (startMinutes === null) {
    // All-day: start date to next day date
    const startStr = `${parts.year}${pad2(parts.monthIndex + 1)}${pad2(parts.day)}`;
    const nextDay = new Date(parts.year, parts.monthIndex, parts.day + 1);
    const endStr = `${nextDay.getFullYear()}${pad2(nextDay.getMonth() + 1)}${pad2(nextDay.getDate())}`;
    datesParam = `${startStr}/${endStr}`;
  } else {
    // Floating local time YYYYMMDDTHHmmss (no Z)
    const startDate = getEventStart(event);
    const endDate = getEventEnd(event);
    const sYear = startDate.getFullYear();
    const sMonth = pad2(startDate.getMonth() + 1);
    const sDay = pad2(startDate.getDate());
    const sHour = pad2(startDate.getHours());
    const sMin = pad2(startDate.getMinutes());
    const sSec = '00';

    const eYear = endDate.getFullYear();
    const eMonth = pad2(endDate.getMonth() + 1);
    const eDay = pad2(endDate.getDate());
    const eHour = pad2(endDate.getHours());
    const eMin = pad2(endDate.getMinutes());
    const eSec = '00';

    datesParam = `${sYear}${sMonth}${sDay}T${sHour}${sMin}${sSec}/${eYear}${eMonth}${eDay}T${eHour}${eMin}${eSec}`;
  }

  const title = encodeURIComponent(event.title || 'Wiggle Event');
  const details = encodeURIComponent(event.description || '');
  const location = encodeURIComponent(event.location || '');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}`;
}

/**
 * Escapes characters for iCalendar format according to RFC 5545.
 *
 * @param {string} text
 * @returns {string}
 */
function escapeIcsText(text) {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Builds a valid iCalendar string (.ics) for an array of events.
 * Uses CRLF line endings, UTC DTSTAMP, and local floating DTSTART/DTEND.
 *
 * @param {Array<Object>} events
 * @returns {string}
 */
export function buildIcs(events) {
  const eventList = Array.isArray(events) ? events : [events];
  const pad2 = (n) => String(n).padStart(2, '0');

  // DTSTAMP in UTC
  const now = new Date();
  const dtstamp = `${now.getUTCFullYear()}${pad2(now.getUTCMonth() + 1)}${pad2(now.getUTCDate())}T${pad2(now.getUTCHours())}${pad2(now.getUTCMinutes())}${pad2(now.getUTCSeconds())}Z`;

  const brandSlug = (siteConfig?.brand?.name || 'wiggle').toLowerCase().replace(/\s+/g, '-');
  const domain = `${brandSlug}.wigglepreschool.in`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wiggle Preschool//Events Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const event of eventList) {
    if (!event || !event.date) continue;

    const parts = parseDateParts(event.date);
    if (!parts) continue;

    const { start: startMinutes } = parseTimeRange(event.time);
    const slug = event.slug || `event-${parts.year}-${parts.monthIndex + 1}-${parts.day}`;
    const uid = `${slug}@${domain}`;

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dtstamp}`);

    if (startMinutes === null) {
      // All-day: VALUE=DATE
      const sDate = `${parts.year}${pad2(parts.monthIndex + 1)}${pad2(parts.day)}`;
      const nextDay = new Date(parts.year, parts.monthIndex, parts.day + 1);
      const eDate = `${nextDay.getFullYear()}${pad2(nextDay.getMonth() + 1)}${pad2(nextDay.getDate())}`;
      lines.push(`DTSTART;VALUE=DATE:${sDate}`);
      lines.push(`DTEND;VALUE=DATE:${eDate}`);
    } else {
      // Floating local time
      const startDate = getEventStart(event);
      const endDate = getEventEnd(event);
      const sStr = `${startDate.getFullYear()}${pad2(startDate.getMonth() + 1)}${pad2(startDate.getDate())}T${pad2(startDate.getHours())}${pad2(startDate.getMinutes())}00`;
      const eStr = `${endDate.getFullYear()}${pad2(endDate.getMonth() + 1)}${pad2(endDate.getDate())}T${pad2(endDate.getHours())}${pad2(endDate.getMinutes())}00`;
      lines.push(`DTSTART:${sStr}`);
      lines.push(`DTEND:${eStr}`);
    }

    lines.push(`SUMMARY:${escapeIcsText(event.title || 'Wiggle Event')}`);
    if (event.description) {
      lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
    }
    if (event.location) {
      lines.push(`LOCATION:${escapeIcsText(event.location)}`);
    }
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  // RFC 5545 requires CRLF line endings
  return lines.join('\r\n') + '\r\n';
}

/**
 * Client-side file downloader for .ics or other calendar files.
 *
 * @param {string} filename
 * @param {string} content
 * @param {string} [mime='text/calendar;charset=utf-8']
 */
export function downloadFile(filename, content, mime = 'text/calendar;charset=utf-8') {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
