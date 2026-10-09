import React from 'react';

/**
 * Organic wave divider between sections.
 * @param {{
 *   color?: string,
 *   bgColor?: string,
 *   flip?: boolean,
 *   height?: number,
 *   className?: string
 * }} props
 */
export function WaveDivider({
  color = 'var(--paper)',
  bgColor = 'transparent',
  flip = false,
  height = 48,
  className = '',
}) {
  return (
    <div
      className={`wave-divider-wrapper ${className}`}
      style={{
        backgroundColor: bgColor,
        transform: flip ? 'scaleY(-1)' : undefined,
        lineHeight: 0,
        width: '100%',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 64"
        width="100%"
        height={height}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 32 C240 64, 480 0, 720 32 C960 64, 1200 0, 1440 32 L1440 64 L0 64 Z"
          fill={color}
        />
        <path
          d="M0 32 C240 64, 480 0, 720 32 C960 64, 1200 0, 1440 32"
          stroke="var(--ink)"
          strokeWidth="2.5"
          fill="none"
        />
      </svg>
    </div>
  );
}
