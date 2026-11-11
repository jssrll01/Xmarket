import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';
import { exchange, fetchGameHistory, fmt, peso } from '../../lib/playtime';
import { useToast } from '../../components/Toast';
import { ListRowsSkeleton, WalletSkeleton } from '../../components/Skeleton';
import TopupButton from '../../components/TopupButton';
import { usePlay, PlayHeader, Notice, HistoryRow } from './common';

const lab = { fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.6 };
const raised = { background: 'var(--card)', borderRadius: 18, boxShadow: 'var(--raised)', padding: 16 };
const Row = ({ k, v, last }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', fontSize: 13, borderBottom: last ? 'none' : '1px solid var(--border)' }}>
    <span style={{ color: 'var(--muted)' }}>{k}</span><b>{v}</b>
  </div>
);

export default function Exchange() {
  const { status, setStatus, error, reload } = usePlay();
  const { show } = useToast();
  const [amount, setAmount] = useState('');
  const [ask, setAsk] = useState(false);
  const [busy, setBusy] = useState(false);
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
    if (busy) return;
    setBusy(true);
    const res = await exchange(n);
    setBusy(false); setAsk(false);
    if (!res.ok) { setMsg(res.message || 'Exchange failed.'); reload(); return; }
    setMsg('');
    setStatus(s => s && { ...s, loyalty_points: res.balance, xwallet_balance: res.xwallet_balance });
    show(`Exchanged ${fmt(n)} Loyalty Points for ${peso(res.wallet_credit)}`);
    setAmount(''); reload(); loadHist();
  };

  const chip = { padding: '8px 14px', borderRadius: 999, border: 'none', background: 'var(--card)', color: 'var(--text)', boxShadow: 'var(--raised-sm)', fontWeight: 700, fontSize: 13 };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <PlayHeader title="Points Exchange" subtitle="Convert Loyalty Points into Xwallet balance." back="last" />
      {error && <Notice>{error}</Notice>}
      {msg && <Notice>{msg}</Notice>}
      {!status && !error && <WalletSkeleton />}
      {status && (<>
        <div style={{ ...raised, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={lab}>Loyalty Points</div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{fmt(status.loyalty_points)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={lab}>Xwallet</div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{peso(status.xwallet_balance)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}><TopupButton /></div>
        </div>

        <div style={lab}>Points to exchange</div>
        <input value={amount} inputMode="numeric" placeholder="0"
          onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, '').slice(0, 9))}
          style={{ width: '100%', padding: 14, fontSize: 24, fontWeight: 800, marginTop: 8, border: 'none', borderRadius: 14, background: 'var(--card)', color: 'var(--text)', boxShadow: 'var(--inset)' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '14px 0' }}>
          {cfg.denominations.map(d => <button key={d} onClick={() => setAmount(String(d))} style={chip}>{fmt(d)}</button>)}
          <button onClick={() => setAmount(String(status.loyalty_points))} style={{ ...chip, color: 'var(--primary)' }}>All</button>
        </div>

        <div style={{ ...raised, marginBottom: 14 }}>
          <Row k="You exchange" v={`${fmt(n)} point${n === 1 ? '' : 's'}`} />
          <Row k="Rate" v={`1 point = ${peso(rate)}`} />
          <Row k="You receive" v={peso(n * rate)} last />
        </div>

        {reason && <Notice>{reason}</Notice>}
        <button className="btn-primary" disabled={!!reason} onClick={() => setAsk(true)}
          style={{ width: '100%', padding: 15, fontSize: 15, fontWeight: 800, borderRadius: 14, opacity: reason ? 0.45 : 1 }}>Exchange points</button>
        <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 10 }}>
          Instant. Minimum {fmt(min)} point{min === 1 ? '' : 's'}. Exchanges are final.
        </div>

        <div style={{ ...lab, margin: '26px 0 10px' }}>Recent exchanges</div>
        {hist === null ? <ListRowsSkeleton compact /> : hist.length === 0
          ? <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 14, fontSize: 13 }}>No exchanges yet.</p>
          : hist.slice(0, 10).map(t => <HistoryRow key={t.id} t={t} />)}
      </>)}

      {ask && (
        <div onClick={() => !busy && setAsk(false)} style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(15,23,42,.5)', display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: 'var(--card)', color: 'var(--text)', borderRadius: '22px 22px 0 0', padding: 20, paddingBottom: 32 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Confirm exchange</h3>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, marginBottom: 6 }}>Exchange <b>{fmt(n)}</b> Loyalty Points for <b>{peso(n * rate)}</b> in your Xwallet.</p>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><ShieldCheck size={14} /> This cannot be reversed.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-ghost" disabled={busy} onClick={() => setAsk(false)} style={{ flex: 1, padding: 13 }}>Cancel</button>
              <button className="btn-primary" aria-busy={busy} disabled={busy} onClick={doExchange} style={{ flex: 1, padding: 13 }}>{busy ? 'Processing…' : 'Confirm'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
