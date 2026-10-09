import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { dayAtWiggle } from '../../data/dayAtWiggle';
import { siteConfig } from '../../config/siteConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../ui/Icon';
import { Mascot } from '../ui/Mascot';
import './home.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 6: A Day at Wiggle (Pinned Horizontal Scroll).
 * Timeline with pinned horizontal scrub on desktop and vertical stack on mobile.
 */
export function DayAtWiggle() {
  const sectionRef = useRef(null);
  const stripRef = useRef(null);
  const progressFillRef = useRef(null);
  const mascotTrackerRef = useRef(null);

  const reducedMotion = useReducedMotion();
  const dayScrollEnabled = siteConfig?.animations?.dayScroll !== false;

  const tintBgMap = {
    yellow: 'var(--tint-yellow)',
    pink: 'var(--tint-pink)',
    mint: 'var(--tint-mint)',
    sky: 'var(--tint-sky)',
  };

  useGSAP(() => {
    if (reducedMotion || !dayScrollEnabled || !sectionRef.current || !stripRef.current) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const strip = stripRef.current;
      const getScrollAmount = () => -Math.max(0, strip.scrollWidth - window.innerWidth + 120);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${Math.max(strip.scrollWidth - window.innerWidth + 600, 1100)}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      tl.to(strip, {
        x: getScrollAmount,
        ease: 'none',
      });

      if (progressFillRef.current) {
        tl.to(progressFillRef.current, {
          width: '100%',
          ease: 'none',
        }, 0);
      }

      if (mascotTrackerRef.current) {
        tl.to(mascotTrackerRef.current, {
          left: '100%',
          ease: 'none',
        }, 0);
      }
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion, dayScrollEnabled] });

  return (
    <section ref={sectionRef} className="section section--paper day-at-wiggle" aria-label="Daily Routine">
      <div className="container day-at-wiggle__header">
        <SectionHeading
          title="A day at Wiggle"
          note="Unrushed, predictable rhythms that build gentle confidence."
          align="center"
          wiggle
        />
      </div>

      <div className="day-at-wiggle__strip-wrapper">
        <div ref={stripRef} className="day-at-wiggle__strip" style={{ paddingInline: 'var(--gutter)' }}>
          {dayAtWiggle.map((item, index) => {
            const tintBg = tintBgMap[item.tint] || 'var(--tint-yellow)';

            return (
              <div key={index} className="day-panel">
                <span className="day-panel__time">{item.time}</span>

                <div
                  className="day-panel__icon-box"
                  style={{ backgroundColor: tintBg }}
                >
                  <Icon name={item.icon} size={42} color="var(--ink)" />
                </div>

                <h3 className="day-panel__title">{item.title}</h3>
                <p className="day-panel__text">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="day-at-wiggle__bottom">
        {/* Progress track with Wig tracker on desktop and time labels */}
        <div className="container day-at-wiggle__progress" aria-hidden="true">
          <span className="day-at-wiggle__time-label day-at-wiggle__time-label--start">8:30 AM</span>
          <div className="day-at-wiggle__progress-bar">
            <div ref={progressFillRef} className="day-at-wiggle__progress-fill" />
            <div ref={mascotTrackerRef} className="day-at-wiggle__mascot-tracker">
              <Mascot mood="wave" size={34} />
            </div>
          </div>
          <span className="day-at-wiggle__time-label day-at-wiggle__time-label--end">12:30 PM</span>
        </div>
      </div>
    </section>
  );
}
