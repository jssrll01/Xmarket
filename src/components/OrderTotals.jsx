import React from 'react';
import { safeFixed } from '../lib/format';
import { discountPercent, itemDiscount } from '../lib/discount';

const row = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  fontSize: 14,
  padding: '3px 0',
};

const m = (v) => '₱' + safeFixed(v);

const hr = (
  <hr
    style={{
      margin: '8px 0',
      border: 'none',
      borderTop: '1px solid var(--border)',
    }}
  />
);

export default function OrderTotals({
  items = [],
  showItems = false,
  subtotal = 0,
  productDiscount = 0,
  promoDiscount = 0,
  xcardDiscount = 0,
  shipping = 0,
  total = 0,
  discountTiers = [],
}) {
  const totalDiscount = productDiscount + promoDiscount + xcardDiscount;

  const lines = items
    .map((i) => ({
      i,
      pct: discountPercent(i.price, discountTiers),
      amt: itemDiscount(i.price, i.quantity, discountTiers),
    }))
    .filter((x) => x.amt > 0);

  return (
    <div>
      {showItems &&
        items.map((i, n) => (
          <div
            key={i.rowId || i.id || n}
            style={{ ...row, fontSize: 13 }}
          >
            <span>{i.name} × {i.quantity}</span>
            <span>{m((Number(i.price) || 0) * (Number(i.quantity) || 1))}</span>
          </div>
        ))}

      {showItems && hr}

      <div style={row}>
        <span>Subtotal</span>
        <span>{m(subtotal)}</span>
      </div>

      <div style={{ ...row, padding: '8px 0' }}>
        <span>Shipping Fee</span>
        {shipping === null ? (
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
            Set by courier
          </span>
        ) : shipping === 0 ? (
          <span>FREE</span>
        ) : (
          <span>{m(shipping)}</span>
        )}
      </div>

      {totalDiscount > 0 && (
        <>
          {hr}

          {lines.map(({ i, pct, amt }, n) => (
            <div
              key={i.rowId || i.id || n}
              style={{ ...row, fontSize: 13, color: '#059669' }}
            >
              <span>{i.name} · {pct}% off</span>
              <span style={{ whiteSpace: 'nowrap' }}>-{m(amt)}</span>
            </div>
          ))}

          {promoDiscount > 0 && (
            <div style={{ ...row, fontSize: 13, color: '#059669' }}>
              <span>Promo Code Discount</span>
              <span>-{m(promoDiscount)}</span>
            </div>
          )}

          {xcardDiscount > 0 && (
            <div style={{ ...row, fontSize: 13, color: '#059669' }}>
              <span>XCard Discount</span>
              <span>-{m(xcardDiscount)}</span>
            </div>
          )}

          <div
            style={{
              ...row,
              fontWeight: 700,
              color: '#059669',
              padding: '6px 0',
            }}
          >
            <span>Total Discount</span>
            <span>-{m(totalDiscount)}</span>
          </div>
        </>
      )}

      {hr}

      <div style={{ ...row, fontWeight: 800, fontSize: 18 }}>
        <span>Total</span>
        <span>{m(total)}</span>
      </div>

      {totalDiscount > 0 && (
        <div
          style={{
            textAlign: 'right',
            fontSize: 12,
            fontWeight: 700,
            color: '#059669',
          }}
        >
          You save {m(totalDiscount)}
        </div>
      )}
    </div>
  );
}
