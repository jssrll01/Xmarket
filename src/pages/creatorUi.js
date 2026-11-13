import { money } from '../lib/currency';
import React from 'react';

export const BLUE = '#2563EB';
export const MUTED = '#64748B';
export const peso = (n) => money(n, 'fixed');
export const card = { background: 'var(--card, #fff)', border: '1px solid rgba(148,163,184,.25)', borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: '0 1px 2px rgba(15,23,42,.04), 0 10px 28px rgba(37,99,235,.06)' };
export const inp = { width: '100%', padding: 13, marginBottom: 10, borderRadius: 12, border: '1px solid rgba(148,163,184,.5)', fontSize: 14, boxSizing: 'border-box', background: 'var(--card, #fff)' };
export const btn = { padding: '12px 16px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#2563EB,#3B82F6)', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 6px 16px rgba(37,99,235,.28)' };
export const ghost = { ...btn, background: 'transparent', color: BLUE, border: '1px solid rgba(37,99,235,.45)', boxShadow: 'none' };
export const circBtn = { width: 38, height: 38, borderRadius: 12, border: 'none', background: 'rgba(255,255,255,.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
export const STATUS = { pending: '#F59E0B', approved: '#10B981', rejected: '#DC2626', successful: '#10B981' };
export const initials = (n) => String(n || 'C').trim().split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase();

export const copyText = async (t) => {
  try { await navigator.clipboard.writeText(t); return true; } catch (e) {
    try {
      const el = document.createElement('textarea'); el.value = t; document.body.appendChild(el); el.select();
      const ok = document.execCommand('copy'); document.body.removeChild(el); return ok;
    } catch (e2) { return false; }
  }
};

export const Pill = ({ s }) => (
  <span style={{ color: '#fff', background: STATUS[s] || MUTED, borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.4 }}>{s}</span>
);

export const IconBox = ({ icon: Icon, color = BLUE, size = 38 }) => (
  <span style={{ width: size, height: size, borderRadius: 12, background: color + '1A', color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={size * 0.5} /></span>
);

export const StatCard = ({ icon, label, value, accent }) => (
  <div style={{ ...card, marginBottom: 0, padding: 14 }}>
    <IconBox icon={icon} color={accent || BLUE} size={34} />
    <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginTop: 10 }}>{label}</div>
    <div style={{ fontSize: 19, fontWeight: 800, marginTop: 2 }}>{value}</div>
  </div>
);

export const SkStyle = () => null; // keyframes now live in index.css (.sk)
export const Sk = ({ w = '100%', h = 14, r = 10, style }) => <div className="sk" style={{ width: w, height: h, borderRadius: r, ...style }} />;

export const PageSkeleton = ({ hero = true }) => (
  <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
    <SkStyle />
    {hero && <Sk h={200} r={24} style={{ marginBottom: 14 }} />}
    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>{[0, 1, 2, 3].map(i => <Sk key={i} w={86} h={34} r={17} />)}</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>{[0, 1, 2, 3].map(i => <Sk key={i} h={96} r={18} />)}</div>
    <Sk h={170} r={18} style={{ marginBottom: 12 }} />
    <Sk h={110} r={18} />
  </div>
);
