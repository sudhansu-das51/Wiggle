import React from 'react';
import { Mascot } from '../ui/Mascot';
import { Button } from '../ui/Button';
import { BlockRain } from './BlockRain';
import { siteConfig } from '../../config/siteConfig';

/**
 * SuccessPanel rendered inside the wizard card when the message is prepared.
 * Honest ready state with Wig mascot, reply promise, and Matter.js alphabet block rain.
 * @param {{
 *   channel: 'WhatsApp' | 'Email',
 *   contactPreference: string,
 *   popupBlocked?: boolean,
 *   fallbackUrl?: string,
 *   onReset: () => void,
 *   className?: string
 * }} props
 */
export function SuccessPanel({
  channel = 'WhatsApp',
  contactPreference = 'WhatsApp',
  popupBlocked = false,
  fallbackUrl = '',
  onReset,
  className = '',
}) {
  const replyPromise = siteConfig.admissions?.replyPromise || 'We usually reply the same day.';
  const appName = channel === 'WhatsApp' ? 'WhatsApp' : 'your email app';

  return (
    <div className={`enq-success-panel ${className}`} role="status" aria-live="polite">
      {/* Mascot Cheer */}
      <div className="enq-success-mascot" aria-hidden="true">
        <Mascot mood="cheer" size={90} />
      </div>

      <h2 tabIndex={-1} className="enq-success-title">
        Your enquiry is ready!
      </h2>

      <p className="enq-success-text">
        Press send in {appName} to finish. {replyPromise} We will reach you by {contactPreference || 'WhatsApp'}.
      </p>

      {/* Fallback button if new tab was blocked */}
      {popupBlocked && fallbackUrl && (
        <div className="enq-success-fallback">
          <Button variant="primary" href={fallbackUrl} target="_blank" rel="noopener noreferrer">
            Open WhatsApp
          </Button>
        </div>
      )}

      <div className="enq-success-actions">
        <Button variant="ghost" onClick={onReset} className="enq-success-reset-btn">
          Start a new enquiry
        </Button>
      </div>

      <p className="enq-success-note note">
        Until you press send in {appName}, nothing leaves your device.
      </p>

      {/* Matter.js Alphabet Block Rain Physics */}
      <div className="enq-success-blocks-wrap">
        <BlockRain />
      </div>
    </div>
  );
}

export default SuccessPanel;
