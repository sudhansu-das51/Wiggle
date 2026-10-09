import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MQ } from '../utils/breakpoints';
import { useReducedMotion } from './useReducedMotion';

/**
 * Hook for 3D card tilt and holographic shine stripe on fine pointers.
 * Respects reduced motion, save-data, and touch devices.
 *
 * @param {React.RefObject<HTMLElement>} cardRef
 * @param {React.RefObject<HTMLElement>} shineRef
 * @param {number} restingTilt - Default resting 2D rotation angle in degrees (-2 to 2)
 */
export function usePointerTilt(cardRef, shineRef, restingTilt = 0) {
  const reducedMotion = useReducedMotion();
  const quickToRef = useRef({});

  useEffect(() => {
    if (reducedMotion || !cardRef.current) return;

    // Check hoverFine media query
    const isHoverFine = typeof window !== 'undefined' && window.matchMedia(MQ.hoverFine).matches;
    const isSaveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
    if (!isHoverFine || isSaveData) return;

    const el = cardRef.current;
    quickToRef.current = {
      rotX: gsap.quickTo(el, 'rotationX', { duration: 0.25, ease: 'power2.out' }),
      rotY: gsap.quickTo(el, 'rotationY', { duration: 0.25, ease: 'power2.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power2.out' }),
    };

    if (shineRef.current) {
      quickToRef.current.shineX = gsap.quickTo(shineRef.current, 'xPercent', {
        duration: 0.15,
        ease: 'power1.out',
      });
    }

    return () => {
      quickToRef.current = {};
    };
  }, [reducedMotion, cardRef, shineRef]);

  const handlePointerMove = (e) => {
    if (reducedMotion || !cardRef.current) return;
    const isHoverFine = typeof window !== 'undefined' && window.matchMedia(MQ.hoverFine).matches;
    const isSaveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
    if (!isHoverFine || isSaveData) return;

    const rect = cardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1

    const rotX = -normY * 8; // Max 8 degrees tilt on X
    const rotY = normX * 8;  // Max 8 degrees tilt on Y

    if (quickToRef.current.rotX) quickToRef.current.rotX(rotX);
    if (quickToRef.current.rotY) quickToRef.current.rotY(rotY);
    if (quickToRef.current.y) quickToRef.current.y(-6);

    if (quickToRef.current.shineX) {
      // Map -1..1 to -50%..150%
      const shinePercent = normX * 100;
      quickToRef.current.shineX(shinePercent);
    }
  };

  const handlePointerLeave = () => {
    if (reducedMotion || !cardRef.current) return;
    const isHoverFine = typeof window !== 'undefined' && window.matchMedia(MQ.hoverFine).matches;
    if (!isHoverFine) return;

    gsap.to(cardRef.current, {
      rotationX: 0,
      rotationY: 0,
      rotation: restingTilt,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });

    if (shineRef.current) {
      gsap.to(shineRef.current, {
        xPercent: -160,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleFocus = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      y: -6,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (shineRef.current && !reducedMotion) {
      gsap.fromTo(
        shineRef.current,
        { xPercent: -160 },
        { xPercent: 160, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' }
      );
    }
  };

  const handleBlur = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (shineRef.current && !reducedMotion) {
      gsap.to(shineRef.current, {
        xPercent: -160,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  return {
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
}
