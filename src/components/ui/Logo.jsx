import React from 'react';
import { siteConfig } from '../../config/siteConfig';
import { Squiggle } from './Squiggle';

/**
 * Brand Logo component.
 * Renders logoSrc if present, otherwise playful wordmark with alternating letter tilt
 * and an ink squiggle underline.
 * @param {{ className?: string, size?: 'sm' | 'md' | 'lg' }} props
 */
export function Logo({ className = '', size = 'md' }) {
  const brand = siteConfig.brand;

  const heights = {
    sm: '38px',
    md: '48px',
    lg: '58px',
  };

  if (brand.logoSrc) {
    return (
      <img
        src={brand.logoSrc}
        alt={brand.name || 'Wiggle'}
        className={`brand-logo brand-logo--image ${className}`}
        style={{
          height: heights[size] || '48px',
          width: 'auto',
          maxHeight: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    );
  }

  // Alternating playful tilt angles for letters
  const tilts = [-3, 2, -2, 3, -3, 2, -1, 3];
  const nameLetters = (brand.name || 'wiggle').toLowerCase().split('');

  const fontSizes = {
    sm: '1.5rem',
    md: '2rem',
    lg: '2.5rem',
  };

  return (
    <div className={`brand-logo brand-logo--wordmark ${className}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: fontSizes[size] || '2rem',
          lineHeight: 1,
          color: 'var(--ink)',
          display: 'inline-flex',
          letterSpacing: '-0.02em',
        }}
      >
        {nameLetters.map((char, index) => (
          <span
            key={index}
            style={{
              display: 'inline-block',
              transform: `rotate(${tilts[index % tilts.length]}deg)`,
              transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            className="logo-letter"
          >
            {char}
          </span>
        ))}
      </span>
      <Squiggle width={size === 'sm' ? 64 : 88} height={10} color="var(--sunny)" />
    </div>
  );
}
