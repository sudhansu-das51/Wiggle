import { buildMailtoUrl } from './contact.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Returns matching program object from URL query parameter ?program={slug}, or null.
 * @param {URLSearchParams} searchParams
 * @param {Array<any>} programs
 * @returns {any | null}
 */
export function getProgramFromSearch(searchParams, programs = []) {
  if (!searchParams) return null;
  const slug = searchParams.get('program');
  if (!slug) return null;
  return programs.find((p) => p.slug === slug) || null;
}

/**
 * Returns options for preferred start month dropdown:
 * "As soon as possible", next 6 upcoming months, and "Not sure yet".
 * @param {Date} [now=new Date()]
 * @returns {Array<{ value: string, label: string }>}
 */
export function getStartMonthOptions(now = new Date()) {
  const options = [
    { value: 'As soon as possible', label: 'As soon as possible' },
  ];

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  for (let i = 0; i < 6; i++) {
    const targetDate = new Date(currentYear, currentMonth + i, 1);
    const monthName = MONTH_NAMES[targetDate.getMonth()];
    const year = targetDate.getFullYear();
    const label = `${monthName} ${year}`;
    options.push({ value: label, label });
  }

  options.push({ value: 'Not sure yet', label: 'Not sure yet' });
  return options;
}

/**
 * Builds plain-text enquiry message omitting any empty fields.
 * Respects admissions.open (enquire vs waiting list).
 * @param {Record<string, any>} values
 * @param {{ brand?: { name?: string }, admissions?: { open?: boolean, session?: string } }} config
 * @returns {string}
 */
export function buildEnquiryMessage(values = {}, { brand, admissions } = {}) {
  const brandName = brand?.name || 'Wiggle';
  const session = admissions?.session || '2026-27';
  const isOpen = admissions?.open !== false;

  const header = isOpen
    ? `Hi ${brandName}! I would like to enquire about admission for ${session}.`
    : `Hi ${brandName}! I would like to join the waiting list for ${session}.`;

  const lines = [header, ''];

  if (values.parentName) lines.push(`Parent: ${values.parentName}`);
  if (values.phone) lines.push(`Phone: ${values.phone}`);
  if (values.email) lines.push(`Email: ${values.email}`);
  if (values.contactPreference) lines.push(`Best way to reach me: ${values.contactPreference}`);
  if (values.childName) lines.push(`Child: ${values.childName}`);
  if (values.childAge) lines.push(`Child's age: ${values.childAge}`);
  if (values.program) lines.push(`Program: ${values.program}`);
  if (values.startMonth) lines.push(`Start: ${values.startMonth}`);

  // Visit details
  if (values.wantVisit === 'yes') {
    if (values.visitDate && values.visitSlot) {
      lines.push(`Visit: ${values.visitDate} (${values.visitSlot})`);
    } else if (values.visitDate) {
      lines.push(`Visit: ${values.visitDate}`);
    } else if (values.visitSlot) {
      lines.push(`Visit: ${values.visitSlot}`);
    } else {
      lines.push('Visit: Yes, requested');
    }
  }

  if (values.message && values.message.trim()) {
    lines.push(`Message: ${values.message.trim()}`);
  }

  return lines.join('\n');
}

/**
 * Builds mailto: URL for admission enquiry.
 * @param {Record<string, any>} values
 * @param {{ brand?: any, admissions?: any, contact?: any }} config
 * @returns {string}
 */
export function buildEnquiryMailto(values = {}, { brand, admissions, contact } = {}) {
  const to = admissions?.email || contact?.email || 'hello@wigglepreschool.in';
  const subject = `Admission enquiry from ${values.parentName || 'Parent'}`;
  const body = buildEnquiryMessage(values, { brand, admissions });
  return buildMailtoUrl({ to, subject, body });
}
