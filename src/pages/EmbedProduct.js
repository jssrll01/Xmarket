import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { imgUrl } from '../lib/img';
import AnchorPrice from '../components/AnchorPrice';

const COLS = 'id,name,store,images,sold,variant_prices';
const minPrice = (vp) => { const v = Object.values(vp || {}).map(Number).filter((n) => n > 0); return v.length ? Math.min(...v) : 0; };

// Shown inside an <iframe> on other websites. Covers the app shell so only the card is visible.
export default function EmbedProduct() {
  const { id } = useParams();
  const [p, setP] = useState(undefined);

  useEffect(() => {
    let alive = true;
    (async () => {
      let r = await supabase.from('products').select(COLS + ',compare_at_price').eq('id', id).maybeSingle();
      if (r.error) r = await supabase.from('products').select(COLS).eq('id', id).maybeSingle();
      if (alive) setP(r.data || null);
    })();
    return () => { alive = false; };
  }, [id]);

  const href = window.location.origin + '/product/' + id;
  const wrap = { position: 'fixed', inset: 0, zIndex: 2147483000, background: '#fff', overflow: 'auto', padding: 10, boxSizing: 'border-box', fontFamily: 'inherit' };

  if (p === undefined) return <div style={wrap}><div className="sk" style={{ borderRadius: 14, height: '100%', minHeight: 260 }} /></div>;
  if (p === null) return <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: 14 }}>This product is not available.</div>;

  return (
    <div style={wrap}>
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: 'inherit', textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ aspectRatio: '1 / 1', background: '#EEF1F6' }}>
          {p.images && p.images[0] && <img src={imgUrl(p.images[0], 600)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
        </div>
        <div style={{ padding: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, maxHeight: 38, overflow: 'hidden' }}>{p.name}</div>
          <div style={{ marginTop: 8 }}><AnchorPrice price={minPrice(p.variant_prices)} compareAt={p.compare_at_price} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', marginTop: 6 }}>
            <span>{p.store}</span><span>{p.sold || 0} sold</span>
          </div>
        </div>
      </a>
      <a href={href} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: 10, padding: '11px 0', textDecoration: 'none' }}>View on XMARKET</a>
    </div>
  );
}
