import React from 'react';
import { admissionSteps } from '../../data/programs';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import './programs.css';

/**
 * Section 6: How admission works, styled as a continuous train ticket with perforated stubs.
 */
export function TicketSteps() {
  return (
    <section className="section section--mint programs-ticket-steps-section" aria-label="Admission steps">
      <div className="container">
        <SectionHeading
          title="Your ticket to Wiggle"
          note="Four simple steps from first message to first morning circle."
          align="center"
          wiggle
        />

        {/* Master Train Ticket */}
        <div className="programs-big-ticket">
          {/* Side Notches */}
          <span className="programs-big-ticket__notch notch-left" aria-hidden="true" />
          <span className="programs-big-ticket__notch notch-right" aria-hidden="true" />

          {/* Stubs Track */}
          <div className="programs-big-ticket__stubs">
            {admissionSteps.map((step, idx) => {
              const isLast = idx === admissionSteps.length - 1;

              return (
                <div key={idx} className="programs-ticket-stub">
                  {/* Step Header */}
                  <div className="programs-ticket-stub__head">
                    <span className="programs-ticket-stub__badge">
                      {`0${idx + 1}`}
                    </span>
                    <div className="programs-ticket-stub__icon" aria-hidden="true">
                      <Icon name={step.icon} size={24} color="var(--ink)" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="programs-ticket-stub__title">
                    {step.title}
                  </h3>
                  <p className="programs-ticket-stub__text">
                    {step.text}
                  </p>

                  {/* Perforation Line (except last) */}
                  {!isLast && (
                    <div className="programs-ticket-perforation" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="programs-ticket-steps__action">
          <Button variant="primary" to="/enquire">
            Book a school visit
          </Button>
        </div>
      </div>
    </section>
  );
}
