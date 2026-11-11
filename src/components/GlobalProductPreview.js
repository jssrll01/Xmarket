import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { imgUrl } from '../lib/img';
import PreviewSheet from './PreviewSheet';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const minPrice = (vp) => { const v = Object.values(vp || {}).map(Number).filter((n) => n > 0); return v.length ? Math.min(...v) : 0; };

export default function GlobalProductPreview() {
  const [p, setP] = useState(null);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const start = useRef(null);
  const fired = useRef(false);
  const held = useRef(false);

  useEffect(() => {
    const show = async (id) => {
      const q = supabase.from('products').select('id,name,images,description,variant_prices');
      const { data } = await (UUID.test(id) ? q.eq('id', id) : q.eq('legacy_id', id)).limit(1);
      if (!held.current) return;
      if (data && data[0]) {
        const r = data[0];
        if (navigator.vibrate) navigator.vibrate(15);
        setP({ name: r.name, price: minPrice(r.variant_prices), description: r.description, image: Array.isArray(r.images) && r.images[0] ? imgUrl(r.images[0], 700) : '' });
        setOpen(true);
      }
    };
    const down = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="/product/"]');
      if (!a || a.closest('[data-lp]')) return;
      const id = decodeURIComponent(a.getAttribute('href').slice(9).split(/[#?]/)[0]);
      if (!id) return;
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
      fired.current = false; held.current = true;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { fired.current = true; show(id); }, 450);
    };
    const move = (e) => {
      const t = e.touches[0];
      if (start.current && !fired.current && Math.hypot(t.clientX - start.current.x, t.clientY - start.current.y) > 10) { clearTimeout(timer.current); held.current = false; }
    };
    const up = () => { clearTimeout(timer.current); held.current = false; setOpen(false); };
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

  return <PreviewSheet open={open} product={p} />;
}
