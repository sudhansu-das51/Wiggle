import React from 'react';
import { siteConfig } from '../../config/siteConfig';
import { Icon } from '../ui/Icon';
import { SocialLinks } from '../ui/SocialLinks';
import './TopBar.css';

/**
 * Slim top utility bar showing contact info, admissions status, and social icons.
 */
export function TopBar() {
  const { contact, admissions } = siteConfig;

  return (
    <div className="top-bar">
      <div className="container top-bar__container">
        <div className="top-bar__left">
          <a href={`tel:${contact.phone}`} className="top-bar__link">
            <Icon name="phone" size={15} color="var(--ink)" />
            <span>{contact.phoneDisplay}</span>
          </a>

          <a href={`mailto:${contact.email}`} className="top-bar__link top-bar__email">
            <Icon name="mail" size={15} color="var(--ink)" />
            <span>{contact.email}</span>
          </a>
        </div>

        <div className="top-bar__right">
          {admissions?.open && (
            <div className="top-bar__badge">
              <span className="top-bar__badge-dot" aria-hidden="true" />
              <span>{admissions.badgeText || 'Admissions open'}</span>
            </div>
          )}

          <div className="top-bar__social">
            <SocialLinks size={15} />
          </div>
        </div>
      </div>
    </div>
  );
}
