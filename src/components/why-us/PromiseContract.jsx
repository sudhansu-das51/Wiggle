import React, { useRef } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../ui/Icon';
import { Mascot } from '../ui/Mascot';
import { whyUs } from '../../data/whyUs';
import { siteConfig } from '../../config/siteConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { animate } from 'animejs';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 2: Our Promises to You (The Contract).
 * A paper charter signed by educators with 6 concrete promises,
 * hand-drawn checkmarks, details, and rubber stamp proofs.
 */
export function PromiseContract() {
  const brand = siteConfig.brand?.name || 'Wiggle';
  const containerRef = useRef(null);
  const signatureSquiggleRef = useRef(null);
  const rowsRef = useRef([]);
  const stampsRef = useRef([]);
  const iconsRef = useRef([]);
  const isReduced = useReducedMotion();

  // GSAP animation: signature squiggle draw-on & rubber stamps thunk
  useGSAP(() => {
    if (isReduced || !containerRef.current) return;

    // 1. Rubber stamps thunk on row entry
    rowsRef.current.forEach((rowEl, idx) => {
      const stampEl = stampsRef.current[idx];
      if (!rowEl || !stampEl) return;

      gsap.fromTo(
        stampEl,
        { scale: 1.45, opacity: 0.1, rotate: idx % 2 === 0 ? -18 : 18 },
        {
          scale: 1,
          opacity: 0.85,
          rotate: idx % 2 === 0 ? -8 : 10,
          duration: 0.55,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: rowEl,
            start: 'top 75%',
            once: true,
          },
        }
      );
    });

    // 2. Signature Squiggle draw-on
    if (signatureSquiggleRef.current) {
      const pathEl = signatureSquiggleRef.current;
      const length = pathEl.getTotalLength ? pathEl.getTotalLength() : 240;
      pathEl.style.strokeDasharray = `${length} ${length}`;
      pathEl.style.strokeDashoffset = `${length}`;

      ScrollTrigger.create({
        trigger: pathEl,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(pathEl, {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: 'power2.inOut',
          });
        },
      });
    }
  }, { scope: containerRef, dependencies: [isReduced] });

  // Icon wobble micro-interaction
  const handleIconHover = (idx) => {
    const el = iconsRef.current[idx];
    if (!el || isReduced) return;
    animate(el, {
      rotate: [0, -12, 10, -6, 3, 0],
      scale: [1, 1.15, 1],
      duration: 450,
      ease: 'inOutQuad',
    });
  };

  return (
    <section
      id="promises"
      ref={containerRef}
      className="section section--paper why-contract-section"
      aria-label="Our promises to you"
    >
      <div className="container">
        <SectionHeading
          title="Our promises to you"
          text="Six things, written down so you can hold us to them."
          align="center"
          wiggle
        />

        <div className="why-contract-wrapper">
          {/* Paper Contract Card */}
          <article className="why-contract-card sticker" role="region" aria-label="School care charter">
            {/* Top Washi Tapes */}
            <div className="why-contract-tape why-tape-left tape" aria-hidden="true" />
            <div className="why-contract-tape why-tape-right tape" aria-hidden="true" />

            {/* Mascot Peeking from top right holding a pen */}
            <div className="why-contract-peeker" aria-hidden="true">
              <Mascot mood="peek" size={88} />
              <div className="why-contract-pen">
                <svg viewBox="0 0 24 60" width="18" height="45" fill="none">
                  <rect x="6" y="10" width="12" height="35" rx="3" fill="var(--sunny)" stroke="var(--ink)" strokeWidth="2.5" />
                  <polygon points="6,45 12,58 18,45" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
                  <polygon points="9,52 12,58 15,52" fill="var(--ink)" />
                  <rect x="7" y="4" width="10" height="6" rx="2" fill="var(--bubblegum)" stroke="var(--ink)" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Contract Header */}
            <header className="why-contract-header">
              <span className="why-contract-tag note">Wiggle Early Childhood Charter</span>
              <h2 className="why-contract-doc-title">Educational Agreement & Care Charter</h2>
              <p className="why-contract-subtitle note">
                Effective: every single morning your child is in our care
              </p>
            </header>

            {/* Six Clauses */}
            <div className="why-contract-clauses">
              {whyUs.map((item, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={item.id}
                    ref={(el) => (rowsRef.current[idx] = el)}
                    className={`why-clause-row ${isEven ? 'why-clause--stamp-right' : 'why-clause--stamp-left'}`}
                  >
                    {/* Main clause content */}
                    <div className="why-clause-content">
                      <div className="why-clause-title-line">
                        {/* Hand-drawn checkbox */}
                        <span className="why-clause-check" aria-hidden="true">
                          <svg viewBox="0 0 28 28" width="24" height="24">
                            <rect x="2" y="2" width="24" height="24" rx="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
                            <path d="M 6 14 L 11 20 L 22 7" fill="none" stroke="var(--meadow)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>

                        {/* Item Icon Bubble */}
                        <div
                          ref={(el) => (iconsRef.current[idx] = el)}
                          className="why-clause-icon-bubble"
                          style={{ backgroundColor: `var(--tint-${item.tint || 'yellow'})` }}
                          onMouseEnter={() => handleIconHover(idx)}
                          onFocus={() => handleIconHover(idx)}
                          tabIndex={0}
                          aria-hidden="true"
                        >
                          <Icon name={item.icon} size={22} color="var(--ink)" />
                        </div>

                        <h3 className="why-clause-title">{item.title}</h3>
                      </div>

                      <p className="why-clause-text">{item.text}</p>

                      {/* 3 Detail Bullets */}
                      {item.details && (
                        <ul className="why-clause-details" role="list">
                          {item.details.map((detail, dIdx) => (
                            <li key={dIdx} className="why-clause-detail-item">
                              <span className="why-detail-bullet note" aria-hidden="true">✓</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Rubber Stamp Badge */}
                    {item.proof && (
                      <div
                        ref={(el) => (stampsRef.current[idx] = el)}
                        className="why-rubber-stamp sticker"
                        aria-label={`Proof: ${item.proof.value} ${item.proof.label}`}
                      >
                        <div className="why-stamp-inner">
                          <span className="why-stamp-value">{item.proof.value}</span>
                          <span className="why-stamp-label note">{item.proof.label}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contract Sign-off Footer */}
            <footer className="why-contract-footer">
              <div className="why-signature-block">
                <span className="why-sign-label note">Signed with care,</span>
                <div className="why-signature-wrap">
                  <span className="why-signature-name note">{brand} Educators & Leadership</span>
                  {/* Underline Squiggle */}
                  <svg
                    viewBox="0 0 320 22"
                    className="why-signature-squiggle"
                    aria-hidden="true"
                  >
                    <path
                      ref={signatureSquiggleRef}
                      d="M 5,14 Q 45,4 85,14 T 165,14 T 245,14 T 315,10"
                      fill="none"
                      stroke="var(--ink)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="why-sign-meta note">Reviewed with parents every term.</p>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
}

export default PromiseContract;
