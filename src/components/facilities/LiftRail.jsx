import React, { useRef, useEffect } from 'react';
import { Mascot } from '../ui/Mascot';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import gsap from 'gsap';

/**
 * LiftRail: Vertical elevator rail that travels alongside the cutaway building on desktop.
 * Shows clickable floor stops and a tiny cabin with Wig indicating the active room.
 */
export function LiftRail({ facilities, activeIndex = 0, onSelectRoom }) {
  const cabinRef = useRef(null);
  const railRef = useRef(null);
  const isReduced = useReducedMotion();
  const total = facilities.length;

  // Move lift cabin when activeIndex changes
  useEffect(() => {
    if (!cabinRef.current || !railRef.current) return;

    // Calculate vertical travel percentage
    const stepPct = total > 1 ? (activeIndex / (total - 1)) * 100 : 0;

    if (isReduced) {
      gsap.set(cabinRef.current, { top: `${stepPct}%` });
    } else {
      gsap.to(cabinRef.current, {
        top: `${stepPct}%`,
        duration: 0.7,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
    }
  }, [activeIndex, total, isReduced]);

  return (
    <nav
      className="fac-lift-rail-nav"
      aria-label="Rooms elevator rail"
    >
      <div ref={railRef} className="fac-lift-rail-track">
        {/* Steel Rail Line */}
        <div className="fac-rail-line" aria-hidden="true" />

        {/* Sliding Lift Cabin */}
        <div
          ref={cabinRef}
          className="fac-lift-cabin sticker"
          aria-hidden="true"
        >
          {/* Cabin Ropes & Pulley */}
          <div className="fac-cabin-cable" />

          {/* Cabin Interior Window with Wig */}
          <div className="fac-cabin-window">
            <Mascot mood="wave" size={32} />
          </div>

          {/* Room Readout Tag */}
          <div className="fac-cabin-readout note">
            <span>{activeIndex + 1} of {total}</span>
          </div>
        </div>

        {/* Room Floor Stops */}
        <div className="fac-rail-stops">
          {facilities.map((fac, idx) => {
            const isCurrent = idx === activeIndex;

            return (
              <button
                key={fac.slug}
                type="button"
                className={`fac-rail-stop ${isCurrent ? 'fac-stop--active' : ''}`}
                onClick={() => onSelectRoom(fac.slug, idx)}
                aria-current={isCurrent ? 'true' : undefined}
                aria-label={`Go to room ${idx + 1}: ${fac.name}`}
              >
                {/* Floor Indicator Dot */}
                <span className="fac-stop-dot" />

                {/* Floating Handwritten Room Label on Hover/Active */}
                <span className="fac-stop-tooltip note">
                  <span className="fac-tooltip-num">R{idx + 1}</span>
                  <span className="fac-tooltip-name">{fac.name}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default LiftRail;
