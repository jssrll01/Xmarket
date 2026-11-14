import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { STATUS_INFO, platformStyle } from '../lib/booster';
import '../booster.css';

export function PlatformIcon({ platform, size = 40 }) {
  const p = platformStyle(platform);
  return <span className="bst-ic" style={{ background: p.bg, width: size, height: size }}>{p.glyph}</span>;
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
