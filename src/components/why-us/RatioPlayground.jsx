import React, { useState, useRef } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { ComparisonTable } from './ComparisonTable';
import { comparison } from '../../data/comparison';
import { siteConfig } from '../../config/siteConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import gsap from 'gsap';

// Palette colors for children figures (strictly excluding tangerine)
const CHILD_COLORS = ['var(--bubblegum)', 'var(--sky)', 'var(--meadow)', 'var(--sunny)'];

/**
 * Calculates (x, y) coordinates for n children across 3 concentric rings around center (200, 200).
 */
function getConcentricChildrenPositions(count) {
  const center = 200;
  const positions = [];

  // Ring configurations: max capacities and radii
  const rings = [
    { capacity: 6, radius: 65 },
    { capacity: 10, radius: 115 },
    { capacity: 14, radius: 158 },
  ];

  let remaining = count;

  for (let r = 0; r < rings.length && remaining > 0; r++) {
    const { capacity, radius } = rings[r];
    const ringCount = Math.min(remaining, capacity);

    for (let i = 0; i < ringCount; i++) {
      // Angular offset to stagger positions pleasantly
      const angle = (2 * Math.PI * i) / ringCount - Math.PI / 2 + (r * 0.25);
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      positions.push({ x, y, ring: r });
    }

    remaining -= ringCount;
  }

  return positions;
}

/**
 * Section 4: Attention per Child (Ratio Playground & Comparison).
 * Interactive rug with SVG children popping onto concentric rings as slider moves,
 * and semantic comparison table below.
 */
export function RatioPlayground() {
  const brand = siteConfig.brand?.name || 'Wiggle';
  const wiggleRatio = comparison.ratio?.wiggle || 8;
  const typicalRatio = comparison.ratio?.typical || 25;

  const [classSize, setClassSize] = useState(typicalRatio);
  const isReduced = useReducedMotion();
  const sliderProxyRef = useRef({ value: typicalRatio });

  const minutesPerChild = (60 / classSize).toFixed(1);
  const wiggleMinutes = (60 / wiggleRatio).toFixed(1);
  const childrenPositions = getConcentricChildrenPositions(classSize);

  // Jump to Wiggle ratio with smooth 0.5s animation
  const handleJumpToWiggle = () => {
    if (isReduced) {
      setClassSize(wiggleRatio);
      return;
    }

    sliderProxyRef.current.value = classSize;
    gsap.to(sliderProxyRef.current, {
      value: wiggleRatio,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        setClassSize(Math.round(sliderProxyRef.current.value));
      },
    });
  };

  return (
    <section
      id="ratio"
      className="section section--pink why-ratio-section"
      aria-label="Class size and attention ratio playground"
    >
      <div className="container">
        <SectionHeading
          title="Why a small group matters"
          text="Slide the class size and see how a teacher's hour gets shared."
          align="center"
          wiggle
        />

        {/* Playground Card */}
        <div className="why-playground-card sticker" role="region" aria-label="Interactive teacher attention simulator">
          <div className="why-playground-inner">
            {/* The Scalloped Circular Play Rug */}
            <div className="why-rug-wrapper" aria-hidden="true">
              <svg
                viewBox="0 0 400 400"
                className="why-rug-svg"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Scalloped Rug Border Mask */}
                  <filter id="rug-shadow" x="-5%" y="-5%" width="115%" height="115%">
                    <feDropShadow dx="3" dy="3" stdDeviation="0" floodColor="var(--ink)" />
                  </filter>
                </defs>

                {/* 1. Base Scalloped Rug Pattern */}
                <circle cx="200" cy="200" r="190" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3.5" filter="url(#rug-shadow)" />
                {/* Concentric stitching guidelines */}
                <circle cx="200" cy="200" r="158" fill="none" stroke="rgba(35, 42, 92, 0.15)" strokeWidth="1.5" />
                <circle cx="200" cy="200" r="115" fill="none" stroke="rgba(35, 42, 92, 0.15)" strokeWidth="1.5" />
                <circle cx="200" cy="200" r="65" fill="none" stroke="rgba(35, 42, 92, 0.15)" strokeWidth="1.5" />
                <circle cx="200" cy="200" r="32" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />

                {/* 2. Central Teacher Figure */}
                <g transform="translate(200, 200)">
                  {/* Teacher body */}
                  <circle cx="0" cy="0" r="22" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
                  {/* Glasses */}
                  <circle cx="-6" cy="-2" r="5" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
                  <circle cx="6" cy="-2" r="5" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
                  <line x1="-1" y1="-2" x2="1" y2="-2" stroke="var(--ink)" strokeWidth="1.5" />
                  {/* Smile */}
                  <path d="M -5,8 Q 0,13 5,8" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
                  {/* Teacher badge label */}
                  <text x="0" y="32" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-note)" fontSize="10" fontWeight="bold">TEACHER</text>
                </g>

                {/* 3. Concentric Children Figures */}
                {childrenPositions.map((pos, idx) => {
                  const color = CHILD_COLORS[idx % CHILD_COLORS.length];

                  return (
                    <g
                      key={idx}
                      className="why-child-figure"
                      transform={`translate(${pos.x}, ${pos.y})`}
                    >
                      {/* Body bubble */}
                      <circle cx="0" cy="0" r="14" fill={color} stroke="var(--ink)" strokeWidth="2.5" />
                      {/* Cheerful little eyes */}
                      <circle cx="-4" cy="-2" r="1.75" fill="var(--ink)" />
                      <circle cx="4" cy="-2" r="1.75" fill="var(--ink)" />
                      {/* Little smile */}
                      <path d="M -3,4 Q 0,7 3,4" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Readout and Slider Controls */}
            <div className="why-slider-col">
              {/* Dynamic Live Attention Readout */}
              <div className="why-readout-card" aria-live="polite">
                <div className="why-readout-header">
                  <span className="why-readout-ratio">
                    {classSize} children, 1 teacher
                  </span>
                  {classSize === wiggleRatio && (
                    <span className="why-wiggle-badge chip">The Wiggle Way</span>
                  )}
                </div>

                <p className="why-readout-calculation">
                  That is about <strong className="why-highlight-minutes">{minutesPerChild} minutes</strong> of a teacher's undivided attention for each child in an hour, if shared evenly.
                </p>

                <div className="why-wiggle-callout note">
                  At {brand}: {wiggleRatio} children per teacher ({wiggleMinutes} mins each)
                </div>
              </div>

              {/* Range Slider Container */}
              <div className="why-slider-container">
                <div className="why-slider-labels note">
                  <span>Cozy (4)</span>
                  <span>Typical (25)</span>
                  <span>Crowded (30)</span>
                </div>

                <div className="why-slider-track-wrap">
                  <input
                    type="range"
                    min="4"
                    max="30"
                    step="1"
                    value={classSize}
                    onChange={(e) => setClassSize(Number(e.target.value))}
                    className="why-class-slider"
                    aria-label="Class size slider"
                  />

                  {/* Marker button jumping to Wiggle's ratio */}
                  <button
                    type="button"
                    onClick={handleJumpToWiggle}
                    className={`why-slider-marker-btn ${classSize === wiggleRatio ? 'is-selected' : ''}`}
                    style={{
                      left: `${((wiggleRatio - 4) / (30 - 4)) * 100}%`,
                    }}
                    title={`Jump to ${brand}'s 1:${wiggleRatio} ratio`}
                    aria-label={`Jump to ${brand}'s ratio of ${wiggleRatio} children`}
                  >
                    <span className="why-marker-arrow note">▲</span>
                    <span className="why-marker-label note">8 ({brand})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Semantic Comparison Table Below Playground */}
        <div className="why-table-section-wrap">
          <ComparisonTable />
        </div>
      </div>
    </section>
  );
}

export default RatioPlayground;
