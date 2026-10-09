import React from 'react';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import './WhatsAppFloat.css';

/**
 * Fixed circular floating WhatsApp button bottom-right with gentle wobble,
 * using whtsapp-line.svg.
 */
export function WhatsAppFloat() {
  const link = buildWhatsAppLink();

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <img
        src="/images/whtsapp-line.svg"
        alt="WhatsApp"
        width="32"
        height="32"
        className="whatsapp-float-icon"
      />
    </a>
  );
}
