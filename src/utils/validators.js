/**
 * Validation helpers for forms.
 */

export function isRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function isEmail(value) {
  if (!value || typeof value !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value.trim());
}

/**
 * Accepts 10-digit Indian mobile numbers (with optional +91 or 0 prefix, spaces/dashes ignored),
 * or any 8 to 15 digit international number with a leading '+'.
 */
export function isPhone(value) {
  if (!value || typeof value !== 'string') return false;
  const cleaned = value.trim().replace(/[\s-]/g, '');

  // International format: + followed by 8 to 15 digits
  if (/^\+\d{8,15}$/.test(cleaned)) {
    return true;
  }

  // Indian standard mobile: optional +91 or 0, followed by 10 digits starting with 6, 7, 8, or 9 (or standard 10 digits)
  if (/^(?:\+91|0)?[6-9]\d{9}$/.test(cleaned)) {
    return true;
  }

  // Generic 10 digits
  if (/^\d{10}$/.test(cleaned)) {
    return true;
  }

  return false;
}

/**
 * Validates the Contact page message form values.
 * @param {{ name?: string, phone?: string, email?: string, message?: string, replyMethod?: string }} values
 * @returns {Record<string, string>} Object containing field error strings, or empty if valid.
 */
export function validateContactForm(values = {}) {
  const errors = {};

  // Name: required
  if (!isRequired(values.name)) {
    errors.name = 'Please tell us your name';
  }

  // Phone: required and valid
  if (!isRequired(values.phone)) {
    errors.phone = 'Please provide your phone number';
  } else if (!isPhone(values.phone)) {
    errors.phone = 'That phone number does not look right';
  }

  // Email: optional, but if provided must be valid email
  if (isRequired(values.email) && !isEmail(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Message: required, minimum 10 characters
  if (!isRequired(values.message) || values.message.trim().length < 10) {
    errors.message = 'A few words about what you need help with, please (at least 10 characters)';
  }

  return errors;
}

/**
 * Validates the Careers job application form values per channel.
 * @param {{ name?: string, phone?: string, email?: string, experience?: string, qualification?: string, about?: string }} values
 * @param {'WhatsApp' | 'Email' | string} channel
 * @returns {Record<string, string>}
 */
export function validateApplicationForm(values = {}, channel = 'WhatsApp') {
  const errors = {};

  // Name: required
  if (!isRequired(values.name)) {
    errors.name = 'Please tell us your name';
  }

  // Phone: required and valid
  if (!isRequired(values.phone)) {
    errors.phone = 'Please provide your phone number';
  } else if (!isPhone(values.phone)) {
    errors.phone = 'That phone number does not look right';
  }

  // Email: required only when channel is Email, but must be valid if provided
  const isEmailChannel = String(channel).toLowerCase() === 'email';
  if (isEmailChannel && !isRequired(values.email)) {
    errors.email = 'Please provide your email address';
  } else if (isRequired(values.email) && !isEmail(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Experience: required
  if (!isRequired(values.experience)) {
    errors.experience = 'Please select your years of experience';
  }

  // Message / About you: optional, but max 600 characters
  if (values.about && values.about.length > 600) {
    errors.about = 'Please keep your note within 600 characters';
  }

  return errors;
}

/**
 * Validates a single step of the multi-step Enquiry wizard.
 * @param {number} step - Step number (1, 2, or 3)
 * @param {Record<string, any>} values - Current form values
 * @returns {Record<string, string>} - Errors object for this step only
 */
export function validateEnquiryStep(step, values = {}) {
  const errors = {};

  if (step === 1) {
    if (!isRequired(values.parentName)) {
      errors.parentName = 'Please tell us your name';
    }
    if (!isRequired(values.phone)) {
      errors.phone = 'Please provide your phone number';
    } else if (!isPhone(values.phone)) {
      errors.phone = 'That phone number does not look right';
    }
    if (isRequired(values.email) && !isEmail(values.email)) {
      errors.email = 'Please enter a valid email address';
    }
  } else if (step === 2) {
    if (!isRequired(values.childName)) {
      errors.childName = "Please tell us your child's name";
    }
    if (!isRequired(values.childAge)) {
      errors.childAge = "Please select your child's age";
    }
    // program and startMonth are always valid
  } else if (step === 3) {
    if (values.wantVisit === 'yes' && values.visitDate) {
      const parts = values.visitDate.split('-').map(Number);
      if (parts.length === 3) {
        const [y, m, d] = parts;
        const chosen = new Date(y, m - 1, d, 23, 59, 59);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (chosen < today) {
          errors.visitDate = 'Please choose today or an upcoming date';
        }
      }
    }
    if (values.message && values.message.length > 600) {
      errors.message = 'Please keep your note within 600 characters';
    }
    if (!values.consent) {
      errors.consent = 'Please tick this so we may reply to you';
    }
  }

  return errors;
}
