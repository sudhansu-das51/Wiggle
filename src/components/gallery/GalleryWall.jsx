import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { GalleryToolbar } from './GalleryToolbar';
import { ClotheslineRow } from './ClotheslineRow';
import { ProjectorViewer } from './ProjectorViewer';
import { AddPhotoModal } from './AddPhotoModal';
import { Button } from '../ui/Button';
import { Mascot } from '../ui/Mascot';
import { gallery } from '../../data/gallery';
import { useScrollSway } from '../../hooks/useScrollSway';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import gsap from 'gsap';

/**
 * Splits an array of photos into rows based on per-row count.
 */
function chunkPhotos(items, perRow) {
  const rows = [];
  for (let i = 0; i < items.length; i += perRow) {
    rows.push(items.slice(i, i + perRow));
  }
  return rows;
}

/**
 * Section 2: The Clothesline Wall.
 * A sky-colored wall with sagging ropes, pegged swaying photos,
 * category filtering with unpeg-and-drop animation, search, and pagination.
 */
export function GalleryWall() {
  const isReduced = useReducedMotion();
  const { register, unregister, setVisible } = useScrollSway();

  // Load photos including teacher uploaded photos from localStorage
  const [allPhotos, setAllPhotos] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = window.localStorage.getItem('wiggle_teacher_photos');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return [...parsed, ...gallery];
          }
        }
      }
    } catch (e) {
      console.warn('Could not load custom photos from localStorage', e);
    }
    return gallery;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 1. Categories list derived in order of appearance from allPhotos
  const categories = useMemo(() => {
    return Array.from(new Set(allPhotos.map((p) => p.category)));
  }, [allPhotos]);

  // 2. Filter & pagination state
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(12);

  // 3. Responsive photos per row (2 on phone, 3 on tablet, 4 on desktop)
  const [photosPerRow, setPhotosPerRow] = useState(() => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return 2;
    if (window.innerWidth < 1024) return 3;
    return 4;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const count = width < 640 ? 2 : width < 1024 ? 3 : 4;
      setPhotosPerRow(count);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 4. Current filtered matching photos
  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((photo) => {
      const matchCat = activeCategory === 'All' || photo.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        photo.title.toLowerCase().includes(query) ||
        photo.caption.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
  }, [allPhotos, activeCategory, searchQuery]);

  const handleAddPhoto = useCallback((newPhoto) => {
    setAllPhotos((prev) => {
      const next = [newPhoto, ...prev];
      try {
        if (typeof window !== 'undefined') {
          const userOnly = next.filter((p) => p.isUserAdded);
          window.localStorage.setItem('wiggle_teacher_photos', JSON.stringify(userOnly));
        }
      } catch (err) {
        console.warn('Could not persist photo to localStorage', err);
      }
      return next;
    });

    // Reset filters so the new photo is immediately visible at the top!
    setActiveCategory('All');
    setSearchQuery('');
    setDisplayCount(12);

    // Show cheerful notification toast
    setToastMessage(`"${newPhoto.title}" pinned to clothesline! 📎✨`);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  }, []);

  // 5. Rendered photos state (allows exit unpeg-and-drop animation before swap)
  const [renderedPhotos, setRenderedPhotos] = useState(filteredPhotos);
  const isTransitioningRef = useRef(false);
  const prevFilteredRef = useRef(filteredPhotos);
  const wallContainerRef = useRef(null);

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setDisplayCount(12);
  }, []);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    setDisplayCount(12);
  }, []);

  // Handle filter / search changes with unpeg-and-drop exit animation
  useEffect(() => {
    if (isReduced) return;
    if (prevFilteredRef.current === filteredPhotos) return;
    prevFilteredRef.current = filteredPhotos;

    const wallEl = wallContainerRef.current;
    const currentCards = wallEl ? wallEl.querySelectorAll('.gal-photo-outer') : [];
    if (!currentCards || currentCards.length === 0) {
      setRenderedPhotos(filteredPhotos);
      return;
    }

    // Kill any in-flight transitions
    gsap.killTweensOf(currentCards);
    isTransitioningRef.current = true;

    // Unpeg and drop leaving photos
    gsap.to(currentCards, {
      y: 130,
      rotation: () => -20 + Math.random() * 40,
      opacity: 0,
      duration: 0.32,
      stagger: 0.015,
      ease: 'power2.in',
      onComplete: () => {
        setRenderedPhotos(filteredPhotos);
        isTransitioningRef.current = false;
      },
    });
  }, [filteredPhotos, isReduced]);

  // 6. Paginated slice of active photos
  const activePhotos = isReduced ? filteredPhotos : renderedPhotos;
  const visiblePhotos = useMemo(() => {
    return activePhotos.slice(0, displayCount);
  }, [activePhotos, displayCount]);

  // Split into clothesline rows
  const photoRows = useMemo(() => {
    return chunkPhotos(visiblePhotos, photosPerRow);
  }, [visiblePhotos, photosPerRow]);

  // 7. Viewer modal state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const lastActiveElementRef = useRef(null);

  const handleOpenPhoto = useCallback((photo) => {
    lastActiveElementRef.current = document.activeElement;
    setSelectedPhoto(photo);
    setViewerOpen(true);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setViewerOpen(false);
    setSelectedPhoto(null);
    if (lastActiveElementRef.current && lastActiveElementRef.current.focus) {
      lastActiveElementRef.current.focus();
    }
  }, []);

  const handleViewerNavigate = useCallback((newIndex) => {
    if (filteredPhotos[newIndex]) {
      setSelectedPhoto(filteredPhotos[newIndex]);
    }
  }, [filteredPhotos]);

  const currentViewerIndex = useMemo(() => {
    if (!selectedPhoto) return 0;
    const idx = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    return idx >= 0 ? idx : 0;
  }, [selectedPhoto, filteredPhotos]);

  // 8. Pagination "Show more photos"
  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 12);
  };

  // 9. Clear filters action
  const handleClearFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
  };

  const hasMore = displayCount < renderedPhotos.length;

  return (
    <section
      id="wall"
      className="section section--sky gal-wall-section"
      aria-label="School photo clothesline wall"
    >
      {/* Decorative Sky Backdrop Elements */}
      <div className="gal-sky-decorations" aria-hidden="true">
        {/* Sun in top right corner */}
        <div className="gal-decor-sun">
          <svg viewBox="0 0 100 100" width="80" height="80">
            <circle cx="50" cy="50" r="28" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="3" />
            <line x1="50" y1="10" x2="50" y2="18" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="82" x2="50" y2="90" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
            <line x1="10" y1="50" x2="18" y2="50" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
            <line x1="82" y1="50" x2="90" y2="50" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Drifting Clouds */}
        <div className="gal-decor-cloud cloud-1">
          <svg viewBox="0 0 120 60" width="100" height="50">
            <path d="M 20,45 Q 25,25 45,28 Q 60,15 80,26 Q 100,18 105,45 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="gal-decor-cloud cloud-2">
          <svg viewBox="0 0 120 60" width="90" height="45">
            <path d="M 15,40 Q 25,20 45,25 Q 65,12 85,24 Q 105,18 110,40 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
          </svg>
        </div>
      </div>

      <div className="container">
        {/* Toolbar: Category Chips, Search, Live Count, + Add Photo Button */}
        <GalleryToolbar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          matchCount={filteredPhotos.length}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        {/* Cheerful Success Toast when teacher adds photo */}
        {toastMessage && (
          <div className="gal-toast-banner sticker" role="status" aria-live="polite">
            <span className="gal-toast-icon">📎</span>
            <span className="gal-toast-text">{toastMessage}</span>
            <button
              type="button"
              className="gal-toast-dismiss"
              onClick={() => setToastMessage('')}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        {/* The Clothesline Wall Framework */}
        <div ref={wallContainerRef} className="gal-clothesline-framework">
          {/* Wooden Support Poles (Left & Right on Desktop/Tablet) */}
          <div className="gal-pole gal-pole-left" aria-hidden="true">
            <div className="gal-pole-cap" />
            <div className="gal-pole-timber" />
            {/* Grassy Base Mound with lawn tufts and daisy */}
            <div className="gal-pole-grass">
              <svg viewBox="0 0 84 36" width="84" height="36" fill="none">
                <ellipse cx="42" cy="30" rx="38" ry="6" fill="rgba(35, 42, 92, 0.22)" />
                <ellipse cx="42" cy="24" rx="34" ry="11" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2.5" />
                <path d="M 30 24 Q 34 6, 40 12 Q 44 2, 48 24" fill="#2FA36B" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 44 24 Q 48 4, 54 14 Q 58 8, 62 24" fill="#38A169" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 20 24 Q 24 10, 28 16 Q 32 12, 36 24" fill="#48BB78" stroke="var(--ink)" strokeWidth="1.8" />
                <circle cx="54" cy="20" r="3.5" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.5" />
                <circle cx="54" cy="20" r="1.5" fill="var(--tangerine)" />
                <ellipse cx="24" cy="28" rx="4" ry="2.5" fill="#E2E8F0" stroke="var(--ink)" strokeWidth="1.2" />
              </svg>
            </div>
          </div>
          <div className="gal-pole gal-pole-right" aria-hidden="true">
            <div className="gal-pole-cap" />
            <div className="gal-pole-timber" />
            {/* Grassy Base Mound with lawn tufts and daisy */}
            <div className="gal-pole-grass">
              <svg viewBox="0 0 84 36" width="84" height="36" fill="none">
                <ellipse cx="42" cy="30" rx="38" ry="6" fill="rgba(35, 42, 92, 0.22)" />
                <ellipse cx="42" cy="24" rx="34" ry="11" fill="var(--meadow)" stroke="var(--ink)" strokeWidth="2.5" />
                <path d="M 30 24 Q 34 6, 40 12 Q 44 2, 48 24" fill="#2FA36B" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 44 24 Q 48 4, 54 14 Q 58 8, 62 24" fill="#38A169" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 20 24 Q 24 10, 28 16 Q 32 12, 36 24" fill="#48BB78" stroke="var(--ink)" strokeWidth="1.8" />
                <circle cx="54" cy="20" r="3.5" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="1.5" />
                <circle cx="54" cy="20" r="1.5" fill="var(--tangerine)" />
                <ellipse cx="24" cy="28" rx="4" ry="2.5" fill="#E2E8F0" stroke="var(--ink)" strokeWidth="1.2" />
              </svg>
            </div>
          </div>

          {/* Clothesline Rows Content */}
          {photoRows.length > 0 ? (
            <div className="gal-rows-container">
              {photoRows.map((rowPhotos, rIdx) => (
                <ClotheslineRow
                  key={`row-${rIdx}-${rowPhotos.map((p) => p.id).join('-')}`}
                  photos={rowPhotos}
                  rowIndex={rIdx}
                  isTopRow={rIdx === 0}
                  onPhotoClick={handleOpenPhoto}
                  onRegisterSway={register}
                  onUnregisterSway={unregister}
                  onSetSwayVisible={setVisible}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="gal-empty-state sticker" role="status">
              <div className="gal-empty-rope" aria-hidden="true" />
              <div className="gal-empty-mascot">
                <Mascot mood="sleepy" size={84} />
              </div>
              <h3 className="gal-empty-title">
                Nothing hanging here yet.
              </h3>
              <p className="gal-empty-desc note">
                No moments matched your current filter or search.
              </p>
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="gal-clear-btn"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination "Show more photos" */}
        {hasMore && (
          <div className="gal-pagination-wrap">
            <Button
              variant="ghost"
              onClick={handleShowMore}
              className="gal-show-more-btn"
            >
              Show more photos
            </Button>
            <p className="gal-pagination-note note">
              Showing {visiblePhotos.length} of {renderedPhotos.length} photos
            </p>
          </div>
        )}
      </div>

      {/* Projector Viewer Modal */}
      <ProjectorViewer
        isOpen={viewerOpen}
        onClose={handleCloseViewer}
        currentPhoto={selectedPhoto}
        filteredPhotos={filteredPhotos}
        currentIndex={currentViewerIndex}
        onNavigate={handleViewerNavigate}
        activeCategory={activeCategory}
      />

      {/* Teacher Add Photo Modal */}
      <AddPhotoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPhoto={handleAddPhoto}
      />
    </section>
  );
}

export default GalleryWall;
