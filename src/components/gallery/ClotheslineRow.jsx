import React, { useRef, useEffect } from 'react';
import { HangingPhoto } from './HangingPhoto';
import { Mascot } from '../ui/Mascot';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * ClotheslineRow: Renders a single row of the clothesline wall.
 * Contains the sagging SVG rope (which draws on entry) and the photos hanging from it.
 */
export function ClotheslineRow({
  photos,
  rowIndex,
  isTopRow = false,
  onPhotoClick,
  onRegisterSway,
  onUnregisterSway,
  onSetSwayVisible,
}) {
  const rowRef = useRef(null);
  const ropePathRef = useRef(null);
  const wigRef = useRef(null);
  const isReduced = useReducedMotion();

  // 1. Entrance animation: rope draws, then photos swing in
  useGSAP(() => {
    if (isReduced || !rowRef.current || !ropePathRef.current) return;

    const rope = ropePathRef.current;
    const rect = rope.getBoundingClientRect();
    const screenLength = Math.ceil((rect.width || 1200) * 1.15);

    rope.style.strokeDasharray = `${screenLength} ${screenLength}`;
    rope.style.strokeDashoffset = `${screenLength}`;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rowRef.current,
        start: 'top 85%',
        once: true,
      },
    });

    // 1. Rope draws on from left to right across full width to right rod
    tl.to(rope, {
      strokeDashoffset: 0,
      duration: 0.65,
      ease: 'power2.out',
      onComplete: () => {
        // Clear dasharray so rope is 100% solid and never clipped at right rod on any viewport
        rope.style.strokeDasharray = 'none';
        rope.style.strokeDashoffset = '0';
      },
    });

    // 2. Photos swing in one by one
    const photoOuters = rowRef.current.querySelectorAll('.gal-photo-outer');
    if (photoOuters.length > 0) {
      tl.fromTo(
        photoOuters,
        (i) => ({
          opacity: 0,
          rotation: i % 2 === 0 ? 14 : -14,
          transformOrigin: '50% 0',
        }),
        {
          opacity: 1,
          rotation: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'elastic.out(1, 0.4)',
        },
        '-=0.2'
      );
    }
  }, { scope: rowRef, dependencies: [isReduced, photos] });

  // 2. Register Wig mascot on top rope for scroll sway
  useEffect(() => {
    if (isTopRow && wigRef.current && onRegisterSway) {
      onRegisterSway('wig-clothesline', wigRef.current, { multiplier: 1.1 });
    }
    return () => {
      if (isTopRow && onUnregisterSway) {
        onUnregisterSway('wig-clothesline');
      }
    };
  }, [isTopRow, onRegisterSway, onUnregisterSway]);

  return (
    <div
      ref={rowRef}
      className="gal-clothesline-row"
      data-row-index={rowIndex}
    >
      {/* Sagging Rope SVG spanning from left pole to right pole */}
      <div className="gal-rope-svg-wrap" aria-hidden="true">
        <svg
          viewBox="0 0 1000 48"
          preserveAspectRatio="none"
          className="gal-sagging-rope"
        >
          <path
            ref={ropePathRef}
            d="M 0 14 Q 500 38 1000 14"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="3.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Rope End Knots tied firmly to left and right rods */}
        <div className="gal-rope-knot knot-left">
          <span className="gal-knot-wrap" />
          <span className="gal-knot-tail" />
        </div>
        <div className="gal-rope-knot knot-right">
          <span className="gal-knot-wrap" />
          <span className="gal-knot-tail" />
        </div>

        {/* Mascot perched on topmost rope on desktop/tablet */}
        {isTopRow && (
          <div
            ref={wigRef}
            className="gal-rope-mascot"
            aria-hidden="true"
          >
            <Mascot mood="peek" size={54} />
          </div>
        )}
      </div>

      {/* Row Photos List */}
      <ul className="gal-photos-list" role="list">
        {photos.map((photo, pIdx) => (
          <HangingPhoto
            key={photo.id}
            photo={photo}
            index={rowIndex * 4 + pIdx}
            colIndex={pIdx}
            totalCols={photos.length}
            onClick={onPhotoClick}
            onRegisterSway={onRegisterSway}
            onUnregisterSway={onUnregisterSway}
            onSetSwayVisible={onSetSwayVisible}
          />
        ))}
      </ul>
    </div>
  );
}

export default ClotheslineRow;
