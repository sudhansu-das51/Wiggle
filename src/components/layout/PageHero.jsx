import React from 'react';
import { WiggleText } from '../motion/WiggleText';
import { TransitionLink } from '../motion/TransitionLink';
import { Mascot } from '../ui/Mascot';
import { Icon } from '../ui/Icon';
import { PlayfulDecor } from './PlayfulDecor';
import './PageHero.css';

/**
 * Banner for inner pages (about 45vh).
 * @param {{
 *   title: string,
 *   note?: string,
 *   tint?: 'yellow' | 'pink' | 'mint' | 'sky' | 'paper',
 *   mascotMood?: 'wave' | 'peek' | 'cheer' | 'sleepy' | 'point',
 *   crumbs?: Array<{ label: string, path?: string }>,
 *   icon?: string,
 *   className?: string
 * }} props
 */
export function PageHero({
  title,
  note,
  tint = 'yellow',
  mascotMood = 'wave',
  crumbs,
  icon,
  className = '',
}) {
  const tintClasses = {
    yellow: 'section--yellow',
    pink: 'section--pink',
    mint: 'section--mint',
    sky: 'section--sky',
    paper: 'section--paper',
  };

  const selectedTint = tintClasses[tint] || 'section--yellow';

  return (
    <div className={`page-hero ${selectedTint} ${className}`}>
      {/* 3-4 playful animated floating elements (clouds, stars, sparkles, bubbles) */}
      <PlayfulDecor title={title} />

      <div className="container">
        <nav className="page-hero__breadcrumb" aria-label="Breadcrumb">
          {crumbs && crumbs.length > 0 ? (
            crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <span aria-hidden="true">/</span>}
                  {isLast || !crumb.path ? (
                    <span aria-current="page">{crumb.label}</span>
                  ) : (
                    <TransitionLink to={crumb.path}>{crumb.label}</TransitionLink>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <>
              <TransitionLink to="/">Home</TransitionLink>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{title}</span>
            </>
          )}
        </nav>

        <div className="page-hero__content">
          {note && <span className="note">{note}</span>}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {icon && (
              <span className="page-hero__icon sticker" aria-hidden="true" style={{ padding: '0.4rem', backgroundColor: 'var(--paper)', borderRadius: 'var(--r-md)' }}>
                <Icon name={icon} size={42} color="var(--ink)" />
              </span>
            )}
            <h1 style={{ margin: 0 }}>
              <WiggleText play>{title}</WiggleText>
            </h1>
          </div>
        </div>

        <div className="page-hero__mascot" aria-hidden="true">
          <Mascot mood={mascotMood} size={110} />
        </div>
      </div>
    </div>
  );
}
