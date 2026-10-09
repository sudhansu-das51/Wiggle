import React, { useState, useRef, useEffect } from 'react';
import { Mascot } from '../ui/Mascot';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { MQ } from '../../utils/breakpoints';
import { formatAddress, buildDirectionsUrl } from '../../utils/contact';

/**
 * Folded paper map card with Google Maps iframe, scroll-trap protection,
 * peeking Wig mascot, and bobbing "We are here" pin sticker.
 * @param {{
 *   contact: {
 *     mapEmbedUrl?: string,
 *     address?: any,
 *     landmark?: string,
 *     directionsUrl?: string,
 *     [key: string]: any
 *   },
 *   className?: string
 * }} props
 */
export function MapFrame({ contact, className = '' }) {
  const [isInteractive, setIsInteractive] = useState(false);
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const mapEmbedUrl = contact?.mapEmbedUrl;
  const { singleLine, multiLine } = formatAddress(contact?.address);
  const directionsUrl = buildDirectionsUrl(contact);

  // Keyboard Escape listener to exit interactive map mode
  useEffect(() => {
    if (!isInteractive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsInteractive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInteractive]);

  // Anime.js bobbing pin loop (only when map is visible, not on phone, not reduced motion, not save-data)
  useEffect(() => {
    if (!pinRef.current || !containerRef.current) return;

    const isPhone = typeof window !== 'undefined' && window.matchMedia(MQ.phone).matches;
    const isSaveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;

    if (reducedMotion || isPhone || isSaveData) return;

    let animeInstance = null;
    let isVisible = false;

    // Load animejs dynamically or statically
    import('animejs').then(({ animate }) => {
      if (!pinRef.current) return;

      animeInstance = animate(pinRef.current, {
        translateY: [0, -8],
        duration: 1600,
        ease: 'easeInOutSine',
        alternate: true,
        loop: true,
        autoplay: false,
      });

      if (isVisible && !document.hidden) {
        animeInstance.play();
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (animeInstance) {
            if (isVisible && !document.hidden) {
              animeInstance.play();
            } else {
              animeInstance.pause();
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(containerRef.current);

    const handleVisibilityChange = () => {
      if (!animeInstance) return;
      if (document.hidden || !isVisible) {
        animeInstance.pause();
      } else {
        animeInstance.play();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animeInstance) {
        animeInstance.pause();
      }
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`con-map-frame ${isInteractive ? 'con-map-frame--interactive' : ''} ${className}`}
    >
      {/* Bobbing Pin Sticker */}
      <div ref={pinRef} className="con-map__pin-sticker" aria-hidden="true">
        <div className="con-map__pin-head">
          <Icon name="pin" size={24} color="var(--bubblegum)" />
          <span className="con-map__pin-label note">We are here</span>
        </div>
      </div>

      {/* Peeking Mascot */}
      <div className="con-map__mascot" aria-hidden="true">
        <Mascot mood="peek" size={72} />
      </div>

      {/* Corner Tape Strips */}
      <div className="con-map__tape con-map__tape--top-left tape" aria-hidden="true" />
      <div className="con-map__tape con-map__tape--bottom-right tape" aria-hidden="true" />

      {/* Folded Paper Map Card */}
      <div className="con-map__card">
        {/* Fold crease overlays */}
        <div className="con-map__crease con-map__crease--vertical" aria-hidden="true" />
        <div className="con-map__crease con-map__crease--horizontal" aria-hidden="true" />

        {mapEmbedUrl ? (
          <div className="con-map__embed-wrapper">
            <iframe
              src={mapEmbedUrl}
              title="Map showing the school location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="con-map__iframe"
              style={{
                pointerEvents: isInteractive ? 'auto' : 'none',
              }}
            />

            {/* Scroll-trap Overlay Protection */}
            {!isInteractive ? (
              <button
                type="button"
                className="con-map__trap-overlay"
                onClick={() => setIsInteractive(true)}
                aria-pressed={false}
                aria-label="Tap to explore the map"
              >
                <span className="con-map__trap-badge">
                  <Icon name="pin" size={18} />
                  <span>Tap to explore the map</span>
                </span>
              </button>
            ) : (
              <div className="con-map__active-bar">
                <button
                  type="button"
                  className="con-map__done-btn"
                  onClick={() => setIsInteractive(false)}
                  aria-pressed={true}
                >
                  <Icon name="close" size={16} />
                  <span>Done, back to scrolling</span>
                </button>
                <span className="con-map__active-hint note">Press Esc or tap button to lock map</span>
              </div>
            )}
          </div>
        ) : (
          /* Illustrated Fallback Map if mapEmbedUrl is missing */
          <div className="con-map__placeholder">
            <div className="con-map__placeholder-pattern" aria-hidden="true">
              <svg viewBox="0 0 400 300" className="con-map__placeholder-svg">
                <path d="M 20 60 Q 120 40 220 80 T 380 70" fill="none" stroke="var(--ink)" strokeWidth="1.5" opacity="0.3" />
                <path d="M 30 180 Q 150 140 250 200 T 370 170" fill="none" stroke="var(--ink)" strokeWidth="2" opacity="0.4" />
                <path d="M 120 20 Q 140 150 130 280" fill="none" stroke="var(--ink)" strokeWidth="2.5" opacity="0.3" />
                <circle cx="250" cy="130" r="30" fill="var(--tint-mint)" stroke="var(--ink)" strokeWidth="1.5" opacity="0.7" />
                <circle cx="90" cy="100" r="20" fill="var(--tint-sky)" stroke="var(--ink)" strokeWidth="1.5" opacity="0.7" />
                <circle cx="330" cy="220" r="24" fill="var(--tint-yellow)" stroke="var(--ink)" strokeWidth="1.5" opacity="0.7" />
              </svg>
            </div>
            <div className="con-map__placeholder-content">
              <div className="con-map__placeholder-badge sticker">
                <Icon name="pin" size={24} color="var(--tangerine)" />
              </div>
              <h4 className="con-map__placeholder-title">Campus location</h4>
              <p className="con-map__placeholder-address">{singleLine || 'Rainbow Lane, Green Park'}</p>
              {contact?.landmark && (
                <p className="con-map__placeholder-landmark note">{contact.landmark}</p>
              )}
              <Button
                variant="ghost"
                href={directionsUrl}
                icon={<Icon name="pin" size={18} />}
                className="con-map__placeholder-btn"
              >
                Open in Google Maps
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapFrame;
