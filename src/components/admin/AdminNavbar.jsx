import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { siteConfig } from '../../config/siteConfig';

/**
 * Top Navigation bar for Preschool Administration Portal.
 */
export function AdminNavbar({ activeTab, onSelectTab, newEnquiriesCount = 0 }) {
  const brandName = siteConfig.brand?.name || 'Wiggle';

  return (
    <header className="admin-navbar">
      <div className="container admin-navbar__inner">
        {/* Brand identity */}
        <div className="admin-navbar__brand">
          <Link to="/" style={{ textDecoration: 'none' }} title={`${brandName} Preschool Homepage`}>
            <Logo size="sm" />
          </Link>
          <span className="admin-navbar__badge">Admin Desk</span>
        </div>

        {/* Tab navigation */}
        <nav className="admin-navbar__nav" aria-label="Admin Sections">
          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'enquiries' ? 'is-active' : ''}`}
            onClick={() => onSelectTab('enquiries')}
          >
            <span>📝 Admissions & Enquiries</span>
            {newEnquiriesCount > 0 && (
              <span className="admin-nav-tab__count">{newEnquiriesCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'seasonal' ? 'is-active' : ''}`}
            onClick={() => onSelectTab('seasonal')}
          >
            <span>🖼️ Seasonal & Themes</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'maintenance' ? 'is-active' : ''}`}
            onClick={() => onSelectTab('maintenance')}
          >
            <span>🔄 System & Maintenance</span>
          </button>
        </nav>

        {/* Quick External Actions */}
        <div className="admin-navbar__actions">
          <Link to="/" className="admin-btn admin-btn--secondary admin-btn--sm">
            <span>🌐 View Live Website</span>
          </Link>
          <Link to="/enquire" className="admin-btn admin-btn--primary admin-btn--sm">
            <span>➕ Test Parent Form</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
