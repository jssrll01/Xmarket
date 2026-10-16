import React, { useState } from 'react';
import { exchange, fmt, peso } from '../../lib/playtime';
import { useToast } from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';
import { usePlay, PlayHeader, Balances, Notice, BigButton } from './common';

export default function Exchange() {
  const { status, setStatus, error, reload } = usePlay();
  const { show } = useToast();
  const [amount, setAmount] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [msg, setMsg] = useState('');

  const cfg = status ? status.config.exchange : null;
  const n = parseInt(amount, 10) || 0;
  const rate = cfg ? Number(cfg.rate) || 1 : 1;
  const min = cfg ? cfg.min_points || 1 : 1;
  let reason = '';
  if (status) {
    if (!n) reason = 'Enter how many Loyalty Points to exchange.';
    else if (n < min) reason = `Minimum exchange is ${fmt(min)} Loyalty Point${min === 1 ? '' : 's'}.`;
    else if (n > status.loyalty_points) reason = `You only have ${fmt(status.loyalty_points)} Loyalty Points.`;
  }

  const doExchange = async () => {
    setConfirmOpen(false);
    const res = await exchange(n);
    if (!res.ok) { setMsg(res.message || 'Exchange failed.'); reload(); return; }
    setMsg('');
    setStatus(s => s && { ...s, loyalty_points: res.balance, xwallet_balance: res.xwallet_balance });
    show(`Exchanged ${fmt(n)} Loyalty Points for ${peso(res.wallet_credit)}`);
    setAmount('');
    reload();
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <PlayHeader title="Coin Exchange" subtitle="Convert Loyalty Points into XWallet balance. 1 point = ₱1." />
      <Balances status={status} />
      {error && <Notice>{error}</Notice>}
      {msg && <Notice>{msg}</Notice>}
      {status && (
        <>
          <div className="card" style={{ padding: 16, margin: '18px 0 12px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>Points to exchange</div>
            <input value={amount} inputMode="numeric" placeholder="0"
              onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, '').slice(0, 9))}
              style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid var(--border)', fontSize: 22, fontWeight: 800 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {cfg.denominations.map(d => (
                <button key={d} onClick={() => setAmount(String(d))} style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{fmt(d)}</button>
              ))}
              <button onClick={() => setAmount(String(status.loyalty_points))} style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid var(--primary)', background: 'var(--card)', color: 'var(--primary)', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>All</button>
            </div>
            <div style={{ marginTop: 14, fontSize: 14, fontWeight: 800, color: '#059669' }}>
              You will receive {peso(n / rate)} XWallet
            </div>
          </div>
          {reason && <Notice>{reason}</Notice>}
          <BigButton disabled={!!reason} onClick={() => setConfirmOpen(true)}>Exchange</BigButton>
          <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 10 }}>There is no daily limit on exchanges.</p>
        </>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Confirm exchange"
        message={n ? `Exchange ${fmt(n)} Loyalty Points for ${peso(n / rate)} XWallet balance?` : ''}
        confirmLabel="Confirm Exchange"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={doExchange}
      />
    </div>
  );
}
