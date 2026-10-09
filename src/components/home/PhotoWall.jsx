import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { gallery } from '../../data/gallery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import './home.css';

/**
 * Section 8: Photo Wall.
 * 8 scattered gallery items with tape, rotation, and GSAP slap entrance.
 */
export function PhotoWall() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const reducedMotion = useReducedMotion();

  const wallItems = gallery.slice(0, 8);
  const rotations = [-4, 3, -2, 5, -3, 2, -4, 3];

  useGSAP(() => {
    if (reducedMotion || !sectionRef.current) return;

    itemsRef.current.forEach((el, index) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { scale: 1.25, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          delay: (index % 4) * 0.1,
          ease: 'back.out(1.8)',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, { scope: sectionRef, dependencies: [reducedMotion] });

  return (
    <section ref={sectionRef} className="section section--sky photo-wall" aria-label="Photo Gallery Wall">
      <div className="container">
        <SectionHeading
          title="Last week at Wiggle"
          note="Unposed moments of discovery, paint, and outdoor laughter."
          align="center"
          wiggle
        />

        <div className="photo-wall__stage">
          {wallItems.map((item, idx) => {
            const imgSrc = `/images/HM${idx + 1}.png`;
            return (
              <div
                key={item.id}
                ref={(el) => { itemsRef.current[idx] = el; }}
                className="photo-wall__item"
                style={{ transform: `rotate(${rotations[idx % rotations.length]}deg)` }}
              >
                <span className="tape" />
                <div className="photo-wall__photo-frame">
                  <img
                    src={imgSrc}
                    alt={item.title}
                    className="photo-wall__img"
                    loading="lazy"
                  />
                </div>
                <div className="photo-wall__caption">
                  <p className="photo-wall__title">{item.title}</p>
                  {item.category && (
                    <span className={`photo-wall__tag photo-wall__tag--${item.tint || 'yellow'}`}>
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Button variant="primary" to="/gallery">
            See the gallery
          </Button>
        </div>
      </div>
    </section>
  );
}
