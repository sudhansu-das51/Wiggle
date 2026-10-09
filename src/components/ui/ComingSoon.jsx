import React from 'react';
import { PageHero } from '../layout/PageHero';
import { Mascot } from './Mascot';
import { Button } from './Button';
import { Seo } from './Seo';

/**
 * Temporary placeholder view for inner routes scheduled in subsequent builds.
 * @param {{ title: string }} props
 */
export function ComingSoon({ title }) {
  return (
    <div className="coming-soon-page">
      <Seo title={title} />
      <PageHero title={title} note="Crafting with love" tint="yellow" mascotMood="sleepy" />

      <section className="section section--paper">
        <div
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            paddingBlock: '2rem',
            gap: '1.5rem',
          }}
        >
          <Mascot mood="sleepy" size={140} />

          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', maxWidth: '28ch' }}>
            This page is taking a gentle little nap
          </h2>

          <p style={{ fontSize: '1.125rem', color: 'var(--muted)', maxWidth: '44ch' }}>
            Our teachers and little builders are currently drawing, painting, and setting up this room. Check back very soon!
          </p>

          <div style={{ marginTop: '1rem' }}>
            <Button variant="primary" to="/">
              Back to playground home
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
