import React from 'react';

/**
 * Small rotated sticker badge for a stat (value + label).
 * @param {{
 *   value: string,
 *   label: string,
 *   tint?: 'yellow' | 'pink' | 'mint' | 'sky' | 'paper',
 *   rotate?: number,
 *   className?: string
 * }} props
 */
export function StatSticker({
  value,
  label,
  tint = 'yellow',
  rotate = -3,
  className = '',
}) {
  const tintColors = {
    yellow: 'var(--tint-yellow)',
    pink: 'var(--tint-pink)',
    mint: 'var(--tint-mint)',
    sky: 'var(--tint-sky)',
    paper: 'var(--paper)',
  };

  return (
    <div
      className={`stat-sticker ${className}`}
      style={{
        backgroundColor: tintColors[tint] || 'var(--tint-yellow)',
        border: 'var(--outline)',
        borderRadius: 'var(--r-md)',
        boxShadow: 'var(--shadow-sticker)',
        transform: `rotate(${rotate}deg)`,
        padding: '0.875rem 1.25rem',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          fontWeight: 800,
          lineHeight: 1,
          color: 'var(--ink)',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--muted)',
          marginTop: '0.25rem',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
}
