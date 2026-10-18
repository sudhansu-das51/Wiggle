import React, { useState, useMemo } from 'react';
import { exportEnquiriesToCSV } from '../../utils/enquiryStorage';
import { siteConfig } from '../../config/siteConfig';

/**
 * Filterable, searchable data table for preschool admission enquiries.
 */
export function EnquiryTable({
  enquiries = [],
  onSelectEnquiry,
  onUpdateStatus,
  onDeleteEnquiry,
  onOpenAddModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedProgram, setSelectedProgram] = useState('All');

  const brand = siteConfig.brand?.name || 'Wiggle';

  // Filtered and searched data
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      // Status filter
      if (selectedStatus !== 'All' && item.status !== selectedStatus) {
        return false;
      }

      // Program filter
      if (selectedProgram !== 'All') {
        const itemProg = (item.program || '').toLowerCase();
        if (!itemProg.includes(selectedProgram.toLowerCase())) {
          return false;
        }
      }

      // Search query (search parent, child, phone, email, notes)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (item.parentName || '').toLowerCase().includes(q) ||
          (item.childName || '').toLowerCase().includes(q) ||
          (item.phone || '').includes(q) ||
          (item.email || '').toLowerCase().includes(q) ||
          (item.id || '').toLowerCase().includes(q) ||
          (item.notes || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [enquiries, selectedStatus, selectedProgram, searchQuery]);

  // Program pill styling helper
  const getProgramClass = (prog = '') => {
    const p = prog.toLowerCase();
    if (p.includes('play')) return 'program-pill--playgroup';
    if (p.includes('nursery')) return 'program-pill--nursery';
    if (p.includes('jr')) return 'program-pill--jrkg';
    if (p.includes('sr')) return 'program-pill--srkg';
    return '';
  };

  // Status badge styling helper
  const getStatusClass = (status = '') => {
    switch (status) {
      case 'New': return 'admin-badge--new';
      case 'Visit Scheduled': return 'admin-badge--scheduled';
      case 'Contacted': return 'admin-badge--contacted';
      case 'Enrolled': return 'admin-badge--enrolled';
      default: return 'admin-badge--new';
    }
  };

  return (
    <div>
      {/* Table Toolbar */}
      <div className="admin-toolbar">
        {/* Search & Program Filter */}
        <div className="admin-toolbar__search-group">
          <input
            type="search"
            className="admin-search-input"
            placeholder="🔍 Search by parent, child, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="admin-filter-select"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            aria-label="Filter by Program"
          >
            <option value="All">All Classrooms</option>
            <option value="Playgroup">Playgroup</option>
            <option value="Nursery">Nursery</option>
            <option value="Jr">Jr. KG</option>
            <option value="Sr">Sr. KG</option>
          </select>
        </div>

        {/* Status Pill Tabs */}
        <div className="admin-status-tabs" role="tablist">
          {['All', 'New', 'Visit Scheduled', 'Contacted', 'Enrolled'].map((st) => (
            <button
              key={st}
              type="button"
              className={`admin-status-tab ${selectedStatus === st ? 'is-selected' : ''}`}
              onClick={() => setSelectedStatus(st)}
            >
              {st === 'All' ? 'All Leads' : st}
            </button>
          ))}
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            type="button"
            className="admin-btn admin-btn--secondary admin-btn--sm"
            onClick={exportEnquiriesToCSV}
            title="Download CSV for Excel / Google Sheets"
          >
            <span>📥 Export CSV</span>
          </button>

          <button
            type="button"
            className="admin-btn admin-btn--primary admin-btn--sm"
            onClick={onOpenAddModal}
          >
            <span>➕ Walk-in Lead</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="admin-table-container">
        {filteredEnquiries.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-state__icon">🔍</div>
            <h4 className="admin-empty-state__title">No enquiries match your filter</h4>
            <p className="admin-empty-state__text">
              Try resetting your search query or status filter to see all admission requests.
            </p>
            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('All');
                setSelectedProgram('All');
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID / Date</th>
                <th>Child & Classroom</th>
                <th>Parent & Contact</th>
                <th>Campus Visit</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map((enq) => {
                const waPhone = (enq.phone || '').replace(/\D/g, '');
                const waTarget = waPhone.startsWith('91') ? waPhone : `91${waPhone}`;
                const waGreeting = encodeURIComponent(
                  `Hi ${enq.parentName}! Warm greetings from ${brand} Preschool regarding ${enq.childName}'s admission enquiry.`
                );
                const waUrl = `https://wa.me/${waTarget}?text=${waGreeting}`;

                return (
                  <tr key={enq.id}>
                    {/* ID & Date */}
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--ink)' }}>{enq.id}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {new Date(enq.timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* Child & Program */}
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--ink)' }}>
                        {enq.childName}{' '}
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 500 }}>
                          ({enq.childAge})
                        </span>
                      </div>
                      <div style={{ marginTop: '0.2rem' }}>
                        <span className={`program-pill ${getProgramClass(enq.program)}`}>
                          {enq.program || 'Preschool'}
                        </span>
                      </div>
                    </td>

                    {/* Parent & Phone */}
                    <td>
                      <div style={{ fontWeight: 600 }}>{enq.parentName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                        📞 {enq.phone}
                      </div>
                    </td>

                    {/* Campus Visit */}
                    <td>
                      {enq.wantVisit === 'yes' && enq.visitDate ? (
                        <div style={{ fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--ink)' }}>
                            🗓️ {enq.visitDate}
                          </span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                            {enq.visitSlot}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                          No scheduled tour
                        </span>
                      )}
                    </td>

                    {/* Channel */}
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--r-pill)',
                          border: '1px solid rgba(30, 27, 75, 0.2)',
                          background: enq.channel === 'WhatsApp' ? '#E7FCEB' : '#EFF6FF',
                          fontWeight: 700,
                        }}
                      >
                        {enq.channel || 'Web'}
                      </span>
                    </td>

                    {/* Status Select */}
                    <td>
                      <select
                        className={`admin-badge ${getStatusClass(enq.status)}`}
                        style={{ cursor: 'pointer', outline: 'none' }}
                        value={enq.status}
                        onChange={(e) => onUpdateStatus(enq.id, e.target.value)}
                        aria-label={`Change status for ${enq.childName}`}
                      >
                        <option value="New">🟡 New</option>
                        <option value="Contacted">🟣 Contacted</option>
                        <option value="Visit Scheduled">🔵 Tour Booked</option>
                        <option value="Enrolled">🟢 Enrolled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="admin-actions-cell">
                        {/* View Full Details */}
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--view"
                          title="View Full Enquiry Details"
                          onClick={() => onSelectEnquiry(enq)}
                        >
                          👁️
                        </button>

                        {/* WhatsApp Parent */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-icon-btn admin-icon-btn--wa"
                          title="Chat on WhatsApp"
                        >
                          💬
                        </a>

                        {/* Call Parent */}
                        {enq.phone && (
                          <a
                            href={`tel:${enq.phone}`}
                            className="admin-icon-btn admin-icon-btn--phone"
                            title="Call Phone"
                          >
                            📞
                          </a>
                        )}

                        {/* Delete */}
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--delete"
                          title="Delete Enquiry"
                          onClick={() => {
                            if (window.confirm(`Delete enquiry for ${enq.childName}?`)) {
                              onDeleteEnquiry(enq.id);
                            }
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
