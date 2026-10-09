import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { getEventStart, getEventEnd } from '../../utils/calendar';

/**
 * Split flap digit card for days, hours, or minutes.
 */
function SplitFlapCard({ value, label, reducedMotion }) {
  const prevValRef = useRef(value);
  const [displayedPrev, setDisplayedPrev] = useState(value);
  const topFlapRef = useRef(null);
  const bottomFlapRef = useRef(null);

  useEffect(() => {
    if (prevValRef.current === value) return;

    const oldVal = prevValRef.current;
    prevValRef.current = value;

    if (reducedMotion) {
      return;
    }

    const topEl = topFlapRef.current;
    const bottomEl = bottomFlapRef.current;
    if (!topEl || !bottomEl) return;

    setDisplayedPrev(oldVal);
    gsap.killTweensOf([topEl, bottomEl]);

    // Reset initial transforms
    gsap.set(topEl, { rotateX: 0, transformOrigin: '50% 100%' });
    gsap.set(bottomEl, { rotateX: 90, transformOrigin: '50% 0%' });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(topEl, { rotateX: 0 });
        gsap.set(bottomEl, { rotateX: 0 });
      },
    });

    tl.to(topEl, {
      rotateX: -90,
      duration: 0.25,
      ease: 'power2.in',
    }).to(
      bottomEl,
      {
        rotateX: 0,
        duration: 0.25,
        ease: 'power2.out',
      },
      '-=0.05'
    );

    return () => {
      tl.kill();
    };
  }, [value, reducedMotion]);

  const formattedVal = String(value).padStart(2, '0');
  const formattedPrev = String(displayedPrev).padStart(2, '0');

  return (
    <div className="evt-flip-unit">
      <div className="evt-flip-card" aria-hidden="true">
        {/* Underlying static new value */}
        <div className="evt-flip-half evt-flip-half--top">
          <span>{formattedVal}</span>
        </div>
        <div className="evt-flip-half evt-flip-half--bottom">
          <span>{formattedVal}</span>
        </div>

        {/* Animated flipping overlays */}
        <div className="evt-flip-flap evt-flip-flap--top" ref={topFlapRef}>
          <span>{formattedPrev}</span>
        </div>
        <div className="evt-flip-flap evt-flip-flap--bottom" ref={bottomFlapRef}>
          <span>{formattedVal}</span>
        </div>

        {/* Split line */}
        <div className="evt-flip-split" />
      </div>
      <span className="evt-flip-label">{label}</span>
    </div>
  );
}

/**
 * Flip Countdown timer for the Next Up event.
 * Shows Days, Hours, Minutes, or "Happening now".
 *
 * @param {{
 *   event: Object,
 *   className?: string
 * }} props
 */
export function FlipCountdown({ event, className = '' }) {
  const containerRef = useRef(null);
  const systemReducedMotion = useReducedMotion();
  const isSaveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
  const reducedMotion = systemReducedMotion || isSaveData;

  const calculateTimeLeft = useCallback(() => {
    if (!event) return { status: 'none' };

    const now = new Date();
    const start = getEventStart(event);
    const end = getEventEnd(event);

    if (now >= start && now <= end) {
      return { status: 'in-progress' };
    }
    if (now > end) {
      return { status: 'ended' };
    }

    const totalSeconds = Math.max(0, Math.floor((start.getTime() - now.getTime()) / 1000));
    const isToday =
      now.getFullYear() === start.getFullYear() &&
      now.getMonth() === start.getMonth() &&
      now.getDate() === start.getDate();

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return {
      status: 'upcoming',
      isToday,
      days,
      hours,
      minutes,
    };
  }, [event]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  const isVisibleRef = useRef(true);
  const isIntersectingRef = useRef(true);

  // Interval updates every 30 seconds, pauses when hidden or offscreen
  useEffect(() => {
    let timerId = null;

    const tick = () => {
      if (isVisibleRef.current && isIntersectingRef.current) {
        setTimeLeft(calculateTimeLeft());
      }
    };

    // Immediate check
    tick();

    timerId = setInterval(tick, 30000);

    const handleVisibility = () => {
      const visible = document.visibilityState === 'visible';
      isVisibleRef.current = visible;
      if (visible) {
        // Recompute immediately from current time
        tick();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    let observer = null;
    if (typeof IntersectionObserver !== 'undefined' && containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isIntersectingRef.current = entry?.isIntersecting ?? true;
          if (entry?.isIntersecting) {
            tick();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      if (timerId) clearInterval(timerId);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (observer) observer.disconnect();
    };
  }, [calculateTimeLeft]);

  if (!event || timeLeft.status === 'none') {
    return null;
  }

  if (timeLeft.status === 'in-progress') {
    return (
      <div className={`evt-countdown evt-countdown--in-progress ${className}`} ref={containerRef}>
        <div className="evt-countdown__live-badge">
          <span className="evt-countdown__pulse-dot" aria-hidden="true" />
          <span className="evt-countdown__live-text">Happening now</span>
        </div>
      </div>
    );
  }

  if (timeLeft.status === 'ended') {
    return (
      <div className={`evt-countdown evt-countdown--ended ${className}`} ref={containerRef}>
        <span className="note">This event has concluded.</span>
      </div>
    );
  }

  const { isToday, days, hours, minutes } = timeLeft;
  const sentenceText = isToday
    ? `${hours} hours and ${minutes} minutes to go`
    : `${days} days, ${hours} hours and ${minutes} minutes to go`;

  return (
    <div className={`evt-countdown ${className}`} ref={containerRef}>
      {/* Accessible screen-reader live announcement */}
      <span className="sr-only" aria-live="polite">
        {sentenceText}
      </span>

      <div className="evt-countdown__grid" role="timer" aria-label="Countdown to event">
        {!isToday && (
          <SplitFlapCard
            value={days}
            label="Days"
            reducedMotion={reducedMotion}
          />
        )}
        <SplitFlapCard
          value={hours}
          label="Hours"
          reducedMotion={reducedMotion}
        />
        <SplitFlapCard
          value={minutes}
          label="Minutes"
          reducedMotion={reducedMotion}
        />
      </div>
    </div>
  );
}

export default FlipCountdown;
