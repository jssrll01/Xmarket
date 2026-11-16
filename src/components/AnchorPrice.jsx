import React from 'react';
import { money } from '../lib/currency';

const plain = (n) => money(n, 'plain');

// Selling price, plus the old price crossed out when the product has a higher compare_at_price.
export default function AnchorPrice({ price, compareAt, size = 'normal', format }) {
  const f = format || plain;
  const p = Number(price) || 0;
  const c = Number(compareAt) || 0;
  const show = c > p && p > 0;
  const big = size !== 'small';
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 6px' }}>
      <span style={{ fontWeight: 800, fontSize: big ? 16 : 14, color: '#DC2626' }}>{f(p)}</span>
      {show && <span style={{ fontSize: big ? 12 : 11, color: 'var(--muted)', textDecoration: 'line-through' }}>{f(c)}</span>}
      {show && <span style={{ fontSize: big ? 11 : 10, fontWeight: 700, color: '#DC2626' }}>-{Math.round((1 - p / c) * 100)}%</span>}
    </div>
  );
}
