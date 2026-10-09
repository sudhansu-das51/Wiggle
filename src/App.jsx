import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TransitionProvider } from './components/motion/TransitionContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Curriculum from './pages/Curriculum';
import WhyUs from './pages/WhyUs';
import Facilities from './pages/Facilities';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import Teachers from './pages/Teachers';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Enquire from './pages/Enquire';
import { ComingSoon } from './components/ui/ComingSoon';

/**
 * Main Application Shell and Route Table.
 */
export function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            {/* ROUTES: replace each ComingSoon with its real page when that page is built */}
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:slug" element={<ProgramDetail />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/why-us" element={<WhyUs />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/events" element={<Events />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/enquire" element={<Enquire />} />
            <Route path="*" element={<ComingSoon title="Page not found" />} />
            {/* END ROUTES */}
          </Route>
        </Routes>
      </TransitionProvider>
    </BrowserRouter>
  );
}

export default App;
