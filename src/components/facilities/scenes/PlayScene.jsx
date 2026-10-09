import React, { useRef, useEffect } from 'react';
import { animate } from 'animejs';

/**
 * PlayScene: Slide, sandpit with bucket and spade, and a wooden swing set.
 * Living detail: Swing swings back and forth like a pendulum.
 */
export function PlayScene({ isLit, isVisible, isReduced }) {
  const swingRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (isReduced || !swingRef.current) return;

    // Pendulum swing animation
    const anim = animate(swingRef.current, {
      rotate: [-16, 16],
      transformOrigin: 'top center',
      duration: 1400,
      ease: 'inOutSine',
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
      {/* Sky Backdrop */}
      <rect x="0" y="0" width="500" height="260" fill="var(--tint-sky)" />

      {/* Fluffy Clouds */}
      <g fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" opacity="0.95">
        <path d="M 40,60 Q 55,40 75,50 Q 95,35 115,55 Q 125,75 105,80 L 50,80 Q 35,75 40,60 Z" />
        <path d="M 360,45 Q 375,30 395,40 Q 415,25 435,45 Q 445,60 425,70 L 370,70 Q 355,65 360,45 Z" />
      </g>

      {/* Gentle Sun */}
      <g transform="translate(430, 45)">
        <circle cx="0" cy="0" r="28" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3" />
        {/* Rays */}
        <line x1="0" y1="-38" x2="0" y2="-32" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <line x1="27" y1="-27" x2="22" y2="-22" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <line x1="38" y1="0" x2="32" y2="0" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <line x1="-27" y1="-27" x2="-22" y2="-22" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Distant Hills / Tree line */}
      <path d="M 0,260 Q 80,210 180,240 Q 280,200 400,245 Q 460,230 500,250 L 500,360 L 0,360 Z" fill="var(--tint-mint)" />

      {/* Green Turf & Grass Mound */}
      <path d="M 0,270 Q 120,250 250,270 Q 380,255 500,275 L 500,360 L 0,360 Z" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="3.5" />

      {/* Grass Tufts */}
      <path d="M 40,290 L 45,278 M 45,290 L 47,276 M 50,290 L 53,280" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 440,295 L 444,284 M 447,295 L 450,282" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />

      {/* 1. Wooden Swing Set (Center-Left) */}
      <g transform="translate(60, 110)">
        {/* A-Frame Timber Left */}
        <line x1="20" y1="0" x2="0" y2="210" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
        <line x1="20" y1="0" x2="40" y2="210" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
        <line x1="8" y1="120" x2="32" y2="120" stroke="var(--ink)" strokeWidth="4" />

        {/* A-Frame Timber Right */}
        <line x1="150" y1="0" x2="130" y2="210" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
        <line x1="150" y1="0" x2="170" y2="210" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
        <line x1="138" y1="120" x2="162" y2="120" stroke="var(--ink)" strokeWidth="4" />

        {/* Top Crossbar */}
        <rect x="0" y="-8" width="175" height="14" rx="4" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3.5" />

        {/* Living Detail: Pendulum Swing */}
        <g ref={swingRef} transform="translate(85, 4)">
          {/* Top pivot rings */}
          <circle cx="-14" cy="2" r="3" fill="var(--ink)" />
          <circle cx="14" cy="2" r="3" fill="var(--ink)" />
          {/* Chains / Ropes */}
          <line x1="-14" y1="2" x2="-14" y2="135" stroke="var(--ink)" strokeWidth="2.5" />
          <line x1="14" y1="2" x2="14" y2="135" stroke="var(--ink)" strokeWidth="2.5" />
          {/* Wooden Swing Seat */}
          <rect x="-24" y="135" width="48" height="10" rx="3" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="3" />
        </g>
      </g>

      {/* 2. Toddler Slide (Center-Right) */}
      <g transform="translate(260, 160)">
        {/* Ladder Steps */}
        <line x1="15" y1="0" x2="5" y2="155" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <line x1="30" y1="0" x2="25" y2="155" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <line x1="13" y1="40" x2="28" y2="40" stroke="var(--ink)" strokeWidth="3" />
        <line x1="10" y1="80" x2="27" y2="80" stroke="var(--ink)" strokeWidth="3" />
        <line x1="8" y1="120" x2="26" y2="120" stroke="var(--ink)" strokeWidth="3" />

        {/* Top Platform & Canopy */}
        <rect x="15" y="-5" width="35" height="15" rx="3" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3" />
        <path d="M 12,-5 Q 32,-25 52,-5 Z" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2.5" />

        {/* Slide Chute Slope */}
        <path
          d="M 45,10 C 70,30 90,80 120,130 C 130,145 145,155 165,155"
          fill="none"
          stroke="var(--sky)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Slide Ink Outlines */}
        <path
          d="M 45,1 L 45,19 C 70,39 90,89 120,139 C 130,154 145,164 165,164"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>

      {/* 3. Sensory Sandpit & Bucket with Spade (Bottom Right) */}
      <g transform="translate(370, 275)">
        {/* Hexagonal Timber Sandpit Border */}
        <ellipse cx="45" cy="35" rx="55" ry="24" fill="var(--tint-yellow)" stroke="var(--ink)" strokeWidth="3.5" />
        {/* Sand Ripple */}
        <path d="M 20,32 Q 45,40 70,32" fill="none" stroke="var(--ink)" strokeWidth="1.5" opacity="0.35" />

        {/* Toy Sand Bucket */}
        <path d="M 28,18 L 34,42 L 52,42 L 58,18 Z" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2.5" />
        <path d="M 26,18 Q 43,12 60,18" fill="none" stroke="var(--ink)" strokeWidth="2.5" />

        {/* Toy Spade */}
        <path d="M 64,15 L 72,32 L 68,34 L 60,17 Z" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
        <polygon points="70,32 80,44 72,48 64,36" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
      </g>
    </svg>
  );
}
export default PlayScene;
