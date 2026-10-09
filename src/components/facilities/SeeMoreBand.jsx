import React from 'react';
import { Button } from '../ui/Button';
import { Mascot } from '../ui/Mascot';

/**
 * Section 4: See it in Photos.
 * A compact, cheerful banner inviting parents to inspect real photos
 * in the gallery or take the safety tour on the Why Us page.
 */
export function SeeMoreBand() {
  return (
    <section
      className="section section--sky fac-seemore-section"
      aria-label="See our facilities in photos and safety tour"
    >
      <div className="container">
        <div className="fac-seemore-card sticker">
          <div className="fac-seemore-content">
            <div className="fac-seemore-text-group">
              <span className="fac-seemore-tag note">Real mornings, real spaces</span>
              <h2 className="fac-seemore-title">
                See these rooms on a normal Tuesday.
              </h2>
            </div>

            <div className="fac-seemore-actions">
              <Button
                variant="ghost"
                to="/gallery"
                className="fac-action-btn"
              >
                Open the gallery
              </Button>
              <Button
                variant="ghost"
                to="/why-us"
                className="fac-action-btn"
              >
                Walk the safety tour
              </Button>
            </div>
          </div>

          <div className="fac-seemore-mascot" aria-hidden="true">
            <Mascot mood="peek" size={64} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SeeMoreBand;
