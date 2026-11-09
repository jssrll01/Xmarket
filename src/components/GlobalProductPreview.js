import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { imgUrl } from '../lib/img';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const minPrice = (vp) => { const v = Object.values(vp || {}).map(Number).filter((n) => n > 0); return v.length ? Math.min(...v) : 0; };

export default function GlobalProductPreview() {
  const [p, setP] = useState(null);
  const timer = useRef(null);
  const start = useRef(null);
  const fired = useRef(false);

  useEffect(() => {
    const open = async (id) => {
      const q = supabase.from('products').select('id,name,images,description,variant_prices');
      const { data } = await (UUID.test(id) ? q.eq('id', id) : q.eq('legacy_id', id)).limit(1);
      if (data && data[0]) { if (navigator.vibrate) navigator.vibrate(15); setP(data[0]); }
    };
    const down = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="/product/"]');
      if (!a || a.closest('[data-lp]')) return;
      const id = decodeURIComponent(a.getAttribute('href').slice(9).split(/[#?]/)[0]);
      if (!id) return;
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
      fired.current = false;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { fired.current = true; open(id); }, 450);
    };
    const move = (e) => {
      const t = e.touches[0];
      if (start.current && Math.hypot(t.clientX - start.current.x, t.clientY - start.current.y) > 10) clearTimeout(timer.current);
    };
    const up = () => clearTimeout(timer.current);
    const click = (e) => { if (fired.current) { e.preventDefault(); e.stopPropagation(); fired.current = false; } };
    const ctx = (e) => { if (e.target.closest && e.target.closest('a[href^="/product/"]')) e.preventDefault(); };
    document.addEventListener('touchstart', down, { passive: true });
    document.addEventListener('touchmove', move, { passive: true });
    document.addEventListener('touchend', up);
    document.addEventListener('touchcancel', up);
    document.addEventListener('click', click, true);
    document.addEventListener('contextmenu', ctx);
    return () => {
      clearTimeout(timer.current);
      document.removeEventListener('touchstart', down);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', up);
      document.removeEventListener('touchcancel', up);
      document.removeEventListener('click', click, true);
      document.removeEventListener('contextmenu', ctx);
    };
  }, []);

  if (!p) return null;
  const img = Array.isArray(p.images) && p.images[0] ? imgUrl(p.images[0], 700) : '';
  return createPortal(
    <div onClick={() => setP(null)} style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(15,23,42,.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 'min(380px, 100%)', maxHeight: '82vh', overflowY: 'auto', padding: 0, background: 'var(--bg, #fff)', borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,.35)' }}>
        <div style={{ position: 'relative' }}>
          {img && <img src={img} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />}
          <button aria-label="Close" onClick={() => setP(null)} style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 99, border: 0, background: 'rgba(0,0,0,.55)', color: '#fff', display: 'grid', placeItems: 'center' }}><X size={18} /></button>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 17, wordBreak: 'break-word' }}>{p.name}</div>
          <div style={{ fontWeight: 900, fontSize: 18, color: '#2563EB', margin: '6px 0 10px' }}>{peso(minPrice(p.variant_prices))}</div>
          {p.description && <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{p.description}</div>}
        </div>
      </div>
    </div>, document.body);
}
