import React, { useState, useRef, useEffect } from 'react';
import { FacilityScene } from './scenes';
import { Icon } from '../ui/Icon';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { animate } from 'animejs';

gsap.registerPlugin(ScrollTrigger);

/**
 * Room component: Renders one cutaway facility room with its illustrated interior,
 * light switch, dark overlay (for indoor rooms), and hanging placard.
 */
export function Room({
  facility,
  index,
  isActive = false,
  onIntersect,
  isSingleVisibleActive = true,
}) {
  const isIndoor = facility.indoor !== false;
  const isReduced = useReducedMotion();

  // If reduced motion, room starts lit with overlay off
  const [isLit, setIsLit] = useState(isReduced || !isIndoor);
  const [isVisible, setIsVisible] = useState(false);

  const roomRef = useRef(null);
  const illustrationWrapRef = useRef(null);
  const overlayRef = useRef(null);
  const switchLeverRef = useRef(null);
  const placardRef = useRef(null);
  const hasTriggeredInitialLight = useRef(false);

  // 1. IntersectionObserver to detect visibility for Anime.js loops & Lift position
  useEffect(() => {
    const el = roomRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inView = entry.isIntersecting && entry.intersectionRatio >= 0.35;
          setIsVisible(inView);
          if (onIntersect) {
            onIntersect(facility.slug, entry);
          }
        });
      },
      { threshold: [0, 0.35, 0.6, 1.0] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [facility.slug, onIntersect]);

  // 2. GSAP ScrollTrigger: Initial Lights On sequence
  useGSAP(() => {
    if (isReduced || !roomRef.current) return;

    ScrollTrigger.create({
      trigger: roomRef.current,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        hasTriggeredInitialLight.current = true;

        if (isIndoor) {
          // Switch lever rotates to ON
          if (switchLeverRef.current) {
            gsap.to(switchLeverRef.current, {
              rotate: 20,
              duration: 0.2,
              ease: 'power2.out',
            });
          }

          // Dark overlay flicker sequence (0.85 -> 0.35 -> 0.7 -> 0)
          if (overlayRef.current) {
            const tl = gsap.timeline({
              onComplete: () => setIsLit(true),
            });
            tl.to(overlayRef.current, { opacity: 0.35, duration: 0.12, ease: 'rough' })
              .to(overlayRef.current, { opacity: 0.7, duration: 0.15, ease: 'rough' })
              .to(overlayRef.current, { opacity: 0.2, duration: 0.14, ease: 'rough' })
              .to(overlayRef.current, { opacity: 0, duration: 0.28, ease: 'power2.out' });
          } else {
            setIsLit(true);
          }
        } else {
          // Outdoor: lights already considered on
          setIsLit(true);
        }

        // Placard tiny rope swing on first arrival
        if (placardRef.current) {
          animate(placardRef.current, {
            rotate: [0, 1.8, -1.2, 0.6, 0],
            duration: 650,
            ease: 'inOutQuad',
          });
        }
      },
    });
  }, { scope: roomRef, dependencies: [isReduced, isIndoor] });

  // 3. Manual Light Switch Toggle
  const handleToggleLights = () => {
    if (!isIndoor) return;
    const nextLit = !isLit;
    setIsLit(nextLit);

    if (switchLeverRef.current && !isReduced) {
      gsap.to(switchLeverRef.current, {
        rotate: nextLit ? 20 : -20,
        duration: 0.2,
        ease: 'power2.out',
      });
    }

    if (overlayRef.current && !isReduced) {
      gsap.to(overlayRef.current, {
        opacity: nextLit ? 0 : 0.8,
        duration: 0.25,
        ease: 'power2.out',
      });
    }
  };

  // 4. Placard micro-interaction on hover/focus/tap
  const handlePlacardInteraction = () => {
    if (isReduced || !placardRef.current) return;
    animate(placardRef.current, {
      rotate: [0, 1.5, -1, 0],
      duration: 550,
      ease: 'inOutQuad',
    });
  };

  const isEven = index % 2 === 0;

  // Active loop condition:
  // Must be lit, on-screen, not reduced motion, and on phones must be single visible active room
  const isLoopRunning = isLit && isVisible && !isReduced && isSingleVisibleActive;

  return (
    <div
      ref={roomRef}
      id={`room-${facility.slug}`}
      className={`fac-room-card ${isEven ? 'fac-room--even' : 'fac-room--odd'} ${isActive ? 'fac-room--active' : ''}`}
      data-room-index={index}
      data-room-slug={facility.slug}
    >
      {/* Floor Dividing Line */}
      {index > 0 && <div className="fac-floor-divider" aria-hidden="true" />}

      <div className="fac-room-inner">
        {/* ================= Room Stage (Illustration or Photo, 60% Desktop) ================= */}
        <div
          ref={illustrationWrapRef}
          className={`fac-room-stage ${isIndoor ? 'fac-stage--indoor' : 'fac-stage--outdoor'}`}
        >
          {/* Real Light Switch Button (Indoor rooms only, when not a real photo) */}
          {isIndoor && !facility.image && (
            <button
              type="button"
              className="fac-light-switch"
              onClick={handleToggleLights}
              aria-pressed={isLit}
              aria-label={`${facility.name} lights`}
              title={isLit ? 'Turn lights off' : 'Turn lights on'}
            >
              <div className="fac-switch-plate">
                <div className="fac-switch-screw fac-screw-top" />
                <div
                  ref={switchLeverRef}
                  className={`fac-switch-lever ${isLit ? 'fac-lever--on' : 'fac-lever--off'}`}
                />
                <div className="fac-switch-screw fac-screw-bottom" />
              </div>
              <span className="fac-switch-label note">
                {isLit ? 'Lights on' : 'Lights off'}
              </span>
            </button>
          )}

          {/* Scene / Photo Interior */}
          <div className="fac-scene-wrap">
            {facility.image ? (
              <img
                src={facility.image}
                alt={facility.name}
                className="fac-photo-image"
                loading="lazy"
              />
            ) : (
              <FacilityScene
                scene={facility.scene}
                icon={facility.icon}
                tint={facility.tint}
                isLit={isLit}
                isVisible={isLoopRunning}
                isReduced={isReduced}
              />
            )}
          </div>

          {/* Dark "Lights Off" Overlay (Covers illustration only, when not a real photo) */}
          {isIndoor && !facility.image && (
            <div
              ref={overlayRef}
              className={`fac-dark-overlay ${isLit ? 'fac-overlay--lit' : 'fac-overlay--dark'}`}
              aria-hidden="true"
            >
              <div className="fac-dark-indicator">
                <Icon name="sun" size={20} color="var(--paper)" />
                <span className="note">Tap switch to light room</span>
              </div>
            </div>
          )}
        </div>

        {/* ================= Hanging Placard (40% Desktop) ================= */}
        <div className="fac-placard-wrap">
          {/* Two Hanging Ropes */}
          <div className="fac-placard-ropes" aria-hidden="true">
            <span className="fac-rope fac-rope-left" />
            <span className="fac-rope fac-rope-right" />
          </div>

          {/* Real HTML Placard Card (Never dimmed) */}
          <article
            ref={placardRef}
            className="fac-placard sticker"
            onMouseEnter={handlePlacardInteraction}
            onFocus={handlePlacardInteraction}
            tabIndex={0}
            aria-label={`${facility.name} placard`}
          >
            {/* Top Header: Icon bubble + Location Chip */}
            <div className="fac-placard-header">
              <div
                className="fac-placard-icon-bubble"
                style={{ backgroundColor: `var(--tint-${facility.tint})` }}
                aria-hidden="true"
              >
                <Icon name={facility.icon} size={26} color="var(--ink)" />
              </div>

              <div className="fac-placard-meta">
                <span className="fac-location-chip chip">{facility.location}</span>
                <span className="fac-room-number note">Room {index + 1}</span>
              </div>
            </div>

            {/* Room Name */}
            <h3 className="fac-placard-title">{facility.name}</h3>

            {/* Description */}
            <p className="fac-placard-desc">{facility.description}</p>

            {/* 3 Concrete Details with Meadow Checkmarks */}
            <ul className="fac-details-list">
              {facility.details.map((detail, dIdx) => (
                <li key={dIdx} className="fac-detail-item">
                  <span className="fac-check-bubble" aria-hidden="true">
                    <Icon name="check" size={14} color="var(--paper)" />
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>

            {/* Handwritten charming note on small rotated sticky note */}
            {facility.note && (
              <div className="fac-placard-sticky note" aria-label={`Note: ${facility.note}`}>
                <span className="fac-sticky-tape tape" aria-hidden="true" />
                <p>"{facility.note}"</p>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}

export default Room;
