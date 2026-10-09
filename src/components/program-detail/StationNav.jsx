import React from 'react';
import { programs } from '../../data/programs';
import { TransitionLink } from '../motion/TransitionLink';
import { Icon } from '../ui/Icon';
import './program-detail.css';

/**
 * Section 9: Previous and Next station train-ticket shaped links.
 * @param {{
 *   currentSlug: string
 * }} props
 */
export function StationNav({ currentSlug }) {
  const currentIndex = programs.findIndex((p) => p.slug === currentSlug);

  const prevProgram = currentIndex > 0 ? programs[currentIndex - 1] : null;
  const nextProgram = currentIndex >= 0 && currentIndex < programs.length - 1 ? programs[currentIndex + 1] : null;

  return (
    <nav className="pd-station-nav-section" aria-label="Explore other stations">
      <div className="container pd-station-nav-container">
        {/* Previous Station Ticket */}
        {prevProgram ? (
          <TransitionLink
            to={`/programs/${prevProgram.slug}`}
            className="pd-ticket-link pd-ticket-link--prev sticker"
            style={{
              backgroundColor: `var(--tint-${prevProgram.tint || 'yellow'})`,
            }}
            aria-label={`Previous station: ${prevProgram.name}`}
          >
            <div className="pd-ticket-notch pd-notch-left" aria-hidden="true" />
            <div className="pd-ticket-body">
              <span className="pd-ticket-sub note">Previous station</span>
              <div className="pd-ticket-main">
                <span className="pd-ticket-icon" aria-hidden="true">
                  <Icon name="train" size={20} color="var(--ink)" />
                </span>
                <strong className="pd-ticket-title">{prevProgram.name}</strong>
              </div>
              <span className="chip pd-ticket-age">{prevProgram.ageRange}</span>
            </div>
          </TransitionLink>
        ) : (
          <TransitionLink
            to="/programs"
            className="pd-ticket-link pd-ticket-link--all sticker"
            style={{ backgroundColor: 'var(--paper)' }}
            aria-label="See all programs"
          >
            <div className="pd-ticket-body">
              <span className="pd-ticket-sub note">First station</span>
              <div className="pd-ticket-main">
                <span className="pd-ticket-icon" aria-hidden="true">
                  <Icon name="home" size={20} color="var(--ink)" />
                </span>
                <strong className="pd-ticket-title">All programs</strong>
              </div>
              <span className="chip pd-ticket-age">View map</span>
            </div>
          </TransitionLink>
        )}

        {/* Next Station Ticket */}
        {nextProgram ? (
          <TransitionLink
            to={`/programs/${nextProgram.slug}`}
            className="pd-ticket-link pd-ticket-link--next sticker"
            style={{
              backgroundColor: `var(--tint-${nextProgram.tint || 'sky'})`,
            }}
            aria-label={`Next station: ${nextProgram.name}`}
          >
            <div className="pd-ticket-notch pd-notch-right" aria-hidden="true" />
            <div className="pd-ticket-body">
              <span className="pd-ticket-sub note">Next station</span>
              <div className="pd-ticket-main">
                <strong className="pd-ticket-title">{nextProgram.name}</strong>
                <span className="pd-ticket-icon" aria-hidden="true">
                  <Icon name="train" size={20} color="var(--ink)" />
                </span>
              </div>
              <span className="chip pd-ticket-age">{nextProgram.ageRange}</span>
            </div>
          </TransitionLink>
        ) : (
          <TransitionLink
            to="/programs"
            className="pd-ticket-link pd-ticket-link--all sticker"
            style={{ backgroundColor: 'var(--paper)' }}
            aria-label="See all programs"
          >
            <div className="pd-ticket-body">
              <span className="pd-ticket-sub note">Final station</span>
              <div className="pd-ticket-main">
                <strong className="pd-ticket-title">All programs</strong>
                <span className="pd-ticket-icon" aria-hidden="true">
                  <Icon name="home" size={20} color="var(--ink)" />
                </span>
              </div>
              <span className="chip pd-ticket-age">View map</span>
            </div>
          </TransitionLink>
        )}
      </div>
    </nav>
  );
}
