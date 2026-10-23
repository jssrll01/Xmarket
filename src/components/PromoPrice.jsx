import React, { useEffect, useState } from 'react';
import { getPromoDisplay, loadDiscountTiers } from '../lib/promo';

export default function PromoPrice({ price, currencyFormatter, size = 'normal' }) {
  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    let alive = true;

    loadDiscountTiers().then(t => {
      if (alive) setTiers(t);
    });

    return () => {
      alive = false;
    };
  }, []);

  const promo = getPromoDisplay(price, tiers);
  const format = currencyFormatter || ((p) => `₱${Number(p).toFixed(2)}`);
  const isSmall = size === 'small';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: isSmall ? 14 : 18,
            fontWeight: 800,
            color: 'var(--text)',
          }}
        >
          {format(promo.finalPrice)}
        </span>

        {promo.hasPromo ? (
          <>
            <span
              style={{
                fontSize: isSmall ? 11 : 13,
                color: 'var(--muted)',
                textDecoration: 'line-through',
              }}
            >
              {format(promo.originalPrice)}
            </span>

            <span
              style={{
                fontSize: isSmall ? 11 : 12,
                fontWeight: 600,
                color: 'inherit',
                background: 'transparent',
                padding: 0,
                border: 'none',
                borderRadius: 0,
                boxShadow: 'none',
                lineHeight: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {promo.tierRate && Math.abs(promo.discountPercent - promo.tierRate) < 0.01 ? Math.round(promo.tierRate) + '% OFF' : 'SAVE ₱' + Number(promo.discountAmount).toFixed(0)}
            </span>
          </>
        ) : (
          <span
            style={{
              fontSize: isSmall ? 10 : 11,
              fontWeight: 600,
              background: 'var(--card)',
              color: 'var(--primary)',
              padding: '2px 6px',
              borderRadius: 6,
              border: '1px solid var(--border)',
            }}
          >
            XMARKET Deal
          </span>
        )}
      </div>
    </div>
  );
}
