import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Plus, Smartphone, TrendingUp, Send, RotateCcw, Clock } from 'lucide-react';

export const BLUE = '#2563EB';
export const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const dt = (d) => new Date(d).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
export const STATUS = { approved: '#059669', completed: '#059669', rejected: '#DC2626', processing: '#3B82F6', pending: '#F59E0B' };

export function Shell({ title, children, back = '/xwallet' }) {
  const nav = useNavigate();
  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(back)}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export const SignIn = () => {
  const nav = useNavigate();
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <p style={{ color: 'var(--muted)' }}>Sign in to use Xwallet.</p>
      <button className="btn-primary" onClick={() => nav('/signin')} style={{ marginTop: 12, padding: '10px 24px' }}>Sign in</button>
    </div>
  );
};

export const Sk = ({ h = 16, w = '100%', r = 12, style }) => (
  <div style={{ height: h, width: w, borderRadius: r, background: 'rgba(148,163,184,.25)', animation: 'xwsk 1.2s ease-in-out infinite', ...style }} />
);
export const SkStyle = () => <style>{'@keyframes xwsk{0%,100%{opacity:.45}50%{opacity:1}}'}</style>;

export function Sheet({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 700, background: 'rgba(15,23,42,.5)', display: 'flex', alignItems: 'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: '#fff', padding: 20, borderRadius: '22px 22px 0 0', maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ width: 40, height: 4, borderRadius: 4, background: '#CBD5E1', margin: '0 auto 14px' }} />
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function Confirm({ title, message, onCancel, onConfirm, busy }) {
  return (
    <Sheet title={title} onClose={onCancel}>
      <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>{message}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onCancel} className="btn-ghost" style={{ flex: 1, padding: 12 }}>Cancel</button>
        <button onClick={onConfirm} disabled={busy} className="btn-primary" style={{ flex: 1, padding: 12 }}>{busy ? 'Processing…' : 'Confirm'}</button>
      </div>
    </Sheet>
  );
}

export const kindOf = (t) => {
  const s = String(t.type || '');
  if (s.includes('interest')) return 'interest';
  if (s.includes('topup')) return 'topup';
  if (s.includes('load')) return 'load';
  if (s.includes('withdraw')) return 'withdraw';
  if (s.includes('transfer')) return 'transfer';
  if (s.includes('refund')) return 'refund';
  return 'other';
};
const ICONS = { interest: TrendingUp, topup: Plus, load: Smartphone, withdraw: ArrowUpRight, transfer: Send, refund: RotateCcw, other: null };

export function Row({ it, onClick }) {
  const Icon = ICONS[it.kind] || (it.amount >= 0 ? ArrowDownLeft : ArrowUpRight);
  const req = it.status && it.status !== 'completed';
  const c = req ? STATUS[it.status] || '#64748B' : it.amount >= 0 ? '#059669' : '#DC2626';
  return (
    <div className="card" onClick={onClick} style={{ padding: 12, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ width: 40, height: 40, borderRadius: 13, background: c + '1A', color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {req ? <Clock size={18} /> : <Icon size={18} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{dt(it.at)}{req ? ' · ' + it.status : ''}</div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 14, color: c, whiteSpace: 'nowrap' }}>{req ? '' : it.amount >= 0 ? '+' : '-'}{peso(Math.abs(it.amount))}</div>
    </div>
  );
}

export const txnItem = (t) => ({
  key: 't' + t.id, kind: kindOf(t), title: String(t.type || 'transaction').replace(/_/g, ' '),
  amount: Number(t.amount), at: t.created_at, status: 'completed', note: t.note, ref: t.id, src: 'txn',
});
