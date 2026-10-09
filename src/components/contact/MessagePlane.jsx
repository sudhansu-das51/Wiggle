import React, { useState, useRef } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Mascot } from '../ui/Mascot';
import { FormField } from '../forms/FormField';
import { Icon } from '../ui/Icon';
import { PaperPlane } from './PaperPlane';
import { siteConfig } from '../../config/siteConfig';
import { programs } from '../../data/programs';
import { validateContactForm } from '../../utils/validators';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { buildMailtoUrl } from '../../utils/contact';

export function MessagePlane() {
  const brand = siteConfig.brand?.name || 'Wiggle';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    childAge: '',
    message: '',
    replyMethod: 'WhatsApp',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState('');

  const fieldRefs = {
    name: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    message: useRef(null),
  };
  const errorSummaryRef = useRef(null);

  // Options for child's age dropdown
  const ageOptions = [
    ...programs.map((p) => ({
      value: `${p.name} (${p.ageRange})`,
      label: `${p.name} (${p.ageRange})`,
    })),
    { value: 'Not sure yet', label: 'Not sure yet' },
  ];

  const replyOptions = [
    { value: 'WhatsApp', label: 'WhatsApp' },
    { value: 'Email', label: 'Email' },
  ];

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (touched[field]) {
      const newErrors = validateContactForm({ ...formData, [field]: val });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateContactForm(formData);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleFieldFocus = (e) => {
    // Scroll field into center view on phones
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateContactForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Focus first error field or error summary
      const firstErrorField = Object.keys(validationErrors)[0];
      if (fieldRefs[firstErrorField]?.current) {
        fieldRefs[firstErrorField].current.focus();
      } else if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

    // Start paper plane animation
    setIsSubmitting(true);
  };

  const handlePlaneAnimationComplete = () => {
    const { name, phone, email, childAge, message, replyMethod } = formData;
    const ageString = childAge || 'not sure yet';
    const messageBody = `Hi ${brand}! My name is ${name}. Phone: ${phone}. Child's age: ${ageString}. ${message}`;

    if (replyMethod === 'WhatsApp') {
      const waUrl = buildWhatsAppLink(messageBody);
      const newTab = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!newTab) {
        setPopupBlocked(true);
        setFallbackUrl(waUrl);
      }
    } else {
      const subject = `Message from ${name} via the ${brand} website`;
      const mailtoUrl = buildMailtoUrl({
        to: siteConfig.contact?.email || 'hello@wigglepreschool.in',
        subject,
        body: messageBody,
      });
      window.location.href = mailtoUrl;
    }

    setIsSubmitting(false);
    setIsReady(true);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      childAge: '',
      message: '',
      replyMethod: 'WhatsApp',
    });
    setErrors({});
    setTouched({});
    setIsReady(false);
    setPopupBlocked(false);
    setFallbackUrl('');
  };

  const submitLabel = formData.replyMethod === 'WhatsApp' ? 'Send on WhatsApp' : 'Send by email';
  const hasErrors = Object.keys(errors).filter((k) => errors[k]).length > 0;

  return (
    <section className="section section--sky con-message-section" aria-label="Send a message">
      <div className="container">
        <SectionHeading
          title="Or write to us from here"
          note="Nothing is stored. We simply open your WhatsApp or email with the message ready to send."
          align="center"
          wiggle
        />

        <div className="con-message-wrapper">
          {/* Peeking Mascot with pencil */}
          <div className="con-message-mascot" aria-hidden="true">
            <Mascot mood="peek" size={96} />
          </div>

          {/* Letter-paper Form Card */}
          <div className="con-letter-card">
            <span className="tape" />

            {/* Error Summary Banner */}
            {hasErrors && (
              <div
                ref={errorSummaryRef}
                tabIndex={-1}
                className="con-error-summary"
                role="alert"
                aria-label="Form errors"
              >
                <h4 className="con-error-summary__title">Please check the following:</h4>
                <ul className="con-error-summary__list">
                  {Object.entries(errors).map(([key, msg]) =>
                    msg ? <li key={key}>{msg}</li> : null
                  )}
                </ul>
              </div>
            )}

            {isReady ? (
              /* Success / Ready State Note (Never says 'sent') */
              <div className="con-ready-note" role="status" aria-live="polite">
                <div className="con-ready-note__icon" aria-hidden="true">
                  <Icon name="star" size={32} color="var(--sunny)" />
                </div>
                <h3 className="con-ready-note__title">Your message is ready!</h3>
                <p className="con-ready-note__text">
                  Press send in {formData.replyMethod === 'WhatsApp' ? 'WhatsApp' : 'your email app'} to finish.
                  Until then, nothing leaves your device.
                </p>

                {popupBlocked && fallbackUrl && (
                  <div className="con-ready-note__fallback">
                    <Button
                      variant="primary"
                      href={fallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open WhatsApp
                    </Button>
                  </div>
                )}

                <div className="con-ready-note__action">
                  <Button variant="ghost" onClick={handleReset}>
                    Write another message
                  </Button>
                </div>
              </div>
            ) : (
              /* Interactive Form */
              <form
                onSubmit={handleSubmit}
                noValidate
                className="con-form"
                aria-busy={isSubmitting}
              >
                <div className="con-form__grid-2">
                  <FormField
                    inputRef={fieldRefs.name}
                    name="name"
                    label="Your name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    onBlur={handleBlur('name')}
                    onFocus={handleFieldFocus}
                    placeholder="e.g. Priya Sharma"
                    required
                    error={errors.name}
                    disabled={isSubmitting}
                  />

                  <FormField
                    inputRef={fieldRefs.phone}
                    type="tel"
                    name="phone"
                    label="Phone number"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    onFocus={handleFieldFocus}
                    placeholder="e.g. 98765 43210"
                    required
                    error={errors.phone}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="con-form__grid-2">
                  <FormField
                    inputRef={fieldRefs.email}
                    type="email"
                    name="email"
                    label="Email address"
                    value={formData.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                    onFocus={handleFieldFocus}
                    placeholder="e.g. priya@example.com"
                    hint="Optional, if you prefer email updates"
                    error={errors.email}
                    disabled={isSubmitting}
                  />

                  <FormField
                    type="select"
                    name="childAge"
                    label="Child's age"
                    value={formData.childAge}
                    onChange={handleChange('childAge')}
                    onFocus={handleFieldFocus}
                    placeholder="Pick your child's age group"
                    options={ageOptions}
                    disabled={isSubmitting}
                  />
                </div>

                <FormField
                  inputRef={fieldRefs.message}
                  type="textarea"
                  name="message"
                  label="Message"
                  value={formData.message}
                  onChange={handleChange('message')}
                  onBlur={handleBlur('message')}
                  onFocus={handleFieldFocus}
                  placeholder="Tell us what you would like to know, or which morning you want to visit..."
                  required
                  rows={4}
                  error={errors.message}
                  disabled={isSubmitting}
                />

                <FormField
                  type="radio-group"
                  name="replyMethod"
                  label="How should we reply?"
                  value={formData.replyMethod}
                  onChange={handleChange('replyMethod')}
                  options={replyOptions}
                  disabled={isSubmitting}
                />

                {/* Form Footer Action */}
                <div className="con-form__footer">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="con-form__submit-btn"
                  >
                    {isSubmitting ? 'Preparing message...' : submitLabel}
                  </Button>
                  <p className="con-form__disclaimer">
                    You press send in the next app. Until then nothing leaves your device.
                  </p>
                </div>
              </form>
            )}

            {/* Paper Plane Overlay Animation */}
            <PaperPlane
              isPlaying={isSubmitting}
              onComplete={handlePlaneAnimationComplete}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
