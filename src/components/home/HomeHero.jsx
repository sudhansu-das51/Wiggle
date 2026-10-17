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
  const hasAnimatedRef = useRef(false);

  const { introDone, introRevealing } = useTransition();
  const reducedMotion = useReducedMotion();

  // If user already saw intro on a previous visit/page, or reduced motion, or gate reached reveal
  const shouldReveal = introDone || introRevealing || reducedMotion;

  // Entrance animation when gate intro reaches reveal point
  useGSAP(() => {
    if (reducedMotion || !shouldReveal || hasAnimatedRef.current || !containerRef.current) return;
    hasAnimatedRef.current = true;

    // If intro was already done before mount (returning user/navigated from other page)
    if (introDone && !introRevealing) {
      if (contentRef.current) {
        gsap.set(contentRef.current, { opacity: 1, y: 0 });
      }
      if (buttonsRef.current) {
        gsap.set(buttonsRef.current, { opacity: 1, y: 0, scale: 1 });
      }
      return;
    }

    // First visit: Smooth entrance choreographed with the gate opening
    const tl = gsap.timeline({ delay: 0.05 });

    if (contentRef.current) {
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.95, ease: 'power3.out' }
      );
    }

    if (buttonsRef.current) {
      tl.fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)' },
        '-=0.45'
      );
    }
  }, { scope: containerRef, dependencies: [shouldReveal, introDone, introRevealing, reducedMotion] });

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
        <div
          ref={contentRef}
          className={`home-hero__content ${!shouldReveal ? 'home-hero__content--hidden' : ''}`}
        >
          {/* Confident, bold centered headline */}
          <h1 className="home-hero__h1">
            <WiggleText play={shouldReveal}>Where little minds grow</WiggleText>{' '}
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
