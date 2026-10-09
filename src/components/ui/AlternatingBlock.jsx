import React from 'react';

/**
 * Two-column alternating layout block with image/illustration on one side
 * and content on the other.
 * @param {{
 *   reverse?: boolean,
 *   image: React.ReactNode,
 *   children: React.ReactNode,
 *   className?: string
 * }} props
 */
export function AlternatingBlock({
  reverse = false,
  image,
  children,
  className = '',
}) {
  return (
    <div
      className={`alternating-block ${reverse ? 'is-reversed' : ''} ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'center',
        gap: 'clamp(2rem, 5vw, 4rem)',
        marginBlock: '3rem',
      }}
    >
      <div
        className="alternating-block__media"
        style={{
          order: reverse ? 2 : 1,
        }}
      >
        {image}
      </div>

      <div
        className="alternating-block__content"
        style={{
          order: reverse ? 1 : 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {children}
      </div>
    </div>
  );
}
