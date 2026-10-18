import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { BusProgress } from './BusProgress';
import { StepAboutYou } from './StepAboutYou';
import { StepAboutChild } from './StepAboutChild';
import { StepVisit } from './StepVisit';
import { StepReview } from './StepReview';
import { SuccessPanel } from './SuccessPanel';
import { Mascot } from '../ui/Mascot';
import { Button } from '../ui/Button';
import { siteConfig } from '../../config/siteConfig';
import { programs as defaultPrograms } from '../../data/programs';
import { validateEnquiryStep } from '../../utils/validators';
import {
  getProgramFromSearch,
  buildEnquiryMessage,
  buildEnquiryMailto,
} from '../../utils/enquiry';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { saveEnquiry } from '../../utils/enquiryStorage';

const STEP_TITLES = ['You', 'Your child', 'Your visit', 'Send'];

/**
 * EnquiryWizard orchestrates the 4-step wizard card.
 * Handles state, direction-aware step slide animations, validation per step,
 * school bus trip coordination, WhatsApp/email handover, and success state.
 */
export function EnquiryWizard({
  programs = defaultPrograms,
  className = '',
}) {
  const [searchParams] = useSearchParams();
  const preselectedProgram = getProgramFromSearch(searchParams, programs);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState(() => ({
    parentName: '',
    phone: '',
    email: '',
    contactPreference: 'WhatsApp',
    childName: '',
    childAge: '',
    program: preselectedProgram ? preselectedProgram.name : '',
    startMonth: 'As soon as possible',
    wantVisit: 'yes',
    visitDate: '',
    visitSlot: siteConfig.admissions?.visitSlots?.[0] || 'Morning (9 am to 12 pm)',
    message: '',
    consent: false,
  }));
  const [errors, setErrors] = useState({});
  const [isEnteringGate, setIsEnteringGate] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sendChannel, setSendChannel] = useState('WhatsApp');
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState('');

  const cardRef = useRef(null);
  const stepPanelRef = useRef(null);
  const headingRef = useRef(null);
  const errorSummaryRef = useRef(null);
  const sendTimeoutRef = useRef(null);
  const onCompleteSendRef = useRef(null);

  // Field refs for error focusing
  const fieldRefs = {
    parentName: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    childName: useRef(null),
    childAge: useRef(null),
    visitDate: useRef(null),
    message: useRef(null),
    consent: useRef(null),
  };

  const reducedMotion = useReducedMotion();

  // If URL ?program={slug} changes, update program
  const prevSlugRef = useRef(preselectedProgram?.slug);
  useEffect(() => {
    if (preselectedProgram && preselectedProgram.slug !== prevSlugRef.current) {
      prevSlugRef.current = preselectedProgram.slug;
      setValues((prev) => ({ ...prev, program: preselectedProgram.name }));
    }
  }, [preselectedProgram]);

  // Clean up send timeout on unmount
  useEffect(() => {
    return () => {
      if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current);
    };
  }, []);

  // Direction-aware step slide and fade animation
  useGSAP(
    () => {
      if (!stepPanelRef.current || isSuccess) return;

      if (reducedMotion) {
        gsap.fromTo(
          stepPanelRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.1 }
        );
      } else {
        gsap.fromTo(
          stepPanelRef.current,
          { x: direction * 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }
        );
      }

      // Move focus to the step heading
      headingRef.current?.focus();
    },
    { dependencies: [step, isSuccess], scope: cardRef }
  );

  const handleChange = (field) => (e) => {
    const val =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((prev) => ({ ...prev, [field]: val }));

    // Clear field-specific error as soon as user types/interacts
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBlur = () => () => {
    // Optional onBlur validation can run here if desired
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (step >= 4) return;

    const stepErrors = validateEnquiryStep(step, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      // Focus first invalid field
      const firstKey = Object.keys(stepErrors)[0];
      const targetInput = fieldRefs[firstKey]?.current;
      if (targetInput && typeof targetInput.focus === 'function') {
        targetInput.focus();
      } else if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

    setErrors({});
    setDirection(1);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step <= 1) return;
    setErrors({});
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleEditStep = (targetStep) => {
    setErrors({});
    setDirection(targetStep > step ? 1 : -1);
    setStep(targetStep);
  };

  const executeSend = (channel) => {
    const brand = siteConfig.brand;
    const admissions = siteConfig.admissions;
    const contact = siteConfig.contact;
    const admissionsNumber = admissions?.whatsappNumber || siteConfig.whatsapp?.number;

    const messageText = buildEnquiryMessage(values, { brand, admissions });

    // Automatically persist to preschool admin dashboard
    try {
      saveEnquiry(values, channel);
    } catch (saveErr) {
      console.warn('Dashboard auto-save error:', saveErr);
    }

    if (channel === 'WhatsApp') {
      const waUrl = buildWhatsAppLink(messageText, admissionsNumber);
      try {
        const win = window.open(waUrl, '_blank', 'noopener,noreferrer');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          setPopupBlocked(true);
          setFallbackUrl(waUrl);
        }
      } catch {
        setPopupBlocked(true);
        setFallbackUrl(waUrl);
      }
    } else {
      const mailtoUrl = buildEnquiryMailto(values, { brand, admissions, contact });
      window.location.href = mailtoUrl;
    }

    setIsSuccess(true);
    setIsSending(false);
  };

  const handleGateEnterComplete = () => {
    if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current);
    if (onCompleteSendRef.current) {
      const cb = onCompleteSendRef.current;
      onCompleteSendRef.current = null;
      cb();
    }
  };

  const handleSendInitiate = (channel) => {
    // Validate all steps 1, 2, 3 before submitting
    const err1 = validateEnquiryStep(1, values);
    const err2 = validateEnquiryStep(2, values);
    const err3 = validateEnquiryStep(3, values);

    if (Object.keys(err1).length > 0) {
      setDirection(-1);
      setStep(1);
      setErrors(err1);
      return;
    }
    if (Object.keys(err2).length > 0) {
      setDirection(-1);
      setStep(2);
      setErrors(err2);
      return;
    }
    if (Object.keys(err3).length > 0) {
      setDirection(-1);
      setStep(3);
      setErrors(err3);
      return;
    }

    setErrors({});
    setSendChannel(channel);
    setIsSending(true);

    const onComplete = () => executeSend(channel);

    if (reducedMotion) {
      onComplete();
    } else {
      setIsEnteringGate(true);
      onCompleteSendRef.current = onComplete;
      // Fallback timeout in case bus animation is interrupted or delayed
      sendTimeoutRef.current = setTimeout(onComplete, 2400);
    }
  };

  const handleReset = () => {
    setValues({
      parentName: '',
      phone: '',
      email: '',
      contactPreference: 'WhatsApp',
      childName: '',
      childAge: '',
      program: preselectedProgram ? preselectedProgram.name : '',
      startMonth: 'As soon as possible',
      wantVisit: 'yes',
      visitDate: '',
      visitSlot: siteConfig.admissions?.visitSlots?.[0] || 'Morning (9 am to 12 pm)',
      message: '',
      consent: false,
    });
    setErrors({});
    setStep(1);
    setDirection(1);
    setIsEnteringGate(false);
    setIsSending(false);
    setIsSuccess(false);
    setPopupBlocked(false);
    setFallbackUrl('');
  };

  const errorKeys = Object.keys(errors);
  const hasErrors = errorKeys.length > 0;

  return (
    <div
      ref={cardRef}
      className={`enq-wizard-card sticker ${className}`}
      aria-live="polite"
    >
      {/* Tape decoration at top */}
      <span className="tape enq-wizard-card__tape" aria-hidden="true" />

      {/* Wig Mascot peeking over top-right corner */}
      <div className="enq-wizard-card__peek-mascot" aria-hidden="true">
        <Mascot mood="peek" size={82} />
      </div>

      {/* If in Success state, render SuccessPanel directly */}
      {isSuccess ? (
        <SuccessPanel
          channel={sendChannel}
          contactPreference={values.contactPreference}
          popupBlocked={popupBlocked}
          fallbackUrl={fallbackUrl}
          onReset={handleReset}
        />
      ) : (
        <form noValidate onSubmit={handleNext} className="enq-wizard-form">
          {/* Stepper Bus Road */}
          <BusProgress
            currentStep={step}
            isEnteringGate={isEnteringGate}
            onGateEnterComplete={handleGateEnterComplete}
          />

          {/* Screen reader live step announcement */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            Step {step} of 4: {STEP_TITLES[step - 1]}
          </div>

          {/* Validation error summary */}
          {hasErrors && (
            <div
              ref={errorSummaryRef}
              role="alert"
              tabIndex={-1}
              className="enq-error-summary sticker"
            >
              <h3 className="enq-error-summary__title">Please check the following:</h3>
              <ul className="enq-error-summary__list">
                {errorKeys.map((k) => (
                  <li key={k} className="enq-error-summary__item">
                    {errors[k]}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Animated Current Step Panel */}
          <div ref={stepPanelRef} className="enq-step-container">
            {step === 1 && (
              <StepAboutYou
                values={values}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                fieldRefs={fieldRefs}
                headingRef={headingRef}
              />
            )}

            {step === 2 && (
              <StepAboutChild
                values={values}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                fieldRefs={fieldRefs}
                headingRef={headingRef}
                programs={programs}
                preselectedProgram={preselectedProgram}
              />
            )}

            {step === 3 && (
              <StepVisit
                values={values}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                fieldRefs={fieldRefs}
                headingRef={headingRef}
              />
            )}

            {step === 4 && (
              <StepReview
                values={values}
                onEditStep={handleEditStep}
                onSendWhatsApp={() => handleSendInitiate('WhatsApp')}
                onSendEmail={() => handleSendInitiate('Email')}
                isSending={isSending}
                headingRef={headingRef}
              />
            )}
          </div>

          {/* Action Bar (Sticky on phones) */}
          {step < 4 && (
            <div className="enq-action-bar">
              <div className="enq-action-bar__inner">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    className="enq-action-bar__back"
                  >
                    Back
                  </Button>
                ) : (
                  <span className="enq-action-bar__spacer" aria-hidden="true" />
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="enq-action-bar__next"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default EnquiryWizard;
