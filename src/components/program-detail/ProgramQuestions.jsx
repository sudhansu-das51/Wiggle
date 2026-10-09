import React from 'react';
import { faqs as globalFaqs } from '../../data/faqs';
import { siteConfig } from '../../config/siteConfig';
import { SectionHeading } from '../ui/SectionHeading';
import { Accordion } from '../ui/Accordion';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import './program-detail.css';

/**
 * Section 8: Program-specific FAQ accordion and WhatsApp query prompt.
 * @param {{
 *   program: {
 *     name: string,
 *     faqs?: Array<{ question: string, answer: string }>
 *   }
 * }} props
 */
export function ProgramQuestions({ program }) {
  const brandName = siteConfig?.brand?.name || 'Wiggle';

  // Program's own FAQs first, then general Program FAQs, max 7, deduplicated
  const programOwnFaqs = (program.faqs || []).map((f, i) => ({
    id: `prog-faq-${i}`,
    question: f.question,
    answer: f.answer,
  }));

  const globalProgramFaqs = globalFaqs.filter((f) => f.category === 'Programs');

  const seenQuestions = new Set(programOwnFaqs.map((f) => f.question.trim().toLowerCase()));
  const combined = [...programOwnFaqs];

  globalProgramFaqs.forEach((f) => {
    const key = f.question.trim().toLowerCase();
    if (!seenQuestions.has(key)) {
      seenQuestions.add(key);
      combined.push(f);
    }
  });

  const finalFaqs = combined.slice(0, 7);

  return (
    <section id="questions" className="section section--paper pd-questions-section" aria-label="Program questions">
      <div className="container">
        <SectionHeading
          title={`Questions about ${program.name}`}
          note="Answers to questions parents ask most often."
          align="center"
          wiggle
        />

        {/* Shared Accordion */}
        <div className="pd-questions-accordion-wrap">
          <Accordion items={finalFaqs} />
        </div>

        {/* Bottom WhatsApp Prompt */}
        <div className="pd-questions-footer">
          <p className="pd-questions-footer__prompt note">
            Still wondering about something?
          </p>
          <WhatsAppButton
            message={`Hi ${brandName}! I have a question about the ${program.name} program.`}
            label="Ask on WhatsApp"
            variant="ghost"
          />
        </div>
      </div>
    </section>
  );
}
