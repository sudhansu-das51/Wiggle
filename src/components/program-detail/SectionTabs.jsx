import React, { useState, useEffect, useRef } from 'react';
import { useLenis } from '../motion/SmoothScroll';
import './program-detail.css';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'day', label: 'A day in class' },
  { id: 'learning', label: 'Learning' },
  { id: 'teachers', label: 'Teachers' },
  { id: 'pack', label: 'Pack the bag' },
  { id: 'questions', label: 'Questions' },
];

/**
 * Section 2: Pill-shaped sticky section tabs bar with scroll-spy and animated active pill.
 */
export function SectionTabs() {
  const [activeTab, setActiveTab] = useState('overview');
  const barRef = useRef(null);
  const trackRef = useRef(null);
  const lenis = useLenis();

  // Dynamically update --nav-bottom to stick directly below navbar
  useEffect(() => {
    const updateNavBottom = () => {
      const navEl = document.querySelector('.navbar, header');
      if (navEl) {
        const rect = navEl.getBoundingClientRect();
        const bottom = Math.max(0, rect.bottom);
        document.documentElement.style.setProperty('--nav-bottom', `${bottom}px`);
      }
    };

    updateNavBottom();
    window.addEventListener('scroll', updateNavBottom, { passive: true });
    window.addEventListener('resize', updateNavBottom);

    const navEl = document.querySelector('.navbar, header');
    let resizeObserver;
    if (navEl && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateNavBottom);
      resizeObserver.observe(navEl);
    }

    return () => {
      window.removeEventListener('scroll', updateNavBottom);
      window.removeEventListener('resize', updateNavBottom);
      resizeObserver?.disconnect();
    };
  }, []);

  // Scroll-spy with IntersectionObserver
  useEffect(() => {
    const sectionIds = TABS.map((t) => t.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return;

    // Trigger when section crosses the middle of the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-25% 0px -45% 0px',
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Scroll active tab button into view on mobile
  useEffect(() => {
    if (!trackRef.current) return;
    const activeBtn = trackRef.current.querySelector(`.pd-tab-btn[data-id="${activeTab}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  const handleTabClick = (id) => {
    setActiveTab(id);
    const target = document.getElementById(id);
    if (!target) return;

    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-bottom') || '72',
      10
    );
    const tabsHeight = barRef.current?.offsetHeight || 50;
    const offset = -(navHeight + tabsHeight + 16);

    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.1 });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={barRef}
      className="pd-section-tabs-bar"
      aria-label="Program sections navigation"
    >
      <div className="container pd-section-tabs-container">
        <div ref={trackRef} className="pd-section-tabs-track" role="tablist">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                data-id={tab.id}
                aria-selected={isActive}
                aria-controls={tab.id}
                className={`pd-tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {isActive && <span className="pd-tab-pill-bg" aria-hidden="true" />}
                <span className="pd-tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
