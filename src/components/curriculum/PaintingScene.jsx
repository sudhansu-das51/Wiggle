import React from 'react';

/**
 * PaintingScene: Hand-crafted storybook preschool landscape painting
 * structured across the 4 seasonal academic terms:
 *
 * Term 1: Sky, clouds & cozy schoolhouse architecture
 * Term 2: Nature, leafy tree canopy, autumn apples & singing birds
 * Term 3: Rolling green meadows, winding pebble pathway, wildflowers & flying kite
 * Term 4: Radiant smiling sun, 3-color rainbow, celebration bunting & cheering Mascot Wig
 *
 * All line work rests gracefully in an ink sketch layer.
 */
export function PaintingScene({ activeTermIndex = 0, reducedMotion = false }) {
  const isTerm1 = reducedMotion || activeTermIndex >= 0;
  const isTerm2 = reducedMotion || activeTermIndex >= 1;
  const isTerm3 = reducedMotion || activeTermIndex >= 2;
  const isTerm4 = reducedMotion || activeTermIndex >= 3;

  return (
    <svg
      viewBox="0 0 800 520"
      className="cur-painting-svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id="cur-canvas-clip">
          <rect x="0" y="0" width="800" height="520" rx="16" />
        </clipPath>
      </defs>

      <g clipPath="url(#cur-canvas-clip)">
        {/* Paper Canvas Background */}
        <rect width="800" height="520" fill="var(--paper)" />

        {/* ==================================================================
            TERM 1 COLOR LAYER: Sky & Schoolhouse Architecture
            ================================================================== */}
        <g id="term-color-1" className={`cur-term-layer cur-term-layer-1 ${isTerm1 ? 'is-revealed' : ''}`}>
          {/* Gentle Sky */}
          <rect x="0" y="0" width="800" height="340" fill="var(--tint-sky)" />

          {/* Soft White Clouds */}
          <g className="cur-anim-cloud-1">
            <path
              d="M 230,80 A 25,25 0 0,1 265,55 A 35,35 0 0,1 315,65 A 25,25 0 0,1 330,95 A 20,20 0 0,1 300,105 L 245,105 A 20,20 0 0,1 230,80 Z"
              fill="#FFFFFF"
            />
          </g>
          <g className="cur-anim-cloud-2">
            <path
              d="M 560,95 A 20,20 0 0,1 590,75 A 30,30 0 0,1 635,85 A 22,22 0 0,1 645,110 L 575,110 A 18,18 0 0,1 560,95 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* Schoolhouse Building Body (Sunny Yellow) */}
          <rect x="355" y="210" width="150" height="98" fill="var(--sunny)" />
          {/* Cozy Roof (Bubblegum Pink) */}
          <polygon points="335,215 430,135 525,215" fill="var(--bubblegum)" />
          {/* Bell Tower Cupola */}
          <rect x="415" y="98" width="30" height="37" fill="var(--sunny)" />
          <polygon points="405,98 430,68 455,98" fill="var(--bubblegum)" />
          {/* Bell */}
          <ellipse cx="430" cy="116" rx="8" ry="9" fill="#FFF275" stroke="var(--ink)" strokeWidth="1.5" />

          {/* Arched Entrance Door */}
          <path d="M 410,308 L 410,258 C 410,244 450,244 450,258 L 450,308 Z" fill="var(--paper)" />
          {/* Door Knob */}
          <circle cx="442" cy="282" r="3" fill="var(--ink)" />

          {/* Warm Sunlit Window Panes */}
          <rect x="372" y="235" width="26" height="32" rx="4" fill="#FFF8DB" />
          <rect x="462" y="235" width="26" height="32" rx="4" fill="#FFF8DB" />

          {/* Wooden Picket Fence */}
          <rect x="290" y="286" width="280" height="18" fill="var(--paper)" rx="3" />
        </g>

        {/* ==================================================================
            TERM 2 COLOR LAYER: Nature, Leafy Tree, Foliage & Birds
            ================================================================== */}
        <g id="term-color-2" className={`cur-term-layer cur-term-layer-2 ${isTerm2 ? 'is-revealed' : ''}`}>
          {/* Tree Trunk & Branches */}
          <path
            d="M 125,440 C 135,360 120,290 100,240 C 140,250 160,240 150,330 C 160,370 170,440 170,440 Z"
            fill="#B87333"
          />
          {/* Branches */}
          <path d="M 135,300 Q 155,275 180,270" stroke="#B87333" strokeWidth="8" strokeLinecap="round" />

          {/* Leafy Tree Canopy (Layered preschool foliage blobs) */}
          <circle cx="95" cy="210" r="58" fill="var(--meadow)" />
          <circle cx="155" cy="180" r="62" fill="#4E9F3D" />
          <circle cx="120" cy="140" r="54" fill="var(--meadow)" />
          <circle cx="175" cy="150" r="48" fill="var(--tint-mint)" />
          <circle cx="85" cy="155" r="44" fill="#79D70F" />

          {/* Sweet Apples / Autumn Lanterns in Tree */}
          <circle cx="115" cy="180" r="6.5" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx="145" cy="150" r="6.5" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx="170" cy="190" r="6" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx="85" cy="195" r="5.5" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.5" />

          {/* Singing Birds in Sky */}
          <g className="cur-anim-bird-1">
            <path
              d="M 210,135 Q 220,125 230,135 Q 240,125 250,135"
              stroke="var(--ink)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
          <g className="cur-anim-bird-2">
            <path
              d="M 245,150 Q 252,142 260,150 Q 268,142 275,150"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>

        {/* ==================================================================
            TERM 3 COLOR LAYER: Rolling Meadows, Pathway, Flowers & Breeze
            ================================================================== */}
        <g id="term-color-3" className={`cur-term-layer cur-term-layer-3 ${isTerm3 ? 'is-revealed' : ''}`}>
          {/* Distant Rolling Hills */}
          <path
            d="M 0,310 Q 240,225 520,290 T 800,280 L 800,520 L 0,520 Z"
            fill="var(--tint-mint)"
          />

          {/* Main Lush Meadow Knoll */}
          <path
            d="M 0,355 Q 260,285 500,345 T 800,335 L 800,520 L 0,520 Z"
            fill="var(--meadow)"
          />

          {/* Foreground Lawn */}
          <path
            d="M 0,425 Q 320,365 800,430 L 800,520 L 0,520 Z"
            fill="#57A773"
          />

          {/* Winding Pebble Pathway */}
          <path
            d="M 450,520 C 420,460 380,410 420,350 C 450,305 440,295 430,285 L 470,285 C 480,300 490,325 460,375 C 430,425 470,470 515,520 Z"
            fill="var(--paper)"
          />

          {/* Stepping Stones on Pathway */}
          <ellipse cx="442" cy="320" rx="9" ry="5" fill="var(--tint-yellow)" stroke="var(--ink)" strokeWidth="1.5" />
          <ellipse cx="438" cy="360" rx="13" ry="7" fill="var(--tint-yellow)" stroke="var(--ink)" strokeWidth="1.5" />
          <ellipse cx="448" cy="410" rx="17" ry="8" fill="var(--tint-yellow)" stroke="var(--ink)" strokeWidth="1.8" />
          <ellipse cx="478" cy="465" rx="21" ry="10" fill="var(--tint-yellow)" stroke="var(--ink)" strokeWidth="2" />

          {/* Blooming Wildflowers */}
          <g transform="translate(60, 410)">
            <circle cx="0" cy="0" r="7.5" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="var(--sunny)" />
          </g>
          <g transform="translate(190, 440)">
            <circle cx="0" cy="0" r="8" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
            <circle cx="0" cy="0" r="3.5" fill="var(--bubblegum)" />
          </g>
          <g transform="translate(260, 395)">
            <circle cx="0" cy="0" r="7.5" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="var(--sunny)" />
          </g>
          <g transform="translate(560, 430)">
            <circle cx="0" cy="0" r="9" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2" />
            <circle cx="0" cy="0" r="4" fill="var(--sunny)" />
          </g>
          <g transform="translate(670, 390)">
            <circle cx="0" cy="0" r="8" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2" />
            <circle cx="0" cy="0" r="3.5" fill="var(--bubblegum)" />
          </g>
          <g transform="translate(730, 445)">
            <circle cx="0" cy="0" r="7.5" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="var(--sunny)" />
          </g>

          {/* Flying Diamond Kite with Ribbon Tail */}
          <g className="cur-anim-kite" transform="translate(670, 140) rotate(-15)">
            <polygon points="0,-28 20,0 0,28 -20,0" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2.5" />
            <line x1="0" y1="-28" x2="0" y2="28" stroke="var(--ink)" strokeWidth="1.5" />
            <line x1="-20" y1="0" x2="20" y2="0" stroke="var(--ink)" strokeWidth="1.5" />
            <path d="M 0,28 Q 10,48 5,68 T 12,95" stroke="var(--ink)" strokeWidth="1.5" fill="none" />
            <polygon points="5,48 12,44 10,54" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1" />
            <polygon points="5,68 -2,64 0,74" fill="var(--sky)" stroke="var(--ink)" strokeWidth="1" />
            <polygon points="12,88 18,84 17,93" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="1" />
          </g>
        </g>

        {/* ==================================================================
            TERM 4 COLOR LAYER: Sun, Rainbow, Party Bunting & Cheering Wig
            ================================================================== */}
        <g id="term-color-4" className={`cur-term-layer cur-term-layer-4 ${isTerm4 ? 'is-revealed' : ''}`}>
          {/* Radiant Smiling Morning Sun */}
          <g id="cur-sun-group" transform="translate(710, 75)">
            <g id="cur-sun-rays">
              <line x1="0" y1="-44" x2="0" y2="-56" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
              <line x1="31" y1="-31" x2="40" y2="-40" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
              <line x1="44" y1="0" x2="56" y2="0" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
              <line x1="31" y1="31" x2="40" y2="40" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
              <line x1="0" y1="44" x2="0" y2="56" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
              <line x1="-31" y1="31" x2="-40" y2="40" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
              <line x1="-44" y1="0" x2="-56" y2="0" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
              <line x1="-31" y1="-31" x2="-40" y2="-40" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
            </g>
            <circle cx="0" cy="0" r="36" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3.5" />
            <circle cx="-10" cy="-6" r="3" fill="var(--ink)" />
            <circle cx="10" cy="-6" r="3" fill="var(--ink)" />
            <path d="M -9,10 Q 0,18 9,10" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Rosy cheeks */}
            <circle cx="-16" cy="8" r="3.5" fill="var(--bubblegum)" />
            <circle cx="16" cy="8" r="3.5" fill="var(--bubblegum)" />
          </g>

          {/* 3-Color Rainbow Arc across the Sky */}
          <g id="cur-rainbow-group">
            <path d="M 120,320 C 120,60 520,60 520,320" stroke="var(--bubblegum)" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 130,320 C 130,78 510,78 510,320" stroke="var(--sunny)" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 140,320 C 140,96 500,96 500,320" stroke="var(--sky)" strokeWidth="10" fill="none" strokeLinecap="round" />
          </g>

          {/* Celebration Party Bunting Flags along the Fence */}
          <g id="cur-bunting-group">
            <polygon points="300,286 312,286 306,298" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="1" />
            <polygon points="320,286 332,286 326,298" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1" />
            <polygon points="340,286 352,286 346,298" fill="var(--sky)" stroke="var(--ink)" strokeWidth="1" />
            <polygon points="510,286 522,286 516,298" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1" />
            <polygon points="530,286 542,286 536,298" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="1" />
            <polygon points="550,286 562,286 556,298" fill="var(--sky)" stroke="var(--ink)" strokeWidth="1" />
          </g>

          {/* Cheerful Mascot Wig peaking and waving from the School Door */}
          <g id="cur-wig-gate" transform="translate(430, 262)">
            <path
              d="M 0,0 C -12,0 -16,14 -14,26 C -18,36 -12,48 0,48 C 12,48 18,36 14,26 C 16,14 12,0 0,0 Z"
              fill="var(--sunny)"
              stroke="var(--ink)"
              strokeWidth="2.8"
            />
            <circle cx="-5" cy="14" r="2.5" fill="var(--ink)" />
            <circle cx="5" cy="14" r="2.5" fill="var(--ink)" />
            <circle cx="-10" cy="20" r="3" fill="var(--bubblegum)" />
            <circle cx="10" cy="20" r="3" fill="var(--bubblegum)" />
            <path d="M -4,22 Q 0,27 4,22" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 14,18 Q 24,10 26,4" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        </g>

        {/* ==================================================================
            PERMANENT INK SKETCH LAYER: Crisp Outlines
            ================================================================== */}
        <g id="layer-sketch" pointerEvents="none">
          {/* Distant hill line */}
          <path d="M 0,310 Q 240,225 520,290 T 800,280" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Main green hill line */}
          <path d="M 0,355 Q 260,285 500,345 T 800,335" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Front lawn line */}
          <path d="M 0,425 Q 320,365 800,430" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Pathway borders */}
          <path d="M 450,520 C 420,460 380,410 420,350 C 450,305 440,295 430,285" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 515,520 C 470,470 430,425 460,375 C 490,325 480,300 470,285" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Tree trunk & branch outlines */}
          <path d="M 125,440 C 135,360 120,290 100,240 M 170,440 C 160,370 150,330 160,240 M 135,300 Q 155,275 180,270" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Tree canopy scalloped silhouette */}
          <path
            d="M 75,245 A 58,58 0 0,1 95,160 A 54,54 0 0,1 155,135 A 62,62 0 0,1 220,175 A 58,58 0 0,1 205,245 A 50,50 0 0,1 145,260 A 55,55 0 0,1 75,245 Z"
            stroke="var(--ink)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Schoolhouse body outline */}
          <rect x="355" y="210" width="150" height="98" stroke="var(--ink)" strokeWidth="3.5" fill="none" />
          {/* Roof outline */}
          <polygon points="335,215 430,135 525,215" stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round" fill="none" />
          {/* Bell tower outline */}
          <rect x="415" y="98" width="30" height="37" stroke="var(--ink)" strokeWidth="2.5" fill="none" />
          <polygon points="405,98 430,68 455,98" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
          {/* School door outline */}
          <path d="M 410,308 L 410,258 C 410,244 450,244 450,258 L 450,308 Z" stroke="var(--ink)" strokeWidth="3" fill="none" />

          {/* Paned window frames */}
          <rect x="372" y="235" width="26" height="32" rx="4" stroke="var(--ink)" strokeWidth="2.5" fill="none" />
          <line x1="385" y1="235" x2="385" y2="267" stroke="var(--ink)" strokeWidth="1.5" />
          <line x1="372" y1="251" x2="398" y2="251" stroke="var(--ink)" strokeWidth="1.5" />
          <rect x="462" y="235" width="26" height="32" rx="4" stroke="var(--ink)" strokeWidth="2.5" fill="none" />
          <line x1="475" y1="235" x2="475" y2="267" stroke="var(--ink)" strokeWidth="1.5" />
          <line x1="462" y1="251" x2="488" y2="251" stroke="var(--ink)" strokeWidth="1.5" />

          {/* White wooden fence posts */}
          <path
            d="M 290,290 L 570,290 M 300,278 L 300,304 M 320,278 L 320,304 M 340,278 L 340,304 M 520,278 L 520,304 M 540,278 L 540,304 M 560,278 L 560,304"
            stroke="var(--ink)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Clouds outlines */}
          <g className="cur-anim-cloud-1">
            <path
              d="M 230,80 A 25,25 0 0,1 265,55 A 35,35 0 0,1 315,65 A 25,25 0 0,1 330,95 A 20,20 0 0,1 300,105 L 245,105 A 20,20 0 0,1 230,80 Z"
              stroke="var(--ink)"
              strokeWidth="2.5"
              fill="none"
            />
          </g>
          <g className="cur-anim-cloud-2">
            <path
              d="M 560,95 A 20,20 0 0,1 590,75 A 30,30 0 0,1 635,85 A 22,22 0 0,1 645,110 L 575,110 A 18,18 0 0,1 560,95 Z"
              stroke="var(--ink)"
              strokeWidth="2.5"
              fill="none"
            />
          </g>
        </g>
      </g>

      {/* Chunky Outer Canvas Outline */}
      <rect
        x="2"
        y="2"
        width="796"
        height="516"
        rx="16"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="4"
        pointerEvents="none"
      />
    </svg>
  );
}

export default PaintingScene;
