import React, { useRef, useEffect } from 'react';
import { animate } from 'animejs';

/**
 * KitchenScene: Counter, steaming pot on stove, chopping board with vegetables.
 * Living detail: Steam puffs rise gently from the cooking pot.
 */
export function KitchenScene({ isLit, isVisible, isReduced }) {
  const steamRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (isReduced || !steamRef.current) return;

    // Rising steam puffs loop
    const anim = animate(steamRef.current.querySelectorAll('.fac-steam-puff'), {
      translateY: [0, -28],
      translateX: [0, 5, -5, 0],
      opacity: [0, 0.85, 0],
      scale: [0.7, 1.3],
      duration: 1800,
      delay: (_, i) => i * 450,
      ease: 'easeOutSine',
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
        <pattern id="kitch-tiles" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="24" height="24" fill="none" stroke="var(--ink)" strokeWidth="0.8" opacity="0.08" />
        </pattern>
      </defs>

      {/* Wall with clean yellow wash */}
      <rect x="0" y="0" width="500" height="290" fill="var(--tint-yellow)" />
      <rect x="0" y="0" width="500" height="290" fill="url(#kitch-tiles)" />

      {/* Tiled Floor */}
      <rect x="0" y="290" width="500" height="70" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
      <line x1="0" y1="290" x2="500" y2="290" stroke="var(--ink)" strokeWidth="3.5" />
      <line x1="80" y1="290" x2="80" y2="360" stroke="var(--ink)" strokeWidth="1.5" opacity="0.25" />
      <line x1="180" y1="290" x2="180" y2="360" stroke="var(--ink)" strokeWidth="1.5" opacity="0.25" />
      <line x1="280" y1="290" x2="280" y2="360" stroke="var(--ink)" strokeWidth="1.5" opacity="0.25" />
      <line x1="380" y1="290" x2="380" y2="360" stroke="var(--ink)" strokeWidth="1.5" opacity="0.25" />

      {/* Top Hanging Spice & Utensil Shelf */}
      <g transform="translate(60, 45)">
        <rect x="0" y="0" width="380" height="12" rx="3" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3" />
        {/* Jars with beans / grains */}
        <rect x="30" y="-30" width="22" height="30" rx="3" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
        <rect x="33" y="-34" width="16" height="4" rx="1" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="41" cy="-15" r="5" fill="var(--sunny)" />

        <rect x="65" y="-32" width="24" height="32" rx="3" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
        <rect x="69" y="-36" width="16" height="4" rx="1" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="77" cy="-16" r="6" fill="var(--bubblegum)" />

        <rect x="105" y="-28" width="20" height="28" rx="3" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="115" cy="-14" r="4" fill="var(--meadow)" />

        {/* Hanging wooden spoons */}
        <line x1="220" y1="12" x2="220" y2="44" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="220" cy="50" rx="6" ry="9" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />

        <line x1="250" y1="12" x2="250" y2="40" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="250" cy="46" rx="7" ry="8" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />

        {/* Hanging Whisk */}
        <line x1="280" y1="12" x2="280" y2="35" stroke="var(--ink)" strokeWidth="2.5" />
        <ellipse cx="280" cy="45" rx="5" ry="10" fill="none" stroke="var(--ink)" strokeWidth="2" />
      </g>

      {/* Main Kitchen Counter (Lower half) */}
      <g transform="translate(40, 170)">
        {/* Counter Top Slab */}
        <rect x="0" y="0" width="420" height="22" rx="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3.5" />
        {/* Counter Base Cabinets */}
        <rect x="10" y="22" width="400" height="110" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3.5" />
        <line x1="140" y1="22" x2="140" y2="132" stroke="var(--ink)" strokeWidth="3" />
        <line x1="280" y1="22" x2="280" y2="132" stroke="var(--ink)" strokeWidth="3" />
        {/* Handles */}
        <line x1="125" y1="65" x2="125" y2="90" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <line x1="155" y1="65" x2="155" y2="90" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <line x1="265" y1="65" x2="265" y2="90" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />

        {/* 1. Stove & Big Stockpot (Left Counter) */}
        <g transform="translate(60, -50)">
          {/* Stove burner plate */}
          <ellipse cx="40" cy="48" rx="35" ry="6" fill="var(--ink)" />
          {/* The Pot Body */}
          <rect x="10" y="8" width="60" height="40" rx="6" fill="var(--sky)" stroke="var(--ink)" strokeWidth="3" />
          <ellipse cx="40" cy="8" rx="30" ry="7" fill="var(--tint-sky)" stroke="var(--ink)" strokeWidth="3" />
          {/* Pot Handles */}
          <path d="M 10,18 C 0,18 0,30 10,30" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 70,18 C 80,18 80,30 70,30" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
          {/* Pot Lid slightly ajar */}
          <path d="M 10,4 Q 40,-8 70,2" fill="none" stroke="var(--ink)" strokeWidth="4" />
          <circle cx="40" cy="-3" r="4" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />

          {/* Living Detail: Rising Steam Puffs */}
          <g ref={steamRef} transform="translate(40, -10)">
            <circle className="fac-steam-puff" cx="-12" cy="0" r="5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
            <circle className="fac-steam-puff" cx="4" cy="-5" r="7" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
            <circle className="fac-steam-puff" cx="16" cy="2" r="5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
          </g>
        </g>

        {/* 2. Wooden Chopping Board with Fresh Veggies (Center-Right Counter) */}
        <g transform="translate(240, -16)">
          {/* Board */}
          <rect x="0" y="0" width="110" height="16" rx="4" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
          <circle cx="100" cy="8" r="3" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />

          {/* Fresh Carrot */}
          <polygon points="15,-2 45,6 18,10" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M 12,0 L 4,-6 M 12,3 L 2,2 M 12,6 L 5,10" stroke="var(--meadow)" strokeWidth="2" strokeLinecap="round" />

          {/* Fresh Broccoli Florets */}
          <rect x="52" y="0" width="6" height="12" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx="55" cy="-5" r="9" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2" />
          <circle cx="49" cy="-3" r="6" fill="var(--meadow)" />
          <circle cx="61" cy="-3" r="6" fill="var(--meadow)" />

          {/* Fresh Cherry Tomato */}
          <circle cx="78" cy="2" r="8" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M 78,-6 L 78,-9 M 76,-6 L 74,-8 M 80,-6 L 82,-8" stroke="var(--meadow)" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
export default KitchenScene;
