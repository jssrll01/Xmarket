import { money } from '../lib/currency';
import React, { useRef, useState } from 'react';
import PreviewSheet from './PreviewSheet';

const peso = (n) => money(n, 'fixed');

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
  const up = () => { clearTimeout(timer.current); setOpen(false); };

  return (
    <div
      data-lp="1"
      onTouchStart={down} onTouchMove={move} onTouchEnd={up} onTouchCancel={up}
      onContextMenu={(e) => e.preventDefault()}
      onClickCapture={(e) => { if (fired.current) { e.preventDefault(); e.stopPropagation(); fired.current = false; } }}
      style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      {children}
      <PreviewSheet open={open} product={product} />
    </div>
  );
}
