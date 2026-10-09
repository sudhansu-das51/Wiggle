import React, { useRef, useEffect } from 'react';
import { animate } from 'animejs';

/**
 * SafetyScene: Wall-mounted security camera, visitor sign-in desk, card/sensor badge.
 * Living detail: Camera pans left and right while a small indicator light blinks.
 */
export function SafetyScene({ isLit, isVisible, isReduced }) {
  const cameraRef = useRef(null);
  const ledRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (isReduced || !cameraRef.current || !ledRef.current) return;

    // Camera panning left/right
    const camAnim = animate(cameraRef.current, {
      rotate: [-18, 18],
      transformOrigin: '50% 15%',
      duration: 2200,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });

    // Blinking LED light
    const ledAnim = animate(ledRef.current, {
      opacity: [1, 0.2, 1],
      duration: 800,
      ease: 'steps(2)',
      loop: true,
    });

    animRef.current = {
      play: () => {
        camAnim.play();
        ledAnim.play();
      },
      pause: () => {
        camAnim.pause();
        ledAnim.pause();
      },
      revert: () => {
        if (camAnim.revert) camAnim.revert();
        else camAnim.pause();
        if (ledAnim.revert) ledAnim.revert();
        else ledAnim.pause();
      },
    };

    if (!isLit || !isVisible) {
      animRef.current.pause();
    }

    return () => {
      animRef.current.revert();
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
        <pattern id="safe-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.5" fill="var(--ink)" opacity="0.08" />
        </pattern>
      </defs>

      {/* Wall with soft pink tint */}
      <rect x="0" y="0" width="500" height="290" fill="var(--tint-pink)" />
      <rect x="0" y="0" width="500" height="290" fill="url(#safe-dots)" />

      {/* Reception Hall Wooden Floor */}
      <rect x="0" y="290" width="500" height="70" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
      <line x1="0" y1="290" x2="500" y2="290" stroke="var(--ink)" strokeWidth="3.5" />

      {/* Wall Display Monitors (Top Center) */}
      <g transform="translate(180, 40)">
        <rect x="0" y="0" width="140" height="85" rx="6" fill="var(--ink)" stroke="var(--ink)" strokeWidth="3" />
        {/* Quad Monitor Feeds */}
        <rect x="6" y="6" width="60" height="34" rx="2" fill="var(--sky)" stroke="var(--ink)" strokeWidth="1" />
        <rect x="74" y="6" width="60" height="34" rx="2" fill="var(--tint-yellow)" stroke="var(--ink)" strokeWidth="1" />
        <rect x="6" y="45" width="60" height="34" rx="2" fill="var(--tint-mint)" stroke="var(--ink)" strokeWidth="1" />
        <rect x="74" y="45" width="60" height="34" rx="2" fill="var(--tint-pink)" stroke="var(--ink)" strokeWidth="1" />

        {/* Small Live Indicators */}
        <circle cx="12" cy="12" r="2.5" fill="var(--bubblegum)" />
        <circle cx="80" cy="12" r="2.5" fill="var(--bubblegum)" />
        <circle cx="12" cy="51" r="2.5" fill="var(--bubblegum)" />
        <circle cx="80" cy="51" r="2.5" fill="var(--bubblegum)" />
      </g>

      {/* Living Detail: Wall-Mounted Security Camera (Top Left) */}
      <g transform="translate(60, 45)">
        {/* Wall Mount Bracket */}
        <rect x="0" y="0" width="16" height="30" rx="3" fill="var(--ink)" />
        <line x1="16" y1="15" x2="35" y2="15" stroke="var(--ink)" strokeWidth="4.5" />

        {/* Rotating Camera Body */}
        <g ref={cameraRef} transform="translate(35, 15)">
          {/* Swivel Joint */}
          <circle cx="0" cy="0" r="7" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
          {/* Camera Housing */}
          <rect x="-8" y="5" width="46" height="28" rx="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
          {/* Camera Lens */}
          <polygon points="38,10 52,4 52,34 38,28" fill="var(--ink)" stroke="var(--ink)" strokeWidth="2" />
          {/* Lens Glass */}
          <circle cx="28" cy="19" r="6" fill="var(--sky)" stroke="var(--ink)" strokeWidth="1.5" />
          {/* Blinking Red/Green LED */}
          <circle ref={ledRef} cx="2" cy="12" r="3" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="1" />
        </g>
      </g>

      {/* Reception Security & Check-In Desk (Center-Right) */}
      <g transform="translate(140, 165)">
        {/* Desk Top */}
        <rect x="0" y="0" width="230" height="18" rx="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3.5" />
        {/* Desk Front Panel */}
        <rect x="10" y="18" width="210" height="110" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3.5" />
        {/* Decorative Wooden Slats */}
        <line x1="60" y1="18" x2="60" y2="128" stroke="var(--ink)" strokeWidth="2" opacity="0.4" />
        <line x1="110" y1="18" x2="110" y2="128" stroke="var(--ink)" strokeWidth="2" opacity="0.4" />
        <line x1="160" y1="18" x2="160" y2="128" stroke="var(--ink)" strokeWidth="2" opacity="0.4" />

        {/* Visitor Sign-in Log Book */}
        <rect x="25" y="-12" width="42" height="12" rx="2" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
        <line x1="30" y1="-6" x2="60" y2="-6" stroke="var(--ink)" strokeWidth="1.5" />

        {/* Biometric Card / Photo Badge Scanner */}
        <rect x="90" y="-20" width="28" height="20" rx="3" fill="var(--ink)" />
        <circle cx="104" cy="-10" r="5" fill="var(--meadow)" />

        {/* Friendly Hand Sanitizer Dispenser */}
        <rect x="145" y="-22" width="18" height="22" rx="3" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
        <path d="M 154,-22 L 154,-28 L 148,-28" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="154" cy="-11" r="3" fill="var(--sky)" />
      </g>

      {/* Smart Access Gate Barrier on Right */}
      <g transform="translate(410, 190)">
        <rect x="0" y="0" width="22" height="105" rx="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3.5" />
        <circle cx="11" cy="25" r="5" fill="var(--meadow)" />
        <path d="M -25,45 L 0,45" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
export default SafetyScene;
