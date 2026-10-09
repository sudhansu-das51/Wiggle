import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(MotionPathPlugin);

/**
 * PaperPlane animation overlay.
 * Folds a sheet of paper into a paper plane and flies it along a curved
 * trajectory leaving a dotted ink trail, then triggers onComplete.
 */
export function PaperPlane({ isPlaying, onComplete }) {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const sheetRef = useRef(null);
  const foldedRef = useRef(null);
  const trailRef = useRef(null);
  const timelineRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isSaveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;

  useEffect(() => {
    if (!isPlaying) return;

    if (reducedMotion || isSaveData) {
      onComplete?.();
      return;
    }

    const container = containerRef.current;
    const plane = planeRef.current;
    const sheet = sheetRef.current;
    const folded = foldedRef.current;
    const trail = trailRef.current;

    if (!container || !plane || !sheet || !folded) {
      onComplete?.();
      return;
    }

    // Escape listener skips animation
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        timelineRef.current?.progress(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const tl = gsap.timeline({
      onComplete: () => {
        window.removeEventListener('keydown', handleKeyDown);
        onComplete?.();
      },
    });
    timelineRef.current = tl;

    // Set initial states
    gsap.set(sheet, { opacity: 1, scale: 1 });
    gsap.set(folded, { opacity: 0 });
    gsap.set(plane, { opacity: 0, x: 0, y: 0, scale: 1, rotation: 0 });

    if (trail) {
      const length = trail.getTotalLength ? trail.getTotalLength() : 400;
      gsap.set(trail, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0.4,
      });
    }

    // Phase 1: Fold (0 to 0.5s)
    tl.to(sheet, {
      scaleX: 0.6,
      duration: 0.18,
      ease: 'power2.in',
    })
    .to(sheet, {
      opacity: 0,
      duration: 0.05,
    }, '-=0.05')
    .to(folded, {
      opacity: 1,
      scaleX: 0.8,
      rotation: -10,
      duration: 0.15,
      ease: 'back.out(2)',
    })
    .to(folded, {
      opacity: 0,
      duration: 0.05,
    }, '+=0.05')
    .to(plane, {
      opacity: 1,
      scale: 1,
      rotation: 15,
      duration: 0.12,
      ease: 'back.out(2)',
    });

    // Phase 2: Fly (0.5 to 1.3s)
    const flightPath = [
      { x: 0, y: 0 },
      { x: 120, y: -70 },
      { x: 280, y: -160 },
      { x: 500, y: -300 },
    ];

    tl.to(
      plane,
      {
        motionPath: {
          path: flightPath,
          autoRotate: true,
          curviness: 1.25,
        },
        scale: 0.35,
        duration: 0.8,
        ease: 'power1.in',
      },
      '+=0.05'
    );

    if (trail) {
      tl.to(
        trail,
        {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: 'power1.in',
        },
        '<'
      );
    }

    // Phase 3: Fade out / land (1.3 to 1.4s)
    tl.to([plane, trail], {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.out',
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      tl.kill();
    };
  }, [isPlaying, onComplete, reducedMotion, isSaveData]);

  if (!isPlaying) return null;

  return (
    <div
      ref={containerRef}
      className="con-paper-plane-overlay"
      aria-hidden="true"
    >
      <svg
        className="con-paper-plane-svg"
        viewBox="-100 -350 700 450"
        fill="none"
      >
        {/* Flight Trail Path */}
        <path
          ref={trailRef}
          d="M 0,0 Q 150,-90 500,-300"
          stroke="var(--ink)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Plane Group */}
        <g ref={planeRef}>
          {/* Paper Plane Icon Shape */}
          <polygon
            points="0,-18 36,0 0,18 8,0"
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line
            x1="8"
            y1="0"
            x2="36"
            y2="0"
            stroke="var(--ink)"
            strokeWidth="1.8"
          />
        </g>

        {/* Initial Flat Sheet */}
        <g ref={sheetRef}>
          <rect
            x="-28"
            y="-22"
            width="56"
            height="44"
            rx="3"
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth="2.5"
          />
          <line x1="-20" y1="-10" x2="20" y2="-10" stroke="var(--ink)" strokeWidth="1.5" opacity="0.4" />
          <line x1="-20" y1="0" x2="16" y2="0" stroke="var(--ink)" strokeWidth="1.5" opacity="0.4" />
          <line x1="-20" y1="10" x2="20" y2="10" stroke="var(--ink)" strokeWidth="1.5" opacity="0.4" />
        </g>

        {/* Half-folded Sheet */}
        <g ref={foldedRef}>
          <polygon
            points="-25,-25 25,0 -25,25"
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
