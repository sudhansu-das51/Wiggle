import React from 'react';
import { programs } from '../../data/programs';
import { siteConfig } from '../../config/siteConfig';
import { SectionHeading } from '../ui/SectionHeading';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import './programs.css';

/**
 * Section 4: Railway departure board comparing all programs side by side.
 * Accessible semantic table that transforms into stacked ticket blocks on phones.
 */
export function CompareBoard() {
  const brandName = siteConfig?.brand?.name || 'Wiggle';

  const tintDotColors = {
    yellow: 'var(--tint-yellow)',
    pink: 'var(--tint-pink)',
    mint: 'var(--tint-mint)',
    sky: 'var(--tint-sky)',
  };

  return (
    <section
      id="compare-board"
      className="section section--ink programs-board-section"
      aria-label="Program comparison table"
    >
      <div className="container">
        <SectionHeading
          title="Every program at a glance"
          tone="paper"
          align="center"
          wiggle
        />

        {/* Departure Board Frame */}
        <div className="programs-board-frame">
          {/* Decorative Corner Fasteners */}
          <span className="programs-board-rivet rivet-tl" aria-hidden="true" />
          <span className="programs-board-rivet rivet-tr" aria-hidden="true" />
          <span className="programs-board-rivet rivet-bl" aria-hidden="true" />
          <span className="programs-board-rivet rivet-br" aria-hidden="true" />

          {/* Semantic Table */}
          <table className="programs-board-table">
            <caption className="visually-hidden">
              Comparison of all programs including age, timings, group size, days, meals, and focus
            </caption>

            <thead>
              <tr>
                <th scope="col">Program</th>
                <th scope="col">Age</th>
                <th scope="col">Timings</th>
                <th scope="col">Group size</th>
                <th scope="col">Days</th>
                <th scope="col">Meals</th>
                <th scope="col">Focus</th>
              </tr>
            </thead>

            <tbody>
              {programs.map((p) => {
                const dotBg = tintDotColors[p.tint] || 'var(--sunny)';
                return (
                  <tr key={p.slug} className="programs-board-row" tabIndex={0}>
                    <td data-label="Program" className="programs-board-cell--program">
                      <span
                        className="programs-board-dot"
                        style={{ backgroundColor: dotBg }}
                        aria-hidden="true"
                      />
                      <strong className="programs-board-name">{p.name}</strong>
                    </td>

                    <td data-label="Age">
                      <span className="programs-board-val">{p.ageRange}</span>
                    </td>

                    <td data-label="Timings">
                      <span className="programs-board-val">{p.timings}</span>
                    </td>

                    <td data-label="Group size">
                      <span className="programs-board-val">{p.groupSize ?? '10–14 children'}</span>
                    </td>

                    <td data-label="Days">
                      <span className="programs-board-val">{p.daysPerWeek ?? '5 days'}</span>
                    </td>

                    <td data-label="Meals">
                      <span className="programs-board-val">{p.meals ?? 'Snack & lunch'}</span>
                    </td>

                    <td data-label="Focus" className="programs-board-cell--focus">
                      <span className="programs-board-val">{p.focus ?? p.tagline}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Note & Fee Sheet Enquiry */}
        <div className="programs-board-footer">
          <p className="programs-board-footer__note">
            Fees depend on the program and session. Ask us for the current fee sheet.
          </p>

          <WhatsAppButton
            message={`Hi ${brandName}! Could you share the current fee details?`}
            label="Ask for fee sheet on WhatsApp"
            variant="ghost"
            className="programs-board-footer__btn"
          />
        </div>
      </div>
    </section>
  );
}
