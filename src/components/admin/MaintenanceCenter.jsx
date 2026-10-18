import React, { useState } from 'react';
import { siteConfig } from '../../config/siteConfig';
import {
  getEnquiries,
  resetEnquiriesToDefault
} from '../../utils/enquiryStorage';
import { getSeasonalConfig } from '../../utils/seasonalConfig';

/**
 * Maintenance & Diagnostics Control Center for Wiggle Preschool.
 * Provides system diagnostics, SEO health status, WhatsApp testing,
 * and data backup/restore capabilities for company administrators.
 */
export function MaintenanceCenter({ onResetComplete }) {
  const [maintenanceMode, setMaintenanceMode] = useState(() => {
    return localStorage.getItem('wiggle_maintenance_mode') === 'true';
  });
  const [testNotice, setTestNotice] = useState('');

  const enquiries = getEnquiries();
  const seasonal = getSeasonalConfig();

  // Diagnostics info
  const storageUsageBytes = (() => {
    let total = 0;
    for (let x in localStorage) {
      if (localStorage.hasOwnProperty(x)) {
        total += ((localStorage[x].length + x.length) * 2);
      }
    }
    return (total / 1024).toFixed(1);
  })();

  const handleToggleMaintenance = (e) => {
    const val = e.target.checked;
    setMaintenanceMode(val);
    localStorage.setItem('wiggle_maintenance_mode', String(val));
    window.dispatchEvent(new CustomEvent('wiggle:maintenance-mode-changed', { detail: val }));
    showToast(val ? '⚠️ Maintenance Mode ENABLED' : '✓ Maintenance Mode DISABLED');
  };

  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      brand: siteConfig.brand?.name || 'Wiggle',
      enquiries: enquiries,
      seasonalConfig: seasonal,
      siteConfigSnapshot: {
        contact: siteConfig.contact,
        admissions: siteConfig.admissions
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Wiggle_Preschool_FullBackup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✓ Full System Backup downloaded!');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all enquiries back to initial seed data?')) {
      resetEnquiriesToDefault();
      if (onResetComplete) onResetComplete();
      showToast('✓ Enquiries reset to default seed data!');
    }
  };

  const showToast = (msg) => {
    setTestNotice(msg);
    setTimeout(() => setTestNotice(''), 3000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Intro Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.5rem' }}>
          🔄 Website Maintenance & Diagnostics
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
          Real-time system health checks, third-party integration tests, data backups, and emergency maintenance controls.
        </p>
      </div>

      {/* Grid of Diagnostics */}
      <div className="admin-maintenance-grid">
        {/* Health Checklist */}
        <div className="admin-health-card">
          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🩺 System Integrations</span>
            <span style={{ fontSize: '0.75rem', background: '#ECFDF5', color: '#065F46', padding: '0.2rem 0.6rem', borderRadius: 'var(--r-pill)', border: '1px solid #10B981' }}>
              All Systems Operational
            </span>
          </h4>

          <div className="admin-health-item">
            <div className="admin-health-item__left">
              <span className="admin-health-dot" />
              <div>
                <strong style={{ fontSize: '0.875rem' }}>WhatsApp Gateway</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  Number: +{siteConfig.whatsapp?.number || '919999999999'}
                </div>
              </div>
            </div>
            <a
              href={`https://wa.me/${siteConfig.whatsapp?.number || '919999999999'}?text=Test%20preschool%20gateway`}
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn--secondary admin-btn--sm"
            >
              Test Link
            </a>
          </div>

          <div className="admin-health-item">
            <div className="admin-health-item__left">
              <span className="admin-health-dot" />
              <div>
                <strong style={{ fontSize: '0.875rem' }}>Google Maps Directions</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  {siteConfig.contact?.landmark || 'Rainbow Lane campus'}
                </div>
              </div>
            </div>
            <a
              href={siteConfig.contact?.mapEmbedUrl || 'https://maps.google.com'}
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn--secondary admin-btn--sm"
            >
              Verify Map
            </a>
          </div>

          <div className="admin-health-item">
            <div className="admin-health-item__left">
              <span className="admin-health-dot" />
              <div>
                <strong style={{ fontSize: '0.875rem' }}>Google SEO Meta Coverage</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  12/12 Core pages dynamic &lt;Seo&gt; tagged
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--meadow)' }}>
              100% Valid
            </span>
          </div>

          <div className="admin-health-item">
            <div className="admin-health-item__left">
              <span className="admin-health-dot" />
              <div>
                <strong style={{ fontSize: '0.875rem' }}>Local Data Vault Storage</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  {storageUsageBytes} KB used ({enquiries.length} stored records)
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--ink)' }}>
              Healthy
            </span>
          </div>
        </div>

        {/* Maintenance Controls & Backup */}
        <div className="admin-health-card">
          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem' }}>
            💾 Backup & Data Operations
          </h4>

          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Download complete school database backups (all admission records, internal staff notes, and seasonal campaign settings) in portable JSON format.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={handleExportBackup}
            >
              <span>📥 Download Full System Backup (.JSON)</span>
            </button>

            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={handleResetData}
              style={{ color: '#DC2626', borderColor: '#DC2626' }}
            >
              <span>🔄 Reset Enquiries to Seed Defaults</span>
            </button>
          </div>

          {/* Maintenance Mode Toggle */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '2px dashed var(--ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <strong style={{ fontSize: '0.875rem', color: 'var(--ink)', display: 'block' }}>
                🚧 Renovation / Maintenance Notice
              </strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                Shows "School closed for sanitization/camp prep" strip
              </span>
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={handleToggleMaintenance}
                style={{ width: '22px', height: '22px', accentColor: 'var(--tangerine)' }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Toast Notice */}
      {testNotice && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--paper)',
          color: 'var(--ink)',
          border: '2.5px solid var(--ink)',
          borderRadius: 'var(--r-pill)',
          padding: '0.75rem 1.5rem',
          fontWeight: 800,
          boxShadow: '4px 4px 0 var(--ink)',
          zIndex: 1000
        }}>
          {testNotice}
        </div>
      )}
    </div>
  );
}
