import React, { useRef, useEffect } from 'react';
import { Mascot } from '../ui/Mascot';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Sticker-style side-view steam locomotive for the desktop train journey.
 * @param {{
 *   wheelAngle?: number,
 *   isCheering?: boolean,
 *   className?: string
 * }} props
 */
export function TrainSide({ wheelAngle = 0, isCheering = false, className = '' }) {
  const smokeRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Anime.js chimney steam smoke loop (paused off-screen / tab hidden)
  useEffect(() => {
    if (reducedMotion) return;
    const el = smokeRef.current;
    if (!el) return;

    // Check saveData
    if (typeof navigator !== 'undefined' && navigator.connection?.saveData) return;

    let observer;
    let animeInstance;

    import('animejs').then(({ animate }) => {
      const puffs = el.querySelectorAll('.programs-smoke-puff');
      if (!puffs.length) return;

      animeInstance = animate(puffs, {
        translateY: [-5, -65],
        translateX: [0, -42],
        scale: [0.6, 1.6],
        opacity: [0.9, 0],
        delay: (target, i) => i * 450,
        duration: 2100,
        loop: true,
        ease: 'outQuad',
      });

      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && document.visibilityState !== 'hidden') {
            animeInstance?.play();
          } else {
            animeInstance?.pause();
          }
        });
        observer.observe(el);
      }
    });

    const handleVisibility = () => {
      if (document.hidden) {
        animeInstance?.pause();
      } else {
        animeInstance?.play();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer?.disconnect();
      animeInstance?.pause();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [reducedMotion]);

  return (
    <div
      className={`programs-train-side ${className}`}
      style={{
        position: 'relative',
        width: '280px',
        height: '175px',
        userSelect: 'none',
      }}
      aria-hidden="true"
    >
      {/* Chimney Steam Smoke Puffs (Anime.js loop) */}
      <div ref={smokeRef} className="programs-train-smoke" aria-hidden="true">
        <span className="programs-smoke-puff puff-1" />
        <span className="programs-smoke-puff puff-2" />
        <span className="programs-smoke-puff puff-3" />
      </div>

      <svg
        viewBox="0 0 280 175"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', filter: 'drop-shadow(3px 4px 0 var(--ink))' }}
      >
        {/* Underframe / Chassis */}
        <rect
          x="15"
          y="120"
          width="240"
          height="12"
          rx="4"
          fill="var(--ink)"
        />

        {/* Cowcatcher / Front Pilot */}
        <polygon
          points="245,122 272,132 245,132"
          fill="var(--tangerine)"
          stroke="var(--ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <line x1="255" y1="125" x2="255" y2="132" stroke="var(--ink)" strokeWidth="2" />

        {/* Cab Body (Sky Blue) */}
        <path
          d="M25 45 C25 38 30 34 38 34 L105 34 C112 34 118 38 118 45 L118 120 L25 120 Z"
          fill="var(--sky)"
          stroke="var(--ink)"
          strokeWidth="2.75"
          strokeLinejoin="round"
        />

        {/* Cab Roof Sunshade */}
        <path
          d="M18 34 C18 30 26 26 72 26 C116 26 125 30 125 34 Z"
          fill="var(--tangerine)"
          stroke="var(--ink)"
          strokeWidth="2.75"
        />

        {/* Cab Window Opening (Warm Paper cutout) */}
        <rect
          x="38"
          y="46"
          width="64"
          height="50"
          rx="10"
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeWidth="2.75"
        />

        {/* Main Boiler Tank (Sunny Yellow) */}
        <rect
          x="118"
          y="56"
          width="116"
          height="64"
          rx="8"
          fill="var(--sunny)"
          stroke="var(--ink)"
          strokeWidth="2.75"
        />

        {/* Boiler Accent Bands */}
        <line x1="156" y1="56" x2="156" y2="120" stroke="var(--ink)" strokeWidth="2.5" />
        <line x1="194" y1="56" x2="194" y2="120" stroke="var(--ink)" strokeWidth="2.5" />

        {/* Steam Dome */}
        <path
          d="M136 56 C136 44 152 44 152 56 Z"
          fill="var(--tangerine)"
          stroke="var(--ink)"
          strokeWidth="2.5"
        />

        {/* Chimney Funnel */}
        <path
          d="M174 56 L171 30 L164 24 L192 24 L185 30 L182 56 Z"
          fill="var(--ink)"
          stroke="var(--ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Front Boiler Cap (Mint Arch) */}
        <path
          d="M234 58 C246 66 248 110 234 118 Z"
          fill="var(--mint)"
          stroke="var(--ink)"
          strokeWidth="2.75"
        />

        {/* Headlight Lantern */}
        <rect
          x="242"
          y="78"
          width="16"
          height="22"
          rx="4"
          fill="var(--sunny)"
          stroke="var(--ink)"
          strokeWidth="2.5"
        />
        <circle cx="258" cy="89" r="7" fill="#FFF8DB" stroke="var(--ink)" strokeWidth="2" />
        <polygon points="265,83 292,75 292,103 265,95" fill="rgba(255, 201, 60, 0.28)" />

        {/* 3 Perfectly Aligned Wheels (Center Y = 142, Radius = 20) */}
        {/* Wheel 1 (Back) */}
        <g transform={`rotate(${wheelAngle}, 60, 142)`}>
          <circle cx="60" cy="142" r="21" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
          <circle cx="60" cy="142" r="14" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.8" />
          <line x1="60" y1="122" x2="60" y2="162" stroke="var(--ink)" strokeWidth="1.8" />
          <line x1="40" y1="142" x2="80" y2="142" stroke="var(--ink)" strokeWidth="1.8" />
          <line x1="46" y1="128" x2="74" y2="156" stroke="var(--ink)" strokeWidth="1.8" />
          <line x1="74" y1="128" x2="46" y2="156" stroke="var(--ink)" strokeWidth="1.8" />
          <circle cx="60" cy="142" r="5" fill="var(--ink)" />
        </g>

        {/* Wheel 2 (Middle) */}
        <g transform={`rotate(${wheelAngle}, 125, 142)`}>
          <circle cx="125" cy="142" r="21" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
          <circle cx="125" cy="142" r="14" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.8" />
          <line x1="125" y1="122" x2="125" y2="162" stroke="var(--ink)" strokeWidth="1.8" />
          <line x1="105" y1="142" x2="145" y2="142" stroke="var(--ink)" strokeWidth="1.8" />
          <line x1="111" y1="128" x2="139" y2="156" stroke="var(--ink)" strokeWidth="1.8" />
          <line x1="139" y1="128" x2="111" y2="156" stroke="var(--ink)" strokeWidth="1.8" />
          <circle cx="125" cy="142" r="5" fill="var(--ink)" />
        </g>

        {/* Wheel 3 (Front) */}
        <g transform={`rotate(${wheelAngle}, 190, 142)`}>
          <circle cx="190" cy="142" r="21" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
          <circle cx="190" cy="142" r="14" fill="var(--sky)" stroke="var(--ink)" strokeWidth="1.8" />
          <line x1="190" y1="122" x2="190" y2="162" stroke="var(--ink)" strokeWidth="1.8" />
          <line x1="170" y1="142" x2="210" y2="142" stroke="var(--ink)" strokeWidth="1.8" />
          <line x1="176" y1="128" x2="204" y2="156" stroke="var(--ink)" strokeWidth="1.8" />
          <line x1="204" y1="128" x2="176" y2="156" stroke="var(--ink)" strokeWidth="1.8" />
          <circle cx="190" cy="142" r="5" fill="var(--ink)" />
        </g>

        {/* Connecting Drive Rod between wheels */}
        <line
          x1={60 + Math.cos(((wheelAngle + 90) * Math.PI) / 180) * 10}
          y1={142 + Math.sin(((wheelAngle + 90) * Math.PI) / 180) * 10}
          x2={190 + Math.cos(((wheelAngle + 90) * Math.PI) / 180) * 10}
          y2={142 + Math.sin(((wheelAngle + 90) * Math.PI) / 180) * 10}
          stroke="var(--ink)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Wig Mascot leaning out of the Engine Window */}
      <div
        style={{
          position: 'absolute',
          top: '42px',
          left: '42px',
          width: '52px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      >
        <Mascot mood={isCheering ? 'cheer' : 'wave'} size={46} />
      </div>
    </div>
  );
}

/**
 * Compact front-view steam locomotive for mobile & tablet vertical track.
 * @param {{
 *   className?: string
 * }} props
 */
export function TrainFront({ className = '' }) {
  const frontSmokeRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = frontSmokeRef.current;
    if (!el) return;

    if (typeof navigator !== 'undefined' && navigator.connection?.saveData) return;

    let observer;
    let animeInstance;

    import('animejs').then(({ animate }) => {
      const puff = el.querySelector('.programs-smoke-puff');
      if (!puff) return;

      animeInstance = animate(puff, {
        translateY: [-2, -32],
        scale: [0.65, 1.35],
        opacity: [0.85, 0],
        duration: 1800,
        loop: true,
        ease: 'outQuad',
      });

      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && document.visibilityState !== 'hidden') {
            animeInstance?.play();
          } else {
            animeInstance?.pause();
          }
        });
        observer.observe(el);
      }
    });

    return () => {
      observer?.disconnect();
      animeInstance?.pause();
    };
  }, [reducedMotion]);

  return (
    <div
      className={`programs-train-front ${className}`}
      style={{
        position: 'relative',
        width: '84px',
        height: '92px',
        userSelect: 'none',
      }}
      aria-hidden="true"
    >
      {/* Mini smoke puff (Anime.js loop) */}
      <div ref={frontSmokeRef} className="programs-train-front-smoke" aria-hidden="true">
        <span className="programs-smoke-puff puff-front" />
      </div>

      <svg
        viewBox="0 0 84 92"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(2px 3px 0 var(--ink))' }}
      >
        {/* Cab Roof Arch */}
        <path
          d="M10 26 C10 14, 25 10, 42 10 C59 10, 74 14, 74 26 L74 68 L10 68 Z"
          fill="var(--sky)"
          stroke="var(--ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Chimney Funnel Top */}
        <rect x="36" y="2" width="12" height="12" rx="2" fill="var(--ink)" stroke="var(--ink)" strokeWidth="2" />
        <ellipse cx="42" cy="2" rx="8" ry="3" fill="var(--tangerine)" stroke="var(--ink)" strokeWidth="1.5" />

        {/* Circular Boiler Front Face (Sunny Yellow) */}
        <circle cx="42" cy="46" r="26" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />

        {/* Central Lantern Headlight */}
        <circle cx="42" cy="40" r="12" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="42" cy="40" r="7" fill="var(--sunny)" />

        {/* Cheerful Locomotive Smile */}
        <path d="M34 56 Q42 64 50 56" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Rosy Cheeks */}
        <ellipse cx="30" cy="52" rx="3.5" ry="2" fill="var(--tint-pink)" />
        <ellipse cx="54" cy="52" rx="3.5" ry="2" fill="var(--tint-pink)" />

        {/* Front Cowcatcher / Buffer Beam */}
        <rect x="6" y="68" width="72" height="12" rx="3" fill="var(--tangerine)" stroke="var(--ink)" strokeWidth="2.5" />
        {/* Buffers */}
        <circle cx="16" cy="74" r="5" fill="var(--ink)" />
        <circle cx="68" cy="74" r="5" fill="var(--ink)" />

        {/* Front Wheel Hubs */}
        <rect x="2" y="78" width="14" height="10" rx="3" fill="var(--ink)" />
        <rect x="68" y="78" width="14" height="10" rx="3" fill="var(--ink)" />
      </svg>

      {/* Mini Wig Waving from Cab Top */}
      <div
        style={{
          position: 'absolute',
          top: '-16px',
          left: '52px',
          width: '28px',
          height: '28px',
          pointerEvents: 'none',
        }}
      >
        <Mascot mood="wave" size={28} />
      </div>
    </div>
  );
}
