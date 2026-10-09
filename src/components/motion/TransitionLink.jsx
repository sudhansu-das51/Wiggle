import React from 'react';
import { useTransition } from './TransitionContext';

/**
 * Drop-in replacement for React Router's Link.
 * Delegates internal navigation to TransitionContext.go(to).
 * Ignores modified clicks (Cmd/Ctrl/Shift), right clicks, or target="_blank".
 */
export function TransitionLink({
  to,
  children,
  className = '',
  target,
  rel,
  onClick,
  ...rest
}) {
  const { go } = useTransition();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }

    // Ignore if default prevented or external attributes present
    if (e.defaultPrevented) return;
    if (target && target !== '_self') return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.button !== 0) return; // Only primary mouse button

    // If string URL starts with http / mailto / tel, let default link action occur
    if (typeof to === 'string' && (to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:'))) {
      return;
    }

    e.preventDefault();
    go(to);
  };

  return (
    <a
      href={typeof to === 'string' ? to : '#'}
      className={className}
      target={target}
      rel={rel}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}
