import React from 'react';

export const Card = ({ title, children }) => (
  <section style={{ background: '#fff', border: '1px solid var(--border, #E2E8F0)', borderRadius: 20, padding: 16, marginBottom: 14 }}>
    {title && <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted, #64748B)', marginBottom: 10 }}>{title}</div>}
    {children}
  </section>
);

export const Row = ({ label, hint, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 0' }}>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{label}</div>
      {false && hint && <div style={{ fontSize: 12.5, color: 'var(--muted, #64748B)', marginTop: 2 }}>{hint}</div>}
    </div>
    {children}
  </div>
);

export function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      style={{ width: 50, height: 30, borderRadius: 99, background: on ? '#2563EB' : '#CBD5E1', position: 'relative', flexShrink: 0, transition: 'background .2s' }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 24, height: 24, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.3)', transition: 'left .2s' }} />
    </button>
  );
}

export const field = { width: '100%', padding: 12, fontSize: 15, borderRadius: 12, border: '1px solid var(--border, #E2E8F0)', background: '#fff', boxSizing: 'border-box' };
export const pri = { padding: '12px 16px', borderRadius: 12, fontWeight: 800, background: '#2563EB', color: '#fff' };
export const ghost = { padding: '8px 12px', borderRadius: 10, fontWeight: 700, fontSize: 13, border: '1px solid var(--border, #E2E8F0)', background: '#fff' };
