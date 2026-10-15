import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ChevronRight, HelpCircle, Headphones, Flag, Bug, Package, Store, ShieldAlert, Gift, Coins, Settings } from 'lucide-react';

export default function More() {
  const navigate = useNavigate();
  const sections = [
    { title: 'Help & Support', items: [
      { label: 'Help Center', hint: 'Guides and answers to common questions', path: '/help', icon: HelpCircle },
      { label: 'Customer Service', hint: 'Talk to our support team', path: '/customer-service', icon: Headphones },
      { label: 'My Reports', hint: 'Track the reports you submitted', path: '/my-reports', icon: Flag },
    ]},
    { title: 'Report a Problem', items: [
      { label: 'Report a Bug', path: '/report/bug', icon: Bug },
      { label: 'Report an Order Issue', path: '/report/order', icon: Package },
      { label: 'Report a Shop', path: '/report/shop', icon: Store },
      { label: 'Report Content', path: '/report/content', icon: Flag },
      { label: 'Report a Security Issue', path: '/report/security', icon: ShieldAlert },
    ]},
    { title: 'Rewards & Preferences', items: [
      { label: 'Loyalty Points', path: '/rewards', icon: Gift },
      { label: 'Coins & Cashback', path: '/coins', icon: Coins },
      { label: 'Settings', path: '/settings', icon: Settings },
    ]},
    { title: 'Policies & Terms', items: [
      { label: 'Terms of Service', path: '/terms', icon: FileText },
      { label: 'Privacy Policy', path: '/privacy', icon: FileText },
      { label: 'Refund & Return Policy', path: '/refund', icon: FileText },
      { label: 'Vouchers Terms & Conditions', path: '/vouchers', icon: FileText },
      { label: 'XMARKET Mall Terms', path: '/mall', icon: FileText },
      { label: 'Advertising Policy', path: '/advertising', icon: FileText },
      { label: 'Off-Platform Advertising Terms', path: '/off-platform-ads', icon: FileText },
      { label: 'Coins & Cashback Terms', path: '/coins', icon: FileText },
      { label: 'Mega Discount Voucher Terms', path: '/mega-voucher', icon: FileText },
    ]},
  ];
  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate('/');
  };

  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={goBackSafe} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 4 }}>More</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18 }}>Support, reports, rewards and our policies</p>

      {sections.map(sec => (
        <div key={sec.title} style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', letterSpacing: 0.6, textTransform: 'uppercase', margin: '0 4px 8px' }}>{sec.title}</div>
          {sec.items.map((it, i) => {
            const Icon = it.icon;
            return (
              <button key={sec.title + i} className="card" onClick={() => navigate(it.path)}
                style={{ padding: 14, marginBottom: 8, width: '100%', display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text)', textAlign: 'left' }}>
                <Icon size={18} color="var(--primary)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{it.label}</div>
                  {it.hint && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{it.hint}</div>}
                </div>
                <ChevronRight size={16} color="var(--muted)" />
              </button>
            );
          })}
        </div>
      ))}
      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>XMARKET · Your trusted online marketplace</div>
    </div>
  );
}
