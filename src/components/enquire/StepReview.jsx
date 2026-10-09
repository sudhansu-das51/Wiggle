import React from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

/**
 * Step 4 — Send (Ticket-style Review).
 * Paper card with notched sides, perforation lines, summary of non-empty answers,
 * quick edit buttons per section, primary WhatsApp send button, and mailto send button.
 * @param {{
 *   values: Record<string, any>,
 *   onEditStep: (stepNumber: number) => void,
 *   onSendWhatsApp: () => void,
 *   onSendEmail: () => void,
 *   isSending?: boolean,
 *   headingRef?: React.RefObject<any>
 * }} props
 */
export function StepReview({
  values,
  onEditStep,
  onSendWhatsApp,
  onSendEmail,
  isSending = false,
  headingRef,
}) {
  return (
    <div className="enq-step-panel enq-step-panel--review">
      <h2 ref={headingRef} tabIndex={-1} className="enq-step-heading">
        Review your enquiry
      </h2>
      <p className="enq-step-subtext">
        Double check everything before taking the little bus to WhatsApp or your email.
      </p>

      {/* Ticket-style Summary Card */}
      <div className="enq-ticket sticker">
        {/* Group 1: You */}
        <div className="enq-ticket__section">
          <div className="enq-ticket__section-header">
            <span className="enq-ticket__section-title note">1. You</span>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="enq-ticket__edit-btn"
              aria-label="Edit your details"
            >
              Edit
            </button>
          </div>
          <div className="enq-ticket__data-grid">
            <div className="enq-ticket__row">
              <span className="enq-ticket__label">Parent / Guardian:</span>
              <span className="enq-ticket__val">{values.parentName}</span>
            </div>
            <div className="enq-ticket__row">
              <span className="enq-ticket__label">Phone:</span>
              <span className="enq-ticket__val">{values.phone}</span>
            </div>
            {values.email && (
              <div className="enq-ticket__row">
                <span className="enq-ticket__label">Email:</span>
                <span className="enq-ticket__val">{values.email}</span>
              </div>
            )}
            <div className="enq-ticket__row">
              <span className="enq-ticket__label">Preferred contact:</span>
              <span className="enq-ticket__val">{values.contactPreference || 'WhatsApp'}</span>
            </div>
          </div>
        </div>

        {/* Perforation Line */}
        <div className="enq-ticket__perforation" aria-hidden="true" />

        {/* Group 2: Your child */}
        <div className="enq-ticket__section">
          <div className="enq-ticket__section-header">
            <span className="enq-ticket__section-title note">2. Your child</span>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="enq-ticket__edit-btn"
              aria-label="Edit child details"
            >
              Edit
            </button>
          </div>
          <div className="enq-ticket__data-grid">
            <div className="enq-ticket__row">
              <span className="enq-ticket__label">Child's name:</span>
              <span className="enq-ticket__val">{values.childName}</span>
            </div>
            <div className="enq-ticket__row">
              <span className="enq-ticket__label">Age group:</span>
              <span className="enq-ticket__val">{values.childAge}</span>
            </div>
            {values.program && (
              <div className="enq-ticket__row">
                <span className="enq-ticket__label">Program:</span>
                <span className="enq-ticket__val">{values.program}</span>
              </div>
            )}
            {values.startMonth && (
              <div className="enq-ticket__row">
                <span className="enq-ticket__label">Target start:</span>
                <span className="enq-ticket__val">{values.startMonth}</span>
              </div>
            )}
          </div>
        </div>

        {/* Perforation Line */}
        <div className="enq-ticket__perforation" aria-hidden="true" />

        {/* Group 3: Your visit */}
        <div className="enq-ticket__section">
          <div className="enq-ticket__section-header">
            <span className="enq-ticket__section-title note">3. Your visit</span>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="enq-ticket__edit-btn"
              aria-label="Edit visit details"
            >
              Edit
            </button>
          </div>
          <div className="enq-ticket__data-grid">
            <div className="enq-ticket__row">
              <span className="enq-ticket__label">School visit:</span>
              <span className="enq-ticket__val">
                {values.wantVisit === 'no' ? 'Not yet requested' : 'Yes please'}
              </span>
            </div>
            {values.wantVisit !== 'no' && values.visitDate && (
              <div className="enq-ticket__row">
                <span className="enq-ticket__label">Preferred day:</span>
                <span className="enq-ticket__val">{values.visitDate}</span>
              </div>
            )}
            {values.wantVisit !== 'no' && values.visitSlot && (
              <div className="enq-ticket__row">
                <span className="enq-ticket__label">Time slot:</span>
                <span className="enq-ticket__val">{values.visitSlot}</span>
              </div>
            )}
            {values.message && values.message.trim() && (
              <div className="enq-ticket__row enq-ticket__row--message">
                <span className="enq-ticket__label">Note:</span>
                <span className="enq-ticket__val">{values.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Buttons Group */}
      <div className="enq-review-actions">
        <Button
          type="button"
          variant="primary"
          onClick={onSendWhatsApp}
          disabled={isSending}
          icon={<Icon name="whatsapp" size={20} />}
          className="enq-review-actions__primary"
        >
          {isSending ? 'Preparing WhatsApp...' : 'Send on WhatsApp'}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onSendEmail}
          disabled={isSending}
          icon={<Icon name="mail" size={20} />}
          className="enq-review-actions__ghost"
        >
          Send by email
        </Button>
      </div>

      <p className="enq-review-disclaimer note">
        You press send in the next app. Until then nothing leaves your device.
      </p>
    </div>
  );
}

export default StepReview;
