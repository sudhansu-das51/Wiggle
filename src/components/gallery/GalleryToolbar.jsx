import { FilterBar } from '../ui/FilterBar';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

/**
 * GalleryToolbar: Category chips + search input using shared FilterBar,
 * plus "+ Add Photo" button for teachers and an accessible live status announcement line.
 */
export function GalleryToolbar({
  categories = [],
  activeCategory = 'All',
  onCategoryChange,
  searchQuery = '',
  onSearchChange,
  matchCount = 0,
  onOpenAddModal,
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

  const addPhotoButton = (
    <Button
      variant="primary"
      icon={<Icon name="camera" size={18} />}
      onClick={onOpenAddModal}
      className="gal-add-photo-btn"
      title="Add a photo to the clothesline gallery"
    >
      + Add Photo
    </Button>
  );

  return (
    <div className="gal-toolbar-wrap">
      {/* Shared FilterBar with chips, search, and Add Photo button */}
      <FilterBar
        options={options}
        value={activeCategory}
        onChange={onCategoryChange}
        search={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search photos by title or caption..."
        className="gal-filter-bar"
        extraAction={addPhotoButton}
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
