import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from './useReducedMotion';

/**
 * useScrollSway: Measures vertical scroll velocity (compatible with Lenis & native touch)
 * and drives an elastic sway rotation on clothesline photos and mascot.
 * Only updates elements that are currently visible to maintain 60fps performance.
 */
export function useScrollSway() {
  const isReduced = useReducedMotion();
  const subscribersRef = useRef(new Map());
  const rafIdRef = useRef(null);
  const lastScrollYRef = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const velocityRef = useRef(0);

  /**
   * Register a DOM element for scroll sway.
   * @param {string|number} id - Unique identifier
   * @param {HTMLElement} element - Target element for rotation
   * @param {{ multiplier?: number, isVisible?: boolean }} config
   */
  const register = useCallback((id, element, config = {}) => {
    if (!element || isReduced) return;
    const multiplier = config.multiplier ?? (0.7 + (Math.abs(Number(String(id).charCodeAt(0) || 1) % 7) * 0.1));
    const quickSetter = gsap.quickTo(element, 'rotation', {
      duration: 0.8,
      ease: 'elastic.out(1, 0.35)',
    });
    subscribersRef.current.set(id, {
      element,
      multiplier,
      quickSetter,
      isVisible: config.isVisible !== false,
    });
  }, [isReduced]);

  /**
   * Update visibility flag for a subscriber (e.g., from IntersectionObserver).
   */
  const setVisible = useCallback((id, isVisible) => {
    const item = subscribersRef.current.get(id);
    if (item) {
      item.isVisible = isVisible;
    }
  }, []);

  /**
   * Unregister an element on unmount.
   */
  const unregister = useCallback((id) => {
    subscribersRef.current.delete(id);
  }, []);

  useEffect(() => {
    if (isReduced || typeof window === 'undefined') return;

    let isTabVisible = !document.hidden;

    const handleVisibility = () => {
      isTabVisible = !document.hidden;
      lastScrollYRef.current = window.scrollY;
      velocityRef.current = 0;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const tick = () => {
      if (isTabVisible) {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollYRef.current;
        lastScrollYRef.current = currentY;

        // Smooth velocity with damping
        velocityRef.current = velocityRef.current * 0.82 + delta * 0.18;

        // Map velocity to sway angle clamped to +/- 6 degrees
        const targetAngle = Math.max(-6, Math.min(6, velocityRef.current * 0.22));

        // Update each registered element
        subscribersRef.current.forEach((sub) => {
          if (sub.isVisible && sub.quickSetter) {
            sub.quickSetter(targetAngle * sub.multiplier);
          }
        });
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    const subscribers = subscribersRef.current;

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      subscribers.forEach((sub) => {
        if (sub.element) {
          gsap.set(sub.element, { rotation: 0 });
        }
      });
      subscribers.clear();
    };
  }, [isReduced]);

  return { register, unregister, setVisible };
}

export default useScrollSway;
