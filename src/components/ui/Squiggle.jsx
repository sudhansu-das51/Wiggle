import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Hand-drawn decorative ink squiggle.
 * Supports Anime.js draw-on effect when `draw` is true.
 * @param {{
 *   color?: string,
 *   width?: number | string,
 *   height?: number,
 *   className?: string,
 *   draw?: boolean,
 *   variant?: 'wave' | 'loop' | 'zigzag'
 * }} props
 */
export function Squiggle({
  color = 'var(--ink)',
  width = 120,
  height = 16,
  className = '',
  draw = false,
  variant = 'wave',
}) {
  const pathRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!draw || reducedMotion || !pathRef.current) return;

    let cleanup = () => {};
    // Dynamic import / async call for animejs v4
    import('animejs')
      .then(({ animate, svg }) => {
        if (!pathRef.current) return;
        if (svg && typeof svg.createDrawable === 'function') {
          const drawable = svg.createDrawable(pathRef.current);
          const anim = animate(drawable, {
            draw: ['0 0', '0 1'],
            duration: 800,
            ease: 'outQuad',
          });
          cleanup = () => anim?.pause?.();
        } else {
          // Fallback stroke-dasharray animation
          const length = pathRef.current.getTotalLength?.() || 150;
          pathRef.current.style.strokeDasharray = length;
          pathRef.current.style.strokeDashoffset = length;
          const anim = animate(pathRef.current, {
            strokeDashoffset: [length, 0],
            duration: 800,
            ease: 'outQuad',
          });
          cleanup = () => anim?.pause?.();
        }
      })
      .catch(() => {});

    return () => cleanup();
  }, [draw, reducedMotion]);

  let pathD = 'M2 8 Q 15 2, 30 8 T 60 8 T 90 8 T 120 8';
  if (variant === 'loop') {
    pathD = 'M2 10 Q 15 -2, 25 8 T 45 8 T 65 8 T 85 8 T 118 8';
  } else if (variant === 'zigzag') {
    pathD = 'M2 12 L 15 4 L 30 12 L 45 4 L 60 12 L 75 4 L 90 12 L 105 4 L 118 12';
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 16"
      width={width}
      height={height}
      className={`squiggle ${className}`}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={pathD}
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
