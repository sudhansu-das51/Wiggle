import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { testimonials } from '../../data/testimonials';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../ui/Icon';
import './home.css';

/**
 * Section 10: Testimonial Bubbles.
 * Speech bubble cards with organic tails, accessible arrows, dots, and 7s autoplay.
 */
export function TestimonialBubbles() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const total = testimonials.length;

  // Next / Prev slide handlers with GSAP crossfade
  const goToSlide = useCallback((newIndex) => {
    const nextIdx = (newIndex + total) % total;

    if (!reducedMotion && trackRef.current) {
      gsap.fromTo(
        trackRef.current,
        { opacity: 0.4, x: newIndex > currentIndex ? 20 : -20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }

    setCurrentIndex(nextIdx);
  }, [currentIndex, reducedMotion, total]);

  // 7s Autoplay timer
  useEffect(() => {
    if (reducedMotion || isPaused) return;

    const timer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 7000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, reducedMotion, goToSlide]);

  // Two items visible on desktop
  const visibleItems = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % total],
  ];

  return (
    <section
      className="section section--mint"
      aria-label="Parent Testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="container">
        <SectionHeading
          title="Notes from parents"
          note="Honest words from families who walked this journey before you."
          align="center"
          wiggle
        />

        <div className="testimonial-bubbles__slider">
          <div ref={trackRef} className="testimonial-bubbles__track">
            {visibleItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="testimonial-bubble">
                <p style={{ fontSize: '1.08rem', lineHeight: 1.65, color: 'var(--ink)' }}>
                  "{item.quote}"
                </p>

                <div>
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--ink)' }}>
                    {item.parentName}
                  </h4>
                  <span className="note" style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                    {item.relation}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Slider controls: Previous, Dots, Next */}
          <div className="testimonial-bubbles__controls">
            <button
              type="button"
              className="testimonial-bubbles__arrow"
              onClick={() => goToSlide(currentIndex - 1)}
              aria-label="Previous testimonial"
            >
              <Icon name="chevron-left" size={20} color="var(--ink)" />
            </button>

            <div className="testimonial-bubbles__dots" role="tablist" aria-label="Testimonial slides">
              {testimonials.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  className={`testimonial-bubbles__dot ${dotIdx === currentIndex ? 'is-active' : ''}`}
                  onClick={() => goToSlide(dotIdx)}
                  aria-label={`Go to testimonial ${dotIdx + 1}`}
                  aria-selected={dotIdx === currentIndex}
                  role="tab"
                />
              ))}
            </div>

            <button
              type="button"
              className="testimonial-bubbles__arrow"
              onClick={() => goToSlide(currentIndex + 1)}
              aria-label="Next testimonial"
            >
              <Icon name="chevron-right" size={20} color="var(--ink)" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
