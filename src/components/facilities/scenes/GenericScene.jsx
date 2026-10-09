import React, { useRef, useEffect } from 'react';
import { animate } from 'animejs';
import { Icon } from '../../ui/Icon';

/**
 * GenericScene: Fallback scene for any custom/unknown facility scene key.
 * Shows a large facility icon on a display shelf with floating shapes.
 * Living detail: Gentle bob of the central icon and floating shapes.
 */
export function GenericScene({ icon = 'star', tint = 'yellow', isLit, isVisible, isReduced }) {
  const bobRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (isReduced || !bobRef.current) return;

    // Gentle bobbing animation
    const anim = animate(bobRef.current, {
      translateY: [-7, 7],
      rotate: [-2, 2],
      duration: 1800,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });

    animRef.current = anim;
    if (!isLit || !isVisible) {
      anim.pause();
    }

    return () => {
      if (anim.revert) {
        anim.revert();
      } else {
        anim.pause();
      }
    };
  }, [isReduced, isLit, isVisible]);

  useEffect(() => {
    if (!animRef.current) return;
    if (isLit && isVisible && !isReduced) {
      animRef.current.play();
    } else {
      animRef.current.pause();
    }
  }, [isLit, isVisible, isReduced]);

  const tintMap = {
    yellow: 'var(--tint-yellow)',
    mint: 'var(--tint-mint)',
    pink: 'var(--tint-pink)',
    sky: 'var(--tint-sky)',
  };
  const wallTint = tintMap[tint] || 'var(--tint-yellow)';

  return (
    <svg
      viewBox="0 0 500 360"
      className="fac-scene-svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* Wall */}
      <rect x="0" y="0" width="500" height="290" fill={wallTint} />

      {/* Floor */}
      <rect x="0" y="290" width="500" height="70" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
      <line x1="0" y1="290" x2="500" y2="290" stroke="var(--ink)" strokeWidth="3.5" />

      {/* Window */}
      <g transform="translate(60, 50)">
        <rect x="0" y="0" width="85" height="110" rx="42" fill="var(--sky)" stroke="var(--ink)" strokeWidth="3" />
        <line x1="42.5" y1="0" x2="42.5" y2="110" stroke="var(--ink)" strokeWidth="2" />
        <line x1="0" y1="60" x2="85" y2="60" stroke="var(--ink)" strokeWidth="2" />
      </g>

      {/* Display Pedestal Shelf */}
      <g transform="translate(180, 240)">
        <rect x="0" y="0" width="140" height="50" rx="6" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3.5" />
        <line x1="10" y1="25" x2="130" y2="25" stroke="var(--ink)" strokeWidth="2" opacity="0.3" />
      </g>

      {/* Living Detail: Bobbing Central Icon and Stars */}
      <g ref={bobRef} transform="translate(250, 160)">
        {/* Glowing circular badge backing */}
        <circle cx="0" cy="0" r="48" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3.5" />

        {/* Embedded Icon */}
        <foreignObject x="-26" y="-26" width="52" height="52">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Icon name={icon} size={38} color="var(--ink)" />
          </div>
        </foreignObject>

        {/* Floating Stars / Shapes */}
        <path d="M -70,-30 L -66,-20 L -56,-20 L -64,-14 L -61,-4 L -70,-10 L -79,-4 L -76,-14 L -84,-20 L -74,-20 Z" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="75" cy="-25" r="8" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="60" cy="35" r="6" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="1.5" />
        <polygon points="-60,30 -50,45 -70,45" fill="var(--sky)" stroke="var(--ink)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
export default GenericScene;
