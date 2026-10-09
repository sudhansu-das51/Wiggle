import React, { useRef, useEffect } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { Squiggle } from '../ui/Squiggle';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { about } from '../../data/about';

/**
 * Section 2: Our Story (Storybook Spread).
 * An open picture book with a center fold, drop cap, arched photograph, and pull quote.
 */
export function StoryBook() {
  const reducedMotion = useReducedMotion();
  const dropCapRef = useRef(null);
  const quoteBoxRef = useRef(null);

  // Micro-interaction: wobble drop cap and pull quote on hover/focus
  useEffect(() => {
    if (reducedMotion) return;

    let cleanup = () => {};

    import('animejs')
      .then(({ animate }) => {
        const dropCap = dropCapRef.current;
        const quoteBox = quoteBoxRef.current;

        const onDropCapHover = () => {
          animate(dropCap, {
            rotate: [0, -6, 6, -3, 3, 0],
            scale: [1, 1.15, 1],
            duration: 500,
            ease: 'inOutQuad',
          });
        };

        const onQuoteHover = () => {
          animate(quoteBox, {
            rotate: [1.5, -1, 3, 0, 1.5],
            duration: 600,
            ease: 'inOutQuad',
          });
        };

        dropCap?.addEventListener('mouseenter', onDropCapHover);
        dropCap?.addEventListener('focus', onDropCapHover);
        quoteBox?.addEventListener('mouseenter', onQuoteHover);
        quoteBox?.addEventListener('focus', onQuoteHover);

        cleanup = () => {
          dropCap?.removeEventListener('mouseenter', onDropCapHover);
          dropCap?.removeEventListener('focus', onDropCapHover);
          quoteBox?.removeEventListener('mouseenter', onQuoteHover);
          quoteBox?.removeEventListener('focus', onQuoteHover);
        };
      })
      .catch(() => {});

    return () => cleanup();
  }, [reducedMotion]);

  // First paragraph with drop cap separation
  const firstParagraph = about.story[0] || '';
  const firstLetter = firstParagraph.charAt(0);
  const restOfFirstParagraph = firstParagraph.slice(1);
  const otherParagraphs = about.story.slice(1);

  return (
    <section className="section section--paper about-storybook-section" aria-label="Our story">
      <div className="container">
        <div className="about-storybook__spread">
          {/* Decorative book corner bookmarks */}
          <div className="about-storybook__bookmark about-storybook__bookmark--top-left" aria-hidden="true" />
          <div className="about-storybook__bookmark about-storybook__bookmark--top-right" aria-hidden="true" />

          {/* Center spine gutter fold */}
          <div className="about-storybook__gutter" aria-hidden="true" />

          {/* Left Page: Story text & drop cap */}
          <div className="about-storybook__page about-storybook__page--left">
            <SectionHeading
              title="How Wiggle began"
              note="A decade of wondering why"
              align="left"
              wiggle
            />

            <div className="about-storybook__body">
              <p className="about-storybook__paragraph">
                <span
                  ref={dropCapRef}
                  tabIndex={0}
                  className="about-storybook__dropcap"
                  role="text"
                  aria-label={firstLetter}
                >
                  {firstLetter}
                </span>
                {restOfFirstParagraph}
              </p>

              {otherParagraphs.map((para, idx) => (
                <p key={idx} className="about-storybook__paragraph">
                  {para}
                </p>
              ))}
            </div>

            {/* Page number doodle */}
            <div className="about-storybook__page-num about-storybook__page-num--left">
              <span>pg. 1</span>
            </div>
          </div>

          {/* Right Page: Arched photo with tape & framed pull quote */}
          <div className="about-storybook__page about-storybook__page--right">
            {/* Tilted taped photo */}
            <div className="about-storybook__photo-wrap">
              <div className="tape tape--center" style={{ top: '-14px', zIndex: 3 }} />
              <div className="about-storybook__photo">
                <ResponsiveImage
                  src="/images/HOWwWORK.jpeg"
                  alt="Children exploring in the sunlit studio at Wiggle"
                  shape="arch"
                  tint="pink"
                  ratio="portrait"
                  label="Our early garden studio"
                />
              </div>
              <span className="about-storybook__caption note">
                Morning sensory discovery in our sunlit studio, 2016
              </span>
            </div>

            {/* Squiggle-bordered Pull Quote */}
            <div
              ref={quoteBoxRef}
              tabIndex={0}
              className="about-storybook__quote-box"
            >
              <div className="about-storybook__quote-header">
                <Squiggle width={70} height={10} color="var(--tangerine)" />
              </div>
              <blockquote className="about-storybook__quote-text">
                "{about.pullQuote}"
              </blockquote>
              <div className="about-storybook__quote-footer">
                <span className="note" style={{ color: 'var(--ink)' }}>
                  — From our guiding journal
                </span>
              </div>
            </div>

            {/* Page number doodle */}
            <div className="about-storybook__page-num about-storybook__page-num--right">
              <span>pg. 2</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
