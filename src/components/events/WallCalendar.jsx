import React, { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { Icon } from '../ui/Icon';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { siteConfig } from '../../config/siteConfig';
import { buildMonthGrid, parseDateParts, sortEvents } from '../../utils/calendar';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAY_NAMES_MON = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKDAY_NAMES_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Hand-drawn circle ring SVG for marking today.
 */
function TodayRingSvg() {
  return (
    <svg
      className="evt-today-ring"
      viewBox="0 0 44 44"
      aria-hidden="true"
    >
      <circle
        cx="22"
        cy="22"
        r="18"
        fill="none"
        stroke="var(--bubblegum)"
        strokeWidth="2.5"
        strokeDasharray="115"
        strokeDashoffset="0"
        transform="rotate(-15 22 22)"
      />
    </svg>
  );
}

/**
 * Single month page table content.
 */
function MonthTable({
  year,
  month,
  weekStartsOn,
  events,
  selectedCategory,
  selectedDay,
  onSelectDay,
}) {
  const grid = useMemo(
    () => buildMonthGrid(year, month, weekStartsOn),
    [year, month, weekStartsOn]
  );

  const weekdays = weekStartsOn === 1 ? WEEKDAY_NAMES_MON : WEEKDAY_NAMES_SUN;
  const monthName = MONTH_NAMES[month];

  // Group events by ISO date string
  const eventsByDate = useMemo(() => {
    const map = {};
    for (const event of events) {
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    }
    return map;
  }, [events]);

  return (
    <div className="evt-cal-table-wrap">
      <table className="evt-cal-table">
        <caption className="sr-only">
          {`${monthName} ${year}`}
        </caption>
        <thead>
          <tr>
            {weekdays.map((w) => (
              <th key={w} scope="col" className="evt-cal-th">
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell) => {
                const dayEvents = eventsByDate[cell.iso] || [];
                const matchingEvents =
                  selectedCategory === 'All'
                    ? dayEvents
                    : dayEvents.filter((e) => e.category === selectedCategory);

                const hasEvents = dayEvents.length > 0;
                const hasMatchingEvents = matchingEvents.length > 0;
                const isDimmed = hasEvents && !hasMatchingEvents;
                const isSelected = selectedDay === cell.iso;

                const cellClasses = [
                  'evt-cal-td',
                  !cell.inMonth ? 'evt-cal-td--outside' : '',
                  cell.isWeekend ? 'evt-cal-td--weekend' : '',
                  cell.isToday ? 'evt-cal-td--today' : '',
                  hasEvents ? 'evt-cal-td--has-events' : '',
                  hasMatchingEvents ? 'evt-cal-td--active' : '',
                  isDimmed ? 'evt-cal-td--dimmed' : '',
                  isSelected ? 'evt-cal-td--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                if (hasMatchingEvents) {
                  const eventCountLabel = `${cell.dayNumber} ${monthName}, ${matchingEvents.length} ${
                    matchingEvents.length === 1 ? 'event' : 'events'
                  }`;

                  return (
                    <td key={cell.iso} className={cellClasses}>
                      <button
                        type="button"
                        className="evt-day-btn"
                        onClick={() => onSelectDay(cell.iso)}
                        aria-label={eventCountLabel}
                        aria-pressed={isSelected}
                      >
                        <span className="evt-day-num">
                          {cell.dayNumber}
                          {cell.isToday && <TodayRingSvg />}
                        </span>

                        {/* Desktop & Tablet: Event chips */}
                        <div className="evt-day-chips" aria-hidden="true">
                          {matchingEvents.slice(0, 2).map((ev) => (
                            <span
                              key={ev.slug}
                              className={`evt-day-chip evt-tint--${ev.tint || 'yellow'}`}
                              title={ev.title}
                            >
                              {ev.title}
                            </span>
                          ))}
                          {matchingEvents.length > 2 && (
                            <span className="evt-day-more">
                              +{matchingEvents.length - 2}
                            </span>
                          )}
                        </div>

                        {/* Phone: Colored event dots */}
                        <div className="evt-day-dots" aria-hidden="true">
                          {matchingEvents.slice(0, 3).map((ev) => (
                            <span
                              key={ev.slug}
                              className={`evt-day-dot evt-tint--${ev.tint || 'yellow'}`}
                            />
                          ))}
                        </div>
                      </button>
                    </td>
                  );
                }

                return (
                  <td key={cell.iso} className={cellClasses}>
                    <div
                      className="evt-day-cell-static"
                      aria-disabled={isDimmed ? 'true' : undefined}
                    >
                      <span className="evt-day-num">
                        {cell.dayNumber}
                        {cell.isToday && <TodayRingSvg />}
                      </span>

                      {/* Dimmed indicator if events exist but don't match filter */}
                      {isDimmed && (
                        <div className="evt-day-dots evt-day-dots--dimmed" aria-hidden="true">
                          {dayEvents.slice(0, 3).map((ev) => (
                            <span
                              key={ev.slug}
                              className={`evt-day-dot evt-tint--${ev.tint || 'yellow'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Interactive Wall Calendar with month tear-off animations,
 * category dimming, accessible dates, and legend.
 *
 * @param {{
 *   events: Array<Object>,
 *   selectedCategory: string,
 *   visibleMonth: Date,
 *   onMonthChange: (date: Date) => void,
 *   selectedDay: string|null,
 *   onSelectDay: (iso: string) => void,
 *   className?: string
 * }} props
 */
export function WallCalendar({
  events = [],
  selectedCategory = 'All',
  visibleMonth,
  onMonthChange,
  selectedDay,
  onSelectDay,
  className = '',
}) {
  const calendarRef = useRef(null);
  const calendarContentRef = useRef(null);
  const systemReducedMotion = useReducedMotion();
  const isSaveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
  const reducedMotion = systemReducedMotion || isSaveData;

  const weekStartsOn = siteConfig?.calendar?.weekStartsOn ?? 1;

  const currentYear = visibleMonth.getFullYear();
  const currentMonth = visibleMonth.getMonth();

  // Allow serial navigation through months (wide boundary: 2025 to 2028)
  const canGoPrev = currentYear > 2025 || (currentYear === 2025 && currentMonth > 0);
  const canGoNext = currentYear < 2028 || (currentYear === 2028 && currentMonth < 11);

  // Smooth, reliable month navigation in serial order
  const handleNavigate = (direction) => {
    const nextDate =
      direction === 'next'
        ? new Date(currentYear, currentMonth + 1, 1)
        : new Date(currentYear, currentMonth - 1, 1);

    if (reducedMotion || !calendarContentRef.current) {
      onMonthChange(nextDate);
      return;
    }

    const el = calendarContentRef.current;
    gsap.killTweensOf(el);

    const xOut = direction === 'next' ? -14 : 14;
    const xIn = direction === 'next' ? 14 : -14;

    gsap.to(el, {
      opacity: 0,
      x: xOut,
      duration: 0.14,
      ease: 'power2.in',
      onComplete: () => {
        onMonthChange(nextDate);
        gsap.fromTo(
          el,
          { opacity: 0, x: xIn },
          {
            opacity: 1,
            x: 0,
            duration: 0.22,
            ease: 'power2.out',
            clearProps: 'all', // Guarantees all inline styles are cleared! Never blank!
          }
        );
      },
    });
  };

  // Jump to today or nearest month with events
  const handleJumpToday = () => {
    const now = new Date();
    if (now.getFullYear() >= 2026 && now.getFullYear() <= 2027) {
      onMonthChange(new Date(now.getFullYear(), now.getMonth(), 1));
    } else {
      const sorted = sortEvents(events);
      if (sorted.length > 0) {
        const parts = parseDateParts(sorted[0].date);
        if (parts) {
          onMonthChange(new Date(parts.year, parts.monthIndex, 1));
        }
      }
    }
  };

  // Check if current visible month has 0 events
  const eventsInCurrentMonth = useMemo(() => {
    return events.filter((e) => {
      const parts = parseDateParts(e.date);
      return parts && parts.year === currentYear && parts.monthIndex === currentMonth;
    });
  }, [events, currentYear, currentMonth]);

  // Categories legend
  const categoriesWithTints = useMemo(() => {
    const map = new Map();
    for (const e of events) {
      if (!map.has(e.category)) {
        map.set(e.category, e.tint || 'yellow');
      }
    }
    return Array.from(map.entries()).map(([name, tint]) => ({ name, tint }));
  }, [events]);

  return (
    <div className={`evt-wall-calendar ${className}`} ref={calendarRef}>
      {/* Wall Calendar Metal Ring Binding Header */}
      <div className="evt-cal-rings" aria-hidden="true">
        <div className="evt-cal-ring-loop" />
        <div className="evt-cal-ring-loop" />
        <div className="evt-cal-ring-loop" />
        <div className="evt-cal-ring-loop" />
        <div className="evt-cal-ring-loop" />
        <div className="evt-cal-ring-loop" />
      </div>

      {/* Calendar Navigation Bar */}
      <div className="evt-cal-header">
        <div className="evt-cal-nav-group">
          <button
            type="button"
            className="evt-cal-nav-btn"
            disabled={!canGoPrev}
            onClick={() => handleNavigate('prev')}
            aria-label="Previous month"
          >
            <Icon name="chevron-left" size={20} />
          </button>
          <button
            type="button"
            className="evt-cal-today-btn"
            onClick={handleJumpToday}
          >
            Today
          </button>
          <button
            type="button"
            className="evt-cal-nav-btn"
            disabled={!canGoNext}
            onClick={() => handleNavigate('next')}
            aria-label="Next month"
          >
            <Icon name="chevron-right" size={20} />
          </button>
        </div>

        <h3 className="evt-cal-title">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h3>
      </div>

      {/* Robust Calendar Content */}
      <div className="evt-cal-pages-stack" ref={calendarContentRef}>
        <div className="evt-cal-page evt-cal-page--current">
          <MonthTable
            year={currentYear}
            month={currentMonth}
            weekStartsOn={weekStartsOn}
            events={events}
            selectedCategory={selectedCategory}
            selectedDay={selectedDay}
            onSelectDay={onSelectDay}
          />
        </div>
      </div>

      {/* Quiet Month Note */}
      {eventsInCurrentMonth.length === 0 && (
        <div className="evt-cal-quiet-note">
          <span className="note">A quiet month. Rest up!</span>
        </div>
      )}

      {/* Categories Legend */}
      <div className="evt-cal-legend" role="list" aria-label="Category color legend">
        {categoriesWithTints.map(({ name, tint }) => (
          <div key={name} className="evt-cal-legend-item" role="listitem">
            <span
              className={`evt-cal-legend-swatch evt-tint--${tint}`}
              aria-hidden="true"
            />
            <span className="evt-cal-legend-text">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WallCalendar;
