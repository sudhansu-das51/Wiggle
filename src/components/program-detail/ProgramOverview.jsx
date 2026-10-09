import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../ui/Icon';
import { Mascot } from '../ui/Mascot';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import './program-detail.css';

/**
 * Section 3: Program Overview with asymmetric layout, highlights badge rows,
 * arch image, tape, peeking Mascot, and giant decorative outlined numeral.
 * @param {{
 *   program: {
 *     name: string,
 *     summary: string,
 *     highlights: string[],
 *     focus?: string,
 *     minAge: number,
 *     maxAge: number,
 *     tint: string
 *   }
 * }} props
 */
export function ProgramOverview({ program }) {
  return (
    <section id="overview" className="section section--paper pd-overview-section" aria-label="Program overview">
      <div className="container pd-overview-container">
        {/* Left Column: Headings, Summary, Highlights, Focus */}
        <div className="pd-overview-content">
          <SectionHeading
            title={`A closer look at ${program.name}`}
            wiggle
          />

          <p className="pd-overview-summary">
            {program.summary}
          </p>

          {/* 3 Highlights as Large Badge Rows */}
          <div className="pd-overview-highlights" role="list" aria-label="Program highlights">
            {program.highlights?.slice(0, 3).map((item, idx) => (
              <div key={idx} className="pd-highlight-row" role="listitem">
                <span className="pd-highlight-icon-circle" aria-hidden="true">
                  <Icon name="check" size={18} color="var(--ink)" />
                </span>
                <span className="pd-highlight-text">{item}</span>
              </div>
            ))}
          </div>

          {/* Handwritten Focus Line */}
          {program.focus && (
            <div className="pd-overview-focus-box">
              <span className="pd-overview-focus-tag note">Daily focus</span>
              <p className="pd-overview-focus-text note">
                {program.focus}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Arch Image + Tape + Peeking Mascot + Giant Outlined Numeral */}
        <div className="pd-overview-visual" aria-hidden="true">
          {/* Giant Outlined Age Numeral Behind Arch */}
          <div className="pd-giant-age-numeral">
            {`${program.minAge}–${program.maxAge}`}
          </div>

          {/* Arch Visual Card */}
          <div className="pd-arch-card">
            {/* Peeking Mascot Top Corner */}
            <div className="pd-peeking-mascot">
              <Mascot mood="peek" size={88} />
            </div>

            {/* Tape on top */}
            <div className="tape pd-arch-tape" />

            {/* Arch-shaped ResponsiveImage */}
            <ResponsiveImage
              src={program.image}
              ratio="portrait"
              shape="arch"
              tint={program.tint}
              label={`${program.name} studio`}
              className="pd-arch-img"
              alt={`${program.name} classroom environment`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
