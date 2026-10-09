import React from 'react';
import { Icon } from '../ui/Icon';

/**
 * Reusable Postcard container with perforated stamp corner,
 * circular wavy postmark, and address-style ruled lines.
 */
export function Postcard({
  title,
  iconName = 'mail',
  stampColor = 'var(--tint-yellow)',
  tag,
  tilt = 0,
  featured = false,
  children,
  className = '',
}) {
  return (
    <article
      className={`con-postcard ${featured ? 'con-postcard--featured' : ''} ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {/* Perforated Postage Stamp Corner */}
      <div className="con-postcard__stamp-wrap" aria-hidden="true">
        <div
          className="con-postcard__stamp"
          style={{ backgroundColor: stampColor }}
        >
          <Icon name={iconName} size={22} color="var(--ink)" />
        </div>

        {/* Wavy Ink Postmark */}
        <div className="con-postcard__postmark">
          <svg viewBox="0 0 70 70" width="70" height="70" fill="none">
            <circle cx="35" cy="35" r="30" stroke="var(--ink)" strokeWidth="1.5" opacity="0.5" />
            <text x="35" y="32" textAnchor="middle" fontSize="7" fontWeight="bold" fill="var(--ink)" opacity="0.7" fontFamily="var(--font-display)">
              WIGGLE
            </text>
            <text x="35" y="42" textAnchor="middle" fontSize="6" fill="var(--ink)" opacity="0.6" fontFamily="var(--font-display)">
              POST
            </text>
            <path d="M 62 25 Q 75 20 85 25" stroke="var(--ink)" strokeWidth="1.5" opacity="0.5" />
            <path d="M 62 35 Q 75 30 85 35" stroke="var(--ink)" strokeWidth="1.5" opacity="0.5" />
            <path d="M 62 45 Q 75 40 85 45" stroke="var(--ink)" strokeWidth="1.5" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Featured Tag */}
      {tag && <span className="con-postcard__tag">{tag}</span>}

      {/* Postcard Header */}
      <div className="con-postcard__header">
        <h3 className="con-postcard__title">{title}</h3>
      </div>

      {/* Postcard Body Content */}
      <div className="con-postcard__body">
        {children}
      </div>

      {/* Address-style ruled decorative lines */}
      <div className="con-postcard__ruled-lines" aria-hidden="true">
        <span className="con-postcard__line" />
        <span className="con-postcard__line" />
      </div>
    </article>
  );
}
