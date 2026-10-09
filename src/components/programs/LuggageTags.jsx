import React, { useRef, useEffect } from 'react';
import { curriculum } from '../../data/curriculum';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './programs.css';

/**
 * Section 5: What every program covers, styled as 6 hanging luggage tags.
 */
export function LuggageTags() {
  const learningAreas = curriculum?.learningAreas || [];
  const tagRefs = useRef([]);
  const reducedMotion = useReducedMotion();

  // Natural hand-crafted tilts and staggered string heights
  const tagVariations = [
    { baseRot: -2.5, stringLen: 32 },
    { baseRot: 2, stringLen: 42 },
    { baseRot: -1.5, stringLen: 28 },
    { baseRot: 2.5, stringLen: 38 },
    { baseRot: -2, stringLen: 46 },
    { baseRot: 1.8, stringLen: 30 },
  ];

  const tintBgMap = {
    yellow: 'var(--tint-yellow)',
    pink: 'var(--tint-pink)',
    mint: 'var(--tint-mint)',
    sky: 'var(--tint-sky)',
  };

  // Anime.js pendulum swing on hover/focus/tap
  useEffect(() => {
    if (reducedMotion) return;

    let cleanups = [];

    import('animejs').then(({ animate }) => {
      tagRefs.current.forEach((el, idx) => {
        if (!el) return;
        const base = tagVariations[idx % tagVariations.length].baseRot;

        const swing = () => {
          animate(el, {
            rotate: [base, base + 6, base - 4, base + 2, base],
            duration: 700,
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
  }, [reducedMotion]);

  // 3 column pairs: [upper, lower]
  const columns = [
    [0, 3],
    [1, 4],
    [2, 5],
  ];

  const renderTag = (area, idx, position) => {
    const v = tagVariations[idx % tagVariations.length];
    const bg = tintBgMap[area.tint] || 'var(--paper)';
    const firstSentence = area.description?.split('.')[0] + '.' || area.description;

    return (
      <div
        key={area.id}
        ref={(el) => (tagRefs.current[idx] = el)}
        className={`programs-luggage-item programs-luggage-item--${position}`}
        role="listitem"
        tabIndex={0}
        style={{
          '--base-rot': `${v.baseRot}deg`,
          '--string-len': `${v.stringLen}px`,
          transform: `rotate(${v.baseRot}deg)`,
        }}
        aria-label={`${area.name}: ${firstSentence}`}
      >
        {/* Short string connecting directly to rail on upper tags (or mobile) */}
        <div className="programs-luggage-string" aria-hidden="true" />

        {/* Luggage Tag Body */}
        <article
          className="programs-luggage-tag"
          style={{ backgroundColor: bg }}
        >
          {/* Punched Eyelet Hole */}
          <div className="programs-luggage-eyelet" aria-hidden="true" />

          {/* Icon Badge */}
          <div className="programs-luggage-icon-wrap" aria-hidden="true">
            <Icon name={area.icon} size={28} color="var(--ink)" />
          </div>

          {/* Area Title */}
          <h3 className="programs-luggage-name">
            {area.name}
          </h3>

          {/* One-line Description */}
          <p className="programs-luggage-desc">
            {firstSentence}
          </p>
        </article>
      </div>
    );
  };

  return (
    <section className="section section--pink programs-luggage-section" aria-label="Curriculum areas">
      <div className="container">
        <SectionHeading
          title="What goes in every little suitcase"
          note="Curiosity, kindness, and big questions in every pack."
          align="center"
          wiggle
        />

        {/* Rope / Hanging Rail */}
        <div className="programs-luggage-rail" aria-hidden="true">
          <div className="programs-luggage-rope" />
        </div>

        {/* Hanging Tags Track (3 columns on desktop, horizontal scroll on mobile) */}
        <div className="programs-luggage-track" role="list">
          {columns.map(([upperIdx, lowerIdx], colIdx) => {
            const upperArea = learningAreas[upperIdx];
            const lowerArea = learningAreas[lowerIdx];

            return (
              <div key={`col-${colIdx}`} className="programs-luggage-col">
                {/* Long continuous rope from rail running BEHIND upper card down to lower card */}
                <div className="programs-luggage-long-rope" aria-hidden="true" />

                {/* Upper Tag */}
                {upperArea && renderTag(upperArea, upperIdx, 'upper')}

                {/* Lower Tag */}
                {lowerArea && renderTag(lowerArea, lowerIdx, 'lower')}
              </div>
            );
          })}
        </div>

        {/* Ghost Link to Curriculum Page */}
        <div className="programs-luggage-action">
          <Button variant="ghost" to="/curriculum">
            See the full curriculum
          </Button>
        </div>
      </div>
    </section>
  );
}
