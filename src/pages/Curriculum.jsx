import React from 'react';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/layout/PageHero';
import { CtaBanner } from '../components/ui/CtaBanner';
import { RecipeCard } from '../components/curriculum/RecipeCard';
import { CrayonBox } from '../components/curriculum/CrayonBox';
import { PaintingYear } from '../components/curriculum/PaintingYear';
import { Chalkboard } from '../components/curriculum/Chalkboard';
import { ProgressPieces } from '../components/curriculum/ProgressPieces';
import { SyllabusPanel } from '../components/curriculum/SyllabusPanel';
import { CurriculumFaqs } from '../components/curriculum/CurriculumFaqs';
import { siteConfig } from '../config/siteConfig';

import './Curriculum.css';
import '../components/curriculum/curriculum.css';

/**
 * Curriculum Page (/curriculum).
 * Implements the 10-section syllabus and learning framework page for Wiggle preschool.
 */
export function Curriculum() {
  const brand = siteConfig.brand?.name || 'Wiggle';

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Programs', path: '/programs' },
    { label: 'Curriculum' },
  ];

  return (
    <main className="curriculum-page">
      <Seo
        title="Curriculum"
        description="Explore Wiggle's play-first curriculum: six learning areas, inquiry methods, a painted landscape of the year, and daily hands-on discovery."
      />

      {/* Section 1: Page Hero */}
      <PageHero
        title="Our curriculum"
        note="Play is the plan."
        tint="pink"
        mascotMood="point"
        crumbs={breadcrumbs}
      />

      {/* Section 2: Recipe for a Happy Learner (.section--paper) */}
      <RecipeCard />

      {/* Section 3: The Six Learning Areas / Crayon Box (.section--sky) */}
      <CrayonBox />

      {/* Section 4: How the Year Unfolds / The Landscape Painting (.section--mint) */}
      <PaintingYear />

      {/* Section 5: A Week at Wiggle / Chalkboard (.section--ink) */}
      <Chalkboard />

      {/* Section 6: How We Share Progress / Progress Pieces (.section--yellow) */}
      <ProgressPieces />

      {/* Section 7: Syllabus Request Panel (.section--sky) */}
      <SyllabusPanel />

      {/* Section 8: Curriculum Questions / FAQs (.section--paper) */}
      <CurriculumFaqs />

      {/* Section 9: CTA Banner */}
      <CtaBanner
        title="Want to see the curriculum in action?"
        text="Visit on a normal school day and watch it happen: the messy paint, the story circle and the very serious block towers."
        primaryTo="/enquire"
        message={`Hi ${brand}! I would like to visit the school and see a class in action.`}
      />
    </main>
  );
}

export default Curriculum;
