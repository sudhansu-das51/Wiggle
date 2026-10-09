import React from 'react';
import './PlayfulDecor.css';

/**
 * Playful SVG Element Shapes matching Wiggle's bento preschool aesthetic.
 */
function CloudSvg({ color = '#FFFFFF', size = 68 }) {
  return (
    <svg viewBox="0 0 100 52" width={size} height={size * 0.52} fill="none">
      <path
        d="M 24,46 C 10,46 4,36 6,26 C 7,16 17,14 24,16 C 28,6 40,4 50,8 C 58,2 72,4 78,14 C 88,12 96,20 95,30 C 95,42 86,46 76,46 Z"
        fill={color}
        stroke="var(--ink)"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Star5Svg({ color = 'var(--sunny)', size = 36 }) {
  return (
    <svg viewBox="0 0 50 50" width={size} height={size} fill="none">
      <path
        d="M 25,3 L 31,18 L 47,19 L 34,29 L 39,45 L 25,35 L 11,45 L 16,29 L 3,19 L 19,18 Z"
        fill={color}
        stroke="var(--ink)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleSvg({ color = 'var(--tint-mint)', size = 34 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
      <path
        d="M 24,4 Q 24,24 4,24 Q 24,24 24,44 Q 24,24 44,24 Q 24,24 24,4 Z"
        fill={color}
        stroke="var(--ink)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TwinkleSvg({ color = '#FFFFFF', size = 26 }) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none">
      <path
        d="M 18,2 L 21,15 L 34,18 L 21,21 L 18,34 L 15,21 L 2,18 L 15,15 Z"
        fill={color}
        stroke="var(--ink)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartSvg({ color = 'var(--bubblegum)', size = 32 }) {
  return (
    <svg viewBox="0 0 36 32" width={size} height={size * 0.88} fill="none">
      <path
        d="M 18,28 C 7,20 3,14 3,8 C 3,3 7,0 12,0 C 15,0 18,2 18,5 C 18,2 21,0 24,0 C 29,0 33,3 33,8 C 33,14 29,20 18,28 Z"
        fill={color}
        stroke="var(--ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BubbleSvg({ color = 'var(--tint-sky)', size = 32 }) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none">
      <circle cx="18" cy="18" r="15" fill={color} stroke="var(--ink)" strokeWidth="2.6" />
      <path
        d="M 11,10 Q 14,7 18,8"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Curated 3 to 4 playful elements customized for each page.
 */
const PAGE_ELEMENTS = {
  about: [
    { type: 'cloud', color: '#FFFFFF', size: 76, top: '15%', left: '46%', flowClass: 'playful-flow--1', delay: '0s' },
    { type: 'sparkle', color: 'var(--tint-mint)', size: 36, top: '24%', left: '68%', flowClass: 'playful-flow--2', delay: '0.8s' },
    { type: 'star5', color: 'var(--sunny)', size: 34, bottom: '22%', left: '36%', flowClass: 'playful-flow--3', delay: '1.5s' },
    { type: 'heart', color: 'var(--bubblegum)', size: 30, top: '64%', left: '80%', flowClass: 'playful-flow--4', delay: '0.4s' },
  ],
  gallery: [
    { type: 'sparkle', color: 'var(--tint-lilac)', size: 40, top: '20%', left: '45%', flowClass: 'playful-flow--3', delay: '0s' },
    { type: 'cloud', color: '#FFFFFF', size: 72, top: '26%', left: '74%', flowClass: 'playful-flow--1', delay: '1.2s' },
    { type: 'star5', color: 'var(--tangerine)', size: 32, bottom: '20%', left: '38%', flowClass: 'playful-flow--2', delay: '0.6s' },
    { type: 'twinkle', color: 'var(--sunny)', size: 28, top: '62%', left: '65%', flowClass: 'playful-flow--4', delay: '1.8s' },
  ],
  programs: [
    { type: 'cloud', color: '#FFFFFF', size: 82, top: '16%', left: '52%', flowClass: 'playful-flow--2', delay: '0.2s' },
    { type: 'star5', color: 'var(--sunny)', size: 36, top: '30%', left: '72%', flowClass: 'playful-flow--1', delay: '0.9s' },
    { type: 'sparkle', color: '#FFFFFF', size: 32, bottom: '22%', left: '35%', flowClass: 'playful-flow--3', delay: '1.4s' },
    { type: 'bubble', color: 'var(--tint-sky)', size: 32, top: '60%', left: '66%', flowClass: 'playful-flow--4', delay: '0.5s' },
  ],
  facilities: [
    { type: 'star5', color: 'var(--sunny)', size: 36, top: '20%', left: '46%', flowClass: 'playful-flow--1', delay: '0s' },
    { type: 'cloud', color: '#FFFFFF', size: 76, top: '16%', left: '70%', flowClass: 'playful-flow--2', delay: '1s' },
    { type: 'sparkle', color: 'var(--tint-mint)', size: 34, bottom: '24%', left: '36%', flowClass: 'playful-flow--4', delay: '0.7s' },
    { type: 'bubble', color: 'var(--tint-yellow)', size: 30, top: '56%', left: '80%', flowClass: 'playful-flow--3', delay: '1.6s' },
  ],
  events: [
    { type: 'star5', color: 'var(--sunny)', size: 38, top: '16%', left: '49%', flowClass: 'playful-flow--2', delay: '0.4s' },
    { type: 'cloud', color: '#FFFFFF', size: 70, top: '30%', left: '72%', flowClass: 'playful-flow--1', delay: '1.1s' },
    { type: 'sparkle', color: 'var(--bubblegum)', size: 34, bottom: '22%', left: '36%', flowClass: 'playful-flow--3', delay: '0s' },
    { type: 'twinkle', color: 'var(--sunny)', size: 28, top: '64%', left: '62%', flowClass: 'playful-flow--4', delay: '1.5s' },
  ],
  teachers: [
    { type: 'heart', color: 'var(--bubblegum)', size: 32, top: '22%', left: '46%', flowClass: 'playful-flow--4', delay: '0.2s' },
    { type: 'cloud', color: '#FFFFFF', size: 74, top: '18%', left: '74%', flowClass: 'playful-flow--1', delay: '1.3s' },
    { type: 'star5', color: 'var(--sunny)', size: 34, bottom: '24%', left: '38%', flowClass: 'playful-flow--2', delay: '0.8s' },
    { type: 'sparkle', color: 'var(--tint-mint)', size: 32, top: '58%', left: '66%', flowClass: 'playful-flow--3', delay: '1.7s' },
  ],
  contact: [
    { type: 'sparkle', color: '#FFFFFF', size: 36, top: '20%', left: '44%', flowClass: 'playful-flow--3', delay: '0s' },
    { type: 'cloud', color: '#FFFFFF', size: 72, top: '16%', left: '72%', flowClass: 'playful-flow--1', delay: '0.9s' },
    { type: 'star5', color: 'var(--sunny)', size: 32, bottom: '24%', left: '36%', flowClass: 'playful-flow--2', delay: '1.5s' },
    { type: 'bubble', color: 'var(--tint-sky)', size: 30, top: '60%', left: '78%', flowClass: 'playful-flow--4', delay: '0.6s' },
  ],
  whyUs: [
    { type: 'star5', color: 'var(--sunny)', size: 38, top: '20%', left: '50%', flowClass: 'playful-flow--1', delay: '0.3s' },
    { type: 'cloud', color: '#FFFFFF', size: 74, top: '16%', left: '74%', flowClass: 'playful-flow--2', delay: '1s' },
    { type: 'sparkle', color: 'var(--tint-sky)', size: 34, bottom: '24%', left: '36%', flowClass: 'playful-flow--3', delay: '1.6s' },
    { type: 'twinkle', color: '#FFFFFF', size: 28, top: '58%', left: '65%', flowClass: 'playful-flow--4', delay: '0.7s' },
  ],
  curriculum: [
    { type: 'star5', color: 'var(--sunny)', size: 36, top: '18%', left: '46%', flowClass: 'playful-flow--2', delay: '0.5s' },
    { type: 'cloud', color: '#FFFFFF', size: 76, top: '28%', left: '72%', flowClass: 'playful-flow--1', delay: '0s' },
    { type: 'sparkle', color: 'var(--tint-mint)', size: 34, bottom: '22%', left: '38%', flowClass: 'playful-flow--4', delay: '1.2s' },
    { type: 'bubble', color: 'var(--tint-lilac)', size: 30, top: '62%', left: '80%', flowClass: 'playful-flow--3', delay: '1.8s' },
  ],
  careers: [
    { type: 'star5', color: 'var(--sunny)', size: 38, top: '20%', left: '48%', flowClass: 'playful-flow--1', delay: '0.2s' },
    { type: 'cloud', color: '#FFFFFF', size: 74, top: '16%', left: '74%', flowClass: 'playful-flow--2', delay: '1.1s' },
    { type: 'heart', color: 'var(--bubblegum)', size: 30, bottom: '24%', left: '38%', flowClass: 'playful-flow--4', delay: '0.7s' },
    { type: 'sparkle', color: 'var(--tint-sky)', size: 32, top: '60%', left: '66%', flowClass: 'playful-flow--3', delay: '1.5s' },
  ],
  enquire: [
    { type: 'cloud', color: '#FFFFFF', size: 76, top: '18%', left: '46%', flowClass: 'playful-flow--1', delay: '0s' },
    { type: 'star5', color: 'var(--sunny)', size: 34, top: '30%', left: '70%', flowClass: 'playful-flow--2', delay: '0.9s' },
    { type: 'sparkle', color: 'var(--tint-mint)', size: 34, bottom: '22%', left: '36%', flowClass: 'playful-flow--3', delay: '1.4s' },
    { type: 'twinkle', color: 'var(--tangerine)', size: 28, top: '60%', left: '82%', flowClass: 'playful-flow--4', delay: '0.5s' },
  ],
};

function getElementsForTitle(title = '') {
  const t = title.toLowerCase();
  if (t.includes('about')) return PAGE_ELEMENTS.about;
  if (t.includes('gallery')) return PAGE_ELEMENTS.gallery;
  if (t.includes('program')) return PAGE_ELEMENTS.programs;
  if (t.includes('facilit') || t.includes('campus')) return PAGE_ELEMENTS.facilities;
  if (t.includes('event')) return PAGE_ELEMENTS.events;
  if (t.includes('teacher')) return PAGE_ELEMENTS.teachers;
  if (t.includes('contact') || t.includes('touch')) return PAGE_ELEMENTS.contact;
  if (t.includes('why')) return PAGE_ELEMENTS.whyUs;
  if (t.includes('curriculum')) return PAGE_ELEMENTS.curriculum;
  if (t.includes('career') || t.includes('team') || t.includes('join')) return PAGE_ELEMENTS.careers;
  if (t.includes('enquir') || t.includes('admission')) return PAGE_ELEMENTS.enquire;
  return PAGE_ELEMENTS.about;
}

export function PlayfulDecor({ title }) {
  const elements = getElementsForTitle(title);

  return (
    <div className="playful-decor-wrap" aria-hidden="true">
      {elements.map((item, index) => {
        const style = {
          position: 'absolute',
          top: item.top,
          left: item.left,
          right: item.right,
          bottom: item.bottom,
          animationDelay: item.delay,
        };

        return (
          <div
            key={index}
            className={`playful-decor-item ${item.flowClass}`}
            style={style}
          >
            {item.type === 'cloud' && <CloudSvg color={item.color} size={item.size} />}
            {item.type === 'star5' && <Star5Svg color={item.color} size={item.size} />}
            {item.type === 'sparkle' && <SparkleSvg color={item.color} size={item.size} />}
            {item.type === 'twinkle' && <TwinkleSvg color={item.color} size={item.size} />}
            {item.type === 'heart' && <HeartSvg color={item.color} size={item.size} />}
            {item.type === 'bubble' && <BubbleSvg color={item.color} size={item.size} />}
          </div>
        );
      })}
    </div>
  );
}
