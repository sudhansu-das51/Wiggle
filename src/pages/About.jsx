import React from 'react';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/layout/PageHero';
import { StoryBook } from '../components/about/StoryBook';
import { SignpostMissionVision } from '../components/about/SignpostMissionVision';
import { ValueTags } from '../components/about/ValueTags';
import { JourneyRoad } from '../components/about/JourneyRoad';
import { GrowthChart } from '../components/about/GrowthChart';
import { FounderLetter } from '../components/about/FounderLetter';
import { TeamStrip } from '../components/about/TeamStrip';
import { CtaBanner } from '../components/ui/CtaBanner';
import { siteConfig } from '../config/siteConfig';
import '../components/about/about.css';
import './About.css';

/**
 * Wiggle About Us Page (Page 2 of 14).
 * Builds trust, shows the people and pedagogical story behind the school,
 * with storybook spread, signpost, name tags, journey road, growth chart,
 * founder letter, team strip, and visit CTA.
 */
export function About() {
  const brandName = siteConfig?.brand?.name || 'Wiggle';

  return (
    <div className="about-page">
      <Seo
        title="About us"
        description={`Learn how ${brandName} began: our play-first philosophy, living values, journey road, dedicated educators, and a note from our founder.`}
      />

      {/* Section 1: Page Hero */}
      <PageHero
        title={`About ${brandName}`}
        note="We are the ones with paint on our shirts."
        tint="yellow"
        mascotMood="wave"
      />

      {/* Section 2: Our Story (Storybook spread) */}
      <StoryBook />

      {/* Section 3: Mission and Vision (Signpost) */}
      <SignpostMissionVision />

      {/* Section 4: Values (Name tags) */}
      <ValueTags />

      {/* Section 5: Our Journey (Signature road scene) */}
      <JourneyRoad />

      {/* Section 6: Growth Chart (Stats) */}
      <GrowthChart />

      {/* Section 7: A Note from the Founder */}
      <FounderLetter />

      {/* Section 8: The People (Team strip) */}
      <TeamStrip />

      {/* Section 9: CTA */}
      <section className="section section--yellow about-page__cta-section" aria-label="Book a visit">
        <div className="container">
          <CtaBanner
            title="Want to see how we do it in person?"
            text="Book a school visit and spend a morning with us. Or message us on WhatsApp and we will reply the same day."
          />
        </div>
      </section>
    </div>
  );
}

export default About;
