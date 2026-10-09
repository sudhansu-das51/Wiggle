import React from 'react';
import { Button } from '../ui/Button';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { Icon } from '../ui/Icon';
import { siteConfig } from '../../config/siteConfig';
import { formatEventDate } from '../../utils/dates';
import { buildGoogleCalendarUrl, buildIcs, downloadFile } from '../../utils/calendar';

/**
 * Reusable event actions: Add to Google Calendar, Download .ics, and Ask on WhatsApp.
 *
 * @param {{
 *   event: Object,
 *   className?: string
 * }} props
 */
export function EventActions({ event, className = '' }) {
  if (!event) return null;

  const brand = siteConfig?.brand?.name || 'Wiggle';
  const { full: formattedDate } = formatEventDate(event.date);
  const googleCalUrl = buildGoogleCalendarUrl(event);

  const handleDownloadIcs = () => {
    const icsContent = buildIcs([event]);
    const filename = `${event.slug || 'wiggle-event'}.ics`;
    downloadFile(filename, icsContent, 'text/calendar;charset=utf-8');
  };

  const whatsappMessage = `Hi ${brand}! I would like to know more about ${event.title} on ${formattedDate}.`;

  return (
    <div className={`evt-actions ${className}`}>
      <Button
        variant="ghost"
        href={googleCalUrl}
        icon={<Icon name="calendar" size={18} />}
        className="evt-action-btn"
      >
        Add to Google Calendar
      </Button>
      <Button
        variant="ghost"
        onClick={handleDownloadIcs}
        icon={<Icon name="calendar" size={18} />}
        className="evt-action-btn"
      >
        Download for Apple or Outlook
      </Button>
      <WhatsAppButton
        variant="ghost"
        message={whatsappMessage}
        label="Ask about this event"
        className="evt-action-btn"
      />
    </div>
  );
}

export default EventActions;
