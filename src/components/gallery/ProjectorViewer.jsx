import React, { useEffect, useRef, useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { Icon } from '../ui/Icon';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import gsap from 'gsap';

function formatGalleryDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const mIdx = parseInt(month, 10) - 1;
  return `${months[mIdx] || month} ${year}`;
}

/**
 * ProjectorViewer: A slide projector viewer styled as a pulled-down projection screen.
 * Loops within current filtered photo list, supports keyboard navigation, touch swipes,
 * and dialog accessibility via shared Modal.
 */
export function ProjectorViewer({
  isOpen,
  onClose,
  currentPhoto,
  filteredPhotos = [],
  currentIndex = 0,
  onNavigate,
  activeCategory = 'All',
}) {
  const isReduced = useReducedMotion();
  const screenRef = useRef(null);
  const slideContentRef = useRef(null);
  const pointerStartRef = useRef(null);

  const total = filteredPhotos.length;

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    const nextIdx = (currentIndex - 1 + total) % total;
    onNavigate(nextIdx, 'prev');
  }, [currentIndex, total, onNavigate]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    const nextIdx = (currentIndex + 1) % total;
    onNavigate(nextIdx, 'next');
  }, [currentIndex, total, onNavigate]);

  const handleHome = useCallback(() => {
    onNavigate(0, 'home');
  }, [onNavigate]);

  const handleEnd = useCallback(() => {
    onNavigate(total - 1, 'end');
  }, [total, onNavigate]);

  // 1. Keyboard shortcuts (ArrowLeft, ArrowRight, Home, End)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleHome();
      } else if (e.key === 'End') {
        e.preventDefault();
        handleEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, handleHome, handleEnd]);

  // 2. Entrance pull-down animation for projector screen
  useEffect(() => {
    if (!isOpen || isReduced || !screenRef.current) return;

    gsap.fromTo(
      screenRef.current,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }
    );
  }, [isOpen, isReduced]);

  // 3. Touch swipe gesture detection
  const handlePointerDown = (e) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    if (!pointerStartRef.current) return;
    const diffX = e.clientX - pointerStartRef.current.x;
    const diffY = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = null;

    // Trigger only if horizontal swipe exceeds 50px and dominates vertical movement
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  if (!isOpen || !currentPhoto) return null;

  const formattedDate = formatGalleryDate(currentPhoto.date);
  const counterCategory = activeCategory === 'All' ? 'in Gallery' : `in ${activeCategory}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="gal-projector-modal-wrap"
    >
      {/* Light cone rising from bottom of backdrop */}
      <div className="gal-light-cone" aria-hidden="true" />

      {/* Pulled-down Projector Screen Assembly */}
      <div
        ref={screenRef}
        className="gal-projector-screen sticker"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Projector Top Mounting Roller Bar */}
        <div className="gal-projector-roller" aria-hidden="true">
          <span className="gal-roller-cap cap-left" />
          <div className="gal-roller-tube" />
          <span className="gal-roller-cap cap-right" />
        </div>

        {/* Screen Top Header Bar: Counter, Category Chip, Close Button */}
        <div className="gal-projector-header">
          <div className="gal-header-meta">
            <span className="gal-category-chip chip">{currentPhoto.category}</span>
            <span className="gal-photo-counter note">
              {currentIndex + 1} of {total} {counterCategory}
            </span>
          </div>

          <button
            type="button"
            className="gal-close-btn"
            onClick={onClose}
            aria-label="Close projector screen"
          >
            <Icon name="close" size={22} color="var(--ink)" />
          </button>
        </div>

        {/* Main Slide Content Canvas */}
        <div ref={slideContentRef} className="gal-slide-canvas">
          {/* Main Photo (Never cropped, max-height 80svh) */}
          <div className="gal-slide-image-wrap">
            <ResponsiveImage
              src={currentPhoto.image}
              alt={currentPhoto.alt}
              ratio={currentPhoto.ratio || 'landscape'}
              tint={currentPhoto.tint || 'yellow'}
              className="gal-slide-img"
            />
          </div>

          {/* Slide Caption & Title Info */}
          <div className="gal-slide-info">
            <h3 className="gal-slide-title">
              {currentPhoto.title}
            </h3>
            <p className="gal-slide-caption note">
              "{currentPhoto.caption}"
            </p>
            {formattedDate && (
              <span className="gal-slide-date">
                {formattedDate}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Controls: Previous, Pull-string, Next */}
        <div className="gal-projector-controls">
          <button
            type="button"
            className="gal-nav-btn gal-nav-prev"
            onClick={handlePrev}
            aria-label="Previous photo (ArrowLeft)"
          >
            <Icon name="arrowLeft" size={22} color="var(--ink)" />
          </button>

          {/* Decorative Screen Pull-Ring Handle */}
          <div className="gal-screen-pull-handle" aria-hidden="true">
            <span className="gal-pull-cord" />
            <span className="gal-pull-ring" />
          </div>

          <button
            type="button"
            className="gal-nav-btn gal-nav-next"
            onClick={handleNext}
            aria-label="Next photo (ArrowRight)"
          >
            <Icon name="arrowRight" size={22} color="var(--ink)" />
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ProjectorViewer;
