import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SmartImage from './SmartImage';
import { priceRange } from '../lib/variants';
import { isOutOfStock } from '../lib/stock';

export default function YouMayAlsoLike({ excludeIds = [], title = 'You may also like', limit = 6 }) {
  const [items, setItems] = useState([]);
  const key = excludeIds.map(String).join(',');

  useEffect(() => {
    let alive = true;
    supabase
      .from('products')
      .select('id, legacy_id, name, images, store, variant_config, variant_prices, variant_stock')
      .limit(40)
      .then(({ data }) => {
        if (!alive) return;
        const ex = new Set(key ? key.split(',') : []);
        const pool = (data || []).filter(p => !ex.has(String(p.id)) && !isOutOfStock(p));
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        setItems(pool.slice(0, limit));
      });
    return () => { alive = false; };
  }, [key, limit]);

  if (!items.length) return null;

  return (
    <div style={{ marginTop: 28 }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {items.map(p => (
          <Link key={p.id} to={`/product/${p.legacy_id || p.id}`} className="card" style={{ padding: 0, textDecoration: 'none', color: 'inherit' }}>
            <div className="product-thumb">
              <SmartImage src={p.images?.[0]} alt={p.name} />
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35, marginBottom: 4 }}>{p.name}</div>
              {p.store && <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{p.store}</div>}
              <div style={{ fontWeight: 800, fontSize: 15 }}>{priceRange(p).display}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
