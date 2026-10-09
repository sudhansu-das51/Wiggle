import React from 'react';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/layout/PageHero';
import { CtaBanner } from '../components/ui/CtaBanner';
import { NextUp } from '../components/events/NextUp';
import { EventsExplorer } from '../components/events/EventsExplorer';
import { FridgeRhythm } from '../components/events/FridgeRhythm';
import { SubscribeBand } from '../components/events/SubscribeBand';
import { siteConfig } from '../config/siteConfig';
import { events } from '../data/events';

import './Events.css';
import '../components/events/events.css';

/**
 * Events Page (/events).
 * Centered on the wall calendar concept:
 * Next up date block with split-flap countdown, interactive wall calendar with tear-off months,
 * sticky month list view with ticket stubs, fridge magnets for monthly rhythms,
 * and client-side calendar exports.
 */
export function Events() {
  const brand = siteConfig.brand?.name || 'Wiggle';

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Events' },
  ];

  return (
    <main className="events-page">
      <Seo
        title="Events"
        description={`Mark your calendar for upcoming celebrations, workshops, trails, and open houses at ${brand} preschool.`}
      />

      {/* Section 1: Page Hero */}
      <PageHero
        title="Events"
        note="Mark your calendar, bring your noise."
        tint="pink"
        mascotMood="cheer"
        crumbs={breadcrumbs}
      />

      {/* Section 2: Next Up & Split-Flap Countdown */}
      <NextUp events={events} />

      {/* Section 3: Find a date (Calendar & List view) */}
      <EventsExplorer events={events} />

      {/* Section 4: Every month at Wiggle (Fridge door) */}
      <FridgeRhythm />

      {/* Section 5: Never miss a date (Subscribe band) */}
      <SubscribeBand events={events} />

      {/* Section 6: CTA Banner */}
      <section className="section section--paper evt-cta-section" aria-label="Come to our next event">
        <div className="container">
          <CtaBanner
            title="Come to our next event"
            text="Many of our events are open to families who are still deciding. Ask us which one is closest to you."
            primaryTo="/enquire"
            message={`Hi ${brand}! Which upcoming event is best for prospective families to attend?`}
          />
        </div>
      </section>
    </main>
  );
}

export default Events;
