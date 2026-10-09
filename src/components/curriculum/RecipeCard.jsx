import React, { useRef } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../ui/Icon';
import { curriculum } from '../../data/curriculum';
import { animate } from 'animejs';

/**
 * Section 2: Recipe for a Happy Learner.
 * Renders an illustrated, torn-edge recipe card with Ingredients and Method.
 */
export function RecipeCard() {
  const { approach = [], method = [] } = curriculum;
  const iconsRef = useRef([]);

  const handleIconHover = (index) => {
    const el = iconsRef.current[index];
    if (!el) return;
    animate(el, {
      rotate: [0, -12, 10, -6, 3, 0],
      scale: [1, 1.15, 1],
      duration: 450,
      ease: 'inOutQuad',
    });
  };

  const ingredientTints = ['var(--tint-pink)', 'var(--tint-yellow)', 'var(--tint-mint)', 'var(--tint-sky)'];

  return (
    <section id="recipe" className="section section--paper cur-recipe-section" aria-label="Our teaching recipe">
      <div className="container">
        <SectionHeading
          title="Our recipe for a happy learner"
          text="Every classroom at Wiggle is cooked from the same few ingredients."
          align="center"
          wiggle
        />

        <div className="cur-recipe-card-wrapper">
          <div className="cur-recipe-card sticker" role="region" aria-label="Recipe card">
            {/* Top washi tape */}
            <div className="cur-recipe-tape tape" aria-hidden="true" />

            {/* Handwritten metadata lines */}
            <div className="cur-recipe-meta">
              <span className="cur-recipe-meta-line note">Makes: one curious child</span>
              <span className="cur-recipe-meta-line note">Prep time: every single day</span>
            </div>

            <div className="cur-recipe-grid">
              {/* Left Column: Ingredients */}
              <div className="cur-recipe-col cur-recipe-ingredients">
                <h3 className="cur-recipe-col-title">Ingredients</h3>
                <ul className="cur-ingredients-list" role="list">
                  {approach.map((item, idx) => {
                    const tint = ingredientTints[idx % ingredientTints.length];
                    return (
                      <li
                        key={item.title || idx}
                        className="cur-ingredient-row"
                        onMouseEnter={() => handleIconHover(idx)}
                        onFocus={() => handleIconHover(idx)}
                        tabIndex={0}
                      >
                        <div
                          ref={(el) => (iconsRef.current[idx] = el)}
                          className="cur-ingredient-icon-bubble"
                          style={{ backgroundColor: tint }}
                          aria-hidden="true"
                        >
                          <Icon name={item.icon} size={22} color="var(--ink)" />
                        </div>
                        <div className="cur-ingredient-measure note">
                          {item.measure}
                        </div>
                        <div className="cur-ingredient-content">
                          <h4 className="cur-ingredient-title">{item.title}</h4>
                          <p className="cur-ingredient-text">{item.text}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Right Column: Method */}
              <div className="cur-recipe-col cur-recipe-method">
                <h3 className="cur-recipe-col-title">Method</h3>
                <ol className="cur-method-list">
                  {method.map((step, idx) => (
                    <li key={step.title || idx} className="cur-method-step">
                      <div className="cur-method-number note" aria-hidden="true">
                        {idx + 1}.
                      </div>
                      <div className="cur-method-content">
                        <h4 className="cur-method-title">{step.title}</h4>
                        <p className="cur-method-text">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Bottom sticky note */}
            <div className="cur-recipe-sticky-note sticker" aria-hidden="true">
              <span className="cur-sticky-tape" />
              <p className="cur-sticky-text note">Serve with a lot of giggles.</p>
            </div>

            {/* Serrated torn edge at bottom */}
            <svg
              className="cur-recipe-torn-edge"
              viewBox="0 0 1000 24"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,0 L0,12 
                   L25,22 L50,12 L75,22 L100,12 
                   L125,22 L150,12 L175,22 L200,12 
                   L225,22 L250,12 L275,22 L300,12 
                   L325,22 L350,12 L375,22 L400,12 
                   L425,22 L450,12 L475,22 L500,12 
                   L525,22 L550,12 L575,22 L600,12 
                   L625,22 L650,12 L675,22 L700,12 
                   L725,22 L750,12 L775,22 L800,12 
                   L825,22 L850,12 L875,22 L900,12 
                   L925,22 L950,12 L975,22 L1000,12 
                   L1000,0 Z"
                fill="var(--paper)"
              />
              <path
                d="M0,12 
                   L25,22 L50,12 L75,22 L100,12 
                   L125,22 L150,12 L175,22 L200,12 
                   L225,22 L250,12 L275,22 L300,12 
                   L325,22 L350,12 L375,22 L400,12 
                   L425,22 L450,12 L475,22 L500,12 
                   L525,22 L550,12 L575,22 L600,12 
                   L625,22 L650,12 L675,22 L700,12 
                   L725,22 L750,12 L775,22 L800,12 
                   L825,22 L850,12 L875,22 L900,12 
                   L925,22 L950,12 L975,22 L1000,12"
                stroke="var(--ink)"
                strokeWidth="2.5"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecipeCard;
