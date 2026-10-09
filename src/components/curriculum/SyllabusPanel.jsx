import React from 'react';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { siteConfig } from '../../config/siteConfig';

/**
 * Section 7: Syllabus Request Panel.
 * Illustrated booklet with Mascot, download link (if configured), and WhatsApp prompt.
 */
export function SyllabusPanel() {
  const brand = siteConfig.brand?.name || 'Wiggle';
  const syllabusUrl = siteConfig.downloads?.syllabus;
  const waMessage = `Hi ${brand}! Could you send me the curriculum and syllabus for each program?`;

  return (
    <section id="syllabus" className="section section--sky cur-syllabus-section" aria-label="Syllabus request">
      <div className="container">
        <div className="cur-syllabus-card sticker" role="region" aria-label="Curriculum syllabus booklet">
          <div className="cur-syllabus-inner">
            {/* Left: Illustrated Booklet SVG with Wig Holding It */}
            <div className="cur-booklet-illustration" aria-hidden="true">
              <svg
                viewBox="0 0 240 220"
                width="180"
                height="165"
                className="cur-booklet-svg"
              >
                {/* Cheerful Wig Mascot in Background */}
                <g transform="translate(65, 30)">
                  {/* Peanut body */}
                  <path
                    d="M 20,10 C 6,10 0,26 4,42 C -2,58 6,76 22,76 C 38,76 46,58 40,42 C 44,26 36,10 20,10 Z"
                    fill="var(--sunny)"
                    stroke="var(--ink)"
                    strokeWidth="3.5"
                  />
                  {/* Happy eyes */}
                  <circle cx="14" cy="28" r="3" fill="var(--ink)" />
                  <circle cx="28" cy="28" r="3" fill="var(--ink)" />
                  {/* Rosy cheeks */}
                  <circle cx="8" cy="35" r="3.5" fill="var(--bubblegum)" />
                  <circle cx="34" cy="35" r="3.5" fill="var(--bubblegum)" />
                  {/* Smiling mouth */}
                  <path d="M 16,36 Q 21,43 26,36" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>

                {/* The Open / Illustrated Booklet */}
                <g transform="translate(40, 65)">
                  {/* Back shadow page */}
                  <rect
                    x="16"
                    y="14"
                    width="130"
                    height="115"
                    rx="8"
                    fill="var(--tint-mint)"
                    stroke="var(--ink)"
                    strokeWidth="3"
                    transform="rotate(6 81 71)"
                  />
                  {/* Front booklet cover */}
                  <rect
                    x="8"
                    y="6"
                    width="130"
                    height="115"
                    rx="8"
                    fill="var(--paper)"
                    stroke="var(--ink)"
                    strokeWidth="3.5"
                    transform="rotate(-3 73 63)"
                  />
                  {/* Spine tape */}
                  <rect
                    x="4"
                    y="6"
                    width="14"
                    height="115"
                    rx="4"
                    fill="var(--bubblegum)"
                    stroke="var(--ink)"
                    strokeWidth="2.5"
                    transform="rotate(-3 73 63)"
                  />
                  {/* Cover stamp */}
                  <circle cx="75" cy="50" r="22" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
                  <path d="M 67,50 L 73,56 L 85,42" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Text mock lines on cover */}
                  <line x1="45" y1="84" x2="105" y2="84" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="55" y1="94" x2="95" y2="94" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
                </g>

                {/* Wig's little paws holding the booklet */}
                <circle cx="48" cy="115" r="6" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
                <circle cx="172" cy="120" r="6" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
              </svg>
            </div>

            {/* Right: Content & Action */}
            <div className="cur-syllabus-content">
              <h3 className="cur-syllabus-title">Want the full syllabus on paper?</h3>
              <p className="cur-syllabus-text">
                Download our complete developmental milestone booklet or ask our front desk for a printed copy to read over coffee.
              </p>

              <div className="cur-syllabus-actions">
                {syllabusUrl && (
                  <a
                    href={syllabusUrl}
                    download
                    className="btn btn--primary"
                    aria-label="Download the syllabus PDF"
                  >
                    Download the syllabus
                  </a>
                )}

                <WhatsAppButton
                  message={waMessage}
                  label="Ask for it on WhatsApp"
                  variant={syllabusUrl ? 'secondary' : 'primary'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SyllabusPanel;
