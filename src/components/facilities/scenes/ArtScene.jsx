import React, { useRef, useEffect } from 'react';
import { animate } from 'animejs';

/**
 * ArtScene: Easel, paint pots, drying line with hung paintings.
 * Living detail: Paintbrush draws a colorful squiggle across the canvas, then fades and repeats.
 */
export function ArtScene({ isLit, isVisible, isReduced }) {
  const squiggleRef = useRef(null);
  const brushRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (isReduced || !squiggleRef.current || !brushRef.current) return;

    const path = squiggleRef.current;
    const length = path.getTotalLength ? path.getTotalLength() : 160;
    path.style.strokeDasharray = `${length} ${length}`;
    path.style.strokeDashoffset = `${length}`;

    // Anime loop: draw stroke, move brush, pause, fade out, repeat
    const anim = animate(path, {
      strokeDashoffset: [length, 0],
      duration: 1800,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });

    // Brush tip follow / wiggle
    const brushAnim = animate(brushRef.current, {
      translateX: [0, 65],
      translateY: [0, -12, 10, -5, 0],
      rotate: [-5, 12, -8, 5, 0],
      duration: 1800,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });

    animRef.current = {
      play: () => {
        anim.play();
        brushAnim.play();
      },
      pause: () => {
        anim.pause();
        brushAnim.pause();
      },
      revert: () => {
        if (anim.revert) anim.revert();
        else anim.pause();
        if (brushAnim.revert) brushAnim.revert();
        else brushAnim.pause();
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
        <pattern id="art-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--ink)" strokeWidth="0.8" opacity="0.08" />
        </pattern>
      </defs>

      {/* Wall with soft pink wash */}
      <rect x="0" y="0" width="500" height="290" fill="var(--tint-pink)" />
      <rect x="0" y="0" width="500" height="290" fill="url(#art-grid)" />

      {/* Tiled Studio Floor */}
      <rect x="0" y="290" width="500" height="70" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
      <line x1="0" y1="290" x2="500" y2="290" stroke="var(--ink)" strokeWidth="3.5" />
      <line x1="100" y1="290" x2="100" y2="360" stroke="var(--ink)" strokeWidth="1.5" opacity="0.25" />
      <line x1="200" y1="290" x2="200" y2="360" stroke="var(--ink)" strokeWidth="1.5" opacity="0.25" />
      <line x1="300" y1="290" x2="300" y2="360" stroke="var(--ink)" strokeWidth="1.5" opacity="0.25" />
      <line x1="400" y1="290" x2="400" y2="360" stroke="var(--ink)" strokeWidth="1.5" opacity="0.25" />

      {/* Drying Line with Hung Paintings at Top */}
      <g transform="translate(0, 20)">
        <path d="M 20,20 Q 140,40 260,25 Q 380,45 480,20" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
        {/* Peg 1 + Art */}
        <line x1="75" y1="26" x2="75" y2="34" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <rect x="55" y="32" width="40" height="48" rx="2" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="75" cy="54" r="10" fill="var(--sunny)" />
        {/* Peg 2 + Art */}
        <line x1="165" y1="31" x2="165" y2="39" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <rect x="145" y="37" width="42" height="50" rx="2" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
        <path d="M 152,72 C 160,52 170,82 178,60" fill="none" stroke="var(--meadow)" strokeWidth="3" strokeLinecap="round" />
        {/* Peg 3 + Art */}
        <line x1="395" y1="31" x2="395" y2="39" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <rect x="375" y="37" width="44" height="48" rx="2" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
        <polygon points="385,75 397,50 409,75" fill="var(--sky)" stroke="var(--ink)" strokeWidth="1.5" />
      </g>

      {/* Paint Splash Decals on Wall */}
      <path d="M 340,140 Q 355,130 350,150 Q 365,160 345,165 Q 330,155 340,140 Z" fill="var(--bubblegum)" opacity="0.8" />
      <path d="M 110,160 Q 120,150 125,165 Q 135,170 120,180 Q 105,175 110,160 Z" fill="var(--sunny)" opacity="0.8" />

      {/* Wooden Studio Easel (Center) */}
      <g transform="translate(190, 110)">
        {/* Rear leg */}
        <line x1="60" y1="0" x2="60" y2="235" stroke="var(--ink)" strokeWidth="4.5" strokeLinecap="round" />
        {/* Left leg */}
        <line x1="60" y1="0" x2="5" y2="235" stroke="var(--ink)" strokeWidth="5.5" strokeLinecap="round" />
        {/* Right leg */}
        <line x1="60" y1="0" x2="115" y2="235" stroke="var(--ink)" strokeWidth="5.5" strokeLinecap="round" />

        {/* Shelf bar holding canvas */}
        <rect x="-5" y="145" width="130" height="12" rx="3" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3" />

        {/* Paper Canvas Board */}
        <rect x="12" y="35" width="96" height="110" rx="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />

        {/* Pre-painted Sun on Canvas */}
        <circle cx="36" cy="62" r="10" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />

        {/* Living Detail: Active Drawn Squiggle */}
        <path
          ref={squiggleRef}
          d="M 25,115 Q 40,85 58,110 T 92,95"
          fill="none"
          stroke="var(--bubblegum)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Paintbrush following the squiggle */}
        <g ref={brushRef} transform="translate(25, 115)">
          {/* Brush Handle */}
          <line x1="0" y1="0" x2="28" y2="-28" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
          <polygon points="0,0 6,-8 8,-6" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="1.5" />
        </g>
      </g>

      {/* Ceramic Paint Pots Table on Right */}
      <g transform="translate(360, 240)">
        <ellipse cx="45" cy="15" rx="46" ry="16" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3" />
        <line x1="15" y1="25" x2="10" y2="85" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <line x1="75" y1="25" x2="80" y2="85" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        {/* Pots */}
        <rect x="18" y="0" width="16" height="20" rx="3" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2" />
        <rect x="38" y="-3" width="16" height="23" rx="3" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2" />
        <rect x="58" y="2" width="16" height="18" rx="3" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" />
      </g>

      {/* Paint Buckets on Floor Left */}
      <g transform="translate(80, 275)">
        <path d="M 5,5 L 8,35 L 32,35 L 35,5 Z" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2.5" />
        <ellipse cx="20" cy="5" rx="15" ry="5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
      </g>
    </svg>
  );
}
export default ArtScene;
