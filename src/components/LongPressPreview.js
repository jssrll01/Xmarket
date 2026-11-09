import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// <LongPressPreview product={{ name, price, image, description }}>…card…</LongPressPreview>
export default function LongPressPreview({ product, children, delay = 450 }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const start = useRef(null);
  const fired = useRef(false);

  const down = (e) => {
    const t = e.touches ? e.touches[0] : e;
    start.current = { x: t.clientX, y: t.clientY };
    fired.current = false;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fired.current = true;
      if (navigator.vibrate) navigator.vibrate(15);
      setOpen(true);
    }, delay);
  };
  const move = (e) => {
    const t = e.touches ? e.touches[0] : e;
    if (start.current && Math.hypot(t.clientX - start.current.x, t.clientY - start.current.y) > 10) clearTimeout(timer.current);
  };
  const up = () => clearTimeout(timer.current);

  return (
    <div
      data-lp="1"
      onTouchStart={down} onTouchMove={move} onTouchEnd={up} onTouchCancel={up}
      onContextMenu={(e) => e.preventDefault()}
      onClickCapture={(e) => { if (fired.current) { e.preventDefault(); e.stopPropagation(); fired.current = false; } }}
      style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      {children}
      {open && createPortal(
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(15,23,42,.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 'min(380px, 100%)', maxHeight: '82vh', overflowY: 'auto', padding: 0, overflow: 'hidden', background: 'var(--bg, #fff)', borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,.35)' }}>
            <div style={{ position: 'relative' }}>
              {product.image && <img src={product.image} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />}
              <button aria-label="Close" onClick={() => setOpen(false)} style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 99, border: 0, background: 'rgba(0,0,0,.55)', color: '#fff', display: 'grid', placeItems: 'center' }}><X size={18} /></button>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 17, wordBreak: 'break-word' }}>{product.name}</div>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#2563EB', margin: '6px 0 10px' }}>{peso(product.price)}</div>
              {product.description && <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 180, overflowY: 'auto' }}>{product.description}</div>}
            </div>
          </div>
        </div>, document.body)}
    </div>
  );
}
