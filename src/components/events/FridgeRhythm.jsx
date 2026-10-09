import React, { useRef } from 'react';
import { animate } from 'animejs';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../ui/Icon';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { recurringEvents } from '../../data/events';

/**
 * Magnet SVG shape generator based on shape type.
 * Tangerine is strictly excluded to follow design system rules.
 */
function MagnetShape({ shape = 'circle', tint = 'pink', iconName = 'star' }) {
  const tintColorMap = {
    pink: 'var(--bubblegum)',
    yellow: 'var(--sunny)',
    mint: 'var(--meadow)',
    sky: 'var(--sky)',
  };
  const fillColor = tintColorMap[tint] || 'var(--sunny)';

  const renderShapeSvg = () => {
    switch (shape) {
      case 'star':
        return (
          <path
            d="M20 2 L25 13 L37 14 L28 23 L31 35 L20 29 L9 35 L12 23 L3 14 L15 13 Z"
            fill={fillColor}
            stroke="var(--ink)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        );
      case 'heart':
        return (
          <path
            d="M20 34 L18 32 C8 23 2 18 2 12 C2 7 6 3 11 3 C14 3 17 5 20 8 C23 5 26 3 29 3 C34 3 38 7 38 12 C38 18 32 23 22 32 Z"
            fill={fillColor}
            stroke="var(--ink)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        );
      case 'flower':
        return (
          <path
            d="M20 8 C20 4 24 4 24 8 C28 8 28 12 25 14 C29 16 27 20 24 20 C24 24 20 24 20 20 C16 20 16 16 19 14 C15 12 16 8 20 8 Z"
            fill={fillColor}
            stroke="var(--ink)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            transform="scale(1.4) translate(-4, -2)"
          />
        );
      case 'circle':
      default:
        return (
          <circle
            cx="20"
            cy="20"
            r="16"
            fill={fillColor}
            stroke="var(--ink)"
            strokeWidth="2.5"
          />
        );
    }
  };

  return (
    <div className="evt-fridge-magnet">
      <svg
        viewBox="0 0 40 40"
        width="44"
        height="44"
        className="evt-magnet-svg"
        aria-hidden="true"
      >
        {renderShapeSvg()}
      </svg>
      <div className="evt-magnet-icon" aria-hidden="true">
        <Icon name={iconName} size={18} color="var(--ink)" />
      </div>
    </div>
  );
}

/**
 * Single fridge note with attached magnet and Anime.js sway interactions.
 */
function FridgeNoteItem({ item, index, shape, baseRotation, reducedMotion }) {
  const noteRef = useRef(null);
  const magnetRef = useRef(null);

  const handleInteraction = () => {
    if (reducedMotion) return;

    if (noteRef.current) {
      animate(noteRef.current, {
        rotate: [baseRotation, baseRotation + 2.5, baseRotation - 2.5, baseRotation],
        duration: 600,
        ease: 'easeInOutQuad',
      });
    }

    if (magnetRef.current) {
      animate(magnetRef.current, {
        scale: [1, 1.2, 1],
        duration: 400,
        ease: 'easeOutBack',
      });
    }
  };

  return (
    <div
      ref={noteRef}
      className={`evt-fridge-note evt-fridge-note--${index}`}
      style={{ '--base-rot': `${baseRotation}deg`, transform: `rotate(${baseRotation}deg)` }}
      onMouseEnter={handleInteraction}
      onFocus={handleInteraction}
      onTouchStart={handleInteraction}
      tabIndex={0}
      role="article"
      aria-label={`${item.title}, ${item.when}`}
    >
      {/* Magnet pinned to the top center of the note */}
      <div className="evt-fridge-magnet-pin" ref={magnetRef}>
        <MagnetShape shape={shape} tint={item.tint} iconName={item.icon} />
      </div>

      <div className="evt-fridge-note__body">
        <span className="evt-fridge-note__when note">{item.when}</span>
        <h4 className="evt-fridge-note__title">{item.title}</h4>
        <p className="evt-fridge-note__text">{item.text}</p>
      </div>
    </div>
  );
}

/**
 * Section 4: Every month at Wiggle (Fridge door with recurring event notes and magnets).
 *
 * @param {{
 *   className?: string
 * }} props
 */
export function FridgeRhythm({ className = '' }) {
  const reducedMotion = useReducedMotion();

  const noteConfigs = [
    { shape: 'circle', baseRotation: -2.5 },
    { shape: 'star', baseRotation: 2 },
    { shape: 'heart', baseRotation: -1.5 },
    { shape: 'flower', baseRotation: 3 },
  ];

  return (
    <section className={`section section--yellow evt-fridge-section ${className}`}>
      <div className="container">
        <SectionHeading
          title="Every month at Wiggle"
          text="The regular stuff that makes the calendar fun."
          align="center"
        />

        {/* Fridge Door Container */}
        <div className="evt-fridge-door">
          {/* Top Freezer Divider Line */}
          <div className="evt-fridge-freezer-line" aria-hidden="true" />

          {/* Tall Chrome Fridge Handle on the side */}
          <div className="evt-fridge-handle" aria-hidden="true">
            <div className="evt-fridge-handle__bar" />
          </div>

          {/* Notes Scatter Grid */}
          <div className="evt-fridge-notes-grid">
            {recurringEvents.map((item, idx) => {
              const cfg = noteConfigs[idx % noteConfigs.length];
              return (
                <FridgeNoteItem
                  key={item.title}
                  item={item}
                  index={idx}
                  shape={cfg.shape}
                  baseRotation={cfg.baseRotation}
                  reducedMotion={reducedMotion}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FridgeRhythm;
