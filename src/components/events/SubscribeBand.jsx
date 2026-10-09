import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { Icon } from '../ui/Icon';
import { siteConfig } from '../../config/siteConfig';
import { buildIcs, downloadFile, isUpcoming, sortEvents } from '../../utils/calendar';

/**
 * Section 5: Never miss a date - Compact subscribe & download calendar band.
 *
 * @param {{
 *   events: Array<Object>,
 *   className?: string
 * }} props
 */
export function SubscribeBand({ events = [], className = '' }) {
  const brand = siteConfig?.brand?.name || 'Wiggle';
  const brandSlug = brand.toLowerCase().replace(/\s+/g, '-');

  const handleDownloadAllUpcoming = () => {
    const now = new Date();
    const sorted = sortEvents(events);
    const upcoming = sorted.filter((e) => isUpcoming(e, now));
    const icsContent = buildIcs(upcoming.length > 0 ? upcoming : sorted);
    const filename = `${brandSlug}-events.ics`;
    downloadFile(filename, icsContent, 'text/calendar;charset=utf-8');
  };

  const whatsappMessage = `Hi ${brand}! Please add me to the events updates list.`;

  return (
    <section className={`section section--mint evt-subscribe-section ${className}`}>
      <div className="container">
        <div className="evt-subscribe-card">
          <SectionHeading
            title="Never miss a date"
            text="Get the dates on your phone or in your parents' chat."
            align="center"
          />

          <div className="evt-subscribe-actions">
            <Button
              variant="ghost"
              onClick={handleDownloadAllUpcoming}
              icon={<Icon name="calendar" size={18} />}
              className="evt-subscribe-btn"
            >
              Download all upcoming dates
            </Button>

            <WhatsAppButton
              variant="ghost"
              message={whatsappMessage}
              label="Get event updates on WhatsApp"
              className="evt-subscribe-btn"
            />
          </div>

          <div className="evt-subscribe-foot">
            <span className="note evt-subscribe-note">
              Works with Google, Apple and Outlook calendars.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SubscribeBand;
