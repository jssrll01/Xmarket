import React from 'react';
import { discountPercent } from '../lib/discount';
export default function DiscountTag({ price, style }) {
  const pct = discountPercent(price);
  if (!pct) return null;
  return <span style={{ display: 'inline-block', background: '#DC2626', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '2px 6px', borderRadius: 6, lineHeight: 1.3, whiteSpace: 'nowrap', ...style }}>-{pct}%</span>;
}
