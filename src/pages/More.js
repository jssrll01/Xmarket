import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, FileText, Shield, ChevronRight, Users } from 'lucide-react';

export default function More() {
  const navigate = useNavigate();
  const items = [
    { icon: Info, label: 'About XMARKET', path: '/about' },
    { icon: FileText, label: 'Terms & Conditions', path: '/terms' },
    { icon: Shield, label: 'Privacy Policy', path: '/privacy' },
    { icon: Users, label: 'Become a Seller', path: '/start-selling' },
  ];
  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 12 }}>More</h2>
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <button key={i} className="card"
            onClick={() => navigate(it.path)}
            style={{
              padding: 14, marginBottom: 8, width: '100%',
              display: 'flex', gap: 12, alignItems: 'center',
              color: 'var(--text)', textAlign: 'left'
            }}>
            <Icon size={18} color="#00d4ff" />
            <div style={{ flex: 1 }}>{it.label}</div>
            <ChevronRight size={16} color="#a9b1d6" />
          </button>
        );
      })}
    </div>
  );
}
