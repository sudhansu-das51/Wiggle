import React from 'react';
import { Button } from './Button';
import { WhatsAppButton } from './WhatsAppButton';
import { Mascot } from './Mascot';

/**
 * Reusable CTA banner with Sunny yellow background, cheering Wig mascot,
 * and primary + WhatsApp action buttons.
 * @param {{
 *   title?: string,
 *   text?: string,
 *   message?: string,
 *   primaryTo?: string,
 *   primaryLabel?: string,
 *   className?: string
 * }} props
 */
export function CtaBanner({
  title = 'Come and see Wiggle in action',
  text = 'Book a school visit and meet the teachers, or message us on WhatsApp and we will reply the same day.',
  message,
  primaryTo = '/enquire',
  primaryLabel = 'Book a school visit',
  className = '',
}) {
  return (
    <div
      className={`cta-banner ${className}`}
      style={{
        backgroundColor: 'var(--sunny)',
        border: 'var(--outline)',
        borderRadius: 'var(--r-lg)',
        boxShadow: 'var(--shadow-sticker)',
        padding: 'clamp(2.5rem, 5vw, 4rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          alignItems: 'center',
          gap: '2.5rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2
            style={{
              color: 'var(--ink)',
              fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)',
              lineHeight: 1.1,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              color: 'var(--ink)',
              fontSize: '1.125rem',
              maxWidth: '52ch',
            }}
          >
            {text}
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginTop: '0.75rem',
            }}
          >
            <Button variant="primary" to={primaryTo}>
              {primaryLabel}
            </Button>
            <WhatsAppButton message={message} variant="ghost" />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Mascot mood="cheer" size={120} />
        </div>
      </div>

      {/* Deep blue bold half-circular star ornament at top-right */}
      <div
        className="cta-banner__star-ornament"
        style={{
          position: 'absolute',
          top: '-45px',
          right: '-45px',
          width: '290px',
          height: '290px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 280 280" width="100%" height="100%" fill="none">
          {/* Outer deep blue bold half-circular base */}
          <circle
            cx="250"
            cy="30"
            r="190"
            fill="#1E2756"
            stroke="#151B3D"
            strokeWidth="4"
          />
          {/* Inner concentric accent ring */}
          <circle
            cx="250"
            cy="30"
            r="165"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2.5"
          />

          {/* Bold 8-point Sunburst / Star radiating into the banner */}
          <g transform="translate(150, 130)">
            <path
              d="M 0,-48 Q 7,-16 28,-28 Q 16,-7 48,0 Q 16,7 28,28 Q 7,16 0,48 Q -7,16 -28,28 Q -16,7 -48,0 Q -16,-7 -28,-28 Q -7,-16 0,-48 Z"
              fill="#FFDE59"
              stroke="#151B3D"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Center Core Dot */}
            <circle cx="0" cy="0" r="10" fill="#FFFFFF" stroke="#151B3D" strokeWidth="2.5" />
          </g>

          {/* Accent Playful Sparkle Stars around the half circle */}
          <g transform="translate(85, 68)">
            <path
              d="M 0,-18 Q 3,-6 11,-11 Q 6,-3 18,0 Q 6,3 11,11 Q 3,6 0,18 Q -3,6 -11,11 Q -6,3 -18,0 Q -6,-3 -11,-11 Q -3,-6 0,-18 Z"
              fill="#FFFFFF"
              stroke="#151B3D"
              strokeWidth="2"
            />
          </g>
          <g transform="translate(180, 200)">
            <path
              d="M 0,-14 Q 2,-4 9,-9 Q 4,-2 14,0 Q 4,2 9,9 Q 2,4 0,14 Q -2,4 -9,9 Q -4,2 -14,0 Q -4,-2 -9,-9 Q -2,-4 0,-14 Z"
              fill="#FFDE59"
              stroke="#151B3D"
              strokeWidth="2"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
