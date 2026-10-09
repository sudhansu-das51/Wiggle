import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SectionHeading } from '../ui/SectionHeading';
import { FilterBar } from '../ui/FilterBar';
import { JobPoster } from './JobPoster';
import { OpenApplicationPoster } from './OpenApplicationPoster';
import { ApplyModal } from './ApplyModal';
import { jobs as defaultJobs } from '../../data/jobs';
import { isRoleOpen } from '../../utils/dates';
import { useLenis } from '../motion/SmoothScroll';

/**
 * Section 3 — Open roles (posters on corridor wall).
 * Corridor wall stripe, coat hooks, filter bar (>4 roles), JobPosters,
 * OpenApplicationPoster, shareable ?role={slug} scroll and highlight, and ApplyModal.
 * @param {{
 *   jobs?: Array<any>,
 *   className?: string
 * }} props
 */
export function RolePosters({ jobs = defaultJobs, className = '' }) {
  const [searchParams] = useSearchParams();
  const lenis = useLenis();

  // Filter only currently open roles
  const openRoles = jobs.filter((job) => isRoleOpen(job.closing));

  const [activeFilter, setActiveFilter] = useState('All');
  const [modalRole, setModalRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedSlug, setHighlightedSlug] = useState(null);
  const [tornTabsMap, setTornTabsMap] = useState({});

  const lastAppliedSlugRef = useRef(null);

  // Unique types for FilterBar
  const roleTypes = ['All', ...Array.from(new Set(openRoles.map((j) => j.type).filter(Boolean)))];

  // Filtered roles based on selection
  const displayedRoles = activeFilter === 'All'
    ? openRoles
    : openRoles.filter((j) => j.type === activeFilter);

  // Check URL parameter ?role={slug} on mount
  useEffect(() => {
    const roleSlug = searchParams.get('role');
    if (!roleSlug) return;

    const matched = openRoles.find((j) => j.slug === roleSlug);
    if (!matched) return;

    setHighlightedSlug(roleSlug);

    // Scroll to the targeted poster
    const timer = setTimeout(() => {
      const el = document.getElementById(`role-${roleSlug}`);
      if (el) {
        if (lenis) {
          lenis.scrollTo(el, { offset: -60, duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 400);

    // Remove highlight after 3 seconds
    const removeTimer = setTimeout(() => {
      setHighlightedSlug(null);
    }, 3400);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [searchParams, openRoles, lenis]);

  // Handle Apply button click from a poster
  const handleOpenApply = (role) => {
    lastAppliedSlugRef.current = role.slug;
    setModalRole(role);
    setIsModalOpen(true);

    if (role.slug && role.slug !== 'general-application') {
      setTornTabsMap((prev) => ({
        ...prev,
        [role.slug]: Math.min((prev[role.slug] || 0) + 1, 5),
      }));
    }
  };

  // Handle Modal Close
  const handleCloseModal = (wasSubmitted) => {
    setIsModalOpen(false);

    // If candidate closed modal without sending, regrow the torn tab!
    if (!wasSubmitted && lastAppliedSlugRef.current && lastAppliedSlugRef.current !== 'general-application') {
      const slug = lastAppliedSlugRef.current;
      setTornTabsMap((prev) => ({
        ...prev,
        [slug]: Math.max((prev[slug] || 1) - 1, 0),
      }));
    }
    lastAppliedSlugRef.current = null;
  };

  return (
    <section id="roles" className={`section section--paper car-roles-section ${className}`}>
      {/* Corridor Wall Stripe & Coat Hooks Backdrop */}
      <div className="car-corridor-backdrop" aria-hidden="true">
        <div className="car-corridor__painted-stripe" />
        <div className="car-corridor__coat-rack">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="car-corridor__coat-hook">
              <span className="car-corridor__hook-peg" />
              <span className="car-corridor__hook-shadow" />
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <SectionHeading
          title="Help wanted"
          text="Pick a poster. Tear off a tab. Say hello."
          align="center"
          wiggle={true}
        />

        {/* FilterBar only rendered if more than 4 open roles */}
        {openRoles.length > 4 && (
          <div className="car-filter-bar-wrap">
            <FilterBar
              options={roleTypes}
              value={activeFilter}
              onChange={setActiveFilter}
            />
          </div>
        )}

        {/* Empty state notice if all roles are closed */}
        {openRoles.length === 0 && (
          <div className="car-empty-notice">
            <p className="car-empty-text note">
              No openings right now, but we love hearing from kind, curious people.
            </p>
          </div>
        )}

        {/* Posters Grid */}
        <div className="car-posters-grid">
          {displayedRoles.map((job, idx) => (
            <JobPoster
              key={job.slug}
              job={job}
              index={idx}
              isHighlighted={highlightedSlug === job.slug}
              onApply={handleOpenApply}
              tornTabCount={tornTabsMap[job.slug] || 0}
            />
          ))}

          {/* Open Application Poster is always the final poster */}
          <OpenApplicationPoster onApply={handleOpenApply} />
        </div>
      </div>

      {/* Shared ApplyModal */}
      <ApplyModal
        isOpen={isModalOpen}
        role={modalRole}
        onClose={handleCloseModal}
      />
    </section>
  );
}

export default RolePosters;
