import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Accordion } from '../ui/Accordion';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { faqs as defaultFaqs } from '../../data/faqs';
import { siteConfig } from '../../config/siteConfig';

/**
 * Section 5 — Questions before applying (Careers FAQs).
 * Renders FAQs filtered by category "Careers", and a WhatsApp help prompt.
 * @param {{
 *   faqs?: Array<any>,
 *   className?: string
 * }} props
 */
export function CareerFaqs({ faqs = defaultFaqs, className = '' }) {
  const brandName = siteConfig.brand?.name || 'Wiggle';

  // Filter careers category; fallback to first 5 if fewer than 3 match
  const careerFaqs = faqs.filter((f) => f.category === 'Careers');
  const displayItems = careerFaqs.length >= 3 ? careerFaqs : faqs.slice(0, 5);

  return (
    <section className={`section section--paper car-faqs-section ${className}`}>
      <div className="container">
        <div className="car-faqs-container">
          <SectionHeading
            title="Questions before applying"
            text="A few things educators ask us before jumping onto our floor."
            align="center"
            wiggle={true}
          />

          <div className="car-faqs-accordion-wrapper">
            <Accordion items={displayItems} />
          </div>

          <div className="car-faqs-footer">
            <p className="car-faqs-footer__text">Still wondering about something?</p>
            <WhatsAppButton
              message={`Hi ${brandName}! I have a question about working with you.`}
              label="Ask on WhatsApp"
              className="car-faqs-footer__btn"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CareerFaqs;
