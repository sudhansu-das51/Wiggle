import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../ui/Icon';
import { hiringSteps as defaultSteps } from '../../data/teachers';

/**
 * Section 4 — What happens after you apply (hopscotch).
 * A chalk-drawn hopscotch on pavement showing each hiring step with
 * handwritten numbers, icons, chalk borders, and a half-circle "Home" square.
 * @param {{
 *   steps?: Array<{ title: string, text: string, icon: string }>,
 *   className?: string
 * }} props
 */
export function Hopscotch({ steps = defaultSteps, className = '' }) {
  // Typical hopscotch pattern:
  // Step 1: Single
  // Step 2 & 3: Paired side by side
  // Step 4: Single
  // Step 5: Single
  // Semicircle Top: Home ("Welcome to the team")

  return (
    <section className={`section section--mint car-hopscotch-section ${className}`}>
      <div className="container">
        <div className="car-hopscotch-layout">
          {/* Left Column: Intro & Note */}
          <div className="car-hopscotch-intro">
            <SectionHeading
              title="What happens after you apply"
              text="The same five squares every teacher jumps through."
              align="left"
              wiggle={true}
            />

            <div className="car-hopscotch-intro-note note">
              <p>
                No trick questions, no 5-round corporate panels. Just honest conversations, a morning sitting on the floor with children, and mutual respect.
              </p>
            </div>

            <div className="car-hopscotch-doodle sticker" aria-hidden="true">
              <Icon name="star" size={20} color="var(--sunny)" />
              <span className="note">Take it one jump at a time</span>
            </div>
          </div>

          {/* Right Column: Chalk Hopscotch on Dark Ink Pavement */}
          <div className="car-hopscotch-court-wrapper">
            <div className="car-hopscotch-court">
              {/* Decorative Chalk Crack & Stars */}
              <div className="car-hopscotch-chalk-decor" aria-hidden="true">
                <svg viewBox="0 0 300 600" className="car-hopscotch-cracks-svg">
                  <path d="M 40 120 Q 80 140 120 130 T 160 170" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
                  <path d="M 220 320 Q 180 340 190 390" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" fill="none" />
                  <path d="M 60 480 Q 90 490 140 470" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
                </svg>
              </div>

              {/* Semicircle Home at Top */}
              <div className="car-hopscotch-home">
                <div className="car-hopscotch-home-arch">
                  <span className="car-hopscotch-home-label note">Welcome to the team</span>
                  <div className="car-hopscotch-home-badge">
                    <Icon name="heart" size={24} color="var(--bubblegum)" />
                  </div>
                </div>
              </div>

              {/* Step 5 (Single) */}
              {steps[4] && (
                <div className="car-hopscotch-row car-hopscotch-row--single">
                  <article className="car-hopscotch-square car-hopscotch-square--5">
                    <span className="car-hopscotch-num note">5</span>
                    <div className="car-hopscotch-square-body">
                      <div className="car-hopscotch-icon-wrap" aria-hidden="true">
                        <Icon name={steps[4].icon} size={22} color="var(--sunny)" />
                      </div>
                      <h3 className="car-hopscotch-title">{steps[4].title}</h3>
                      <p className="car-hopscotch-desc">{steps[4].text}</p>
                    </div>
                  </article>
                </div>
              )}

              {/* Step 4 (Single) */}
              {steps[3] && (
                <div className="car-hopscotch-row car-hopscotch-row--single">
                  <article className="car-hopscotch-square car-hopscotch-square--4">
                    <span className="car-hopscotch-num note">4</span>
                    <div className="car-hopscotch-square-body">
                      <div className="car-hopscotch-icon-wrap" aria-hidden="true">
                        <Icon name={steps[3].icon} size={22} color="var(--bubblegum)" />
                      </div>
                      <h3 className="car-hopscotch-title">{steps[3].title}</h3>
                      <p className="car-hopscotch-desc">{steps[3].text}</p>
                    </div>
                  </article>
                </div>
              )}

              {/* Steps 2 & 3 (Side-by-side Pair) */}
              {steps[1] && steps[2] && (
                <div className="car-hopscotch-row car-hopscotch-row--double">
                  <article className="car-hopscotch-square car-hopscotch-square--pair-left">
                    <span className="car-hopscotch-num note">2</span>
                    <div className="car-hopscotch-square-body">
                      <div className="car-hopscotch-icon-wrap" aria-hidden="true">
                        <Icon name={steps[1].icon} size={22} color="var(--sky)" />
                      </div>
                      <h3 className="car-hopscotch-title">{steps[1].title}</h3>
                      <p className="car-hopscotch-desc">{steps[1].text}</p>
                    </div>
                  </article>

                  <article className="car-hopscotch-square car-hopscotch-square--pair-right">
                    <span className="car-hopscotch-num note">3</span>
                    <div className="car-hopscotch-square-body">
                      <div className="car-hopscotch-icon-wrap" aria-hidden="true">
                        <Icon name={steps[2].icon} size={22} color="var(--meadow)" />
                      </div>
                      <h3 className="car-hopscotch-title">{steps[2].title}</h3>
                      <p className="car-hopscotch-desc">{steps[2].text}</p>
                    </div>
                  </article>
                </div>
              )}

              {/* Step 1 (Single, Starting Square at Base) */}
              {steps[0] && (
                <div className="car-hopscotch-row car-hopscotch-row--single">
                  <article className="car-hopscotch-square car-hopscotch-square--1">
                    <span className="car-hopscotch-num note">1</span>
                    <div className="car-hopscotch-square-body">
                      <div className="car-hopscotch-icon-wrap" aria-hidden="true">
                        <Icon name={steps[0].icon} size={22} color="var(--sunny)" />
                      </div>
                      <h3 className="car-hopscotch-title">{steps[0].title}</h3>
                      <p className="car-hopscotch-desc">{steps[0].text}</p>
                    </div>
                  </article>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hopscotch;
