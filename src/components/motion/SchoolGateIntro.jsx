import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { siteConfig } from '../../config/siteConfig';
import { useTransition } from './TransitionContext';
import { useLenis } from './SmoothScroll';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './SchoolGateIntro.css';

/**
 * First-visit school gate opening animation overlay.
 * Features a grounded modern entrance gate with a triangular gabled top,
 * planted on a lush lawn with side grass and bright blue sky with fluffy clouds.
 * The gate smoothly swings open and the camera zooms in into the hero section.
 */
export function SchoolGateIntro() {
  const location = useLocation();
  const { introDone, markIntroDone } = useTransition();
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();

  const [visible, setVisible] = useState(false);
  const overlayRef = useRef(null);
  const stageRef = useRef(null);
  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);
  const timelineRef = useRef(null);

  const shouldShow =
    siteConfig?.animations?.gateIntro !== false &&
    location.pathname === '/' &&
    !introDone &&
    !reducedMotion;

  useEffect(() => {
    if (shouldShow) {
      setVisible(true);
      if (lenis) lenis.stop();
    } else if (!introDone) {
      markIntroDone();
    }
  }, [shouldShow, lenis, introDone, markIntroDone]);

  const finishIntro = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
        onComplete: () => {
          setVisible(false);
          markIntroDone();
          if (lenis) lenis.start();
        },
      });
    } else {
      setVisible(false);
      markIntroDone();
      if (lenis) lenis.start();
    }
  }, [lenis, markIntroDone]);

  useEffect(() => {
    if (!visible) return;

    // Handle skip keys: Escape or Enter or Space
    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        finishIntro();
      }
    };
    window.addEventListener('keydown', handleKey);

    const tl = gsap.timeline({
      onComplete: () => {
        finishIntro();
      },
    });
    timelineRef.current = tl;

    // Initial brief hold (0.35s) so visitor takes in the peaceful morning gate scene
    // Step 1: Smooth 3D gate opening (left door -105deg, right door 105deg)
    tl.to(leftDoorRef.current, {
      rotateY: -105,
      duration: 1.15,
      ease: 'power2.inOut',
    }, '+=0.35');

    tl.to(rightDoorRef.current, {
      rotateY: 105,
      duration: 1.15,
      ease: 'power2.inOut',
    }, '<');

    // Step 2: Smooth camera zoom-in through the gate threshold
    // Starts as the doors are opening wide
    tl.to(stageRef.current, {
      scale: 4.6,
      duration: 1.35,
      ease: 'power2.in',
      transformOrigin: '50% 72%',
    }, '-=0.55');

    // Step 3: Seamless crossfade out to reveal the landing hero section
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.45,
      ease: 'power1.out',
    }, '-=0.35');

    return () => {
      window.removeEventListener('keydown', handleKey);
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [visible, finishIntro]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="gate-intro-overlay"
      onClick={finishIntro}
      role="dialog"
      aria-label="School Gate Opening"
    >
      <div ref={stageRef} className="gate-intro-stage" onClick={(e) => e.stopPropagation()}>
        {/* =========================================================================
            LAYER 1: Bright Blue Sky with Clouds & Cheerful Sun
            ========================================================================= */}
        <div className="gate-intro-sky">
          {/* Cheerful Sun */}
          <div className="gate-sky-sun" aria-hidden="true">
            <svg viewBox="0 0 100 100" width="84" height="84">
              <g stroke="var(--ink)" strokeWidth="3" strokeLinecap="round">
                <line x1="50" y1="10" x2="50" y2="2" />
                <line x1="78" y1="22" x2="84" y2="16" />
                <line x1="90" y1="50" x2="98" y2="50" />
                <line x1="78" y1="78" x2="84" y2="84" />
                <line x1="50" y1="90" x2="50" y2="98" />
                <line x1="22" y1="78" x2="16" y2="84" />
                <line x1="10" y1="50" x2="2" y2="50" />
                <line x1="22" y1="22" x2="16" y2="16" />
              </g>
              <circle cx="50" cy="50" r="28" fill="#FFC93C" stroke="var(--ink)" strokeWidth="3" />
              <circle cx="42" cy="46" r="3" fill="var(--ink)" />
              <circle cx="58" cy="46" r="3" fill="var(--ink)" />
              <ellipse cx="36" cy="54" rx="4" ry="2.5" fill="#FF8FB1" />
              <ellipse cx="64" cy="54" rx="4" ry="2.5" fill="#FF8FB1" />
              <path d="M 43,55 Q 50,62 57,55" stroke="var(--ink)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          {/* Cloud 1 (Left Upper) */}
          <div className="gate-cloud gate-cloud--1" aria-hidden="true">
            <svg viewBox="0 0 170 80" width="170" height="80">
              <path
                d="M 25,60 a 20,20 0 0,1 0,-36 a 25,25 0 0,1 38,-12 a 32,32 0 0,1 55,4 a 22,22 0 0,1 32,20 a 20,20 0 0,1 -10,26 a 25,25 0 0,1 -42,8 a 28,28 0 0,1 -48,-2 a 20,20 0 0,1 -25,-8 z"
                fill="#FFFFFF"
                stroke="var(--ink)"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <circle cx="68" cy="40" r="2.2" fill="var(--ink)" />
              <circle cx="86" cy="40" r="2.2" fill="var(--ink)" />
              <path d="M 73,47 Q 77,51 81,47" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          {/* Cloud 2 (Center High) */}
          <div className="gate-cloud gate-cloud--2" aria-hidden="true">
            <svg viewBox="0 0 140 70" width="140" height="70">
              <path
                d="M 20,52 a 18,18 0 0,1 0,-30 a 22,22 0 0,1 32,-10 a 28,28 0 0,1 46,4 a 19,19 0 0,1 28,17 a 17,17 0 0,1 -8,22 a 20,20 0 0,1 -35,6 a 24,24 0 0,1 -41,-2 a 17,17 0 0,1 -22,-7 z"
                fill="#FFFFFF"
                stroke="var(--ink)"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Cloud 3 (Right Upper) */}
          <div className="gate-cloud gate-cloud--3" aria-hidden="true">
            <svg viewBox="0 0 190 90" width="190" height="90">
              <path
                d="M 28,68 a 22,22 0 0,1 0,-40 a 28,28 0 0,1 42,-14 a 36,36 0 0,1 62,4 a 25,25 0 0,1 36,22 a 22,22 0 0,1 -12,30 a 28,28 0 0,1 -48,8 a 32,32 0 0,1 -54,-2 a 22,22 0 0,1 -26,-8 z"
                fill="#FFFFFF"
                stroke="var(--ink)"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <circle cx="80" cy="46" r="2.4" fill="var(--ink)" />
              <circle cx="102" cy="46" r="2.4" fill="var(--ink)" />
              <path d="M 86,54 Q 91,59 96,54" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        </div>

        {/* =========================================================================
            LAYER 2: Ground Meadow, Lush Grass Sides & Entrance Pathway
            ========================================================================= */}
        <div className="gate-intro-ground" aria-hidden="true">
          {/* Main lawn strip */}
          <div className="gate-ground-meadow" />

          {/* Central stone/sand pathway leading up to the gate */}
          <div className="gate-ground-path">
            <svg viewBox="0 0 400 180" width="100%" height="100%" preserveAspectRatio="none">
              {/* Perspective Walkway */}
              <polygon
                points="120,0 280,0 360,180 40,180"
                fill="#FFE7C2"
                stroke="var(--ink)"
                strokeWidth="2.5"
              />
              {/* Stepping stone / paver curves */}
              <g stroke="rgba(35, 42, 92, 0.22)" strokeWidth="2" strokeLinecap="round" fill="none">
                <path d="M 110,35 Q 200,45 290,35" />
                <path d="M 95,75 Q 200,90 305,75" />
                <path d="M 75,120 Q 200,140 325,120" />
                <path d="M 55,160 Q 200,178 345,160" />
              </g>
            </svg>
          </div>

          {/* Left Grass Tufts & Bushes */}
          <div className="gate-grass-cluster gate-grass-cluster--left">
            <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="none">
              {/* Deep green backdrop hedge */}
              <path
                d="M 0,180 L 0,80 Q 40,30 90,65 Q 140,20 190,55 Q 240,40 270,110 Q 300,140 320,180 Z"
                fill="#3D8E5F"
                stroke="var(--ink)"
                strokeWidth="2.5"
              />
              {/* Vibrant front lawn mound */}
              <path
                d="M 0,180 L 0,110 Q 50,60 110,95 Q 170,55 220,105 Q 260,85 290,140 L 290,180 Z"
                fill="#5BB381"
                stroke="var(--ink)"
                strokeWidth="2.5"
              />
              {/* Layered Grass Blades */}
              <g fill="#43A36C" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round">
                <path d="M 40,140 Q 35,90 25,75 Q 40,90 50,140 Z" />
                <path d="M 52,140 Q 60,80 75,65 Q 68,90 64,140 Z" />
                <path d="M 120,135 Q 115,85 105,70 Q 120,85 130,135 Z" />
                <path d="M 132,135 Q 142,75 160,60 Q 150,85 144,135 Z" />
                <path d="M 210,145 Q 205,95 195,80 Q 210,95 220,145 Z" />
                <path d="M 222,145 Q 232,85 248,72 Q 240,95 234,145 Z" />
              </g>
              {/* Cheerful Little Wildflowers */}
              <circle cx="85" cy="115" r="5" fill="#FFC93C" stroke="var(--ink)" strokeWidth="1.5" />
              <circle cx="165" cy="105" r="5" fill="#FF8FB1" stroke="var(--ink)" strokeWidth="1.5" />
              <circle cx="245" cy="120" r="5" fill="#5CC8FF" stroke="var(--ink)" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Right Grass Tufts & Bushes */}
          <div className="gate-grass-cluster gate-grass-cluster--right">
            <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="none">
              {/* Deep green backdrop hedge */}
              <path
                d="M 320,180 L 320,80 Q 280,30 230,65 Q 180,20 130,55 Q 80,40 50,110 Q 20,140 0,180 Z"
                fill="#3D8E5F"
                stroke="var(--ink)"
                strokeWidth="2.5"
              />
              {/* Vibrant front lawn mound */}
              <path
                d="M 320,180 L 320,110 Q 270,60 210,95 Q 150,55 100,105 Q 60,85 30,140 L 30,180 Z"
                fill="#5BB381"
                stroke="var(--ink)"
                strokeWidth="2.5"
              />
              {/* Layered Grass Blades */}
              <g fill="#43A36C" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round">
                <path d="M 280,140 Q 285,90 295,75 Q 280,90 270,140 Z" />
                <path d="M 268,140 Q 260,80 245,65 Q 252,90 256,140 Z" />
                <path d="M 200,135 Q 205,85 215,70 Q 200,85 190,135 Z" />
                <path d="M 188,135 Q 178,75 160,60 Q 170,85 176,135 Z" />
                <path d="M 110,145 Q 115,95 125,80 Q 110,95 100,145 Z" />
                <path d="M 98,145 Q 88,85 72,72 Q 80,95 86,145 Z" />
              </g>
              {/* Cheerful Little Wildflowers */}
              <circle cx="235" cy="115" r="5" fill="#FF8FB1" stroke="var(--ink)" strokeWidth="1.5" />
              <circle cx="155" cy="105" r="5" fill="#FFC93C" stroke="var(--ink)" strokeWidth="1.5" />
              <circle cx="75" cy="120" r="5" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* =========================================================================
            LAYER 3: Grounded School Gate Structure (~50vh height from screen bottom)
            Featuring modern triangular gabled top, sturdy pillars and 3D swing doors
            ========================================================================= */}
        <div className="gate-structure" onClick={(e) => e.stopPropagation()}>
          {/* Triangular Gabled Arch Roof ("Top se half triangular") */}
          <div className="gate-triangular-roof" aria-hidden="true">
            <svg viewBox="0 0 520 150" width="100%" height="100%" preserveAspectRatio="none">
              {/* Upper Pediment Triangle Body */}
              <polygon
                points="260,12 30,120 490,120"
                fill="#FFF7EA"
                stroke="var(--ink)"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Triangular Roof Fascia / Overhang Pitch */}
              <polygon
                points="260,6 18,124 38,126 260,18 482,126 502,124"
                fill="#FF7A3D"
                stroke="var(--ink)"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Decorative Apex Finial / Star Cap */}
              <polygon
                points="260,0 266,12 260,18 254,12"
                fill="#FFC93C"
                stroke="var(--ink)"
                strokeWidth="2.5"
              />

              {/* Modern Architectural King-Post Timber Truss (Inside the triangle) */}
              {/* Horizontal Lower Tie Beam */}
              <rect
                x="28"
                y="114"
                width="464"
                height="16"
                rx="2"
                fill="#FFC93C"
                stroke="var(--ink)"
                strokeWidth="3"
              />

              {/* Vertical King Post Truss in center */}
              <line x1="260" y1="20" x2="260" y2="114" stroke="var(--ink)" strokeWidth="3.5" />

              {/* Angled Left & Right Truss Braces */}
              <line x1="260" y1="55" x2="140" y2="114" stroke="var(--ink)" strokeWidth="3" />
              <line x1="260" y1="55" x2="380" y2="114" stroke="var(--ink)" strokeWidth="3" />
              <line x1="260" y1="22" x2="80" y2="114" stroke="var(--ink)" strokeWidth="2.5" />
              <line x1="260" y1="22" x2="440" y2="114" stroke="var(--ink)" strokeWidth="2.5" />

              {/* Modern Circular Sunburst Motif in Center */}
              <circle cx="260" cy="72" r="18" fill="#5CC8FF" stroke="var(--ink)" strokeWidth="3" />
              <circle cx="260" cy="72" r="8" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="2.5" />

              {/* Heavy Crossbeam / Lintel connecting the two pillars */}
              <rect
                x="20"
                y="130"
                width="480"
                height="18"
                rx="3"
                fill="#232A5C"
                stroke="var(--ink)"
                strokeWidth="3"
              />
              {/* Lintel Accent Dots */}
              <circle cx="60" cy="139" r="3" fill="#FFF7EA" />
              <circle cx="160" cy="139" r="3" fill="#FFF7EA" />
              <circle cx="260" cy="139" r="3" fill="#FFF7EA" />
              <circle cx="360" cy="139" r="3" fill="#FFF7EA" />
              <circle cx="460" cy="139" r="3" fill="#FFF7EA" />
            </svg>
          </div>

          {/* Main Door Portal Frame & Pillars */}
          <div className="gate-portal-frame">
            {/* Left Architectural Pillar */}
            <div className="gate-pillar gate-pillar--left" aria-hidden="true">
              <div className="gate-pillar-cap" />
              <div className="gate-pillar-body">
                <div className="gate-pillar-groove" />
                <div className="gate-pillar-groove" />
                <div className="gate-pillar-groove" />
                {/* Brass Gate Hinges */}
                <div className="gate-hinge gate-hinge--top" />
                <div className="gate-hinge gate-hinge--bottom" />
              </div>
              <div className="gate-pillar-base" />
            </div>

            {/* Inner View visible when doors swing open (Campus pathway & sunlit horizon) */}
            <div className="gate-portal-inner-view" aria-hidden="true">
              <div className="gate-portal-backdrop" />
              <div className="gate-portal-horizon-glow" />
              <div className="gate-portal-courtyard-path" />
              <div className="gate-portal-trees" />
            </div>

            {/* 3D Gate Doors Assembly */}
            <div className="gate-doors-assembly">
              {/* Left Gate Door */}
              <div ref={leftDoorRef} className="gate-door-leaf gate-door-leaf--left">
                <div className="gate-door-panel">
                  {/* Vertical Picketing / Slats */}
                  <div className="gate-door-slats">
                    <span className="gate-slat" />
                    <span className="gate-slat" />
                    <span className="gate-slat" />
                    <span className="gate-slat" />
                    <span className="gate-slat" />
                  </div>
                  {/* Top & Bottom Horizontal Railings */}
                  <div className="gate-door-rail gate-door-rail--top" />
                  <div className="gate-door-rail gate-door-rail--mid" />
                  <div className="gate-door-rail gate-door-rail--bottom" />
                  {/* Clean Modern Vertical Door Handle */}
                  <div className="gate-door-handle gate-door-handle--left">
                    <div className="gate-handle-mount gate-handle-mount--top" />
                    <div className="gate-handle-bar" />
                    <div className="gate-handle-mount gate-handle-mount--bottom" />
                  </div>
                </div>
              </div>

              {/* Right Gate Door */}
              <div ref={rightDoorRef} className="gate-door-leaf gate-door-leaf--right">
                <div className="gate-door-panel">
                  {/* Vertical Picketing / Slats */}
                  <div className="gate-door-slats">
                    <span className="gate-slat" />
                    <span className="gate-slat" />
                    <span className="gate-slat" />
                    <span className="gate-slat" />
                    <span className="gate-slat" />
                  </div>
                  {/* Top & Bottom Horizontal Railings */}
                  <div className="gate-door-rail gate-door-rail--top" />
                  <div className="gate-door-rail gate-door-rail--mid" />
                  <div className="gate-door-rail gate-door-rail--bottom" />
                  {/* Clean Modern Vertical Door Handle */}
                  <div className="gate-door-handle gate-door-handle--right">
                    <div className="gate-handle-mount gate-handle-mount--top" />
                    <div className="gate-handle-bar" />
                    <div className="gate-handle-mount gate-handle-mount--bottom" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Architectural Pillar */}
            <div className="gate-pillar gate-pillar--right" aria-hidden="true">
              <div className="gate-pillar-cap" />
              <div className="gate-pillar-body">
                <div className="gate-pillar-groove" />
                <div className="gate-pillar-groove" />
                <div className="gate-pillar-groove" />
                {/* Brass Gate Hinges */}
                <div className="gate-hinge gate-hinge--top" />
                <div className="gate-hinge gate-hinge--bottom" />
              </div>
              <div className="gate-pillar-base" />
            </div>
          </div>
        </div>

        {/* Subtle skip indicator */}
        <div className="gate-intro-skip-badge" onClick={finishIntro}>
          <span>Tap anywhere to enter</span>
          <kbd className="gate-kbd">Esc</kbd>
        </div>
      </div>
    </div>
  );
}
