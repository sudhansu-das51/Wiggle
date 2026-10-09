import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { programs } from '../../data/programs';
import { MQ } from '../../utils/breakpoints';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useLenis } from '../motion/SmoothScroll';
import { SectionHeading } from '../ui/SectionHeading';
import { Mascot } from '../ui/Mascot';
import { TrainSide, TrainFront } from './TrainSvg';
import { StationCard } from './StationCard';
import './programs.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section 2: Pinned horizontal train journey on desktop (MQ.desktopPin),
 * and vertical track progression on tablet/phone.
 */
export function TrainJourney() {
  const sectionRef = useRef(null);
  const desktopSceneRef = useRef(null);
  const worldRef = useRef(null);
  const trainRef = useRef(null);
  const hillsBackRef = useRef(null);
  const hillsMidRef = useRef(null);
  const trackRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const verticalTrackRef = useRef(null);
  const verticalTrainRef = useRef(null);
  const masterTlRef = useRef(null);

  const [activeStation, setActiveStation] = useState(0);
  const [wheelAngle, setWheelAngle] = useState(0);
  const [isBigSchool, setIsBigSchool] = useState(false);
  const [passedStops, setPassedStops] = useState(new Set());

  const reducedMotion = useReducedMotion();
  const isSaveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
  const shouldReduceMotion = reducedMotion || isSaveData;

  const lenis = useLenis();
  const stationCount = programs.length;

  // Master desktop timeline and mobile scroll triggers
  useGSAP(() => {
    if (shouldReduceMotion || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    // --------------------------------------------------------------------------
    // DESKTOP PINNED JOURNEY (MQ.desktopPin)
    // --------------------------------------------------------------------------
    mm.add(MQ.desktopPin, () => {
      const world = worldRef.current;
      const scene = desktopSceneRef.current;
      if (!world || !scene) return;

      const platforms = world.querySelectorAll('.programs-platform');
      const cards = cardsContainerRef.current?.querySelectorAll('.programs-station-card') || [];

      // Measure station x-position using getBoundingClientRect relative to the world
      const getTargetX = (platform) => {
        const trainOffset = scene.offsetWidth * 0.35;
        const worldRect = world.getBoundingClientRect();
        const platRect = platform.getBoundingClientRect();
        const relX = platRect.left - worldRect.left + (platRect.width / 2);
        return -(relX - trainOffset);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${stationCount * 110}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Spin wheels proportional to scroll velocity/progress
            setWheelAngle(self.progress * 360 * stationCount * 3);

            // Active station calculation based on progress segments
            const stepFraction = 1 / (stationCount + 1);
            const currentIdx = Math.min(
              stationCount - 1,
              Math.max(0, Math.floor((self.progress - (stepFraction * 0.15)) / stepFraction))
            );
            setActiveStation(currentIdx);
            setIsBigSchool(self.progress > 0.86);
          },
        },
      });

      masterTlRef.current = tl;

      // Loop through each station: travel -> hold/pop card -> travel to next
      platforms.forEach((platform, idx) => {
        if (platform.classList.contains('programs-platform--school')) return;

        const card = cards[idx];
        const sign = platform.querySelector('.programs-platform-sign');
        const targetX = getTargetX(platform);

        // Travel to this station (duration: 1)
        tl.to(
          world,
          {
            x: targetX,
            ease: 'none',
            duration: 1,
          },
          idx === 0 ? 0 : '+=0.1'
        );

        // Parallax layers (clouds 0.2, hills back 0.4, hills mid 0.7)
        if (hillsBackRef.current) {
          tl.to(hillsBackRef.current, { x: targetX * 0.4, ease: 'none', duration: 1 }, '<');
        }
        if (hillsMidRef.current) {
          tl.to(hillsMidRef.current, { x: targetX * 0.7, ease: 'none', duration: 1 }, '<');
        }
        if (trackRef.current) {
          tl.to(trackRef.current, { backgroundPositionX: targetX * 0.8, ease: 'none', duration: 1 }, '<');
        }

        // Hold at this station
        tl.addLabel(`station-${idx}`);

        // Platform sign drops in
        if (sign) {
          tl.fromTo(
            sign,
            { y: -25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }
          );
        }

        // Station card pops (scale 0.85 to 1, y 30 to 0, back.out(1.7))
        if (card) {
          tl.fromTo(
            card,
            { opacity: 0, scale: 0.85, y: 30, display: 'none', pointerEvents: 'none' },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              display: 'flex',
              pointerEvents: 'auto',
              duration: 0.6,
              ease: 'back.out(1.7)',
            },
            '<'
          );

          // Hold duration
          tl.to({}, { duration: 0.4 });

          // Card eases out (opacity 1 to 0, y 0 to -20) at start of next travel
          if (idx < stationCount - 1) {
            tl.to(card, {
              opacity: 0,
              y: -20,
              pointerEvents: 'none',
              duration: 0.3,
              ease: 'power2.in',
            });
          }
        }
      });

      // Final segment: Roll to "Big School" signpost & gate
      const schoolPlatform = world.querySelector('.programs-platform--school');
      if (schoolPlatform) {
        const schoolTargetX = getTargetX(schoolPlatform);
        const schoolDoors = schoolPlatform.querySelectorAll('.programs-gate-door');

        tl.to(
          world,
          {
            x: schoolTargetX,
            ease: 'none',
            duration: 1,
          },
          '+=0.1'
        );

        if (hillsBackRef.current) {
          tl.to(hillsBackRef.current, { x: schoolTargetX * 0.4, ease: 'none', duration: 1 }, '<');
        }
        if (hillsMidRef.current) {
          tl.to(hillsMidRef.current, { x: schoolTargetX * 0.7, ease: 'none', duration: 1 }, '<');
        }

        tl.addLabel('station-school');

        // Miniature school gate doors swing open
        if (schoolDoors.length >= 2) {
          tl.to(
            schoolDoors[0],
            { transform: 'scaleX(0.2) rotateY(-60deg)', duration: 0.6, ease: 'back.out(1.4)' }
          );
          tl.to(
            schoolDoors[1],
            { transform: 'scaleX(0.2) rotateY(60deg)', duration: 0.6, ease: 'back.out(1.4)' },
            '<'
          );
        }
      }
    });

    // --------------------------------------------------------------------------
    // TABLET & PHONE VERTICAL TRACK (below MQ.desktopPin)
    // --------------------------------------------------------------------------
    mm.add('(max-width: 1023px)', () => {
      const vTrack = verticalTrackRef.current;
      const vTrain = verticalTrainRef.current;
      if (!vTrack || !vTrain) return;

      // Vertical train scrub down the track
      gsap.to(vTrain, {
        y: () => vTrack.offsetHeight - 80,
        ease: 'none',
        scrollTrigger: {
          trigger: vTrack,
          start: 'top 65%',
          end: 'bottom 65%',
          scrub: true,
        },
      });

      // Station stops fill when scrolled into view
      const stops = vTrack.querySelectorAll('.programs-vstop');
      stops.forEach((stop, i) => {
        ScrollTrigger.create({
          trigger: stop,
          start: 'top 70%',
          onEnter: () => {
            setPassedStops((prev) => new Set(prev).add(i));
            setActiveStation(i);
          },
          onLeaveBack: () => {
            setPassedStops((prev) => {
              const next = new Set(prev);
              next.delete(i);
              return next;
            });
          },
        });
      });
    });

    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleRefresh);
    window.addEventListener('orientationchange', handleRefresh);
    document.fonts?.ready?.then(handleRefresh);

    return () => {
      window.removeEventListener('resize', handleRefresh);
      window.removeEventListener('orientationchange', handleRefresh);
      mm.revert();
    };
  }, { scope: sectionRef, dependencies: [shouldReduceMotion, stationCount] });

  // Jump to station handler (supports both Lenis and native smooth scroll)
  const jumpToStation = (stationIdx) => {
    setActiveStation(stationIdx);

    const isDesktop = window.matchMedia(MQ.desktopPin).matches;
    if (isDesktop && masterTlRef.current?.scrollTrigger) {
      const st = masterTlRef.current.scrollTrigger;
      const targetScroll = st.labelToScroll(`station-${stationIdx}`);
      if (typeof targetScroll === 'number') {
        if (lenis) {
          lenis.scrollTo(targetScroll, { duration: 1.2 });
        } else {
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      }
    } else {
      // Mobile: scroll directly to the corresponding card element
      const cardEl = sectionRef.current?.querySelector(
        `[data-station-index="${stationIdx}"]`
      );
      if (cardEl) {
        if (lenis) {
          lenis.scrollTo(cardEl, { offset: -100, duration: 1 });
        } else {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="section section--paper programs-train-section"
      aria-label="Programs train journey"
    >
      {/* Accessible Skip Link */}
      <a href="#compare-board" className="programs-skip-link">
        Skip train and jump to the program comparison
      </a>

      {/* Header */}
      <div className="container programs-train-header">
        <SectionHeading
          title="All aboard the growing-up train"
          note="Four stations, one steady journey from first steps to big school."
          align="center"
          wiggle
        />
      </div>

      {/* ----------------------------------------------------------------------
          DESKTOP PINNED VIEWPORT SCENE (Visible >= 1024px)
          ---------------------------------------------------------------------- */}
      <div
        ref={desktopSceneRef}
        className="programs-train-scene programs-desktop-only"
        aria-hidden={reducedMotion ? 'true' : 'false'}
      >
        {/* Parallax Layer 1: Sky Tint with Sun & Clouds */}
        <div className="programs-sky-layer" aria-hidden="true">
          <div className="programs-sky-sun" />
          <div className="programs-cloud cloud-1" />
          <div className="programs-cloud cloud-2" />
          <div className="programs-cloud cloud-3" />
        </div>

        {/* Parallax Layer 2: Distant Green Rolling Hills (0.2 parallax) */}
        <div ref={hillsBackRef} className="programs-hills-back" aria-hidden="true" />

        {/* Parallax Layer 3: Mid Rolling Hills with Trees (0.45 parallax) */}
        <div ref={hillsMidRef} className="programs-hills-mid" aria-hidden="true" />

        {/* Fixed Position Train (~35% viewport width) */}
        <div ref={trainRef} className="programs-train-fixed" aria-hidden="true">
          <TrainSide wheelAngle={wheelAngle} isCheering={isBigSchool} />
        </div>

        {/* Moving World: Rails, Sleepers, Station Platforms */}
        <div ref={worldRef} className="programs-train-world">
          {/* Rails & Sleepers Track Strip */}
          <div ref={trackRef} className="programs-train-track" aria-hidden="true">
            <div className="programs-rail rail-top" />
            <div className="programs-rail rail-bottom" />
          </div>

          {/* Station Platforms (Dynamic from programs.length) */}
          {programs.map((program, idx) => (
            <div
              key={program.slug}
              className="programs-platform"
              style={{ left: `${(idx + 1) * 920}px` }}
              aria-label={`Station ${idx + 1}: ${program.name}`}
            >
              {/* Wooden Signpost */}
              <div className="programs-platform-sign">
                <span className="programs-platform-sign__post" />
                <div className="programs-platform-sign__board">
                  <span className="programs-platform-sign__number">Station 0{idx + 1}</span>
                  <span className="programs-platform-sign__name">{program.name}</span>
                </div>
              </div>

              {/* Platform Base with Brick Pattern */}
              <div className="programs-platform-base">
                <div className="programs-platform-planks" />
              </div>

              {/* Station Bench & Lantern */}
              <div className="programs-platform-lamp" aria-hidden="true" />
            </div>
          ))}

          {/* Final "Big School" Platform */}
          <div
            className="programs-platform programs-platform--school"
            style={{ left: `${(stationCount + 1) * 920}px` }}
            aria-label="Big school destination"
          >
            <div className="programs-platform-sign">
              <span className="programs-platform-sign__post" />
              <div className="programs-platform-sign__board programs-platform-sign__board--gold">
                <span className="programs-platform-sign__number">Destination</span>
                <span className="programs-platform-sign__name">Big school!</span>
              </div>
            </div>

            {/* Miniature Iconic School Gate Silhouette */}
            <div className="programs-school-gate-mini" aria-hidden="true">
              <div className="programs-gate-arch">
                <span className="programs-gate-flag flag-left" />
                <span className="programs-gate-flag flag-right" />
                <div className="programs-gate-roof" />
              </div>
              <div className="programs-gate-doors">
                <div className={`programs-gate-door door-left ${isBigSchool ? 'is-open' : ''}`} />
                <div className={`programs-gate-door door-right ${isBigSchool ? 'is-open' : ''}`} />
              </div>
              <div className="programs-gate-mascot">
                <Mascot mood="cheer" size={44} />
              </div>
            </div>

            <div className="programs-platform-base">
              <div className="programs-platform-planks" />
            </div>
          </div>
        </div>

        {/* Station Cards Overlay (Fixed on right side of train) */}
        <div ref={cardsContainerRef} className="programs-cards-overlay">
          {programs.map((program, idx) => (
            <StationCard
              key={program.slug}
              program={program}
              stationNumber={idx + 1}
              isActive={activeStation === idx}
              onCardFocus={() => jumpToStation(idx)}
            />
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          DESKTOP PROGRESS CONTROL MINI-BAR
          ---------------------------------------------------------------------- */}
      <nav
        className="container programs-stops-bar programs-desktop-only"
        aria-label="Station quick navigation"
      >
        <div className="programs-stops-track">
          {programs.map((program, idx) => {
            const isActive = activeStation === idx;
            return (
              <button
                key={program.slug}
                type="button"
                className={`programs-stop-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => jumpToStation(idx)}
                aria-label={`Go to ${program.name} station`}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="programs-stop-node">
                  {isActive && (
                    <span className="programs-stop-mascot" aria-hidden="true">
                      <Mascot mood="wave" size={30} />
                    </span>
                  )}
                </span>
                <span className="programs-stop-label">
                  <span className="programs-stop-num">0{idx + 1}</span>
                  {program.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ----------------------------------------------------------------------
          MOBILE & TABLET VERTICAL TRACK VIEW (Visible < 1024px or Reduced Motion)
          ---------------------------------------------------------------------- */}
      <div className="container programs-mobile-journey programs-mobile-only">
        {/* Sticky Quick-Nav Mini Bar on Mobile */}
        <nav className="programs-mobile-sticky-bar" aria-label="Jump to program">
          {programs.map((program, idx) => (
            <button
              key={program.slug}
              type="button"
              className={`chip ${activeStation === idx ? 'chip--active' : ''}`}
              onClick={() => jumpToStation(idx)}
              aria-label={`Jump to ${program.name}`}
            >
              {program.name}
            </button>
          ))}
        </nav>

        {/* Vertical Track Layout */}
        <div ref={verticalTrackRef} className="programs-vtrack-container">
          {/* Vertical Track Rail on Left */}
          <div className="programs-vtrack-line" aria-hidden="true">
            {/* Moving Front Engine (or static at end in reduced motion) */}
            <div
              ref={verticalTrainRef}
              className={`programs-vtrain ${reducedMotion ? 'is-static-end' : ''}`}
            >
              <TrainFront />
            </div>
          </div>

          {/* Program Stations Stream */}
          <div className="programs-vstations-stream">
            {programs.map((program, idx) => {
              const isFilled = passedStops.has(idx) || reducedMotion;
              return (
                <div
                  key={program.slug}
                  data-station-index={idx}
                  className="programs-vstation-row"
                >
                  {/* Stop Node Dot on Track */}
                  <div
                    className={`programs-vstop ${isFilled ? 'is-filled' : ''}`}
                    style={{
                      borderColor: 'var(--ink)',
                      backgroundColor: isFilled ? `var(--tint-${program.tint})` : 'var(--paper)',
                    }}
                    aria-hidden="true"
                  >
                    <span className="programs-vstop-num">0{idx + 1}</span>
                    {activeStation === idx && (
                      <span className="programs-vstop-wig">
                        <Mascot mood="wave" size={26} />
                      </span>
                    )}
                  </div>

                  {/* Program Station Card */}
                  <div className="programs-vstation-content">
                    <StationCard
                      program={program}
                      stationNumber={idx + 1}
                      isActive={true}
                    />
                  </div>
                </div>
              );
            })}

            {/* Final Big School Destination Block */}
            <div className="programs-vstation-row programs-vstation-row--school">
              <div
                className="programs-vstop is-filled"
                style={{ backgroundColor: 'var(--sunny)' }}
                aria-hidden="true"
              >
                ★
              </div>
              <div className="programs-vschool-badge">
                <span className="note">Ready for the world</span>
                <h3>Big school & beyond</h3>
                <p>Equipped with curious minds, gentle empathy, and lifelong love for discovery.</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <Mascot mood="cheer" size={60} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
