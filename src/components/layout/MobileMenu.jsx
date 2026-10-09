import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { siteConfig } from '../../config/siteConfig';
import { useLenis } from '../motion/SmoothScroll';
import { TransitionLink } from '../motion/TransitionLink';
import { Logo } from '../ui/Logo';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { SocialLinks } from '../ui/SocialLinks';
import './MobileMenu.css';

/**
 * Full-screen mobile navigation drawer with GSAP stagger entrance,
 * accordion support for children, and scroll lock.
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export function MobileMenu({ isOpen, onClose }) {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const menuRef = useRef(null);
  const location = useLocation();
  const lenis = useLenis();

  // Close on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll lock and Escape listener
  useEffect(() => {
    if (!isOpen) return;

    if (lenis) lenis.stop();
    else if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    // Stagger items in
    if (menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.4, ease: 'power3.out' }
      );
      gsap.fromTo(
        menuRef.current.querySelectorAll('.mobile-menu__item'),
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.05, ease: 'back.out(1.4)', delay: 0.15 }
      );
    }

    return () => {
      window.removeEventListener('keydown', handleKey);
      if (lenis) lenis.start();
      else if (typeof document !== 'undefined') document.body.style.overflow = '';
    };
  }, [isOpen, lenis, onClose]);

  if (!isOpen) return null;

  const navItems = siteConfig?.nav || [];

  return (
    <div
      ref={menuRef}
      className="mobile-menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className="mobile-menu__header">
        <Logo size="sm" />
        <button
          type="button"
          onClick={onClose}
          className="mobile-menu__close-btn"
          aria-label="Close menu"
        >
          <Icon name="close" size={24} color="var(--ink)" />
        </button>
      </div>

      <nav className="mobile-menu__nav">
        {navItems.map((item, idx) => {
          const hasChildren = item.children && item.children.length > 0;
          const isSubmenuOpen = openSubmenu === item.label;

          return (
            <div key={idx} className="mobile-menu__item">
              {hasChildren ? (
                <>
                  <button
                    type="button"
                    className="mobile-menu__link"
                    onClick={() => setOpenSubmenu(isSubmenuOpen ? null : item.label)}
                    aria-expanded={isSubmenuOpen}
                  >
                    <span>{item.label}</span>
                    <Icon name={isSubmenuOpen ? 'minus' : 'plus'} size={20} color="var(--ink)" />
                  </button>

                  {isSubmenuOpen && (
                    <div className="mobile-menu__submenu">
                      {item.children.map((child, cIdx) => (
                        <TransitionLink
                          key={cIdx}
                          to={child.path}
                          className="mobile-menu__sublink"
                          onClick={onClose}
                        >
                          {child.label}
                        </TransitionLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <TransitionLink
                  to={item.path}
                  className="mobile-menu__link"
                  onClick={onClose}
                >
                  {item.label}
                </TransitionLink>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mobile-menu__footer">
        <Button variant="primary" to="/enquire" onClick={onClose}>
          Enquire now
        </Button>
        <SocialLinks size={18} />
      </div>
    </div>
  );
}
