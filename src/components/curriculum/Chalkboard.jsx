import React, { useState, useRef, useEffect } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { curriculum } from '../../data/curriculum';
import { animate, stagger } from 'animejs';

/**
 * Section 5: A Week at Wiggle (Chalkboard).
 * Dark chalkboard with sunny-yellow wooden frame, chalk typography, and daily activities.
 */
export function Chalkboard() {
  const { sampleWeek = [] } = curriculum;

  // Determine initial day based on current weekday (Monday to Friday)
  const getInitialDayIndex = () => {
    const today = new Date().getDay(); // 0 is Sun, 1 is Mon, 5 is Fri, 6 is Sat
    if (today >= 1 && today <= 5 && today - 1 < sampleWeek.length) {
      return today - 1;
    }
    return 0; // Default to Monday
  };

  const [selectedDayIdx, setSelectedDayIdx] = useState(getInitialDayIndex);
  const activeDay = sampleWeek[selectedDayIdx] || sampleWeek[0];

  const panelRef = useRef(null);
  const mobileSquiggleRef = useRef(null);
  const desktopSquigglesRef = useRef([]);

  // Tablet & Phone: animate swap and redraw squiggle on day change
  useEffect(() => {
    if (panelRef.current) {
      animate(panelRef.current, {
        opacity: [0.3, 1],
        translateY: [6, 0],
        duration: 250,
        ease: 'outQuad',
      });
    }

    if (mobileSquiggleRef.current) {
      const pathEl = mobileSquiggleRef.current;
      const len = pathEl.getTotalLength ? pathEl.getTotalLength() : 200;
      pathEl.style.strokeDasharray = len;
      pathEl.style.strokeDashoffset = len;

      animate(pathEl, {
        strokeDashoffset: [len, 0],
        duration: 500,
        ease: 'inOutCubic',
      });
    }
  }, [selectedDayIdx]);

  // Desktop: draw squiggles once on intersection
  useEffect(() => {
    const validPaths = desktopSquigglesRef.current.filter(Boolean);
    if (!validPaths.length) return;

    validPaths.forEach((path) => {
      const len = path.getTotalLength ? path.getTotalLength() : 180;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animate(validPaths, {
          strokeDashoffset: 0,
          duration: 650,
          delay: stagger(100),
          ease: 'inOutCubic',
        });
        observer.disconnect();
      }
    }, { threshold: 0.35 });

    if (desktopSquigglesRef.current[0]) {
      observer.observe(desktopSquigglesRef.current[0].closest('.cur-chalkboard-frame'));
    }

    return () => observer.disconnect();
  }, [sampleWeek.length]);

  return (
    <section id="week" className="section section--ink cur-chalkboard-section" aria-label="Sample weekly timetable">
      <div className="container">
        <SectionHeading
          title="A normal week at Wiggle"
          note="Yes, Tuesday really is messy-paint day."
          tone="paper"
          align="center"
          wiggle
        />

        {/* Mobile & Tablet Day Selector Chips */}
        <div className="cur-chalkboard-chips cur-mobile-only" role="group" aria-label="Select day of the week">
          {sampleWeek.map((dayItem, idx) => {
            const isSelected = selectedDayIdx === idx;
            return (
              <button
                key={dayItem.day || idx}
                type="button"
                className={`cur-day-chip chip ${isSelected ? 'is-active' : ''}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedDayIdx(idx)}
              >
                {dayItem.day}
              </button>
            );
          })}
        </div>

        {/* The Chalkboard Frame */}
        <div className="cur-chalkboard-frame sticker">
          {/* Sunny-yellow wooden frame corners */}
          <div className="cur-chalk-corner cur-corner-tl" aria-hidden="true" />
          <div className="cur-chalk-corner cur-corner-tr" aria-hidden="true" />
          <div className="cur-chalk-corner cur-corner-bl" aria-hidden="true" />
          <div className="cur-chalk-corner cur-corner-br" aria-hidden="true" />

          {/* Chalk dust smudges texture */}
          <div className="cur-chalk-smudges" aria-hidden="true" />

          {/* Desktop 5-Column Grid (1024px and up) */}
          <div className="cur-chalk-desktop-grid cur-desktop-only">
            {sampleWeek.map((dayItem, idx) => (
              <div key={dayItem.day || idx} className="cur-chalk-day-col">
                <div className="cur-chalk-day-header">
                  <h3 className="cur-chalk-day-name note">{dayItem.day}</h3>
                  <div className="cur-chalk-theme-wrapper">
                    <p className="cur-chalk-theme">{dayItem.theme}</p>
                    {/* Chalk Squiggle underline */}
                    <svg
                      viewBox="0 0 160 16"
                      className="cur-chalk-squiggle-svg"
                      aria-hidden="true"
                    >
                      <path
                        ref={(el) => (desktopSquigglesRef.current[idx] = el)}
                        d="M 5,8 Q 25,2 45,8 T 85,8 T 125,8 T 155,8"
                        fill="none"
                        stroke="rgba(250, 246, 238, 0.85)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <ul className="cur-chalk-activities-list" role="list">
                  {dayItem.activities?.map((activity, aIdx) => (
                    <li key={aIdx} className="cur-chalk-activity-item">
                      <span className="cur-chalk-bullet" aria-hidden="true">✦</span>
                      <span className="cur-chalk-activity-text">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile & Tablet Single-Day Active Panel */}
          <div ref={panelRef} className="cur-chalk-mobile-panel cur-mobile-only">
            <div className="cur-chalk-day-header">
              <h3 className="cur-chalk-day-name note">{activeDay?.day}</h3>
              <div className="cur-chalk-theme-wrapper">
                <p className="cur-chalk-theme">{activeDay?.theme}</p>
                <svg
                  viewBox="0 0 200 16"
                  className="cur-chalk-squiggle-svg"
                  aria-hidden="true"
                >
                  <path
                    ref={mobileSquiggleRef}
                    d="M 5,8 Q 30,2 55,8 T 105,8 T 155,8 T 195,8"
                    fill="none"
                    stroke="rgba(250, 246, 238, 0.85)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <ul className="cur-chalk-activities-list" role="list">
              {activeDay?.activities?.map((activity, aIdx) => (
                <li key={aIdx} className="cur-chalk-activity-item">
                  <span className="cur-chalk-bullet" aria-hidden="true">✦</span>
                  <span className="cur-chalk-activity-text">{activity}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom chalk ledge with small pieces of chalk */}
          <div className="cur-chalk-ledge" aria-hidden="true">
            <span className="cur-chalk-stick cur-chalk-white" />
            <span className="cur-chalk-stick cur-chalk-yellow" />
            <span className="cur-chalk-stick cur-chalk-pink" />
            <span className="cur-chalk-eraser" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Chalkboard;
