import React from 'react';
import { events } from '../../data/events';
import { formatEventDate } from '../../utils/dates';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import './home.css';

/**
 * Section 9: Event Tickets.
 * Next 3 events rendered as perforated ticket stubs.
 */
export function EventTickets() {
  const upcomingEvents = events.slice(0, 3);

  const tintColors = {
    yellow: 'var(--tint-yellow)',
    pink: 'var(--tint-pink)',
    mint: 'var(--tint-mint)',
    sky: 'var(--tint-sky)',
  };

  return (
    <section className="section section--paper" aria-label="Upcoming Events">
      <div className="container">
        <SectionHeading
          title="Coming up"
          note="Workshops, lantern walks, and family celebrations."
          align="center"
          wiggle
        />

        <div className="event-tickets__list">
          {upcomingEvents.map((evt) => {
            const dateObj = formatEventDate(evt.date);
            const stubBg = tintColors[evt.tint] || 'var(--tint-yellow)';

            return (
              <div key={evt.slug} className="ticket-card">
                {/* Perforated Date Stub */}
                <div className="ticket-card__stub" style={{ backgroundColor: stubBg }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      lineHeight: 1,
                      color: 'var(--ink)',
                    }}
                  >
                    {dateObj.day}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--ink)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {dateObj.month}
                  </span>
                  <span className="note" style={{ color: 'var(--muted)', marginTop: '0.2rem' }}>
                    {dateObj.weekday}
                  </span>
                </div>

                {/* Main Ticket Info */}
                <div className="ticket-card__main">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <span className="chip" style={{ padding: '0.2rem 0.65rem', fontSize: '0.8rem' }}>
                      {evt.category}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
                      <Icon name="clock" size={14} />
                      {evt.time}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', color: 'var(--ink)' }}>
                    {evt.title}
                  </h3>

                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBlock: '0.25rem' }}>
                    {evt.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 600 }}>
                    <Icon name="pin" size={16} />
                    <span>{evt.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" to="/events">
            All events
          </Button>
        </div>
      </div>
    </section>
  );
}
