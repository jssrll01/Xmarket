import React, { useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { useToast } from '../components/Toast';
import { requestWithdrawal } from '../lib/xwallet';
import { SectionHead } from './XwalletHistory';

const METHODS = [['gcash', 'GCash'], ['maya', 'Maya'], ['bank', 'Bank']];
const STATUS = {
  pending: ['#F59E0B', Clock], processing: ['#3B82F6', Loader2], approved: ['#10B981', CheckCircle2],
  completed: ['#059669', CheckCircle2], rejected: ['#DC2626', AlertCircle],
};
const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inp = { width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 };
const lbl = { fontSize: 12, fontWeight: 700, color: 'var(--muted)' };

export default function XwalletWithdraw({ balance, withdrawals, onDone, onSeeAll }) {
  const { show: showToast } = useToast();
  const [method, setMethod] = useState('gcash');
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [bank, setBank] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const refKey = useRef(null);

  const amt = Number(amount) || 0;
  const fee = Math.round(amt * 1) / 100;
  const net = Math.round((amt - fee) * 100) / 100;

  const validate = () => {
    if (amt < 100) return 'Minimum withdrawal is ₱100';
    if (amt > balance) return 'Insufficient Xwallet balance';
    if (name.trim().length < 2) return 'Enter the account name';
    if (method === 'bank') {
      if (!bank.trim()) return 'Enter the bank name';
      if (!/^\d{6,20}$/.test(number.replace(/[\s-]/g, ''))) return 'Enter a valid account number';
    } else if (!/^(09|\+?639)\d{9}$/.test(number.replace(/[\s-]/g, ''))) return 'Enter a valid mobile number (09XXXXXXXXX)';
    return null;
  };

  const submit = async () => {
    if (busy) return;
    if (!refKey.current) refKey.current = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());
    setBusy(true);
    const { error } = await requestWithdrawal({ method, amount: amt, accountName: name.trim(), accountNumber: number, bankName: bank.trim(), ref: refKey.current });
    setBusy(false); setConfirm(false);
    if (error) { showToast(error.message); return; }
    refKey.current = null;
    showToast('Withdrawal requested');
    setAmount(''); setNumber(''); setName(''); setBank('');
    onDone && onDone();
  };

  return (
    <>
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Withdraw to</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
          {METHODS.map(([id, label]) => {
            const on = method === id;
            return (
              <button key={id} type="button" onClick={() => setMethod(id)} style={{
                padding: '12px 0', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 13,
                border: on ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: on ? 'var(--primary)' : 'var(--card)', color: on ? '#fff' : 'var(--text)',
              }}>{label}</button>
            );
          })}
        </div>

        {method === 'bank' && (<>
          <label style={lbl}>Bank name / type</label>
          <input value={bank} onChange={e => setBank(e.target.value)} placeholder="e.g. BDO, BPI, UnionBank" style={inp} />
        </>)}
        <label style={lbl}>Account name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name on the account" style={inp} />
        <label style={lbl}>{method === 'bank' ? 'Account number' : `${method === 'gcash' ? 'GCash' : 'Maya'} number`}</label>
        <input value={number} onChange={e => setNumber(e.target.value)} inputMode="numeric"
          placeholder={method === 'bank' ? 'Bank account number' : '09XX XXX XXXX'} style={inp} />
        <label style={lbl}>Amount (₱) · min ₱100</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100" style={inp} />

        <div style={{ background: 'var(--bg, #f1f5f9)', borderRadius: 12, padding: 12, fontSize: 13, marginBottom: 12 }}>
          {[['Deducted from Xwallet', peso(amt)], ['Fee (1%)', '-' + peso(fee)], ['You receive', peso(net)]].map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontWeight: i === 2 ? 800 : 500 }}>
              <span style={{ color: i === 2 ? 'inherit' : 'var(--muted)' }}>{k}</span><span>{amt >= 100 ? v : '—'}</span>
            </div>
          ))}
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: 12, fontSize: 13 }}
          onClick={() => { const e = validate(); if (e) showToast(e); else setConfirm(true); }}>
          Request withdrawal
        </button>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>
          Requests are reviewed by admin. If rejected, the full amount is returned to your Xwallet.
        </p>
      </div>

      <SectionHead title="Withdrawal history" show={withdrawals.length > 3} onAll={() => onSeeAll && onSeeAll()} />
      {withdrawals.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>No withdrawals yet.</p>
      ) : withdrawals.slice(0, 3).map(w => {
        const [color, Icon] = STATUS[w.status] || STATUS.pending;
        return (
          <div key={w.id} className="card" style={{ padding: 12, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{peso(w.net_amount)} <span style={{ fontWeight: 500, fontSize: 11, color: 'var(--muted)' }}>(₱{Number(w.amount).toFixed(2)} − ₱{Number(w.fee).toFixed(2)} fee)</span></div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {w.method === 'bank' ? w.bank_name : w.method === 'gcash' ? 'GCash' : 'Maya'} · {w.account_name} · ••••{String(w.account_number).slice(-4)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(w.created_at).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, background: `${color}15`, color, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                <Icon size={11} /> {w.status}
              </div>
            </div>
            {w.admin_note && <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6 }}>Note: {w.admin_note}</div>}
          </div>
        );
      })}

      {confirm && (
        <div data-fix="xw-confirm-fix" style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end' }} onClick={() => !busy && setConfirm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: '#fff', padding: 20, paddingBottom: 110, borderRadius: '20px 20px 0 0', maxHeight: '85vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>Confirm withdrawal</h3>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
              {peso(amt)} will be deducted from your Xwallet. You will receive <b>{peso(net)}</b> in{' '}
              {method === 'bank' ? bank : method === 'gcash' ? 'GCash' : 'Maya'} ({name} · {number}) after approval.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setConfirm(false)} disabled={busy} className="btn-ghost" style={{ flex: 1, padding: 12 }}>Cancel</button>
              <button onClick={submit} disabled={busy} className="btn-primary" style={{ flex: 1, padding: 12 }}>{busy ? 'Processing…' : 'Confirm'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
