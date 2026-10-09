import React, { useRef, useEffect } from 'react';
import { animate } from 'animejs';

/**
 * LibraryScene: Bookshelves, soft bean bag cushions, cozy reading lamp.
 * Living detail: A book resting on the bean bag flaps its pages open and shut.
 */
export function LibraryScene({ isLit, isVisible, isReduced }) {
  const pageRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (isReduced || !pageRef.current) return;

    // Book page flipping animation
    const anim = animate(pageRef.current, {
      scaleX: [1, -0.85, 1],
      transformOrigin: '0% 50%',
      duration: 1300,
      ease: 'inOutQuad',
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

  return (
    <svg
      viewBox="0 0 500 360"
      className="fac-scene-svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <pattern id="lib-stripes" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="30" y2="30" stroke="var(--ink)" strokeWidth="0.8" opacity="0.06" />
        </pattern>
      </defs>

      {/* Cozy Sky Tint Wallpaper */}
      <rect x="0" y="0" width="500" height="290" fill="var(--tint-sky)" />
      <rect x="0" y="0" width="500" height="290" fill="url(#lib-stripes)" />

      {/* Carpet Floor */}
      <rect x="0" y="290" width="500" height="70" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
      <line x1="0" y1="290" x2="500" y2="290" stroke="var(--ink)" strokeWidth="3.5" />

      {/* Large Front-facing Picture Bookshelf (Left Wall) */}
      <g transform="translate(30, 60)">
        {/* Bookcase frame */}
        <rect x="0" y="0" width="160" height="230" rx="8" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3.5" />
        <line x1="0" y1="75" x2="160" y2="75" stroke="var(--ink)" strokeWidth="3" />
        <line x1="0" y1="150" x2="160" y2="150" stroke="var(--ink)" strokeWidth="3" />

        {/* Shelf Ledge Bars */}
        <line x1="10" y1="65" x2="150" y2="65" stroke="var(--ink)" strokeWidth="2.5" />
        <line x1="10" y1="140" x2="150" y2="140" stroke="var(--ink)" strokeWidth="2.5" />
        <line x1="10" y1="215" x2="150" y2="215" stroke="var(--ink)" strokeWidth="2.5" />

        {/* Shelf 1 books */}
        <rect x="18" y="15" width="38" height="50" rx="2" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2" />
        <rect x="62" y="18" width="42" height="47" rx="2" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2" />
        <rect x="110" y="12" width="35" height="53" rx="2" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" />

        {/* Shelf 2 books */}
        <rect x="22" y="90" width="35" height="50" rx="2" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="39" cy="115" r="10" fill="var(--sunny)" />
        <rect x="65" y="86" width="45" height="54" rx="2" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2" />
        <rect x="116" y="92" width="30" height="48" rx="2" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2" />

        {/* Shelf 3 books */}
        <rect x="18" y="165" width="40" height="50" rx="2" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" />
        <rect x="66" y="160" width="38" height="55" rx="2" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
        <rect x="112" y="168" width="34" height="47" rx="2" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2" />
      </g>

      {/* Cozy Reading Floor Lamp (Right) */}
      <g transform="translate(430, 80)">
        {/* Lamp Base */}
        <ellipse cx="0" cy="235" rx="24" ry="7" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3" />
        {/* Lamp Stem */}
        <path d="M 0,235 L 0,60 Q 0,20 -30,20" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        {/* Lamp Shade */}
        <polygon points="-48,22 -12,22 -2,54 -58,54" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="3" />
        {/* Warm Light Glow Cone */}
        <polygon points="-58,54 -2,54 50,230 -110,230" fill="var(--sunny)" opacity="0.12" />
      </g>

      {/* Fairy Lights Garland (Top) */}
      <g transform="translate(180, 25)">
        <path d="M 0,15 Q 70,35 140,20 Q 210,38 280,18" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="35" cy="23" r="5" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="85" cy="27" r="5" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="140" cy="20" r="5" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="195" cy="28" r="5" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="250" cy="22" r="5" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.5" />
      </g>

      {/* Soft Big Velvet Bean Bag (Center) */}
      <g transform="translate(230, 200)">
        {/* Bean bag body */}
        <path
          d="M 20,80 C 10,40 40,10 90,10 C 140,10 170,40 160,80 C 150,110 30,110 20,80 Z"
          fill="var(--meadow)"
          stroke="var(--ink)"
          strokeWidth="3.5"
        />
        {/* Cushion creases */}
        <path d="M 50,45 Q 90,65 130,45" fill="none" stroke="var(--ink)" strokeWidth="2.5" opacity="0.4" />
        <path d="M 60,65 Q 90,80 120,65" fill="none" stroke="var(--ink)" strokeWidth="2.5" opacity="0.4" />

        {/* Small Companion Pillow */}
        <ellipse cx="45" cy="75" rx="22" ry="15" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2.5" />

        {/* An Open Book Resting on the Bean Bag */}
        <g transform="translate(80, 52)">
          {/* Book Spine & Back Cover */}
          <path d="M 0,15 Q 15,22 32,15" fill="none" stroke="var(--ink)" strokeWidth="4" />
          {/* Left Page (Stationary) */}
          <polygon points="0,15 15,18 15,-6 0,-9" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
          {/* Right Page Base */}
          <polygon points="15,18 32,15 32,-9 15,-6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />

          {/* Living Detail: Flapping Page */}
          <g ref={pageRef} transform="translate(15, 0)">
            <polygon points="0,18 17,15 17,-9 0,-6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
            <line x1="3" y1="0" x2="14" y2="-2" stroke="var(--ink)" strokeWidth="1" opacity="0.35" />
            <line x1="3" y1="6" x2="14" y2="4" stroke="var(--ink)" strokeWidth="1" opacity="0.35" />
          </g>
        </g>
      </g>
    </svg>
  );
}
export default LibraryScene;
