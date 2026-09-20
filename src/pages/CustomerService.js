import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';

export default function CustomerService() {
  const navigate = useNavigate();
  const items = [
    { icon: MessageCircle, label: 'Live Chat', sub: 'Response within 24 hours' },
    { icon: Phone, label: 'Call Support', sub: '+63 9454408496' },
  ];
  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 12 }}>Customer Service</h2>
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <div key={i} className="card" style={{ padding: 14, marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Icon size={20} color="#00d4ff" />
            <div>
              <div style={{ fontWeight: 700 }}>{it.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{it.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
