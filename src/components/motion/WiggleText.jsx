import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './WiggleText.css';

/**
 * Splits text into words and alternating rotated characters.
 * Signature headline treatment with entrance and hover wobble.
 * @param {{
 *   children: string,
 *   play?: boolean,
 *   className?: string,
 *   as?: string
 * }} props
 */
export function WiggleText({
  children,
  play = false,
  className = '',
  as: Component = 'span',
}) {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const text = typeof children === 'string' ? children : String(children || '');
  const words = text.split(' ');

  // Small alternating rest angles
  const rotations = [-2.5, 2.5, -3, 2, -2, 3, -1.5, 2.5];

  useEffect(() => {
    if (!play || reducedMotion || !containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.wiggle-char');
    if (!chars.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        {
          y: -24,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: 'back.out(1.8)',
          stagger: 0.025,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [play, reducedMotion]);

  let globalCharIndex = 0;

  return (
    <Component
      ref={containerRef}
      className={`wiggle-text ${className}`}
      aria-label={text}
    >
      <span aria-hidden="true">
        {words.map((word, wordIdx) => {
          const chars = word.split('');
          return (
            <React.Fragment key={wordIdx}>
              <span className="wiggle-word">
                {chars.map((char) => {
                  const rot = rotations[globalCharIndex % rotations.length];
                  globalCharIndex++;
                  return (
                    <span
                      key={globalCharIndex}
                      className="wiggle-char"
                      style={{
                        '--base-rot': `${rot}deg`,
                        transform: `rotate(${rot}deg)`,
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
              {wordIdx < words.length - 1 && ' '}
            </React.Fragment>
          );
        })}
      </span>
    </Component>
  );
}
