import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fx, S } from '../../lib/fx';
import { money } from '../../lib/currency';

const firstImage = (v) => (Array.isArray(v) ? v[0] : typeof v === 'string' ? v : '');

export default function CartUpsell({ items }) {
  const nav = useNavigate();
  const ids = [...new Set((items || []).map((i) => String(i.product_id || '')).filter(Boolean))];
  const key = ids.join(',');
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (!ids.length) { setRows([]); return undefined; }
    let a = true;
    fx('fx_upsell_for', { p_ids: ids }).then((r) => { if (a) setRows(Array.isArray(r) ? r : []); }).catch(() => { if (a) setRows([]); });
    return () => { a = false; };
    // eslint-disable-next-line
  }, [key]);
  if (!rows.length) return null;
  return (
    <div style={{ margin: '12px 0' }}>
      <div style={{ ...S.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>You might also like</div>
      {rows.map((r) => {
        const img = firstImage(r.images);
        return (
          <div key={r.product_id} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
            {img ? <img src={img} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} /> : null}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.25 }}>{r.name}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginTop: 3 }}>Add this for {money(r.offer_price, 'fixed')}</div>
            </div>
            <button type="button" onClick={() => nav('/product/' + r.product_id)} style={{ ...S.btn, padding: '9px 14px', fontSize: 13 }}>View</button>
          </div>
        );
      })}
    </div>
  );
}
