import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { CampusMap } from './CampusMap';
import { Icon } from '../ui/Icon';
import { TransitionLink } from '../motion/TransitionLink';
import { hotspots } from '../../data/safetyMap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import gsap from 'gsap';

/**
 * Section 3: The Safety Tour (Campus Tour State Machine & Info Panel).
 * Coordinates guided walk timeline across 7 safety hotspots with controls.
 */
export function CampusTour() {
  const [activeId, setActiveId] = useState(hotspots[0]?.id || 'gate');
  const [visitedIds, setVisitedIds] = useState(() => new Set(['gate']));
  const [tourState, setTourState] = useState('idle'); // 'idle' | 'touring' | 'paused' | 'done'
  const [wigPosition, setWigPosition] = useState({
    x: hotspots[0]?.x || 50,
    y: hotspots[0]?.y || 88,
    facingLeft: false,
    isCheering: false,
  });

  const tourTimelineRef = useRef(null);
  const activeSpot = hotspots.find((h) => h.id === activeId) || hotspots[0];
  const isReduced = useReducedMotion();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tourTimelineRef.current) {
        tourTimelineRef.current.kill();
      }
    };
  }, []);

  // Update Wig position smoothly or directly
  const moveToHotspot = useCallback((targetSpot, prevSpot) => {
    const isMovingLeft = prevSpot ? targetSpot.x < prevSpot.x : false;
    setWigPosition((prev) => ({
      ...prev,
      x: targetSpot.x,
      y: targetSpot.y,
      facingLeft: isMovingLeft,
      isCheering: false,
    }));
  }, []);

  // Hotspot manual selection
  const handleSelectHotspot = (id) => {
    const spot = hotspots.find((h) => h.id === id);
    if (!spot) return;

    // If currently touring, pause the tour at this spot
    if (tourState === 'touring') {
      if (tourTimelineRef.current) {
        tourTimelineRef.current.pause();
      }
      setTourState('paused');
    }

    setActiveId(id);
    setVisitedIds((prev) => new Set([...prev, id]));
    moveToHotspot(spot, activeSpot);
  };

  // Start the guided tour timeline
  const startTour = () => {
    if (tourTimelineRef.current) {
      tourTimelineRef.current.kill();
    }

    setTourState('touring');
    const newVisited = new Set();
    setVisitedIds(newVisited);

    if (isReduced) {
      // Step-by-step without tweens
      const first = hotspots[0];
      setActiveId(first.id);
      newVisited.add(first.id);
      setVisitedIds(new Set(newVisited));
      moveToHotspot(first, null);
      return;
    }

    const masterTl = gsap.timeline({
      onComplete: () => {
        setTourState('done');
        setWigPosition((prev) => ({ ...prev, isCheering: true }));
      },
    });

    tourTimelineRef.current = masterTl;

    // Iterate through hotspots in tour order
    hotspots.forEach((spot, idx) => {
      const label = `spot-${spot.id}`;
      masterTl.addLabel(label);

      // 1. Move Wig to hotspot
      masterTl.to(
        {},
        {
          duration: idx === 0 ? 0.3 : 1.1,
          ease: 'power2.inOut',
          onStart: () => {
            const prevSpot = idx > 0 ? hotspots[idx - 1] : null;
            moveToHotspot(spot, prevSpot);
          },
        }
      );

      // 2. Pause & examine spot
      masterTl.to(
        {},
        {
          duration: 2.2,
          onStart: () => {
            setActiveId(spot.id);
            setVisitedIds((prev) => new Set([...prev, spot.id]));
          },
        }
      );
    });
  };

  const pauseTour = () => {
    if (tourTimelineRef.current) {
      tourTimelineRef.current.pause();
      setTourState('paused');
    }
  };

  const resumeTour = () => {
    if (tourTimelineRef.current) {
      tourTimelineRef.current.resume();
      setTourState('touring');
    } else {
      startTour();
    }
  };

  const nextSpot = () => {
    const currentIdx = hotspots.findIndex((h) => h.id === activeId);
    const nextIdx = (currentIdx + 1) % hotspots.length;
    const nextHotspot = hotspots[nextIdx];

    if (tourTimelineRef.current && tourTimelineRef.current.isActive()) {
      tourTimelineRef.current.seek(`spot-${nextHotspot.id}`);
    } else {
      handleSelectHotspot(nextHotspot.id);
    }
  };

  const stopTour = () => {
    if (tourTimelineRef.current) {
      tourTimelineRef.current.kill();
    }
    setTourState('idle');
    const gateSpot = hotspots[0];
    setActiveId(gateSpot.id);
    setWigPosition({
      x: gateSpot.x,
      y: gateSpot.y,
      facingLeft: false,
      isCheering: false,
    });
  };

  return (
    <section
      id="tour"
      className="section section--mint why-tour-section"
      aria-label="Campus safety tour"
    >
      <div className="container">
        <SectionHeading
          title="Walk the campus with us"
          note="Tap a spot, or take the tour."
          align="center"
          wiggle
        />

        <div className="why-tour-layout">
          {/* Left Column: Campus Map */}
          <div className="why-map-col">
            <CampusMap
              hotspots={hotspots}
              activeId={activeId}
              visitedIds={visitedIds}
              onSelectHotspot={handleSelectHotspot}
              isTouring={tourState === 'touring'}
              wigPosition={wigPosition}
              isReduced={isReduced}
            />
          </div>

          {/* Right Column: Tour Info Panel & Controls */}
          <div className="why-tour-panel-col">
            <div
              className="why-tour-info-card sticker"
              role="region"
              aria-live="polite"
              aria-label="Spot inspection details"
            >
              {/* Card Top Pill Badge */}
              <div className="why-tour-spot-header">
                <div
                  className="why-tour-icon-bubble"
                  style={{ backgroundColor: 'var(--tint-yellow)' }}
                  aria-hidden="true"
                >
                  <Icon name={activeSpot.icon} size={24} color="var(--ink)" />
                </div>
                <div className="why-tour-spot-meta">
                  <span className="why-tour-label-chip chip">{activeSpot.label}</span>
                  <span className="why-tour-step-badge note">
                    Spot {hotspots.findIndex((h) => h.id === activeId) + 1} of {hotspots.length}
                  </span>
                </div>
              </div>

              {/* Title and Inspection Description */}
              <h3 className="why-tour-spot-title">{activeSpot.title}</h3>
              <p className="why-tour-spot-text">{activeSpot.text}</p>

              {/* Facility Deep-dive Link */}
              {activeSpot.link && (
                <div className="why-tour-link-wrap">
                  <TransitionLink
                    to={activeSpot.link}
                    className="btn btn--secondary why-tour-facility-btn"
                  >
                    <span>See our facilities</span>
                  </TransitionLink>
                </div>
              )}

              {/* Tour Progress Bar & Count */}
              <div className="why-tour-progress-wrap">
                <div className="why-tour-progress-text note">
                  {visitedIds.size} of {hotspots.length} spots checked
                </div>
                <div className="why-tour-progress-bar">
                  <div
                    className="why-tour-progress-fill"
                    style={{
                      width: `${(visitedIds.size / hotspots.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Completion Message when tour is done */}
              {tourState === 'done' && (
                <div className="why-tour-complete-banner sticker" aria-live="polite">
                  <span className="why-complete-text note">
                    🎉 Campus checked. Safe and sound!
                  </span>
                </div>
              )}

              {/* Tour Navigation Controls */}
              <div className="why-tour-controls" role="group" aria-label="Tour controls">
                {tourState === 'idle' && (
                  <button
                    type="button"
                    className="btn btn--ink why-tour-btn"
                    onClick={startTour}
                  >
                    <span>Take the safety tour</span>
                  </button>
                )}

                {tourState === 'touring' && (
                  <div className="why-controls-row">
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={pauseTour}
                      aria-label="Pause tour"
                    >
                      <span>Pause</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={nextSpot}
                      aria-label="Next spot"
                    >
                      <span>Next</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={stopTour}
                      aria-label="Stop tour"
                    >
                      <span>Stop</span>
                    </button>
                  </div>
                )}

                {tourState === 'paused' && (
                  <div className="why-controls-row">
                    <button
                      type="button"
                      className="btn btn--ink"
                      onClick={resumeTour}
                      aria-label="Resume tour"
                    >
                      <span>Resume</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={nextSpot}
                      aria-label="Next spot"
                    >
                      <span>Next</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={stopTour}
                      aria-label="Stop tour"
                    >
                      <span>Stop</span>
                    </button>
                  </div>
                )}

                {tourState === 'done' && (
                  <button
                    type="button"
                    className="btn btn--ink why-tour-btn"
                    onClick={startTour}
                  >
                    <span>Retake the tour</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CampusTour;
