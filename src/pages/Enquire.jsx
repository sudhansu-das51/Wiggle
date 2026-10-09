import React, { useEffect } from 'react';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/layout/PageHero';
import { EnquiryWizard } from '../components/enquire/EnquiryWizard';
import { EnquiryAside } from '../components/enquire/EnquiryAside';
import { EnquiryFaqs } from '../components/enquire/EnquiryFaqs';
import { siteConfig } from '../config/siteConfig';
import { programs, admissionSteps } from '../data/programs';

import './Enquire.css';
import '../components/enquire/enquire.css';

/**
 * Enquire Now Page (/enquire).
 * Four-stop school bus ride, ticket-style review, honest WhatsApp / email handover,
 * Matter.js alphabet block rain celebration, and admission questions.
 */
export function Enquire() {
  const brand = siteConfig.brand?.name || 'Wiggle';
  const { admissions } = siteConfig;
  const isOpen = admissions?.open !== false;
  const session = admissions?.session || '2026-27';

  // Suppress floating WhatsApp button on this page only
  useEffect(() => {
    document.body.dataset.hideWaFloat = 'true';
    return () => {
      delete document.body.dataset.hideWaFloat;
    };
  }, []);

  const heroNote = isOpen
    ? 'Four quick steps and a hello.'
    : `Admissions are full for ${session}. Join the waiting list below.`;

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Enquire now' },
  ];

  return (
    <main className="enquire-page">
      <Seo
        title="Enquire now"
        description={`Ask about admission at ${brand} Preschool for ${session}. Four quick steps, tour scheduling, and same-day reply.`}
      />

      {/* Section 1: Page Hero */}
      <PageHero
        title="Enquire now"
        note={heroNote}
        tint="sky"
        mascotMood="cheer"
        crumbs={breadcrumbs}
      />

      {/* Section 2: The Enquiry Wizard & Aside */}
      <section
        className="section section--yellow enq-wizard-section"
        aria-label="Admissions enquiry form"
      >
        <div className="container">
          <div className="enq-wizard-grid">
            <div className="enq-wizard-main">
              <EnquiryWizard programs={programs} />
            </div>

            <div className="enq-wizard-side">
              <EnquiryAside steps={admissionSteps} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Admission Questions (FAQs) */}
      <EnquiryFaqs />
    </main>
  );
}

export default Enquire;
