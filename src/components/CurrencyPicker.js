import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

const label = (c) => (c.code === 'PHP' ? 'PHP (₱) · default' : c.code + ' (' + c.symbol + ')');
const noTap = { outline: 'none', WebkitTapHighlightColor: 'transparent' };

// Custom currency dropdown. It opens below the button as a floating list, so the card around it never clips it.
export default function CurrencyPicker({ list, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const btn = useRef(null);
  const menu = useRef(null);
  const cur = list.find((c) => c.code === value) || list[0];

  const toggle = () => {
    if (open) { setOpen(false); return; }
    const r = btn.current.getBoundingClientRect();
    setPos({ top: r.bottom + 6, right: Math.max(8, window.innerWidth - r.right) });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onScroll = (e) => { if (menu.current && menu.current.contains(e.target)) return; setOpen(false); };
    window.addEventListener('resize', close);
    window.addEventListener('scroll', onScroll, true);
    return () => { window.removeEventListener('resize', close); window.removeEventListener('scroll', onScroll, true); };
  }, [open]);

  return (
    <>
      <button ref={btn} type="button" onClick={toggle} aria-haspopup="listbox" aria-expanded={open}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: 10, border: '1px solid var(--border, #E5E7EB)', background: 'var(--card, #fff)', color: 'var(--text, #111)', fontSize: 13, fontWeight: 700, cursor: 'pointer', ...noTap }}>
        {cur ? label(cur) : 'PHP (₱) · default'}
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
      </button>
      {open && pos && createPortal(
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 1000, ...noTap }} />
          <div ref={menu} role="listbox" style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 1001, minWidth: 200, maxHeight: '60vh', overflowY: 'auto', background: 'var(--card, #fff)', border: '1px solid var(--border, #E5E7EB)', borderRadius: 14, boxShadow: '0 12px 32px rgba(15,23,42,.18)', padding: 6 }}>
            {list.map((c) => (
              <button key={c.code} type="button" role="option" aria-selected={c.code === value}
                onClick={() => { setOpen(false); if (c.code !== value) onChange(c.code); }}
                style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 12px', border: 'none', borderRadius: 10, background: c.code === value ? 'rgba(37,99,235,.08)' : 'transparent', color: 'var(--text, #111)', fontSize: 14, fontWeight: c.code === value ? 800 : 600, cursor: 'pointer', textAlign: 'left', ...noTap }}>
                <span>
                  {label(c)}
                  {c.name ? <small style={{ display: 'block', fontWeight: 500, fontSize: 11, color: 'var(--muted, #64748B)' }}>{c.name}</small> : null}
                </span>
                {c.code === value && <Check size={16} />}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </>
  );
}
