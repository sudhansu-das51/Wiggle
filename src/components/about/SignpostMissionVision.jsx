import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SectionHeading } from '../ui/SectionHeading';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { about } from '../../data/about';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 3: Mission and Vision (Signpost).
 * Chunky ink signpost with two directional boards that sway with scroll and wobble on hover/focus.
 */
export function SignpostMissionVision() {
  const containerRef = useRef(null);
  const board1Ref = useRef(null);
  const board2Ref = useRef(null);
  const reducedMotion = useReducedMotion();

  // ScrollTrigger: gentle scroll-linked sway between -2deg and +2deg
  useGSAP(() => {
    if (reducedMotion || !containerRef.current) return;

    if (board1Ref.current) {
      gsap.fromTo(
        board1Ref.current,
        { rotation: -2.5 },
        {
          rotation: 2.5,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }

    if (board2Ref.current) {
      gsap.fromTo(
        board2Ref.current,
        { rotation: 2.5 },
        {
          rotation: -2.5,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }
  }, { scope: containerRef, dependencies: [reducedMotion] });

  // Anime.js hover and keyboard focus micro-wobble
  useEffect(() => {
    if (reducedMotion) return;

    let cleanup = () => {};

    import('animejs')
      .then(({ animate }) => {
        const b1 = board1Ref.current;
        const b2 = board2Ref.current;

        const wobbleBoard = (el, baseAngle) => {
          if (!el) return;
          animate(el, {
            rotate: [baseAngle, baseAngle - 3.5, baseAngle + 3.5, baseAngle - 1.5, baseAngle + 1.5, baseAngle],
            duration: 600,
            ease: 'inOutQuad',
          });
        };

        const onB1 = () => wobbleBoard(b1, -1);
        const onB2 = () => wobbleBoard(b2, 1);

        b1?.addEventListener('mouseenter', onB1);
        b1?.addEventListener('focus', onB1);
        b2?.addEventListener('mouseenter', onB2);
        b2?.addEventListener('focus', onB2);

        cleanup = () => {
          b1?.removeEventListener('mouseenter', onB1);
          b1?.removeEventListener('focus', onB1);
          b2?.removeEventListener('mouseenter', onB2);
          b2?.removeEventListener('focus', onB2);
        };
      })
      .catch(() => {});

    return () => cleanup();
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className="section section--sky about-signpost-section" aria-label="Mission and vision">
      <div className="container">
        <SectionHeading
          title="Where we are and where we are headed"
          note="Our guiding compass"
          align="center"
          wiggle
        />

        <div className="about-signpost__wrapper">
          {/* Signpost center pole extending all the way into the ground */}
          <div className="about-signpost__pole-column" aria-hidden="true">
            {/* Chunky post top cap */}
            <div className="about-signpost__finial" />

            {/* Continuous wooden pole with grain texture */}
            <div className="about-signpost__pole">
              <div className="about-signpost__wood-grain" />
            </div>
          </div>

          {/* Boards Stack / Layout */}
          <div className="about-signpost__boards">
            {/* Board 1: Mission (Sunny Yellow, arrow points left on desktop) */}
            <div
              ref={board1Ref}
              tabIndex={0}
              className="about-signpost__board about-signpost__board--mission"
              role="region"
              aria-label="Our mission"
            >
              {/* Wooden Nail head */}
              <div className="about-signpost__nail about-signpost__nail--right" aria-hidden="true">
                <div className="about-signpost__nail-head" />
              </div>

              {/* Arrow SVG shape background */}
              <svg className="about-signpost__board-bg" viewBox="0 0 520 180" preserveAspectRatio="none" aria-hidden="true">
                {/* Board pointing left */}
                <path
                  d="M 500,10 L 40,10 L 8,90 L 40,170 L 500,170 C 510,170 514,162 514,154 L 514,26 C 514,18 510,10 500,10 Z"
                  fill="var(--sunny)"
                  stroke="var(--ink)"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="about-signpost__board-content">
                <span className="about-signpost__label note">Our mission</span>
                <h3 className="about-signpost__board-title">A playground for lifelong discovery</h3>
                <p className="about-signpost__text">{about.mission}</p>
              </div>
            </div>

            {/* Board 2: Vision (Bubblegum Pink, arrow points right on desktop) */}
            <div
              ref={board2Ref}
              tabIndex={0}
              className="about-signpost__board about-signpost__board--vision"
              role="region"
              aria-label="Our vision"
            >
              {/* Wooden Nail head */}
              <div className="about-signpost__nail about-signpost__nail--left" aria-hidden="true">
                <div className="about-signpost__nail-head" />
              </div>

              {/* Arrow SVG shape background */}
              <svg className="about-signpost__board-bg" viewBox="0 0 520 180" preserveAspectRatio="none" aria-hidden="true">
                {/* Board pointing right */}
                <path
                  d="M 20,10 L 480,10 L 512,90 L 480,170 L 20,170 C 10,170 6,162 6,154 L 6,26 C 6,18 10,10 20,10 Z"
                  fill="var(--bubblegum)"
                  stroke="var(--ink)"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="about-signpost__board-content">
                <span className="about-signpost__label note">Our vision</span>
                <h3 className="about-signpost__board-title">An unhurried childhood for all</h3>
                <p className="about-signpost__text">{about.vision}</p>
              </div>
            </div>
          </div>

          {/* Grassy Meadow Ground Mound firmly anchoring the wooden pole base */}
          <div className="about-signpost__ground" aria-hidden="true">
            <svg viewBox="0 0 360 85" width="360" height="85" fill="none">
              {/* Ground shadow beneath earth mound */}
              <ellipse cx="180" cy="74" rx="165" ry="10" fill="rgba(35, 42, 92, 0.22)" />

              {/* Main Grassy Earth Mound */}
              <ellipse cx="180" cy="62" rx="150" ry="22" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="3" />
              <path d="M 50,60 Q 180,42 310,60" stroke="#48BB78" strokeWidth="3.5" strokeLinecap="round" />

              {/* Sub-mound dirt depth */}
              <ellipse cx="180" cy="66" rx="120" ry="10" fill="#2F855A" opacity="0.25" />

              {/* Foreground Grass Blades overlapping the planted wooden pole */}
              <path d="M 148 62 Q 155 24, 165 34 Q 174 12, 180 60" stroke="var(--ink)" strokeWidth="2.5" fill="#2FA36B" strokeLinejoin="round" />
              <path d="M 170 62 Q 178 14, 186 28 Q 194 16, 202 62" stroke="var(--ink)" strokeWidth="3" fill="#38A169" strokeLinejoin="round" />
              <path d="M 192 62 Q 202 26, 210 36 Q 218 22, 224 62" stroke="var(--ink)" strokeWidth="2.5" fill="#48BB78" strokeLinejoin="round" />

              {/* Left & Right side grass tufts */}
              <path d="M 76 62 Q 82 34, 90 42 Q 98 28, 104 62" stroke="var(--ink)" strokeWidth="2" fill="#38A169" />
              <path d="M 256 62 Q 264 32, 272 40 Q 280 26, 288 62" stroke="var(--ink)" strokeWidth="2" fill="#38A169" />

              {/* Cheerful wild Daisies rooted in lawn */}
              <circle cx="112" cy="54" r="5" fill="#FFC93C" stroke="var(--ink)" strokeWidth="2" />
              <circle cx="112" cy="54" r="2" fill="#E28743" />
              <circle cx="248" cy="56" r="5.5" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="2" />
              <circle cx="248" cy="56" r="2.5" fill="#FFC93C" />

              {/* Playground Pebbles */}
              <ellipse cx="68" cy="68" rx="7" ry="4" fill="#CBD5E0" stroke="var(--ink)" strokeWidth="1.5" />
              <ellipse cx="292" cy="68" rx="6" ry="3.5" fill="#E2E8F0" stroke="var(--ink)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
