import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MessageCircle, Mail, Phone, Bug, Package, Store, FileText, Shield, ChevronRight, Clock
} from 'lucide-react';

const CHANNELS = [
  { icon: Mail,   label: 'Email us',        sub: 'support@xmarket.ph',   href: 'mailto:support@xmarket.ph',    color: '#2563EB' },
  { icon: Phone,  label: 'Call us',         sub: 'Mon–Sat · 9AM–6PM',    href: 'tel:+639454408496',            color: '#10B981' },
  { icon: MessageCircle, label: 'Live chat', sub: 'Coming soon',         href: null,                            color: '#7C3AED' },
];

const REPORTS = [
  { icon: Bug,      label: 'Bug & Technical Report',  path: '/report/bug',      color: '#DC2626' },
  { icon: Package,  label: 'Order & Product Report',  path: '/report/order',    color: '#F59E0B' },
  { icon: Store,    label: 'Shop / Seller Report',    path: '/report/shop',     color: '#2563EB' },
  { icon: FileText, label: 'Content & Review Report', path: '/report/content',  color: '#7C3AED' },
  { icon: Shield,   label: 'Account Security Report', path: '/report/security', color: '#059669' },
];

export default function CustomerService() {
  const nav = useNavigate();
  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) nav(-1);
    else nav('/');
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={goBackSafe} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Customer Service</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>
        We're here to help. Pick a channel below or submit a detailed report.
      </p>

      <h3 style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
        Contact us
      </h3>
      {CHANNELS.map(c => {
        const Icon = c.icon;
        const content = (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 14, borderRadius: 14, marginBottom: 10,
            background: 'var(--card)', border: '1px solid var(--border)',
            color: 'inherit', textDecoration: 'none',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: c.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={20} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{c.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{c.sub}</div>
            </div>
            <ChevronRight size={16} color="var(--muted)" />
          </div>
        );
        return c.href ? <a key={c.label} href={c.href} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</a> : <div key={c.label}>{content}</div>;
      })}

      <h3 style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, margin: '20px 0 10px' }}>
        Report an issue
      </h3>
      {REPORTS.map(r => {
        const Icon = r.icon;
        return (
          <button key={r.path} onClick={() => nav(r.path)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              width: '100%', padding: 14, borderRadius: 14, marginBottom: 8,
              background: 'var(--card)', border: '1px solid var(--border)',
              color: 'inherit', cursor: 'pointer', textAlign: 'left',
            }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: r.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={16} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700 }}>
              {r.label}
            </div>
            <ChevronRight size={16} color="var(--muted)" />
          </button>
        );
      })}

      <div style={{
        marginTop: 24, padding: 16, borderRadius: 14,
        background: 'var(--card)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Clock size={18} color="var(--muted)" />
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
          We typically respond within <b style={{ color: 'var(--text)' }}>24 hours</b>. Include your order ID or account email for faster handling.
        </div>
      </div>

      <button onClick={() => nav('/my-reports')} className="btn-primary"
        style={{ width: '100%', padding: 14, marginTop: 16, fontSize: 14, fontWeight: 700 }}>
        View my reports
      </button>
    </div>
  );
}
