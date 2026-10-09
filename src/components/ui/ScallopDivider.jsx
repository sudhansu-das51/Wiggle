import React from 'react';

/**
 * Playful scalloped (cloud/teeth) divider for section headers or footer top edge.
 * @param {{
 *   color?: string,
 *   bgColor?: string,
 *   flip?: boolean,
 *   height?: number,
 *   className?: string
 * }} props
 */
export function ScallopDivider({
  color = 'var(--ink)',
  bgColor = 'transparent',
  flip = false,
  height = 36,
  className = '',
}) {
  return (
    <div
      className={`scallop-divider-wrapper ${className}`}
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
        viewBox="0 0 1200 36"
        width="100%"
        height={height}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0 
             Q 50 36, 100 0 
             Q 150 36, 200 0 
             Q 250 36, 300 0 
             Q 350 36, 400 0 
             Q 450 36, 500 0 
             Q 550 36, 600 0 
             Q 650 36, 700 0 
             Q 750 36, 800 0 
             Q 850 36, 900 0 
             Q 950 36, 1000 0 
             Q 1050 36, 1100 0 
             Q 1150 36, 1200 0 
             L 1200 36 L 0 36 Z"
          fill={color}
        />
        <path
          d="M0 0 
             Q 50 36, 100 0 
             Q 150 36, 200 0 
             Q 250 36, 300 0 
             Q 350 36, 400 0 
             Q 450 36, 500 0 
             Q 550 36, 600 0 
             Q 650 36, 700 0 
             Q 750 36, 800 0 
             Q 850 36, 900 0 
             Q 950 36, 1000 0 
             Q 1050 36, 1100 0 
             Q 1150 36, 1200 0"
          stroke="var(--ink)"
          strokeWidth="2.5"
          fill="none"
        />
      </svg>
    </div>
  );
}
