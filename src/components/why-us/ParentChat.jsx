import React, { useState, useRef } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Mascot } from '../ui/Mascot';
import { testimonials } from '../../data/testimonials';
import { chatReply } from '../../data/whyUs';
import { about } from '../../data/about';
import { siteConfig } from '../../config/siteConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Palette tints for parent name badges
const NAME_TINTS = ['var(--tint-pink)', 'var(--tint-sky)', 'var(--tint-yellow)', 'var(--tint-mint)'];

/**
 * Section 5: What Parents Say (Class Chat).
 * A phone messaging screen showing parent testimonials popping in sequentially,
 * followed by a bouncing typing indicator and teacher reply.
 */
export function ParentChat({ disclaimer = 'Sample messages' }) {
  const brand = siteConfig.brand?.name || 'Wiggle';
  const chatWindowRef = useRef(null);
  const isReduced = useReducedMotion();

  // Find families stat from about.stats if available
  const familiesStat = about?.stats?.find((s) => s.label?.toLowerCase().includes('families'))?.value;
  const memberCountText = familiesStat ? `${familiesStat} members` : null;

  // State to control step-by-step visibility of chat items
  const [visibleCount, setVisibleCount] = useState(isReduced ? testimonials.length : 0);
  const [showTyping, setShowTyping] = useState(false);
  const [showReply, setShowReply] = useState(isReduced);

  useGSAP(() => {
    if (isReduced || !chatWindowRef.current) return;

    ScrollTrigger.create({
      trigger: chatWindowRef.current,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        let current = 0;
        const total = testimonials.length;

        // Interval to reveal incoming parent bubbles one by one
        const interval = setInterval(() => {
          current += 1;
          setVisibleCount(current);

          if (current >= total) {
            clearInterval(interval);
            // Show typing indicator after last parent message
            setTimeout(() => {
              setShowTyping(true);
              // Replace typing indicator with teacher reply after 1.4s
              setTimeout(() => {
                setShowTyping(false);
                setShowReply(true);
              }, 1400);
            }, 600);
          }
        }, 750);
      },
    });
  }, { scope: chatWindowRef, dependencies: [isReduced] });

  return (
    <section
      id="chat"
      className="section section--paper why-chat-section"
      aria-label="Parents community chat"
    >
      <div className="container">
        <SectionHeading
          title="What the parents' chat looks like"
          text="Real parents, real mornings."
          align="center"
          wiggle
        />

        {/* Optional handwritten disclaimer */}
        {disclaimer && (
          <div className="why-chat-disclaimer-wrap">
            <span className="why-chat-disclaimer note">
              * {disclaimer} from our community
            </span>
          </div>
        )}

        {/* Phone Chat Frame */}
        <div ref={chatWindowRef} className="why-chat-window-wrapper">
          <div className="why-chat-frame sticker" role="region" aria-label="Class group chat message window">
            {/* Phone Speaker Notch */}
            <div className="why-phone-speaker" aria-hidden="true" />

            {/* Chat Top Header */}
            <div className="why-chat-header">
              <div className="why-chat-group-avatar">
                <Mascot mood="cheer" size={42} />
              </div>

              <div className="why-chat-group-info">
                <h3 className="why-chat-group-title">{brand} parents</h3>
                {memberCountText && (
                  <span className="why-chat-group-members note">
                    {memberCountText}
                  </span>
                )}
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="why-chat-body" role="log" aria-live="polite">
              {/* Parent Testimonial Messages */}
              {testimonials.map((item, idx) => {
                const isShown = isReduced || idx < visibleCount;
                const tint = NAME_TINTS[idx % NAME_TINTS.length];

                if (!isShown) return null;

                return (
                  <article
                    key={item.id || idx}
                    className="why-chat-bubble why-bubble-incoming"
                  >
                    <span
                      className="why-parent-name-tag chip"
                      style={{ backgroundColor: tint }}
                    >
                      {item.parentName}
                    </span>

                    <blockquote className="why-bubble-quote">
                      “{item.quote}”
                    </blockquote>

                    <span className="why-bubble-relation note">
                      {item.relation}
                    </span>
                  </article>
                );
              })}

              {/* Three Bouncing Dots Typing Indicator */}
              {showTyping && (
                <div className="why-chat-bubble why-bubble-typing" aria-label="Teacher is typing">
                  <span className="why-typing-dot" />
                  <span className="why-typing-dot" />
                  <span className="why-typing-dot" />
                </div>
              )}

              {/* Outgoing Teacher Reply Bubble */}
              {showReply && (
                <article className="why-chat-bubble why-bubble-teacher">
                  <div className="why-teacher-header">
                    <span className="why-teacher-name-tag note">
                      Teacher Priya ({brand})
                    </span>
                  </div>

                  <p className="why-teacher-reply-text">
                    {chatReply}
                  </p>

                  <span className="why-bubble-time note">
                    Just now • 12:45 pm
                  </span>
                </article>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ParentChat;
