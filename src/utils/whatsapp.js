import { siteConfig } from '../config/siteConfig';

/**
 * Builds a direct wa.me WhatsApp enquiry link with URL-encoded message text.
 * @param {string} [message] - Optional custom message. Defaults to siteConfig.whatsapp.defaultMessage.
 * @returns {string} - wa.me URL.
 */
export function buildWhatsAppLink(message, customNumber) {
  const number = customNumber || siteConfig?.careers?.whatsappNumber || siteConfig?.whatsapp?.number || '919999999999';
  const text = message ?? siteConfig?.whatsapp?.defaultMessage ?? 'Hi Wiggle! I would like to know more about admissions.';
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
