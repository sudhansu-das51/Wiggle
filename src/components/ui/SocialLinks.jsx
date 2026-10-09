import React from 'react';
import { siteConfig } from '../../config/siteConfig';
import { Icon } from './Icon';

/**
 * Renders social media links from siteConfig as round sticker buttons.
 * Opens profile URLs in a new tab with rel="noopener noreferrer".
 * @param {{ className?: string, size?: number }} props
 */
export function SocialLinks({ className = '', size = 20 }) {
  const links = siteConfig?.social || [];

  return (
    <div
      className={`social-links ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      {links.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className="social-link-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--paper)',
            border: '2px solid var(--ink)',
            boxShadow: '2px 2px 0 var(--ink)',
            color: 'var(--ink)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <Icon name={item.id} size={size} color="var(--ink)" />
        </a>
      ))}
    </div>
  );
}
