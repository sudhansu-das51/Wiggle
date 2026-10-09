import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { admissionSteps as defaultSteps } from '../../data/programs';
import { siteConfig } from '../../config/siteConfig';
import { getOpenStatus } from '../../utils/contact';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * EnquiryAside sticky column.
 * 1. What happens next (admission steps as ticket stubs)
 * 2. Prefer to talk? (call postcard with live open status chip)
 * 3. Admissions badge (rotated sticker with wobble on load)
 * @param {{
 *   steps?: Array<{ title: string, text: string, icon: string }>,
 *   className?: string
 * }} props
 */
export function EnquiryAside({ steps = defaultSteps, className = '' }) {
  const { contact, admissions } = siteConfig;
  const [openStatus, setOpenStatus] = useState(() => getOpenStatus(contact?.hours));
  const badgeRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Periodically check open status every minute while visible
  useEffect(() => {
    const update = () => {
      if (document.hidden) return;
      setOpenStatus(getOpenStatus(contact?.hours));
    };

    const intervalId = setInterval(update, 60000);
    const handleVis = () => {
      if (!document.hidden) update();
    };

    document.addEventListener('visibilitychange', handleVis);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVis);
    };
  }, [contact?.hours]);

  // Badge wobble on load
  useEffect(() => {
    if (!badgeRef.current || reducedMotion) return;

    import('animejs').then(({ animate }) => {
      if (!badgeRef.current) return;
      animate(badgeRef.current, {
        rotate: [-3, 4, -2, 1, -2],
        duration: 900,
        ease: 'inOutQuad',
      });
    });
  }, [reducedMotion]);

  return (
    <aside className={`enq-aside ${className}`} aria-label="Admissions help and steps">
      {/* 1. Admissions Badge Sticker */}
      {admissions?.badgeText && (
        <div ref={badgeRef} className="enq-badge-wrap sticker" aria-hidden="true">
          <div className="enq-badge">
            <Icon name="sun" size={18} color="var(--ink)" />
            <span className="enq-badge__text note">{admissions.badgeText}</span>
          </div>
        </div>
      )}

      {/* 2. What Happens Next: Clean Ticket Stubs */}
      <div className="enq-aside-card enq-aside-card--steps sticker">
        <div className="enq-aside-card__header">
          <h3 className="enq-aside-card__title">What happens next</h3>
          <p className="enq-aside-card__subtext">
            Four gentle steps from your message to your child’s first circle.
          </p>
        </div>

        <div className="enq-stubs-list" role="list">
          {steps.map((step, idx) => (
            <article key={idx} className="enq-stub" role="listitem">
              <div className="enq-stub__leading" aria-hidden="true">
                <span className="enq-stub__num note">{idx + 1}</span>
                <span className="enq-stub__icon">
                  <Icon name={step.icon} size={16} color="var(--ink)" />
                </span>
              </div>
              <div className="enq-stub__content">
                <h4 className="enq-stub__title">{step.title}</h4>
                <p className="enq-stub__text">{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 3. Prefer to talk? Call Postcard */}
      <div className="enq-aside-card enq-aside-card--call sticker">
        <div className="enq-call-postcard">
          <div className="enq-call-postcard__header">
            <div className="enq-call-postcard__info">
              <h3 className="enq-call-postcard__title">Prefer to talk?</h3>
              <p className="enq-call-postcard__desc">
                Our admissions desk is happy to answer quick questions directly over a phone call.
              </p>
            </div>
            <div className="enq-call-postcard__stamp sticker" aria-hidden="true">
              <Icon name="phone" size={18} color="var(--ink)" />
            </div>
          </div>

          <div className="enq-call-postcard__details">
            <a
              href={`tel:${contact?.phone}`}
              className="enq-call-postcard__phone-link"
              aria-label={`Call admissions at ${contact?.phoneDisplay || '+91 99999 99999'}`}
            >
              <Icon name="phone" size={15} />
              <span>{contact?.phoneDisplay || '+91 99999 99999'}</span>
            </a>

            {openStatus && (
              <div
                className={`enq-open-status-chip ${openStatus.isOpen ? 'enq-open-status-chip--open' : 'enq-open-status-chip--closed'}`}
                aria-live="polite"
              >
                <span
                  className="enq-open-status-chip__dot"
                  style={{ backgroundColor: openStatus.isOpen ? 'var(--meadow)' : 'var(--muted)' }}
                  aria-hidden="true"
                />
                <span>{openStatus.label}</span>
              </div>
            )}
          </div>

          <div className="enq-call-postcard__action">
            <Button
              variant="ghost"
              href={`tel:${contact?.phone}`}
              icon={<Icon name="phone" size={18} />}
              className="enq-call-btn"
            >
              Call admissions desk
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default EnquiryAside;
