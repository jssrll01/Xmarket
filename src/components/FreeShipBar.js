import React from 'react';
import { useCart } from '../CartContext';
import { money } from '../lib/currency';
import { prefsCfg } from '../lib/prefsConfig';

export default function FreeShipBar() {
  const c = useCart() || {};
  const list = c.items || c.cart || c.cartItems || c.lines || [];
  let sub = 0;
  let priced = 0;
  (Array.isArray(list) ? list : []).forEach((i) => {
    const pr = Number(i.price != null ? i.price : i.product && i.product.price != null ? i.product.price : i.sale_price);
    const q = Number(i.qty != null ? i.qty : i.quantity != null ? i.quantity : 1);
    if (Number.isFinite(pr)) { sub += pr * (Number.isFinite(q) ? q : 1); priced += 1; }
  });
  if (typeof c.subtotal === 'number') { sub = c.subtotal; priced = priced || 1; }
  const goal = prefsCfg.freeShipAt;
  if (!goal || !priced || sub <= 0) return null;
  const left = goal - sub;
  const pct = Math.min(100, Math.round((sub / goal) * 100));
  return (
    <div style={{ margin: '10px 16px', padding: '12px 14px', borderRadius: 16, background: '#fff', border: '1px solid var(--border, #E2E8F0)' }}>
      <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 8 }}>
        {left > 0 ? 'Add ' + money(left, 'fixed') + ' more for free shipping' : 'You unlocked free shipping!'}
      </div>
      <div style={{ height: 8, borderRadius: 99, background: '#EEF1F6', overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', borderRadius: 99, background: left > 0 ? '#2563EB' : '#059669', transition: 'width .5s ease' }} />
      </div>
    </div>
  );
}
