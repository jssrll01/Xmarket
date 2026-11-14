import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { STATUS_INFO } from '../lib/booster';
import '../booster.css';

const MARKS = {
  Facebook: {
    bg: '#1877F2',
    node: <path fill="#fff" d="M13.5 22v-8.5h2.8l.5-3.5h-3.3V7.9c0-1 .3-1.7 1.8-1.7H17V3.1C16.7 3 15.8 3 14.8 3c-2.4 0-4 1.5-4 4.1V10H8v3.5h2.8V22z" />
  },
  Instagram: {
    bg: '#E1306C',
    node: (
      <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r=".6" fill="#fff" />
      </g>
    )
  },
  TikTok: {
    bg: '#111827',
    node: <path fill="#fff" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  },
  YouTube: {
    bg: '#FF0000',
    node: (
      <g>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="#fff" />
        <path d="M10 9.2v5.6l5-2.8z" fill="#FF0000" />
      </g>
    )
  }
};

export function PlatformIcon({ platform, size = 40 }) {
  const m = MARKS[platform];
  if (!m) {
    return <span className="bst-ic" style={{ background: '#2563EB', width: size, height: size }}>{String(platform || '?').slice(0, 2).toUpperCase()}</span>;
  }
  const s = Math.round(size * 0.58);
  return (
    <span className="bst-ic" style={{ background: m.bg, width: size, height: size }}>
      <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden="true" focusable="false">{m.node}</svg>
    </span>
  );
}

export function StatusBadge({ status }) {
  const s = STATUS_INFO[status] || STATUS_INFO.pending;
  return <span className="bst-badge" style={{ color: s.color, background: s.bg }}>{s.label}</span>;
}

export function QtyField({ value, onChange, min, max, step }) {
  const n = Math.floor(Number(value)) || 0;
  const set = (v) => onChange(String(Math.min(max, Math.max(min, v))));
  return (
    <div className="bst-qty">
      <button type="button" aria-label="Less" onClick={() => set((n || min) - step)}><Minus size={16} /></button>
      <input inputMode="numeric" aria-label="Quantity" value={value} onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 9))} />
      <button type="button" aria-label="More" onClick={() => set((n || min) + step)}><Plus size={16} /></button>
    </div>
  );
}
