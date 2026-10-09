import React, { useRef, useEffect } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { teachers } from '../../data/teachers';

/**
 * Section 8: The People (Team Teaser).
 * An overlapping row of tinted circular avatars that fan out on hover/focus.
 */
export function TeamStrip() {
  const containerRef = useRef(null);
  const avatarsRef = useRef([]);
  const reducedMotion = useReducedMotion();

  // First 6 teachers
  const teamMembers = teachers.slice(0, 6);

  const ringColors = [
    'var(--tint-yellow)',
    'var(--tint-pink)',
    'var(--tint-mint)',
    'var(--tint-sky)',
    'var(--tint-yellow)',
    'var(--tint-pink)',
  ];

  // Anime.js fan out on hover / focus
  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    let cleanup = () => {};

    import('animejs')
      .then(({ animate }) => {
        const wrap = containerRef.current;
        const items = avatarsRef.current.filter(Boolean);

        const onEnter = () => {
          items.forEach((item, index) => {
            const spreadOffset = (index - 2.5) * 14;
            const spreadRot = (index - 2.5) * 4;
            animate(item, {
              translateX: spreadOffset,
              rotate: spreadRot,
              scale: 1.06,
              duration: 350,
              ease: 'outQuad',
            });
          });
        };

        const onLeave = () => {
          items.forEach((item) => {
            animate(item, {
              translateX: 0,
              rotate: 0,
              scale: 1,
              duration: 350,
              ease: 'outQuad',
            });
          });
        };

        wrap.addEventListener('mouseenter', onEnter);
        wrap.addEventListener('focusin', onEnter);
        wrap.addEventListener('mouseleave', onLeave);
        wrap.addEventListener('focusout', onLeave);

        cleanup = () => {
          wrap.removeEventListener('mouseenter', onEnter);
          wrap.removeEventListener('focusin', onEnter);
          wrap.removeEventListener('mouseleave', onLeave);
          wrap.removeEventListener('focusout', onLeave);
        };
      })
      .catch(() => {});

    return () => cleanup();
  }, [reducedMotion]);

  return (
    <section className="section section--paper about-team-section" aria-label="Our educators">
      <div className="container">
        <SectionHeading
          title="The people who make the days wiggle"
          note="Guides, listeners and co-explorers"
          align="center"
          wiggle
        />

        <div className="about-team__content">
          {/* Overlapping Avatars Deck */}
          <div
            ref={containerRef}
            className="about-team__avatars"
            tabIndex={0}
            role="region"
            aria-label="Our teaching team overview"
          >
            {teamMembers.map((member, idx) => {
              const ringColor = ringColors[idx % ringColors.length];
              const initials = member.name
                .split(' ')
                .map((n) => n[0])
                .join('');

              return (
                <div
                  key={member.slug}
                  ref={(el) => { avatarsRef.current[idx] = el; }}
                  className={`about-team__avatar-item about-team__avatar-item--${idx}`}
                  style={{ '--ring-color': ringColor }}
                  title={`${member.name} — ${member.role}`}
                >
                  <div className="about-team__avatar-circle">
                    <span className="about-team__avatar-initials">{initials}</span>
                  </div>
                  <span className="about-team__avatar-tooltip note">
                    {member.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Descriptive text & ghost button */}
          <p className="about-team__summary">
            Every educator at Wiggle is certified in early childhood development, pediatric first aid, and the delicate art of listening to toddler stories.
          </p>

          <div className="about-team__action">
            <Button variant="ghost" to="/teachers">
              Meet the teachers
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
