import React from 'react';
import { Button } from '../ui/Button';
import { siteConfig } from '../../config/siteConfig';

export function JoinBand() {
  const brand = siteConfig.brand?.name || 'Wiggle';

  return (
    <section className="section section--pink tch-join-band" aria-label="Join our team">
      <div className="container">
        <div className="tch-join-band__card">
          <div className="tch-join-band__content">
            <span className="tch-join-band__note">Want to teach at {brand}?</span>
            <h2 className="tch-join-band__title">We are always looking for warm, curious hearts.</h2>
            <p className="tch-join-band__desc">
              If you love getting messy sleeves, observing children with genuine respect, and singing off-key with a toddler circle, we would love to know you.
            </p>
          </div>
          <div className="tch-join-band__action">
            <Button variant="ghost" to="/careers">
              See open roles
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
