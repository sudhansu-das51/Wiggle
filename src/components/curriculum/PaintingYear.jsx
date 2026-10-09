import React, { useRef, useState, useEffect } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { PaintingScene } from './PaintingScene';
import { curriculum } from '../../data/curriculum';
import { getTintColor } from './tintColor';
import { MQ } from '../../utils/breakpoints';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { animate } from 'animejs';

gsap.registerPlugin(ScrollTrigger);

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

/**
 * Section 4: How the Year Unfolds (The Landscape Painting).
 * Scroll-driven and interactive master animation that accurately colors in the
 * preschool painting stage-by-stage across the 4 academic terms.
 */
export function PaintingYear() {
  const { yearPlan = [] } = curriculum;
  const sectionRef = useRef(null);
  const termsColRef = useRef(null);
  const canvasRef = useRef(null);
  const termCardsRef = useRef([]);
  const [activeTermIndex, setActiveTermIndex] = useState(0);

  const reducedMotionHook = useReducedMotion();
  const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
  const isReduced = reducedMotionHook || saveData;

  const stepsWord = NUMBER_WORDS[yearPlan.length] || `${yearPlan.length}`;

  // Term selection helper
  const handleSelectTerm = (idx) => {
    setActiveTermIndex(idx);
  };

  // ScrollTriggers: Synchronize activeTermIndex accurately with card visibility
  useGSAP(() => {
    if (isReduced || !sectionRef.current) return;

    termCardsRef.current.forEach((cardEl, idx) => {
      if (!cardEl) return;
      ScrollTrigger.create({
        trigger: cardEl,
        start: 'top 65%',
        end: 'bottom 45%',
        onEnter: () => setActiveTermIndex(idx),
        onEnterBack: () => setActiveTermIndex(idx),
      });
    });
  }, { scope: sectionRef, dependencies: [yearPlan.length, isReduced] });

  // Anime.js ambient drift loop for clouds and kite
  useEffect(() => {
    if (isReduced || !canvasRef.current) return;

    let cloudAnim = null;
    let kiteAnim = null;

    const isMobile = window.matchMedia(MQ.phone).matches;
    if (isMobile) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!cloudAnim) {
          cloudAnim = animate(['.cur-anim-cloud-1', '.cur-anim-cloud-2', '.cur-anim-bird-1'], {
            translateX: [0, 16, -10, 0],
            translateY: [0, -6, 4, 0],
            duration: 10000,
            alternate: true,
            loop: true,
            ease: 'inOutSine',
          });
        } else {
          cloudAnim.play();
        }

        if (!kiteAnim) {
          kiteAnim = animate('.cur-anim-kite', {
            rotate: [-15, -5, -20, -15],
            translateY: [0, -12, 8, 0],
            duration: 8000,
            alternate: true,
            loop: true,
            ease: 'inOutSine',
          });
        } else {
          kiteAnim.play();
        }
      } else {
        cloudAnim?.pause();
        kiteAnim?.pause();
      }
    }, { threshold: 0.2 });

    observer.observe(canvasRef.current);

    return () => {
      observer.disconnect();
      cloudAnim?.pause();
      kiteAnim?.pause();
    };
  }, [isReduced]);

  return (
    <section
      id="year"
      ref={sectionRef}
      className="section section--mint cur-painting-section"
      aria-label="Year plan"
    >
      <div className="container">
        <SectionHeading
          title={`A year at Wiggle, painted in ${stepsWord} steps`}
          text="Watch the picture fill in with rich colors as the terms go by."
          align="center"
          wiggle
        />

        <div className="cur-painting-layout">
          {/* Left Column: Framed Canvas (Sticky alongside terms, enlarged & prominent) */}
          <div className="cur-canvas-col">
            <div ref={canvasRef} className="cur-canvas-frame sticker" aria-hidden="true">
              {/* Corner decorative washi tape */}
              <div className="cur-canvas-tape cur-tape-tl tape" />
              <div className="cur-canvas-tape cur-tape-tr tape" />

              {/* The 4-stage Painting Scene (Connected to activeTermIndex) */}
              <PaintingScene activeTermIndex={activeTermIndex} reducedMotion={isReduced} />

              {/* Paint Palette below Canvas */}
              <div className="cur-paint-palette" aria-label="Painting palette progress">
                <span className="cur-palette-label note">
                  Term {activeTermIndex + 1} of {yearPlan.length}:
                </span>
                <div className="cur-palette-blobs">
                  {yearPlan.map((term, tIdx) => {
                    const isPassedOrActive = isReduced || tIdx <= activeTermIndex;
                    const isActive = isReduced || tIdx === activeTermIndex;
                    const color = getTintColor(term.tint, tIdx);

                    return (
                      <button
                        key={term.term || tIdx}
                        type="button"
                        className={`cur-palette-blob ${isActive ? 'is-active' : ''} ${
                          isPassedOrActive ? 'is-filled' : ''
                        }`}
                        style={{
                          '--blob-color': color,
                        }}
                        onClick={() => handleSelectTerm(tIdx)}
                        aria-label={`Jump to ${term.term}`}
                        title={term.term}
                      >
                        <span className="cur-blob-dot" />
                        <span className="cur-blob-num note">{tIdx + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Terms List (Scrollable Cards) */}
          <div ref={termsColRef} className="cur-terms-col">
            <div className="cur-terms-list">
              {yearPlan.map((term, idx) => {
                const isActive = isReduced || activeTermIndex === idx;
                const termColor = getTintColor(term.tint, idx);

                return (
                  <article
                    key={term.term || idx}
                    ref={(el) => (termCardsRef.current[idx] = el)}
                    className={`cur-term-card sticker ${isActive ? 'is-active' : ''}`}
                    tabIndex={0}
                    onClick={() => handleSelectTerm(idx)}
                    onMouseEnter={() => setActiveTermIndex(idx)}
                    onFocus={() => setActiveTermIndex(idx)}
                  >
                    <div className="cur-term-card__header">
                      <span
                        className="cur-term-label chip"
                        style={{
                          backgroundColor: termColor,
                        }}
                      >
                        {term.term}
                      </span>
                    </div>

                    <h3 className="cur-term-theme">{term.theme}</h3>
                    <p className="cur-term-focus">{term.focus}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PaintingYear;
