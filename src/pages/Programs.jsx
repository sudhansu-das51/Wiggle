import React from 'react';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/layout/PageHero';
import { TrainJourney } from '../components/programs/TrainJourney';
import { AgeFinder } from '../components/programs/AgeFinder';
import { CompareBoard } from '../components/programs/CompareBoard';
import { LuggageTags } from '../components/programs/LuggageTags';
import { TicketSteps } from '../components/programs/TicketSteps';
import { ProgramFaqs } from '../components/programs/ProgramFaqs';
import { CtaBanner } from '../components/ui/CtaBanner';
import './Programs.css';

/**
 * Wiggle Programs (Listing) Page (Page 3 of 14).
 * The signature train journey carrying parents through Playgroup, Nursery, Jr. KG, and Sr. KG.
 */
export function Programs() {
  return (
    <div className="programs-page">
      <Seo
        title="Programs"
        description="Pick a station on Wiggle's growing-up journey: Playgroup, Nursery, Jr. KG, and Sr. KG. Play-first early education for children aged 1.5 to 5.5."
      />

      {/* Section 1: Page Hero (Sky Tint) */}
      <PageHero
        title="Our programs"
        note="Pick a station, we will ride along."
        tint="sky"
        mascotMood="wave"
      />

      {/* Section 2: The Train Journey (Signature Pinned Scene) */}
      <TrainJourney />

      {/* Section 3: Age Finder (Yellow Tint) */}
      <AgeFinder />

      {/* Section 4: Compare at a glance (Departure Board) */}
      <CompareBoard />

      {/* Section 5: What every program covers (Luggage Tags) */}
      <LuggageTags />

      {/* Section 6: How admission works (Train Ticket) */}
      <TicketSteps />

      {/* Section 7: Questions before boarding (FAQs) */}
      <ProgramFaqs />

      {/* Section 8: Final CTA Banner */}
      <div className="programs-cta-wrapper">
        <div className="container">
          <CtaBanner
            title="Ready to pick your station?"
            text="Come and spend a morning at Wiggle. You will see the classrooms, meet the teachers and know in an hour which program fits your child."
          />
        </div>
      </div>
    </div>
  );
}

export default Programs;
