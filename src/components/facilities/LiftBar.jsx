import React from 'react';
import { Icon } from '../ui/Icon';

/**
 * LiftBar: Slim sticky floor navigator for mobile and tablet viewports.
 * Sticks directly below the navbar, showing "Room N of M: [Name]",
 * previous/next buttons (>=44px tap targets), and a progress line.
 */
export function LiftBar({ facilities, activeIndex = 0, onSelectRoom }) {
  const total = facilities.length;
  const current = facilities[activeIndex] || facilities[0];

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeIndex - 1);
    onSelectRoom(facilities[nextIdx].slug, nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(total - 1, activeIndex + 1);
    onSelectRoom(facilities[nextIdx].slug, nextIdx);
  };

  const progressPct = total > 1 ? ((activeIndex + 1) / total) * 100 : 100;

  return (
    <nav
      className="fac-lift-bar-sticky"
      aria-label="Rooms navigation bar"
    >
      <div className="fac-lift-bar-inner">
        {/* Previous Room Button */}
        <button
          type="button"
          className="fac-bar-btn fac-bar-btn--prev"
          onClick={handlePrev}
          disabled={activeIndex === 0}
          aria-label="Previous room"
        >
          <Icon name="arrowLeft" size={18} color="var(--ink)" />
        </button>

        {/* Current Room Readout */}
        <div className="fac-bar-readout" aria-live="polite">
          <span className="fac-bar-counter note">
            Room {activeIndex + 1} of {total}
          </span>
          <span className="fac-bar-room-name">
            {current.name}
          </span>
        </div>

        {/* Next Room Button */}
        <button
          type="button"
          className="fac-bar-btn fac-bar-btn--next"
          onClick={handleNext}
          disabled={activeIndex === total - 1}
          aria-label="Next room"
        >
          <Icon name="arrowRight" size={18} color="var(--ink)" />
        </button>
      </div>

      {/* Progress Line */}
      <div className="fac-bar-progress-track" aria-hidden="true">
        <div
          className="fac-bar-progress-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </nav>
  );
}

export default LiftBar;
