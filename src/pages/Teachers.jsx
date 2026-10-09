import React from 'react';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/layout/PageHero';
import { CtaBanner } from '../components/ui/CtaBanner';
import { TeachersExplorer } from '../components/teachers/TeachersExplorer';
import { SteppingStones } from '../components/teachers/SteppingStones';
import { TeacherFaqs } from '../components/teachers/TeacherFaqs';
import { JoinBand } from '../components/teachers/JoinBand';
import { teachers } from '../data/teachers';
import { programs } from '../data/programs';
import { siteConfig } from '../config/siteConfig';

import './Teachers.css';
import '../components/teachers/teachers.css';

/**
 * Teachers Page (/teachers).
 * Collectible trading cards, staff file viewer, stepping stones pond, and FAQs.
 */
export function Teachers() {
  const brand = siteConfig.brand?.name || 'Wiggle';

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Teachers' },
  ];

  return (
    <main className="teachers-page">
      <Seo
        title="Teachers"
        description={`Meet the educators at ${brand}. The grown-ups who get down on the floor, craft with toddlers, and guide your child with warmth and joy.`}
      />

      {/* Section 1: Page Hero */}
      <PageHero
        title="Our teachers"
        note="The grown-ups who get down on the floor."
        tint="mint"
        mascotMood="wave"
        crumbs={breadcrumbs}
      />

      {/* Section 2: The Card Table Explorer (.section--paper) */}
      <TeachersExplorer teachers={teachers} programs={programs} />

      {/* Section 3: How we choose our teachers / Stepping Stones (.section--sky) */}
      <SteppingStones />

      {/* Section 4: Teacher FAQs (.section--paper) */}
      <TeacherFaqs />

      {/* Section 5: Join the Team / Careers (.section--pink) */}
      <JoinBand />

      {/* Section 6: CTA Banner */}
      <section className="section section--paper" style={{ paddingBlock: '3rem' }}>
        <div className="container">
          <CtaBanner
            title="Come and meet them in person"
            text="Book a school visit and say hello. They will probably be sitting on the floor."
            primaryTo="/enquire"
            message={`Hi ${brand}! I would like to book a visit and meet the teaching team.`}
          />
        </div>
      </section>
    </main>
  );
}

export default Teachers;
