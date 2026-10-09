import React, { useRef } from 'react';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { getTeacherTint, getTeacherHeaderColor } from './teacherTint';
import { usePointerTilt } from '../../hooks/usePointerTilt';

function getInitials(name) {
  if (!name) return 'W';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Collectible trading card for a teacher.
 * Real button with 5:7 aspect ratio, 3D pointer tilt, shine stripe, and resting tilt.
 */
export const TeacherCard = React.forwardRef(function TeacherCard(
  { teacher, programs = [], index = 0, onSelect },
  forwardedRef
) {
  const localRef = useRef(null);
  const cardRef = forwardedRef || localRef;
  const shineRef = useRef(null);

  // Slight varied resting tilt (-2 to +2 deg)
  const tiltAngles = [-1.8, 1.5, -2.2, 1.8, -1.2, 2.0, -1.6, 2.2];
  const restingTilt = tiltAngles[index % tiltAngles.length];

  const tint = getTeacherTint(teacher, programs);
  const headerBg = getTeacherHeaderColor(tint);

  const tiltHandlers = usePointerTilt(cardRef, shineRef, restingTilt);

  // Parse years display, e.g. "8 years" -> "8 yrs"
  const yearsLabel = teacher.years
    ? teacher.years.replace(/years?/i, 'yrs').trim()
    : null;

  return (
    <button
      ref={cardRef}
      type="button"
      className="tch-card"
      style={{
        transform: `rotate(${restingTilt}deg)`,
      }}
      aria-label={`Open profile: ${teacher.name}, ${teacher.role}`}
      onClick={() => onSelect(teacher)}
      {...tiltHandlers}
    >
      {/* Top Program Header Band */}
      <div className="tch-card__header-band" style={{ backgroundColor: headerBg }}>
        <span className="chip tch-card__chip">
          {teacher.program}
        </span>
      </div>

      {/* Card Body */}
      <div className="tch-card__body">
        {/* Photo Container */}
        <div className="tch-card__photo-wrap">
          <ResponsiveImage
            src={teacher.photo}
            alt={teacher.name}
            ratio="square"
            tint={tint}
            label={getInitials(teacher.name)}
            className="tch-card__photo"
          />
        </div>

        {/* Name and Role */}
        <div className="tch-card__info">
          <h3 className="tch-card__name">{teacher.name}</h3>
          <p className="tch-card__role">{teacher.role}</p>
        </div>
      </div>

      {/* Years Experience Badge / Sticker */}
      {yearsLabel && (
        <span className="tch-card__years-badge" aria-hidden="true">
          {yearsLabel}
        </span>
      )}

      {/* Flat Translucent White Holographic Shine Stripe (Pointer Only) */}
      <span ref={shineRef} className="tch-card__shine" aria-hidden="true" />
    </button>
  );
});
