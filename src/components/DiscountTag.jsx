import React, { useEffect, useState } from 'react';
import { discountPercent, loadDiscountRules } from '../lib/discount';

export default function DiscountTag({ price, style }) {
  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    let alive = true;

    loadDiscountRules()
      .then((rules) => {
        if (alive) setTiers(rules);
      })
      .catch((error) => {
        console.error('Unable to load discount rules:', error);
      });

    return () => {
      alive = false;
    };
  }, []);

  const pct = discountPercent(price, tiers);

  if (!pct) return null;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: 12,
        fontWeight: 700,
        color: '#047857',
        background: 'rgba(5,150,105,0.10)',
        padding: '3px 6px',
        borderRadius: 5,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        ...style,
      }}
    >
      {Math.round(pct)}% OFF
    </span>
  );
}
