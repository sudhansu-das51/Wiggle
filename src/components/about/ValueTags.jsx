import React, { useRef, useEffect } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../ui/Icon';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { about } from '../../data/about';

/**
 * Section 4: Values (Name Tags).
 * Playful "Hello, I am..." sticker name badges with handwritten titles,
 * offset vertical layout, and hover/focus wobbles.
 */
export function ValueTags() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const reducedMotion = useReducedMotion();

  // Band colors (strictly NOT tangerine per design contract)
  const bandColors = [
    'var(--sunny)',
    'var(--meadow)',
    'var(--sky)',
    'var(--bubblegum)',
  ];

  // Base rotations and vertical offsets for natural sticker-book scatter
  const cardStyles = [
    { rotate: -2.5, offsetY: '0px' },
    { rotate: 2.2, offsetY: '24px' },
    { rotate: -1.8, offsetY: '-16px' },
    { rotate: 2.8, offsetY: '20px' },
  ];

  // Hover/focus wobble micro-interaction
  useEffect(() => {
    if (reducedMotion) return;

    let cleanup = () => {};

    import('animejs')
      .then(({ animate }) => {
        const cleanups = [];

        cardRefs.current.forEach((card, idx) => {
          if (!card) return;
          const baseRot = cardStyles[idx]?.rotate || 0;

          const onHover = () => {
            animate(card, {
              rotate: [baseRot, baseRot - 4, baseRot + 4, baseRot - 1.5, baseRot + 1.5, baseRot],
              scale: [1, 1.04, 1],
              duration: 550,
              ease: 'inOutQuad',
            });
          };

          card.addEventListener('mouseenter', onHover);
          card.addEventListener('focus', onHover);

          cleanups.push(() => {
            card.removeEventListener('mouseenter', onHover);
            card.removeEventListener('focus', onHover);
          });
        });

        cleanup = () => {
          cleanups.forEach((fn) => fn());
        };
      })
      .catch(() => {});

    return () => cleanup();
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className="section section--pink about-values-section" aria-label="Our core values">
      <div className="container">
        <SectionHeading
          title="The four things we teach by doing"
          note="Living values, not poster words"
          align="center"
          wiggle
        />

        <div className="about-values__grid">
          {about.values.map((val, idx) => {
            const style = cardStyles[idx] || { rotate: 0, offsetY: '0px' };
            const bandColor = bandColors[idx % bandColors.length];

            return (
              <div
                key={val.title}
                ref={(el) => { cardRefs.current[idx] = el; }}
                tabIndex={0}
                className={`about-values__tag about-values__tag--${idx}`}
                style={{
                  '--tag-base-rot': `${style.rotate}deg`,
                  '--tag-offset-y': style.offsetY,
                }}
                role="article"
                aria-label={val.title}
              >
                {/* Brass pin at top center */}
                <div className="about-values__pin" aria-hidden="true">
                  <div className="about-values__pin-head" />
                </div>

                {/* Top colored band */}
                <div
                  className="about-values__band"
                  style={{ backgroundColor: bandColor }}
                >
                  <span className="about-values__greeting">Hello, I am</span>
                </div>

                {/* White / paper card body */}
                <div className="about-values__body">
                  <div className="about-values__header-row">
                    <h3 className="about-values__title note">
                      {val.title}
                    </h3>
                    <div className="about-values__icon-wrap" aria-hidden="true">
                      <Icon name={val.icon} size={28} color="var(--ink)" />
                    </div>
                  </div>

                  <p className="about-values__text">
                    {val.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
