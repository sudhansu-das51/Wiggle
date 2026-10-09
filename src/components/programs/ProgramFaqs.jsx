import React from 'react';
import { faqs } from '../../data/faqs';
import { siteConfig } from '../../config/siteConfig';
import { SectionHeading } from '../ui/SectionHeading';
import { Accordion } from '../ui/Accordion';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import './programs.css';

/**
 * Section 7: Questions before boarding (Programs FAQs).
 */
export function ProgramFaqs() {
  const brandName = siteConfig?.brand?.name || 'Wiggle';

  // Filter to category === "Programs", fallback to first 5 if < 3
  const programFaqs = faqs.filter((f) => f.category === 'Programs');
  const itemsToDisplay = programFaqs.length >= 3 ? programFaqs : faqs.slice(0, 5);

  return (
    <section className="section section--paper programs-faqs-section" aria-label="Programs frequently asked questions">
      <div className="container">
        <SectionHeading
          title="Questions parents ask before boarding"
          note="Everything you need to know about our daily journeys."
          align="center"
          wiggle
        />

        {/* Shared Accordion */}
        <div className="programs-faqs-accordion-wrap">
          <Accordion items={itemsToDisplay} />
        </div>

        {/* Bottom WhatsApp Prompt */}
        <div className="programs-faqs-footer">
          <p className="programs-faqs-footer__text">
            Still wondering about something?
          </p>
          <WhatsAppButton
            message={`Hi ${brandName}! I have a question about the programs at Wiggle.`}
            label="Ask on WhatsApp"
            variant="ghost"
          />
        </div>
      </div>
    </section>
  );
}
