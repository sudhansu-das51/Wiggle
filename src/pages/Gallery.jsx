import React from 'react';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/layout/PageHero';
import { CtaBanner } from '../components/ui/CtaBanner';
import { GalleryWall } from '../components/gallery/GalleryWall';
import { FollowBand } from '../components/gallery/FollowBand';
import { siteConfig } from '../config/siteConfig';

import './Gallery.css';
import '../components/gallery/gallery.css';

/**
 * Gallery Page (/gallery).
 * A vibrant clothesline of pegged, swaying photos from daily preschool life,
 * category filtering with unpeg-and-drop animations, pull-down slide projector viewer,
 * and social follow band.
 */
export function Gallery() {
  const brand = siteConfig.brand?.name || 'Wiggle';

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Gallery' },
  ];

  return (
    <main className="gallery-page">
      <Seo
        title="Gallery"
        description={`Explore real moments at ${brand} preschool: messy finger painting, sandbox builds, lantern festivals, reading nooks, and daily joyful learning.`}
      />

      {/* Section 1: Page Hero */}
      <PageHero
        title="Our gallery"
        note="Proof that Tuesday is messy-paint day."
        tint="yellow"
        mascotMood="peek"
        crumbs={breadcrumbs}
      />

      {/* Section 2: The Clothesline Wall (.section--sky) */}
      <GalleryWall />

      {/* Section 4: Follow the Daily Chaos (.section--pink) */}
      <FollowBand />

      {/* Section 5: CTA Banner */}
      <section className="section section--paper gal-cta-section" aria-label="Book a school visit">
        <div className="container">
          <CtaBanner
            title="Want to be on our wall next term?"
            text="Book a school visit and spend a normal day with us. Bring a change of clothes, just in case."
            primaryTo="/enquire"
            message={`Hi ${brand}! I would like to book a visit and spend a morning with the children.`}
          />
        </div>
      </section>
    </main>
  );
}

export default Gallery;
