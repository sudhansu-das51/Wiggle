import React, { useRef, useEffect } from 'react';
import { animate } from 'animejs';

/**
 * ClassroomScene: Low round tables, tiny chairs, and alphabet bunting.
 * Living detail: Alphabet bunting flags sway gently.
 */
export function ClassroomScene({ isLit, isVisible, isReduced }) {
  const buntingRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (isReduced || !buntingRef.current) return;

    // Swaying bunting pendulum
    const anim = animate(buntingRef.current.querySelectorAll('.fac-bunting-flag'), {
      rotate: [-6, 6],
      transformOrigin: 'top center',
      duration: 1600,
      ease: 'inOutSine',
      delay: (_, i) => i * 120,
      loop: true,
      alternate: true,
    });

    animRef.current = anim;
    if (!isLit || !isVisible) {
      anim.pause();
    }

    return () => {
      if (anim.revert) {
        anim.revert();
      } else {
        anim.pause();
      }
    };
  }, [isReduced, isLit, isVisible]);

  useEffect(() => {
    if (!animRef.current) return;
    if (isLit && isVisible && !isReduced) {
      animRef.current.play();
    } else {
      animRef.current.pause();
    }
  }, [isLit, isVisible, isReduced]);

  return (
    <svg
      viewBox="0 0 500 360"
      className="fac-scene-svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <pattern id="class-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.5" fill="var(--ink)" opacity="0.08" />
        </pattern>
      </defs>

      {/* Wall & wallpaper pattern */}
      <rect x="0" y="0" width="500" height="290" fill="var(--tint-yellow)" />
      <rect x="0" y="0" width="500" height="290" fill="url(#class-dots)" />

      {/* Wooden Floor */}
      <rect x="0" y="290" width="500" height="70" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
      <line x1="0" y1="290" x2="500" y2="290" stroke="var(--ink)" strokeWidth="3.5" />
      <line x1="120" y1="290" x2="120" y2="360" stroke="var(--ink)" strokeWidth="1.5" opacity="0.25" />
      <line x1="250" y1="290" x2="250" y2="360" stroke="var(--ink)" strokeWidth="1.5" opacity="0.25" />
      <line x1="380" y1="290" x2="380" y2="360" stroke="var(--ink)" strokeWidth="1.5" opacity="0.25" />

      {/* Sunny Window with Sky View */}
      <g transform="translate(40, 45)">
        <rect x="0" y="0" width="90" height="120" rx="45" fill="var(--sky)" stroke="var(--ink)" strokeWidth="3" />
        <path d="M 15,35 Q 30,20 45,35 Q 60,20 75,35" fill="none" stroke="var(--paper)" strokeWidth="4" opacity="0.8" />
        {/* Window pane cross */}
        <line x1="45" y1="0" x2="45" y2="120" stroke="var(--ink)" strokeWidth="2.5" />
        <line x1="0" y1="65" x2="90" y2="65" stroke="var(--ink)" strokeWidth="2.5" />
        {/* Window sill */}
        <rect x="-10" y="115" width="110" height="10" rx="3" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
      </g>

      {/* Low Bookshelf with toys on the right wall */}
      <g transform="translate(380, 160)">
        <rect x="0" y="0" width="95" height="130" rx="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
        <line x1="0" y1="65" x2="95" y2="65" stroke="var(--ink)" strokeWidth="2.5" />
        {/* Books on shelf */}
        <rect x="10" y="15" width="12" height="45" rx="2" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2" />
        <rect x="25" y="20" width="10" height="40" rx="2" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2" />
        <rect x="38" y="12" width="14" height="48" rx="2" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
        {/* Wooden sorting blocks */}
        <rect x="15" y="85" width="22" height="22" rx="3" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="65" cy="96" r="14" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" />
      </g>

      {/* Circular Play Rug on Floor */}
      <ellipse cx="230" cy="315" rx="140" ry="32" fill="var(--tint-mint)" stroke="var(--ink)" strokeWidth="3" />

      {/* Tiny Wooden Chairs */}
      {/* Left Chair */}
      <g transform="translate(130, 240)">
        <path d="M 10,0 Q 25,-10 40,0 L 38,30 L 12,30 Z" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2.5" />
        <rect x="5" y="30" width="40" height="10" rx="4" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2.5" />
        <line x1="12" y1="40" x2="8" y2="72" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <line x1="38" y1="40" x2="42" y2="72" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* Right Chair */}
      <g transform="translate(290, 240)">
        <path d="M 10,0 Q 25,-10 40,0 L 38,30 L 12,30 Z" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2.5" />
        <rect x="5" y="30" width="40" height="10" rx="4" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2.5" />
        <line x1="12" y1="40" x2="8" y2="72" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <line x1="38" y1="40" x2="42" y2="72" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Low Round Wooden Activity Table */}
      <g transform="translate(160, 255)">
        <ellipse cx="70" cy="20" rx="72" ry="24" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3.5" />
        <path d="M 28,32 L 24,65" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <path d="M 112,32 L 116,65" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <path d="M 70,38 L 70,68" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
        {/* Crayons cup on table */}
        <rect x="60" y="3" width="18" height="20" rx="3" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
        <line x1="64" y1="3" x2="64" y2="-6" stroke="var(--bubblegum)" strokeWidth="3" strokeLinecap="round" />
        <line x1="70" y1="3" x2="72" y2="-8" stroke="var(--meadow)" strokeWidth="3" strokeLinecap="round" />
        <line x1="74" y1="3" x2="75" y2="-5" stroke="var(--sky)" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Living Detail: Alphabet Bunting String & Flags */}
      <g ref={buntingRef} transform="translate(0, 15)">
        {/* Catia Curve string */}
        <path d="M 20,25 Q 140,55 260,35 Q 380,55 480,25" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
        {/* Flags swaying */}
        <g className="fac-bunting-flag" transform="translate(70, 36)">
          <polygon points="0,0 26,0 13,32" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2" />
          <text x="13" y="16" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display)" fontSize="12" fontWeight="bold">A</text>
        </g>
        <g className="fac-bunting-flag" transform="translate(130, 42)">
          <polygon points="0,0 26,0 13,32" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
          <text x="13" y="16" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display)" fontSize="12" fontWeight="bold">B</text>
        </g>
        <g className="fac-bunting-flag" transform="translate(195, 41)">
          <polygon points="0,0 26,0 13,32" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2" />
          <text x="13" y="16" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display)" fontSize="12" fontWeight="bold">C</text>
        </g>
        <g className="fac-bunting-flag" transform="translate(265, 37)">
          <polygon points="0,0 26,0 13,32" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" />
          <text x="13" y="16" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display)" fontSize="12" fontWeight="bold">D</text>
        </g>
        <g className="fac-bunting-flag" transform="translate(335, 42)">
          <polygon points="0,0 26,0 13,32" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2" />
          <text x="13" y="16" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display)" fontSize="12" fontWeight="bold">E</text>
        </g>
        <g className="fac-bunting-flag" transform="translate(405, 36)">
          <polygon points="0,0 26,0 13,32" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
          <text x="13" y="16" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display)" fontSize="12" fontWeight="bold">F</text>
        </g>
      </g>
    </svg>
  );
}
export default ClassroomScene;
