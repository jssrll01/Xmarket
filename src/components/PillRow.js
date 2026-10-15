import React, { useRef, useState, useEffect, useCallback } from 'react';

export const pillStyle = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '12px 14px', borderRadius: 14,
  background: 'var(--card)', border: '1px solid var(--border)',
  textDecoration: 'none', color: 'var(--text)',
  fontWeight: 700, fontSize: 13,
  WebkitTapHighlightColor: 'transparent',
  WebkitTouchCallout: 'none',
  userSelect: 'none',
  touchAction: 'manipulation',
  outline: 'none',
};

export default function PillRow({ children }) {
  const ref = useRef(null);
  const [m, setM] = useState({ show: false, left: 0, width: 100 });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollWidth, clientWidth, scrollLeft } = el;
    if (scrollWidth <= clientWidth + 2) {
      setM(p => (p.show ? { show: false, left: 0, width: 100 } : p));
      return;
    }
    const width = (clientWidth / scrollWidth) * 100;
    const progress = scrollLeft / (scrollWidth - clientWidth);
    setM({ show: true, left: progress * (100 - width), width });
  }, []);

  useEffect(() => {
    measure();
    const t = setTimeout(measure, 300);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, [measure]);

  return (
    <div>
      <div
        ref={ref}
        onScroll={measure}
        className="pill-scroll"
        style={{
          display: 'flex', gap: 8, padding: '4px 16px 4px',
          overflowX: 'auto', overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}
      >
        {children}
      </div>
      {m.show && (
        <div style={{ position: 'relative', height: 3, width: 64, margin: '6px auto 8px', borderRadius: 999, background: 'var(--border)' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: m.left + '%', width: m.width + '%', borderRadius: 999, background: 'var(--primary)' }} />
        </div>
      )}
    </div>
  );
}
