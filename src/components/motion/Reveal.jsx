import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Small GSAP utility wrapper for element entrance reveals.
 * Variants: 'pop' (scale with back.out), 'clip' (clip-path wipe), 'rise' (y translation with power2).
 * @param {{
 *   variant?: 'pop' | 'clip' | 'rise',
 *   delay?: number,
 *   duration?: number,
 *   children: React.ReactNode,
 *   className?: string
 * }} props
 */
export function Reveal({
  variant = 'rise',
  delay = 0,
  duration = 0.6,
  children,
  className = '',
}) {
  const elRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion || !elRef.current) return;

    if (variant === 'pop') {
      gsap.fromTo(
        elRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration,
          delay,
          ease: 'back.out(1.8)',
          scrollTrigger: {
            trigger: elRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    } else if (variant === 'clip') {
      gsap.fromTo(
        elRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    } else {
      // 'rise'
      gsap.fromTo(
        elRef.current,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: elRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, { scope: elRef, dependencies: [reducedMotion, variant, delay, duration] });

  return (
    <div ref={elRef} className={`reveal-wrapper reveal-wrapper--${variant} ${className}`}>
      {children}
    </div>
  );
}
