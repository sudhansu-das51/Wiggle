import React from 'react';
import { Outlet } from 'react-router-dom';
import { SmoothScroll } from '../motion/SmoothScroll';
import { PageTransition } from '../motion/PageTransition';
import { TopBar } from './TopBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppFloat } from './WhatsAppFloat';
import './Layout.css';

/**
 * Global App Layout Shell.
 * Provides Lenis smooth scrolling, gate transition curtain, top bar,
 * navbar, main content outlet, footer, and floating WhatsApp CTA.
 */
export function Layout() {
  return (
    <SmoothScroll>
      <div className="app-layout">
        <PageTransition />
        <TopBar />
        <Navbar />
        <main className="app-layout__main">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </SmoothScroll>
  );
}
