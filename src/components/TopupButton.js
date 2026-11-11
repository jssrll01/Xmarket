import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';

// Opens the top-up page and remembers where the user came from.
export default function TopupButton() {
  const nav = useNavigate();
  const loc = useLocation();
  return (
    <button type="button" aria-label="Top up Xwallet"
      onClick={() => nav('/xwallet/topup', { state: { from: loc.pathname + loc.search } })}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 10, padding: '7px 12px', border: 0, borderRadius: 10, background: 'var(--card)', color: 'var(--primary)', boxShadow: 'var(--raised-sm)', fontSize: 12.5, fontWeight: 700, flexShrink: 0 }}>
      <Plus size={14} /> Top up
    </button>
  );
}
