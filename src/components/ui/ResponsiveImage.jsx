import React from 'react';
import { Icon } from './Icon';

/**
 * ResponsiveImage with aspect ratio preservation, organic sticker shapes,
 * and warm illustrated SVG placeholders when src is null.
 * @param {{
 *   src?: string | null,
 *   alt?: string,
 *   ratio?: 'square' | 'portrait' | 'landscape' | 'wide',
 *   shape?: 'rect' | 'arch' | 'blob' | 'circle',
 *   tint?: 'yellow' | 'pink' | 'mint' | 'sky' | 'paper',
 *   label?: string,
 *   className?: string,
 *   style?: React.CSSProperties,
 *   imgStyle?: React.CSSProperties
 * }} props
 */
export function ResponsiveImage({
  src,
  alt = '',
  ratio = 'landscape',
  shape = 'rect',
  tint = 'yellow',
  label,
  className = '',
  style = {},
  imgStyle = {},
}) {
  const ratioMap = {
    square: '1 / 1',
    portrait: '4 / 5',
    '4:5': '4 / 5',
    '3:4': '3 / 4',
    landscape: '16 / 10',
    wide: '2 / 1',
  };

  const shapeStyles = {
    rect: { borderRadius: 'var(--r-md)' },
    arch: { borderRadius: '999px 999px var(--r-md) var(--r-md)' },
    blob: { borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%' },
    circle: { borderRadius: '50%' },
  };

  const tintColors = {
    yellow: 'var(--tint-yellow)',
    pink: 'var(--tint-pink)',
    mint: 'var(--tint-mint)',
    sky: 'var(--tint-sky)',
    paper: 'var(--paper)',
  };

  const aspectRatio = ratioMap[ratio] || '16 / 10';
  const selectedShapeStyle = shapeStyles[shape] || shapeStyles.rect;
  const bgColor = tintColors[tint] || 'var(--tint-yellow)';

  // If real src is provided
  if (src) {
    return (
      <div
        className={`responsive-image-container ${className}`}
        style={{
          aspectRatio,
          overflow: 'hidden',
          border: 'var(--outline)',
          boxShadow: 'var(--shadow-sticker)',
          position: 'relative',
          backgroundColor: bgColor,
          ...selectedShapeStyle,
          ...style,
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            ...imgStyle,
          }}
        />
        {label && (
          <span
            className="note"
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255, 247, 234, 0.95)',
              padding: '4px 14px',
              borderRadius: '999px',
              border: '1.5px solid var(--ink)',
              boxShadow: '1px 1px 0 var(--ink)',
              whiteSpace: 'nowrap',
              zIndex: 2,
            }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }

  // Placeholder with doodle pattern and friendly icon
  const placeholderIcons = {
    yellow: 'sun',
    pink: 'palette',
    mint: 'leaf',
    sky: 'cloud',
    paper: 'star',
  };

  const iconName = placeholderIcons[tint] || 'smile';

  return (
    <div
      className={`responsive-image-placeholder ${className}`}
      style={{
        aspectRatio,
        backgroundColor: bgColor,
        border: 'var(--outline)',
        boxShadow: 'var(--shadow-sticker)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        ...selectedShapeStyle,
        ...style,
      }}
      role="img"
      aria-label={alt || 'Playful illustration placeholder'}
    >
      <div style={{ transform: 'scale(1.4)', marginBottom: '0.75rem', zIndex: 1 }}>
        <Icon name={iconName} size={42} color="var(--ink)" />
      </div>

      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.875rem',
          fontWeight: 700,
          color: 'var(--ink)',
          textAlign: 'center',
          maxWidth: '24ch',
          zIndex: 1,
        }}
      >
        {alt || 'Wiggle moments'}
      </span>

      {label && (
        <span
          className="note"
          style={{
            position: 'absolute',
            bottom: '10px',
            backgroundColor: 'var(--paper)',
            padding: '2px 8px',
            borderRadius: 'var(--r-sm)',
            border: '1.5px solid var(--ink)',
            zIndex: 2,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
