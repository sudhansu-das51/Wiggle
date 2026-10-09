import React, { useRef, useEffect } from 'react';
import { animate } from 'animejs';

/**
 * CareScene: Small health cot, first-aid cabinet with a plus sign, and a soft teddy bear.
 * Living detail: The first-aid cross/plus sign gently pulses with a healing glow.
 */
export function CareScene({ isLit, isVisible, isReduced }) {
  const crossRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (isReduced || !crossRef.current) return;

    // Gentle pulsing cross animation
    const anim = animate(crossRef.current, {
      scale: [1, 1.25, 1],
      opacity: [0.75, 1, 0.75],
      transformOrigin: '50% 50%',
      duration: 1600,
      ease: 'inOutSine',
      loop: true,
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
        <pattern id="care-crosses" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 12 14 L 16 14 M 14 12 L 14 16" stroke="var(--ink)" strokeWidth="1" opacity="0.08" />
        </pattern>
      </defs>

      {/* Wall with soft sky tint */}
      <rect x="0" y="0" width="500" height="290" fill="var(--tint-sky)" />
      <rect x="0" y="0" width="500" height="290" fill="url(#care-crosses)" />

      {/* Floor */}
      <rect x="0" y="290" width="500" height="70" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
      <line x1="0" y1="290" x2="500" y2="290" stroke="var(--ink)" strokeWidth="3.5" />

      {/* 1. Wall First-Aid Cabinet (Top Left) */}
      <g transform="translate(60, 45)">
        {/* Cabinet Box */}
        <rect x="0" y="0" width="95" height="110" rx="8" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3.5" />
        {/* Shelf line */}
        <line x1="0" y1="55" x2="95" y2="55" stroke="var(--ink)" strokeWidth="2" opacity="0.3" />

        {/* Medicine bottles */}
        <rect x="12" y="68" width="14" height="26" rx="2" fill="var(--tint-yellow)" stroke="var(--ink)" strokeWidth="1.5" />
        <rect x="30" y="62" width="16" height="32" rx="2" fill="var(--tint-mint)" stroke="var(--ink)" strokeWidth="1.5" />
        {/* Gauze box */}
        <rect x="52" y="70" width="28" height="24" rx="3" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />

        {/* Living Detail: Pulsing Red/Pink First-Aid Plus Sign */}
        <g ref={crossRef} transform="translate(47.5, 28)">
          <circle cx="0" cy="0" r="18" fill="var(--tint-pink)" stroke="var(--ink)" strokeWidth="2" />
          {/* Plus Sign */}
          <path
            d="M -4,-11 L 4,-11 L 4,-4 L 11,-4 L 11,4 L 4,4 L 4,11 L -4,11 L -4,4 L -11,4 L -11,-4 L -4,-4 Z"
            fill="var(--bubblegum)"
            stroke="var(--ink)"
            strokeWidth="1.5"
          />
        </g>
      </g>

      {/* 2. Soothing Window with Sunlit Sheer Curtains (Center Top) */}
      <g transform="translate(210, 40)">
        <rect x="0" y="0" width="110" height="100" rx="20" fill="var(--sky)" stroke="var(--ink)" strokeWidth="3" />
        <line x1="55" y1="0" x2="55" y2="100" stroke="var(--ink)" strokeWidth="2" />
        <line x1="0" y1="50" x2="110" y2="50" stroke="var(--ink)" strokeWidth="2" />
        {/* Sheer curtains */}
        <path d="M 0,0 Q 25,60 10,100 L 0,100 Z" fill="var(--paper)" opacity="0.8" />
        <path d="M 110,0 Q 85,60 100,100 L 110,100 Z" fill="var(--paper)" opacity="0.8" />
      </g>

      {/* 3. Toddler Health Nap Cot (Bottom Right) */}
      <g transform="translate(180, 185)">
        {/* Bed Headboard Timber */}
        <rect x="0" y="10" width="16" height="100" rx="6" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3.5" />
        {/* Bed Footboard Timber */}
        <rect x="235" y="45" width="16" height="65" rx="6" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3.5" />
        {/* Bed Frame Base */}
        <rect x="10" y="70" width="230" height="24" rx="4" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3.5" />

        {/* Mattress */}
        <rect x="12" y="48" width="226" height="26" rx="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />

        {/* Puffy Blanket */}
        <path
          d="M 65,48 L 236,48 L 236,74 L 65,74 Q 50,60 65,48 Z"
          fill="var(--tint-mint)"
          stroke="var(--ink)"
          strokeWidth="2.5"
        />
        {/* Pastel stars on blanket */}
        <circle cx="110" cy="62" r="4" fill="var(--meadow)" opacity="0.8" />
        <circle cx="160" cy="58" r="4" fill="var(--bubblegum)" opacity="0.8" />
        <circle cx="205" cy="64" r="4" fill="var(--sunny)" opacity="0.8" />

        {/* Fluffy Pillow */}
        <ellipse cx="42" cy="52" rx="24" ry="14" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2.5" />

        {/* Cute Soft Plushie / Teddy Bear on Bed */}
        <g transform="translate(70, 32)">
          {/* Ears */}
          <circle cx="5" cy="3" r="5" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx="21" cy="3" r="5" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.5" />
          {/* Head */}
          <circle cx="13" cy="11" r="11" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
          {/* Eyes & Nose */}
          <circle cx="9" cy="9" r="1.5" fill="var(--ink)" />
          <circle cx="17" cy="9" r="1.5" fill="var(--ink)" />
          <ellipse cx="13" cy="13" rx="3" ry="2" fill="var(--ink)" />
          {/* Body & Paws */}
          <ellipse cx="13" cy="27" rx="9" ry="11" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
          <circle cx="4" cy="24" r="4" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx="22" cy="24" r="4" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.5" />
        </g>
      </g>

      {/* Bedside Table on Left */}
      <g transform="translate(100, 240)">
        <rect x="0" y="0" width="55" height="60" rx="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
        <line x1="0" y1="30" x2="55" y2="30" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="27" cy="15" r="3" fill="var(--ink)" />
        <circle cx="27" cy="45" r="3" fill="var(--ink)" />
        {/* Glass of water */}
        <polygon points="18,-15 22,0 32,0 36,-15" fill="var(--sky)" stroke="var(--ink)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
export default CareScene;
