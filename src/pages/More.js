import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ChevronRight } from 'lucide-react';

export default function More() {
  const navigate = useNavigate();
  const items = [
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Refund & Return Policy', path: '/refund' },
    { label: 'Vouchers Terms & Conditions', path: '/vouchers' },
    { label: 'XMARKET Mall Terms', path: '/mall' },
    { label: 'Advertising Policy', path: '/advertising' },
    { label: 'Off-Platform Advertising Terms', path: '/off-platform-ads' },
    { label: 'Coins & Cashback Terms', path: '/coins' },
    { label: 'Mega Discount Voucher Terms', path: '/mega-voucher' },
  ];
  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 12 }}>More</h2>
      {items.map((it, i) => (
        <button key={i} className="card"
          onClick={() => navigate(it.path)}
          style={{
            padding: 14, marginBottom: 8, width: '100%',
            display: 'flex', gap: 12, alignItems: 'center',
            color: 'var(--text)', textAlign: 'left'
          }}>
          <FileText size={18} color="#000000" />
          <div style={{ flex: 1 }}>{it.label}</div>
          <ChevronRight size={16} color="#000000" />
        </button>
      ))}
    </div>
  );
}
