import React from 'react';

const wrap = (children) => function Icon({ size = 24, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children(color)}
    </svg>
  );
};

export const WheelIcon = wrap((c) => (
  <>
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" />
    <path d="M12 3v7M12 14v7M3 12h7M14 12h7M5.6 5.6l5 5M13.4 13.4l5 5M18.4 5.6l-5 5M10.6 13.4l-5 5" />
    <path d="M12 1.2l-1.7 2.6h3.4z" fill={c} />
  </>
));

export const BoxIcon = wrap(() => (
  <>
    <rect x="3" y="8" width="18" height="4" rx="1" /><rect x="4" y="12" width="16" height="9" rx="1" />
    <path d="M12 8v13" />
    <path d="M12 8c-2-4-6-3-5-1s5 1 5 1M12 8c2-4 6-3 5-1s-5 1-5 1" />
  </>
));

export const CoinIcon = wrap(() => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6.5v11M9.5 9.5c0-1 1-1.6 2.5-1.6s2.5.6 2.5 1.6-1 1.4-2.5 1.8-2.5.8-2.5 1.8 1 1.5 2.5 1.5 2.5-.6 2.5-1.5" />
  </>
));

export const PaletteIcon = wrap((c) => (
  <>
    <path d="M12 3a9 9 0 100 18c1.4 0 2-1 1.6-2-.5-1.2.3-2.5 1.7-2.5H17a4 4 0 004-4c0-5-4-9.5-9-9.5z" />
    <circle cx="7.5" cy="11" r="1" fill={c} /><circle cx="10" cy="7" r="1" fill={c} />
    <circle cx="14.5" cy="7" r="1" fill={c} /><circle cx="17" cy="10.5" r="1" fill={c} />
  </>
));

export const HiLoIcon = wrap(() => (
  <>
    <path d="M7 11V4M4 7l3-3 3 3" /><path d="M17 13v7M14 17l3 3 3-3" />
  </>
));

export const CardsIcon = wrap((c) => (
  <>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M12 16.5s-4-2.4-4-5a2.2 2.2 0 014-1.2 2.2 2.2 0 014 1.2c0 2.6-4 5-4 5z" fill={c} />
  </>
));
