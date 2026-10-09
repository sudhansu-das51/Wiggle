import React from 'react';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/layout/PageHero';
import { CtaBanner } from '../components/ui/CtaBanner';
import { ChannelPostcards } from '../components/contact/ChannelPostcards';
import { MessagePlane } from '../components/contact/MessagePlane';
import { VisitSection } from '../components/contact/VisitSection';
import { ContactFaqs } from '../components/contact/ContactFaqs';
import { siteConfig } from '../config/siteConfig';

import './Contact.css';
import '../components/contact/contact.css';

/**
 * Contact Page (/contact).
 * Postcards for every channel, paper-plane message form,
 * folded paper map with directions and hours, visiting FAQs, and CTA.
 */
export function Contact() {
  const brand = siteConfig.brand?.name || 'Wiggle';
  const { contact } = siteConfig;

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Contact' },
  ];

  return (
    <main className="contact-page">
      <Seo
        title="Contact"
        description={`Say hello to ${brand} Preschool. Reach us on WhatsApp, call, email, or visit our campus. We reply fast!`}
      />

      {/* Section 1: Page Hero */}
      <PageHero
        title="Contact us"
        note="Say hello. We reply fast, and usually with exclamation marks."
        tint="yellow"
        mascotMood="wave"
        crumbs={breadcrumbs}
      />

      {/* Section 2: Pick your channel (postcards) */}
      <ChannelPostcards />

      {/* Section 3: Send a message (paper plane) */}
      <MessagePlane />

      {/* Section 4: Visit us (map, hours, directions) */}
      <VisitSection brand={siteConfig.brand} contact={contact} />

      {/* Section 5: Questions about visiting */}
      <ContactFaqs />

      {/* Section 6: CTA Banner */}
      <section className="section section--paper" style={{ paddingBlock: '3rem' }}>
        <div className="container">
          <CtaBanner
            title="Come and say hello"
            text="A quick visit is always welcome during school hours. Book one and we will put the kettle on."
            primaryTo="/enquire"
            message={`Hi ${brand}! I would like to arrange a visit to say hello.`}
          />
        </div>
      </section>
    </main>
  );
}

export default Contact;
