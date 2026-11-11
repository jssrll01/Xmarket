import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function About() {
  const nav = useNavigate();
  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={() => nav(-1)} className="icon-btn"><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, flex: 1 }}>About</h2>
      </div>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Info size={18} color="var(--primary)" />
          <h3 style={{ fontSize: 16, fontWeight: 900 }}>XMARKET</h3>
        </div>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
          More Products. Lower Prices. XMARKET connects buyers and sellers
          across the Philippines with instant delivery, XWallet payments,
          and rewards on every order.
        </p>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>
          © {new Date().getFullYear()} XMARKET. All rights reserved.
        </p>
      </div>
    </div>
  );
}
