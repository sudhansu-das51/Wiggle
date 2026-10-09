import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Icon } from '../ui/Icon';
import { EventActions } from './EventActions';
import { formatEventDate } from '../../utils/dates';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Sticky-note day sheet displaying events for the selected calendar date.
 *
 * @param {{
 *   selectedDate: string|null,
 *   events: Array<Object>,
 *   onClose: () => void,
 *   className?: string
 * }} props
 */
export function DaySheet({ selectedDate, events = [], onClose, className = '' }) {
  const sheetRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!selectedDate || reducedMotion || !sheetRef.current) return;

    gsap.fromTo(
      sheetRef.current,
      { scale: 0.97, opacity: 0.85 },
      { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(1.5)' }
    );
  }, [selectedDate, reducedMotion]);

  if (!selectedDate) {
    return (
      <div className={`evt-daysheet evt-daysheet--empty ${className}`}>
        <div className="evt-daysheet__tape" aria-hidden="true" />
        <div className="evt-daysheet__prompt">
          <Icon name="calendar" size={32} color="var(--muted)" />
          <p className="note">Select any day on the calendar with an event marker to see details.</p>
        </div>
      </div>
    );
  }

  const { full: dateTitle, weekday } = formatEventDate(selectedDate);

  return (
    <div className={`evt-daysheet ${className}`} ref={sheetRef} role="region" aria-label={`Events on ${dateTitle}`}>
      {/* Decorative Washi Tape */}
      <div className="evt-daysheet__tape" aria-hidden="true" />

      {/* Header with Date and Close button */}
      <div className="evt-daysheet__header">
        <div>
          <span className="note evt-daysheet__weekday">{weekday}</span>
          <h3 className="evt-daysheet__date-title">{dateTitle}</h3>
        </div>
        <button
          type="button"
          className="evt-daysheet__close-btn"
          onClick={onClose}
          aria-label="Close day details"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      {/* List of events on this day */}
      <div className="evt-daysheet__body">
        {events.length === 0 ? (
          <p className="evt-daysheet__no-events note">No events scheduled for this day.</p>
        ) : (
          <div className="evt-daysheet__events-list">
            {events.map((event) => {
              const tintClass = event.tint ? `evt-tint--${event.tint}` : 'evt-tint--yellow';
              return (
                <article key={event.slug} className="evt-daysheet__item">
                  <div className="evt-daysheet__item-top">
                    <span className={`chip evt-chip ${tintClass}`}>
                      {event.category}
                    </span>
                  </div>

                  <h4 className="evt-daysheet__item-title">{event.title}</h4>

                  <div className="evt-daysheet__item-meta">
                    <div className="evt-daysheet__meta-row">
                      <Icon name="clock" size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="evt-daysheet__meta-row">
                      <Icon name="pin" size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="evt-daysheet__item-desc">{event.description}</p>

                  <div className="evt-daysheet__item-actions">
                    <EventActions event={event} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DaySheet;
