import React, { useEffect, useState } from 'react';
import { getDiscountTiers, unitDiscount } from '../lib/discounts';
import { priceRange } from '../lib/variants';

const peso = (n) => '₱' + Number(n).toLocaleString('en-PH', { maximumFractionDigits: 2 });

export function useTiers() {
  const [tiers, setTiers] = useState(null);
  useEffect(() => { let a = true; getDiscountTiers().then(t => { if (a) setTiers(t); }); return () => { a = false; }; }, []);
  return tiers;
}

export function discountInfo(list, tiers) {
  const d = unitDiscount(list, tiers);
  const final = Math.round((list - d) * 100) / 100;
  const pct = list > 0 ? Math.round((d / list) * 1000) / 10 : 0;
  return { list, d, final, pct };
}

export default function PriceTag({ product, price, big }) {
  const tiers = useTiers();
  const r = priceRange(product);
  const lo = price != null ? Number(price) : r.min;
  const hi = price != null ? Number(price) : r.max;
  const fs = big ? 26 : 15;
  if (!tiers || !lo) return <span style={{ fontWeight: 800, fontSize: fs }}>{price != null ? peso(price) : r.display}</span>;
  const a = discountInfo(lo, tiers), b = discountInfo(hi, tiers);
  const range = a.final !== b.final;
  const pct = Math.max(a.pct, b.pct);
  const shown = range ? `${peso(a.final)}–${peso(b.final)}` : peso(a.final);
  return (
    <>
      <span style={{ fontWeight: 800, fontSize: fs }}>{shown}</span>
      {a.d > 0 && !range && <span style={{ fontSize: big ? 15 : 11, color: 'var(--muted)', textDecoration: 'line-through' }}>{peso(a.list)}</span>}
      {pct > 0 && <span style={{ fontSize: big ? 12 : 10, fontWeight: 800, color: '#fff', background: '#EF4444', borderRadius: 6, padding: '2px 6px' }}>
        {range ? 'Up to ' : ''}-{pct}%</span>}
    </>
  );
}
