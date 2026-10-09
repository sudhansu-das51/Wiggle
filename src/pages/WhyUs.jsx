import React from 'react';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/layout/PageHero';
import { CtaBanner } from '../components/ui/CtaBanner';
import { PromiseContract } from '../components/why-us/PromiseContract';
import { CampusTour } from '../components/why-us/CampusTour';
import { RatioPlayground } from '../components/why-us/RatioPlayground';
import { ParentChat } from '../components/why-us/ParentChat';
import { AskBoard } from '../components/why-us/AskBoard';
import { siteConfig } from '../config/siteConfig';

import './WhyUs.css';
import '../components/why-us/why-us.css';

/**
 * Why Us Page (/why-us).
 * Proves Wiggle's 6 commitments: written contract with rubber stamps,
 * guided campus safety tour, interactive teacher-to-child ratio rug,
 * honest comparison table, simulated parent class chat, and preschool questions board.
 */
export function WhyUs() {
  const brand = siteConfig.brand?.name || 'Wiggle';

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: `Why ${brand}` },
  ];

  return (
    <main className="why-us-page">
      <Seo
        title={`Why ${brand}`}
        description={`Six promises you can hold us to at ${brand}: low teacher-child ratios, guided safety tour, clean campus, parent loops, and wholesome early learning.`}
      />

      {/* Section 1: Page Hero */}
      <PageHero
        title={`Why ${brand}`}
        note="Six promises, and we keep every one."
        tint="sky"
        mascotMood="point"
        crumbs={breadcrumbs}
      />

      {/* Section 2: Our Promises to You (The Contract) (.section--paper) */}
      <PromiseContract />

      {/* Section 3: The Safety Tour (Campus Map) (.section--mint) */}
      <CampusTour />

      {/* Section 4: Attention per Child (Ratio Playground & Comparison) (.section--pink) */}
      <RatioPlayground />

      {/* Section 5: What Parents Say (Class Chat) (.section--paper) */}
      <ParentChat disclaimer="Sample messages" />

      {/* Section 6: Questions Worth Asking Every School (.section--yellow) */}
      <AskBoard />

      {/* Section 7: CTA Banner */}
      <section className="section section--paper why-cta-section" aria-label="Book a visit">
        <div className="container">
          <CtaBanner
            title="Come and check us against that list"
            text="Bring your questions. Our gate, kitchen and classrooms are open on every visit."
            primaryTo="/enquire"
            message={`Hi ${brand}! I would like to visit ${brand} and check the campus in person.`}
          />
        </div>
      </section>
    </main>
  );
}

export default WhyUs;
