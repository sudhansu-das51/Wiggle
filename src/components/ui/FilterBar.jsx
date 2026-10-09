import React from 'react';
import { Icon } from './Icon';

/**
 * FilterBar with accessible chips and optional search input.
 * @param {{
 *   options: string[],
 *   value: string,
 *   onChange: (val: string) => void,
 *   search?: string,
 *   onSearchChange?: (val: string) => void,
 *   searchPlaceholder?: string,
 *   className?: string
 * }} props
 */
export function FilterBar({
  options = [],
  value,
  onChange,
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  className = '',
}) {
  return (
    <div
      className={`filter-bar ${className}`}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      {/* Category Chips */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.625rem',
        }}
        role="toolbar"
        aria-label="Filter options"
      >
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <button
              key={option}
              type="button"
              className={`chip ${isSelected ? 'active' : ''}`}
              aria-pressed={isSelected}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Optional Search Input */}
      {onSearchChange && (
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <label htmlFor="filter-search-input" className="sr-only">
            {searchPlaceholder}
          </label>
          <input
            id="filter-search-input"
            type="search"
            value={search || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            style={{
              width: '100%',
              padding: '0.6rem 2.25rem 0.6rem 1rem',
              borderRadius: 'var(--r-pill)',
              border: 'var(--outline)',
              backgroundColor: 'var(--paper)',
              fontSize: '0.9375rem',
              color: 'var(--ink)',
              boxShadow: '2px 2px 0 var(--ink)',
            }}
          />
          <span
            style={{
              position: 'absolute',
              right: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--muted)',
              pointerEvents: 'none',
            }}
          >
            <Icon name="pencil" size={16} />
          </span>
        </div>
      )}
    </div>
  );
}
