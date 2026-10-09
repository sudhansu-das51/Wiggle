import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { Icon } from '../ui/Icon';
import { curriculum } from '../../data/curriculum';

/**
 * Section 6: How We Share Progress (Progress Pieces).
 * Loose overlapping collage of 3 tangible artefacts:
 * 1. Daily handover note (lined note paper with torn bottom edge and tape)
 * 2. Monthly photo journal page (two taped candid photo snapshots with caption)
 * 3. Meeting invitation card (notched ticket with stamp and details)
 */
export function ProgressPieces() {
  const { progress = [] } = curriculum;
  const [dailyNote, photoJournal, meeting] = progress;

  return (
    <section id="progress" className="section section--yellow cur-progress-section" aria-label="How we share progress">
      <div className="container">
        <SectionHeading
          title="No grades. Here is what you actually get."
          align="center"
          wiggle
        />

        <div className="cur-progress-collage">
          {/* Piece 1: Daily Handover Note (Lined paper with torn bottom edge) */}
          {dailyNote && (
            <article
              className="cur-piece cur-piece--note sticker"
              tabIndex={0}
              aria-label={dailyNote.title}
            >
              <div className="cur-piece-tape tape" aria-hidden="true" />

              <div className="cur-piece-header">
                <span className="cur-piece-tag note">{dailyNote.title}</span>
              </div>
              <p className="cur-piece-desc">{dailyNote.text}</p>

              {/* Lined notebook excerpt area */}
              <div className="cur-lined-notepad">
                <div className="cur-notepad-margin-line" aria-hidden="true" />
                <p className="cur-notepad-sample note">
                  “{dailyNote.sample}”
                </p>
                <div className="cur-notepad-footer">
                  <Icon name="heart" size={16} color="var(--bubblegum)" />
                </div>
              </div>

              {/* Torn serrated bottom edge */}
              <svg
                className="cur-piece-torn-edge"
                viewBox="0 0 500 16"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0,0 L0,8 
                     L25,15 L50,8 L75,15 L100,8 
                     L125,15 L150,8 L175,15 L200,8 
                     L225,15 L250,8 L275,15 L300,8 
                     L325,15 L350,8 L375,15 L400,8 
                     L425,15 L450,8 L475,15 L500,8 
                     L500,0 Z"
                  fill="var(--paper)"
                />
                <path
                  d="M0,8 
                     L25,15 L50,8 L75,15 L100,8 
                     L125,15 L150,8 L175,15 L200,8 
                     L225,15 L250,8 L275,15 L300,8 
                     L325,15 L350,8 L375,15 L400,8 
                     L425,15 L450,8 L475,15 L500,8"
                  stroke="var(--ink)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </article>
          )}

          {/* Piece 2: Monthly Photo Journal Page */}
          {photoJournal && (
            <article
              className="cur-piece cur-piece--journal sticker"
              tabIndex={0}
              aria-label={photoJournal.title}
            >
              <div className="cur-piece-tape tape" aria-hidden="true" />

              <div className="cur-piece-header">
                <span className="cur-piece-tag note">{photoJournal.title}</span>
              </div>
              <p className="cur-piece-desc">{photoJournal.text}</p>

              {/* Two taped candid photo snapshots */}
              <div className="cur-journal-photos">
                <div className="cur-polaroid-frame sticker">
                  <div className="cur-polaroid-tape" aria-hidden="true" />
                  <ResponsiveImage
                    ratio="square"
                    shape="rect"
                    tint="mint"
                    label="Messy art studio"
                    alt="Messy art studio snapshot"
                  />
                  <span className="cur-polaroid-caption note">Mixing colors</span>
                </div>

                <div className="cur-polaroid-frame sticker">
                  <div className="cur-polaroid-tape" aria-hidden="true" />
                  <ResponsiveImage
                    ratio="square"
                    shape="rect"
                    tint="sky"
                    label="Block tower building"
                    alt="Block tower building snapshot"
                  />
                  <span className="cur-polaroid-caption note">High tower!</span>
                </div>
              </div>

              <blockquote className="cur-journal-sample note">
                “{photoJournal.sample}”
              </blockquote>
            </article>
          )}

          {/* Piece 3: Meeting Invitation Ticket */}
          {meeting && (
            <article
              className="cur-piece cur-piece--ticket sticker"
              tabIndex={0}
              aria-label={meeting.title}
            >
              <div className="cur-ticket-notch cur-notch-left" aria-hidden="true" />
              <div className="cur-ticket-notch cur-notch-right" aria-hidden="true" />

              <div className="cur-piece-header">
                <span className="cur-piece-tag note">{meeting.title}</span>
              </div>
              <p className="cur-piece-desc">{meeting.text}</p>

              <div className="cur-ticket-body">
                <div className="cur-ticket-stamp sticker" aria-hidden="true">
                  <Icon name="calendar" size={20} color="var(--ink)" />
                  <span className="cur-stamp-text note">Warm tea & conversation</span>
                </div>

                <p className="cur-ticket-sample note">
                  “{meeting.sample}”
                </p>

                <div className="cur-ticket-meta">
                  <span className="cur-ticket-detail note">Twice each academic term</span>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProgressPieces;
