import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeftRight, Coins, Wallet, Zap, ShieldCheck, Lock } from 'lucide-react';
import { exchange, fetchGameHistory, fmt, peso } from '../../lib/playtime';
import { useToast } from '../../components/Toast';
import { ListRowsSkeleton } from '../../components/Skeleton';
import { usePlay, PlayHeader, Notice, HistoryRow } from './common';

const Line = ({ icon: I, k, v, last }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: last ? 'none' : '1px solid var(--border)', fontSize: 13 }}>
    <I size={16} color="#2563EB" /><span style={{ flex: 1, color: 'var(--muted)' }}>{k}</span><b style={{ textAlign: 'right' }}>{v}</b>
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

  const totalPts = (hist || []).reduce((a, t) => a + (t.spent || 0), 0);
  const totalPhp = (hist || []).reduce((a, t) => a + Number(t.wallet_credit || 0), 0);
  const chip = { padding: '8px 14px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--card,#fff)', color: 'var(--text)', fontWeight: 700, fontSize: 13 };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <PlayHeader title="Points Exchange" subtitle="Convert Loyalty Points into Xwallet balance." back="last" />
      {error && <Notice>{error}</Notice>}
      {msg && <Notice>{msg}</Notice>}
      {!status && !error && <ListRowsSkeleton />}
      {status && (<>
        <div className="card" style={{ padding: 18, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .6 }}><Coins size={14} color="#D97706" /> Loyalty points</div>
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4 }}>{fmt(status.loyalty_points)}</div>
          </div>
          <span style={{ width: 38, height: 38, borderRadius: 12, background: '#2563EB1A', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeftRight size={18} /></span>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .6 }}><Wallet size={14} color="#059669" /> Xwallet</div>
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: '#059669' }}>{peso(status.xwallet_balance)}</div>
          </div>
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 8 }}>Points to exchange</div>
          <input value={amount} inputMode="numeric" placeholder="0" onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, '').slice(0, 9))} style={{ width: '100%', padding: 14, fontSize: 24, fontWeight: 800 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {cfg.denominations.map(d => <button key={d} onClick={() => setAmount(String(d))} style={chip}>{fmt(d)}</button>)}
            <button onClick={() => setAmount(String(status.loyalty_points))} style={{ ...chip, borderColor: '#2563EB', color: '#2563EB' }}>All</button>
          </div>
          <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: 'var(--bg,#F1F5F9)', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--muted)' }}>You will receive</span><b style={{ color: '#059669', fontSize: 15 }}>{peso(n * rate)}</b>
          </div>
        </div>
        {reason && <Notice>{reason}</Notice>}
        <button className={reason ? '' : 'btn-primary'} disabled={!!reason} onClick={() => setAsk(true)} style={{ width: '100%', padding: 15, fontSize: 15, fontWeight: 800, borderRadius: 14, background: reason ? '#CBD5E1' : undefined, color: reason ? '#fff' : undefined }}>Exchange points</button>

        <h3 style={{ fontSize: 15, fontWeight: 800, margin: '24px 0 8px' }}>Exchange details</h3>
        <div className="card" style={{ padding: '2px 14px' }}>
          <Line icon={ArrowLeftRight} k="Exchange rate" v={`1 point = ${peso(rate)}`} />
          <Line icon={Coins} k="Minimum" v={`${fmt(min)} point${min === 1 ? '' : 's'}`} />
          <Line icon={Zap} k="Processing" v="Instant" />
          <Line icon={Wallet} k="Credited to" v="Your Xwallet" />
          <Line icon={Lock} k="Exchanges are" v="Final" last />
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 800, margin: '24px 0 8px' }}>Exchange history</h3>
        {hist === null ? <ListRowsSkeleton compact /> : hist.length === 0 ? <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 14, fontSize: 13 }}>No exchanges yet.</p> : (<>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            <div className="card" style={{ padding: 12, textAlign: 'center' }}><b style={{ fontSize: 17 }}>{fmt(totalPts)}</b><div style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Points exchanged</div></div>
            <div className="card" style={{ padding: 12, textAlign: 'center' }}><b style={{ fontSize: 17, color: '#059669' }}>{peso(totalPhp)}</b><div style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Received</div></div>
          </div>
          {hist.map(t => <HistoryRow key={t.id} t={t} />)}
        </>)}
      </>)}

      {ask && (
        <div onClick={() => !busy && setAsk(false)} style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(15,23,42,.5)', display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: 'var(--card,#fff)', color: 'var(--text)', borderRadius: '22px 22px 0 0', padding: 20, paddingBottom: 32 }}>
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
