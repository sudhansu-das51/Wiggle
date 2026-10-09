import React from 'react';
import { FormField } from '../forms/FormField';
import { TransitionLink } from '../motion/TransitionLink';
import { Icon } from '../ui/Icon';
import { programs as defaultPrograms } from '../../data/programs';
import { getStartMonthOptions } from '../../utils/enquiry';

/**
 * Step 2 — Your child.
 * Child's name, age select, program select, preferred start month,
 * program preselection chip, and dynamic age-to-program suggestions.
 */
export function StepAboutChild({
  values,
  errors,
  onChange,
  onBlur,
  fieldRefs,
  headingRef,
  programs = defaultPrograms,
  preselectedProgram = null,
}) {
  const minMinAge = Math.min(...programs.map((p) => p.minAge));
  const maxMaxAge = Math.max(...programs.map((p) => p.maxAge));

  // Build age options
  const ageOptions = [
    { value: `Under ${minMinAge} years`, label: `Under ${minMinAge} years` },
    ...programs.map((p) => ({
      value: p.ageRange,
      label: `${p.name} (${p.ageRange})`,
    })),
    { value: `Over ${maxMaxAge} years`, label: `Over ${maxMaxAge} years` },
  ];

  // Build program options
  const programOptions = [
    ...programs.map((p) => ({ value: p.name, label: p.name })),
    { value: 'Not sure yet', label: 'Not sure yet' },
  ];

  // Start month options
  const startMonthOptions = getStartMonthOptions();

  // Find matching program based on selected age
  const matchingProgram = programs.find((p) => p.ageRange === values.childAge);
  const showSuggestion =
    matchingProgram &&
    (!values.program || values.program === 'Not sure yet') &&
    values.program !== matchingProgram.name;

  const handleUseSuggestion = () => {
    if (matchingProgram) {
      onChange('program')({ target: { value: matchingProgram.name } });
    }
  };

  const handleFocus = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  };

  return (
    <div className="enq-step-panel">
      <h2 ref={headingRef} tabIndex={-1} className="enq-step-heading">
        Tell us about your child
      </h2>
      <p className="enq-step-subtext">
        Every room at Wiggle is tailored to a developmental rhythm.
      </p>

      {/* Preselected program badge from URL ?program={slug} */}
      {preselectedProgram && (
        <div className="enq-program-chip-wrap">
          <span className="enq-program-chip sticker">
            <Icon name="star" size={16} color="var(--sunny)" />
            <span>You are asking about {preselectedProgram.name}</span>
            <TransitionLink
              to={`/programs/${preselectedProgram.slug}`}
              className="enq-program-chip__link"
            >
              (view details)
            </TransitionLink>
          </span>
        </div>
      )}

      <div className="enq-fields-stack">
        <FormField
          inputRef={fieldRefs?.childName}
          name="childName"
          label="Child's name"
          value={values.childName}
          onChange={onChange('childName')}
          onBlur={onBlur('childName')}
          onFocus={handleFocus}
          placeholder="e.g. Kabir"
          required
          error={errors.childName}
        />

        <FormField
          inputRef={fieldRefs?.childAge}
          type="select"
          name="childAge"
          label="Child's age"
          value={values.childAge}
          onChange={onChange('childAge')}
          onBlur={onBlur('childAge')}
          onFocus={handleFocus}
          placeholder="Pick your child's age"
          options={ageOptions}
          required
          error={errors.childAge}
        />

        {/* Suggestion banner if age matches a program */}
        {showSuggestion && (
          <div className="enq-program-suggestion" role="status">
            <span className="enq-program-suggestion__text note">
              {matchingProgram.name} fits this age ({matchingProgram.ageRange})
            </span>
            <button
              type="button"
              onClick={handleUseSuggestion}
              className="enq-program-suggestion__btn"
            >
              Use {matchingProgram.name}
            </button>
          </div>
        )}

        <FormField
          type="select"
          name="program"
          label="Program of interest"
          value={values.program}
          onChange={onChange('program')}
          onFocus={handleFocus}
          placeholder="Select a program (or not sure yet)"
          options={programOptions}
          hint="You can always decide during a classroom visit"
        />

        <FormField
          type="select"
          name="startMonth"
          label="Preferred start"
          value={values.startMonth}
          onChange={onChange('startMonth')}
          onFocus={handleFocus}
          placeholder="When would you like to start?"
          options={startMonthOptions}
        />
      </div>
    </div>
  );
}

export default StepAboutChild;
