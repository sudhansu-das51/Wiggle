import React, { useRef, useEffect } from 'react';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { animate } from 'animejs';

const RESTING_TILTS = [-2.8, 2.5, -1.8, 3.2, -2.2, 1.8, -3.2, 2.0];

/**
 * Computes exact vertical offset for the photo card so that:
 * 1. The clothespin's rope groove (y=11 inside a 32px peg at top: -18px, i.e. 7px above card)
 *    aligns with mathematical precision to the rope's quadratic Bezier curve:
 *    M 0 14 Q 500 38 1000 14 -> ropeY(t) = 14 + 48 * t * (1 - t)
 * 2. The rope runs strictly 7px ABOVE the photo card, passing through the clip groove.
 * 3. The clip jaws clamp 12px over the card's top margin.
 */
function getCardDropOffset(colIndex = 0, totalCols = 4) {
  const cols = Math.max(totalCols, 1);
  const t = (colIndex + 0.5) / cols;
  const ropeY = 14 + 48 * t * (1 - t);
  // cardTop = ropeY + 7px
  return Math.round(ropeY + 7);
}

/**
 * HangingPhoto: A polaroid photo pegged to a clothesline.
 * Uses two nested wrappers:
 * - outer: handles entrance/exit transitions and resting tilt
 * - inner: handles scroll sway velocity rotation
 */
export function HangingPhoto({
  photo,
  index,
  colIndex = 0,
  totalCols = 4,
  onClick,
  onRegisterSway,
  onUnregisterSway,
  onSetSwayVisible,
}) {
  const isReduced = useReducedMotion();
  const innerRef = useRef(null);
  const pegRef = useRef(null);
  const photoRef = useRef(null);

  const restingTilt = RESTING_TILTS[index % RESTING_TILTS.length];
  const dropOffset = getCardDropOffset(colIndex, totalCols);

  // 1. Register inner element for scroll sway
  useEffect(() => {
    if (onRegisterSway && innerRef.current) {
      onRegisterSway(photo.id, innerRef.current);
    }
    return () => {
      if (onUnregisterSway) {
        onUnregisterSway(photo.id);
      }
    };
  }, [photo.id, onRegisterSway, onUnregisterSway]);

  // 2. Track element visibility for sway efficiency
  useEffect(() => {
    const el = photoRef.current;
    if (!el || !onSetSwayVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        onSetSwayVisible(photo.id, entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [photo.id, onSetSwayVisible]);

  // 3. Peg micro-interaction wiggle on hover/focus
  const handleInteraction = () => {
    if (isReduced || !pegRef.current) return;
    animate(pegRef.current, {
      rotate: [-8, 8, -4, 4, 0],
      duration: 350,
      ease: 'inOutSine',
    });
  };

  return (
    <li
      ref={photoRef}
      className="gal-hanging-photo"
      style={{
        paddingTop: `${dropOffset}px`,
        '--resting-tilt': `${restingTilt}deg`,
      }}
    >
      {/* Outer wrapper: enters, exits, and holds resting tilt */}
      <div className="gal-photo-outer">
        {/* Inner wrapper: driven by scroll sway quickTo */}
        <div ref={innerRef} className="gal-photo-sway-inner">
          {/* Wooden Clothes Peg clamping onto the rope and photo */}
          <div
            ref={pegRef}
            className="gal-clothes-peg"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 16 32"
              width="16"
              height="32"
              className="gal-peg-svg"
            >
              {/* Clothespin shadow/outline base */}
              <rect x="2" y="1" width="12" height="30" rx="3" fill="var(--ink)" />
              {/* Wooden pincher body (Warm Sunny) */}
              <rect x="3" y="1.5" width="10" height="29" rx="2" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.5" />
              {/* Top squeeze split line */}
              <line x1="8" y1="2" x2="8" y2="7" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
              {/* Rope clamping groove hole where rope passes through */}
              <circle cx="8" cy="11" r="3.2" fill="#FFE57F" stroke="var(--ink)" strokeWidth="1.5" />
              {/* Metal torsion spring wire */}
              <rect x="4.5" y="14.5" width="7" height="4" rx="1.5" fill="#E2E8F0" stroke="var(--ink)" strokeWidth="1.3" />
              <circle cx="8" cy="16.5" r="1.1" fill="var(--ink)" />
              {/* Lower clamping jaws split line gripping card */}
              <line x1="8" y1="20" x2="8" y2="29" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Real Button Opening Projector Viewer */}
          <button
            type="button"
            className="gal-photo-card sticker"
            onClick={() => onClick(photo)}
            onMouseEnter={handleInteraction}
            onFocus={handleInteraction}
            aria-label={`Open photo: ${photo.title}, ${photo.category}`}
          >
            {/* Image Frame */}
            <div className="gal-photo-image-frame">
              <ResponsiveImage
                src={photo.image}
                alt={photo.alt}
                ratio={photo.ratio || 'landscape'}
                tint={photo.tint || 'yellow'}
                className="gal-polaroid-img"
              />
            </div>

            {/* Handwritten Caption & Title */}
            <div className="gal-photo-caption-wrap">
              <p className="gal-photo-caption note">
                "{photo.caption}"
              </p>
              <span className="gal-photo-title">
                {photo.title}
              </span>
            </div>
          </button>
        </div>
      </div>
    </li>
  );
}

export default HangingPhoto;
