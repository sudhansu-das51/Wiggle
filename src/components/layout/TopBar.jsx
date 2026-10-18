import React, { useState, useEffect } from 'react';
import { siteConfig } from '../../config/siteConfig';
import { Icon } from '../ui/Icon';
import { SocialLinks } from '../ui/SocialLinks';
import { getActiveSeasonDetails } from '../../utils/seasonalConfig';
import './TopBar.css';

/**
 * Slim top utility bar showing contact info, active seasonal campaign, admissions status, and social icons.
 */
export function TopBar() {
  const { contact, admissions } = siteConfig;
  const [season, setSeason] = useState(() => getActiveSeasonDetails());
  const [maintenance, setMaintenance] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('wiggle_maintenance_mode') === 'true';
  });

  useEffect(() => {
    const handleSeasonChange = () => setSeason(getActiveSeasonDetails());
    const handleMaintChange = (e) => setMaintenance(e.detail);

    window.addEventListener('wiggle:seasonal-updated', handleSeasonChange);
    window.addEventListener('wiggle:maintenance-mode-changed', handleMaintChange);
    window.addEventListener('storage', handleSeasonChange);

    return () => {
      window.removeEventListener('wiggle:seasonal-updated', handleSeasonChange);
      window.removeEventListener('wiggle:maintenance-mode-changed', handleMaintChange);
      window.removeEventListener('storage', handleSeasonChange);
    };
  }, []);

  return (
    <>
      {/* Maintenance alert strip if activated in Admin */}
      {maintenance && (
        <div style={{
          background: 'var(--sunny)',
          borderBottom: '2px solid var(--ink)',
          padding: '0.4rem 1rem',
          textAlign: 'center',
          fontSize: '0.825rem',
          fontWeight: 800,
          color: 'var(--ink)'
        }}>
          🚧 Campus Update: Special sanitation & seasonal preparations underway. Admissions desk remains open on WhatsApp.
        </div>
      )}

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
            {/* Active Seasonal Announcement or Admission Badge */}
            {season?.showBanner && (
              <div className="top-bar__badge" title={season.displayText}>
                <span className="top-bar__badge-dot" aria-hidden="true" style={{ background: season.accentColor || 'var(--meadow)' }} />
                <span>{season.badgeText || admissions.badgeText || 'Admissions open'}</span>
              </div>
            )}

            <div className="top-bar__social">
              <SocialLinks size={15} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

