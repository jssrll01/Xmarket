import React from 'react';
import { Crown, Check } from 'lucide-react';

const pill = { fontSize: 11, fontWeight: 800, color: '#B45309', background: 'rgba(245,158,11,.18)', padding: '5px 10px', borderRadius: 999 };
const PERKS = ['VIP badge on your profile', 'Early access to special deals', 'Priority support'];

export default function Vip() {
  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>VIP Membership</h2>
        <span style={pill}>Coming soon</span>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 14px' }}>
        Become a VIP and unlock more on XMARKET.
      </p>

      <div style={{ borderRadius: 24, padding: 22, color: '#fff', background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)', boxShadow: '0 16px 32px -18px rgba(245,158,11,.8)' }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Crown size={28} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, marginTop: 14, opacity: 0.95 }}>XMARKET VIP</div>
        <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, marginTop: 4 }}>₱249</div>
      </div>

      <div className="card" style={{ padding: 16, marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          What you get
        </div>
        {PERKS.map((p) => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 14, fontWeight: 600 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(5,150,105,.14)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={14} />
            </span>
            {p}
          </div>
        ))}
      </div>

      <button disabled className="btn-primary" style={{ width: '100%', marginTop: 16, padding: 14, fontSize: 15, fontWeight: 800, opacity: 0.55 }}>
        Get VIP · ₱249
      </button>
      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>Purchases open soon</div>
    </div>
  );
}
