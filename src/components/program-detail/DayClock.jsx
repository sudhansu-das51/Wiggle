import React, { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import './program-detail.css';

/**
 * Section 4: A Day in Class (Daily Routine Schedule).
 * Renders the daily routine timing cards cleanly aligned and centered.
 * @param {{
 *   program: {
 *     name: string,
 *     dailyRoutine: Array<{ time: string, title: string, text: string }>
 *   }
 * }} props
 */
export function DayClock({ program }) {
  const routine = program.dailyRoutine || [];
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="day" className="section section--ink pd-day-section" aria-label="Daily schedule">
      <div className="container">
        {/* Paper tone heading */}
        <SectionHeading
          title={`A day in ${program.name}`}
          note="A joyful, predictable rhythm from morning greeting to pickup."
          tone="paper"
          align="center"
          wiggle
        />

        <div className="pd-day-layout">
          {/* Centered Timing Cards Routine List */}
          <div className="pd-routine-col">
            <ol className="pd-routine-list">
              {routine.map((item, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <li
                    key={idx}
                    className={`pd-routine-card sticker ${isActive ? 'is-active' : ''}`}
                    tabIndex={0}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onFocus={() => setActiveIndex(idx)}
                    onBlur={() => setActiveIndex(null)}
                  >
                    <div className="pd-routine-card__header">
                      <time className="pd-routine-time-badge chip" dateTime={item.time}>
                        {item.time}
                      </time>
                      <h3 className="pd-routine-card__title">
                        {item.title}
                      </h3>
                    </div>
                    <p className="pd-routine-card__text">
                      {item.text}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
