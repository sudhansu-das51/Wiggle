import React from 'react';

/**
 * Metric stats cards & program distribution breakdown.
 */
export function AdminStats({ stats }) {
  const { total = 0, newCount = 0, visitsScheduled = 0, enrolled = 0, byProgram = {} } = stats;

  return (
    <div>
      {/* 4 Core Stat Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card admin-stat-card--yellow">
          <div className="admin-stat-card__top">
            <span className="admin-stat-card__label">Total Enquiries</span>
            <div className="admin-stat-card__icon" aria-hidden="true">📬</div>
          </div>
          <div className="admin-stat-card__value">{total}</div>
          <span className="admin-stat-card__sub">All time admission requests</span>
        </div>

        <div className="admin-stat-card admin-stat-card--pink">
          <div className="admin-stat-card__top">
            <span className="admin-stat-card__label">New / Pending</span>
            <div className="admin-stat-card__icon" aria-hidden="true">🔔</div>
          </div>
          <div className="admin-stat-card__value">{newCount}</div>
          <span className="admin-stat-card__sub">Needs follow-up from staff</span>
        </div>

        <div className="admin-stat-card admin-stat-card--sky">
          <div className="admin-stat-card__top">
            <span className="admin-stat-card__label">Campus Tours</span>
            <div className="admin-stat-card__icon" aria-hidden="true">🏫</div>
          </div>
          <div className="admin-stat-card__value">{visitsScheduled}</div>
          <span className="admin-stat-card__sub">Booked & upcoming visits</span>
        </div>

        <div className="admin-stat-card admin-stat-card--mint">
          <div className="admin-stat-card__top">
            <span className="admin-stat-card__label">Enrolled Little Ones</span>
            <div className="admin-stat-card__icon" aria-hidden="true">🎉</div>
          </div>
          <div className="admin-stat-card__value">{enrolled}</div>
          <span className="admin-stat-card__sub">Confirmed for Session 2026-27</span>
        </div>
      </div>

      {/* Program Distribution Bar */}
      <div className="admin-programs-bar">
        <div className="admin-programs-bar__title">
          <span>👶 Classrooms Distribution:</span>
        </div>
        <div className="admin-programs-bar__chips">
          <span className="admin-chip">
            <span>Playgroup (1.5-2.5y)</span>
            <strong className="admin-chip__badge">{byProgram.Playgroup || 0}</strong>
          </span>
          <span className="admin-chip">
            <span>Nursery (2.5-3.5y)</span>
            <strong className="admin-chip__badge">{byProgram.Nursery || 0}</strong>
          </span>
          <span className="admin-chip">
            <span>Jr. KG (3.5-4.5y)</span>
            <strong className="admin-chip__badge">{byProgram['Jr. KG'] || 0}</strong>
          </span>
          <span className="admin-chip">
            <span>Sr. KG (4.5-5.5y)</span>
            <strong className="admin-chip__badge">{byProgram['Sr. KG'] || 0}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
