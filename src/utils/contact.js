import { parseTimeRange } from './time';

/**
 * Formats structured address object into single-line and multi-line strings.
 */
export function formatAddress(address) {
  if (!address) return { singleLine: '', multiLine: '' };
  if (typeof address === 'string') return { singleLine: address, multiLine: address };

  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean);

  const singleLine = parts.join(', ');
  const multiLine = [
    [address.line1, address.line2].filter(Boolean).join(', '),
    [address.city, address.state, address.pincode].filter(Boolean).join(', '),
  ].filter(Boolean).join('\n');

  return { singleLine, multiLine };
}

/**
 * Builds Google Maps directions URL from contact object.
 */
export function buildDirectionsUrl(contact) {
  if (contact?.directionsUrl) return contact.directionsUrl;
  const { singleLine } = formatAddress(contact?.address);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(singleLine)}`;
}

/**
 * Builds a mailto: link with properly encoded subject and body parameters.
 */
export function buildMailtoUrl({ to = '', subject = '', body = '' }) {
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${to}${query}`;
}

/**
 * Copies text to clipboard with modern API and fallback.
 */
export async function copyToClipboard(text) {
  if (!text) return false;
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to textarea fallback
  }

  try {
    if (typeof document !== 'undefined') {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.style.left = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const success = document.execCommand('copy');
      document.body.removeChild(ta);
      return success;
    }
  } catch {
    return false;
  }
  return false;
}

const DAY_MAP = {
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tuesday: 2,
  wed: 3, wednesday: 3,
  thu: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6,
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatMinutes(mins) {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const meridiem = h24 >= 12 ? 'pm' : 'am';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const mStr = m === 0 ? '' : `:${m < 10 ? '0' : ''}${m}`;
  return `${h12}${mStr} ${meridiem}`;
}

/**
 * Parses operating hours and determines current open/closed status.
 * @param {Array<{ days: string, time: string }>} hours
 * @param {Date} [now]
 * @returns {{ isOpen: boolean, label: string }|null}
 */
export function getOpenStatus(hours, now = new Date()) {
  if (!hours || !Array.isArray(hours) || hours.length === 0) return null;

  const parsedSchedules = [];

  for (const item of hours) {
    if (!item?.days || !item?.time) continue;

    // Strip parentheses from time string
    const cleanTime = item.time.replace(/\([^)]*\)/g, '').trim();
    const { start, end } = parseTimeRange(cleanTime);
    if (start === null || end === null) continue;

    // Parse days
    const cleanDays = item.days.toLowerCase().replace(/\([^)]*\)/g, '').trim();
    let daysList = [];

    if (cleanDays.includes(' to ') || cleanDays.includes('-')) {
      const parts = cleanDays.split(/\s*(?:to|-)\s*/);
      const startDay = DAY_MAP[parts[0]?.trim()];
      const endDay = DAY_MAP[parts[1]?.trim()];

      if (startDay !== undefined && endDay !== undefined) {
        let curr = startDay;
        while (true) {
          daysList.push(curr);
          if (curr === endDay) break;
          curr = (curr + 1) % 7;
        }
      }
    } else {
      const day = DAY_MAP[cleanDays];
      if (day !== undefined) {
        daysList.push(day);
      }
    }

    if (daysList.length > 0) {
      parsedSchedules.push({ days: daysList, start, end, originalTime: cleanTime });
    }
  }

  if (parsedSchedules.length === 0) return null;

  const currentDay = now.getDay();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  // Check if open right now
  for (const sched of parsedSchedules) {
    if (sched.days.includes(currentDay)) {
      if (currentMins >= sched.start && currentMins < sched.end) {
        return {
          isOpen: true,
          label: `Open now, until ${formatMinutes(sched.end)}`,
        };
      }
    }
  }

  // Find next upcoming opening window
  for (let offset = 0; offset <= 7; offset++) {
    const targetDay = (currentDay + offset) % 7;
    for (const sched of parsedSchedules) {
      if (sched.days.includes(targetDay)) {
        if (offset === 0) {
          // Same day: is opening later today?
          if (currentMins < sched.start) {
            return {
              isOpen: false,
              label: `Closed. Opens today at ${formatMinutes(sched.start)}`,
            };
          }
        } else {
          const dayLabel = offset === 1 ? 'tomorrow' : DAY_NAMES[targetDay];
          return {
            isOpen: false,
            label: `Closed. Opens ${dayLabel} at ${formatMinutes(sched.start)}`,
          };
        }
      }
    }
  }

  return { isOpen: false, label: 'Closed' };
}
