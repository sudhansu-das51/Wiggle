import React from 'react';
import { FilterBar } from '../ui/FilterBar';

/**
 * GalleryToolbar: Category chips + search input using shared FilterBar,
 * plus an accessible live status announcement line.
 */
export function GalleryToolbar({
  categories = [],
  activeCategory = 'All',
  onCategoryChange,
  searchQuery = '',
  onSearchChange,
  matchCount = 0,
}) {
  const options = ['All', ...categories];

  // Derive human-friendly status line
  let statusText = `Showing ${matchCount} ${matchCount === 1 ? 'photo' : 'photos'}`;
  if (activeCategory !== 'All') {
    statusText += ` in ${activeCategory}`;
  }
  if (searchQuery.trim()) {
    statusText += ` matching "${searchQuery.trim()}"`;
  }

  return (
    <div className="gal-toolbar-wrap">
      {/* Shared FilterBar with chips and search */}
      <FilterBar
        options={options}
        value={activeCategory}
        onChange={onCategoryChange}
        search={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search photos by title or caption..."
        className="gal-filter-bar"
      />

      {/* Live Region Status Line */}
      <div className="gal-status-line-wrap">
        <p
          className="gal-status-line note"
          role="status"
          aria-live="polite"
        >
          {statusText}
        </p>
      </div>
    </div>
  );
}

export default GalleryToolbar;
