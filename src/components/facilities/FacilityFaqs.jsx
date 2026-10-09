import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Accordion } from '../ui/Accordion';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { faqs } from '../../data/faqs';
import { siteConfig } from '../../config/siteConfig';

/**
 * Section 5: Facilities Questions (FAQs).
 * Accessible accordion for common campus questions plus a WhatsApp inquiry prompt.
 */
export function FacilityFaqs() {
  const brand = siteConfig.brand?.name || 'Wiggle';

  // Filter facilities faqs (fallback to first 5 if fewer than 3 match)
  const matched = faqs.filter((f) => f.category === 'Facilities');
  const items = matched.length >= 3 ? matched : faqs.slice(0, 5);

  const waMessage = `Hi ${brand}! I have a question about your school facilities and campus.`;

  return (
    <section
      id="faqs"
      className="section section--paper fac-faqs-section"
      aria-label="Frequently asked questions about our facilities"
    >
      <div className="container">
        <SectionHeading
          title="Questions about the school"
          text="Straightforward answers about our spaces, routines, and safety."
          align="center"
          wiggle
        />

        {/* Accordion Component */}
        <div className="fac-accordion-wrapper">
          <Accordion items={items} />
        </div>

        {/* Bottom WhatsApp Prompt Card */}
        <div className="fac-faq-footer note">
          <p className="fac-faq-footer-text">
            Still wondering about something?
          </p>
          <WhatsAppButton
            message={waMessage}
            label="Chat with us on WhatsApp"
            variant="ghost"
            className="fac-whatsapp-btn"
          />
        </div>
      </div>
    </section>
  );
}

export default FacilityFaqs;
