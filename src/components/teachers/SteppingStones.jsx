import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate } from 'animejs';
import { SectionHeading } from '../ui/SectionHeading';
import { Mascot } from '../ui/Mascot';
import { Icon } from '../ui/Icon';
import { hiringSteps } from '../../data/teachers';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { MQ } from '../../utils/breakpoints';

gsap.registerPlugin(ScrollTrigger);

// Palette colors for the 5 stepping stones
const STONE_COLORS = [
  'var(--tint-mint)',
  'var(--tint-yellow)',
  'var(--tint-pink)',
  'var(--tint-mint)',
  'var(--tint-yellow)',
];

export function SteppingStones() {
  const reducedMotion = useReducedMotion();
  const isSaveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
  const skipAnimation = reducedMotion || isSaveData;

  const pondRef = useRef(null);
  const wigRef = useRef(null);
  const startBankRef = useRef(null);
  const endBankRef = useRef(null);
  const stonesRef = useRef([]);
  const ripplesRef = useRef([]);

  const [wigMood, setWigMood] = useState('point');

  // Hover wobble handler on stones
  const handleStoneHover = (idx) => {
    const el = stonesRef.current[idx];
    if (!el || skipAnimation) return;
    animate(el, {
      rotate: [-2, 2.5, -1.5, 1, 0],
      duration: 450,
      ease: 'inOutQuad',
    });
  };

  useEffect(() => {
    if (!pondRef.current) return;

    // Reduced motion or save-data: place Wig at the far bank in cheer mood
    if (skipAnimation) {
      setWigMood('cheer');
      if (wigRef.current && endBankRef.current) {
        gsap.set(wigRef.current, {
          x: 0,
          y: 0,
          opacity: 1,
        });
      }
      return;
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: MQ.tabletUp,
        isPhone: MQ.phone,
      },
      () => {
        const pondEl = pondRef.current;
        const wigEl = wigRef.current;
        const startBank = startBankRef.current;
        const endBank = endBankRef.current;
        const stoneEls = stonesRef.current.filter(Boolean);

        if (!pondEl || !wigEl || !startBank || !endBank || stoneEls.length === 0) return;

        // Position Wig on the starting bank initially
        const pondRect = pondEl.getBoundingClientRect();
        const startRect = startBank.getBoundingClientRect();

        const startX = startRect.left - pondRect.left + startRect.width / 2 - 32;
        const startY = startRect.top - pondRect.top + startRect.height / 2 - 40;

        gsap.set(wigEl, {
          x: startX,
          y: startY,
          opacity: 1,
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: pondEl,
            start: 'top 70%',
            once: true,
          },
        });

        // Sequence hops across each stone
        stoneEls.forEach((stone, idx) => {
          const sRect = stone.getBoundingClientRect();
          const targetX = sRect.left - pondRect.left + sRect.width / 2 - 32;
          const targetY = sRect.top - pondRect.top + 30; // landing on the stone pad

          // Hop arc: X moves linearly, Y goes up then down
          timeline.to(
            wigEl,
            {
              x: targetX,
              duration: 0.5,
              ease: 'power1.inOut',
            },
            `hop-${idx}`
          );

          timeline.to(
            wigEl,
            {
              y: targetY - 45, // arc peak
              duration: 0.25,
              ease: 'power2.out',
            },
            `hop-${idx}`
          );

          timeline.to(
            wigEl,
            {
              y: targetY,
              duration: 0.25,
              ease: 'power2.in',
              onComplete: () => {
                // Stone squish feedback
                gsap.fromTo(
                  stone,
                  { scaleY: 0.85, scaleX: 1.08 },
                  { scaleY: 1, scaleX: 1, duration: 0.35, ease: 'back.out(2)' }
                );

                // Anime.js ripple ring expansion
                const rip = ripplesRef.current[idx];
                if (rip) {
                  animate(rip, {
                    scale: [0.3, 1.7],
                    opacity: [0.7, 0],
                    duration: 650,
                    ease: 'outQuad',
                  });
                }
              },
            },
            `hop-${idx}+=0.25`
          );
        });

        // Final hop to the far bank
        const endRect = endBank.getBoundingClientRect();
        const endX = endRect.left - pondRect.left + endRect.width / 2 - 32;
        const endY = endRect.top - pondRect.top + endRect.height / 2 - 40;

        timeline.to(
          wigEl,
          {
            x: endX,
            duration: 0.55,
            ease: 'power1.inOut',
          },
          'hop-final'
        );

        timeline.to(
          wigEl,
          {
            y: endY - 40,
            duration: 0.27,
            ease: 'power2.out',
          },
          'hop-final'
        );

        timeline.to(
          wigEl,
          {
            y: endY,
            duration: 0.28,
            ease: 'power2.in',
            onComplete: () => {
              setWigMood('cheer');
            },
          },
          'hop-final+=0.27'
        );
      }
    );

    // Subtle drift animation for pond leaves (only when visible and on tabletUp)
    let leavesAnim;
    let observer;
    if (window.matchMedia(MQ.tabletUp).matches && !skipAnimation) {
      leavesAnim = animate('.tch-pond__leaf', {
        x: [0, 8, -6, 0],
        y: [0, -6, 5, 0],
        rotate: [-3, 5, -2, 0],
        duration: 10000,
        loop: true,
        alternate: true,
        ease: 'inOutSine',
        autoplay: false,
      });

      // Pause when offscreen or tab is hidden
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !document.hidden) {
              leavesAnim?.play();
            } else {
              leavesAnim?.pause();
            }
          });
        },
        { threshold: 0.1 }
      );
      if (pondRef.current) observer.observe(pondRef.current);

      const handleVisibilityChange = () => {
        if (document.hidden) {
          leavesAnim?.pause();
        } else if (pondRef.current) {
          const rect = pondRef.current.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            leavesAnim?.play();
          }
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      mm.revert();
      if (observer) observer.disconnect();
      leavesAnim?.pause();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === pondRef.current) st.kill();
      });
    };
  }, [skipAnimation]);

  return (
    <section className="section section--sky tch-pond-section" aria-label="Hiring process">
      <div className="container">
        {/* Section Heading */}
        <SectionHeading
          title="How someone becomes a Wiggle teacher"
          note="Five stepping stones before they ever meet your child."
          align="center"
          wiggle
        />

        {/* The Pond Area */}
        <div ref={pondRef} className="tch-pond">
          {/* Decorative SVG pond ripples, reeds & water details */}
          <div className="tch-pond__decor" aria-hidden="true">
            <svg
              className="tch-pond__svg"
              viewBox="0 0 1100 500"
              preserveAspectRatio="none"
              fill="none"
            >
              {/* Ripple water paths */}
              <path
                d="M 50 150 Q 200 130 350 160"
                stroke="var(--ink)"
                strokeWidth="1.8"
                opacity="0.18"
                strokeLinecap="round"
              />
              <path
                d="M 750 120 Q 900 100 1050 130"
                stroke="var(--ink)"
                strokeWidth="1.8"
                opacity="0.18"
                strokeLinecap="round"
              />
              <path
                d="M 250 380 Q 450 350 650 390"
                stroke="var(--ink)"
                strokeWidth="1.8"
                opacity="0.18"
                strokeLinecap="round"
              />

              {/* Floating Leaves */}
              <g className="tch-pond__leaf" transform="translate(180, 80)">
                <ellipse cx="0" cy="0" rx="18" ry="12" fill="var(--tint-mint)" stroke="var(--ink)" strokeWidth="1.5" />
                <line x1="-12" y1="0" x2="12" y2="0" stroke="var(--ink)" strokeWidth="1.2" />
              </g>
              <g className="tch-pond__leaf" transform="translate(880, 360)">
                <ellipse cx="0" cy="0" rx="22" ry="14" fill="var(--tint-mint)" stroke="var(--ink)" strokeWidth="1.5" />
                <line x1="-16" y1="0" x2="16" y2="0" stroke="var(--ink)" strokeWidth="1.2" />
              </g>

              {/* Left reeds */}
              <path d="M 30 260 Q 35 200 45 160" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 40 260 Q 55 190 60 140" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 50 260 Q 45 210 35 180" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />

              {/* Right reeds */}
              <path d="M 1060 380 Q 1045 320 1040 280" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 1070 380 Q 1060 310 1055 260" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Start Bank */}
          <div ref={startBankRef} className="tch-bank tch-bank--start">
            <span className="tch-bank__label">Applications</span>
          </div>

          {/* Stepping Stones Path */}
          <div className="tch-stones-track">
            {hiringSteps.map((step, idx) => {
              const stoneBg = STONE_COLORS[idx % STONE_COLORS.length];
              return (
                <div
                  key={idx}
                  ref={(el) => {
                    stonesRef.current[idx] = el;
                  }}
                  className={`tch-stone tch-stone--${idx + 1}`}
                  onMouseEnter={() => handleStoneHover(idx)}
                  tabIndex={0}
                  onFocus={() => handleStoneHover(idx)}
                >
                  {/* Ripple ring for landing animation */}
                  <span
                    ref={(el) => {
                      ripplesRef.current[idx] = el;
                    }}
                    className="tch-stone__ripple"
                    aria-hidden="true"
                  />

                  {/* Stone Pad shape */}
                  <div
                    className="tch-stone__pad"
                    style={{ backgroundColor: stoneBg }}
                  >
                    <span className="tch-stone__num">{idx + 1}</span>
                    <span className="tch-stone__icon">
                      <Icon name={step.icon} size={22} color="var(--ink)" />
                    </span>
                  </div>

                  {/* Stone Text Details (Real HTML, always readable) */}
                  <div className="tch-stone__details">
                    <h3 className="tch-stone__title">{step.title}</h3>
                    <p className="tch-stone__text">{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* End Bank with Classroom Sign */}
          <div ref={endBankRef} className="tch-bank tch-bank--end">
            <div className="tch-bank__sign">
              <span className="tch-bank__sign-post" />
              <span className="tch-bank__sign-board">Classroom</span>
            </div>
          </div>

          {/* Animated Wig Mascot */}
          <div ref={wigRef} className="tch-pond__mascot" aria-hidden="true">
            <Mascot mood={wigMood} size={64} />
          </div>
        </div>
      </div>
    </section>
  );
}
