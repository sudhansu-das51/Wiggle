import React, { useState, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { SectionHeading } from '../ui/SectionHeading';
import { EventsToolbar } from './EventsToolbar';
import { WallCalendar } from './WallCalendar';
import { DaySheet } from './DaySheet';
import { EventList } from './EventList';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { sortEvents, isUpcoming, parseDateParts } from '../../utils/calendar';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Section 3: Find a date - Explorer coordinating calendar/list view,
 * category filters, date sheet, and live status line.
 *
 * @param {{
 *   events: Array<Object>,
 *   className?: string
 * }} props
 */
export function EventsExplorer({ events = [], className = '' }) {
  const reducedMotion = useReducedMotion();
  const viewContentRef = useRef(null);
  const [now] = useState(() => new Date());

  // Determine initial view based on screen width (List on phone < 768px, Calendar otherwise)
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
      return 'calendar';
    }
    return 'list';
  });

  const categories = useMemo(() => {
    const set = new Set(events.map((e) => e.category));
    return ['All', ...Array.from(set)];
  }, [events]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPast, setShowPast] = useState(false);

  // Initial visible month based on first upcoming event
  const initialMonth = useMemo(() => {
    const sorted = sortEvents(events);
    const nextEv = sorted.find((e) => isUpcoming(e, now)) || sorted[0];
    if (nextEv) {
      const parts = parseDateParts(nextEv.date);
      if (parts) return new Date(parts.year, parts.monthIndex, 1);
    }
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, [events, now]);

  const [visibleMonth, setVisibleMonth] = useState(initialMonth);

  // Initially selected day: next event's day if in visible month, otherwise null
  const [selectedDay, setSelectedDay] = useState(() => {
    const sorted = sortEvents(events);
    const nextEv = sorted.find((e) => isUpcoming(e, now));
    if (nextEv) {
      const parts = parseDateParts(nextEv.date);
      if (
        parts &&
        parts.year === initialMonth.getFullYear() &&
        parts.monthIndex === initialMonth.getMonth()
      ) {
        return nextEv.date;
      }
    }
    return null;
  });

  // Crossfade animation on view switch
  const handleViewChange = (newView) => {
    if (newView === view) return;

    if (reducedMotion || !viewContentRef.current) {
      setView(newView);
      return;
    }

    gsap.to(viewContentRef.current, {
      opacity: 0,
      y: 6,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setView(newView);
        gsap.fromTo(
          viewContentRef.current,
          { opacity: 0, y: -6 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
        );
      },
    });
  };

  // Status text computation
  const statusText = useMemo(() => {
    if (view === 'calendar') {
      const curYear = visibleMonth.getFullYear();
      const curMonth = visibleMonth.getMonth();
      const inMonth = events.filter((e) => {
        const parts = parseDateParts(e.date);
        if (!parts) return false;
        const matchesMonth = parts.year === curYear && parts.monthIndex === curMonth;
        const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
        return matchesMonth && matchesCat;
      });
      return `Showing ${inMonth.length} ${
        inMonth.length === 1 ? 'event' : 'events'
      } in ${MONTH_NAMES[curMonth]} ${curYear}`;
    } else {
      const filtered = events.filter((e) => {
        const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
        const upcoming = isUpcoming(e, now);
        if (showPast) return matchesCat;
        return matchesCat && upcoming;
      });
      return showPast
        ? `Showing ${filtered.length} ${filtered.length === 1 ? 'event' : 'events'}`
        : `Showing ${filtered.length} upcoming ${filtered.length === 1 ? 'event' : 'events'}`;
    }
  }, [view, visibleMonth, events, selectedCategory, showPast, now]);

  // Events for selected day
  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return events.filter((e) => e.date === selectedDay);
  }, [events, selectedDay]);

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setShowPast(false);
  };

  return (
    <section className={`section section--sky evt-explorer-section ${className}`}>
      <div className="container">
        <SectionHeading
          title="Find a date"
          text="Browse by month, or see everything in one list."
          align="left"
        />

        <EventsToolbar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          view={view}
          onViewChange={handleViewChange}
          showPast={showPast}
          onShowPastChange={setShowPast}
          statusText={statusText}
        />

        <div className="evt-explorer__content" ref={viewContentRef}>
          {view === 'calendar' ? (
            <div className="evt-calendar-layout">
              <div className="evt-calendar-layout__cal">
                <WallCalendar
                  events={events}
                  selectedCategory={selectedCategory}
                  visibleMonth={visibleMonth}
                  onMonthChange={(newMonth) => {
                    setVisibleMonth(newMonth);
                    // Check if selected day is in new month
                    if (selectedDay) {
                      const parts = parseDateParts(selectedDay);
                      if (
                        !parts ||
                        parts.year !== newMonth.getFullYear() ||
                        parts.monthIndex !== newMonth.getMonth()
                      ) {
                        setSelectedDay(null);
                      }
                    }
                  }}
                  selectedDay={selectedDay}
                  onSelectDay={(iso) => {
                    // Toggle or set
                    setSelectedDay((prev) => (prev === iso ? null : iso));
                  }}
                />
              </div>

              <div className="evt-calendar-layout__sheet">
                <DaySheet
                  selectedDate={selectedDay}
                  events={selectedDayEvents}
                  onClose={() => setSelectedDay(null)}
                />
              </div>
            </div>
          ) : (
            <EventList
              events={events}
              selectedCategory={selectedCategory}
              showPast={showPast}
              onClearFilters={handleClearFilters}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default EventsExplorer;
