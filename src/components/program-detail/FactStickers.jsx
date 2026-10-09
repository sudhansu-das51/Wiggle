import React from 'react';
import { PageHero } from '../layout/PageHero';
import { Icon } from '../ui/Icon';
import './program-detail.css';

/**
 * Section 1: Program Hero with large icon, breadcrumbs, and 5 overlapping fact stickers.
 * @param {{
 *   program: {
 *     slug: string,
 *     name: string,
 *     ageRange: string,
 *     timings: string,
 *     groupSize?: string,
 *     daysPerWeek?: string,
 *     meals?: string,
 *     tint: string,
 *     tagline: string,
 *     icon?: string
 *   }
 * }} props
 */
export function FactStickers({ program }) {
  const stickers = [
    {
      label: 'Age',
      value: program.ageRange,
      icon: 'calendar',
      rot: -2.5,
      tint: 'paper',
    },
    {
      label: 'Timings',
      value: program.timings,
      icon: 'clock',
      rot: 1.8,
      tint: 'paper',
    },
    {
      label: 'Group size',
      value: program.groupSize || 'Up to 12 children',
      icon: 'users',
      rot: -1.5,
      tint: 'paper',
    },
    {
      label: 'Days',
      value: program.daysPerWeek || '5 days',
      icon: 'sun',
      rot: 2.2,
      tint: 'paper',
    },
    {
      label: 'Meals',
      value: program.meals || 'Snack & lunch',
      icon: 'apple',
      rot: -2.0,
      tint: 'paper',
    },
  ];

  const crumbs = [
    { label: 'Home', path: '/' },
    { label: 'Programs', path: '/programs' },
    { label: program.name },
  ];

  return (
    <div className="pd-hero-wrapper">
      {/* Page Hero */}
      <PageHero
        title={program.name}
        note={program.tagline}
        tint={program.tint}
        mascotMood="wave"
        crumbs={crumbs}
        icon={program.icon}
      />

      {/* Overlapping 5 Fact Stickers */}
      <div className="container pd-fact-stickers-container">
        <div className="pd-fact-stickers-grid" role="list" aria-label="Program quick facts">
          {stickers.map((item, idx) => (
            <div
              key={idx}
              className="pd-fact-sticker sticker"
              role="listitem"
              style={{
                '--sticker-rot': `${item.rot}deg`,
                transform: `rotate(${item.rot}deg)`,
              }}
            >
              <div className="pd-fact-sticker__icon" aria-hidden="true">
                <Icon name={item.icon} size={22} color="var(--ink)" />
              </div>
              <div className="pd-fact-sticker__content">
                <span className="pd-fact-sticker__label note">{item.label}</span>
                <strong className="pd-fact-sticker__value">{item.value}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
