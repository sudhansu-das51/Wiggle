import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTransition } from '../motion/TransitionContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { WiggleText } from '../motion/WiggleText';
import { Button } from '../ui/Button';
import './home.css';

/**
 * Section 1: Home Hero.
 * Full-screen cover background with herobgg.png, centered hero headline,
 * supportive lead copy, and prominent call-to-action buttons.
 */
export function HomeHero() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const buttonsRef = useRef(null);

  const { introDone } = useTransition();
  const reducedMotion = useReducedMotion();

  // Entrance animation when gate intro finishes
  useGSAP(() => {
    if (reducedMotion || !introDone || !containerRef.current) return;

    const tl = gsap.timeline({ delay: 0.1 });

    if (contentRef.current) {
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }
      );
    }

    if (buttonsRef.current) {
      tl.fromTo(
        buttonsRef.current,
        { opacity: 0, y: 18, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'back.out(1.5)' },
        '-=0.35'
      );
    }
  }, { scope: containerRef, dependencies: [introDone, reducedMotion] });

  return (
    <section ref={containerRef} className="home-hero" aria-label="Hero">
      {/* Full cover background image & cinematic contrast overlay */}
      <div className="home-hero__bg-wrap" aria-hidden="true">
        <img
          src="/images/herobgg.png"
          alt=""
          className="home-hero__bg-img"
          loading="eager"
        />
        <div className="home-hero__bg-overlay" />
      </div>

      <div className="container home-hero__container">
        <div ref={contentRef} className="home-hero__content">
          {/* Confident, bold centered headline */}
          <h1 className="home-hero__h1">
            <WiggleText play={introDone}>Where little minds grow</WiggleText>{' '}
            <span className="home-hero__h1-accent">
              through play, care &amp; confidence.
            </span>
          </h1>

          <p className="home-hero__lead">
            Wiggle is a play-first preschool for children aged 1.5 to 5.5. Small groups, warm certified educators, and a joyful day built around making, moving and asking why.
          </p>

          <div ref={buttonsRef} className="home-hero__buttons">
            <Button variant="primary" to="/enquire">
              Book a school visit
            </Button>
            <Button variant="ghost" to="/programs">
              See our programs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
