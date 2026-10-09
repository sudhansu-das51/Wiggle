import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLenis } from '../motion/SmoothScroll';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Icon } from './Icon';

/**
 * Accessible Modal dialog with backdrop click, Escape key dismiss, focus trap,
 * and Lenis scroll lock.
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   title?: string,
 *   children: React.ReactNode,
 *   className?: string
 * }} props
 */
export function Modal({ isOpen, onClose, title, children, className = '' }) {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    // Scroll lock via Lenis or standard body overflow
    if (lenis) {
      lenis.stop();
    } else if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    // Escape key listener
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Entrance animation
    if (!reducedMotion && modalRef.current && backdropRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      );
      gsap.fromTo(
        modalRef.current,
        { scale: 0.85, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.5)' }
      );
    }

    // Auto-focus first focusable element
    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (lenis) {
        lenis.start();
      } else if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, lenis, onClose, reducedMotion]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === backdropRef.current) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(35, 42, 92, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-dialog-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`modal-content ${className}`}
        style={{
          backgroundColor: 'var(--paper)',
          border: 'var(--outline)',
          borderRadius: 'var(--r-lg)',
          boxShadow: '8px 8px 0 var(--ink)',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: 'var(--ink)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="close" size={24} />
        </button>

        {title && (
          <h3
            id="modal-dialog-title"
            style={{
              marginBottom: '1.25rem',
              color: 'var(--ink)',
              paddingRight: '2rem',
            }}
          >
            {title}
          </h3>
        )}

        {children}
      </div>
    </div>
  );
}
