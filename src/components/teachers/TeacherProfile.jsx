import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Modal } from '../ui/Modal';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { Icon } from '../ui/Icon';
import { siteConfig } from '../../config/siteConfig';
import { getTeacherTint } from './teacherTint';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function getInitials(name) {
  if (!name) return 'W';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Staff File Profile Viewer.
 * Manila folder styling with tab, qualifications check-bullets, fun fact,
 * WhatsApp booking, and keyboard/swipe navigation between filtered teachers.
 */
export function TeacherProfile({
  teacher,
  isOpen,
  onClose,
  programs = [],
  teachersList = [],
  onNavigate,
}) {
  const brand = siteConfig.brand?.name || 'Wiggle';
  const reducedMotion = useReducedMotion();
  const folderRef = useRef(null);
  const tabRef = useRef(null);
  const contentRef = useRef(null);
  const [navDirection, setNavDirection] = useState(1); // 1 = next, -1 = prev

  // Pointer swipe state for mobile
  const pointerStartRef = useRef(null);

  // Compute current index in teachersList
  const currentIndex = teacher
    ? teachersList.findIndex((t) => t.slug === teacher.slug)
    : -1;

  const handlePrev = () => {
    if (teachersList.length <= 1) return;
    setNavDirection(-1);
    const prevIdx = (currentIndex - 1 + teachersList.length) % teachersList.length;
    onNavigate(teachersList[prevIdx]);
  };

  const handleNext = () => {
    if (teachersList.length <= 1) return;
    setNavDirection(1);
    const nextIdx = (currentIndex + 1) % teachersList.length;
    onNavigate(teachersList[nextIdx]);
  };

  // Keyboard navigation: ArrowLeft/ArrowRight
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, teachersList]);

  // Folder open entrance animation
  useEffect(() => {
    if (!isOpen || !folderRef.current) return;

    if (reducedMotion) {
      gsap.set([folderRef.current, tabRef.current], { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        folderRef.current,
        { y: 40, scale: 0.96, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.4)' }
      );
      if (tabRef.current) {
        gsap.fromTo(
          tabRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, delay: 0.1, ease: 'power2.out' }
        );
      }
    });

    return () => ctx.revert();
  }, [isOpen, reducedMotion]);

  // Slide transition when switching between teachers
  useEffect(() => {
    if (!isOpen || !contentRef.current || !teacher) return;

    if (reducedMotion) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.1, ease: 'linear' }
      );
      return;
    }

    const startX = navDirection > 0 ? 40 : -40;
    gsap.fromTo(
      contentRef.current,
      { x: startX, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }
    );
  }, [teacher?.slug, navDirection, isOpen, reducedMotion]);

  // Touch / pointer swipe handling (without blocking vertical scroll)
  const onPointerDown = (e) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e) => {
    if (!pointerStartRef.current) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = null;

    // Only trigger if horizontal swipe is dominant and > 50px
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  if (!teacher) return null;

  const tint = getTeacherTint(teacher, programs);
  const firstName = teacher.name.split(' ')[0];
  const waMessage = `Hi ${brand}! I would like to meet ${teacher.name} when I visit.`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="tch-modal-wrapper">
      <div
        ref={folderRef}
        className="tch-folder"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {/* Manila Folder Tab on Top */}
        <div ref={tabRef} className="tch-folder__tab">
          <span className="tch-folder__tab-label">
            STAFF FILE • {firstName.toUpperCase()}
          </span>
          <div className="tch-folder__nav-actions">
            {teachersList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="tch-folder__nav-btn"
                  aria-label="Previous teacher"
                >
                  <Icon name="chevron-left" size={18} />
                </button>
                <span className="tch-folder__count">
                  {currentIndex + 1} / {teachersList.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="tch-folder__nav-btn"
                  aria-label="Next teacher"
                >
                  <Icon name="chevron-right" size={18} />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="tch-folder__close-btn"
              aria-label="Close staff file"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>

        {/* Manila Folder Content Body */}
        <div ref={contentRef} className="tch-folder__content">
          <div className="tch-folder__layout">
            {/* Left Column: Photo & Badges */}
            <div className="tch-folder__media-col">
              <div className="tch-folder__photo-wrap">
                <ResponsiveImage
                  src={teacher.photo}
                  alt={teacher.name}
                  ratio="4:5"
                  tint={tint}
                  label={getInitials(teacher.name)}
                  className="tch-folder__photo"
                />
              </div>

              {teacher.years && (
                <div className="tch-folder__tenure-badge">
                  <Icon name="star" size={16} />
                  <span>{teacher.years} at {brand}</span>
                </div>
              )}
            </div>

            {/* Right Column: Bio, Qualifications, Fun Fact */}
            <div className="tch-folder__info-col">
              <div className="tch-folder__header">
                <div className="tch-folder__program-tag">
                  <span className={`chip chip--active`}>{teacher.program}</span>
                </div>
                <h2 className="tch-folder__name">{teacher.name}</h2>
                <p className="tch-folder__role">{teacher.role}</p>
              </div>

              {/* Bio */}
              <p className="tch-folder__bio">{teacher.bio}</p>

              {/* Qualifications */}
              {teacher.qualifications && teacher.qualifications.length > 0 && (
                <div className="tch-folder__qualifications">
                  <h4 className="tch-folder__subheading">Credentials & certifications</h4>
                  <ul className="tch-folder__qual-list">
                    {teacher.qualifications.map((q, idx) => (
                      <li key={idx} className="tch-folder__qual-item">
                        <span className="tch-folder__check-icon" aria-hidden="true">
                          <Icon name="check" size={16} color="var(--meadow)" />
                        </span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ask me about / Fun Fact */}
              {teacher.funFact && (
                <div className="tch-folder__fun-fact-box">
                  <span className="tch-folder__fun-fact-label">Ask me about:</span>
                  <p className="tch-folder__fun-fact-text">"{teacher.funFact}"</p>
                </div>
              )}

              {/* WhatsApp Action */}
              <div className="tch-folder__actions">
                <WhatsAppButton
                  message={waMessage}
                  label={`Meet ${firstName} on a visit`}
                  variant="primary"
                  className="tch-folder__cta"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
