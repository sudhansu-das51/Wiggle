import React from 'react';
import { FormField } from '../forms/FormField';

const REACH_OPTIONS = [
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Phone call', label: 'Phone call' },
  { value: 'Email', label: 'Email' },
];

/**
 * Step 1 — You.
 * Parent name, phone, email, contact preference.
 */
export function StepAboutYou({
  values,
  errors,
  onChange,
  onBlur,
  fieldRefs,
  headingRef,
}) {
  const handleFocus = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  };

  return (
    <div className="enq-step-panel">
      <h2 ref={headingRef} tabIndex={-1} className="enq-step-heading">
        Tell us about you
      </h2>
      <p className="enq-step-subtext">
        First, the grown-up we should say hello to.
      </p>

      <div className="enq-fields-stack">
        <FormField
          inputRef={fieldRefs?.parentName}
          name="parentName"
          label="Your name"
          value={values.parentName}
          onChange={onChange('parentName')}
          onBlur={onBlur('parentName')}
          onFocus={handleFocus}
          placeholder="e.g. Radhika Sharma"
          autoComplete="name"
          required
          error={errors.parentName}
        />

        <FormField
          inputRef={fieldRefs?.phone}
          type="tel"
          name="phone"
          label="Phone number"
          value={values.phone}
          onChange={onChange('phone')}
          onBlur={onBlur('phone')}
          onFocus={handleFocus}
          placeholder="e.g. 98765 43210"
          autoComplete="tel"
          inputMode="tel"
          required
          error={errors.phone}
        />

        <FormField
          inputRef={fieldRefs?.email}
          type="email"
          name="email"
          label="Email address"
          value={values.email}
          onChange={onChange('email')}
          onBlur={onBlur('email')}
          onFocus={handleFocus}
          placeholder="e.g. radhika@example.com"
          autoComplete="email"
          hint="Optional, if you also like email updates"
          error={errors.email}
        />

        <FormField
          type="radio-group"
          name="contactPreference"
          label="Best way to reach you"
          value={values.contactPreference || 'WhatsApp'}
          onChange={onChange('contactPreference')}
          options={REACH_OPTIONS}
        />
      </div>
    </div>
  );
}

export default StepAboutYou;
