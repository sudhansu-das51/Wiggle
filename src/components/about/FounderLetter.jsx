import React, { useRef, useEffect } from 'react';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { Squiggle } from '../ui/Squiggle';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { about } from '../../data/about';

/**
 * Section 7: A Note from the Founder.
 * A paper letter with faint notebook lines pinned with tape,
 * taped polaroid photo, handwritten signature, and squiggle underline.
 */
export function FounderLetter() {
  const letterRef = useRef(null);
  const polaroidRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Subtle hover rotate micro-interaction on letter and polaroid
  useEffect(() => {
    if (reducedMotion) return;

    let cleanup = () => {};

    import('animejs')
      .then(({ animate }) => {
        const letter = letterRef.current;
        const polaroid = polaroidRef.current;

        const onLetterHover = () => {
          animate(letter, {
            rotate: [-0.8, -1.8, 0.4, -0.8],
            duration: 650,
            ease: 'inOutQuad',
          });
        };

        const onPolaroidHover = (e) => {
          e.stopPropagation();
          animate(polaroid, {
            rotate: [3.5, 6, 1, 3.5],
            scale: [1, 1.05, 1],
            duration: 500,
            ease: 'inOutQuad',
          });
        };

        letter?.addEventListener('mouseenter', onLetterHover);
        polaroid?.addEventListener('mouseenter', onPolaroidHover);

        cleanup = () => {
          letter?.removeEventListener('mouseenter', onLetterHover);
          polaroid?.removeEventListener('mouseenter', onPolaroidHover);
        };
      })
      .catch(() => {});

    return () => cleanup();
  }, [reducedMotion]);

  const { founder } = about;
  if (!founder) return null;

  return (
    <section className="section section--yellow about-founder-section" aria-label="A note from the founder">
      <div className="container">
        <div
          ref={letterRef}
          tabIndex={0}
          className="about-founder__letter"
        >
          {/* Top Center Scotch Tape */}
          <div className="tape tape--center" style={{ top: '-14px', zIndex: 10 }} aria-hidden="true" />

          {/* Taped Polaroid on Top Right Corner */}
          <div
            ref={polaroidRef}
            tabIndex={0}
            className="about-founder__polaroid"
          >
            <div className="tape" style={{ top: '-10px', left: '20px', zIndex: 5 }} aria-hidden="true" />
            <div className="about-founder__polaroid-inner">
              <ResponsiveImage
                src={founder.photo || '/images/anjali_rao.png'}
                alt={`${founder.name}, ${founder.role}`}
                ratio="square"
                shape="rect"
                tint="pink"
              />
              <div className="about-founder__polaroid-bottom">
                <span className="about-founder__polaroid-role note">Founder</span>
                <strong className="about-founder__polaroid-name">{founder.name}</strong>
              </div>
            </div>
          </div>

          {/* Letterhead */}
          <div className="about-founder__letterhead">
            <span className="about-founder__stationery-note note">
              From the desk of the head teacher
            </span>
            <h2 className="about-founder__heading">
              Dear parents and curious minds,
            </h2>
          </div>

          {/* Letter Body */}
          <div className="about-founder__body">
            {founder.message.map((paragraph, index) => (
              <p key={index} className="about-founder__paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Signoff & Signature */}
          <div className="about-founder__signoff">
            <span className="note about-founder__warmly">With all my warmth,</span>
            <div className="about-founder__signature-wrap">
              <span className="about-founder__signature">
                {founder.signature}
              </span>
              <Squiggle width={95} height={12} color="var(--tangerine)" />
            </div>

            <div className="about-founder__credentials">
              <strong className="about-founder__name">{founder.name}</strong>
              <span className="about-founder__role note">{founder.role}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
