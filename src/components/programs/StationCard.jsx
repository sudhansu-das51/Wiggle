import React from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

/**
 * Arch-topped station card displaying program highlights, timings, and details.
 * @param {{
 *   program: {
 *     slug: string,
 *     name: string,
 *     ageRange: string,
 *     tint: string,
 *     tagline: string,
 *     summary: string,
 *     highlights: string[],
 *     timings: string,
 *     icon?: string
 *   },
 *   stationNumber?: number,
 *   isActive?: boolean,
 *   onCardFocus?: () => void,
 *   className?: string
 * }} props
 */
export function StationCard({
  program,
  stationNumber,
  isActive = false,
  onCardFocus,
  className = '',
}) {
  const tintBgMap = {
    yellow: 'var(--tint-yellow)',
    pink: 'var(--tint-pink)',
    mint: 'var(--tint-mint)',
    sky: 'var(--tint-sky)',
  };

  const bgColor = tintBgMap[program.tint] || 'var(--tint-yellow)';

  return (
    <article
      className={`programs-station-card ${isActive ? 'is-active' : ''} ${className}`}
      style={{ backgroundColor: bgColor }}
      onFocus={onCardFocus}
      aria-label={`${program.name} program details`}
    >
      {/* Top Arch Crown with Station Pill & Age Tag */}
      <div className="programs-station-card__header">
        <span className="programs-station-card__badge">
          {stationNumber ? `Station 0${stationNumber}` : 'Station'}
        </span>
        <span className="chip programs-station-card__age-chip">
          {program.ageRange}
        </span>
      </div>

      {/* Program Name & Tagline */}
      <div className="programs-station-card__title-group">
        <h3 className="programs-station-card__name">
          {program.name}
        </h3>
        <p className="programs-station-card__tagline">
          {program.tagline}
        </p>
      </div>

      {/* Summary */}
      <p className="programs-station-card__summary">
        {program.summary}
      </p>

      {/* 3 Checked Highlights */}
      <ul className="programs-station-card__highlights" aria-label="Key highlights">
        {program.highlights?.slice(0, 3).map((hl, idx) => (
          <li key={idx} className="programs-station-card__highlight-item">
            <span className="programs-station-card__check-icon" aria-hidden="true">
              <Icon name="check" size={15} color="var(--ink)" />
            </span>
            <span>{hl}</span>
          </li>
        ))}
      </ul>

      {/* Timings Strip */}
      <div className="programs-station-card__timings" aria-label="Session timings">
        <Icon name="clock" size={16} color="var(--ink)" />
        <span>{program.timings}</span>
      </div>

      {/* Ghost CTA to detail route */}
      <div className="programs-station-card__actions">
        <Button variant="ghost" to={`/programs/${program.slug}`}>
          {`See the ${program.name} program`}
        </Button>
      </div>
    </article>
  );
}
