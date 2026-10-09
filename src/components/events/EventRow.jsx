import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Icon } from '../ui/Icon';
import { EventActions } from './EventActions';
import { formatEventDate } from '../../utils/dates';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Single event row styled as a perforated ticket stub with expandable details.
 *
 * @param {{
 *   event: Object,
 *   isPast?: boolean,
 *   className?: string
 * }} props
 */
export function EventRow({ event, isPast = false, className = '' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsRef = useRef(null);
  const contentRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const initialMountRef = useRef(true);

  const { day, month, weekday } = formatEventDate(event.date);
  const tintClass = event.tint ? `evt-tint--${event.tint}` : 'evt-tint--yellow';

  // Animate disclosure expansion with GSAP measuring scrollHeight
  useEffect(() => {
    if (initialMountRef.current) {
      initialMountRef.current = false;
      return;
    }

    const detailsEl = detailsRef.current;
    const contentEl = contentRef.current;
    if (!detailsEl || !contentEl) return;

    if (reducedMotion) {
      gsap.set(detailsEl, {
        height: isExpanded ? 'auto' : 0,
        opacity: isExpanded ? 1 : 0,
        overflow: 'hidden',
      });
      return;
    }

    gsap.killTweensOf(detailsEl);

    if (isExpanded) {
      // Measure natural height
      const fullHeight = contentEl.scrollHeight;
      gsap.fromTo(
        detailsEl,
        { height: 0, opacity: 0, overflow: 'hidden' },
        {
          height: fullHeight,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.set(detailsEl, { height: 'auto', overflow: 'visible' });
          },
        }
      );
    } else {
      const currentHeight = detailsEl.scrollHeight;
      gsap.fromTo(
        detailsEl,
        { height: currentHeight, opacity: 1, overflow: 'hidden' },
        {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        }
      );
    }
  }, [isExpanded, reducedMotion]);

  const toggleDetails = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <article
      className={`evt-ticket-row ${isPast ? 'evt-ticket-row--past' : ''} ${className}`}
    >
      <div className="evt-ticket">
        {/* Left: Perforated Date Stub */}
        <div className={`evt-ticket-stub ${tintClass}`}>
          <div className="evt-ticket-stub__notch-top" aria-hidden="true" />
          <span className="evt-ticket-stub__month">{month}</span>
          <span className="evt-ticket-stub__day">{day}</span>
          <span className="evt-ticket-stub__weekday">{weekday}</span>
          <div className="evt-ticket-stub__notch-bottom" aria-hidden="true" />
          <div className="evt-ticket-stub__perforation" aria-hidden="true" />
        </div>

        {/* Right: Main Ticket Information */}
        <div className="evt-ticket-main">
          {/* Hand-drawn "Done" Stamp for Past Events */}
          {isPast && (
            <div className="evt-ticket-stamp" aria-label="Event passed">
              <span>Done</span>
            </div>
          )}

          <div className="evt-ticket-header">
            <div className="evt-ticket-meta">
              <span className={`chip evt-chip ${tintClass}`}>
                {event.category}
              </span>
            </div>
            <h4 className="evt-ticket-title">{event.title}</h4>
          </div>

          <div className="evt-ticket-details-summary">
            <div className="evt-ticket-info-item">
              <Icon name="clock" size={16} />
              <span>{event.time}</span>
            </div>
            <div className="evt-ticket-info-item">
              <Icon name="pin" size={16} />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Details Disclosure Toggle Button */}
          <div className="evt-ticket-footer">
            <button
              type="button"
              className="evt-ticket-toggle-btn"
              onClick={toggleDetails}
              aria-expanded={isExpanded}
              aria-controls={`details-${event.slug}`}
            >
              <span>{isExpanded ? 'Hide details' : 'Details'}</span>
              <Icon
                name={isExpanded ? 'minus' : 'plus'}
                size={16}
                className="evt-ticket-toggle-icon"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Disclosure Body */}
      <div
        id={`details-${event.slug}`}
        ref={detailsRef}
        className="evt-ticket-drawer"
        style={{ height: 0, opacity: 0, overflow: 'hidden' }}
      >
        <div ref={contentRef} className="evt-ticket-drawer__content">
          <p className="evt-ticket-desc">{event.description}</p>
          <div className="evt-ticket-actions">
            <EventActions event={event} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default EventRow;
