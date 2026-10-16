import React, { useState, useEffect, useCallback } from 'react';
import { exchange, fetchGameHistory, fmt, peso } from '../../lib/playtime';
import { useToast } from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';
import { usePlay, PlayHeader, Balances, Notice, BigButton } from './common';

const Row = ({ k, v, last }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', fontSize: 13, borderBottom: last ? 'none' : '1px solid var(--border)' }}>
    <span style={{ color: 'var(--muted)' }}>{k}</span><span style={{ fontWeight: 700, textAlign: 'right' }}>{v}</span>
  </div>
);

export default function Exchange() {
  const { status, setStatus, error, reload } = usePlay();
  const { show } = useToast();
  const [amount, setAmount] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [hist, setHist] = useState(null);

  const loadHist = useCallback(() => { fetchGameHistory('exchange', 50).then(setHist); }, []);
  useEffect(() => { loadHist(); }, [loadHist]);

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
    reload(); loadHist();
  };

  const totalPts = (hist || []).reduce((a, t) => a + (t.spent || 0), 0);
  const totalPhp = (hist || []).reduce((a, t) => a + Number(t.wallet_credit || 0), 0);

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <PlayHeader title="Points Exchange" subtitle="Convert Loyalty Points into XWallet balance. 1 point = ₱1." />
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
          </div>
          {reason && <Notice>{reason}</Notice>}
          <BigButton disabled={!!reason} onClick={() => setConfirmOpen(true)}>Exchange</BigButton>

          <h3 style={{ fontSize: 15, fontWeight: 800, margin: '24px 0 8px' }}>Exchange details</h3>
          <div className="card" style={{ padding: '4px 14px' }}>
            <Row k="Exchange rate" v="1 Loyalty Point = ₱1" />
            <Row k="Minimum exchange" v={`${fmt(min)} Loyalty Point${min === 1 ? '' : 's'}`} />
            <Row k="Daily limit" v="No daily limit" />
            <Row k="Processing" v="Instant" />
            <Row k="Credited to" v="Your XWallet balance" />
            <Row k="Exchanges are" v="Final, cannot be reversed" last />
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 800, margin: '22px 0 8px' }}>How it works</h3>
          <div className="card" style={{ padding: '6px 14px' }}>
            {['Enter the number of points, or tap a quick amount.', 'Review and confirm the exchange.', 'The peso value is added to your XWallet right away.', 'Use your XWallet balance for XMARKET purchases.'].map((s, i, a) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', fontSize: 13, borderBottom: i === a.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 800, margin: '24px 0 8px' }}>Exchange history</h3>
          {hist === null ? <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 14, fontSize: 13 }}>Loading…</p>
            : hist.length === 0 ? <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 14, fontSize: 13 }}>No exchanges yet.</p>
            : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div className="card" style={{ padding: 12, textAlign: 'center' }}><div style={{ fontSize: 17, fontWeight: 900 }}>{fmt(totalPts)}</div><div style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Points exchanged</div></div>
                  <div className="card" style={{ padding: 12, textAlign: 'center' }}><div style={{ fontSize: 17, fontWeight: 900, color: '#059669' }}>{peso(totalPhp)}</div><div style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Received</div></div>
                </div>
                {hist.map(t => (
                  <div key={t.id} className="card" style={{ padding: 12, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ fontSize: 14, fontWeight: 800 }}>Points Exchange</div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#DC2626' }}>-{fmt(t.spent)} Loyalty Points</div>
                        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#059669' }}>+{peso(t.wallet_credit)} XWallet</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, lineHeight: 1.6 }}>
                      {new Date(t.created_at).toLocaleString()}<br />
                      Points {fmt(t.prev_balance)} → {fmt(t.new_balance)} · ID {String(t.id).slice(0, 8).toUpperCase()}
                    </div>
                  </div>
                ))}
              </>
            )}
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
