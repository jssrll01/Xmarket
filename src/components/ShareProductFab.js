import React, { useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cfg } from '../lib/searchBoostConfig';
import { nameOf } from '../lib/productIndex';
import { makeCard } from '../lib/shareCard';

export default function ShareProductFab() {
  const { pathname } = useLocation();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const m = matchPath({ path: cfg.route, end: false }, pathname);
  if (!m) return null;

  const share = async () => {
    if (busy) return;
    setBusy(true); setMsg('');
    try {
      const val = decodeURIComponent(m.params[cfg.param]);
      const col = cfg.param === 'productId' ? 'id' : cfg.param;
      let { data } = await supabase.from(cfg.table).select('*').eq(col, val).maybeSingle();
      if (!data && col !== 'id') ({ data } = await supabase.from(cfg.table).select('*').eq('id', val).maybeSingle());
      if (!data) throw new Error('missing');
      const blob = await makeCard(data);
      const f = new File([blob], 'xmarket-product.png', { type: 'image/png' });
      const text = nameOf(data) + ' - ' + window.location.href;
      if (navigator.canShare && navigator.canShare({ files: [f] })) await navigator.share({ files: [f], text, title: nameOf(data) });
      else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'xmarket-product.png'; a.click();
        setMsg('Card saved to your downloads.');
      }
    } catch (e) { if (!e || e.name !== 'AbortError') setMsg('Could not create the card.'); }
    setBusy(false);
  };

  return (
    <>
      <button type="button" onClick={share} aria-label="Share product card" style={{ position: 'fixed', right: 14, bottom: 120, zIndex: 900, width: 48, height: 48, borderRadius: '50%', background: '#fff', color: '#2563EB', border: '1px solid #E2E8F0', boxShadow: '0 6px 20px rgba(15,23,42,.18)', display: 'grid', placeItems: 'center', opacity: busy ? 0.6 : 1 }}>
        <Share2 size={20} />
      </button>
      {msg && <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: 190, zIndex: 900, background: '#0F172A', color: '#fff', padding: '9px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600 }}>{msg}</div>}
    </>
  );
}
