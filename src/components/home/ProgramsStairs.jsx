import React, { useRef, useEffect } from 'react';
import { programs } from '../../data/programs';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionHeading } from '../ui/SectionHeading';
import { TransitionLink } from '../motion/TransitionLink';
import { StickerCard } from '../ui/StickerCard';
import { Icon } from '../ui/Icon';
import './home.css';

/**
 * Section 4: Programs Staircase.
 * 4 classrooms stepped like a staircase with animated connecting path.
 */
const programImages = {
  playgroup: '/images/playground.png',
  nursery: '/images/nursery.png',
  'jr-kg': '/images/jrkg.png',
  'sr-kg': '/images/srkg.png',
};

export function ProgramsStairs() {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !pathRef.current) return;

    let anim = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          import('animejs')
            .then(({ animate, svg }) => {
              if (!pathRef.current) return;
              if (svg?.createDrawable) {
                const drawable = svg.createDrawable(pathRef.current);
                anim = animate(drawable, {
                  draw: ['0 0', '0 1'],
                  duration: 1200,
                  ease: 'inOutSine',
                });
              } else {
                const len = pathRef.current.getTotalLength?.() || 600;
                pathRef.current.style.strokeDasharray = len;
                pathRef.current.style.strokeDashoffset = len;
                anim = animate(pathRef.current, {
                  strokeDashoffset: [len, 0],
                  duration: 1200,
                  ease: 'inOutSine',
                });
              }
            })
            .catch(() => {});
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      anim?.pause?.();
    };
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="section section--yellow programs-stairs" aria-label="Programs">
      <div className="container">
        <SectionHeading
          title="Four classrooms, one growing-up path"
          align="center"
          wiggle
        />

        {/* Dotted winding SVG path connecting cards */}
        <div style={{ position: 'relative', width: '100%', height: '40px', display: 'none' }} className="programs-path-desktop">
          <svg viewBox="0 0 1000 40" width="100%" height="40" fill="none">
            <path
              ref={pathRef}
              d="M 120 20 Q 300 -10, 400 20 T 700 20 T 900 20"
              stroke="var(--ink)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="programs-stairs__grid">
          {programs.map((prog, index) => (
            <div key={prog.slug} className={`programs-stairs__step programs-stairs__step--${index}`}>
              <StickerCard
                shape="arch"
                tint={prog.tint}
                className="program-card"
              >
                <div>
                  <div className="program-card__dome">
                    <div className="program-card__image-badge" aria-hidden="true">
                      <img
                        src={programImages[prog.slug] || '/images/playground.png'}
                        alt={prog.name}
                        className="program-card__image"
                        loading="lazy"
                      />
                    </div>
                    <span className="program-card__age">{prog.ageRange}</span>
                  </div>

                  <h3 className="program-card__title">{prog.name}</h3>
                  <p className="note program-card__tagline">
                    {prog.tagline}
                  </p>

                  <ul className="program-card__highlights">
                    {prog.highlights.map((h, i) => (
                      <li key={i} className="program-card__highlight-item">
                        <Icon name="check" size={16} color="var(--meadow)" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <TransitionLink
                    to={`/programs/${prog.slug}`}
                    className="btn btn--primary"
                    style={{ width: '100%', fontSize: '0.95rem', padding: '0.65rem 1rem' }}
                  >
                    See {prog.name}
                  </TransitionLink>
                </div>
              </StickerCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
