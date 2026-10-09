import React, { useRef, useEffect } from 'react';
import { siteConfig } from '../../config/siteConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Icon } from '../ui/Icon';
import './FloatingDoodles.css';

/**
 * Floating drifting doodles (sun, cloud, star, rocket, etc.).
 * Drifts with smooth alternate loops using Anime.js or CSS fallback.
 * @param {{
 *   items?: Array<{ name: string, top?: string, left?: string, right?: string, bottom?: string, size?: number, rotate?: number }>,
 *   density?: 'low' | 'normal' | 'high',
 *   className?: string
 * }} props
 */
export function FloatingDoodles({ items, density = 'normal', className = '' }) {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const doodlesEnabled = siteConfig?.animations?.doodles !== false;

  const defaultItems = [
    { name: 'sun', top: '8%', right: '12%', size: 48, rotate: 12 },
    { name: 'cloud', top: '16%', left: '8%', size: 54, rotate: -6 },
    { name: 'star', top: '48%', left: '4%', size: 32, rotate: 15 },
    { name: 'star', top: '72%', right: '8%', size: 28, rotate: -10 },
  ];

  const activeItems = items || defaultItems;

  useEffect(() => {
    if (!doodlesEnabled || reducedMotion || !containerRef.current) return;

    let animations = [];

    import('animejs')
      .then(({ animate }) => {
        if (!containerRef.current) return;
        const elements = containerRef.current.querySelectorAll('.floating-doodle-item');

        elements.forEach((el, index) => {
          const duration = 6000 + (index * 1400) % 6000;
          const yDelta = 12 + (index * 4) % 16;
          const rotDelta = 6 + (index * 3) % 8;

          const a = animate(el, {
            translateY: [-yDelta, yDelta],
            rotate: [`-=${rotDelta}`, `+=${rotDelta}`],
            duration,
            ease: 'inOutSine',
            alternate: true,
            loop: true,
          });

          animations.push(a);
        });
      })
      .catch(() => {});

    return () => {
      animations.forEach((a) => a?.pause?.());
    };
  }, [doodlesEnabled, reducedMotion]);

  if (!doodlesEnabled) return null;

  return (
    <div
      ref={containerRef}
      className={`floating-doodles-container ${className}`}
      aria-hidden="true"
    >
      {activeItems.map((item, idx) => (
        <div
          key={idx}
          className="floating-doodle-item"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            transform: item.rotate ? `rotate(${item.rotate}deg)` : undefined,
          }}
        >
          <Icon name={item.name} size={item.size || 36} />
        </div>
      ))}
    </div>
  );
}
