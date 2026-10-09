import React, { useMemo } from 'react';
import { Mascot } from '../ui/Mascot';
import { Button } from '../ui/Button';
import { EventRow } from './EventRow';
import { sortEvents, isUpcoming, parseDateParts } from '../../utils/calendar';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * List view of events grouped by month with sticky month headings,
 * past event handling, empty state, and gallery link.
 *
 * @param {{
 *   events: Array<Object>,
 *   selectedCategory: string,
 *   showPast: boolean,
 *   onClearFilters: () => void,
 *   className?: string
 * }} props
 */
export function EventList({
  events = [],
  selectedCategory = 'All',
  showPast = false,
  onClearFilters,
  className = '',
}) {
  const [now] = React.useState(() => new Date());

  // Filter and group events by month
  const { monthGroups, totalCount } = useMemo(() => {
    const sorted = sortEvents(events);

    // Filter by category
    const categoryFiltered =
      selectedCategory === 'All'
        ? sorted
        : sorted.filter((e) => e.category === selectedCategory);

    // Filter by past events
    const filtered = categoryFiltered.filter((e) => {
      const upcoming = isUpcoming(e, now);
      if (showPast) return true;
      return upcoming;
    });

    // Group by month
    const groupsMap = new Map();
    for (const event of filtered) {
      const parts = parseDateParts(event.date);
      if (!parts) continue;

      const groupKey = `${parts.year}-${String(parts.monthIndex + 1).padStart(2, '0')}`;
      const groupLabel = `${MONTH_NAMES[parts.monthIndex]} ${parts.year}`;

      if (!groupsMap.has(groupKey)) {
        groupsMap.set(groupKey, {
          key: groupKey,
          label: groupLabel,
          events: [],
        });
      }
      groupsMap.get(groupKey).events.push(event);
    }

    return {
      monthGroups: Array.from(groupsMap.values()),
      totalCount: filtered.length,
    };
  }, [events, selectedCategory, showPast, now]);

  if (totalCount === 0) {
    return (
      <div className={`evt-list-empty-state ${className}`}>
        <Mascot mood="sleepy" size={90} />
        <p className="evt-list-empty-text">No events match that filter.</p>
        {onClearFilters && (
          <Button variant="ghost" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`evt-list-view ${className}`}>
      <div className="evt-list-groups">
        {monthGroups.map((group) => (
          <section key={group.key} className="evt-list-group">
            <header className="evt-list-sticky-header">
              <h3 className="evt-list-month-title">{group.label}</h3>
              <span className="evt-list-count-badge">
                {group.events.length} {group.events.length === 1 ? 'event' : 'events'}
              </span>
            </header>

            <div className="evt-list-items">
              {group.events.map((event) => (
                <EventRow
                  key={event.slug}
                  event={event}
                  isPast={!isUpcoming(event, now)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="evt-list-footer">
        <Button variant="ghost" to="/gallery">
          See past events in the gallery
        </Button>
      </div>
    </div>
  );
}

export default EventList;
