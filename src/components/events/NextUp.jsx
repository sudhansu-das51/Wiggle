import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../ui/SectionHeading';
import { Mascot } from '../ui/Mascot';
import { Icon } from '../ui/Icon';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { FlipCountdown } from './FlipCountdown';
import { EventActions } from './EventActions';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { formatEventDate } from '../../utils/dates';
import { sortEvents, isUpcoming } from '../../utils/calendar';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 2: Next Up event with tear-off calendar date block,
 * flip countdown, event details, and actions.
 *
 * @param {{
 *   events: Array<Object>,
 *   className?: string
 * }} props
 */
export function NextUp({ events = [], className = '' }) {
  const sectionRef = useRef(null);
  const datePageRef = useRef(null);
  const ringsRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Find the first upcoming event sorted by start time
  const [now] = React.useState(() => new Date());
  const sorted = sortEvents(events);
  const nextEvent = sorted.find((e) => isUpcoming(e, now));

  // Date block landing animation on scroll
  React.useEffect(() => {
    if (!nextEvent || reducedMotion) return;

    const ctx = gsap.context(() => {
      const pageEl = datePageRef.current;
      const ringsEl = ringsRef.current;
      if (!pageEl) return;

      gsap.set(pageEl, { rotateX: -90, transformOrigin: '50% 0%' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tl.to(pageEl, {
        rotateX: 0,
        duration: 0.6,
        ease: 'back.out(1.4)',
      });

      if (ringsEl) {
        tl.fromTo(
          ringsEl.querySelectorAll('.evt-ring-svg'),
          { scaleY: 0.8, y: -4 },
          { scaleY: 1, y: 0, duration: 0.4, ease: 'bounce.out' },
          '-=0.3'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [nextEvent, reducedMotion]);

  if (!nextEvent) {
    return (
      <section className={`section section--paper evt-next-up ${className}`} ref={sectionRef}>
        <div className="container">
          <SectionHeading
            title="Next up"
            note="Save the date."
            align="center"
          />
          <div className="evt-next-up__empty">
            <Mascot mood="sleepy" size={100} />
            <p className="evt-next-up__empty-text">No events are planned right now.</p>
            <WhatsAppButton
              label="Ask about upcoming events"
              message="Hi Wiggle! When are the next events planned?"
              variant="primary"
            />
          </div>
        </div>
      </section>
    );
  }

  const { day, month, weekday } = formatEventDate(nextEvent.date);
  const tintClass = nextEvent.tint ? `evt-tint--${nextEvent.tint}` : 'evt-tint--yellow';

  return (
    <section className={`section section--paper evt-next-up ${className}`} ref={sectionRef}>
      <div className="container">
        <SectionHeading
          title="Next up"
          note="Save the date."
          align="left"
        />

        <div className="evt-next-up__card">
          {/* Left Column: Tear-off date block + Flip countdown */}
          <div className="evt-next-up__left">
            <div className="evt-date-block-wrapper">
              {/* Ring binding with holes */}
              <div className="evt-ring-binding" ref={ringsRef} aria-hidden="true">
                <div className="evt-ring-hole evt-ring-hole--left">
                  <svg viewBox="0 0 24 36" className="evt-ring-svg" width="24" height="36">
                    <ellipse cx="12" cy="18" rx="8" ry="14" fill="none" stroke="var(--ink)" strokeWidth="4" />
                    <ellipse cx="12" cy="18" rx="8" ry="14" fill="none" stroke="#D1D5DB" strokeWidth="2.5" />
                  </svg>
                </div>
                <div className="evt-ring-hole evt-ring-hole--right">
                  <svg viewBox="0 0 24 36" className="evt-ring-svg" width="24" height="36">
                    <ellipse cx="12" cy="18" rx="8" ry="14" fill="none" stroke="var(--ink)" strokeWidth="4" />
                    <ellipse cx="12" cy="18" rx="8" ry="14" fill="none" stroke="#D1D5DB" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>

              {/* Date Page */}
              <div className="evt-date-block" ref={datePageRef}>
                <div className={`evt-date-block__month-banner ${tintClass}`}>
                  <span>{month}</span>
                </div>
                <div className="evt-date-block__body">
                  <span className="evt-date-block__day">{day}</span>
                  <span className="evt-date-block__weekday">{weekday}</span>
                </div>
              </div>
            </div>

            {/* Split-Flap Countdown */}
            <div className="evt-next-up__countdown-wrap">
              <FlipCountdown event={nextEvent} />
            </div>
          </div>

          {/* Right Column: Event Details & Actions */}
          <div className="evt-next-up__right">
            <div className="evt-next-up__meta">
              <span className={`chip evt-chip ${tintClass}`}>
                {nextEvent.category}
              </span>
            </div>

            <h3 className="evt-next-up__title">{nextEvent.title}</h3>

            <div className="evt-next-up__info-row">
              <div className="evt-next-up__info-item">
                <Icon name="clock" size={20} color="var(--ink)" />
                <span>{nextEvent.time}</span>
              </div>
              <div className="evt-next-up__info-item">
                <Icon name="pin" size={20} color="var(--ink)" />
                <span>{nextEvent.location}</span>
              </div>
            </div>

            <p className="evt-next-up__desc">{nextEvent.description}</p>

            <div className="evt-next-up__actions">
              <EventActions event={nextEvent} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NextUp;
