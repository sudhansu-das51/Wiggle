import React from 'react';
import { teachers } from '../../data/teachers';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import './home.css';

/**
 * Section 7: Teacher Polaroids.
 * Tilted polaroids with tape strips, fun facts, and link to all teachers.
 */
export function TeacherPolaroids() {
  const featuredTeachers = teachers.slice(0, 4);
  const tilts = [-3, 2.5, -2, 3];

  return (
    <section className="section section--pink teachers-section" aria-label="Teachers">
      <div className="container">
        <SectionHeading
          title="Meet the grown-ups"
          note="Yes, they sit on the floor."
          align="center"
          wiggle
        />

        <div className="teachers-polaroid__grid">
          {featuredTeachers.map((teacher, idx) => (
            <div
              key={teacher.slug}
              className="teacher-polaroid"
              style={{ transform: `rotate(${tilts[idx % tilts.length]}deg)` }}
            >
              <span className="tape" />

              <div className="teacher-polaroid__photo-box">
                <img
                  src={teacher.photo || `/images/HT${idx + 1}.png`}
                  alt={teacher.name}
                  className="teacher-polaroid__img"
                  loading="lazy"
                />

                <div className="teacher-polaroid__fun-fact">
                  "{teacher.funFact}"
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>
                {teacher.name}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                {teacher.role}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Button variant="primary" to="/teachers">
            Meet all teachers
          </Button>
        </div>
      </div>
    </section>
  );
}
