import React from 'react';
import { SocialLinks } from '../ui/SocialLinks';
import { Mascot } from '../ui/Mascot';
import { siteConfig } from '../../config/siteConfig';

/**
 * Section 4: Follow the Daily Chaos (Social Media Follow Band).
 * Renders social media profile links and the parental photo consent note.
 */
export function FollowBand() {
  const consentNote =
    siteConfig?.gallery?.consentNote ||
    "Photos of children are shared only with their parents' written consent.";

  return (
    <section
      className="section section--pink gal-follow-section"
      aria-label="Follow us on social media"
    >
      <div className="container">
        <div className="gal-follow-card sticker">
          <div className="gal-follow-content">
            <div className="gal-follow-text">
              <span className="gal-follow-tag note">Daily classroom updates</span>
              <h2 className="gal-follow-title">
                More on social media
              </h2>
              <p className="gal-follow-desc">
                We post new moments every week: paint experiments, story circles, and muddy garden discoveries.
              </p>
            </div>

            <div className="gal-follow-social">
              <SocialLinks size={22} className="gal-social-icons" />
            </div>

            {/* Parent Consent Note */}
            <div className="gal-consent-wrap">
              <p className="gal-consent-note note">
                * {consentNote}
              </p>
            </div>
          </div>

          <div className="gal-follow-mascot" aria-hidden="true">
            <Mascot mood="cheer" size={72} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FollowBand;
