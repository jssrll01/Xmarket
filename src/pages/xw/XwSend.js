import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const QP = new URLSearchParams(window.location.search);
const QAMT = Number(QP.get('amt')) > 0 ? String(Math.round(Number(QP.get('amt')) * 100) / 100) : '';
import { useToast } from '../../components/Toast';
import { transferByEmail } from '../../lib/xwallet';
import useWallet from './useWallet';
import { Shell, SignIn, Confirm, peso } from './ui';
const feeOf = (a) => Math.round(Number(a) || 0) / 100;

export default function XwSend() {
  const { user, balance, refresh } = useWallet();
  const { show } = useToast();
  const [email, setEmail] = useState((QP.get('to') || '').slice(0, 120));
  const [amount, setAmount] = useState(QAMT);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  if (!user) return <SignIn />;

  const check = () => {
    const amt = Number(amount);
    if (!amt || amt < 10) return show('Minimum transfer is ₱10');
    if (amt + feeOf(amt) > balance) return show('Insufficient balance. Amount plus 1% fee exceeds your balance');
    if (!email.includes('@')) return show('Enter a valid email address');
    setAsk(true);
  };
  const submit = async () => {
    setAsk(false);
    const amt = Number(amount);
    setBusy(true);
    const { data, error } = await transferByEmail(user.id, email, amt, `Transfer to ${email}`);
    setBusy(false);
    if (error) return show(error.message);
    if (data?.error) return show(data.error);
    show(`Sent ${peso(amt)} to ${email}`);
    setAmount(''); setEmail(''); refresh();
  };
  const inp = { width: '100%', padding: 12, marginTop: 6, marginBottom: 12, fontSize: 14 };
  const lbl = { fontSize: 12, fontWeight: 700, color: 'var(--muted)' };
  return (
    <Shell title="Send Money">
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>Available balance <b style={{ color: 'var(--text)' }}>{peso(balance)}</b></div>
        <Link to="/xwallet/qr" style={{ display: 'block', textAlign: 'center', padding: 11, marginBottom: 14, borderRadius: 12, border: '1px solid #BFDBFE', background: '#EFF6FF', color: '#1D4ED8', fontWeight: 700, fontSize: 13.5, textDecoration: 'none' }}>Scan or show a QR code</Link>
        <label style={lbl}>Recipient email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="friend@example.com" style={inp} />
        <label style={lbl}>Amount (₱)</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={inp} />
        {Number(amount) >= 10 && <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>Fee (1%): <b>{peso(feeOf(amount))}</b> · Total: <b>{peso(Number(amount) + feeOf(amount))}</b></div>}<button className="btn-primary" disabled={busy} onClick={check} style={{ width: '100%', padding: 13, fontSize: 14 }}>{busy ? 'Sending…' : 'Send money'}</button>
        <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 10 }}>A 1% transfer fee applies. Minimum transfer is ₱10. Double-check the recipient email before sending.</p>
      </div>
      {ask && <Confirm title="Confirm transfer" message={`Send ${peso(amount)} to ${email}? A 1% fee of ${peso(feeOf(amount))} applies. Total deducted: ${peso(Number(amount) + feeOf(amount))}.`} onCancel={() => setAsk(false)} onConfirm={submit} busy={busy} />}
    </Shell>
  );
}
