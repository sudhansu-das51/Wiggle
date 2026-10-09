import React from 'react';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/layout/PageHero';
import { CtaBanner } from '../components/ui/CtaBanner';
import { FacilitiesBuilding } from '../components/facilities/FacilitiesBuilding';
import { SeeMoreBand } from '../components/facilities/SeeMoreBand';
import { FacilityFaqs } from '../components/facilities/FacilityFaqs';
import { siteConfig } from '../config/siteConfig';

import './Facilities.css';
import '../components/facilities/facilities.css';

/**
 * Facilities Page (/facilities).
 * A cutaway school building with interactive rooms, light switches,
 * living details, sticky elevator lift rail, photo band, and FAQs.
 */
export function Facilities() {
  const brand = siteConfig.brand?.name || 'Wiggle';

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Facilities' },
  ];

  return (
    <main className="facilities-page">
      <Seo
        title="Facilities"
        description={`Step inside ${brand} preschool: sunlit learning spaces, sensory outdoor garden, messy art studio, cozy story nook, organic pantry, and verified child-safe transport.`}
      />

      {/* Section 1: Page Hero */}
      <PageHero
        title="Our facilities"
        note="Come on in, mind the paint."
        tint="mint"
        mascotMood="peek"
        crumbs={breadcrumbs}
      />

      {/* Section 2: The Cutaway School (Rooms) (.section--paper) */}
      <FacilitiesBuilding />

      {/* Section 4: See it in Photos (.section--sky) */}
      <SeeMoreBand />

      {/* Section 5: Facilities Questions / FAQs (.section--paper) */}
      <FacilityFaqs />

      {/* Section 6: CTA Banner */}
      <section className="section section--yellow fac-cta-section" aria-label="Book a school visit">
        <div className="container">
          <CtaBanner
            title="Come and see the rooms yourself"
            text="Book a school visit and we will walk you through every room, including the kitchen."
            primaryTo="/enquire"
            message={`Hi ${brand}! I would like to book a visit and walk through the rooms.`}
          />
        </div>
      </section>
    </main>
  );
}

export default Facilities;
