import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Zap } from 'lucide-react';

export default function Notifications() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 12 }}>Notifications</h2>

      <div className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: 'rgba(0,212,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Bell size={18} color="#00d4ff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Welcome to XMARKET!</div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>
            Enjoy <span style={{ color: '#00d4ff', fontWeight: 700 }}>discounted prices</span> on
            all products. Shop now and save more!
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: 'rgba(255,214,0,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Zap size={18} color="#ffd600" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Instant Delivery Now Available!</div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>
            All <span style={{ color: '#ffd600', fontWeight: 700 }}>digital products</span> now
            support Instant Delivery with <span style={{ color: '#00d4ff', fontWeight: 700 }}>no delivery fee</span>.
            Get your purchase instantly!
          </div>
        </div>
      </div>
    </div>
  );
}
