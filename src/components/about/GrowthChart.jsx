import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SectionHeading } from '../ui/SectionHeading';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { about } from '../../data/about';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 6: Growth Chart (Stats).
 * Metaphor: Pencil height chart on a doorframe ruler.
 * Pencil tick marks draw outward and numbers count up when entering.
 */
export function GrowthChart() {
  const containerRef = useRef(null);
  const markPathsRef = useRef([]);
  const numberElsRef = useRef([]);
  const reducedMotion = useReducedMotion();

  // Helper to parse if a stat is countable: integer with optional '+' suffix
  const parseCountable = (valStr) => {
    if (!valStr || typeof valStr !== 'string') return null;
    const match = valStr.trim().match(/^(\d+)(\+)?$/);
    if (!match) return null;
    return {
      target: parseInt(match[1], 10),
      suffix: match[2] || '',
    };
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    if (reducedMotion) {
      // Reduced motion: show final static states immediately
      markPathsRef.current.forEach((path) => {
        if (path) {
          path.style.strokeDasharray = 'none';
          path.style.strokeDashoffset = '0';
        }
      });
      about.stats.forEach((st, idx) => {
        const el = numberElsRef.current[idx];
        if (el) el.textContent = st.value;
      });
      return;
    }

    // Set initial dasharray for drawing pencil lines
    markPathsRef.current.forEach((path) => {
      if (path) {
        const len = path.getTotalLength ? path.getTotalLength() : 180;
        path.style.strokeDasharray = `${len} ${len}`;
        path.style.strokeDashoffset = `${len}`;
      }
    });

    // Initialize display values to 0 (or original if not countable like 1:8)
    about.stats.forEach((st, idx) => {
      const el = numberElsRef.current[idx];
      if (!el) return;
      const parsed = parseCountable(st.value);
      if (parsed) {
        el.textContent = `0${parsed.suffix}`;
      } else {
        el.textContent = st.value;
      }
    });

    // Trigger animation once when section enters
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        // 1. Draw pencil lines sequentially
        markPathsRef.current.forEach((path, idx) => {
          if (!path) return;
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 0.8,
            delay: idx * 0.2,
            ease: 'power2.out',
          });
        });

        // 2. Count up numbers
        about.stats.forEach((st, idx) => {
          const el = numberElsRef.current[idx];
          if (!el) return;
          const parsed = parseCountable(st.value);
          if (!parsed) return; // e.g. '1:8' remains as is

          const proxy = { val: 0 };
          gsap.to(proxy, {
            val: parsed.target,
            duration: 1.4,
            delay: idx * 0.15,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = `${Math.round(proxy.val)}${parsed.suffix}`;
            },
          });
        });
      },
    });
  }, { scope: containerRef, dependencies: [reducedMotion] });

  // Ruler tick markings: generate realistic measuring notches
  const tickCount = 28;

  return (
    <section ref={containerRef} className="section section--mint about-growth-section" aria-label="Our growth">
      <div className="container">
        <SectionHeading
          title="How we have grown"
          note="Marks on the classroom doorframe"
          align="center"
          wiggle
        />

        <div className="about-growth__chart-wrap">
          {/* Wooden Doorframe Ruler on Left */}
          <div className="about-growth__ruler" aria-hidden="true">
            <div className="about-growth__ruler-wood">
              {/* Wood grain SVG texture */}
              <svg viewBox="0 0 60 520" preserveAspectRatio="none" className="about-growth__ruler-svg">
                {/* Ruler spine */}
                <rect x="2" y="2" width="56" height="516" rx="4" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3" />
                {/* Inches / cm tick marks */}
                {Array.from({ length: tickCount }).map((_, i) => {
                  const y = 20 + i * 17.5;
                  const isMajor = i % 4 === 0;
                  const tickWidth = isMajor ? 26 : 14;
                  return (
                    <g key={i}>
                      <line
                        x1="4"
                        y1={y}
                        x2={4 + tickWidth}
                        y2={y}
                        stroke="var(--ink)"
                        strokeWidth={isMajor ? 2.5 : 1.5}
                        strokeLinecap="round"
                      />
                      {isMajor && (
                        <text
                          x={34}
                          y={y + 4}
                          fontFamily="var(--font-display)"
                          fontSize="9"
                          fontWeight="800"
                          fill="var(--ink)"
                        >
                          {i * 5}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Pencil marks & Stat items on Right */}
          <div className="about-growth__marks-list">
            {about.stats.map((st, idx) => {
              // Crooked angles for authentic hand-drawn pencil line look
              const angles = [-1.2, 0.8, -0.6, 1.4];
              const angle = angles[idx % angles.length];

              return (
                <div
                  key={st.label}
                  className={`about-growth__mark-row about-growth__mark-row--${idx}`}
                  role="region"
                  aria-label={`${st.value} ${st.label}`}
                >
                  {/* Crooked pencil line drawing from ruler */}
                  <div className="about-growth__pencil-line" aria-hidden="true">
                    <svg viewBox="0 0 160 20" preserveAspectRatio="none" className="about-growth__line-svg">
                      <path
                        ref={(el) => { markPathsRef.current[idx] = el; }}
                        d={`M 0,10 Q 40,${10 + angle * 3} 90,${10 - angle * 2} T 160,${10 + angle}`}
                        fill="none"
                        stroke="#4A5568"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      {/* Little pencil arrowhead / scribble tip */}
                      <circle cx="156" cy={10 + angle} r="3" fill="#4A5568" />
                    </svg>
                  </div>

                  {/* Stat Card */}
                  <div className="about-growth__stat-card">
                    <span
                      ref={(el) => { numberElsRef.current[idx] = el; }}
                      className="about-growth__stat-number"
                    >
                      {st.value}
                    </span>
                    <span className="about-growth__stat-label note">
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
