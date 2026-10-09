import React, { useState, useRef, useEffect, useId } from 'react';
import { programs } from '../../data/programs';
import { siteConfig } from '../../config/siteConfig';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { Mascot } from '../ui/Mascot';
import { Icon } from '../ui/Icon';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './programs.css';

/**
 * Formats a decimal age into friendly sentence case words.
 * @param {number} num
 * @returns {string}
 */
function formatAgeInWords(num) {
  const whole = Math.floor(num);
  const isHalf = num % 1 !== 0;

  if (isHalf) {
    if (whole === 1) return '1 year and 6 months';
    return `${whole} years and 6 months`;
  }
  return whole === 1 ? '1 year' : `${whole} years`;
}

/**
 * Section 3: Interactive age finder slider matching child's age to their program station.
 */
export function AgeFinder() {
  const minAge = Math.min(...programs.map((p) => p.minAge ?? 1.5));
  const maxAge = Math.max(...programs.map((p) => p.maxAge ?? 5.5));
  const sliderId = useId();

  const [age, setAge] = useState(2.5);
  const [isSliding, setIsSliding] = useState(false);
  const resultCardRef = useRef(null);
  const prevSlugRef = useRef('');
  const reducedMotion = useReducedMotion();
  const brandName = siteConfig?.brand?.name || 'Wiggle';

  // Matching rule: age >= minAge && age < maxAge (last program also accepts age === maxAge)
  const matchedProgram =
    programs.find((p, idx) => {
      const isLast = idx === programs.length - 1;
      if (isLast) {
        return age >= p.minAge && age <= p.maxAge;
      }
      return age >= p.minAge && age < p.maxAge;
    }) || programs[0];

  const ageWords = formatAgeInWords(age);

  // Micro-interaction: pop animation when matched program changes
  useEffect(() => {
    if (reducedMotion || !resultCardRef.current) return;

    if (prevSlugRef.current && prevSlugRef.current !== matchedProgram.slug) {
      import('animejs').then(({ animate }) => {
        animate(resultCardRef.current, {
          scale: [0.96, 1],
          duration: 280,
          ease: 'outBack(1.5)',
        });
      });
    }
    prevSlugRef.current = matchedProgram.slug;
  }, [matchedProgram.slug, reducedMotion]);

  const handleSliderChange = (e) => {
    setAge(parseFloat(e.target.value));
  };

  const handleChipClick = (p) => {
    setAge(p.minAge);
  };

  const progressPercent = ((age - minAge) / (maxAge - minAge)) * 100;

  const tintBgMap = {
    yellow: 'var(--tint-yellow)',
    pink: 'var(--tint-pink)',
    mint: 'var(--tint-mint)',
    sky: 'var(--tint-sky)',
  };

  return (
    <section className="section section--yellow programs-finder" aria-label="Age finder">
      <div className="container">
        <SectionHeading
          title="Not sure where your child fits?"
          note="Slide to your child's age."
          align="center"
          wiggle
        />

        <div className="programs-finder__layout">
          {/* Controls Column */}
          <div className="programs-finder__controls">
            {/* Live Age Readout Banner */}
            <div className="programs-finder__readout" aria-live="polite">
              <span className="programs-finder__readout-sub">Selected age</span>
              <span className="programs-finder__readout-value">{ageWords}</span>
            </div>

            {/* Accessible Range Slider */}
            <div className="programs-finder__slider-wrap">
              <label htmlFor={sliderId} className="visually-hidden">
                Child age in years
              </label>

              {/* Slider Track with Custom Progress Fill & Rails */}
              <div className="programs-slider-track-bg">
                <div
                  className="programs-slider-track-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <input
                id={sliderId}
                type="range"
                min={minAge}
                max={maxAge}
                step={0.5}
                value={age}
                onChange={handleSliderChange}
                onMouseDown={() => setIsSliding(true)}
                onMouseUp={() => setIsSliding(false)}
                onTouchStart={() => setIsSliding(true)}
                onTouchEnd={() => setIsSliding(false)}
                aria-valuemin={minAge}
                aria-valuemax={maxAge}
                aria-valuenow={age}
                aria-valuetext={ageWords}
                className="programs-slider-input"
              />
            </div>

            {/* Station Age Band Color Indicators */}
            <div className="programs-finder__ticks" aria-hidden="true">
              {programs.map((p) => {
                const isCurrent = matchedProgram.slug === p.slug;
                return (
                  <div
                    key={p.slug}
                    className={`programs-finder__tick ${isCurrent ? 'is-active' : ''}`}
                  >
                    <span
                      className="programs-finder__tick-dot"
                      style={{ backgroundColor: tintBgMap[p.tint] }}
                    />
                    <span className="programs-finder__tick-label">{p.name}</span>
                    <span className="programs-finder__tick-range">{p.ageRange}</span>
                  </div>
                );
              })}
            </div>

            {/* Quick Touch Chip Buttons */}
            <div className="programs-finder__chips" role="group" aria-label="Program age bands">
              {programs.map((p) => {
                const isSelected = matchedProgram.slug === p.slug;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    className={`chip ${isSelected ? 'chip--active' : ''}`}
                    onClick={() => handleChipClick(p)}
                    aria-pressed={isSelected}
                  >
                    {`${p.name} (${p.minAge}–${p.maxAge}y)`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result Ticket Card */}
          <div
            ref={resultCardRef}
            className="programs-finder__ticket"
            style={{ backgroundColor: tintBgMap[matchedProgram.tint] || 'var(--paper)' }}
            aria-live="polite"
          >
            {/* Ticket Notches & Perforation */}
            <div className="programs-ticket__notch notch-top" aria-hidden="true" />
            <div className="programs-ticket__notch notch-bottom" aria-hidden="true" />

            <div className="programs-ticket__content">
              {/* Header with Mascot */}
              <div className="programs-ticket__header">
                <div>
                  <span className="programs-ticket__label">Recommended station</span>
                  <h3 className="programs-ticket__title">{`Your station: ${matchedProgram.name}`}</h3>
                  <span className="chip programs-ticket__chip">{matchedProgram.ageRange}</span>
                </div>

                <div className="programs-ticket__mascot" aria-hidden="true">
                  <Mascot mood={isSliding ? 'peek' : 'cheer'} size={72} />
                </div>
              </div>

              {/* Tagline & Focus */}
              <p className="programs-ticket__tagline">
                {matchedProgram.tagline}
              </p>

              {matchedProgram.focus && (
                <div className="programs-ticket__focus">
                  <span className="programs-ticket__focus-title">Daily focus:</span>
                  <span>{matchedProgram.focus}</span>
                </div>
              )}

              {/* 3 Checked Highlights */}
              <ul className="programs-ticket__highlights" aria-label="Program highlights">
                {matchedProgram.highlights?.slice(0, 3).map((hl, i) => (
                  <li key={i} className="programs-ticket__highlight-item">
                    <span className="programs-ticket__check-icon" aria-hidden="true">
                      <Icon name="check" size={15} color="var(--ink)" />
                    </span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="programs-ticket__actions">
                <Button variant="primary" to={`/programs/${matchedProgram.slug}`}>
                  {`See the ${matchedProgram.name} program`}
                </Button>

                <WhatsAppButton
                  message={`Hi ${brandName}! My child is ${ageWords}. Could you tell me about the ${matchedProgram.name} program?`}
                  label="Ask on WhatsApp"
                  variant="ghost"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
