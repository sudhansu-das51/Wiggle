import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Squiggle } from '../ui/Squiggle';
import { copyToClipboard } from '../../utils/contact';
import { formatClosingDate } from '../../utils/dates';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const TINT_MAP = {
  yellow: 'var(--tint-yellow)',
  pink: 'var(--tint-pink)',
  mint: 'var(--tint-mint)',
  sky: 'var(--tint-sky)',
};

/**
 * Single Help-wanted Job Poster with tear-off tabs and expandable details.
 * @param {{
 *   job: any,
 *   index: number,
 *   isHighlighted?: boolean,
 *   onApply: (job: any, onAnimationComplete?: () => void) => void,
 *   tornTabCount: number,
 *   className?: string
 * }} props
 */
export function JobPoster({
  job,
  index = 0,
  isHighlighted = false,
  onApply,
  tornTabCount = 0,
  className = '',
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const detailsRef = useRef(null);
  const tabsRef = useRef([]);
  const copyTimerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Subtle tilt between -2deg and +2deg
  const tilts = [-1.5, 1.8, -1.2, 1.4, -1.8, 1.2];
  const tilt = tilts[index % tilts.length];
  const bgTint = TINT_MAP[job.tint] || 'var(--paper)';

  const toggleDetails = () => {
    const el = detailsRef.current;
    if (!el) {
      setIsExpanded((prev) => !prev);
      return;
    }

    if (reducedMotion) {
      setIsExpanded((prev) => !prev);
      el.style.height = isExpanded ? '0px' : 'auto';
      return;
    }

    if (isExpanded) {
      gsap.to(el, {
        height: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => setIsExpanded(false),
      });
    } else {
      setIsExpanded(true);
      gsap.fromTo(
        el,
        { height: 0 },
        {
          height: el.scrollHeight,
          duration: 0.35,
          ease: 'power2.inOut',
          onComplete: () => {
            el.style.height = 'auto';
          },
        }
      );
    }
  };

  const handleCopyLink = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/careers?role=${job.slug}`;
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyClick = () => {
    // If reduced motion or save-data, trigger immediately
    const isSaveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
    if (reducedMotion || isSaveData) {
      onApply(job);
      return;
    }

    // Find the next available un-torn tab
    const nextTabIndex = Math.min(tornTabCount, 4);
    const tabEl = tabsRef.current[nextTabIndex];

    if (!tabEl) {
      onApply(job);
      return;
    }

    // Tear-off animation sequence
    const tl = gsap.timeline({
      onComplete: () => {
        // Modal opens after tear animation starts (at ~0.45s)
      },
    });

    // Tear curl & rip shake
    tl.to(tabEl, {
      rotate: -8,
      y: 14,
      transformOrigin: '50% 0',
      duration: 0.2,
      ease: 'power2.out',
    })
    .to(tabEl, {
      x: '+=3',
      yoyo: true,
      repeat: 3,
      duration: 0.05,
    })
    // Fall and spin away
    .to(tabEl, {
      y: 160,
      rotate: 18,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    });

    // Notify parent to open modal at ~0.45s
    setTimeout(() => {
      onApply(job);
    }, 450);
  };

  return (
    <article
      id={`role-${job.slug}`}
      className={`car-poster ${isHighlighted ? 'is-highlighted' : ''} ${className}`}
      style={{
        backgroundColor: bgTint,
        transform: `rotate(${tilt}deg)`,
      }}
    >
      {/* Tape on Top */}
      <span className="car-poster__tape tape" aria-hidden="true" />

      {/* Shareable Link Highlight "this one!" sticker */}
      {isHighlighted && (
        <div className="car-poster__highlight-badge sticker" aria-hidden="true">
          <Icon name="star" size={18} color="var(--sunny)" />
          <span>This one!</span>
        </div>
      )}

      {/* Top Header Note */}
      <div className="car-poster__header">
        <span className="car-poster__pretitle note">Help wanted</span>
        <Squiggle variant="short" color="var(--ink)" width={50} height={10} className="car-poster__header-squiggle" />
      </div>

      {/* Role Title */}
      <h3 className="car-poster__title">{job.title}</h3>

      {/* Chips Metadata */}
      <div className="car-poster__chips" aria-label="Role details">
        <span className="chip car-poster__chip">{job.type}</span>
        <span className="chip car-poster__chip">{job.experience}</span>
        <span className="chip car-poster__chip">{job.location || 'On campus'}</span>
        <span className="chip car-poster__chip car-poster__chip--closing">
          {formatClosingDate(job.closing)}
        </span>
      </div>

      {/* Description */}
      <p className="car-poster__desc">{job.description}</p>

      {/* Details Disclosure Toggle */}
      <div className="car-poster__disclosure">
        <button
          type="button"
          onClick={toggleDetails}
          className="car-poster__disclosure-btn"
          aria-expanded={isExpanded}
          aria-controls={`details-${job.slug}`}
        >
          <span>{isExpanded ? 'Hide details' : 'See the details'}</span>
          <Icon name={isExpanded ? 'minus' : 'plus'} size={16} />
        </button>

        {/* Expandable Content Container */}
        <div
          id={`details-${job.slug}`}
          ref={detailsRef}
          className={`car-poster__details-content ${isExpanded ? 'is-expanded' : ''}`}
          style={{ height: isExpanded ? 'auto' : 0, overflow: 'hidden' }}
        >
          {job.responsibilities && (
            <div className="car-poster__details-block">
              <h4 className="car-poster__details-heading">What you will do</h4>
              <ul className="car-poster__list">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="car-poster__list-item">
                    <span className="car-poster__check" aria-hidden="true">
                      <Icon name="check" size={14} color="var(--meadow)" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements && (
            <div className="car-poster__details-block">
              <h4 className="car-poster__details-heading">What we hope you bring</h4>
              <ul className="car-poster__list">
                {job.requirements.map((item, i) => (
                  <li key={i} className="car-poster__list-item">
                    <span className="car-poster__check" aria-hidden="true">
                      <Icon name="check" size={14} color="var(--meadow)" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Poster Action Buttons */}
      <div className="car-poster__actions">
        <Button
          variant="primary"
          onClick={handleApplyClick}
          className="car-poster__apply-btn"
        >
          Apply for this role
        </Button>

        <Button
          variant="ghost"
          onClick={handleCopyLink}
          className="car-poster__copy-btn"
          aria-label={`Copy link to ${job.title}`}
        >
          {copied ? 'Copied' : 'Copy link to this role'}
        </Button>
      </div>

      {/* Screen Reader Announcement for Copy Link */}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied link to clipboard' : ''}
      </span>

      {/* Tear-Off Tabs Strip along bottom edge (5 tabs, decorative) */}
      <div className="car-poster__tabs-strip" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((tabIndex) => {
          const isTorn = tabIndex < tornTabCount;
          return (
            <div key={tabIndex} className="car-poster__tab-slot">
              {/* Jagged stub left behind when torn */}
              <svg viewBox="0 0 40 8" className="car-poster__stub-svg" preserveAspectRatio="none">
                <path d="M0,0 L8,6 L16,1 L24,7 L32,2 L40,6 L40,8 L0,8 Z" fill="var(--ink)" opacity="0.3" />
              </svg>

              {/* The Tab */}
              <div
                ref={(el) => (tabsRef.current[tabIndex] = el)}
                className={`car-poster__tab ${isTorn ? 'is-torn' : ''}`}
                style={{ backgroundColor: bgTint }}
              >
                <div className="car-poster__tab-cutline" />
                <span className="car-poster__tab-text note">
                  {job.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default JobPoster;
