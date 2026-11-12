import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// open: boolean. Stays mounted for 200 ms after open=false so the close animation can play.
export default function PreviewSheet({ open, product }) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [last, setLast] = useState(null);

  useEffect(() => {
    if (open && product) {
      setLast(product); setMounted(true);
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(r);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(t);
  }, [open, product]);

  if (!mounted || !last) return null;
  const p = last;
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 5000, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      background: shown ? 'rgba(15,23,42,.55)' : 'rgba(15,23,42,0)', transition: 'background .2s ease' }}>
      <div className="card" style={{ width: 'min(380px, 100%)', maxHeight: '82vh', overflow: 'hidden', padding: 0, background: 'var(--bg, #fff)', borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,.35)',
        transform: shown ? 'scale(1)' : 'scale(.86)', opacity: shown ? 1 : 0, transition: 'transform .22s cubic-bezier(.2,.9,.3,1.2), opacity .18s ease' }}>
        {p.image && <img src={p.image} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />}
        <div style={{ padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 17, wordBreak: 'break-word' }}>{p.name}</div>
          <div style={{ fontWeight: 900, fontSize: 18, color: '#2563EB', margin: '6px 0 10px' }}>{peso(p.price)}</div>
          {p.description && <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 150, overflow: 'hidden' }}>{p.description}</div>}
        </div>
      </div>
    </div>, document.body);
}
