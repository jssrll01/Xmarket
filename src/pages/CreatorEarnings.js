import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TrendingUp, Wallet, Gift } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MUTED, peso, card, inp, btn, StatCard, Sk, SkStyle } from './creatorUi';
import CreatorShell from './creatorPage';

export default function CreatorEarnings() {
  const [d, setD] = useState(null);
  const [wds, setWds] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const refKey = useRef(null);
  const [g, setG] = useState({ total: 0, count: 0 });

  const load = useCallback(async () => {
    const [a, w] = await Promise.all([
      supabase.rpc('creator_dashboard'),
      supabase.from('creator_withdrawals').select('*').order('created_at', { ascending: false }).limit(50),
    ]);
    const gr = await supabase.rpc('creator_gifts_received');
    if (gr.data && gr.data.ok) setG(gr.data);
    setD(a.data); setWds(w.data || []); setLoaded(true);
  }, []);
  useEffect(() => { load(); }, [load]);

  const withdraw = async () => {
    if (busy) return;
    setMsg('');
    const amt = Number(amount);
    if (!(amt >= 50)) return setMsg('Minimum withdrawal is ₱50.');
    if (amt > Number(d.balance)) return setMsg('Amount exceeds your available balance.');
    if (!refKey.current) refKey.current = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
    setBusy(true);
    const { data, error } = await supabase.rpc('creator_withdraw', { p_amount: amt, p_ref: refKey.current });
    setBusy(false);
    if (error) return setMsg(error.message);
    if (!data.ok) { refKey.current = null; return setMsg(data.error); }
    refKey.current = null; setAmount(''); setMsg('Transferred to your Xwallet.'); load();
  };

  if (!loaded) {
    return (
      <CreatorShell title="Earnings">
        <SkStyle />
        <Sk h={130} r={24} style={{ marginBottom: 12 }} />
        <Sk h={150} r={18} style={{ marginBottom: 12 }} />
        <Sk h={96} r={18} />
      </CreatorShell>
    );
  }
  if (!d || !d.ok) {
    return <CreatorShell title="Earnings"><div style={card}>{(d && d.error) || 'Creator access required.'}</div></CreatorShell>;
  }

  const good = /Transferred/.test(msg);

  return (
    <CreatorShell title="Earnings">
      <div style={{ borderRadius: 24, padding: 18, marginBottom: 14, color: '#fff', background: 'linear-gradient(135deg,#1D4ED8 0%,#2563EB 45%,#60A5FA 100%)', boxShadow: '0 16px 40px rgba(37,99,235,.35)' }}>
        <div style={{ fontSize: 12, opacity: 0.85 }}>Available earnings</div>
        <div style={{ fontSize: 34, fontWeight: 900, marginTop: 2 }}>{peso(d.balance)}</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>Lifetime {peso(d.lifetime)}</div>
      </div>

      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2 }}>Withdraw to Xwallet</div>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>Minimum ₱50 · instant transfer</div>
        <input style={inp} type="number" inputMode="decimal" placeholder="Amount (₱)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button type="button" style={{ ...btn, width: '100%' }} disabled={busy} onClick={withdraw}>{busy ? 'Processing…' : 'Withdraw'}</button>
        {msg && <div style={{ fontSize: 13, fontWeight: 600, marginTop: 10, color: good ? '#059669' : '#DC2626' }}>{msg}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <StatCard icon={TrendingUp} label="Lifetime earnings" value={peso(d.lifetime)} />
        <StatCard icon={Wallet} label="Total withdrawn" value={peso(d.withdrawn)} accent="#059669" />
        <StatCard icon={Gift} label={"Gifts received (" + g.count + ")"} value={peso(g.total)} accent="#DC2626" />
      </div>

      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Earnings activity</div>
        {(d.activity || []).length === 0 && <div style={{ fontSize: 13, color: MUTED }}>No activity yet.</div>}
        {(d.activity || []).map((a, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderTop: i ? '1px solid rgba(148,163,184,.25)' : 'none' }}>
            <span>{a.label}<br /><small style={{ color: '#94a3b8' }}>{new Date(a.at).toLocaleString()}</small></span>
            <b style={{ color: Number(a.amount) >= 0 ? '#059669' : '#DC2626' }}>{Number(a.amount) >= 0 ? '+' : ''}{peso(a.amount)}</b>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Withdrawal history</div>
        {wds.length === 0 && <div style={{ fontSize: 13, color: MUTED }}>No withdrawals yet.</div>}
        {wds.map((w, i) => (
          <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderTop: i ? '1px solid rgba(148,163,184,.25)' : 'none' }}>
            <span>To Xwallet<br /><small style={{ color: '#94a3b8' }}>{new Date(w.created_at).toLocaleString()}</small></span>
            <b>-{peso(w.amount)}</b>
          </div>
        ))}
      </div>
    </CreatorShell>
  );
}
