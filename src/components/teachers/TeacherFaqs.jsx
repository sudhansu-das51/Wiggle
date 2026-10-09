import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Accordion } from '../ui/Accordion';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { faqs } from '../../data/faqs';
import { siteConfig } from '../../config/siteConfig';

export function TeacherFaqs() {
  const brand = siteConfig.brand?.name || 'Wiggle';

  // Filter FAQs for 'Teachers' category (fallback to first 5 if fewer than 3 match)
  const teacherFaqs = faqs.filter(
    (item) => item.category?.toLowerCase() === 'teachers'
  );
  const displayFaqs = teacherFaqs.length >= 3 ? teacherFaqs : faqs.slice(0, 5);

  const accordionItems = displayFaqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));

  const waMessage = `Hi ${brand}! I have a question about your teachers and classroom team.`;

  return (
    <section className="section section--paper tch-faqs" aria-label="Frequently asked questions">
      <div className="container">
        <SectionHeading
          title="Questions about our teachers"
          note="Clear, honest answers about who cares for your little one."
          align="center"
          wiggle
        />

        <div className="tch-faqs__content">
          <Accordion items={accordionItems} />

          <div className="tch-faqs__footer">
            <p className="tch-faqs__footer-text">Still wondering about something?</p>
            <WhatsAppButton
              message={waMessage}
              label="Chat with our team on WhatsApp"
              variant="ghost"
              className="tch-faqs__wa-btn"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
