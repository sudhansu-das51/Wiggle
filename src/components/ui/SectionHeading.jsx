import React from 'react';
import { WiggleText } from '../motion/WiggleText';

/**
 * Universal SectionHeading component.
 * @param {{
 *   title: string,
 *   text?: string,
 *   align?: 'left' | 'center' | 'right',
 *   note?: string,
 *   tone?: 'ink' | 'paper',
 *   wiggle?: boolean,
 *   className?: string
 * }} props
 */
export function SectionHeading({
  title,
  text,
  align = 'center',
  note,
  tone = 'ink',
  wiggle = false,
  className = '',
}) {
  const isCentered = align === 'center';
  const isRight = align === 'right';

  return (
    <div
      className={`section-heading section-heading--${align} section-heading--${tone} ${className}`}
      style={{
        textAlign: align,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCentered ? 'center' : isRight ? 'flex-end' : 'flex-start',
        gap: '0.75rem',
        marginBottom: '2.5rem',
      }}
    >
      {note && (
        <span
          className="note"
          style={{
            color: tone === 'paper' ? 'var(--sunny)' : 'var(--muted)',
            marginBottom: '-0.25rem',
          }}
        >
          {note}
        </span>
      )}

      <h2>
        {wiggle ? <WiggleText>{title}</WiggleText> : title}
      </h2>

      {text && (
        <p
          style={{
            fontSize: '1.125rem',
            color: tone === 'paper' ? 'rgba(255, 247, 234, 0.9)' : 'var(--muted)',
            maxWidth: '56ch',
            marginInline: isCentered ? 'auto' : undefined,
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
}
