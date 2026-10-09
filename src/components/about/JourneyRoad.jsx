import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SectionHeading } from '../ui/SectionHeading';
import { Mascot } from '../ui/Mascot';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { about } from '../../data/about';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 5: Our Journey (Signature Scene).
 * A winding illustrated road where Wig slides down from the top on scroll,
 * revealing alternating left/right milestone cards as the character travels,
 * culminating in a celebration at the destination.
 */
export function JourneyRoad() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const roadPathRef = useRef(null);
  const wigRef = useRef(null);
  const cardsRef = useRef([]);
  const confettiRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const [wigMood, setWigMood] = useState('smile');
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const confettiFired = useRef(false);

  // Sign configurations (5 stops, alternating left and right, final centered)
  const signConfigs = [
    {
      shape: 'circle',
      tint: 'var(--tint-yellow)',
      accentColor: 'var(--sunny)',
      borderRadius: '50%',
      side: 'left',
      threshold: 0.08,
    },
    {
      shape: 'square',
      tint: 'var(--tint-pink)',
      accentColor: 'var(--bubblegum)',
      borderRadius: 'var(--r-md)',
      side: 'right',
      threshold: 0.28,
    },
    {
      shape: 'shield',
      tint: 'var(--tint-mint)',
      accentColor: 'var(--meadow)',
      borderRadius: '16px 16px 44px 44px',
      side: 'left',
      threshold: 0.50,
    },
    {
      shape: 'arch',
      tint: 'var(--tint-sky)',
      accentColor: 'var(--sky)',
      borderRadius: '999px 999px var(--r-md) var(--r-md)',
      side: 'right',
      threshold: 0.72,
    },
    {
      shape: 'star',
      tint: 'var(--tint-yellow)',
      accentColor: 'var(--sunny)',
      borderRadius: 'var(--r-pill)',
      side: 'left',
      threshold: 0.90,
    },
  ];

  useGSAP(() => {
    if (!stageRef.current || !roadPathRef.current) return;

    const path = roadPathRef.current;
    const pathLength = path.getTotalLength();

    // If reduced motion: show everything finished and accessible
    if (reducedMotion) {
      path.style.strokeDasharray = 'none';
      path.style.strokeDashoffset = '0';
      setWigMood('cheer');
      cardsRef.current.forEach((card) => {
        if (card) {
          gsap.set(card, { scale: 1, opacity: 1, x: 0, y: 0 });
        }
      });
      return;
    }

    // Set up path stroke dash
    path.style.strokeDasharray = `${pathLength} ${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    // Initialize cards hidden with directional offset
    cardsRef.current.forEach((card, idx) => {
      if (!card) return;
      const cfg = signConfigs[idx];
      const initialX = cfg.side === 'left' ? -36 : cfg.side === 'right' ? 36 : 0;
      const initialY = cfg.side === 'center' ? 36 : 0;
      gsap.set(card, {
        opacity: 0,
        scale: 0.9,
        x: initialX,
        y: initialY,
        transformOrigin: 'center center',
      });
    });

    // Position Wig initially right at the top start of the road (500, 50)
    if (wigRef.current) {
      gsap.set(wigRef.current, {
        left: '50%',
        top: '2.7%', // corresponds to 50px / 1850px
        rotate: 0,
      });
    }

    // Track card visibility state to avoid redundant animations
    const cardVisibleState = [false, false, false, false, false];

    // Master ScrollTrigger directly attached to road stage
    const trigger = ScrollTrigger.create({
      trigger: stageRef.current,
      start: 'top 55%', // User sees the heading and top of the road as Wig starts sliding
      end: 'bottom 80%', // User scrolls to the finish line
      scrub: 1, // Smooth butter momentum
      onUpdate: (self) => {
        const p = self.progress;

        // Draw the road dash line
        path.style.strokeDashoffset = `${pathLength * (1 - p)}`;

        // Move Wig along SVG path
        const currentDist = p * pathLength;
        const pt = path.getPointAtLength(currentDist);

        // Compute tangent angle for playful lean into curves
        const lookAheadDist = Math.min(currentDist + 6, pathLength);
        const nextPt = path.getPointAtLength(lookAheadDist);
        const dx = nextPt.x - pt.x;
        const dy = nextPt.y - pt.y;
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = (angleRad * 180) / Math.PI - 90;
        const tilt = Math.max(-18, Math.min(18, angleDeg * 0.45));

        // Map SVG coords (0..1000, 0..1850) to percentage of stage
        const xPct = (pt.x / 1000) * 100;
        const yPct = (pt.y / 1850) * 100;

        if (wigRef.current) {
          gsap.set(wigRef.current, {
            left: `${xPct}%`,
            top: `${yPct}%`,
            rotate: tilt,
          });
        }

        // Toggle / Reveal milestone cards as Wig slides past each threshold
        signConfigs.forEach((cfg, idx) => {
          const card = cardsRef.current[idx];
          if (!card) return;

          const isVisible = p >= cfg.threshold;

          if (isVisible && !cardVisibleState[idx]) {
            cardVisibleState[idx] = true;
            gsap.to(card, {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              duration: 0.5,
              ease: 'back.out(1.4)',
              overwrite: 'auto',
            });
          } else if (!isVisible && cardVisibleState[idx]) {
            cardVisibleState[idx] = false;
            const targetX = cfg.side === 'left' ? -36 : cfg.side === 'right' ? 36 : 0;
            const targetY = cfg.side === 'center' ? 36 : 0;
            gsap.to(card, {
              opacity: 0,
              scale: 0.9,
              x: targetX,
              y: targetY,
              duration: 0.35,
              ease: 'power2.in',
              overwrite: 'auto',
            });
          }
        });

        // Determine current active milestone index
        let currentIdx = 0;
        for (let i = signConfigs.length - 1; i >= 0; i--) {
          if (p >= signConfigs[i].threshold - 0.04) {
            currentIdx = i;
            break;
          }
        }
        setActiveMilestone(currentIdx);

        // Check if reached finish line
        if (p >= 0.93) {
          setWigMood('cheer');
          if (!confettiFired.current) {
            confettiFired.current = true;
            import('animejs')
              .then(({ animate }) => {
                const pieces = confettiRef.current?.querySelectorAll('.about-journey__confetti-piece');
                if (pieces && pieces.length) {
                  animate(pieces, {
                    translateX: () => (Math.random() - 0.5) * 200,
                    translateY: () => (Math.random() - 0.5) * 200,
                    rotate: () => (Math.random() - 0.5) * 360,
                    opacity: [1, 0],
                    scale: [0.5, 1.5],
                    duration: 1200,
                    ease: 'outExpo',
                  });
                }
              })
              .catch(() => {});
          }
        } else if (p > 0.05) {
          setWigMood('point');
        } else {
          setWigMood('smile');
        }
      },
    });

    // Refresh ScrollTrigger when fonts and DOM are ready
    if (document.fonts) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }

    return () => {
      trigger.kill();
    };
  }, { scope: containerRef, dependencies: [reducedMotion] });

  // Confetti particles for final celebration
  const confettiColors = ['var(--sunny)', 'var(--bubblegum)', 'var(--meadow)', 'var(--sky)', 'var(--tangerine)'];

  // Toggle card expansion on user click
  const toggleCard = (idx) => {
    setExpandedCard((prev) => (prev === idx ? null : idx));
  };

  return (
    <section ref={containerRef} className="section section--paper about-journey-section" aria-label="Our journey so far">
      <div className="container">
        <SectionHeading
          title="Our road so far"
          note="From one room to a thriving community"
          align="center"
          wiggle
        />

        <div ref={stageRef} className="about-journey__stage">
          {/* SVG Road Path (1000 x 1850) */}
          <svg
            className="about-journey__road-svg"
            viewBox="0 0 1000 1850"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Soft ground gravel shadow underneath */}
            <path
              d="M 500,50
                 C 440,130 360,180 360,280
                 C 360,420 640,480 640,640
                 C 640,800 360,860 360,1020
                 C 360,1180 640,1240 640,1400
                 C 640,1540 540,1650 500,1740"
              fill="none"
              stroke="#E8DFD0"
              strokeWidth="58"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Road Asphalt Bed */}
            <path
              d="M 500,50
                 C 440,130 360,180 360,280
                 C 360,420 640,480 640,640
                 C 640,800 360,860 360,1020
                 C 360,1180 640,1240 640,1400
                 C 640,1540 540,1650 500,1740"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="50"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Inner Road Surface */}
            <path
              d="M 500,50
                 C 440,130 360,180 360,280
                 C 360,420 640,480 640,640
                 C 640,800 360,860 360,1020
                 C 360,1180 640,1240 640,1400
                 C 640,1540 540,1650 500,1740"
              fill="none"
              stroke="#343B4E"
              strokeWidth="40"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Animated Road Centerline (Draws on scroll) */}
            <path
              ref={roadPathRef}
              d="M 500,50
                 C 440,130 360,180 360,280
                 C 360,420 640,480 640,640
                 C 640,800 360,860 360,1020
                 C 360,1180 640,1240 640,1400
                 C 640,1540 540,1650 500,1740"
              fill="none"
              stroke="var(--sunny)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* START GATE SIGN */}
            <g transform="translate(500, 48)">
              <rect x="-42" y="-9" width="84" height="18" rx="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
              <text x="0" y="4" textAnchor="middle" fill="var(--ink)" fontSize="10" fontWeight="900" fontFamily="var(--font-display)" letterSpacing="0.08em">START</text>
            </g>

            {/* Waypoint Markers on Road curves */}
            {/* Stop 0: (360, 280) */}
            <circle cx="360" cy="280" r="14" fill="var(--tint-yellow)" stroke="var(--ink)" strokeWidth="2.5" />
            <circle cx="360" cy="280" r="4.5" fill="var(--ink)" />
            <path d="M 346,280 L 290,280" stroke="var(--ink)" strokeWidth="2" />

            {/* Stop 1: (640, 640) */}
            <circle cx="640" cy="640" r="14" fill="var(--tint-pink)" stroke="var(--ink)" strokeWidth="2.5" />
            <circle cx="640" cy="640" r="4.5" fill="var(--ink)" />
            <path d="M 654,640 L 710,640" stroke="var(--ink)" strokeWidth="2" />

            {/* Stop 2: (360, 1020) */}
            <circle cx="360" cy="1020" r="14" fill="var(--tint-mint)" stroke="var(--ink)" strokeWidth="2.5" />
            <circle cx="360" cy="1020" r="4.5" fill="var(--ink)" />
            <path d="M 346,1020 L 290,1020" stroke="var(--ink)" strokeWidth="2" />

            {/* Stop 3: (640, 1400) */}
            <circle cx="640" cy="1400" r="14" fill="var(--tint-sky)" stroke="var(--ink)" strokeWidth="2.5" />
            <circle cx="640" cy="1400" r="4.5" fill="var(--ink)" />
            <path d="M 654,1400 L 710,1400" stroke="var(--ink)" strokeWidth="2" />

            {/* Checkered Finish Marker */}
            <g transform="translate(500, 1738)">
              <rect x="-56" y="-10" width="112" height="20" rx="6" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
              <text x="0" y="4" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="900" fontFamily="var(--font-display)" letterSpacing="0.08em">★ 2026 ★</text>
            </g>
          </svg>

          {/* Traveling Mascot Wig */}
          <div ref={wigRef} className="about-journey__wig" aria-hidden="true">
            <Mascot mood={wigMood} size={64} />

            {/* Celebration Confetti burst container */}
            <div ref={confettiRef} className="about-journey__confetti" aria-hidden="true">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="about-journey__confetti-piece"
                  style={{
                    backgroundColor: confettiColors[i % confettiColors.length],
                    borderRadius: i % 2 === 0 ? '50%' : '2px',
                    width: `${6 + (i % 5) * 2}px`,
                    height: `${6 + (i % 3) * 3}px`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* 5 Mile-Marker Cards: Cleanly positioned on left & right */}
          <div className="about-journey__markers">
            {about.journey.map((item, idx) => {
              const cfg = signConfigs[idx] || signConfigs[0];
              const isLeft = cfg.side === 'left';
              const isCenter = cfg.side === 'center';
              const isActive = activeMilestone === idx;
              const isExpanded = expandedCard === idx;

              return (
                <div
                  key={item.year}
                  ref={(el) => { cardsRef.current[idx] = el; }}
                  className={`about-journey__marker about-journey__marker--${idx} about-journey__marker--${cfg.side} ${
                    isActive ? 'is-active' : ''
                  }`}
                  role="region"
                  aria-label={`${item.year}: ${item.title}`}
                >
                  {/* Shape Badge with Year */}
                  <div
                    className="about-journey__badge"
                    style={{
                      backgroundColor: cfg.tint,
                      borderRadius: cfg.borderRadius,
                    }}
                    onClick={() => toggleCard(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCard(idx); }}
                    title="Click to toggle details"
                  >
                    <span className="about-journey__year">{item.year}</span>
                  </div>

                  {/* Marker Card Text */}
                  <div
                    className="about-journey__card"
                    onClick={() => toggleCard(idx)}
                  >
                    {/* Directional Speech Pointer pointing towards road */}
                    {!isCenter && (
                      <div
                        className={`about-journey__card-pointer about-journey__card-pointer--${
                          isLeft ? 'right' : 'left'
                        }`}
                        aria-hidden="true"
                      />
                    )}

                    <div className="about-journey__card-header">
                      <h3 className="about-journey__title">{item.title}</h3>
                      <button
                        type="button"
                        className="about-journey__toggle-btn"
                        aria-expanded={isExpanded}
                        aria-label={`Toggle details for ${item.year}`}
                      >
                        <span className="about-journey__toggle-icon">
                          {isExpanded ? '−' : '+'}
                        </span>
                      </button>
                    </div>

                    <p className="about-journey__text">{item.text}</p>

                    {/* Interactive Peek when toggled/clicked */}
                    {isExpanded && (
                      <div className="about-journey__card-extra">
                        <span className="note">Milestone verified • Still thriving today!</span>
                      </div>
                    )}
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
