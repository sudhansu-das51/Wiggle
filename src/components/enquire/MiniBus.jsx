import React from 'react';

/**
 * Sticker-style school bus with Sunny (#FFC93C) & Sky (#5CC8FF) body,
 * thick ink outlines, round windows, and spinning wheels.
 * @param {{
 *   wheelRotation?: number,
 *   isFlipped?: boolean,
 *   className?: string
 * }} props
 */
export function MiniBus({ wheelRotation = 0, isFlipped = false, className = '' }) {
  return (
    <div
      className={`enq-minibus ${className}`}
      style={{
        transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)',
        transition: 'transform 0.15s ease',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 74 44"
        width="66"
        height="39"
        fill="none"
        className="enq-minibus__svg"
      >
        {/* Soft shadow */}
        <ellipse cx="37" cy="40" rx="30" ry="3.5" fill="rgba(35, 42, 92, 0.25)" />

        {/* Bus Upper Roof & Body */}
        <rect
          x="4"
          y="6"
          width="62"
          height="28"
          rx="7"
          fill="var(--sunny)"
          stroke="var(--ink)"
          strokeWidth="2.5"
        />

        {/* Lower Sky Stripe */}
        <path
          d="M 4 24 L 66 24 L 66 27 C 66 30.5 63 34 59 34 L 11 34 C 7 34 4 30.5 4 27 Z"
          fill="var(--sky)"
          stroke="var(--ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Windows */}
        <rect x="9" y="10" width="10" height="10" rx="2.5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.8" />
        <rect x="23" y="10" width="10" height="10" rx="2.5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.8" />
        <rect x="37" y="10" width="10" height="10" rx="2.5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.8" />
        {/* Windshield */}
        <path
          d="M 51 10 L 61 10 C 62 10 63 11 63 12 L 63 20 L 51 20 Z"
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeWidth="1.8"
        />

        {/* Happy little face in front window */}
        <circle cx="56" cy="14" r="1.2" fill="var(--ink)" />
        <path d="M 54 17 Q 56 19 58 17" stroke="var(--ink)" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Headlight */}
        <circle cx="65.5" cy="27" r="2" fill="#FFFFFF" stroke="var(--ink)" strokeWidth="1.5" />

        {/* Wheel 1 (Front/Right) */}
        <g
          transform={`translate(52, 34)`}
          style={{ transformOrigin: '0px 0px' }}
        >
          <g transform={`rotate(${wheelRotation})`}>
            <circle cx="0" cy="0" r="6" fill="var(--ink)" />
            <circle cx="0" cy="0" r="3" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.2" />
            <line x1="-3" y1="0" x2="3" y2="0" stroke="var(--ink)" strokeWidth="1.2" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="var(--ink)" strokeWidth="1.2" />
          </g>
        </g>

        {/* Wheel 2 (Rear/Left) */}
        <g
          transform={`translate(18, 34)`}
          style={{ transformOrigin: '0px 0px' }}
        >
          <g transform={`rotate(${wheelRotation})`}>
            <circle cx="0" cy="0" r="6" fill="var(--ink)" />
            <circle cx="0" cy="0" r="3" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.2" />
            <line x1="-3" y1="0" x2="3" y2="0" stroke="var(--ink)" strokeWidth="1.2" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="var(--ink)" strokeWidth="1.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default MiniBus;
