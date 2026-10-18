import React, { useState } from 'react';
import { siteConfig } from '../../config/siteConfig';

/**
 * Modal dialog to view and update complete details of an admission enquiry.
 */
export function EnquiryDetailModal({ enquiry, onClose, onUpdateStatus, onDelete }) {
  const [currentStatus, setCurrentStatus] = useState(enquiry?.status || 'New');
  const [internalNotes, setInternalNotes] = useState(enquiry?.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!enquiry) return null;

  const brand = siteConfig.brand?.name || 'Wiggle';

  const handleSave = () => {
    onUpdateStatus(enquiry.id, currentStatus, internalNotes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // WhatsApp prefilled message
  const waPhone = (enquiry.phone || '').replace(/\D/g, '');
  const waTarget = waPhone.startsWith('91') ? waPhone : `91${waPhone}`;
  const waGreeting = encodeURIComponent(
    `Hello ${enquiry.parentName}! Warm greetings from ${brand} Preschool. We received your admission enquiry for ${enquiry.childName} (${enquiry.program || 'Preschool'}). We would love to welcome you for a morning campus tour!`
  );
  const waUrl = `https://wa.me/${waTarget}?text=${waGreeting}`;

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-modal-header">
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)' }}>
              {enquiry.id} · {new Date(enquiry.timestamp).toLocaleDateString()}
            </span>
            <h3 className="admin-modal-title">{enquiry.childName}’s Admission</h3>
          </div>
          <button
            type="button"
            className="admin-icon-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="admin-modal-body">
          {/* Quick Contact & Action Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            background: 'var(--paper)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--r-md)',
            border: '2px solid var(--ink)',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.85rem' }}>
              <strong>Channel:</strong> {enquiry.channel || 'WhatsApp'}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn--success admin-btn--sm"
                title="Chat on WhatsApp"
              >
                <span>💬 WhatsApp Parent</span>
              </a>
              {enquiry.phone && (
                <a
                  href={`tel:${enquiry.phone}`}
                  className="admin-btn admin-btn--sky admin-btn--sm"
                  title="Call Parent"
                >
                  <span>📞 Call</span>
                </a>
              )}
            </div>
          </div>

          {/* Child & Program Info */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Child Name & Age</label>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>
                {enquiry.childName} ({enquiry.childAge})
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Selected Classroom</label>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>
                {enquiry.program || 'Not specified'}
              </div>
            </div>
          </div>

          {/* Parent Details */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Parent / Guardian Name</label>
              <div>{enquiry.parentName}</div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Phone & Email</label>
              <div>
                {enquiry.phone} {enquiry.email && `· ${enquiry.email}`}
              </div>
            </div>
          </div>

          {/* Visit Booking Details */}
          <div style={{
            background: '#F0F9FF',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--r-md)',
            border: '2px solid var(--ink)',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--ink)', marginBottom: '0.25rem' }}>
              🗓️ Campus Tour Request:
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>
              {enquiry.wantVisit === 'yes' ? (
                <span>
                  Date: <strong>{enquiry.visitDate || 'Flexible / To be confirmed'}</strong> · Slot: <strong>{enquiry.visitSlot}</strong>
                </span>
              ) : (
                <span>Parent did not request a scheduled tour yet.</span>
              )}
            </div>
          </div>

          {/* Parent's Message */}
          {enquiry.message && (
            <div className="admin-form-group">
              <label className="admin-form-label">Parent’s Message / Questions</label>
              <div style={{
                background: 'var(--paper)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--r-md)',
                fontStyle: 'italic',
                fontSize: '0.875rem',
                border: '1.5px dashed var(--ink)'
              }}>
                "{enquiry.message}"
              </div>
            </div>
          )}

          {/* Status Updater */}
          <div className="admin-form-group">
            <label className="admin-form-label">Admission Pipeline Status</label>
            <select
              className="admin-form-control"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
            >
              <option value="New">🟡 New (Uncontacted)</option>
              <option value="Contacted">🟣 Contacted / Sent Brochure</option>
              <option value="Visit Scheduled">🔵 Campus Tour Scheduled</option>
              <option value="Enrolled">🟢 Enrolled & Admitted</option>
            </select>
          </div>

          {/* Internal Staff Notes */}
          <div className="admin-form-group">
            <label className="admin-form-label">Internal Staff Notes</label>
            <textarea
              className="admin-form-control"
              rows={3}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="e.g., Parent called back on Monday, requested afternoon slot..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-btn admin-btn--secondary"
            onClick={() => {
              if (window.confirm(`Delete enquiry for ${enquiry.childName}? This cannot be undone.`)) {
                onDelete(enquiry.id);
                onClose();
              }
            }}
            style={{ marginRight: 'auto', color: '#DC2626', borderColor: '#DC2626' }}
          >
            🗑️ Delete
          </button>

          <button
            type="button"
            className="admin-btn admin-btn--secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleSave}
          >
            {isSaved ? '✓ Saved!' : 'Save Updates'}
          </button>
        </div>
      </div>
    </div>
  );
}
