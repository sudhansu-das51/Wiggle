import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Accordion } from '../ui/Accordion';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { faqs as defaultFaqs } from '../../data/faqs';
import { siteConfig } from '../../config/siteConfig';

/**
 * Section 5 — Questions about visiting.
 * Renders FAQs filtered by category "Visiting", and a WhatsApp help prompt.
 * @param {{
 *   faqs?: Array<any>,
 *   className?: string
 * }} props
 */
export function ContactFaqs({ faqs = defaultFaqs, className = '' }) {
  const brandName = siteConfig.brand?.name || 'Wiggle';

  // Filter visiting category; fallback to first 5 if fewer than 3 match
  const visitingFaqs = faqs.filter((f) => f.category === 'Visiting');
  const displayItems = visitingFaqs.length >= 3 ? visitingFaqs : faqs.slice(0, 5);

  return (
    <section className={`section section--paper con-faqs-section ${className}`}>
      <div className="container">
        <div className="con-faqs-container">
          <SectionHeading
            title="Before you visit"
            text="A few things parents often ask before stepping through the gate."
            align="center"
            wiggle={true}
          />

          <div className="con-faqs-accordion-wrapper">
            <Accordion items={displayItems} />
          </div>

          <div className="con-faqs-footer">
            <p className="con-faqs-footer__text">Still wondering about something?</p>
            <WhatsAppButton
              message={`Hi ${brandName}! I have a quick question before visiting the school.`}
              label="Chat on WhatsApp"
              className="con-faqs-footer__btn"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactFaqs;
