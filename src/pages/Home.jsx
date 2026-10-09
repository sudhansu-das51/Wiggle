import React from 'react';
import { Seo } from '../components/ui/Seo';
import { SchoolGateIntro } from '../components/motion/SchoolGateIntro';
import { HomeHero } from '../components/home/HomeHero';
import { BusScene } from '../components/home/BusScene';
import { AboutCollage } from '../components/home/AboutCollage';
import { ProgramsStairs } from '../components/home/ProgramsStairs';
import { WhyBento } from '../components/home/WhyBento';
import { DayAtWiggle } from '../components/home/DayAtWiggle';
import { TeacherPolaroids } from '../components/home/TeacherPolaroids';
import { PhotoWall } from '../components/home/PhotoWall';
import { EventTickets } from '../components/home/EventTickets';
import { TestimonialBubbles } from '../components/home/TestimonialBubbles';
import { CtaBanner } from '../components/ui/CtaBanner';
import './Home.css';

/**
 * Wiggle Home Page (Page 1 of 14).
 * Composes the 11 home sections in choreographed sequence.
 */
export function Home() {
  return (
    <div className="home-page">
      <Seo
        title="Play-first preschool"
        description="Wiggle is a play-first preschool for children aged 1.5 to 5.5. Small groups, warm teachers, and a joyful day built around making, moving and asking why."
      />

      {/* Section 0: First visit gate intro */}
      <SchoolGateIntro />

      {/* Section 1: Hero */}
      <HomeHero />

      {/* Section 2: Signature Bus Road */}
      <BusScene />

      {/* Section 3: About Collage */}
      <AboutCollage />

      {/* Section 4: Programs Staircase */}
      <ProgramsStairs />

      {/* Section 5: Why Us Bento */}
      <WhyBento />

      {/* Section 6: A Day at Wiggle (Pinned Horizontal Scroll) */}
      <DayAtWiggle />

      {/* Section 7: Teacher Polaroids */}
      <TeacherPolaroids />

      {/* Section 8: Photo Wall */}
      <PhotoWall />

      {/* Section 9: Upcoming Events */}
      <EventTickets />

      {/* Section 10: Parent Notes */}
      <TestimonialBubbles />

      {/* Section 11: Call to Action Banner */}
      <div className="home-page__cta-wrapper">
        <div className="container">
          <CtaBanner
            title="Come and see Wiggle in action"
            text="Book a school visit and meet the teachers, or message us on WhatsApp and we will reply the same day."
          />
        </div>
      </div>
    </div>
  );
}
