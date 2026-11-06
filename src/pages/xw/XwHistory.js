import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import useWallet from './useWallet';
import { Shell, SignIn, Sk, SkStyle, Row, Sheet, txnItem, peso, dt, STATUS } from './ui';

const FILTERS = [['all', 'All'], ['in', 'Money in'], ['out', 'Money out'], ['topup', 'Top-up'], ['load', 'Load'], ['withdraw', 'Withdraw'], ['interest', 'Interest']];

const group = (d) => {
  const x = new Date(d), t = new Date(), y = new Date(Date.now() - 864e5);
  if (x.toDateString() === t.toDateString()) return 'Today';
  if (x.toDateString() === y.toDateString()) return 'Yesterday';
  return x.toLocaleDateString('en-PH', { dateStyle: 'medium' });
};

export default function XwHistory() {
  const { user, loading, txns, topups, withdrawals } = useWallet();
  const [params] = useSearchParams();
  const [f, setF] = useState(params.get('f') || 'all');
  const [open, setOpen] = useState(null);

  const items = useMemo(() => {
    const t = txns.map(txnItem);
    const req = topups.filter(x => x.status !== 'approved').map(x => ({ key: 'u' + x.id, kind: 'topup', title: 'Top-up request', amount: Number(x.amount), at: x.created_at, status: x.status, ref: x.id, src: 'topup' }));
    const wd = withdrawals.map(w => ({ key: 'w' + w.id, kind: 'withdraw', title: 'Withdrawal request', amount: -Number(w.amount), at: w.created_at, status: w.status, ref: w.id, src: 'wd', w }));
    let list;
    if (f === 'withdraw') list = wd;
    else if (f === 'in') list = t.filter(x => x.amount > 0);
    else if (f === 'out') list = t.filter(x => x.amount < 0);
    else if (f === 'topup') list = [...t, ...req].filter(x => x.kind === 'topup');
    else if (f === 'load' || f === 'interest') list = t.filter(x => x.kind === f);
    else list = [...t, ...req];
    return list.sort((a, b) => new Date(b.at) - new Date(a.at));
  }, [txns, topups, withdrawals, f]);

  if (!user) return <SignIn />;
  const groups = [];
  items.forEach(it => { const g = group(it.at); const last = groups[groups.length - 1]; if (last && last.g === g) last.rows.push(it); else groups.push({ g, rows: [it] }); });

  const line = (k, v) => v ? (
    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderTop: '1px solid var(--border)', fontSize: 13 }}>
      <span style={{ color: 'var(--muted)' }}>{k}</span><b style={{ textAlign: 'right', wordBreak: 'break-word' }}>{v}</b>
    </div>
  ) : null;

  return (
    <Shell title="History">
      <SkStyle />
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12 }}>
        {FILTERS.map(([id, label]) => (
          <button key={id} onClick={() => setF(id)} style={{ padding: '8px 14px', borderRadius: 999, whiteSpace: 'nowrap', fontSize: 13, fontWeight: 700, border: '1px solid ' + (f === id ? 'var(--primary)' : 'var(--border)'), background: f === id ? 'var(--primary)' : 'var(--card)', color: f === id ? '#fff' : 'var(--text)' }}>{label}</button>
        ))}
      </div>
      {loading && [0, 1, 2, 3, 4].map(i => <Sk key={i} h={64} r={16} style={{ marginBottom: 8 }} />)}
      {!loading && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}><Receipt size={42} /><div style={{ fontWeight: 800, color: 'var(--text)', marginTop: 8 }}>No records</div><div style={{ fontSize: 13 }}>Nothing here yet.</div></div>
      )}
      {!loading && groups.map(g => (
        <div key={g.g}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', margin: '12px 0 8px', textTransform: 'uppercase', letterSpacing: .6 }}>{g.g}</div>
          {g.rows.map(it => <Row key={it.key} it={it} onClick={() => setOpen(it)} />)}
        </div>
      ))}
      {open && (
        <Sheet title="Transaction details" onClose={() => setOpen(null)}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: open.amount >= 0 ? '#059669' : '#DC2626' }}>{open.amount >= 0 ? '+' : '-'}{peso(Math.abs(open.amount))}</div>
            <span style={{ display: 'inline-block', marginTop: 6, padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', background: (STATUS[open.status] || '#64748B') + '1A', color: STATUS[open.status] || '#64748B' }}>{open.status}</span>
          </div>
          {line('Type', open.title)}
          {line('Date and time', dt(open.at))}
          {line('Balance effect', open.status === 'completed' ? (open.amount >= 0 ? 'Added to your balance' : 'Deducted from your balance') : 'Not yet applied')}
          {open.w && line('Fee (1%)', peso(open.w.fee))}
          {open.w && line('You receive', peso(open.w.net_amount))}
          {open.w && line('Sent to', (open.w.method === 'bank' ? open.w.bank_name : open.w.method === 'gcash' ? 'GCash' : 'Maya') + ' · ' + open.w.account_name)}
          {open.w && line('Account number', '••••' + String(open.w.account_number).slice(-4))}
          {open.w && line('Admin note', open.w.admin_note)}
          {line('Details', open.note)}
          {line('Reference', String(open.ref).slice(0, 8).toUpperCase())}
          <button className="btn-ghost" onClick={() => setOpen(null)} style={{ width: '100%', padding: 12, marginTop: 14 }}>Close</button>
        </Sheet>
      )}
    </Shell>
  );
}
