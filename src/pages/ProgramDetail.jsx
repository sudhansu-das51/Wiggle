import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { programs } from '../data/programs';
import { siteConfig } from '../config/siteConfig';
import { Seo } from '../components/ui/Seo';
import { FactStickers } from '../components/program-detail/FactStickers';
import { SectionTabs } from '../components/program-detail/SectionTabs';
import { ProgramOverview } from '../components/program-detail/ProgramOverview';
import { DayClock } from '../components/program-detail/DayClock';
import { StickerChart } from '../components/program-detail/StickerChart';
import { TeacherBadges } from '../components/program-detail/TeacherBadges';
import { PackTheBag } from '../components/program-detail/PackTheBag';
import { ProgramQuestions } from '../components/program-detail/ProgramQuestions';
import { StationNav } from '../components/program-detail/StationNav';
import { NotFoundProgram } from '../components/program-detail/NotFoundProgram';
import { CtaBanner } from '../components/ui/CtaBanner';
import './ProgramDetail.css';

const TINT_ALT_MAP = {
  yellow: 'mint',
  pink: 'sky',
  mint: 'pink',
  sky: 'yellow',
};

/**
 * Wiggle Program Detail (Template) Page.
 * Dynamic template rendering Playgroup, Nursery, Jr. KG, or Sr. KG from its URL slug.
 */
export function ProgramDetail() {
  const { slug } = useParams();
  const brandName = siteConfig?.brand?.name || 'Wiggle';

  // Find matching program
  const program = programs.find((p) => p.slug === slug);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // If no matching program found, render friendly 404 state
  if (!program) {
    return <NotFoundProgram />;
  }

  const tint = program.tint || 'yellow';
  const altTint = TINT_ALT_MAP[tint] || 'mint';

  const rootStyle = {
    '--pd-tint': `var(--tint-${tint})`,
    '--pd-tint-alt': `var(--tint-${altTint})`,
  };

  return (
    <div key={slug} className="program-detail-page" style={rootStyle}>
      <Seo
        title={`${program.name} program`}
        description={program.summary}
      />

      {/* Section 1: Hero + Fact Stickers */}
      <FactStickers program={program} />

      {/* Section 2: Sticky Section Tabs */}
      <SectionTabs />

      {/* Section 3: Overview (Paper) */}
      <ProgramOverview program={program} />

      {/* Section 4: A day in class (Ink) */}
      <DayClock program={program} />

      {/* Section 5: What your child will learn (Program Tint) */}
      <StickerChart program={program} />

      {/* Section 6: The teachers (Paper) */}
      <TeacherBadges program={program} />

      {/* Section 7: Pack the bag (Program Tint Alt) */}
      <PackTheBag program={program} />

      {/* Section 8: Questions (Paper) */}
      <ProgramQuestions program={program} />

      {/* Section 9: Previous & Next Station */}
      <StationNav currentSlug={program.slug} />

      {/* Section 10: CTA Banner */}
      <div className="pd-cta-wrapper">
        <div className="container">
          <CtaBanner
            title={`Ready for ${program.name}?`}
            text={`Book a school visit and see the ${program.name} classroom, meet the teachers and ask anything you like.`}
            primaryTo={`/enquire?program=${program.slug}`}
            message={`Hi ${brandName}! I would like to enquire about the ${program.name} program.`}
          />
        </div>
      </div>
    </div>
  );
}

export default ProgramDetail;
