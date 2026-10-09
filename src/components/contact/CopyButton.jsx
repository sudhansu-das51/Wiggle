import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { copyToClipboard } from '../../utils/contact';
import { Icon } from '../ui/Icon';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function CopyButton({ textToCopy, label = 'Copy', className = '' }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const btnRef = useRef(null);
  const timerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const handleCopy = async () => {
    if (!textToCopy) return;
    const success = await copyToClipboard(textToCopy);

    if (success) {
      setCopied(true);
      setCopyFailed(false);

      if (!reducedMotion && btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          { scale: 1.25 },
          { scale: 1, duration: 0.25, ease: 'back.out(2)' }
        );
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } else {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 3000);
    }
  };

  return (
    <div className="con-copy-btn-wrap">
      <button
        ref={btnRef}
        type="button"
        onClick={handleCopy}
        className={`con-copy-btn ${copied ? 'is-copied' : ''} ${className}`}
        aria-label={`${label} to clipboard`}
      >
        <span className="con-copy-btn__icon" aria-hidden="true">
          <Icon name={copied ? 'check' : 'key'} size={16} />
        </span>
        <span className="con-copy-btn__text">
          {copied ? 'Copied' : label}
        </span>
      </button>

      {/* Screen reader announcement */}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>

      {/* Fallback handwritten note if copy failed */}
      {copyFailed && (
        <span className="con-copy-btn__fail-note">
          Press and hold to copy
        </span>
      )}
    </div>
  );
}
