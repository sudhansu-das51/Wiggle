import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { FormField } from '../forms/FormField';
import { Button } from '../ui/Button';
import { siteConfig } from '../../config/siteConfig';
import { validateApplicationForm } from '../../utils/validators';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { buildMailtoUrl } from '../../utils/contact';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const EXPERIENCE_OPTIONS = [
  { value: 'Fresher', label: 'Fresher (passionate beginner)' },
  { value: '1 to 2 years', label: '1 to 2 years' },
  { value: '3 to 5 years', label: '3 to 5 years' },
  { value: '6 years or more', label: '6 years or more' },
];

const CHANNEL_OPTIONS = [
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Email', label: 'Email' },
];

/**
 * ApplyModal dialog for job applications with validation, live character counter,
 * WhatsApp / email link creation, and honest ready-to-send stamp confirmation.
 * @param {{
 *   isOpen: boolean,
 *   role: { title: string, slug?: string } | null,
 *   onClose: (submitted?: boolean) => void
 * }} props
 */
export function ApplyModal({ isOpen, role, onClose }) {
  const brand = siteConfig.brand?.name || 'Wiggle';
  const roleTitle = role?.title || 'Open Role';
  const isGeneral = roleTitle === 'General application';
  const modalTitle = isGeneral ? 'Send an open application' : `Apply for ${roleTitle}`;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    experience: '',
    qualification: '',
    about: '',
    channel: 'WhatsApp',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState('');

  const fieldRefs = {
    name: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    experience: useRef(null),
  };
  const errorSummaryRef = useRef(null);
  const stampRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Reset form when modal opens with a new role
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        experience: '',
        qualification: '',
        about: '',
        channel: 'WhatsApp',
      });
      setErrors({});
      setTouched({});
      setIsReady(false);
      setPopupBlocked(false);
      setFallbackUrl('');
    }
  }, [isOpen, role?.slug]);

  // Stamp pop animation on ready state
  useEffect(() => {
    if (isReady && stampRef.current && !reducedMotion) {
      import('animejs').then(({ animate }) => {
        if (!stampRef.current) return;
        animate(stampRef.current, {
          scale: [1.6, 1],
          rotate: [-15, 0],
          duration: 400,
          ease: 'outBack(2)',
        });
      });
    }
  }, [isReady, reducedMotion]);

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (touched[field]) {
      const newErrors = validateApplicationForm({ ...formData, [field]: val }, formData.channel);
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateApplicationForm(formData, formData.channel);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleFocus = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateApplicationForm(formData, formData.channel);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = Object.keys(validationErrors)[0];
      if (fieldRefs[firstErrorField]?.current) {
        fieldRefs[firstErrorField].current.focus();
      } else if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

    const { name, phone, experience, qualification, about, channel } = formData;
    const messageBody = `Hi ${brand}! I would like to apply for ${roleTitle}. Name: ${name}. Phone: ${phone}. Experience: ${experience}. Qualification: ${qualification || 'not shared'}. About me: ${about || 'not shared'}.`;

    if (channel === 'WhatsApp') {
      const targetPhone = siteConfig.careers?.whatsappNumber || siteConfig.whatsapp?.number;
      const waUrl = buildWhatsAppLink(messageBody, targetPhone);
      const newTab = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!newTab) {
        setPopupBlocked(true);
        setFallbackUrl(waUrl);
      }
    } else {
      const targetEmail = siteConfig.careers?.email || siteConfig.contact?.email || 'hello@wigglepreschool.in';
      const subject = `Application for ${roleTitle} from ${name}`;
      const mailtoUrl = buildMailtoUrl({
        to: targetEmail,
        subject,
        body: messageBody,
      });
      window.location.href = mailtoUrl;
    }

    setIsReady(true);
  };

  const handleClose = () => {
    onClose(isReady);
  };

  const hasErrors = Object.keys(errors).filter((k) => errors[k]).length > 0;
  const submitLabel = formData.channel === 'WhatsApp' ? 'Send on WhatsApp' : 'Send by email';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle}>
      <div className="car-apply-modal">
        {/* Error Summary Banner */}
        {hasErrors && (
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            className="car-error-summary"
            role="alert"
            aria-label="Application form errors"
          >
            <h4 className="car-error-summary__title">Please check the following:</h4>
            <ul className="car-error-summary__list">
              {Object.entries(errors).map(([key, msg]) =>
                msg ? <li key={key}>{msg}</li> : null
              )}
            </ul>
          </div>
        )}

        {isReady ? (
          /* Honest Ready State Confirmation */
          <div className="car-ready-card" role="status" aria-live="polite">
            <div ref={stampRef} className="car-ready-stamp sticker" aria-hidden="true">
              <span className="car-ready-stamp__border">
                <span className="car-ready-stamp__title">READY</span>
                <span className="car-ready-stamp__sub note">TO SEND</span>
              </span>
            </div>

            <h3 className="car-ready-title">Your message is ready!</h3>
            <p className="car-ready-text">
              Press send in {formData.channel === 'WhatsApp' ? 'WhatsApp' : 'your email app'} to finish.
              Until then, nothing leaves your device.
            </p>

            {popupBlocked && fallbackUrl && (
              <div className="car-ready-fallback">
                <Button variant="primary" href={fallbackUrl} target="_blank" rel="noopener noreferrer">
                  Open WhatsApp
                </Button>
              </div>
            )}

            <p className="car-ready-tip note">
              You can attach your CV or portfolio in the next app.
            </p>

            <div className="car-ready-actions">
              <Button variant="ghost" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} noValidate className="car-apply-form">
            <div className="car-form-row">
              <FormField
                inputRef={fieldRefs.name}
                name="name"
                label="Your name"
                value={formData.name}
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                onFocus={handleFocus}
                placeholder="e.g. Ananya Rao"
                required
                error={errors.name}
              />

              <FormField
                inputRef={fieldRefs.phone}
                type="tel"
                name="phone"
                label="Phone number"
                value={formData.phone}
                onChange={handleChange('phone')}
                onBlur={handleBlur('phone')}
                onFocus={handleFocus}
                placeholder="e.g. 98765 43210"
                required
                error={errors.phone}
              />
            </div>

            <div className="car-form-row">
              <FormField
                inputRef={fieldRefs.email}
                type="email"
                name="email"
                label="Email address"
                value={formData.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                onFocus={handleFocus}
                placeholder="e.g. ananya@example.com"
                required={formData.channel === 'Email'}
                hint={formData.channel === 'WhatsApp' ? 'Optional, if you also want email updates' : undefined}
                error={errors.email}
              />

              <FormField
                inputRef={fieldRefs.experience}
                type="select"
                name="experience"
                label="Years of experience"
                value={formData.experience}
                onChange={handleChange('experience')}
                onBlur={handleBlur('experience')}
                onFocus={handleFocus}
                placeholder="Pick your experience band"
                options={EXPERIENCE_OPTIONS}
                required
                error={errors.experience}
              />
            </div>

            <FormField
              name="qualification"
              label="Highest qualification"
              value={formData.qualification}
              onChange={handleChange('qualification')}
              onFocus={handleFocus}
              placeholder="e.g. B.Ed, Montessori Diploma, or Fine Arts Degree"
              hint="Optional"
            />

            <div className="car-about-field-wrap">
              <FormField
                type="textarea"
                name="about"
                label="Tell us a little about yourself"
                value={formData.about}
                onChange={handleChange('about')}
                onBlur={handleBlur('about')}
                onFocus={handleFocus}
                placeholder="What draws you to preschool teaching? Which age group do you love most?"
                rows={3}
                error={errors.about}
              />
              <div className="car-char-counter note" aria-live="off">
                {formData.about.length} / 600 characters
              </div>
            </div>

            <FormField
              type="radio-group"
              name="channel"
              label="How would you like to apply?"
              value={formData.channel}
              onChange={handleChange('channel')}
              options={CHANNEL_OPTIONS}
            />

            <p className="car-form-cv-note note">
              You can attach your CV in WhatsApp or in your email app.
            </p>

            <div className="car-form-footer">
              <Button type="submit" variant="primary" className="car-form-submit-btn">
                {submitLabel}
              </Button>
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default ApplyModal;
