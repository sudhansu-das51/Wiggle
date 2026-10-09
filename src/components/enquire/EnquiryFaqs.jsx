import React from 'react';
import { Accordion } from '../ui/Accordion';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { faqs } from '../../data/faqs';
import { siteConfig } from '../../config/siteConfig';
import { buildWhatsAppLink } from '../../utils/whatsapp';

/**
 * Section 3 — Admission questions.
 * Shared Accordion with admissions FAQs and direct WhatsApp enquiry button.
 */
export function EnquiryFaqs({ className = '' }) {
  const brand = siteConfig.brand?.name || 'Wiggle';
  const admissionsNumber = siteConfig.admissions?.whatsappNumber || siteConfig.whatsapp?.number;

  // Filter for Admissions FAQs; fallback to first 5 if fewer than 3
  const admissionsFaqs = faqs.filter((f) => f.category === 'Admissions');
  const items = admissionsFaqs.length >= 3 ? admissionsFaqs : faqs.slice(0, 5);

  const askMessage = `Hi ${brand}! I have a question about admission.`;
  const customLink = buildWhatsAppLink(askMessage, admissionsNumber);

  return (
    <section className={`section section--paper enq-faqs-section ${className}`} aria-labelledby="enq-faqs-heading">
      <div className="container container--sm">
        <div className="enq-faqs-header">
          <h2 id="enq-faqs-heading" className="enq-faqs-title">
            Questions about admission
          </h2>
          <p className="enq-faqs-subtitle">
            Everything you might want to know before saying hello.
          </p>
        </div>

        <div className="enq-faqs-accordion">
          <Accordion items={items} />
        </div>

        <div className="enq-faqs-footer">
          <p className="enq-faqs-footer__text note">
            Rather just ask?
          </p>
          <WhatsAppButton
            href={customLink}
            label="Chat with admissions"
            variant="ghost"
            message={askMessage}
          />
        </div>
      </div>
    </section>
  );
}

export default EnquiryFaqs;
