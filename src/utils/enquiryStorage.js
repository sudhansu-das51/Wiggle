import { initialEnquiries } from '../data/initialEnquiries';

const STORAGE_KEY = 'wiggle_admission_enquiries_v1';
const EVENT_NAME = 'wiggle:enquiries-updated';

/**
 * Retrieves all enquiries from localStorage. If none exist, initializes with initialEnquiries.
 * @returns {Array<Object>}
 */
export function getEnquiries() {
  if (typeof window === 'undefined') return initialEnquiries;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEnquiries));
      return initialEnquiries;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialEnquiries;
  } catch (err) {
    console.error('Error reading enquiries from localStorage:', err);
    return initialEnquiries;
  }
}

/**
 * Persists updated list of enquiries to localStorage and broadcasts update event.
 * @param {Array<Object>} list
 */
function persistEnquiries(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: list }));
  } catch (err) {
    console.error('Error saving enquiries to localStorage:', err);
  }
}

/**
 * Saves a new admission enquiry submitted from the EnquiryWizard or Admin.
 * @param {Object} formData
 * @param {string} [channel='WhatsApp']
 * @returns {Object} savedEnquiry
 */
export function saveEnquiry(formData, channel = 'WhatsApp') {
  const current = getEnquiries();
  const idNumber = Math.floor(100 + Math.random() * 900);
  const newEnquiry = {
    id: `ENQ-2026-${idNumber}`,
    timestamp: new Date().toISOString(),
    parentName: formData.parentName || 'Parent',
    phone: formData.phone || '',
    email: formData.email || '',
    contactPreference: formData.contactPreference || channel,
    childName: formData.childName || 'Child',
    childAge: formData.childAge ? `${formData.childAge} years` : 'Not specified',
    program: formData.program || 'General Inquiry',
    startMonth: formData.startMonth || 'As soon as possible',
    wantVisit: formData.wantVisit || 'yes',
    visitDate: formData.visitDate || '',
    visitSlot: formData.visitSlot || 'Morning (9 am to 12 pm)',
    channel: channel,
    status: 'New',
    notes: formData.notes || 'Submitted via online enquiry form.',
    message: formData.message || ''
  };

  const updated = [newEnquiry, ...current];
  persistEnquiries(updated);
  return newEnquiry;
}

/**
 * Updates status and optional notes of an enquiry.
 * @param {string} id
 * @param {string} status ('New' | 'Contacted' | 'Visit Scheduled' | 'Enrolled')
 * @param {string} [notes]
 */
export function updateEnquiryStatus(id, status, notes) {
  const current = getEnquiries();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status,
        ...(notes !== undefined ? { notes } : {})
      };
    }
    return item;
  });
  persistEnquiries(updated);
  return updated;
}

/**
 * Deletes an enquiry by ID.
 * @param {string} id
 */
export function deleteEnquiry(id) {
  const current = getEnquiries();
  const updated = current.filter(item => item.id !== id);
  persistEnquiries(updated);
  return updated;
}

/**
 * Resets storage back to initial seed data.
 */
export function resetEnquiriesToDefault() {
  persistEnquiries(initialEnquiries);
  return initialEnquiries;
}

/**
 * Computes dashboard statistics from enquiries.
 * @returns {Object} stats
 */
export function getEnquiryStats(enquiriesList) {
  const list = enquiriesList || getEnquiries();
  const total = list.length;
  const newCount = list.filter(e => e.status === 'New').length;
  const visitsScheduled = list.filter(e => e.status === 'Visit Scheduled' || (e.wantVisit === 'yes' && e.visitDate)).length;
  const enrolled = list.filter(e => e.status === 'Enrolled').length;

  const byProgram = {
    Playgroup: list.filter(e => (e.program || '').toLowerCase().includes('play')).length,
    Nursery: list.filter(e => (e.program || '').toLowerCase().includes('nursery')).length,
    'Jr. KG': list.filter(e => (e.program || '').toLowerCase().includes('jr')).length,
    'Sr. KG': list.filter(e => (e.program || '').toLowerCase().includes('sr')).length,
  };

  return {
    total,
    newCount,
    visitsScheduled,
    enrolled,
    byProgram,
  };
}

/**
 * Exports current enquiries as CSV file for Excel / Sheets download.
 */
export function exportEnquiriesToCSV() {
  const list = getEnquiries();
  if (!list.length) {
    alert('No enquiries found to export.');
    return;
  }

  const headers = [
    'Enquiry ID',
    'Received Date',
    'Parent Name',
    'Phone',
    'Email',
    'Child Name',
    'Child Age',
    'Program',
    'Start Month',
    'Visit Date',
    'Visit Slot',
    'Channel',
    'Status',
    'Parent Message',
    'Internal Notes'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = list.map(item => [
    escapeCSV(item.id),
    escapeCSV(new Date(item.timestamp).toLocaleDateString()),
    escapeCSV(item.parentName),
    escapeCSV(item.phone),
    escapeCSV(item.email),
    escapeCSV(item.childName),
    escapeCSV(item.childAge),
    escapeCSV(item.program),
    escapeCSV(item.startMonth),
    escapeCSV(item.visitDate),
    escapeCSV(item.visitSlot),
    escapeCSV(item.channel),
    escapeCSV(item.status),
    escapeCSV(item.message),
    escapeCSV(item.notes)
  ].join(','));

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Wiggle_Preschool_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
