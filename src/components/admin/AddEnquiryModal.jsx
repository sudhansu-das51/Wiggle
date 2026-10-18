import React, { useState } from 'react';
import { saveEnquiry } from '../../utils/enquiryStorage';

/**
 * Modal form for preschool reception/staff to record walk-in or telephone enquiries.
 */
export function AddEnquiryModal({ isOpen, onClose, onEnquiryAdded }) {
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    childName: '',
    childAge: '',
    program: 'Playgroup',
    visitDate: '',
    visitSlot: 'Morning (9 am to 12 pm)',
    notes: 'Walk-in enquiry recorded by front-desk staff.',
    message: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.parentName || !formData.phone || !formData.childName) {
      alert('Please provide parent name, phone number, and child name.');
      return;
    }

    const saved = saveEnquiry(formData, 'Walk-in / Desk');
    if (onEnquiryAdded) onEnquiryAdded(saved);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">Record Front-Desk Enquiry</h3>
          <button type="button" className="admin-icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Parent / Guardian Name *</label>
                <input
                  type="text"
                  name="parentName"
                  className="admin-form-control"
                  required
                  placeholder="e.g. Shalini Roy"
                  value={formData.parentName}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  className="admin-form-control"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Child Name *</label>
                <input
                  type="text"
                  name="childName"
                  className="admin-form-control"
                  required
                  placeholder="e.g. Reyansh"
                  value={formData.childName}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Child Age</label>
                <input
                  type="text"
                  name="childAge"
                  className="admin-form-control"
                  placeholder="e.g. 2.5"
                  value={formData.childAge}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Classroom / Program</label>
                <select
                  name="program"
                  className="admin-form-control"
                  value={formData.program}
                  onChange={handleChange}
                >
                  <option value="Playgroup">Playgroup (1.5 - 2.5 yrs)</option>
                  <option value="Nursery">Nursery (2.5 - 3.5 yrs)</option>
                  <option value="Jr. KG">Jr. KG (3.5 - 4.5 yrs)</option>
                  <option value="Sr. KG">Sr. KG (4.5 - 5.5 yrs)</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Scheduled Visit Date</label>
                <input
                  type="date"
                  name="visitDate"
                  className="admin-form-control"
                  value={formData.visitDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Internal Notes</label>
              <textarea
                name="notes"
                className="admin-form-control"
                rows={2}
                placeholder="Parent visited during recess, showed interest in organic meals..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn--primary">
              ✓ Save Enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
