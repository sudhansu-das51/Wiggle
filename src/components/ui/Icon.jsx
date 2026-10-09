import React from 'react';

/**
 * Named inline SVG doodle icons with thick ink strokes and friendly rounded caps.
 * @param {{ name: string, size?: number, color?: string, className?: string, title?: string }} props
 */
export function Icon({ name, size = 24, color = 'currentColor', className = '', title }) {
  const iconPaths = {
    sun: (
      <>
        <circle cx="12" cy="12" r="5" fill="var(--sunny)" stroke={color} strokeWidth="2.2" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      </>
    ),
    cloud: (
      <path
        d="M17.5 19H7a4.5 4.5 0 0 1-.8-8.93 5.5 5.5 0 0 1 10.4-1.87A4 4 0 0 1 20 15a4 4 0 0 1-2.5 4z"
        fill="var(--tint-sky)"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    star: (
      <path
        d="M12 2l2.8 6.5 7 .6-5.2 4.6 1.5 6.9-6.1-3.6-6.1 3.6 1.5-6.9L2.2 9.1l7-.6L12 2z"
        fill="var(--sunny)"
        stroke={color}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    ),
    heart: (
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="var(--bubblegum)"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    rocket: (
      <>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3M9 12a14.5 14.5 0 0 1 6.5-7.5C18.5 3 20 4 20 4s1 1.5-.5 4.5A14.5 14.5 0 0 1 12 15z" fill="var(--tint-yellow)" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="15.5" cy="8.5" r="1.5" fill={color} />
      </>
    ),
    book: (
      <>
        <path
          d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z"
          fill="var(--tint-mint)"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="8" y1="8" x2="16" y2="8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="8" y1="12" x2="14" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    palette: (
      <>
        <path d="M12 2C6.48 2 2 6.48 2 12c0 3.31 2.69 6 6 6h1.5a1.5 1.5 0 0 0 1.5-1.5c0-.41-.17-.79-.44-1.06-.28-.27-.44-.65-.44-1.06 0-.83.67-1.5 1.5-1.5H14c4.42 0 8-3.58 8-8 0-4.42-4.42-4.88-10-4.88z" fill="var(--tint-pink)" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6.5" cy="8.5" r="1.5" fill="var(--tangerine)" />
        <circle cx="11.5" cy="6.5" r="1.5" fill="var(--sunny)" />
        <circle cx="16.5" cy="8.5" r="1.5" fill="var(--sky)" />
      </>
    ),
    music: (
      <path
        d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
        fill="var(--tint-yellow)"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    shield: (
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        fill="var(--tint-mint)"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    bus: (
      <>
        <rect x="3" y="5" width="18" height="13" rx="3" fill="var(--sunny)" stroke={color} strokeWidth="2.2" />
        <path d="M3 11h18M7 5v6M12 5v6M17 5v6" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="7" cy="18" r="2.5" fill="var(--ink)" stroke={color} strokeWidth="1.5" />
        <circle cx="17" cy="18" r="2.5" fill="var(--ink)" stroke={color} strokeWidth="1.5" />
      </>
    ),
    train: (
      <>
        <rect x="4" y="3" width="16" height="15" rx="3" fill="var(--sky)" stroke={color} strokeWidth="2.2" />
        <circle cx="8" cy="18" r="2.5" fill="var(--ink)" stroke={color} strokeWidth="1.5" />
        <circle cx="16" cy="18" r="2.5" fill="var(--ink)" stroke={color} strokeWidth="1.5" />
        <path d="M4 11h16M8 6h8M2 21h20" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      </>
    ),
    apple: (
      <>
        <path
          d="M12 6.5C10 4.8 6.5 4.5 4.5 7.5C2.5 10.8 3.5 16.5 7 19.8C8.8 21.2 10.5 21 12 20.2C13.5 21 15.2 21.2 17 19.8C20.5 16.5 21.5 10.8 19.5 7.5C17.5 4.5 14 4.8 12 6.5Z"
          fill="var(--tangerine)"
          stroke={color}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M12 6.5C12 4 13 2.5 14.8 2"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M13.5 4C15 2.5 18 2.5 18.5 4C18.5 5.5 16 6.5 13.5 4Z"
          fill="var(--meadow)"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </>
    ),
    leaf: (
      <path
        d="M20 3s-9 0-14 6c-4.5 5.5-2 11 2 12 6.5 1.5 12-4 12-18zm-2 2c-3 5-7 9-12 12"
        fill="var(--meadow)"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    camera: (
      <>
        <path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" fill="var(--tint-pink)" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3.5" fill="var(--paper)" stroke={color} strokeWidth="2.2" />
      </>
    ),
    phone: (
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" fill="var(--tint-yellow)" stroke={color} strokeWidth="2.2" />
        <path d="M3 7l9 6 9-6" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    pin: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="var(--bubblegum)" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="3" fill="var(--paper)" stroke={color} strokeWidth="2" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" fill="var(--paper)" stroke={color} strokeWidth="2.2" />
        <polyline points="12 7 12 12 15 15" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    ),
    whatsapp: (
      <path
        d="M7.25361 18.4944L7.97834 18.917C9.18909 19.623 10.5651 20 12.001 20C16.4193 20 20.001 16.4183 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 13.4363 4.37821 14.8128 5.08466 16.0238L5.50704 16.7478L4.85355 19.1494L7.25361 18.4944ZM2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22ZM8.39232 7.30833C8.5262 7.29892 8.66053 7.29748 8.79459 7.30402C8.84875 7.30758 8.90265 7.31384 8.95659 7.32007C9.11585 7.33846 9.29098 7.43545 9.34986 7.56894C9.64818 8.24536 9.93764 8.92565 10.2182 9.60963C10.2801 9.76062 10.2428 9.95633 10.125 10.1457C10.0652 10.2428 9.97128 10.379 9.86248 10.5183C9.74939 10.663 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.40738 11.0473 9.44455 11.1944C9.45903 11.25 9.50521 11.331 9.54708 11.3991C9.57027 11.4368 9.5918 11.4705 9.60577 11.4938C9.86169 11.9211 10.2057 12.3543 10.6259 12.7616C10.7463 12.8783 10.8631 12.9974 10.9887 13.108C11.457 13.5209 11.9868 13.8583 12.559 14.1082L12.5641 14.1105C12.6486 14.1469 12.692 14.1668 12.8157 14.2193C12.8781 14.2457 12.9419 14.2685 13.0074 14.2858C13.0311 14.292 13.0554 14.2955 13.0798 14.2972C13.2415 14.3069 13.335 14.2032 13.3749 14.1555C14.0984 13.279 14.1646 13.2218 14.1696 13.2222V13.2238C14.2647 13.1236 14.4142 13.0888 14.5476 13.097C14.6085 13.1007 14.6691 13.1124 14.7245 13.1377C15.2563 13.3803 16.1258 13.7587 16.1258 13.7587L16.7073 14.0201C16.8047 14.0671 16.8936 14.1778 16.8979 14.2854C16.9005 14.3523 16.9077 14.4603 16.8838 14.6579C16.8525 14.9166 16.7738 15.2281 16.6956 15.3913C16.6406 15.5058 16.5694 15.6074 16.4866 15.6934C16.3743 15.81 16.2909 15.8808 16.1559 15.9814C16.0737 16.0426 16.0311 16.0714 16.0311 16.0714C15.8922 16.159 15.8139 16.2028 15.6484 16.2909C15.391 16.428 15.1066 16.5068 14.8153 16.5218C14.6296 16.5313 14.4444 16.5447 14.2589 16.5347C14.2507 16.5342 13.6907 16.4482 13.6907 16.4482C12.2688 16.0742 10.9538 15.3736 9.85034 14.402C9.62473 14.2034 9.4155 13.9885 9.20194 13.7759C8.31288 12.8908 7.63982 11.9364 7.23169 11.0336C7.03043 10.5884 6.90299 10.1116 6.90098 9.62098C6.89729 9.01405 7.09599 8.4232 7.46569 7.94186C7.53857 7.84697 7.60774 7.74855 7.72709 7.63586C7.85348 7.51651 7.93392 7.45244 8.02057 7.40811C8.13607 7.34902 8.26293 7.31742 8.39232 7.30833Z"
        fill={color}
      />
    ),
    instagram: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" fill="var(--tint-pink)" stroke={color} strokeWidth="2.2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke={color} strokeWidth="2.2" />
        <circle cx="17.5" cy="6.5" r="1.2" fill={color} />
      </>
    ),
    facebook: (
      <path
        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
        fill="var(--tint-sky)"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    youtube: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="4" fill="var(--bubblegum)" stroke={color} strokeWidth="2.2" />
        <polygon points="10 9 15 12 10 15" fill={color} />
      </>
    ),
    'chevron-left': (
      <polyline points="15 18 9 12 15 6" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
    'chevron-right': (
      <polyline points="9 18 15 12 9 6" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
    plus: (
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    ),
    minus: (
      <path d="M5 12h14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    ),
    close: (
      <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    ),
    menu: (
      <path d="M4 6h16M4 12h16M4 18h16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    ),
    check: (
      <polyline points="20 6 9 17 4 12" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
    ball: (
      <>
        <circle cx="12" cy="12" r="9" fill="var(--sunny)" stroke={color} strokeWidth="2.2" />
        <path d="M5.6 5.6a12 12 0 0 1 12.8 12.8M18.4 5.6a12 12 0 0 0-12.8 12.8" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      </>
    ),
    blocks: (
      <>
        <rect x="3" y="11" width="8" height="8" rx="1.5" fill="var(--sky)" stroke={color} strokeWidth="2" />
        <rect x="13" y="11" width="8" height="8" rx="1.5" fill="var(--bubblegum)" stroke={color} strokeWidth="2" />
        <rect x="8" y="3" width="8" height="8" rx="1.5" fill="var(--sunny)" stroke={color} strokeWidth="2" />
      </>
    ),
    pencil: (
      <path
        d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
        fill="var(--tint-yellow)"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    smile: (
      <>
        <circle cx="12" cy="12" r="9" fill="var(--sunny)" stroke={color} strokeWidth="2.2" />
        <circle cx="9" cy="10" r="1.2" fill={color} />
        <circle cx="15" cy="10" r="1.2" fill={color} />
        <path d="M8 14s1.5 2.5 4 2.5 4-2.5 4-2.5" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      </>
    ),
    key: (
      <path
        d="M21 2l-7 7m0 0l-2-2m2 2l-1 1m-2-2l-1 1M8 10a5 5 0 1 0 7 7 5 5 0 0 0-7-7z"
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    home: (
      <>
        <path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" fill="var(--tint-yellow)" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M9 22V12h6v10" fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
      </>
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="var(--tint-mint)" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" fill="var(--sunny)" stroke={color} strokeWidth="2.2" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="3" fill="#FFE3EC" stroke={color} strokeWidth="2.2" />
        <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      </>
    ),
  };

  const selectedPath = iconPaths[name] || iconPaths['star'];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={`wiggle-icon wiggle-icon--${name} ${className}`}
      aria-hidden={!title}
      role={title ? 'img' : 'presentation'}
    >
      {title && <title>{title}</title>}
      {selectedPath}
    </svg>
  );
}
