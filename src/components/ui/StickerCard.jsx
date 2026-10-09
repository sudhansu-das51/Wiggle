import React from 'react';

/**
 * Generic outlined sticker card with customizable shape, tint, and rotation.
 * @param {{
 *   tint?: 'yellow' | 'pink' | 'mint' | 'sky' | 'paper' | 'ink',
 *   rotate?: number,
 *   shape?: 'rect' | 'arch' | 'ticket' | 'bubble',
 *   className?: string,
 *   children?: React.ReactNode,
 *   style?: React.CSSProperties
 * }} props
 */
export function StickerCard({
  tint = 'paper',
  rotate = 0,
  shape = 'rect',
  className = '',
  children,
  style = {},
  ...rest
}) {
  const tintColors = {
    yellow: 'var(--tint-yellow)',
    pink: 'var(--tint-pink)',
    mint: 'var(--tint-mint)',
    sky: 'var(--tint-sky)',
    paper: 'var(--paper)',
    ink: 'var(--ink)',
  };

  const shapeStyles = {
    rect: { borderRadius: 'var(--radius-cards)' },
    arch: { borderRadius: '999px 999px var(--radius-cards) var(--radius-cards)' },
    ticket: { borderRadius: 'var(--radius-smallelements)' },
    bubble: { borderRadius: 'var(--radius-cards) var(--radius-cards) var(--radius-cards) var(--radius-smallelements)' },
  };

  const isInk = tint === 'ink';

  return (
    <div
      className={`sticker-card sticker-card--${shape} sticker-card--${tint} ${className}`}
      style={{
        backgroundColor: tintColors[tint] || 'var(--paper)',
        color: isInk ? 'var(--paper)' : 'var(--ink)',
        border: isInk ? '2.5px solid var(--paper)' : 'var(--outline)',
        boxShadow: isInk ? '4px 4px 0 var(--sunny)' : 'var(--shadow-sticker)',
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        padding: style.padding || (shape === 'arch' ? '2.5rem 1.5rem 1.75rem' : '1.75rem'),
        position: 'relative',
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
        ...shapeStyles[shape],
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
