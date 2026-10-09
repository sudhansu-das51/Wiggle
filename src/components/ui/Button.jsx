import React from 'react';
import { TransitionLink } from '../motion/TransitionLink';

/**
 * Universal Button component.
 * @param {{
 *   variant?: 'primary' | 'ghost' | 'ink',
 *   to?: string,
 *   href?: string,
 *   icon?: React.ReactNode,
 *   onClick?: (e: React.MouseEvent) => void,
 *   type?: 'button' | 'submit' | 'reset',
 *   children?: React.ReactNode,
 *   className?: string,
 *   title?: string,
 *   'aria-label'?: string
 * }} props
 */
export function Button({
  variant = 'primary',
  to,
  href,
  icon,
  onClick,
  type = 'button',
  children,
  className = '',
  ...rest
}) {
  const variantClass = `btn--${variant}`;
  const combinedClassName = `btn ${variantClass} ${className}`.trim();

  const content = (
    <>
      {icon && <span className="btn__icon" aria-hidden="true">{icon}</span>}
      {children && <span className="btn__label">{children}</span>}
    </>
  );

  if (to) {
    return (
      <TransitionLink to={to} className={combinedClassName} onClick={onClick} {...rest}>
        {content}
      </TransitionLink>
    );
  }

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    return (
      <a
        href={href}
        className={combinedClassName}
        onClick={onClick}
        target={isExternal && href.startsWith('http') ? '_blank' : undefined}
        rel={isExternal && href.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      {...rest}
    >
      {content}
    </button>
  );
}
