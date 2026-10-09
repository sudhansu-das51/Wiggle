import React from 'react';
import { whyUs } from '../../data/whyUs';
import { SectionHeading } from '../ui/SectionHeading';
import { Mascot } from '../ui/Mascot';
import { Icon } from '../ui/Icon';
import './home.css';

/**
 * Section 5: Why Wiggle (Bento Grid).
 * Ink background, scalloped edges, uneven playful bento grid, and Wig mascot.
 */
export function WhyBento() {
  const tintBgMap = {
    yellow: 'var(--tint-yellow)',
    pink: 'var(--tint-pink)',
    mint: 'var(--tint-mint)',
    sky: 'var(--tint-sky)',
  };

  return (
    <section className="section section--ink why-bento" aria-label="Why choose Wiggle">
      <div className="container">
        <div className="why-bento__header">
          {/* Yellow mascot character - 100% fully visible with full body & waving animation */}
          <div className="why-bento__mascot" aria-hidden="true">
            <Mascot mood="wave" size={100} />
            <span className="why-bento__mascot-tag">Our Promise!</span>
          </div>

          <SectionHeading
            title="Six things we will not compromise on"
            align="center"
            tone="paper"
            wiggle
          />
        </div>

        <div className="why-bento__grid">
          {whyUs.map((item) => {
            const bg = tintBgMap[item.tint] || 'var(--paper)';

            return (
              <div
                key={item.id}
                className="why-bento__tile"
                style={{ backgroundColor: bg }}
              >
                <div className="why-bento__tile-header">
                  <div className="why-bento__icon-badge">
                    <Icon name={item.icon} size={28} color="var(--ink)" />
                  </div>
                  <span className="why-bento__tag" style={{ color: 'var(--ink)' }}>
                    #{item.short}
                  </span>
                </div>

                <h3 className="why-bento__title" style={{ color: 'var(--ink)' }}>
                  {item.title}
                </h3>

                <p className="why-bento__text" style={{ color: 'var(--ink)' }}>
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
