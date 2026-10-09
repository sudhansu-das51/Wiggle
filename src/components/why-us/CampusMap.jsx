import React, { useRef, useEffect } from 'react';
import { Icon } from '../ui/Icon';
import { Mascot } from '../ui/Mascot';

/**
 * CampusMap: Clean, minimal illustrated top-down campus map with a clear
 * 1-line directed route connecting stops 1 through 7, interactive hotspot buttons,
 * and animated walking Wig mascot.
 */
export function CampusMap({
  hotspots = [],
  activeId = 'gate',
  visitedIds = new Set(),
  onSelectHotspot,
  isTouring = false,
  wigPosition = { x: 50, y: 88, facingLeft: false, isCheering: false },
  isReduced = false,
}) {
  const mapContainerRef = useRef(null);

  // Active stop index (0 to 6)
  const activeIndex = hotspots.findIndex((h) => h.id === activeId);

  // IntersectionObserver to enable hotspot idle pulse only when in viewport
  useEffect(() => {
    if (isReduced || !mapContainerRef.current) return;

    const el = mapContainerRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('is-map-visible');
      } else {
        el.classList.remove('is-map-visible');
      }
    }, { threshold: 0.2 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [isReduced]);

  // 6 Directed Route Path Segments between the 7 stops (1 to 7)
  const routeSegments = [
    // 1 -> 2: Gate (400, 616) to Bus Bay (144, 574)
    { from: 0, to: 1, d: 'M 400,616 C 310,616 210,600 144,574', arrowX: 270, arrowY: 598, arrowAngle: 195 },
    // 2 -> 3: Bus Bay (144, 574) to Reception (400, 462)
    { from: 1, to: 2, d: 'M 144,574 C 180,510 300,480 400,462', arrowX: 280, arrowY: 495, arrowAngle: -25 },
    // 3 -> 4: Reception (400, 462) to Classrooms (192, 308)
    { from: 2, to: 3, d: 'M 400,462 C 320,440 220,380 192,308', arrowX: 290, arrowY: 415, arrowAngle: 215 },
    // 4 -> 5: Classrooms (192, 308) to Outdoor Play Yard (608, 308)
    { from: 3, to: 4, d: 'M 192,308 C 260,250 540,250 608,308', arrowX: 400, arrowY: 265, arrowAngle: 0 },
    // 5 -> 6: Outdoor Play Yard (608, 308) to Kitchen Pantry (224, 126)
    { from: 4, to: 5, d: 'M 608,308 C 550,210 340,210 224,126', arrowX: 410, arrowY: 210, arrowAngle: 180 },
    // 6 -> 7: Kitchen Pantry (224, 126) to Pediatric Care Room (560, 126)
    { from: 5, to: 6, d: 'M 224,126 C 330,95 450,95 560,126', arrowX: 390, arrowY: 105, arrowAngle: 5 },
  ];

  return (
    <div
      ref={mapContainerRef}
      className="why-campus-map-wrapper sticker"
      role="region"
      aria-label="Interactive campus map"
    >
      {/* Base Illustrated Campus Map SVG (800 x 700) */}
      <svg
        viewBox="0 0 800 700"
        className="why-map-svg"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="why-map-clip">
            <rect x="0" y="0" width="800" height="700" rx="16" />
          </clipPath>

          {/* Clean route arrow marker */}
          <marker
            id="tour-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--tangerine)" />
          </marker>
        </defs>

        <g clipPath="url(#why-map-clip)">
          {/* 1. Base Green Campus Lawn */}
          <rect width="800" height="700" fill="var(--tint-mint)" />

          {/* Gentle Grass texture tufts */}
          <path d="M 60,80 L 65,70 L 70,80 M 64,80 L 64,68" stroke="var(--meadow)" strokeWidth="2" strokeLinecap="round" />
          <path d="M 720,100 L 725,90 L 730,100 M 724,100 L 724,88" stroke="var(--meadow)" strokeWidth="2" strokeLinecap="round" />
          <path d="M 120,640 L 125,630 L 130,640" stroke="var(--meadow)" strokeWidth="2" strokeLinecap="round" />
          <path d="M 680,640 L 685,630 L 690,640" stroke="var(--meadow)" strokeWidth="2" strokeLinecap="round" />

          {/* 2. Soft, minimal walking paths (subtle light paving) */}
          <ellipse cx="400" cy="460" rx="90" ry="45" fill="rgba(255, 255, 255, 0.6)" stroke="rgba(35, 42, 92, 0.15)" strokeWidth="1.5" />
          <path d="M 370,680 L 370,550 Q 370,490 400,470 Q 430,490 430,550 L 430,680" fill="rgba(255, 255, 255, 0.55)" stroke="rgba(35, 42, 92, 0.15)" strokeWidth="1.5" />

          {/* 3. THE 1-LINE DIRECTED TOUR ROUTE (Stops 1 to 7) */}
          {/* Base Guide Track (Full Route track line) */}
          {routeSegments.map((seg, i) => (
            <path
              key={`base-${i}`}
              d={seg.d}
              fill="none"
              stroke="rgba(35, 42, 92, 0.18)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}

          {/* Active Highlighted Route (Lit up up to current stop) */}
          {routeSegments.map((seg, i) => {
            const isSegmentActive = activeIndex > i;
            const isCurrentSegment = activeIndex === i + 1;
            if (!isSegmentActive && !isCurrentSegment) return null;

            return (
              <path
                key={`active-${i}`}
                d={seg.d}
                fill="none"
                stroke="var(--tangerine)"
                strokeWidth="4"
                strokeLinecap="round"
                className="why-route-active-line"
              />
            );
          })}

          {/* Minimal Directional Chevron Arrows along the path */}
          {routeSegments.map((seg, i) => (
            <g
              key={`arrow-${i}`}
              transform={`translate(${seg.arrowX}, ${seg.arrowY}) rotate(${seg.arrowAngle})`}
              opacity={activeIndex >= i ? 1 : 0.45}
            >
              <polygon
                points="-5,-5 4,0 -5,5"
                fill={activeIndex >= i ? 'var(--tangerine)' : 'var(--ink)'}
              />
            </g>
          ))}

          {/* 4. CLEAN MINIMAL BUILDINGS (1-lined, human-crafted preschool stickers) */}

          {/* STOP 1: Main Entrance Gate (Bottom Center) */}
          <g transform="translate(290, 595)">
            <rect x="0" y="30" width="220" height="35" rx="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
            {/* Gate Pillars */}
            <rect x="25" y="5" width="26" height="60" rx="4" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
            <rect x="169" y="5" width="26" height="60" rx="4" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
            {/* Security Guard Cabin */}
            <rect x="58" y="10" width="34" height="40" rx="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
            <polygon points="54,10 75,-2 96,10" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2" />
            {/* Prominent Sticker Pill Signboard */}
            <g transform="translate(48, -12)">
              <rect x="0" y="0" width="124" height="24" rx="12" fill="#FFFFFF" stroke="var(--ink)" strokeWidth="2.5" />
              <text x="62" y="16" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display), system-ui, sans-serif" fontSize="11.5" fontWeight="800" letterSpacing="0.04em">
                1. MAIN GATE
              </text>
            </g>
          </g>

          {/* STOP 2: Bus Bay (Bottom Left) */}
          <g transform="translate(60, 520)">
            <rect x="0" y="0" width="168" height="98" rx="10" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
            {/* Prominent Sticker Pill Signboard */}
            <g transform="translate(24, -14)">
              <rect x="0" y="0" width="120" height="24" rx="12" fill="#FFFFFF" stroke="var(--ink)" strokeWidth="2.5" />
              <text x="60" y="16" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display), system-ui, sans-serif" fontSize="11.5" fontWeight="800" letterSpacing="0.04em">
                2. BUS BAY
              </text>
            </g>
            {/* Minimal Outlined School Bus */}
            <g transform="translate(24, 34)">
              <rect x="0" y="8" width="115" height="40" rx="8" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
              <polygon points="95,10 115,22 115,40 95,40" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
              <rect x="12" y="14" width="22" height="14" rx="3" fill="var(--tint-sky)" stroke="var(--ink)" strokeWidth="1.5" />
              <rect x="42" y="14" width="22" height="14" rx="3" fill="var(--tint-sky)" stroke="var(--ink)" strokeWidth="1.5" />
              <rect x="72" y="14" width="20" height="14" rx="3" fill="var(--tint-sky)" stroke="var(--ink)" strokeWidth="1.5" />
              <circle cx="28" cy="48" r="10" fill="var(--ink)" />
              <circle cx="28" cy="48" r="4" fill="var(--paper)" />
              <circle cx="92" cy="48" r="10" fill="var(--ink)" />
              <circle cx="92" cy="48" r="4" fill="var(--paper)" />
            </g>
          </g>

          {/* STOP 3: Reception & Welcome Foyer (Center) */}
          <g transform="translate(320, 395)">
            <rect x="0" y="0" width="160" height="92" rx="12" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
            {/* Friendly Glass Entrance Doors */}
            <rect x="52" y="44" width="56" height="48" rx="6" fill="var(--tint-sky)" stroke="var(--ink)" strokeWidth="2" />
            <line x1="80" y1="44" x2="80" y2="92" stroke="var(--ink)" strokeWidth="2" />
            {/* Prominent Sunny Welcome Banner */}
            <g transform="translate(18, -14)">
              <rect x="0" y="0" width="124" height="24" rx="12" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
              <text x="62" y="16" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display), system-ui, sans-serif" fontSize="11.5" fontWeight="800" letterSpacing="0.04em">
                3. RECEPTION
              </text>
            </g>
          </g>

          {/* STOP 4: Classrooms Wing (Mid-Left) */}
          <g transform="translate(80, 235)">
            <rect x="0" y="0" width="190" height="126" rx="12" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
            <polygon points="-8,0 95,-38 198,0" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Prominent Roof Banner above pin */}
            <g transform="translate(25, -52)">
              <rect x="0" y="0" width="140" height="24" rx="12" fill="#FFFFFF" stroke="var(--ink)" strokeWidth="2.5" />
              <text x="70" y="16" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display), system-ui, sans-serif" fontSize="11.5" fontWeight="800" letterSpacing="0.04em">
                4. CLASSROOMS
              </text>
            </g>
            {/* Big Sunny Windows */}
            <rect x="22" y="28" width="40" height="48" rx="6" fill="var(--tint-sky)" stroke="var(--ink)" strokeWidth="2" />
            <rect x="76" y="28" width="40" height="48" rx="6" fill="var(--tint-sky)" stroke="var(--ink)" strokeWidth="2" />
            <rect x="130" y="28" width="36" height="48" rx="6" fill="var(--tint-sky)" stroke="var(--ink)" strokeWidth="2" />
          </g>

          {/* STOP 5: Outdoor Play Yard & Sandpit (Mid-Right) */}
          <g transform="translate(525, 235)">
            <rect x="0" y="0" width="195" height="126" rx="16" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2.5" />
            {/* Prominent Top Banner */}
            <g transform="translate(35, -14)">
              <rect x="0" y="0" width="125" height="24" rx="12" fill="#FFFFFF" stroke="var(--ink)" strokeWidth="2.5" />
              <text x="62.5" y="16" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display), system-ui, sans-serif" fontSize="11.5" fontWeight="800" letterSpacing="0.04em">
                5. PLAY YARD
              </text>
            </g>
            {/* Beach Sandpit */}
            <ellipse cx="65" cy="62" rx="44" ry="30" fill="var(--tint-yellow)" stroke="var(--ink)" strokeWidth="2" />
            {/* Slide */}
            <path d="M 135,25 L 135,80 M 135,25 L 175,90" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 135,25 L 175,90" stroke="var(--sunny)" strokeWidth="6" strokeLinecap="round" />
            <circle cx="135" cy="25" r="5" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="1.5" />
          </g>

          {/* STOP 6: Kitchen Pantry (Top-Left) */}
          <g transform="translate(115, 55)">
            <rect x="0" y="0" width="165" height="100" rx="10" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
            <polygon points="-6,0 82,-28 171,0" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Chimney puff */}
            <rect x="125" y="-40" width="20" height="25" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2" />
            <circle cx="135" cy="-48" r="7" fill="white" stroke="var(--ink)" strokeWidth="1.5" />
            {/* Prominent Roof Signboard above pin */}
            <g transform="translate(27, -44)">
              <rect x="0" y="0" width="110" height="24" rx="12" fill="#FFFFFF" stroke="var(--ink)" strokeWidth="2.5" />
              <text x="55" y="16" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display), system-ui, sans-serif" fontSize="11.5" fontWeight="800" letterSpacing="0.04em">
                6. PANTRY
              </text>
            </g>
            {/* Door & Window */}
            <rect x="25" y="32" width="30" height="30" rx="4" fill="var(--tint-sky)" stroke="var(--ink)" strokeWidth="1.8" />
            <rect x="95" y="35" width="35" height="65" rx="4" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
          </g>

          {/* STOP 7: Pediatric Care Room (Top-Right) */}
          <g transform="translate(515, 55)">
            <rect x="0" y="0" width="165" height="100" rx="10" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
            <polygon points="-6,0 82,-28 171,0" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Prominent Roof Signboard above pin & cross */}
            <g transform="translate(18, -56)">
              <rect x="0" y="0" width="128" height="24" rx="12" fill="#FFFFFF" stroke="var(--ink)" strokeWidth="2.5" />
              <text x="64" y="16" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display), system-ui, sans-serif" fontSize="11.5" fontWeight="800" letterSpacing="0.04em">
                7. CARE ROOM
              </text>
            </g>
            {/* First-Aid Cross */}
            <rect x="76" y="-38" width="12" height="30" rx="2" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="1.8" />
            <rect x="67" y="-29" width="30" height="12" rx="2" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="1.8" />
            {/* Windows */}
            <rect x="28" y="36" width="35" height="35" rx="4" fill="var(--tint-sky)" stroke="var(--ink)" strokeWidth="1.8" />
            <rect x="98" y="36" width="35" height="35" rx="4" fill="var(--tint-sky)" stroke="var(--ink)" strokeWidth="1.8" />
          </g>

          {/* Minimal Trees Around Campus */}
          <circle cx="395" cy="95" r="30" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2.5" />
          <circle cx="390" cy="90" r="20" fill="var(--tint-mint)" />
          <circle cx="50" cy="400" r="28" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2.5" />
          <circle cx="750" cy="400" r="28" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2.5" />
        </g>

        {/* Outer Heavy Map Border */}
        <rect
          x="2"
          y="2"
          width="796"
          height="696"
          rx="16"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="3.5"
          pointerEvents="none"
        />
      </svg>

      {/* Interactive Hotspot Buttons Overlay */}
      <div className="why-hotspots-overlay" aria-label="Campus hotspots">
        {hotspots.map((spot, idx) => {
          const isActive = activeId === spot.id;
          const isVisited = visitedIds.has(spot.id);

          return (
            <button
              key={spot.id}
              type="button"
              className={`why-hotspot-btn ${isActive ? 'is-active' : ''} ${isVisited ? 'is-visited' : ''}`}
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
              }}
              onClick={() => onSelectHotspot(spot.id)}
              aria-label={`${spot.label}: ${spot.title}`}
              aria-pressed={isActive}
            >
              {/* Pulsing ring for unvisited hotspots */}
              <span className="why-hotspot-pulse" aria-hidden="true" />

              {/* Central Pin Icon */}
              <span className="why-hotspot-icon">
                <Icon name={spot.icon} size={20} color="var(--ink)" />
              </span>

              {/* Visited Check Badge */}
              {isVisited && (
                <span className="why-hotspot-check" aria-hidden="true">
                  ✓
                </span>
              )}

              {/* Numeric indicator tag (1 to 7) */}
              <span className="why-hotspot-num note">{idx + 1}</span>
            </button>
          );
        })}

        {/* Animated Walking Wig Mascot */}
        <div
          className={`why-map-mascot ${isTouring ? 'is-walking' : ''} ${wigPosition.isCheering ? 'is-cheering' : ''}`}
          style={{
            left: `${wigPosition.x}%`,
            top: `${wigPosition.y}%`,
            transform: `translate(-50%, -75%) scaleX(${wigPosition.facingLeft ? -1 : 1})`,
          }}
          aria-hidden="true"
        >
          <Mascot mood={wigPosition.isCheering ? 'cheer' : isTouring ? 'wave' : 'point'} size={54} />
          {wigPosition.isCheering && (
            <div className="why-mascot-speech-bubble note">
              Safe & sound!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CampusMap;
