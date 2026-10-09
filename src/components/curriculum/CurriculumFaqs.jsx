import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Accordion } from '../ui/Accordion';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { faqs } from '../../data/faqs';
import { siteConfig } from '../../config/siteConfig';

/**
 * Section 8: Curriculum Questions (FAQ Accordion).
 * Renders curriculum-specific FAQs in an accessible accordion with a WhatsApp fallback.
 */
export function CurriculumFaqs() {
  const brand = siteConfig.brand?.name || 'Wiggle';

  // Filter curriculum questions; fallback to first 5 if fewer than 3
  const curriculumFaqs = faqs.filter(
    (item) => item.category?.toLowerCase() === 'curriculum'
  );
  const itemsToDisplay =
    curriculumFaqs.length >= 3 ? curriculumFaqs : faqs.slice(0, 5);

  const waMessage = `Hi ${brand}! I have a question about how you teach.`;

  return (
    <section id="faqs" className="section section--paper cur-faqs-section" aria-label="Curriculum questions">
      <div className="container container--narrow">
        <SectionHeading
          title="Questions about how we teach"
          align="center"
          wiggle
        />

        <div className="cur-faqs-accordion-wrapper">
          <Accordion items={itemsToDisplay} className="cur-accordion" />
        </div>

        <div className="cur-faqs-footer">
          <p className="cur-faqs-footer-prompt note">
            Still wondering about something?
          </p>
          <WhatsAppButton message={waMessage} label="Ask us on WhatsApp" />
        </div>
      </div>
    </section>
  );
}

export default CurriculumFaqs;
