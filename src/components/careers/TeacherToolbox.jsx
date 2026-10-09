import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../ui/Icon';
import { careerPerks as defaultPerks } from '../../data/jobs';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const COMPARTMENT_TINTS = [
  'var(--tint-yellow)',
  'var(--tint-mint)',
  'var(--tint-pink)',
  'var(--tint-sky)',
  'var(--tint-yellow)',
  'var(--tint-mint)',
];

/**
 * Section 2 — Why teach here (the teacher's toolbox).
 * A big open toolbox with a hinged lid that opens once on scroll,
 * and compartments for each career perk.
 * @param {{
 *   perks?: Array<{ title: string, text: string, icon: string }>,
 *   className?: string
 * }} props
 */
export function TeacherToolbox({ perks = defaultPerks, className = '' }) {
  const containerRef = useRef(null);
  const lidRef = useRef(null);
  const iconsRef = useRef([]);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const isSaveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
      if (reducedMotion || isSaveData || !lidRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      // Hinged lid swings back from closed (0deg) to open (-105deg)
      tl.fromTo(
        lidRef.current,
        { rotateX: 0 },
        {
          rotateX: -105,
          duration: 0.8,
          ease: 'back.out(1.2)',
          transformOrigin: '50% 100%',
        }
      );

      // Icons tiny bounce stagger
      const validIcons = iconsRef.current.filter(Boolean);
      if (validIcons.length > 0) {
        tl.fromTo(
          validIcons,
          { scale: 0.85, y: -4 },
          {
            scale: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.05,
            ease: 'back.out(2)',
          },
          '-=0.4'
        );
      }
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <section className={`section section--sky car-toolbox-section ${className}`}>
      <div className="container">
        <SectionHeading
          title="What is in a Wiggle teacher's toolbox"
          text="Besides glue, glitter and a lot of patience."
          align="center"
          wiggle={true}
        />

        <div ref={containerRef} className="car-toolbox-wrapper">
          {/* Metal Handle on Top of Toolbox */}
          <div className="car-toolbox__handle-wrap" aria-hidden="true">
            <div className="car-toolbox__handle">
              <div className="car-toolbox__handle-bar" />
              <div className="car-toolbox__handle-bracket car-toolbox__handle-bracket--left" />
              <div className="car-toolbox__handle-bracket car-toolbox__handle-bracket--right" />
            </div>
          </div>

          {/* Toolbox Main Body with Perspective for Hinged Lid */}
          <div className="car-toolbox">
            {/* Hinged Lid (Decorative layer behind the compartments) */}
            <div
              ref={lidRef}
              className={`car-toolbox__lid ${reducedMotion ? 'car-toolbox__lid--open' : ''}`}
              aria-hidden="true"
            >
              <div className="car-toolbox__lid-lip">
                <span className="car-toolbox__latch-top" />
              </div>
            </div>

            {/* Front Body & Metal Latch */}
            <div className="car-toolbox__latch-base" aria-hidden="true">
              <div className="car-toolbox__latch-hasp" />
            </div>

            {/* Compartments Tray */}
            <div className="car-toolbox__tray" role="list">
              {perks.map((perk, idx) => {
                const tint = COMPARTMENT_TINTS[idx % COMPARTMENT_TINTS.length];
                return (
                  <article
                    key={idx}
                    className={`car-toolbox__compartment car-toolbox__compartment--${idx + 1}`}
                    style={{ backgroundColor: tint }}
                    role="listitem"
                  >
                    <div className="car-toolbox__compartment-header">
                      <div
                        ref={(el) => (iconsRef.current[idx] = el)}
                        className="car-toolbox__icon-badge"
                        aria-hidden="true"
                      >
                        <Icon name={perk.icon} size={24} color="var(--ink)" />
                      </div>
                      <h3 className="car-toolbox__compartment-title">{perk.title}</h3>
                    </div>
                    <p className="car-toolbox__compartment-text">{perk.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeacherToolbox;
