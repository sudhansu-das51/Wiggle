import React from 'react';
import { Icon } from '../ui/Icon';
import { comparison } from '../../data/comparison';
import { siteConfig } from '../../config/siteConfig';

/**
 * ComparisonTable: Semantic comparison table comparing Wiggle against typical preschool averages.
 * Honesty rule: always renders comparison.note underneath.
 */
export function ComparisonTable() {
  const brand = siteConfig.brand?.name || 'Wiggle';
  const { rows = [], note } = comparison;

  return (
    <div className="why-comparison-card sticker" role="region" aria-label="Program and care comparison">
      <div className="why-table-responsive-wrapper">
        <table className="why-comparison-table">
          <thead>
            <tr>
              <th scope="col" className="why-th-aspect">
                <span>Care & learning practice</span>
              </th>
              <th scope="col" className="why-th-wiggle">
                <span className="why-col-brand-pill chip">At {brand}</span>
              </th>
              <th scope="col" className="why-th-typical">
                <span>In a typical class</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="why-table-row">
                {/* Row Header Label */}
                <th scope="row" className="why-td-label">
                  <span className="why-row-label-text">{row.label}</span>
                </th>

                {/* Wiggle Value Column */}
                <td className="why-td-wiggle">
                  <div className="why-cell-content">
                    <span className="why-cell-check-bubble" aria-hidden="true">
                      <Icon name="check" size={16} color="var(--meadow)" />
                    </span>
                    <span className="why-cell-value-strong">{row.wiggle}</span>
                  </div>
                </td>

                {/* Typical Average Column */}
                <td className="why-td-typical">
                  <span className="why-cell-value-muted">{row.typical}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Honesty note under table */}
      {note && (
        <div className="why-comparison-note-wrap">
          <p className="why-comparison-note note">
            * {note}
          </p>
        </div>
      )}
    </div>
  );
}

export default ComparisonTable;
