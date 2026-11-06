import React from 'react';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Phone, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const STATUS = { approved: '#059669', completed: '#059669', rejected: '#DC2626', processing: '#3B82F6', pending: '#F59E0B' };
const TITLES = { topups: 'Top-up history', loads: 'Load history', txns: 'All transactions', withdrawals: 'Withdrawal history' };
const row = { padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 };
const date = (d) => new Date(d).toLocaleString();

export function SectionHead({ title, onAll, show, top = 4 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: `${top}px 0 10px` }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>{title}</h3>
      {show && <button type="button" onClick={onAll} style={{ background: 'none', border: 'none', color: 'var(--primary, #2563EB)', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>See all</button>}
    </div>
  );
}

const Pill = ({ s }) => {
  const c = STATUS[s] || '#64748B';
  const I = s === 'approved' || s === 'completed' ? CheckCircle2 : s === 'rejected' ? AlertCircle : Clock;
  return <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, background: c + '15', color: c, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}><I size={11} /> {s}</div>;
};

export default function XwalletHistory({ kind, data = [], onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'var(--bg, #f1f5f9)', overflowY: 'auto', padding: 16, paddingBottom: 60 }}>
      <button onClick={onClose} className="icon-btn" aria-label="Back" style={{ marginBottom: 12 }}><ArrowLeft size={20} /></button>
      <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 14px' }}>{TITLES[kind]}</h2>
      {data.length === 0 && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>Nothing here yet.</p>}
      {data.map((t, i) => (
        <div key={t.id || i} className="card" style={row}>
          {kind === 'topups' && (<>
            <div><div style={{ fontWeight: 800, fontSize: 14 }}>{peso(t.amount)}</div><div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{date(t.created_at)}</div></div>
            <Pill s={t.status} />
          </>)}
          {kind === 'loads' && (<>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={16} /></div>
              <div><div style={{ fontSize: 13, fontWeight: 700 }}>{t.network} · {t.mobile}</div><div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{date(t.created_at)}</div></div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#DC2626' }}>-{peso(t.amount)}</div>
          </>)}
          {kind === 'txns' && (<>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: t.amount > 0 ? '#D1FAE5' : '#FEE2E2', color: t.amount > 0 ? '#059669' : '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {t.amount > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div><div style={{ fontSize: 13, fontWeight: 700, textTransform: 'capitalize' }}>{String(t.type).replace(/_/g, ' ')}</div><div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{date(t.created_at)}</div></div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, color: t.amount > 0 ? '#059669' : '#DC2626' }}>{t.amount > 0 ? '+' : '-'}{peso(Math.abs(t.amount))}</div>
          </>)}
          {kind === 'withdrawals' && (<>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{peso(t.net_amount)} <span style={{ fontWeight: 500, fontSize: 11, color: 'var(--muted)' }}>({peso(t.amount)} − {peso(t.fee)} fee)</span></div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{t.method === 'bank' ? t.bank_name : t.method === 'gcash' ? 'GCash' : 'Maya'} · {t.account_name} · ••••{String(t.account_number).slice(-4)}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{date(t.created_at)}</div>
            </div>
            <Pill s={t.status} />
          </>)}
        </div>
      ))}
    </div>
  );
}
