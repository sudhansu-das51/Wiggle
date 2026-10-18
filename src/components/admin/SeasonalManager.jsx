import React, { useState, useEffect } from 'react';
import {
  SEASONAL_PRESETS,
  getSeasonalConfig,
  saveSeasonalConfig
} from '../../utils/seasonalConfig';

/**
 * Seasonal Manager & Announcement System for Preschool Website.
 * Lets administrators change seasonal campaigns (Summer, Monsoon, Winter, Admissions),
 * customize announcement banners, and toggle top utility notices.
 */
export function SeasonalManager() {
  const [config, setConfig] = useState(() => getSeasonalConfig());
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) setConfig(e.detail);
    };
    window.addEventListener('wiggle:seasonal-updated', handleUpdate);
    return () => window.removeEventListener('wiggle:seasonal-updated', handleUpdate);
  }, []);

  const handleSelectSeason = (seasonId) => {
    const updated = saveSeasonalConfig({ activeSeasonId: seasonId });
    setConfig(updated);
    showNotice();
  };

  const handleToggleBanner = (e) => {
    const updated = saveSeasonalConfig({ showAnnouncementBanner: e.target.checked });
    setConfig(updated);
    showNotice();
  };

  const handleCustomTextChange = (e) => {
    setConfig(prev => ({ ...prev, customAnnouncement: e.target.value }));
  };

  const handleSaveCustomAnnouncement = () => {
    const updated = saveSeasonalConfig({ customAnnouncement: config.customAnnouncement });
    setConfig(updated);
    showNotice();
  };

  const showNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const activePreset = SEASONAL_PRESETS.find(p => p.id === config.activeSeasonId) || SEASONAL_PRESETS[0];
  const activeAnnouncementText = config.customAnnouncement?.trim() || activePreset.announcement;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Intro Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.5rem' }}>
          🖼️ Seasonal Themes & Announcements
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
          Select active preschool seasonal campaigns or update top website announcement banners.
          Changes take effect across the live website instantly without touching code.
        </p>
      </div>

      {/* Live Preview Card */}
      <div style={{
        background: '#fff',
        border: '3px solid var(--ink)',
        borderRadius: 'var(--r-lg)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sticker)',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
            👁️ Live Top Announcement Preview
          </h4>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
            <input
              type="checkbox"
              checked={config.showAnnouncementBanner}
              onChange={handleToggleBanner}
              style={{ width: '18px', height: '18px', accentColor: 'var(--tangerine)' }}
            />
            <span>Show Announcement Banner on Website</span>
          </label>
        </div>

        {/* Mock Top Banner Strip */}
        <div style={{
          background: config.showAnnouncementBanner ? activePreset.accentColor : '#E2E8F0',
          border: '2.5px solid var(--ink)',
          borderRadius: 'var(--r-md)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--ink)',
          fontWeight: 700,
          fontSize: '0.9rem',
          boxShadow: '2px 2px 0 var(--ink)'
        }}>
          <div>
            {config.showAnnouncementBanner ? (
              <span>{activeAnnouncementText}</span>
            ) : (
              <span style={{ fontStyle: 'italic', color: '#64748B' }}>Banner is currently hidden</span>
            )}
          </div>
          <span style={{
            background: '#fff',
            border: '1.5px solid var(--ink)',
            borderRadius: 'var(--r-pill)',
            padding: '0.15rem 0.65rem',
            fontSize: '0.75rem',
            fontWeight: 800
          }}>
            {activePreset.badgeText}
          </span>
        </div>
      </div>

      {/* Preset Seasonal Cards Grid */}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem' }}>
        Choose Active Campaign:
      </h3>

      <div className="admin-seasonal-grid">
        {SEASONAL_PRESETS.map((preset) => {
          const isActive = config.activeSeasonId === preset.id;

          return (
            <div
              key={preset.id}
              className={`admin-season-card ${isActive ? 'is-active-season' : ''}`}
              onClick={() => handleSelectSeason(preset.id)}
            >
              {isActive && (
                <span className="admin-season-card__badge">✓ Active Now</span>
              )}

              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  letterSpacing: '0.05em'
                }}>
                  {preset.tag}
                </span>
                <h4 className="admin-season-card__title" style={{ marginTop: '0.25rem' }}>
                  {preset.name}
                </h4>
                <div className="admin-season-card__announcement">
                  {preset.announcement}
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  display: 'inline-block',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: preset.accentColor,
                  border: '2px solid var(--ink)'
                }} />

                <button
                  type="button"
                  className={`admin-btn admin-btn--sm ${isActive ? 'admin-btn--success' : 'admin-btn--secondary'}`}
                >
                  {isActive ? 'Current Active' : 'Switch to This'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Announcement Editor */}
      <div style={{
        background: '#fff',
        border: '3px solid var(--ink)',
        borderRadius: 'var(--r-lg)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sticker)',
        marginBottom: '2rem'
      }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.5rem' }}>
          ✏️ Custom Announcement Override
        </h4>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Leave empty to use the default seasonal text, or type any special notice (e.g. "Tomorrow is Sports Day — Wear comfortable sneakers!").
        </p>

        <div className="admin-form-group">
          <textarea
            className="admin-form-control"
            rows={2}
            placeholder={`Default: ${activePreset.announcement}`}
            value={config.customAnnouncement || ''}
            onChange={handleCustomTextChange}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            className="admin-btn admin-btn--secondary admin-btn--sm"
            onClick={() => {
              setConfig(prev => ({ ...prev, customAnnouncement: '' }));
              saveSeasonalConfig({ customAnnouncement: '' });
              showNotice();
            }}
          >
            Reset to Preset Default
          </button>

          <button
            type="button"
            className="admin-btn admin-btn--primary admin-btn--sm"
            onClick={handleSaveCustomAnnouncement}
          >
            ✓ Apply to Live Site
          </button>
        </div>
      </div>

      {/* Toast Notice */}
      {savedNotice && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--meadow)',
          color: 'var(--ink)',
          border: '2.5px solid var(--ink)',
          borderRadius: 'var(--r-pill)',
          padding: '0.75rem 1.5rem',
          fontWeight: 800,
          boxShadow: '4px 4px 0 var(--ink)',
          zIndex: 1000
        }}>
          ✓ Seasonal updates applied to live website!
        </div>
      )}
    </div>
  );
}
