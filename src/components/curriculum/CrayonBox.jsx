import React, { useState, useRef, useEffect } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../ui/Icon';
import { TransitionLink } from '../motion/TransitionLink';
import { curriculum } from '../../data/curriculum';
import { programs } from '../../data/programs';
import { getTintColor } from './tintColor';
import { animate } from 'animejs';

/**
 * Section 3: The Six Learning Areas (Crayon Box).
 * Interactive tablist of crayons that pull out of a box to reveal drawing sheets.
 */
export function CrayonBox() {
  const { learningAreas = [] } = curriculum;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeArea = learningAreas[selectedIndex] || learningAreas[0];
  const squiggleRef = useRef(null);
  const sheetContentRef = useRef(null);
  const tabsRef = useRef([]);

  // Animate squiggle and sheet crossfade on crayon selection
  useEffect(() => {
    if (!activeArea) return;

    // Crossfade sheet content
    if (sheetContentRef.current) {
      animate(sheetContentRef.current, {
        opacity: [0.3, 1],
        translateY: [8, 0],
        duration: 350,
        ease: 'outQuad',
      });
    }

    // Redraw squiggle
    if (squiggleRef.current) {
      const pathEl = squiggleRef.current;
      const length = pathEl.getTotalLength ? pathEl.getTotalLength() : 300;
      pathEl.style.strokeDasharray = length;
      pathEl.style.strokeDashoffset = length;

      animate(pathEl, {
        strokeDashoffset: [length, 0],
        duration: 600,
        ease: 'inOutCubic',
      });
    }
  }, [selectedIndex, activeArea]);

  const handleSelect = (idx) => {
    if (idx === selectedIndex || isAnimating) return;
    setIsAnimating(true);
    setSelectedIndex(idx);
    setTimeout(() => setIsAnimating(false), 250);
  };

  // Keyboard navigation for roving tablist
  const handleKeyDown = (e, index) => {
    let nextIndex = null;
    const count = learningAreas.length;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % count;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + count) % count;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = count - 1;
    }

    if (nextIndex !== null) {
      handleSelect(nextIndex);
      tabsRef.current[nextIndex]?.focus();
    }
  };

  // Find which programs include the active learning area
  const matchingPrograms = programs.filter((p) =>
    p.learningAreaIds?.includes(activeArea?.id)
  );

  const activeStrongColor = getTintColor(activeArea?.tint, selectedIndex);

  return (
    <section id="crayons" className="section section--sky cur-crayon-section" aria-label="Learning areas">
      <div className="container">
        <SectionHeading
          title="Pick a crayon, see what we color in"
          note="Tap a crayon."
          align="center"
          wiggle
        />

        <div className="cur-crayon-layout">
          {/* Crayon Box with Crayons (Tablist) */}
          <div className="cur-crayon-box-col">
            <div
              className="cur-crayon-box sticker"
              role="tablist"
              aria-label="Learning areas crayons"
            >
              {/* Cardboard box front decoration */}
              <div className="cur-crayon-box__front">
                <div className="cur-box-label note">Wiggle Colors</div>
                <div className="cur-box-stripe" aria-hidden="true" />
              </div>

              {/* Crayons row */}
              <div className="cur-crayons-rack">
                {learningAreas.map((area, idx) => {
                  const isSelected = selectedIndex === idx;
                  const crayonColor = getTintColor(area.tint, idx);

                  return (
                    <button
                      key={area.id || idx}
                      ref={(el) => (tabsRef.current[idx] = el)}
                      role="tab"
                      id={`tab-${area.id}`}
                      aria-selected={isSelected}
                      aria-controls={`panel-${area.id}`}
                      tabIndex={isSelected ? 0 : -1}
                      className={`cur-crayon-btn ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => handleSelect(idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      style={{
                        '--crayon-color': crayonColor,
                      }}
                      aria-label={`${area.name} crayon`}
                    >
                      <div className="cur-crayon-wrapper">
                        <svg
                          viewBox="0 0 54 240"
                          width="52"
                          height="230"
                          className="cur-crayon-svg"
                          aria-hidden="true"
                        >
                          {/* Wax Point Cone Tip */}
                          <polygon
                            points="14,42 27,6 40,42"
                            fill={crayonColor}
                            stroke="var(--ink)"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                          />
                          {/* Tip highlight shine */}
                          <polygon
                            points="22,14 27,6 30,14 26,40 22,40"
                            fill="rgba(255, 255, 255, 0.4)"
                          />

                          {/* Wax Shoulder */}
                          <rect
                            x="7"
                            y="42"
                            width="40"
                            height="12"
                            fill={crayonColor}
                            stroke="var(--ink)"
                            strokeWidth="2.5"
                          />

                          {/* Paper Wrapper Body */}
                          <rect
                            x="7"
                            y="54"
                            width="40"
                            height="146"
                            fill="#FFFDF6"
                            stroke="var(--ink)"
                            strokeWidth="2.5"
                          />

                          {/* Top Crayola double wave band */}
                          <path
                            d="M 7,64 Q 17,60 27,64 T 47,64"
                            fill="none"
                            stroke={crayonColor}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 7,71 Q 17,67 27,71 T 47,71"
                            fill="none"
                            stroke="var(--ink)"
                            strokeWidth="1.5"
                          />

                          {/* Bottom Crayola double wave band */}
                          <path
                            d="M 7,184 Q 17,180 27,184 T 47,184"
                            fill="none"
                            stroke="var(--ink)"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M 7,191 Q 17,187 27,191 T 47,191"
                            fill="none"
                            stroke={crayonColor}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />

                          {/* Wax Bottom Cap */}
                          <rect
                            x="7"
                            y="200"
                            width="40"
                            height="32"
                            rx="4"
                            fill={crayonColor}
                            stroke="var(--ink)"
                            strokeWidth="2.5"
                          />
                          {/* Wax bottom highlight */}
                          <line
                            x1="12"
                            y1="204"
                            x2="12"
                            y2="228"
                            stroke="rgba(255, 255, 255, 0.45)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />

                          {/* Paper Wrapper Text - Fully visible, legible, zero clipping */}
                          <g transform="translate(27, 128) rotate(-90)">
                            <text
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="var(--ink)"
                              fontFamily="var(--font-note)"
                              fontSize="10"
                              fontWeight="bold"
                              letterSpacing="0.3"
                              textLength={area.name.length > 25 ? '106' : undefined}
                              lengthAdjust={area.name.length > 25 ? 'spacingAndGlyphs' : undefined}
                            >
                              {area.name}
                            </text>
                          </g>
                        </svg>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Drawing Sheet (Tabpanel) */}
          <div className="cur-drawing-sheet-col">
            <div
              role="tabpanel"
              id={`panel-${activeArea?.id}`}
              aria-labelledby={`tab-${activeArea?.id}`}
              className="cur-drawing-sheet sticker"
            >
              {/* Animated squiggle drawn in area's color */}
              <div className="cur-sheet-squiggle-wrapper" aria-hidden="true">
                <svg
                  viewBox="0 0 600 24"
                  preserveAspectRatio="none"
                  className="cur-sheet-squiggle-svg"
                >
                  <path
                    ref={squiggleRef}
                    d="M 10 12 Q 40 2 70 12 T 130 12 T 190 12 T 250 12 T 310 12 T 370 12 T 430 12 T 490 12 T 550 12 T 590 12"
                    fill="none"
                    stroke={activeStrongColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div ref={sheetContentRef} className="cur-sheet-content">
                <div className="cur-sheet-header">
                  <div
                    className="cur-sheet-icon-bubble"
                    style={{ backgroundColor: `var(--tint-${activeArea?.tint || 'yellow'})` }}
                    aria-hidden="true"
                  >
                    <Icon name={activeArea?.icon} size={32} color="var(--ink)" />
                  </div>
                  <h3 className="cur-sheet-title">{activeArea?.name}</h3>
                </div>

                <p className="cur-sheet-description">{activeArea?.description}</p>

                {/* Skills as Sticker Badges */}
                <div className="cur-sheet-skills-section">
                  <h4 className="cur-sheet-skills-label note">Skills we nurture:</h4>
                  <div className="cur-sheet-skills-grid">
                    {activeArea?.skills?.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="cur-skill-badge chip"
                        style={{
                          backgroundColor: `var(--tint-${activeArea.tint || 'yellow'})`,
                          transform: `rotate(${(sIdx % 3 - 1) * 1.5}deg)`,
                        }}
                      >
                        <Icon name="star" size={14} color="var(--ink)" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Found in Programs */}
                {matchingPrograms.length > 0 && (
                  <div className="cur-sheet-programs-section">
                    <span className="cur-found-in-label note">Found in:</span>
                    <div className="cur-found-in-chips">
                      {matchingPrograms.map((prog) => (
                        <TransitionLink
                          key={prog.slug}
                          to={`/programs/${prog.slug}`}
                          className="cur-program-chip chip"
                        >
                          <span className="cur-chip-dot" style={{ backgroundColor: `var(--tint-${prog.tint})` }} />
                          <span>{prog.name}</span>
                        </TransitionLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CrayonBox;
