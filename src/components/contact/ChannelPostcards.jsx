import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { SocialLinks } from '../ui/SocialLinks';
import { Postcard } from './Postcard';
import { CopyButton } from './CopyButton';
import { siteConfig } from '../../config/siteConfig';
import { formatAddress, buildDirectionsUrl } from '../../utils/contact';
import { useLenis } from '../motion/SmoothScroll';

export function ChannelPostcards() {
  const { contact, whatsapp } = siteConfig;
  const lenis = useLenis();

  const { singleLine } = formatAddress(contact?.address);
  const directionsUrl = buildDirectionsUrl(contact);

  const handleScrollToVisit = (e) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo('#visit', { offset: -30 });
    } else {
      const el = document.getElementById('visit');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section section--paper con-channels" aria-label="Contact channels">
      <div className="container">
        <SectionHeading
          title="Pick the way you like"
          note="Every one of these reaches a real person."
          align="center"
          wiggle
        />

        <div className="con-channels__grid">
          {/* Card 1: WhatsApp (Featured, spans 2 columns on desktop/tablet) */}
          <Postcard
            title="WhatsApp"
            iconName="whatsapp"
            stampColor="var(--tint-mint)"
            tag="Fastest. We usually reply the same day."
            tilt={-1.5}
            featured={true}
          >
            <p className="con-postcard__detail">
              Send us a message any time for quick questions, visiting slots, or fee details.
            </p>
            <div className="con-postcard__value">
              +{whatsapp?.number || '919999999999'}
            </div>
            <div className="con-postcard__actions">
              <WhatsAppButton
                message={whatsapp?.defaultMessage}
                label="Message us on WhatsApp"
                variant="primary"
                className="con-postcard__cta"
              />
            </div>
          </Postcard>

          {/* Card 2: Phone Call */}
          <Postcard
            title="Call"
            iconName="phone"
            stampColor="var(--tint-yellow)"
            tilt={1.8}
          >
            <p className="con-postcard__detail">
              Our front desk is here during working hours to help with admissions and directions.
            </p>
            <div className="con-postcard__value">
              {contact?.phoneDisplay || '+91 99999 99999'}
            </div>
            <div className="con-postcard__actions">
              <Button
                variant="ghost"
                href={`tel:${contact?.phone}`}
                className="con-postcard__btn"
              >
                Call now
              </Button>
              <CopyButton textToCopy={contact?.phoneDisplay} label="Copy number" />
            </div>
          </Postcard>

          {/* Card 3: Email */}
          <Postcard
            title="Email"
            iconName="mail"
            stampColor="var(--tint-sky)"
            tilt={-2.2}
          >
            <p className="con-postcard__detail">
              For detailed transfer questions, documentation, or official partnerships.
            </p>
            <div className="con-postcard__value">
              {contact?.email || 'hello@wigglepreschool.in'}
            </div>
            <div className="con-postcard__actions">
              <Button
                variant="ghost"
                href={`mailto:${contact?.email}`}
                className="con-postcard__btn"
              >
                Write an email
              </Button>
              <CopyButton textToCopy={contact?.email} label="Copy email" />
            </div>
          </Postcard>

          {/* Card 4: Visit */}
          <Postcard
            title="Visit"
            iconName="pin"
            stampColor="var(--tint-pink)"
            tilt={1.5}
          >
            <p className="con-postcard__detail">
              {singleLine}
            </p>
            {contact?.landmark && (
              <span className="con-postcard__landmark">
                ({contact.landmark})
              </span>
            )}
            <div className="con-postcard__actions">
              <Button
                variant="ghost"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="con-postcard__btn"
              >
                Get directions
              </Button>
              <a
                href="#visit"
                onClick={handleScrollToVisit}
                className="con-postcard__link"
              >
                See campus map
              </a>
            </div>
          </Postcard>

          {/* Card 5: Social Media */}
          <Postcard
            title="Social media"
            iconName="camera"
            stampColor="var(--tint-yellow)"
            tilt={-1.2}
          >
            <p className="con-postcard__detail">
              Follow our daily moments of muddy play, finger paint, and joy.
            </p>
            <span className="con-postcard__social-note">
              New photos every week.
            </span>
            <div className="con-postcard__social-wrap">
              <SocialLinks size={22} className="con-postcard__social-icons" />
            </div>
          </Postcard>
        </div>
      </div>
    </section>
  );
}
