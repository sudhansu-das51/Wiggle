import React, { useState, useEffect } from 'react';
import { Seo } from '../components/ui/Seo';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { AdminStats } from '../components/admin/AdminStats';
import { EnquiryTable } from '../components/admin/EnquiryTable';
import { EnquiryDetailModal } from '../components/admin/EnquiryDetailModal';
import { AddEnquiryModal } from '../components/admin/AddEnquiryModal';
import { SeasonalManager } from '../components/admin/SeasonalManager';
import { MaintenanceCenter } from '../components/admin/MaintenanceCenter';
import {
  getEnquiries,
  getEnquiryStats,
  updateEnquiryStatus,
  deleteEnquiry
} from '../utils/enquiryStorage';
import { siteConfig } from '../config/siteConfig';

import './Admin.css';
import '../components/admin/admin.css';

/**
 * Admin Dashboard Page (/admin).
 * Central control portal for preschool staff and company administrators:
 * - Admission Enquiry CRM & WhatsApp outreach
 * - Seasonal campaigns and announcement banner management
 * - System maintenance, diagnostic health checks, and data backup
 */
export function Admin() {
  const [activeTab, setActiveTab] = useState('enquiries');
  const [enquiries, setEnquiries] = useState(() => getEnquiries());
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const brand = siteConfig.brand?.name || 'Wiggle';

  // Sync state with storage and listen for real-time live enquiries
  useEffect(() => {
    const handleStorageUpdate = (e) => {
      if (e.detail) {
        setEnquiries(e.detail);
      } else {
        setEnquiries(getEnquiries());
      }
    };

    window.addEventListener('wiggle:enquiries-updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('wiggle:enquiries-updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const stats = getEnquiryStats(enquiries);

  const handleUpdateStatus = (id, newStatus, notes) => {
    const updated = updateEnquiryStatus(id, newStatus, notes);
    setEnquiries(updated);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry(prev => ({ ...prev, status: newStatus, notes }));
    }
  };

  const handleDeleteEnquiry = (id) => {
    const updated = deleteEnquiry(id);
    setEnquiries(updated);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry(null);
    }
  };

  const handleEnquiryAdded = () => {
    setEnquiries(getEnquiries());
  };

  return (
    <div className="admin-page">
      <Seo
        title="Admin & Enquiries Dashboard"
        description="Preschool Administration & Admission Management Portal for Wiggle."
      />

      {/* Top Admin Navbar */}
      <AdminNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        newEnquiriesCount={stats.newCount}
      />

      {/* Main Admin Body */}
      <main className="admin-page__main">
        <div className="container">
          {/* Header Title Bar */}
          <div className="admin-page__header">
            <div>
              <h1 className="admin-page__heading">
                {activeTab === 'enquiries' && '📬 Admission Enquiries Desk'}
                {activeTab === 'seasonal' && '🖼️ Seasonal Themes & Announcements'}
                {activeTab === 'maintenance' && '🔄 Website Health & Maintenance'}
              </h1>
              <p className="admin-page__subheading">
                {activeTab === 'enquiries' &&
                  `Manage incoming parent enquiries, schedule classroom tours, and chat on WhatsApp.`}
                {activeTab === 'seasonal' &&
                  `Switch between seasonal preschool campaigns (Summer, Monsoon, Winter) or customize the banner.`}
                {activeTab === 'maintenance' &&
                  `Run diagnostic checks for WhatsApp, Google Maps, SEO meta tags, and export system backups.`}
              </p>
            </div>

            {/* Subheading Badge / Timestamp */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#fff',
              border: '2px solid var(--ink)',
              borderRadius: 'var(--r-pill)',
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              boxShadow: '2px 2px 0 var(--ink)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--meadow)' }} />
              <span>Live System Connected</span>
            </div>
          </div>

          {/* TAB 1: Enquiries & Admissions */}
          {activeTab === 'enquiries' && (
            <div>
              <AdminStats stats={stats} />

              <EnquiryTable
                enquiries={enquiries}
                onSelectEnquiry={setSelectedEnquiry}
                onUpdateStatus={handleUpdateStatus}
                onDeleteEnquiry={handleDeleteEnquiry}
                onOpenAddModal={() => setIsAddModalOpen(true)}
              />
            </div>
          )}

          {/* TAB 2: Seasonal Updates & Themes */}
          {activeTab === 'seasonal' && (
            <SeasonalManager />
          )}

          {/* TAB 3: Maintenance & System Diagnostics */}
          {activeTab === 'maintenance' && (
            <MaintenanceCenter onResetComplete={() => setEnquiries(getEnquiries())} />
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <EnquiryDetailModal
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteEnquiry}
        />
      )}

      {/* Add Walk-in Modal */}
      <AddEnquiryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEnquiryAdded={handleEnquiryAdded}
      />

      {/* Admin Footer */}
      <footer className="admin-page__footer">
        <div className="container">
          <span>
            {brand} Preschool Management Portal · Confidential Internal Staff Use · Version 1.0
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Admin;
