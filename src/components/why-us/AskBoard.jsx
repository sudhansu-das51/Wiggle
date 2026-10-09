import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { askEverySchool } from '../../data/whyUs';
import { siteConfig } from '../../config/siteConfig';

const NOTE_TINTS = ['var(--tint-yellow)', 'var(--tint-pink)', 'var(--tint-mint)', 'var(--tint-sky)'];
const NOTE_ROTATIONS = [-3.5, 2.5, -2, 3, -2.5, 2];

/**
 * Section 6: Questions Worth Asking Every School (Cork Notice Board).
 * A cork-style pinned board with parent questions on loose scattered sticky notes,
 * plus WhatsApp prompt.
 */
export function AskBoard() {
  const brand = siteConfig.brand?.name || 'Wiggle';
  const waMessage = `Hi ${brand}! I would like to ask a few questions before visiting.`;

  return (
    <section
      id="questions"
      className="section section--yellow why-ask-section"
      aria-label="Important questions to ask any preschool"
    >
      <div className="container">
        <SectionHeading
          title="Questions worth asking every preschool, including us"
          text="A good school will never mind these."
          align="center"
          wiggle
        />

        {/* Cork Notice Board Frame */}
        <div className="why-cork-board sticker" role="region" aria-label="Notice board with sticky notes">
          {/* Wood Frame Corner Highlights */}
          <div className="why-cork-corner why-corner-tl" aria-hidden="true" />
          <div className="why-cork-corner why-corner-tr" aria-hidden="true" />
          <div className="why-cork-corner why-corner-bl" aria-hidden="true" />
          <div className="why-cork-corner why-corner-br" aria-hidden="true" />

          {/* Sticky Notes Loose Scatter Grid */}
          <div className="why-notes-scatter">
            {askEverySchool.map((question, idx) => {
              const tint = NOTE_TINTS[idx % NOTE_TINTS.length];
              const rot = NOTE_ROTATIONS[idx % NOTE_ROTATIONS.length];
              const hasTape = idx % 2 === 0;

              return (
                <article
                  key={idx}
                  className="why-sticky-note sticker"
                  style={{
                    backgroundColor: tint,
                    '--note-rot': `${rot}deg`,
                  }}
                  tabIndex={0}
                  aria-label={`Question ${idx + 1}: ${question}`}
                >
                  {/* Pushpin or Washi Tape at Top */}
                  {hasTape ? (
                    <div className="why-note-tape tape" aria-hidden="true" />
                  ) : (
                    <div className="why-note-pin" aria-hidden="true">
                      <span className="why-pin-head" />
                      <span className="why-pin-shadow" />
                    </div>
                  )}

                  {/* Question Number Note */}
                  <span className="why-note-num note">Q{idx + 1}.</span>

                  {/* Question Content */}
                  <p className="why-note-text note">
                    “{question}”
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Action Prompt Below Cork Board */}
        <div className="why-ask-footer">
          <p className="why-ask-prompt note">
            Bring this list on your visit, or test our answers right now:
          </p>
          <WhatsAppButton
            message={waMessage}
            label="Ask us these on WhatsApp"
            variant="primary"
          />
        </div>
      </div>
    </section>
  );
}

export default AskBoard;
