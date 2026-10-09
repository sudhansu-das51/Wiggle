import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Mascot } from '../ui/Mascot';
import { Room } from './Room';
import { LiftBar } from './LiftBar';
import { facilities } from '../../data/facilities';
import { siteConfig } from '../../config/siteConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { animate } from 'animejs';

/**
 * Section 2: The Cutaway School Building.
 * Features an illustrated roof with flagpole & chimney, brick side-walls,
 * stacked facility rooms, lift navigation, and a welcoming ground gate.
 */
export function FacilitiesBuilding() {
  const brand = siteConfig.brand?.name || 'Wiggle';
  const brandInitial = brand.charAt(0);
  const isReduced = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const roofRef = useRef(null);
  const flagRef = useRef(null);
  const buildingRef = useRef(null);

  // 1. Animated Roof Flag (waves when roof is visible, skipped on phones/reduced motion)
  useEffect(() => {
    if (isReduced || !flagRef.current) return;

    // Check if phone screen
    const isPhone = window.matchMedia('(max-width: 767px)').matches;
    if (isPhone) return;

    const flagAnim = animate(flagRef.current, {
      rotate: [-5, 10, -3, 7, -5],
      scaleX: [1, 0.9, 1],
      transformOrigin: '0% 50%',
      duration: 2200,
      ease: 'inOutSine',
      loop: true,
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          flagAnim.play();
        } else {
          flagAnim.pause();
        }
      },
      { threshold: 0.1 }
    );

    if (roofRef.current) {
      observer.observe(roofRef.current);
    }

    return () => {
      observer.disconnect();
      if (flagAnim.revert) {
        flagAnim.revert();
      } else {
        flagAnim.pause();
      }
    };
  }, [isReduced]);

  // 2. Track which room is closest to the middle of the viewport
  useEffect(() => {
    const handleScroll = () => {
      const roomElements = facilities.map((fac) =>
        document.getElementById(`room-${fac.slug}`)
      );

      const viewportCenter = window.innerHeight / 2;
      let closestIdx = 0;
      let minDistance = Infinity;

      roomElements.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const roomCenter = rect.top + rect.height / 2;
        const distance = Math.abs(roomCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      setActiveIndex(closestIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 3. Scroll to selected room
  const handleSelectRoom = useCallback((slug, idx) => {
    setActiveIndex(idx);
    const roomEl = document.getElementById(`room-${slug}`);
    if (roomEl) {
      roomEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <section
      id="cutaway-building"
      className="section section--paper fac-building-section"
      aria-label="Inside the school"
    >
      <div className="container">
        <SectionHeading
          title="A look inside Wiggle"
          text="Every room, just as your child will find it."
          align="center"
          wiggle
        />

        {/* Mobile / Tablet Sticky Lift Bar */}
        <LiftBar
          facilities={facilities}
          activeIndex={activeIndex}
          onSelectRoom={handleSelectRoom}
        />

        {/* Main Building Grid: Centered Building Structure */}
        <div ref={buildingRef} className="fac-building-layout">
          {/* Cutaway School Building Architecture */}
          <div className="fac-building-shell">
            {/* 1. Roof with Chimney, Flagpole & School Nameplate */}
            <div ref={roofRef} className="fac-roof-wrap" aria-hidden="true">
              <svg
                viewBox="0 0 1000 220"
                className="fac-roof-svg"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <pattern id="roof-tiles" x="0" y="0" width="30" height="15" patternUnits="userSpaceOnUse">
                    <path d="M 0 15 Q 15 0 30 15" fill="none" stroke="var(--ink)" strokeWidth="1.2" opacity="0.3" />
                  </pattern>
                </defs>

                {/* Chimney on Left */}
                <g transform="translate(140, 80)">
                  <rect x="0" y="0" width="55" height="70" rx="3" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3.5" />
                  <rect x="-6" y="-8" width="67" height="14" rx="3" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3.5" />
                  {/* Chimney smoke curl */}
                  <path d="M 28,-14 Q 38,-35 25,-50 Q 15,-65 32,-80" fill="none" stroke="var(--ink)" strokeWidth="2" opacity="0.35" />
                </g>

                {/* Triangular Gable Roof Body */}
                <polygon points="500,75 980,200 20,200" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="4" />
                <polygon points="500,75 980,200 20,200" fill="url(#roof-tiles)" />

                {/* Overhanging Eaves Trim */}
                <line x1="10" y1="200" x2="990" y2="200" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />

                {/* Center Flagpole & Waving Flag (Flag firmly at TOP RIGHT of stick) */}
                <g transform="translate(500, 75)">
                  {/* Flagpole stick */}
                  <line x1="0" y1="0" x2="0" y2="-62" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="0" cy="-65" r="5" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />

                  {/* Flag attached to TOP RIGHT of the stick */}
                  <g transform="translate(2, -63)">
                    <g ref={flagRef} style={{ transformOrigin: '0% 50%' }}>
                      <path
                        d="M 0,0 Q 28,-5 56,3 L 56,31 Q 28,23 0,28 Z"
                        fill="var(--sunny)"
                        stroke="var(--ink)"
                        strokeWidth="3"
                        strokeLinejoin="round"
                      />
                      <text
                        x="26"
                        y="20"
                        textAnchor="middle"
                        fill="var(--ink)"
                        fontFamily="var(--font-display)"
                        fontSize="17"
                        fontWeight="bold"
                      >
                        {brandInitial}
                      </text>
                    </g>
                  </g>
                </g>

                {/* Hand-drawn School Signboard on Gable */}
                <g transform="translate(400, 135)">
                  <rect x="0" y="0" width="200" height="42" rx="8" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3.5" />
                  <text
                    x="100"
                    y="28"
                    textAnchor="middle"
                    fill="var(--ink)"
                    fontFamily="var(--font-display)"
                    fontSize="22"
                    fontWeight="bold"
                    letterSpacing="1"
                  >
                    {brand}
                  </text>
                </g>
              </svg>
            </div>

            {/* 2. Building Body (Left Wall, Stacked Rooms, Right Wall) */}
            <div className="fac-building-body">
              {/* Brick Pattern Left Side Wall */}
              <div className="fac-wall fac-wall--left" aria-hidden="true">
                <div className="fac-brick-pattern" />
              </div>

              {/* Central Stack of Rooms */}
              <div className="fac-rooms-stack" role="feed" aria-label="Facilities rooms list">
                {facilities.map((fac, idx) => (
                  <Room
                    key={fac.slug}
                    facility={fac}
                    index={idx}
                    isActive={idx === activeIndex}
                    isSingleVisibleActive={idx === activeIndex}
                  />
                ))}
              </div>

              {/* Brick Pattern Right Side Wall */}
              <div className="fac-wall fac-wall--right" aria-hidden="true">
                <div className="fac-brick-pattern" />
              </div>
            </div>

            {/* 3. Ground Strip (Foundation with Grass, Arch Gate, and Wig) */}
            <div className="fac-ground-strip" aria-hidden="true">
              {/* Grass Tufts and Flowers */}
              <div className="fac-ground-lawn">
                <span className="fac-lawn-tuft tuft-1" />
                <span className="fac-lawn-tuft tuft-2" />
                <span className="fac-lawn-tuft tuft-3" />
                <span className="fac-lawn-tuft tuft-4" />
              </div>

              {/* School Gate Archway with Welcoming Wig */}
              <div className="fac-gate-courtyard">
                <div className="fac-gate-arch">
                  <div className="fac-gate-sign note">
                    <span>Come on in</span>
                  </div>
                </div>

                <div className="fac-gate-mascot">
                  <Mascot mood="wave" size={72} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FacilitiesBuilding;
