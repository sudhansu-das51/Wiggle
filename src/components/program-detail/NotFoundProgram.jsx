import React from 'react';
import { Seo } from '../ui/Seo';
import { PageHero } from '../layout/PageHero';
import { Button } from '../ui/Button';
import './program-detail.css';

/**
 * Not-found state rendered when an invalid program slug is visited.
 */
export function NotFoundProgram() {
  const crumbs = [
    { label: 'Home', path: '/' },
    { label: 'Programs', path: '/programs' },
    { label: 'Not found' },
  ];

  return (
    <div className="pd-not-found-page">
      <Seo
        title="Program not found"
        description="That station is not on our map. Browse all programs at Wiggle preschool."
      />

      <PageHero
        title="Program not found"
        note="That station is not on our map."
        tint="yellow"
        mascotMood="sleepy"
        crumbs={crumbs}
      />

      <div className="container pd-not-found-body">
        <div className="pd-not-found-card sticker">
          <p className="pd-not-found-text">
            We couldn’t find that program station. It might have moved or the link might be misspelled.
            Our growing-up train travels through Playgroup, Nursery, Jr. KG, and Sr. KG.
          </p>
          <div className="pd-not-found-actions">
            <Button variant="primary" to="/programs">
              See all programs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
