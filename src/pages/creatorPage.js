import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BLUE, MUTED } from './creatorUi';

// Shared frame for the Creator Studio sub-pages (back button + title)
export default function CreatorShell({ title, children }) {
  const nav = useNavigate();
  return (
    <div className="page-enter" style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button
          type="button"
          aria-label="Back"
          onClick={() => nav('/creator-studio')}
          style={{ width: 40, height: 40, borderRadius: 14, border: 'none', cursor: 'pointer', background: 'var(--neu-surface, #fff)', boxShadow: 'var(--neu-raised-sm)', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={18} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export const Chips = ({ children }) => (
  <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 2px 12px', marginBottom: 4 }}>{children}</div>
);

export const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ padding: '8px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 12, fontWeight: 800, background: active ? BLUE : 'var(--neu-surface, #fff)', color: active ? '#fff' : MUTED, boxShadow: active ? '0 6px 14px -6px rgba(37,99,235,.7)' : 'var(--neu-raised-sm)' }}
  >
    {children}
  </button>
);
