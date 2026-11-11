import React, { useState } from 'react';
import { useToast } from '../../components/Toast';
import { buyLoad } from '../../lib/xwallet';
import useWallet from './useWallet';
import { Shell, SignIn, Confirm, Row, peso } from './ui';

const NETWORKS = ['Globe', 'TM', 'Smart', 'TNT', 'DITO'];

export default function XwLoad() {
  const { user, balance, loads, refresh } = useWallet();
  const { show } = useToast();
  const [net, setNet] = useState('Globe');
  const [num, setNum] = useState('');
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  if (!user) return <SignIn />;

  const check = () => {
    const amt = Number(amount);
    if (!amt || amt < 10) return show('Minimum load ₱10');
    if (!num.trim()) return show('Enter mobile number');
    if (amt > balance) return show('Insufficient balance');
    setAsk(true);
  };
  const submit = async () => {
    setAsk(false);
    const amt = Number(amount);
    setBusy(true);
    const { error } = await buyLoad(user.id, net, num.trim(), amt);
    setBusy(false);
    if (error) return show(error.message || error);
    show(`${net} load ${peso(amt)} sent to ${num}`);
    setAmount(''); setNum(''); refresh();
  };
  const inp = { width: '100%', padding: 12, marginTop: 6, marginBottom: 12, fontSize: 14 };
  const lbl = { fontSize: 12, fontWeight: 700, color: 'var(--muted)' };
  return (
    <Shell title="Buy Load">
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <label style={lbl}>Network</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 6, marginBottom: 12 }}>
          {NETWORKS.map(n => (
            <button key={n} type="button" onClick={() => setNet(n)} style={{ padding: '12px 0', borderRadius: 12, fontWeight: 800, fontSize: 13, border: net === n ? '2px solid var(--primary)' : '1px solid var(--border)', background: net === n ? 'var(--primary)' : 'var(--card)', color: net === n ? '#fff' : 'var(--text)' }}>{n}</button>
          ))}
        </div>
        <label style={lbl}>Mobile number</label>
        <input type="tel" value={num} onChange={e => setNum(e.target.value)} placeholder="09XX XXX XXXX" style={inp} />
        <label style={lbl}>Amount (₱), minimum 10</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="10" style={inp} />
        <button className="btn-primary" disabled={busy} onClick={check} style={{ width: '100%', padding: 13, fontSize: 14 }}>{busy ? 'Processing…' : 'Buy Load'}</button>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>Recent loads</h3>
      {loads.length === 0 && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>No loads yet.</p>}
      {loads.slice(0, 5).map(l => <Row key={l.id} it={{ kind: 'load', title: `${l.network} · ${l.mobile}`, amount: -Number(l.amount), at: l.created_at, status: 'completed' }} />)}
      {ask && <Confirm title="Confirm load purchase" message={`${net} ${peso(amount)} to ${num}?`} onCancel={() => setAsk(false)} onConfirm={submit} busy={busy} />}
    </Shell>
  );
}
