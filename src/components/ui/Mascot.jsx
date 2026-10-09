import React from 'react';

/**
 * Wig - The friendly squiggle-bodied mascot.
 * @param {{
 *   mood?: 'wave' | 'peek' | 'cheer' | 'sleepy' | 'point',
 *   size?: number,
 *   className?: string
 * }} props
 */
export function Mascot({ mood = 'wave', size = 80, className = '' }) {
  // Variations based on mood
  const renderArms = () => {
    switch (mood) {
      case 'cheer':
        return (
          <>
            {/* Both arms raised up high */}
            <path d="M18 42 C12 30, 8 16, 16 12" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M52 42 C58 30, 62 16, 54 12" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="16" cy="12" r="3.5" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
            <circle cx="54" cy="12" r="3.5" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
          </>
        );
      case 'peek':
        return (
          <>
            {/* Paws resting on bottom / edge */}
            <path d="M22 56 C22 52, 28 52, 28 56" stroke="var(--ink)" strokeWidth="3" fill="var(--sunny)" />
            <path d="M42 56 C42 52, 48 52, 48 56" stroke="var(--ink)" strokeWidth="3" fill="var(--sunny)" />
          </>
        );
      case 'sleepy':
        return (
          <>
            {/* Arms folded / resting */}
            <path d="M22 45 C28 48, 42 48, 48 45" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        );
      case 'point':
        return (
          <>
            {/* One arm pointing right */}
            <path d="M20 44 C16 46, 14 50, 16 54" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M50 42 C56 40, 62 38, 66 38" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="66" cy="38" r="3" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
          </>
        );
      case 'wave':
      default:
        return (
          <>
            {/* Left arm waving */}
            <path d="M18 42 C12 34, 10 24, 14 18" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="14" cy="18" r="3.5" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
            {/* Right arm relaxed */}
            <path d="M52 44 C56 48, 58 52, 56 56" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        );
    }
  };

  const renderEyes = () => {
    if (mood === 'sleepy') {
      return (
        <>
          {/* Closed smiling curved eyes */}
          <path d="M26 30 Q30 33 34 30" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M38 30 Q42 33 46 30" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <text x="52" y="22" fill="var(--muted)" fontSize="10" fontFamily="var(--font-note)" fontWeight="bold">z</text>
          <text x="58" y="16" fill="var(--muted)" fontSize="12" fontFamily="var(--font-note)" fontWeight="bold">Z</text>
        </>
      );
    }

    return (
      <g className="mascot-eyes">
        {/* Left eye */}
        <circle cx="30" cy="28" r="4.5" fill="var(--ink)" className="mascot-eye mascot-eye--left" />
        <circle cx="28.5" cy="26.5" r="1.5" fill="#FFFFFF" />

        {/* Right eye */}
        <circle cx="42" cy="28" r="4.5" fill="var(--ink)" className="mascot-eye mascot-eye--right" />
        <circle cx="40.5" cy="26.5" r="1.5" fill="#FFFFFF" />
      </g>
    );
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 72 72"
      width={size}
      height={size}
      className={`wig-mascot wig-mascot--${mood} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="wig-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="2" stdDeviation="0" floodColor="var(--ink)" />
        </filter>
      </defs>

      {/* Main squiggly S-curve bean body */}
      <path
        d="M36 12 C48 12, 54 20, 52 32 C50 42, 56 50, 54 60 C52 66, 44 68, 36 68 C26 68, 18 66, 18 58 C18 48, 24 40, 22 28 C20 18, 26 12, 36 12 Z"
        fill="var(--sunny)"
        stroke="var(--ink)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Cheeks */}
      <ellipse cx="23" cy="34" rx="3.5" ry="2.5" fill="var(--bubblegum)" />
      <ellipse cx="49" cy="34" rx="3.5" ry="2.5" fill="var(--bubblegum)" />

      {/* Eyes */}
      {renderEyes()}

      {/* Tiny smile */}
      {mood === 'cheer' ? (
        <path d="M32 34 Q36 41 40 34 Z" fill="var(--tangerine)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
      ) : (
        <path d="M33 34 Q36 38 39 34" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
      )}

      {/* Arms */}
      {renderArms()}
    </svg>
  );
}
