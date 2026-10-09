import React from 'react';
import { about } from '../../data/about';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { StatSticker } from '../ui/StatSticker';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import './home.css';

/**
 * Section 3: About Collage.
 * Story, philosophy, layered organic photo collage, and playful stat stickers.
 */
export function AboutCollage() {
  const storyParagraphs = about.story.slice(0, 2);
  const stats = about.stats.slice(0, 3);

  return (
    <section className="section section--paper" aria-label="About Wiggle">
      <div className="container about-collage__grid">
        {/* Left Column: Story text and CTA */}
        <div className="about-collage__left">
          <SectionHeading
            title="Messy hands, curious minds"
            align="left"
            wiggle
          />

          {storyParagraphs.map((para, idx) => (
            <p key={idx} style={{ color: 'var(--muted)', fontSize: '1.0625rem', lineHeight: 1.65 }}>
              {para}
            </p>
          ))}

          <div style={{ marginTop: '0.75rem' }}>
            <Button variant="primary" to="/about">
              Read our story
            </Button>
          </div>
        </div>

        {/* Right Column: Primary vertical rectangle photograph with two statistic badges */}
        <div className="about-section__right">
          <div className="about-section__frame">
            <ResponsiveImage
              src="/images/about.png"
              shape="rect"
              ratio="portrait"
              tint="mint"
              alt="Storytime and playful learning at Wiggle preschool"
            />

            {/* Two statistic badges */}
            {stats[0] && (
              <div className="about-section__stat about-section__stat--1">
                <StatSticker
                  value={stats[0].value}
                  label={stats[0].label}
                  tint="yellow"
                  rotate={-3}
                />
              </div>
            )}

            {stats[1] && (
              <div className="about-section__stat about-section__stat--2">
                <StatSticker
                  value={stats[1].value}
                  label={stats[1].label}
                  tint="pink"
                  rotate={3}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
