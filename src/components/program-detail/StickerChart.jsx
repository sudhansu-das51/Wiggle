import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { curriculum } from '../../data/curriculum';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './program-detail.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section 5: Reward Sticker Chart Board.
 * Stickers stamped in sequence on ScrollTrigger enter.
 * @param {{
 *   program: {
 *     name: string,
 *     learningAreaIds?: string[]
 *   }
 * }} props
 */
export function StickerChart({ program }) {
  const chartRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Find learning areas
  const allAreas = curriculum?.learningAreas || [];
  const matchedAreas = (program.learningAreaIds || [])
    .map((id) => allAreas.find((a) => a.id === id || a.id.includes(id)))
    .filter(Boolean);

  const areasToRender = matchedAreas.length ? matchedAreas : allAreas.slice(0, 3);

  // Stamping animation per row
  useGSAP(() => {
    if (reducedMotion || !chartRef.current) return;

    const rows = chartRef.current.querySelectorAll('.pd-chart-row');
    rows.forEach((row) => {
      const stickers = row.querySelectorAll('.pd-skill-sticker');
      if (!stickers.length) return;

      gsap.fromTo(
        stickers,
        {
          scale: 1.6,
          opacity: 0,
          y: -15,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'back.out(2.2)',
          stagger: 0.08,
          scrollTrigger: {
            trigger: row,
            start: 'top 78%',
            once: true,
          },
        }
      );
    });
  }, { scope: chartRef, dependencies: [program.name, reducedMotion] });

  const stickerRotations = [-1.8, 1.2, -0.8, 1.6, -1.4, 2.0];

  return (
    <section id="learning" className="section pd-learning-section" aria-label="Curriculum sticker chart">
      <div className="container">
        <SectionHeading
          title="What your child will learn"
          note="Stickers earned by the end of the year."
          align="center"
          wiggle
        />

        {/* Big Reward Chart Board */}
        <div ref={chartRef} className="pd-reward-board">
          {/* Pegboard Decorative Margin Dots */}
          <div className="pd-board-peg-dots" aria-hidden="true" />

          {/* Rows per learning area */}
          <div className="pd-chart-rows-list">
            {areasToRender.map((area, rowIdx) => {
              const firstSentence = area.description?.split('.')[0] + '.' || area.description;
              const tintColor = `var(--tint-${area.tint || 'yellow'})`;

              return (
                <div key={area.id} className="pd-chart-row">
                  {/* Row Header */}
                  <div className="pd-chart-row__header">
                    <div
                      className="pd-chart-row__icon-badge"
                      style={{ backgroundColor: tintColor }}
                      aria-hidden="true"
                    >
                      <Icon name={area.icon} size={24} color="var(--ink)" />
                    </div>
                    <div>
                      <h3 className="pd-chart-row__title">
                        {area.name}
                      </h3>
                      <p className="pd-chart-row__desc">
                        {firstSentence}
                      </p>
                    </div>
                  </div>

                  {/* Skills Sticker Badges */}
                  <div className="pd-chart-row__stickers" role="list" aria-label={`${area.name} skills`}>
                    {area.skills?.map((skill, sIdx) => {
                      const rot = stickerRotations[(rowIdx + sIdx) % stickerRotations.length];
                      return (
                        <div
                          key={sIdx}
                          className="pd-skill-sticker sticker"
                          role="listitem"
                          style={{
                            backgroundColor: tintColor,
                            '--sticker-rot': `${rot}deg`,
                            transform: `rotate(${rot}deg)`,
                          }}
                        >
                          <span className="pd-skill-star" aria-hidden="true">
                            <Icon name="star" size={13} color="var(--ink)" />
                          </span>
                          <span className="pd-skill-text">{skill}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Link to Curriculum */}
        <div className="pd-learning-action">
          <Button variant="ghost" to="/curriculum">
            See the full curriculum
          </Button>
        </div>
      </div>
    </section>
  );
}
