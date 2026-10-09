import React from 'react';
import { Button } from '../ui/Button';
import { Squiggle } from '../ui/Squiggle';

/**
 * Open Application Poster for spontaneous candidate inquiries.
 * Rendered as the final poster in the corridor wall grid.
 * @param {{
 *   onApply: (role: any) => void,
 *   className?: string
 * }} props
 */
export function OpenApplicationPoster({ onApply, className = '' }) {
  const handleApply = () => {
    onApply({
      title: 'General application',
      slug: 'general-application',
    });
  };

  return (
    <article
      className={`car-poster car-poster--open-app ${className}`}
      style={{
        backgroundColor: 'var(--paper)',
        transform: 'rotate(-1deg)',
      }}
    >
      {/* Tape on Top */}
      <span className="car-poster__tape tape" aria-hidden="true" />

      {/* Top Header Note */}
      <div className="car-poster__header">
        <span className="car-poster__pretitle note">Spontaneous hello</span>
        <Squiggle variant="loop" color="var(--ink)" width={45} height={12} className="car-poster__header-squiggle" />
      </div>

      {/* Hand-drawn Question Mark Doodle */}
      <div className="car-open-poster__doodle" aria-hidden="true">
        <svg viewBox="0 0 60 60" width="56" height="56" fill="none">
          <circle cx="30" cy="30" r="26" fill="var(--tint-yellow)" stroke="var(--ink)" strokeWidth="2.2" />
          <path
            d="M 24 23 C 24 18 36 17 36 24 C 36 29 30 30 30 35"
            stroke="var(--ink)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="30" cy="42" r="2" fill="var(--ink)" />
        </svg>
      </div>

      <h3 className="car-poster__title">Do not see your role?</h3>

      <p className="car-poster__desc">
        Tell us about yourself and we will keep your note for the next opening. We love connecting with kind, curious educators before positions even go live.
      </p>

      <div className="car-poster__actions" style={{ marginTop: 'auto' }}>
        <Button
          variant="primary"
          onClick={handleApply}
          className="car-poster__apply-btn"
        >
          Send an open application
        </Button>
      </div>

      {/* Ruled decorative lines at bottom */}
      <div className="car-open-poster__lines" aria-hidden="true">
        <span className="car-open-poster__line" />
        <span className="car-open-poster__line" />
      </div>
    </article>
  );
}

export default OpenApplicationPoster;
