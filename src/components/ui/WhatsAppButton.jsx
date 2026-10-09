import React from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { buildWhatsAppLink } from '../../utils/whatsapp';

/**
 * Pre-configured WhatsApp Button.
 * @param {{
 *   message?: string,
 *   label?: string,
 *   variant?: 'primary' | 'ghost' | 'ink',
 *   className?: string
 * }} props
 */
export function WhatsAppButton({
  message,
  label = 'Enquire on WhatsApp',
  variant = 'primary',
  className = '',
  ...rest
}) {
  const link = buildWhatsAppLink(message);

  return (
    <Button
      variant={variant}
      href={link}
      icon={<Icon name="whatsapp" size={20} color="var(--ink)" />}
      className={`btn--whatsapp ${className}`}
      {...rest}
    >
      {label}
    </Button>
  );
}
