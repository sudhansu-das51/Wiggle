import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { getOpenStatus, formatAddress, buildDirectionsUrl } from '../../utils/contact';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * School-gate sign with arched top, ink outline, two posts,
 * dynamic open status chip, address, landmark, parking note, and timetable.
 * @param {{
 *   brand?: { name?: string },
 *   contact: {
 *     address?: any,
 *     hours?: Array<{ days: string, time: string }>,
 *     landmark?: string,
 *     parkingNote?: string,
 *     directionsUrl?: string,
 *     [key: string]: any
 *   },
 *   className?: string
 * }} props
 */
export function HoursBoard({ brand, contact, className = '' }) {
  const [openStatus, setOpenStatus] = useState(() => getOpenStatus(contact?.hours));
  const chipRef = useRef(null);
  const prevLabelRef = useRef(openStatus?.label);
  const reducedMotion = useReducedMotion();

  const brandName = brand?.name || 'Wiggle';
  const { multiLine } = formatAddress(contact?.address);
  const directionsUrl = buildDirectionsUrl(contact);

  // Periodically re-evaluate open status every minute while the document is visible
  useEffect(() => {
    const updateStatus = () => {
      if (document.hidden) return;
      const nextStatus = getOpenStatus(contact?.hours);
      setOpenStatus(nextStatus);
    };

    // Initial check
    updateStatus();

    const intervalId = setInterval(updateStatus, 60000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [contact?.hours]);

  // Chip pop animation when status label changes
  useEffect(() => {
    if (!openStatus?.label || !chipRef.current) return;
    if (prevLabelRef.current !== openStatus.label) {
      prevLabelRef.current = openStatus.label;
      if (!reducedMotion) {
        gsap.fromTo(
          chipRef.current,
          { scale: 0.9 },
          { scale: 1, duration: 0.2, ease: 'back.out(2)' }
        );
      }
    }
  }, [openStatus?.label, reducedMotion]);

  return (
    <div className={`con-gate-sign ${className}`}>
      {/* Two wooden posts supporting the gate sign */}
      <div className="con-gate-sign__posts" aria-hidden="true">
        <div className="con-gate-sign__post con-gate-sign__post--left" />
        <div className="con-gate-sign__post con-gate-sign__post--right" />
      </div>

      {/* Arched Gate Signboard */}
      <div className="con-gate-sign__board">
        {/* Arched top decorative crest */}
        <div className="con-gate-sign__crest">
          <span className="con-gate-sign__crest-text note">School gate</span>
        </div>

        {/* Header with School Name & Status */}
        <div className="con-gate-sign__header">
          <h3 className="con-gate-sign__title">{brandName}</h3>
          {openStatus && (
            <div
              ref={chipRef}
              className={`chip con-gate-sign__status ${openStatus.isOpen ? 'con-gate-sign__status--open' : 'con-gate-sign__status--closed'}`}
              aria-live="polite"
            >
              <span
                className="con-gate-sign__status-dot"
                style={{
                  backgroundColor: openStatus.isOpen ? 'var(--meadow)' : 'var(--muted)',
                }}
                aria-hidden="true"
              />
              <span className="con-gate-sign__status-label">{openStatus.label}</span>
            </div>
          )}
        </div>

        {/* Address and Landmark */}
        <div className="con-gate-sign__address-group">
          <div className="con-gate-sign__address">
            {multiLine.split('\n').map((line, idx) => (
              <p key={idx} className="con-gate-sign__address-line">{line}</p>
            ))}
          </div>

          {contact?.landmark && (
            <p className="con-gate-sign__landmark note">
              {contact.landmark}
            </p>
          )}

          {contact?.parkingNote && (
            <p className="con-gate-sign__parking note">
              {contact.parkingNote}
            </p>
          )}
        </div>

        {/* Timetable */}
        {contact?.hours && contact.hours.length > 0 && (
          <div className="con-gate-sign__hours">
            <h4 className="con-gate-sign__hours-heading">Visiting hours</h4>
            <ul className="con-gate-sign__timetable">
              {contact.hours.map((h, i) => (
                <li key={i} className="con-gate-sign__timetable-row">
                  <span className="con-gate-sign__timetable-days">{h.days}</span>
                  <span className="con-gate-sign__timetable-time">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Directions Action */}
        <div className="con-gate-sign__action">
          <Button
            variant="ghost"
            href={directionsUrl}
            icon={<Icon name="pin" size={18} />}
            className="con-gate-sign__directions-btn"
          >
            Get directions
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HoursBoard;
