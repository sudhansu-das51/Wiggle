import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { whyUs } from '../../data/whyUs';
import { siteConfig } from '../../config/siteConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionHeading } from '../ui/SectionHeading';
import './home.css';

/**
 * Section 2: Bus Road Scene (Signature Animation).
 * Fully grounded storybook landscape with rolling hills, grounded trees and cottages,
 * complete puffy clouds, and a school bus with spinning wheels rolling on the asphalt.
 */
export function BusScene() {
  const sectionRef = useRef(null);
  const busRef = useRef(null);
  const wheelsRef = useRef([]);
  const gateLeftRef = useRef(null);
  const gateRightRef = useRef(null);
  const signsRef = useRef([]);
  const cloudsRef = useRef(null);
  const hillsRef = useRef(null);
  const midgroundRef = useRef(null);

  const reducedMotion = useReducedMotion();
  const busAnimationEnabled = siteConfig?.animations?.bus !== false;
  const signsData = whyUs.slice(0, 4);

  useGSAP(() => {
    if (reducedMotion || !busAnimationEnabled || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    // Desktop: Pin scene and scrub bus across road with parallax and roadside sign pops
    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Bus travels across road from left to the school gate
      tl.fromTo(
        busRef.current,
        { x: '-15vw' },
        { x: '70vw', ease: 'none', duration: 10 }
      );

      // Wheels spin around their center
      tl.to(
        wheelsRef.current,
        {
          rotation: 1440,
          transformOrigin: 'center center',
          ease: 'none',
          duration: 10,
        },
        0
      );

      // Parallax layers
      if (cloudsRef.current) {
        tl.to(cloudsRef.current, { x: '-8%', ease: 'none', duration: 10 }, 0);
      }
      if (hillsRef.current) {
        tl.to(hillsRef.current, { x: '-4%', ease: 'none', duration: 10 }, 0);
      }
      if (midgroundRef.current) {
        tl.to(midgroundRef.current, { x: '-2%', ease: 'none', duration: 10 }, 0);
      }

      // Pop roadside signs sequentially as bus passes each one
      signsRef.current.forEach((sign, idx) => {
        if (!sign) return;
        const popTime = 1.6 + idx * 1.8;
        tl.fromTo(
          sign,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' },
          popTime
        );
      });

      // Open school gate doors as bus arrives
      if (gateLeftRef.current && gateRightRef.current) {
        tl.to(gateLeftRef.current, { rotateY: -85, duration: 1.2, ease: 'power2.out' }, 7.8);
        tl.to(gateRightRef.current, { rotateY: 85, duration: 1.2, ease: 'power2.out' }, 7.8);
      }
    });

    // Mobile: Continuous looping bus with spinning wheels without pin
    mm.add('(max-width: 1023px)', () => {
      gsap.fromTo(
        busRef.current,
        { x: '-220px' },
        {
          x: '105vw',
          duration: 8,
          ease: 'none',
          repeat: -1,
        }
      );
      gsap.to(wheelsRef.current, {
        rotation: 720,
        transformOrigin: 'center center',
        duration: 8,
        ease: 'none',
        repeat: -1,
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion, busAnimationEnabled] });

  return (
    <section ref={sectionRef} className="bus-section" aria-label="School bus transport">
      <div className="container">
        <SectionHeading
          title="A safe ride, door to door"
          note="Our buses have trained attendants and every child is counted on and off."
          align="center"
          wiggle
        />
      </div>

      <div className="bus-stage" aria-hidden="true">
        {/* =========================================================================
            LAYER 1: Sky, Sun & Complete Fluffy Clouds
            ========================================================================= */}
        <div ref={cloudsRef} className="bus-layer bus-layer--sky">
          <svg viewBox="0 0 1440 380" width="100%" height="100%" preserveAspectRatio="none">
            {/* Smiling Sun */}
            <g transform="translate(120, 60)">
              {/* Sun rays */}
              <g stroke="var(--ink)" strokeWidth="3" strokeLinecap="round">
                <line x1="0" y1="-32" x2="0" y2="-42" />
                <line x1="22" y1="-22" x2="30" y2="-30" />
                <line x1="32" y1="0" x2="42" y2="0" />
                <line x1="22" y1="22" x2="30" y2="30" />
                <line x1="0" y1="32" x2="0" y2="42" />
                <line x1="-22" y1="22" x2="-30" y2="30" />
                <line x1="-32" y1="0" x2="-42" y2="0" />
                <line x1="-22" y1="-22" x2="-30" y2="-30" />
              </g>
              <circle r="24" fill="#FFC93C" stroke="var(--ink)" strokeWidth="3" />
              <circle cx="-7" cy="-3" r="2.5" fill="var(--ink)" />
              <circle cx="7" cy="-3" r="2.5" fill="var(--ink)" />
              <ellipse cx="-12" cy="4" rx="3.5" ry="2" fill="#FF8FB1" />
              <ellipse cx="12" cy="4" rx="3.5" ry="2" fill="#FF8FB1" />
              <path d="M -6,5 Q 0,11 6,5" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>

            {/* Cloud 1 (Full, complete puffy lobes) */}
            <g transform="translate(240, 30)">
              <path
                d="M 25,60 a 20,20 0 0,1 0,-36 a 25,25 0 0,1 38,-12 a 32,32 0 0,1 55,4 a 22,22 0 0,1 32,20 a 20,20 0 0,1 -10,26 a 25,25 0 0,1 -42,8 a 28,28 0 0,1 -48,-2 a 20,20 0 0,1 -25,-8 z"
                fill="#FFFFFF"
                stroke="var(--ink)"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle cx="68" cy="40" r="2" fill="var(--ink)" />
              <circle cx="86" cy="40" r="2" fill="var(--ink)" />
              <path d="M 73,47 Q 77,51 81,47" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>

            {/* Cloud 2 */}
            <g transform="translate(680, 25)">
              <path
                d="M 20,55 a 18,18 0 0,1 0,-32 a 24,24 0 0,1 35,-10 a 30,30 0 0,1 50,4 a 20,20 0 0,1 30,18 a 18,18 0 0,1 -8,24 a 22,22 0 0,1 -38,7 a 26,26 0 0,1 -44,-2 a 18,18 0 0,1 -25,-9 z"
                fill="#FFFFFF"
                stroke="var(--ink)"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </g>

            {/* Cloud 3 */}
            <g transform="translate(1080, 40)">
              <path
                d="M 25,60 a 20,20 0 0,1 0,-36 a 25,25 0 0,1 38,-12 a 32,32 0 0,1 55,4 a 22,22 0 0,1 32,20 a 20,20 0 0,1 -10,26 a 25,25 0 0,1 -42,8 a 28,28 0 0,1 -48,-2 a 20,20 0 0,1 -25,-8 z"
                fill="#FFFFFF"
                stroke="var(--ink)"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle cx="68" cy="40" r="2" fill="var(--ink)" />
              <circle cx="86" cy="40" r="2" fill="var(--ink)" />
              <path d="M 73,47 Q 77,51 81,47" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>

        {/* =========================================================================
            LAYER 2: Rolling Distant Hills
            ========================================================================= */}
        <div ref={hillsRef} className="bus-layer bus-layer--hills">
          <svg viewBox="0 0 1440 380" width="100%" height="100%" preserveAspectRatio="none">
            {/* Distant soft green rolling hills */}
            <path
              d="M 0,285 Q 220,180 500,240 T 1000,210 Q 1240,190 1440,250 L 1440,295 L 0,295 Z"
              fill="#DDF5E8"
              stroke="var(--ink)"
              strokeWidth="2"
            />
            {/* Nearer rolling hills */}
            <path
              d="M 0,290 Q 340,220 720,260 T 1440,240 L 1440,295 L 0,295 Z"
              fill="#BEECCE"
              stroke="var(--ink)"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        {/* =========================================================================
            LAYER 3: Grounded Scenery (Trees, Cottages & Flowers rooted at Y=295)
            ========================================================================= */}
        <div ref={midgroundRef} className="bus-layer bus-layer--ground">
          <svg viewBox="0 0 1440 380" width="100%" height="100%" preserveAspectRatio="none">
            {/* --- Ground Grass Horizon Base --- */}
            <rect x="0" y="285" width="1440" height="15" fill="#2FA36B" />

            {/* --- TREE 1 (Rooted at x=80, y=295) --- */}
            <g transform="translate(80, 0)">
              {/* Trunk */}
              <rect x="-8" y="200" width="16" height="95" rx="3" fill="#232A5C" />
              {/* Grass mound base */}
              <path d="M -28,295 Q 0,282 28,295 Z" fill="#2FA36B" stroke="var(--ink)" strokeWidth="2.5" />
              {/* Crown */}
              <circle cx="0" cy="180" r="44" fill="#2FA36B" stroke="var(--ink)" strokeWidth="3" />
              <circle cx="-12" cy="170" r="8" fill="#5CC8FF" opacity="0.35" />
              <path d="M -18,165 A 25,25 0 0,1 18,155" stroke="#DDF5E8" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Little ground flowers */}
              <circle cx="-18" cy="292" r="3.5" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="1.5" />
              <circle cx="-18" cy="292" r="1.5" fill="#FFC93C" />
              <circle cx="16" cy="292" r="3.5" fill="#FF8FB1" stroke="var(--ink)" strokeWidth="1.5" />
            </g>

            {/* --- COTTAGE 1 (Rooted at x=250, y=295) --- */}
            <g transform="translate(250, 0)">
              {/* Wall */}
              <rect x="0" y="225" width="76" height="70" rx="4" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="3" />
              {/* Chimney with smoke */}
              <rect x="52" y="180" width="14" height="26" fill="#FF7A3D" stroke="var(--ink)" strokeWidth="2.5" />
              <circle cx="59" cy="170" r="4" fill="#FFFFFF" opacity="0.8" />
              <circle cx="63" cy="160" r="6" fill="#FFFFFF" opacity="0.6" />
              {/* Roof */}
              <polygon points="-8,225 38,180 84,225" fill="#FF8FB1" stroke="var(--ink)" strokeWidth="3" />
              {/* Attic circular window */}
              <circle cx="38" cy="204" r="7" fill="#DDF1FF" stroke="var(--ink)" strokeWidth="2" />
              {/* Window */}
              <rect x="10" y="240" width="18" height="18" rx="2" fill="#DDF1FF" stroke="var(--ink)" strokeWidth="2" />
              <line x1="19" y1="240" x2="19" y2="258" stroke="var(--ink)" strokeWidth="1.5" />
              <line x1="10" y1="249" x2="28" y2="249" stroke="var(--ink)" strokeWidth="1.5" />
              {/* Door */}
              <rect x="42" y="248" width="22" height="47" rx="3" fill="#FF7A3D" stroke="var(--ink)" strokeWidth="2.5" />
              <circle cx="48" cy="272" r="2.5" fill="#FFC93C" />
              {/* Welcome mat */}
              <rect x="38" y="293" width="30" height="4" rx="2" fill="var(--ink)" />
            </g>

            {/* --- TREE 2 (Rooted at x=460, y=295) --- */}
            <g transform="translate(460, 0)">
              <rect x="-9" y="195" width="18" height="100" rx="3" fill="#232A5C" />
              <path d="M -30,295 Q 0,280 30,295 Z" fill="#2FA36B" stroke="var(--ink)" strokeWidth="2.5" />
              {/* Fluffy storybook crown */}
              <path
                d="M -35,175 a 26,26 0 0,1 36,-22 a 30,30 0 0,1 48,12 a 24,24 0 0,1 26,26 a 22,22 0 0,1 -22,24 a 26,26 0 0,1 -58,-2 a 22,22 0 0,1 -30,-38 z"
                fill="#2FA36B"
                stroke="var(--ink)"
                strokeWidth="3"
              />
              <circle cx="-12" cy="292" r="3.5" fill="#FFC93C" stroke="var(--ink)" strokeWidth="1.5" />
            </g>

            {/* --- COTTAGE 2 (Rooted at x=620, y=295) --- */}
            <g transform="translate(620, 0)">
              <rect x="0" y="235" width="68" height="60" rx="4" fill="#FFF0C2" stroke="var(--ink)" strokeWidth="3" />
              <polygon points="-6,235 34,195 74,235" fill="#5CC8FF" stroke="var(--ink)" strokeWidth="3" />
              <rect x="12" y="246" width="16" height="16" rx="2" fill="#DDF1FF" stroke="var(--ink)" strokeWidth="2" />
              <rect x="38" y="252" width="20" height="43" rx="3" fill="#2FA36B" stroke="var(--ink)" strokeWidth="2.5" />
              <circle cx="44" cy="274" r="2" fill="#FFC93C" />
              <rect x="34" y="293" width="28" height="4" rx="2" fill="var(--ink)" />
            </g>

            {/* --- TREE 3 (Rooted at x=830, y=295) --- */}
            <g transform="translate(830, 0)">
              <rect x="-8" y="210" width="16" height="85" rx="3" fill="#232A5C" />
              <path d="M -26,295 Q 0,282 26,295 Z" fill="#2FA36B" stroke="var(--ink)" strokeWidth="2.5" />
              <circle cx="0" cy="190" r="40" fill="#2FA36B" stroke="var(--ink)" strokeWidth="3" />
            </g>

            {/* --- COTTAGE 3 (Rooted at x=980, y=295) --- */}
            <g transform="translate(980, 0)">
              <rect x="0" y="230" width="72" height="65" rx="4" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="3" />
              <polygon points="-6,230 36,190 78,230" fill="#FFC93C" stroke="var(--ink)" strokeWidth="3" />
              <rect x="10" y="244" width="18" height="18" rx="2" fill="#DDF1FF" stroke="var(--ink)" strokeWidth="2" />
              <rect x="40" y="250" width="20" height="45" rx="3" fill="#FF8FB1" stroke="var(--ink)" strokeWidth="2.5" />
              <circle cx="46" cy="273" r="2" fill="var(--ink)" />
            </g>

            {/* --- TREE 4 (Rooted at x=1180, y=295) --- */}
            <g transform="translate(1180, 0)">
              <rect x="-8" y="205" width="16" height="90" rx="3" fill="#232A5C" />
              <path d="M -26,295 Q 0,282 26,295 Z" fill="#2FA36B" stroke="var(--ink)" strokeWidth="2.5" />
              <circle cx="0" cy="185" r="42" fill="#2FA36B" stroke="var(--ink)" strokeWidth="3" />
            </g>
          </svg>
        </div>

        {/* =========================================================================
            LAYER 4: Roadside Signs (Firmly Planted at Ground Line Y=295)
            ========================================================================= */}
        <div className="bus-road-signs" aria-hidden="true">
          {signsData.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => { signsRef.current[idx] = el; }}
              className="bus-sign-item"
            >
              <div className="bus-sign-card">{item.short}</div>
              <div className="bus-sign-post" />
              <div className="bus-sign-grass-base" />
            </div>
          ))}
        </div>

        {/* =========================================================================
            LAYER 5: Road Infrastructure (Curb, Asphalt & Centerline)
            ========================================================================= */}
        <div className="bus-road-container">
          {/* Top curbstone */}
          <div className="bus-road-curb bus-road-curb--top" />
          {/* Main asphalt road lane */}
          <div className="bus-road-asphalt">
            <div className="bus-road-dash" />
          </div>
          {/* Bottom curbstone */}
          <div className="bus-road-curb bus-road-curb--bottom" />
        </div>

        {/* =========================================================================
            LAYER 6: The Wiggle School Bus (Tires grounded on asphalt lane)
            ========================================================================= */}
        <div ref={busRef} className="bus-vehicle">
          <svg viewBox="0 0 190 96" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Cartoon exhaust puffs behind bus */}
            <g opacity="0.75">
              <circle cx="-6" cy="64" r="5" fill="#FFFFFF" stroke="var(--ink)" strokeWidth="1.5" />
              <circle cx="-16" cy="60" r="7" fill="#FFFFFF" stroke="var(--ink)" strokeWidth="1.5" />
            </g>

            {/* Luggage rack on roof */}
            <rect x="36" y="8" width="76" height="5" rx="2" fill="var(--ink)" />
            <rect x="42" y="3" width="20" height="7" rx="2" fill="#FF8FB1" stroke="var(--ink)" strokeWidth="1.5" />
            <rect x="66" y="2" width="24" height="8" rx="2" fill="#5CC8FF" stroke="var(--ink)" strokeWidth="1.5" />
            <rect x="94" y="4" width="14" height="6" rx="2" fill="#2FA36B" stroke="var(--ink)" strokeWidth="1.5" />

            {/* Main bus body */}
            <rect x="10" y="14" width="158" height="58" rx="16" fill="#FFC93C" stroke="var(--ink)" strokeWidth="3.5" />

            {/* Tangerine accent stripe */}
            <rect x="10" y="42" width="158" height="14" fill="#FF7A3D" />
            <line x1="10" y1="42" x2="168" y2="42" stroke="var(--ink)" strokeWidth="2.5" />
            <line x1="10" y1="56" x2="168" y2="56" stroke="var(--ink)" strokeWidth="2.5" />

            {/* Front windshield */}
            <path
              d="M 134,20 L 156,20 C 160,20 162,23 162,26 L 162,40 L 134,40 Z"
              fill="#DDF1FF"
              stroke="var(--ink)"
              strokeWidth="2.5"
            />
            {/* Friendly Driver with cap */}
            <circle cx="146" cy="32" r="5" fill="#FF8FB1" />
            <path d="M 140,28 L 152,28" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />

            {/* Passenger Windows with Waving Kids & Mascot */}
            {/* Window 1: Wig Mascot */}
            <rect x="22" y="20" width="24" height="18" rx="4" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="2" />
            <circle cx="34" cy="30" r="6" fill="#FFC93C" stroke="var(--ink)" strokeWidth="1.5" />
            <circle cx="32" cy="29" r="1.2" fill="var(--ink)" />
            <circle cx="36" cy="29" r="1.2" fill="var(--ink)" />
            <ellipse cx="29" cy="31" rx="1.5" ry="1" fill="#FF8FB1" />
            <ellipse cx="39" cy="31" rx="1.5" ry="1" fill="#FF8FB1" />

            {/* Window 2: Toddler 1 */}
            <rect x="56" y="20" width="24" height="18" rx="4" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="2" />
            <circle cx="68" cy="30" r="6" fill="#5CC8FF" stroke="var(--ink)" strokeWidth="1.5" />
            <circle cx="66" cy="29" r="1.2" fill="var(--ink)" />
            <circle cx="70" cy="29" r="1.2" fill="var(--ink)" />

            {/* Window 3: Toddler 2 */}
            <rect x="90" y="20" width="24" height="18" rx="4" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="2" />
            <circle cx="102" cy="30" r="6" fill="#2FA36B" stroke="var(--ink)" strokeWidth="1.5" />
            <circle cx="100" cy="29" r="1.2" fill="var(--ink)" />
            <circle cx="104" cy="29" r="1.2" fill="var(--ink)" />

            {/* Front Headlight with glowing light cone */}
            <polygon points="168,50 220,40 220,64 168,54" fill="#FFF0C2" opacity="0.3" pointerEvents="none" />
            <circle cx="168" cy="52" r="4.5" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="2" />

            {/* Bottom heavy chassis bumper */}
            <rect x="6" y="65" width="168" height="8" rx="3" fill="var(--ink)" />

            {/* Wheel Arch Cutouts / Recesses in Chassis */}
            <path d="M 27,72 A 19,19 0 0,1 65,72 Z" fill="#1C2434" />
            <path d="M 27,72 A 19,19 0 0,1 65,72" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
            <path d="M 117,72 A 19,19 0 0,1 155,72 Z" fill="#1C2434" />
            <path d="M 117,72 A 19,19 0 0,1 155,72" fill="none" stroke="var(--ink)" strokeWidth="2.5" />

            {/* ===============================================================
                WHEELS: Centered local assembly so rotation spins on its exact axis
                =============================================================== */}
            {/* REAR WHEEL (Center at X=46, Y=72) */}
            <g transform="translate(46, 72)">
              <g
                ref={(el) => { wheelsRef.current[0] = el; }}
                className="bus-wheel-rim"
              >
                {/* Outer Rubber Tire */}
                <circle cx="0" cy="0" r="15" fill="#242B38" stroke="var(--ink)" strokeWidth="2.5" />
                {/* Subtle Tire Tread Rim */}
                <circle cx="0" cy="0" r="12" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
                {/* Inner Wheel Rim */}
                <circle cx="0" cy="0" r="9" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="2" />
                {/* Symmetric Rim Lug Nut Dots (0, 90, 180, 270 deg) */}
                <circle cx="0" cy="-6.5" r="1" fill="var(--ink)" />
                <circle cx="6.5" cy="0" r="1" fill="var(--ink)" />
                <circle cx="0" cy="6.5" r="1" fill="var(--ink)" />
                <circle cx="-6.5" cy="0" r="1" fill="var(--ink)" />
                {/* Concentric Sunny Hubcap */}
                <circle cx="0" cy="0" r="4.5" fill="#FFC93C" stroke="var(--ink)" strokeWidth="1.5" />
                {/* Center Axle Pin */}
                <circle cx="0" cy="0" r="1.8" fill="var(--ink)" />
              </g>
            </g>

            {/* FRONT WHEEL (Center at X=136, Y=72) */}
            <g transform="translate(136, 72)">
              <g
                ref={(el) => { wheelsRef.current[1] = el; }}
                className="bus-wheel-rim"
              >
                {/* Outer Rubber Tire */}
                <circle cx="0" cy="0" r="15" fill="#242B38" stroke="var(--ink)" strokeWidth="2.5" />
                {/* Subtle Tire Tread Rim */}
                <circle cx="0" cy="0" r="12" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
                {/* Inner Wheel Rim */}
                <circle cx="0" cy="0" r="9" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="2" />
                {/* Symmetric Rim Lug Nut Dots (0, 90, 180, 270 deg) */}
                <circle cx="0" cy="-6.5" r="1" fill="var(--ink)" />
                <circle cx="6.5" cy="0" r="1" fill="var(--ink)" />
                <circle cx="0" cy="6.5" r="1" fill="var(--ink)" />
                <circle cx="-6.5" cy="0" r="1" fill="var(--ink)" />
                {/* Concentric Sunny Hubcap */}
                <circle cx="0" cy="0" r="4.5" fill="#FFC93C" stroke="var(--ink)" strokeWidth="1.5" />
                {/* Center Axle Pin */}
                <circle cx="0" cy="0" r="1.8" fill="var(--ink)" />
              </g>
            </g>
          </svg>
        </div>

        {/* =========================================================================
            LAYER 7: Grounded Schoolhouse & Welcoming Gate (At far right)
            ========================================================================= */}
        <div className="bus-gate-finish">
          <svg viewBox="0 0 140 180" width="100%" height="100%">
            {/* School Belfry & Bell */}
            <polygon points="70,10 60,35 80,35" fill="#FF7A3D" stroke="var(--ink)" strokeWidth="2" />
            <rect x="62" y="35" width="16" height="15" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="2" />
            <circle cx="70" cy="42" r="4" fill="#FFC93C" stroke="var(--ink)" strokeWidth="1.5" />
            {/* Flagpole & W pennant */}
            <line x1="70" y1="0" x2="70" y2="10" stroke="var(--ink)" strokeWidth="2" />
            <polygon points="70,0 84,4 70,8" fill="#FFC93C" stroke="var(--ink)" strokeWidth="1.5" />

            {/* School Main Roof */}
            <polygon points="70,48 10,85 130,85" fill="#FFC93C" stroke="var(--ink)" strokeWidth="3" />
            <circle cx="70" cy="72" r="7" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="2" />

            {/* School Main Building Grounded onto Y=180 */}
            <rect x="20" y="85" width="100" height="95" fill="#FFF7EA" stroke="var(--ink)" strokeWidth="3" />
            <rect x="28" y="98" width="16" height="20" rx="2" fill="#DDF1FF" stroke="var(--ink)" strokeWidth="2" />
            <rect x="96" y="98" width="16" height="20" rx="2" fill="#DDF1FF" stroke="var(--ink)" strokeWidth="2" />

            {/* Arched School Gate Frame */}
            <path d="M 40,180 L 40,135 Q 70,120 100,135 L 100,180 Z" fill="#232A5C" />

            {/* Left Gate Door */}
            <rect
              ref={gateLeftRef}
              x="42"
              y="135"
              width="28"
              height="45"
              rx="2"
              fill="#FF8FB1"
              stroke="#FFF7EA"
              strokeWidth="2"
              style={{ transformOrigin: '42px center' }}
            />
            {/* Right Gate Door */}
            <rect
              ref={gateRightRef}
              x="70"
              y="135"
              width="28"
              height="45"
              rx="2"
              fill="#5CC8FF"
              stroke="#FFF7EA"
              strokeWidth="2"
              style={{ transformOrigin: '98px center' }}
            />
          </svg>
        </div>
      </div>

      {/* Mobile 2x2 Sign Cards */}
      <div className="container">
        <div className="bus-signs-mobile">
          {signsData.map((item) => (
            <div key={item.id} className="sticker" style={{ padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)' }}>
                {item.short}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
