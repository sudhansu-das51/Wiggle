import React, { useState } from 'react';
import { siteConfig } from '../../config/siteConfig';
import { SectionHeading } from '../ui/SectionHeading';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { Mascot } from '../ui/Mascot';
import { Icon } from '../ui/Icon';
import './program-detail.css';

/**
 * Section 7: Pack the Bag checklist with interactive SVG backpack.
 * @param {{
 *   program: {
 *     name: string,
 *     whatToBring?: string[],
 *     timings: string,
 *     groupSize?: string,
 *     daysPerWeek?: string,
 *     meals?: string
 *   }
 * }} props
 */
export function PackTheBag({ program }) {
  const brandName = siteConfig?.brand?.name || 'Wiggle';
  const items = program.whatToBring || [
    "Water bottle labeled with child's name",
    'Two complete spare sets of clothes',
    'Comfortable slip-on shoes',
    'Sun hat for garden playtime',
    'Small comfort item or cuddle blanket',
  ];

  // Local state for checked checklist items
  const [checkedState, setCheckedState] = useState(
    () => new Array(items.length).fill(false)
  );

  const toggleItem = (idx) => {
    setCheckedState((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const checkedCount = checkedState.filter(Boolean).length;
  const totalItems = items.length;
  const isFull = checkedCount === totalItems;
  const fillFraction = totalItems > 0 ? checkedCount / totalItems : 0;

  return (
    <section id="pack" className="section pd-pack-section" aria-label="Day one backpack checklist">
      <div className="container">
        <SectionHeading
          title="Pack the bag for day one"
          note="Tick items as you pack."
          align="center"
          wiggle
        />

        <div className="pd-pack-layout">
          {/* Left Column: Interactive Illustrated Backpack */}
          <div className="pd-backpack-col">
            <div className="pd-backpack-card sticker">
              {/* Mascot Reaction */}
              <div className="pd-backpack-mascot" aria-hidden="true">
                <Mascot mood={isFull ? 'cheer' : 'point'} size={88} />
              </div>

              {/* Backpack SVG */}
              <svg
                viewBox="0 0 280 320"
                className="pd-backpack-svg"
                width="240"
                height="275"
                aria-hidden="true"
              >
                <defs>
                  {/* Clip path matching bag inner body */}
                  <clipPath id="backpackInnerClip">
                    <path d="M48 90 C48 56, 75 46, 140 46 C205 46, 232 56, 232 90 L232 276 C232 290, 220 298, 200 298 L80 298 C60 298, 48 290, 48 276 Z" />
                  </clipPath>
                </defs>

                {/* Top Carrying Handle */}
                <path
                  d="M105 46 C105 22, 175 22, 175 46"
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* Backpack Main Body Outline */}
                <path
                  d="M48 90 C48 56, 75 46, 140 46 C205 46, 232 56, 232 90 L232 276 C232 290, 220 298, 200 298 L80 298 C60 298, 48 290, 48 276 Z"
                  fill="var(--paper)"
                  stroke="var(--ink)"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />

                {/* Rising Color Fill Layer */}
                <g clipPath="url(#backpackInnerClip)">
                  <rect
                    x="40"
                    y="40"
                    width="200"
                    height="270"
                    fill="var(--sunny)"
                    style={{
                      transformOrigin: 'bottom center',
                      transform: `scaleY(${fillFraction})`,
                      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  />

                  {/* Gentle liquid wave ripple line */}
                  <path
                    d="M40 200 Q90 190, 140 200 T240 200 L240 310 L40 310 Z"
                    fill="rgba(255, 122, 61, 0.15)"
                    style={{
                      transformOrigin: 'bottom center',
                      transform: `scaleY(${fillFraction})`,
                      transition: 'transform 0.4s ease',
                    }}
                  />
                </g>

                {/* Front Storage Pocket */}
                <rect
                  x="70"
                  y="180"
                  width="140"
                  height="95"
                  rx="14"
                  fill="var(--paper)"
                  stroke="var(--ink)"
                  strokeWidth="3"
                />
                {/* Pocket Stitch Line */}
                <rect
                  x="76"
                  y="186"
                  width="128"
                  height="83"
                  rx="10"
                  fill="none"
                  stroke="rgba(35, 42, 92, 0.2)"
                  strokeWidth="1.5"
                />
                {/* Pocket Zipper pull */}
                <circle cx="140" cy="195" r="4.5" fill="var(--tangerine)" stroke="var(--ink)" strokeWidth="2" />

                {/* Side Water Bottle Mesh Pocket */}
                <path
                  d="M232 165 C246 165, 246 250, 232 250"
                  fill="rgba(35, 42, 92, 0.08)"
                  stroke="var(--ink)"
                  strokeWidth="2.5"
                />

                {/* Top Flap (closes when all items are ticked) */}
                <g
                  style={{
                    transformOrigin: '140px 80px',
                    transform: isFull ? 'rotate(0deg)' : 'rotate(-18deg)',
                    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <path
                    d="M52 82 C52 75, 80 80, 140 80 C200 80, 228 75, 228 82 L215 130 C215 145, 65 145, 65 130 Z"
                    fill="var(--sky)"
                    stroke="var(--ink)"
                    strokeWidth="3"
                  />
                  {/* Flap Buckle Clasp */}
                  <rect
                    x="132"
                    y="125"
                    width="16"
                    height="18"
                    rx="3"
                    fill="var(--sunny)"
                    stroke="var(--ink)"
                    strokeWidth="2"
                  />
                </g>
              </svg>

              {/* Progress Count Badge & Celebration */}
              <div className="pd-backpack-status">
                <span className="pd-backpack-count chip">
                  {`${checkedCount} of ${totalItems} packed`}
                </span>
                {isFull && (
                  <p className="pd-backpack-celebrate note">
                    Bag packed. See you on day one!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Checklist & Good to Know Panel */}
          <div className="pd-checklist-col">
            <div className="pd-checklist-frame sticker">
              <h3 className="pd-checklist-title">
                Checklist for the first week
              </h3>

              <div className="pd-checklist-items" role="group" aria-label="Items to pack">
                {items.map((item, idx) => {
                  const isChecked = checkedState[idx];
                  const inputId = `pack-item-${idx}`;

                  return (
                    <label
                      key={idx}
                      htmlFor={inputId}
                      className={`pd-checklist-label ${isChecked ? 'is-checked' : ''}`}
                    >
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleItem(idx)}
                        className="pd-checklist-checkbox visually-hidden"
                      />
                      <span className="pd-checklist-box" aria-hidden="true">
                        {isChecked && (
                          <Icon name="check" size={16} color="var(--ink)" />
                        )}
                      </span>
                      <span className="pd-checklist-text">{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Good to Know Panel */}
            <div className="pd-good-to-know sticker">
              <h4 className="pd-good-to-know__title">
                Good to know
              </h4>

              <div className="pd-good-to-know__grid">
                <div>
                  <span className="pd-gtk-label note">Timings</span>
                  <p className="pd-gtk-val">{program.timings}</p>
                </div>
                <div>
                  <span className="pd-gtk-label note">Group size</span>
                  <p className="pd-gtk-val">{program.groupSize || 'Up to 12 children'}</p>
                </div>
                <div>
                  <span className="pd-gtk-label note">Days</span>
                  <p className="pd-gtk-val">{program.daysPerWeek || '5 days'}</p>
                </div>
                <div>
                  <span className="pd-gtk-label note">Meals</span>
                  <p className="pd-gtk-val">{program.meals || 'Snack & lunch'}</p>
                </div>
              </div>

              <div className="pd-good-to-know__footer">
                <p className="pd-gtk-fee-note">
                  Fees depend on the session. Ask us for the current fee sheet.
                </p>
                <WhatsAppButton
                  message={`Hi ${brandName}! Could you share the fee details for the ${program.name} program?`}
                  label="Ask on WhatsApp"
                  variant="ghost"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
