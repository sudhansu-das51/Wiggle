import React, { useRef, useEffect } from 'react';
import { animate } from 'animejs';

/**
 * TransportScene: Wiggle school bus parked at the bay with a GPS marker pin.
 * Living detail: GPS pin pulses/bobs and the bus wheels nudge gently.
 */
export function TransportScene({ isLit, isVisible, isReduced }) {
  const pinRef = useRef(null);
  const busRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (isReduced || !pinRef.current || !busRef.current) return;

    // GPS Pin pulsing and bobbing
    const pinAnim = animate(pinRef.current, {
      scale: [1, 1.22, 1],
      translateY: [0, -8, 0],
      duration: 1500,
      ease: 'inOutSine',
      loop: true,
    });

    // Bus gentle idle nudge
    const busAnim = animate(busRef.current, {
      translateX: [0, 3, 0],
      duration: 1500,
      ease: 'inOutSine',
      loop: true,
    });

    animRef.current = {
      play: () => {
        pinAnim.play();
        busAnim.play();
      },
      pause: () => {
        pinAnim.pause();
        busAnim.pause();
      },
      revert: () => {
        if (pinAnim.revert) pinAnim.revert();
        else pinAnim.pause();
        if (busAnim.revert) busAnim.revert();
        else busAnim.pause();
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
      {/* Sky Backdrop */}
      <rect x="0" y="0" width="500" height="230" fill="var(--tint-mint)" />

      {/* Fluffy Clouds */}
      <g fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" opacity="0.95">
        <path d="M 60,40 Q 75,25 95,35 Q 115,20 135,40 Q 145,55 125,65 L 70,65 Q 55,60 60,40 Z" />
        <path d="M 380,30 Q 395,15 415,25 Q 435,10 455,30 Q 465,45 445,55 L 390,55 Q 375,50 380,30 Z" />
      </g>

      {/* Paved Parking Bay & Road Surface */}
      <rect x="0" y="230" width="500" height="130" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3.5" />
      {/* Road Markings */}
      <line x1="30" y1="285" x2="480" y2="285" stroke="var(--sunny)" strokeWidth="6" strokeLinecap="round" />

      {/* Bus Bay Signpost (Right) */}
      <g transform="translate(420, 140)">
        <line x1="0" y1="0" x2="0" y2="150" stroke="var(--ink)" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="0" cy="0" r="26" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3.5" />
        <text x="0" y="6" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display)" fontSize="18" fontWeight="bold">BUS</text>
      </g>

      {/* The School Bus Assembly */}
      <g ref={busRef} transform="translate(60, 115)">
        {/* Living Detail: Pulsing GPS Marker Pin */}
        <g ref={pinRef} transform="translate(160, -25)">
          {/* Location Pin Shape */}
          <path
            d="M 0,0 C -14,-14 -18,-28 -18,-38 C -18,-50 -10,-60 0,-60 C 10,-60 18,-50 18,-38 C 18,-28 14,-14 0,0 Z"
            fill="var(--bubblegum)"
            stroke="var(--ink)"
            strokeWidth="3.5"
          />
          <circle cx="0" cy="-38" r="7" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
          {/* Pulse ring underneath */}
          <ellipse cx="0" cy="8" rx="16" ry="5" fill="var(--ink)" opacity="0.15" />
        </g>

        {/* Bus Body */}
        {/* Yellow Chassis */}
        <rect x="0" y="30" width="310" height="115" rx="28" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="4" />

        {/* Bus Roof Bump */}
        <path d="M 40,30 L 270,30 L 255,18 L 55,18 Z" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3" />

        {/* Dark Tint Strip at base */}
        <rect x="0" y="115" width="310" height="30" rx="8" fill="var(--ink)" />

        {/* Windows */}
        {/* Windshield */}
        <path d="M 245,45 L 290,45 C 298,58 300,75 300,85 L 245,85 Z" fill="var(--sky)" stroke="var(--ink)" strokeWidth="3" />
        {/* Passenger Windows */}
        <rect x="25" y="45" width="45" height="40" rx="6" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2.5" />
        <rect x="80" y="45" width="45" height="40" rx="6" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2.5" />
        <rect x="135" y="45" width="45" height="40" rx="6" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2.5" />
        <rect x="190" y="45" width="45" height="40" rx="6" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2.5" />

        {/* Smile on Windshield or Bus front */}
        <circle cx="304" cy="112" r="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />

        {/* Wiggle Logo / Lettering on side */}
        <rect x="35" y="94" width="140" height="16" rx="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="105" y="106" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-note)" fontSize="11" fontWeight="bold">WIGGLE EXPRESS</text>

        {/* Front Bumper */}
        <rect x="295" y="125" width="22" height="16" rx="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />

        {/* Wheels */}
        {/* Left Wheel */}
        <g transform="translate(60, 145)">
          <circle cx="0" cy="0" r="26" fill="var(--ink)" />
          <circle cx="0" cy="0" r="14" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
          <circle cx="0" cy="0" r="4" fill="var(--sunny)" />
        </g>
        {/* Right Wheel */}
        <g transform="translate(235, 145)">
          <circle cx="0" cy="0" r="26" fill="var(--ink)" />
          <circle cx="0" cy="0" r="14" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
          <circle cx="0" cy="0" r="4" fill="var(--sunny)" />
        </g>
      </g>
    </svg>
  );
}
export default TransportScene;
