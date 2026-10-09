import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { MapFrame } from './MapFrame';
import { HoursBoard } from './HoursBoard';

/**
 * Section 4 — Visit us (map, hours, directions).
 * Mint tint, folded paper map on the left, gate sign on the right.
 * Target of `#visit` anchor link.
 * @param {{
 *   brand: any,
 *   contact: any,
 *   className?: string
 * }} props
 */
export function VisitSection({ brand, contact, className = '' }) {
  return (
    <section id="visit" className={`section section--mint con-visit-section ${className}`}>
      <div className="container">
        <SectionHeading
          title="Come and see us"
          text="Our gate is open during school hours."
          align="center"
          wiggle={true}
        />

        <div className="con-visit-grid">
          {/* Map Column (about 60% on desktop) */}
          <div className="con-visit-grid__map">
            <MapFrame contact={contact} />
          </div>

          {/* Gate Signboard Column (about 40% on desktop) */}
          <div className="con-visit-grid__sign">
            <HoursBoard brand={brand} contact={contact} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default VisitSection;
