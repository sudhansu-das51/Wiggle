import React from 'react';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/layout/PageHero';
import { CtaBanner } from '../components/ui/CtaBanner';
import { TeacherToolbox } from '../components/careers/TeacherToolbox';
import { RolePosters } from '../components/careers/RolePosters';
import { Hopscotch } from '../components/careers/Hopscotch';
import { CareerFaqs } from '../components/careers/CareerFaqs';
import { siteConfig } from '../config/siteConfig';

import './Careers.css';
import '../components/careers/careers.css';

/**
 * Careers Page (/careers).
 * Supports /careers?role={slug} for shareable links to a specific role.
 * Help-wanted posters with tear-off tabs, teacher's toolbox perks,
 * chalk hopscotch hiring process, FAQs, and application modal.
 */
export function Careers() {
  const brand = siteConfig.brand?.name || 'Wiggle';

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Careers' },
  ];

  return (
    <main className="careers-page">
      <Seo
        title="Careers"
        description={`Join the teaching team at ${brand} Preschool. See open educator roles, teacher perks, our hopscotch hiring process, and apply in under a minute.`}
      />

      {/* Section 1: Page Hero */}
      <PageHero
        title="Careers"
        note="Do you like glitter? We might have a job for you."
        tint="pink"
        mascotMood="cheer"
        crumbs={breadcrumbs}
      />

      {/* Section 2: Why teach here (the teacher's toolbox) */}
      <TeacherToolbox />

      {/* Section 3: Open roles (posters) */}
      <RolePosters />

      {/* Section 4: What happens after you apply (hopscotch) */}
      <Hopscotch />

      {/* Section 5: Questions before applying (FAQs) */}
      <CareerFaqs />

      {/* Section 6: CTA Banner */}
      <section className="section section--paper" style={{ paddingBlock: '3rem' }}>
        <div className="container">
          <CtaBanner
            title="Ready to wiggle with us?"
            text="Say hello and we will find a time to meet over a cup of tea."
            primaryLabel="Say hello"
            primaryTo="/contact"
            message={`Hi ${brand}! I am interested in working with you.`}
          />
        </div>
      </section>
    </main>
  );
}

export default Careers;
