import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { money } from '../lib/currency';
import SmartImage from './SmartImage';
import { priceRange } from '../lib/variants';

export default function MoreFromSeller({ product }) {
  const [items, setItems] = useState([]);
  const [store, setStore] = useState('');
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: me } = await supabase.from('products').select('store').eq('id', product.uuid).maybeSingle();
      const s = (me && me.store) || product.store || '';
      if (!s) return;
      const { data } = await supabase.from('products').select('*').eq('store', s).neq('id', product.uuid).limit(12);
      if (alive) { setStore(s); setItems(data || []); }
    })();
    return () => { alive = false; };
  }, [product.uuid, product.store]);
  if (!items.length) return null;
  return (
    <div style={{ padding: '12px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <b style={{ fontSize: 15 }}>More from {store.trim()}</b>
        <Link to={'/store/' + encodeURIComponent(store)} style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--primary)' }}>Visit shop \u203a</Link>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
        {items.map((p) => (
          <div key={p.id} style={{ flex: '0 0 160px' }}>
              <Link to={`/product/${p.legacy_id || p.id}`} className="card" style={{ padding: 0, textDecoration: 'none', color: 'inherit' }}>
                <div className="product-thumb">
                  <SmartImage src={(p.images && p.images[0]) || ''} alt={p.name} />
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35, marginBottom: 6 }}>{p.name}</div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{priceRange(p).display}</div>
                </div>
              </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
