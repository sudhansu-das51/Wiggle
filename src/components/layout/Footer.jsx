import React, { useMemo } from 'react';
import { siteConfig } from '../../config/siteConfig';
import { BlockPit } from './BlockPit';
import { SocialLinks } from '../ui/SocialLinks';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { TransitionLink } from '../motion/TransitionLink';
import { Logo } from '../ui/Logo';
import './Footer.css';

/**
 * Universal site footer with clean dark tray, interactive alphabet BlockPit,
 * brand links, program navigation, contact information, and careers link.
 */
export function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const { brand, contact } = siteConfig;

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container site-footer__content">
        {/* Compact Matter.js Alphabet BlockPit */}
        <BlockPit />

        <div className="site-footer__grid">
          {/* Col 1: Brand & Social */}
          <div className="site-footer__col site-footer__col--brand">
            <div style={{ alignSelf: 'flex-start' }}>
              <Logo size="sm" />
            </div>
            <p className="site-footer__tagline">
              {brand.tagline}
            </p>
            <div style={{ marginTop: '0.25rem' }}>
              <SocialLinks size={17} />
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="site-footer__col">
            <h4 className="site-footer__title">Explore</h4>
            <ul className="site-footer__links">
              <li><TransitionLink to="/about" className="site-footer__link">About us</TransitionLink></li>
              <li><TransitionLink to="/why-us" className="site-footer__link">Why Wiggle</TransitionLink></li>
              <li><TransitionLink to="/facilities" className="site-footer__link">Our facilities</TransitionLink></li>
              <li><TransitionLink to="/gallery" className="site-footer__link">Photo gallery</TransitionLink></li>
              <li><TransitionLink to="/teachers" className="site-footer__link">Our teachers</TransitionLink></li>
            </ul>
          </div>

          {/* Col 3: Programs */}
          <div className="site-footer__col">
            <h4 className="site-footer__title">Classrooms</h4>
            <ul className="site-footer__links">
              <li><TransitionLink to="/programs/playgroup" className="site-footer__link">Playgroup (1.5-2.5y)</TransitionLink></li>
              <li><TransitionLink to="/programs/nursery" className="site-footer__link">Nursery (2.5-3.5y)</TransitionLink></li>
              <li><TransitionLink to="/programs/jr-kg" className="site-footer__link">Jr. KG (3.5-4.5y)</TransitionLink></li>
              <li><TransitionLink to="/programs/sr-kg" className="site-footer__link">Sr. KG (4.5-5.5y)</TransitionLink></li>
              <li><TransitionLink to="/curriculum" className="site-footer__link">Curriculum</TransitionLink></li>
            </ul>
          </div>

          {/* Col 4: Contact & WhatsApp */}
          <div className="site-footer__col site-footer__col--contact">
            <h4 className="site-footer__title">Visit & Chat</h4>
            <p className="site-footer__address">
              {contact.address.line1}, {contact.address.city} - {contact.address.pincode}
            </p>
            <p className="site-footer__contact-lines">
              <a href={`tel:${contact.phone}`} className="site-footer__contact-link">{contact.phoneDisplay}</a>
              <span className="site-footer__contact-sep">•</span>
              <a href={`mailto:${contact.email}`} className="site-footer__contact-link">{contact.email}</a>
            </p>
            <div style={{ marginTop: '0.35rem' }}>
              <WhatsAppButton variant="primary" label="Message our desk" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="site-footer__bottom">
          <p>© {currentYear} {brand.name} Preschool. All rights reserved.</p>
          <div className="site-footer__bottom-links">
            <TransitionLink to="/careers" className="site-footer__link">Careers</TransitionLink>
            <TransitionLink to="/enquire" className="site-footer__link">Book a tour</TransitionLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
