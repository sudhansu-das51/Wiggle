import React from 'react';
import { Icon } from '../ui/Icon';

/**
 * EventsToolbar with category chips, Calendar/List view toggle,
 * optional "Show past events" checkbox, and live status announcement.
 *
 * @param {{
 *   categories: string[],
 *   selectedCategory: string,
 *   onCategoryChange: (cat: string) => void,
 *   view: 'calendar' | 'list',
 *   onViewChange: (v: 'calendar' | 'list') => void,
 *   showPast: boolean,
 *   onShowPastChange: (checked: boolean) => void,
 *   statusText: string,
 *   className?: string
 * }} props
 */
export function EventsToolbar({
  categories = ['All'],
  selectedCategory = 'All',
  onCategoryChange,
  view = 'calendar',
  onViewChange,
  showPast = false,
  onShowPastChange,
  statusText = '',
  className = '',
}) {
  return (
    <div className={`evt-toolbar ${className}`}>
      <div className="evt-toolbar__controls">
        {/* Category Filter Chips */}
        <div className="evt-toolbar__chips" role="toolbar" aria-label="Filter events by category">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`chip evt-toolbar__chip ${isSelected ? 'active' : ''}`}
                aria-pressed={isSelected}
                onClick={() => onCategoryChange(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* View Toggle + List Options */}
        <div className="evt-toolbar__view-controls">
          {view === 'list' && (
            <label className="evt-toolbar__checkbox-label">
              <input
                type="checkbox"
                checked={showPast}
                onChange={(e) => onShowPastChange(e.target.checked)}
                className="evt-toolbar__checkbox"
              />
              <span className="evt-toolbar__checkbox-text">Show past events</span>
            </label>
          )}

          <div className="evt-view-toggle" role="group" aria-label="View mode">
            <button
              type="button"
              className={`evt-view-btn ${view === 'calendar' ? 'evt-view-btn--active' : ''}`}
              aria-pressed={view === 'calendar'}
              onClick={() => onViewChange('calendar')}
            >
              <Icon name="calendar" size={18} />
              <span>Calendar</span>
            </button>
            <button
              type="button"
              className={`evt-view-btn ${view === 'list' ? 'evt-view-btn--active' : ''}`}
              aria-pressed={view === 'list'}
              onClick={() => onViewChange('list')}
            >
              <Icon name="menu" size={18} />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live status line */}
      <div className="evt-toolbar__status" aria-live="polite">
        {statusText}
      </div>
    </div>
  );
}

export default EventsToolbar;
