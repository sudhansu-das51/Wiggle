import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTransition } from './TransitionContext';
import { useLenis } from './SmoothScroll';
import { Mascot } from '../ui/Mascot';
import './PageTransition.css';

/**
 * The "School Gate" curtain route transition.
 * Closes two illustrated colored gate doors to center, navigates, resets scroll,
 * and swings doors open smoothly.
 */
export function PageTransition() {
  const containerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const seamRef = useRef(null);

  const navigate = useNavigate();
  const lenis = useLenis();
  const { isTransitioning, registerTransitionRunner } = useTransition();

  useEffect(() => {
    // Register the animation callback with TransitionContext
    const runner = (to, onComplete) => {
      const tl = gsap.timeline();

      // Step 1: Close panels to center
      tl.to([leftPanelRef.current, rightPanelRef.current], {
        x: '0%',
        duration: 0.55,
        ease: 'power3.inOut',
      })
      .to(seamRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
      }, '-=0.2')
      .add(() => {
        // Step 2: Navigate to new route
        navigate(to);

        // Reset scroll position immediately
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }

        ScrollTrigger.refresh();
      }, '+=0.05')
      // Step 3: Open panels back outwards
      .to(seamRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
      })
      .to(leftPanelRef.current, {
        x: '-102%',
        duration: 0.6,
        ease: 'power3.inOut',
      })
      .to(rightPanelRef.current, {
        x: '102%',
        duration: 0.6,
        ease: 'power3.inOut',
      }, '<')
      .add(() => {
        ScrollTrigger.refresh();
        if (onComplete) onComplete();
      });
    };

    registerTransitionRunner(runner);
  }, [navigate, lenis, registerTransitionRunner]);

  return (
    <div
      ref={containerRef}
      className={`page-transition-curtain ${isTransitioning ? 'is-active' : ''}`}
      aria-hidden="true"
    >
      <div ref={leftPanelRef} className="page-transition__panel page-transition__panel--left" />
      <div ref={rightPanelRef} className="page-transition__panel page-transition__panel--right" />
      <div ref={seamRef} className="page-transition__seam">
        <Mascot mood="peek" size={80} />
      </div>
    </div>
  );
}
