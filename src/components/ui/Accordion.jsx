import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Icon } from './Icon';

/**
 * Accessible accordion with one-item-open constraint and GSAP height animation.
 * @param {{
 *   items: Array<{ id: string | number, question: string, answer: string }>,
 *   className?: string
 * }} props
 */
export function Accordion({ items = [], className = '' }) {
  const [openId, setOpenId] = useState(null);
  const contentRefs = useRef({});
  const reducedMotion = useReducedMotion();

  const handleToggle = (id) => {
    const isCurrentlyOpen = openId === id;
    const nextId = isCurrentlyOpen ? null : id;

    // Animate closing of currently open item
    if (openId !== null && contentRefs.current[openId]) {
      const el = contentRefs.current[openId];
      if (reducedMotion) {
        el.style.height = '0px';
      } else {
        gsap.to(el, {
          height: 0,
          duration: 0.35,
          ease: 'power2.inOut',
        });
      }
    }

    // Animate opening of next item
    if (nextId !== null && contentRefs.current[nextId]) {
      const el = contentRefs.current[nextId];
      if (reducedMotion) {
        el.style.height = 'auto';
      } else {
        gsap.fromTo(
          el,
          { height: 0 },
          {
            height: el.scrollHeight,
            duration: 0.4,
            ease: 'back.out(1.2)',
            onComplete: () => {
              el.style.height = 'auto';
            },
          }
        );
      }
    }

    setOpenId(nextId);
  };

  return (
    <div
      className={`accordion-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '820px',
        marginInline: 'auto',
      }}
    >
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = `accordion-btn-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={`accordion-item ${isOpen ? 'is-open' : ''}`}
            style={{
              backgroundColor: 'var(--paper)',
              border: 'var(--outline)',
              borderRadius: 'var(--r-md)',
              boxShadow: isOpen ? 'var(--shadow-sticker-hover)' : 'var(--shadow-sticker)',
              overflow: 'hidden',
              transition: 'box-shadow 0.2s ease',
            }}
          >
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => handleToggle(item.id)}
              style={{
                width: '100%',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  color: 'var(--ink)',
                }}
              >
                {item.question}
              </span>
              <span
                style={{
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  flexShrink: 0,
                  display: 'inline-flex',
                }}
                aria-hidden="true"
              >
                <Icon name={isOpen ? 'minus' : 'plus'} size={20} color="var(--ink)" />
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              ref={(el) => {
                contentRefs.current[item.id] = el;
              }}
              style={{
                height: isOpen ? 'auto' : 0,
                overflow: 'hidden',
                transition: reducedMotion ? 'none' : undefined,
              }}
            >
              <div
                style={{
                  padding: '0 1.5rem 1.5rem 1.5rem',
                  color: 'var(--muted)',
                  fontSize: '1.02rem',
                  lineHeight: 1.6,
                }}
              >
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
