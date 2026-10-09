import React from 'react';
import { FormField } from '../forms/FormField';
import { siteConfig } from '../../config/siteConfig';

const VISIT_CHOICE_OPTIONS = [
  { value: 'yes', label: 'Yes please, we would love to see the campus' },
  { value: 'no', label: 'Not yet, just gathering information' },
];

/**
 * Step 3 — Your visit.
 * Visit desire toggle, preferred date, slot, optional message (with character counter),
 * and required consent checkbox.
 */
export function StepVisit({
  values,
  errors,
  onChange,
  onBlur,
  fieldRefs,
  headingRef,
}) {
  const visitSlots = siteConfig.admissions?.visitSlots || [
    'Morning (9 am to 12 pm)',
    'Afternoon (1 pm to 4 pm)',
  ];

  const slotOptions = visitSlots.map((slot) => ({ value: slot, label: slot }));

  // Local date today in YYYY-MM-DD
  const [todayStr] = React.useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  const wantVisit = values.wantVisit !== 'no'; // Default to yes unless explicitly 'no'

  const handleFocus = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  };

  return (
    <div className="enq-step-panel">
      <h2 ref={headingRef} tabIndex={-1} className="enq-step-heading">
        Your visit
      </h2>
      <p className="enq-step-subtext">
        A quick morning visit is the warmest way to get a feel for our rooms.
      </p>

      <div className="enq-fields-stack">
        <FormField
          type="radio-group"
          name="wantVisit"
          label="Would you like to visit the school?"
          value={wantVisit ? 'yes' : 'no'}
          onChange={onChange('wantVisit')}
          options={VISIT_CHOICE_OPTIONS}
        />

        {wantVisit && (
          <div className="enq-visit-details-box">
            <FormField
              inputRef={fieldRefs?.visitDate}
              type="date"
              name="visitDate"
              label="Preferred day"
              value={values.visitDate}
              onChange={onChange('visitDate')}
              onBlur={onBlur('visitDate')}
              onFocus={handleFocus}
              min={todayStr}
              hint="Pick a weekday morning or afternoon"
              error={errors.visitDate}
            />

            <FormField
              type="radio-group"
              name="visitSlot"
              label="Preferred time slot"
              value={values.visitSlot || visitSlots[0]}
              onChange={onChange('visitSlot')}
              options={slotOptions}
            />
          </div>
        )}

        <div className="enq-textarea-wrap">
          <FormField
            inputRef={fieldRefs?.message}
            type="textarea"
            name="message"
            label="Anything you would like us to know?"
            value={values.message}
            onChange={onChange('message')}
            onBlur={onBlur('message')}
            onFocus={handleFocus}
            placeholder="Tell us about your child's favorite songs, questions on food, or any allergies..."
            rows={3}
            hint="Optional"
            error={errors.message}
          />
          <div className="enq-char-counter note">
            {(values.message || '').length} / 600 characters
          </div>
        </div>

        <FormField
          inputRef={fieldRefs?.consent}
          type="checkbox"
          name="consent"
          label="I agree to be contacted about this admission enquiry"
          value={values.consent}
          onChange={(e) => {
            onChange('consent')({ target: { value: e.target.checked } });
          }}
          onBlur={onBlur('consent')}
          required
          error={errors.consent}
          hint="We never share your details or send marketing messages."
        />
      </div>
    </div>
  );
}

export default StepVisit;
