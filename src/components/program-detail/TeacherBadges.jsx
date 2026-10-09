import React, { useRef, useEffect } from 'react';
import { teachers } from '../../data/teachers';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Mascot } from '../ui/Mascot';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './program-detail.css';

/**
 * Section 6: Staff ID Badges hanging from lanyards with pendulum swing.
 * @param {{
 *   program: {
 *     name: string
 *   }
 * }} props
 */
export function TeacherBadges({ program }) {
  const badgeRefs = useRef([]);
  const reducedMotion = useReducedMotion();

  // Match teachers for this program
  const matchedTeachers = teachers.filter((t) => {
    const prog = t.program?.toLowerCase();
    const curr = program.name?.toLowerCase();
    return prog === curr || prog === 'all programs';
  });

  const team = matchedTeachers.length >= 2 ? matchedTeachers : teachers.slice(0, 3);

  const strapLengths = [32, 46, 36, 42];

  // Anime.js pendulum swing on hover/focus/tap
  useEffect(() => {
    if (reducedMotion) return;

    let cleanups = [];

    import('animejs').then(({ animate }) => {
      badgeRefs.current.forEach((el) => {
        if (!el) return;

        const swing = () => {
          animate(el, {
            rotate: [0, 7, -5, 3, -1, 0],
            duration: 800,
            ease: 'inOutQuad',
          });
        };

        el.addEventListener('mouseenter', swing);
        el.addEventListener('focus', swing);
        el.addEventListener('click', swing);

        cleanups.push(() => {
          el.removeEventListener('mouseenter', swing);
          el.removeEventListener('focus', swing);
          el.removeEventListener('click', swing);
        });
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [reducedMotion, team]);

  return (
    <section id="teachers" className="section section--paper pd-teachers-section" aria-label="Program teachers">
      <div className="container">
        <SectionHeading
          title={`Meet the ${program.name} team`}
          note="Warm eyes, open laps, and patient listeners."
          align="center"
          wiggle
        />

        {/* Hanging Lanyard Badges Row */}
        <div className="pd-lanyard-badges-track" role="list">
          {team.map((teacher, idx) => {
            const strapLen = strapLengths[idx % strapLengths.length];

            return (
              <div
                key={teacher.slug}
                className="pd-lanyard-item"
                role="listitem"
                style={{ '--strap-len': `${strapLen}px` }}
              >
                {/* Lanyard Strap & Metal Clip (SVG) */}
                <div className="pd-lanyard-top" aria-hidden="true">
                  <div className="pd-lanyard-strap" />
                  <div className="pd-lanyard-clip">
                    <span className="pd-lanyard-clip__ring" />
                    <span className="pd-lanyard-clip__hook" />
                  </div>
                </div>

                {/* ID Badge Card */}
                <article
                  ref={(el) => (badgeRefs.current[idx] = el)}
                  className="pd-id-badge sticker"
                  tabIndex={0}
                  aria-label={`${teacher.name}, ${teacher.role}`}
                >
                  {/* Punched Top Slot */}
                  <div className="pd-id-badge__slot" aria-hidden="true" />

                  {/* Photo / Avatar Placeholder */}
                  <div className="pd-id-badge__photo-frame" aria-hidden="true">
                    <div className="pd-id-badge__avatar">
                      <Mascot mood="wave" size={54} />
                    </div>
                  </div>

                  {/* Teacher Info */}
                  <div className="pd-id-badge__body">
                    <h3 className="pd-id-badge__name">
                      {teacher.name}
                    </h3>
                    <span className="pd-id-badge__role">
                      {teacher.role}
                    </span>
                    <span className="chip pd-id-badge__exp">
                      {teacher.years} experience
                    </span>

                    {/* Fun Fact */}
                    {teacher.funFact && (
                      <div className="pd-id-badge__fact-box note">
                        <strong>Fun fact: </strong>
                        <span>{teacher.funFact}</span>
                      </div>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* Link to all teachers */}
        <div className="pd-teachers-action">
          <Button variant="ghost" to="/teachers">
            Meet all teachers
          </Button>
        </div>
      </div>
    </section>
  );
}
