import React from 'react';
import { discountPercent } from '../lib/discount';

export default function DiscountTag({ price, style }) {
  const pct = discountPercent(price);

  if (!pct) return null;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: 12,
        fontWeight: 600,
        color: 'inherit',
        background: 'transparent',
        padding: 0,
        border: 'none',
        borderRadius: 0,
        boxShadow: 'none',
        lineHeight: 'inherit',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        ...style,
      }}
    >
      {Math.round(pct)}% OFF
    </span>
  );
}
