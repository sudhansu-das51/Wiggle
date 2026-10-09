import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';
import { TransitionLink } from '../motion/TransitionLink';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { MobileMenu } from './MobileMenu';
import './Navbar.css';

/**
 * Sticky brand navigation bar with dropdowns, scroll-compact state toggle,
 * and mobile drawer controller.
 */
export function Navbar() {
  const [isCompact, setIsCompact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = siteConfig?.nav || [];

  return (
    <>
      <header className={`site-navbar ${isCompact ? 'is-compact' : ''}`}>
        <div className="container site-navbar__container">
          <TransitionLink to="/" aria-label="Wiggle Home">
            <Logo size={isCompact ? 'sm' : 'md'} />
          </TransitionLink>

          <nav className="site-navbar__nav" aria-label="Main Navigation">
            {navItems.map((item, idx) => {
              const hasChildren = item.children && item.children.length > 0;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname === item.path ||
                    (hasChildren && item.children.some((c) => location.pathname === c.path));

              return (
                <div key={idx} className="site-navbar__item">
                  <TransitionLink
                    to={item.path}
                    className={`site-navbar__link ${isActive ? 'is-active' : ''}`}
                    aria-expanded={hasChildren ? 'false' : undefined}
                    aria-haspopup={hasChildren ? 'true' : undefined}
                  >
                    <span>{item.label}</span>
                    {hasChildren && (
                      <span className="site-navbar__caret" aria-hidden="true">
                        ▾
                      </span>
                    )}
                  </TransitionLink>

                  {hasChildren && (
                    <div className="site-navbar__dropdown" role="menu">
                      {item.children.map((child, cIdx) => (
                        <TransitionLink
                          key={cIdx}
                          to={child.path}
                          className="site-navbar__dropdown-link"
                          role="menuitem"
                        >
                          {child.label}
                        </TransitionLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="site-navbar__actions">
            <div className="site-navbar__cta">
              <Button variant="primary" to="/enquire">
                Enquire now
              </Button>
            </div>

            <button
              type="button"
              className="site-navbar__hamburger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation"
            >
              <Icon name="menu" size={24} color="var(--ink)" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
