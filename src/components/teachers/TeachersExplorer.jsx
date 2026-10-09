import React, { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../ui/SectionHeading';
import { FilterBar } from '../ui/FilterBar';
import { Button } from '../ui/Button';
import { Mascot } from '../ui/Mascot';
import { TeacherCard } from './TeacherCard';
import { TeacherProfile } from './TeacherProfile';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const TILT_ANGLES = [-1.8, 1.5, -2.2, 1.8, -1.2, 2.0, -1.6, 2.2];

export function TeachersExplorer({ teachers = [], programs = [] }) {
  const reducedMotion = useReducedMotion();
  const isSaveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
  const skipAnimation = reducedMotion || isSaveData;

  const [selectedProgram, setSelectedProgram] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Filter options derived from programs
  const filterOptions = useMemo(() => {
    return ['All', ...programs.map((p) => p.name)];
  }, [programs]);

  // Target filtered teachers based on criteria
  const targetTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const progMatch =
        selectedProgram === 'All' ||
        t.program?.toLowerCase() === 'all programs' ||
        t.program?.toLowerCase() === selectedProgram.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const searchMatch =
        !q ||
        t.name?.toLowerCase().includes(q) ||
        t.role?.toLowerCase().includes(q);

      return progMatch && searchMatch;
    });
  }, [teachers, selectedProgram, searchQuery]);

  // State of currently rendered teachers in DOM (for exit animations)
  const [renderedTeachers, setRenderedTeachers] = useState(targetTeachers);

  const gridRef = useRef(null);
  const cardsRef = useRef([]);
  const hasFirstDealtRef = useRef(false);
  const activeTimelineRef = useRef(null);
  const lastOpenerRef = useRef(null);

  // Status line announcement text
  const statusLine = useMemo(() => {
    const count = targetTeachers.length;
    const label = count === 1 ? 'teacher' : 'teachers';
    if (selectedProgram === 'All') {
      return `Showing ${count} ${label} across all programs`;
    }
    return `Showing ${count} ${label} in ${selectedProgram}`;
  }, [targetTeachers.length, selectedProgram]);

  // Initial Deal on ScrollTrigger
  useEffect(() => {
    if (!gridRef.current) return;

    if (skipAnimation) {
      setRenderedTeachers(targetTeachers);
      hasFirstDealtRef.current = true;
      return;
    }

    const cardElements = cardsRef.current.filter(Boolean);
    if (cardElements.length === 0) return;

    // Check if grid is already scrolled past on load
    const rect = gridRef.current.getBoundingClientRect();
    const isAboveViewport = rect.bottom < 0;

    if (isAboveViewport) {
      cardElements.forEach((card, idx) => {
        const angle = TILT_ANGLES[idx % TILT_ANGLES.length];
        gsap.set(card, { x: 0, y: 0, scale: 1, rotation: angle, opacity: 1 });
      });
      hasFirstDealtRef.current = true;
      return;
    }

    const dealTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 80%',
        once: true,
      },
      onComplete: () => {
        hasFirstDealtRef.current = true;
      },
    });

    const gridRect = gridRef.current.getBoundingClientRect();
    const gridCenterX = gridRect.left + gridRect.width / 2;
    const gridCenterY = gridRect.top + gridRect.height / 2;

    cardElements.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const offsetX = gridCenterX - cardCenterX;
      const offsetY = gridCenterY - cardCenterY;
      const randomRot = (Math.random() - 0.5) * 28;
      const targetTilt = TILT_ANGLES[idx % TILT_ANGLES.length];

      dealTimeline.fromTo(
        card,
        {
          x: offsetX,
          y: offsetY,
          scale: 0.85,
          rotation: randomRot,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          rotation: targetTilt,
          opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.2)',
        },
        idx * 0.06
      );
    });

    return () => {
      dealTimeline.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === gridRef.current) st.kill();
      });
    };
  }, [skipAnimation]);

  // Filter / Search change transition
  useEffect(() => {
    // If not first dealt yet or skipAnimation, just sync rendered teachers
    if (!hasFirstDealtRef.current || skipAnimation) {
      setRenderedTeachers(targetTeachers);
      return;
    }

    // Kill any running transition timeline
    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
    }

    const cardElements = cardsRef.current.filter(Boolean);
    if (!gridRef.current || cardElements.length === 0) {
      setRenderedTeachers(targetTeachers);
      return;
    }

    const gridRect = gridRef.current.getBoundingClientRect();
    const gridCenterX = gridRect.left + gridRect.width / 2;
    const gridCenterY = gridRect.top + gridRect.height / 2;

    // Phase 1: Leaving cards slide back to center and fade out
    const exitTimeline = gsap.timeline({
      onComplete: () => {
        setRenderedTeachers(targetTeachers);
      },
    });
    activeTimelineRef.current = exitTimeline;

    cardElements.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const offsetX = (gridCenterX - cardCenterX) * 0.6;
      const offsetY = (gridCenterY - cardCenterY) * 0.6;

      exitTimeline.to(
        card,
        {
          x: offsetX,
          y: offsetY,
          scale: 0.8,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        },
        idx * 0.02
      );
    });
  }, [targetTeachers, skipAnimation]);

  // Phase 2: Once renderedTeachers updates after exit, deal the new cards in
  useEffect(() => {
    if (!hasFirstDealtRef.current || skipAnimation) return;

    const cardElements = cardsRef.current.filter(Boolean);
    if (!gridRef.current || cardElements.length === 0) return;

    const enterTimeline = gsap.timeline();
    activeTimelineRef.current = enterTimeline;

    const gridRect = gridRef.current.getBoundingClientRect();
    const gridCenterX = gridRect.left + gridRect.width / 2;
    const gridCenterY = gridRect.top + gridRect.height / 2;

    cardElements.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const offsetX = (gridCenterX - cardCenterX) * 0.8;
      const offsetY = (gridCenterY - cardCenterY) * 0.8;
      const targetTilt = TILT_ANGLES[idx % TILT_ANGLES.length];
      const randomRot = (Math.random() - 0.5) * 20;

      enterTimeline.fromTo(
        card,
        {
          x: offsetX,
          y: offsetY,
          scale: 0.85,
          rotation: randomRot,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          rotation: targetTilt,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.2)',
        },
        idx * 0.05
      );
    });
  }, [renderedTeachers, skipAnimation]);

  const handleSelectTeacher = (teacher, e) => {
    lastOpenerRef.current = document.activeElement;
    setSelectedTeacher(teacher);
    setIsProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    // Return focus to opening button
    setTimeout(() => {
      if (lastOpenerRef.current && typeof lastOpenerRef.current.focus === 'function') {
        lastOpenerRef.current.focus();
      }
    }, 50);
  };

  const handleClearFilters = () => {
    setSelectedProgram('All');
    setSearchQuery('');
  };

  return (
    <section className="section section--paper tch-explorer" aria-label="Meet the team">
      <div className="container">
        {/* Section Heading */}
        <SectionHeading
          title="Meet the team"
          note="Pick a program to see who will be with your child."
          align="center"
          wiggle
        />

        {/* Toolbar: Filter Chips & Search */}
        <div className="tch-explorer__toolbar">
          <FilterBar
            options={filterOptions}
            value={selectedProgram}
            onChange={setSelectedProgram}
            search={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search teachers"
            className="tch-explorer__filter-bar"
          />

          {/* Live Accessibility Status Line */}
          <div className="tch-explorer__status" aria-live="polite">
            <span className="tch-explorer__status-badge" />
            <span>{statusLine}</span>
          </div>
        </div>

        {/* Card Grid */}
        <div ref={gridRef} className="tch-explorer__grid">
          {renderedTeachers.map((teacher, idx) => (
            <TeacherCard
              key={teacher.slug}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              teacher={teacher}
              programs={programs}
              index={idx}
              onSelect={(t) => handleSelectTeacher(t)}
            />
          ))}
        </div>

        {/* Empty State */}
        {renderedTeachers.length === 0 && (
          <div className="tch-explorer__empty" role="status">
            <div className="tch-explorer__empty-mascot">
              <Mascot mood="sleepy" size={110} />
            </div>
            <h3 className="tch-explorer__empty-title">Nobody matches that search.</h3>
            <p className="tch-explorer__empty-desc">
              Try searching a different name, or clear your filters to see the full team.
            </p>
            <div className="tch-explorer__empty-action">
              <Button variant="ghost" onClick={handleClearFilters}>
                Clear filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Staff File Modal Profile */}
      <TeacherProfile
        teacher={selectedTeacher}
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
        programs={programs}
        teachersList={targetTeachers}
        onNavigate={setSelectedTeacher}
      />
    </section>
  );
}
