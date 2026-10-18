import { GameLoadingSkeleton } from '../../components/Skeleton';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchTiers, fetchCredits, fetchDraw, fetchMyBet, placeBet } from '../../lib/airdrop';
import { usePlay, Balances, GameInfo } from './common';

const SLOT = 600000;
const mmss = (ms) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
};
const CSS = `
@keyframes adBounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-18px) scale(1.15)}}
@keyframes adPop{0%{transform:scale(0) rotate(-180deg)}70%{transform:scale(1.25)}100%{transform:scale(1) rotate(0)}}
@keyframes adGlow{0%,100%{box-shadow:0 0 10px #F59E0B}50%{box-shadow:0 0 34px #EF4444}}
`;

export default function Airdrop() {
  const nav = useNavigate();
  const { tier } = useParams();
  const { status } = usePlay();
  const [t, setT] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [pick, setPick] = useState(null);
  const [amount, setAmount] = useState('1');
  const [bet, setBet] = useState(null);
  const [msg, setMsg] = useState('');
  const [result, setResult] = useState(null);
  const [myResult, setMyResult] = useState(null);
  const betRef = useRef(null);

  const end = Math.floor(now / SLOT) * SLOT + SLOT;
  const left = end - now;
  const locked = left <= 10000;

  useEffect(() => {
    fetchTiers().then((l) => setT(l.find((x) => x.key === tier) || null));
    fetchCredits().then(() => {});
    const i = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(i);
  }, [tier]);

  useEffect(() => { betRef.current = bet; }, [bet]);

  useEffect(() => {
    let off = false;
    (async () => {
      const d = await fetchDraw(tier, end);
      const b = d ? await fetchMyBet(d.id) : null;
      if (!off) { setBet(b ? { end, pick: b.pick, amount: b.amount } : null); setPick(null); }
    })();
    return () => { off = true; };
  }, [tier, end]);

  useEffect(() => {
    const prev = end - SLOT;
    let tries = 0, stop = false;
    setResult(null); setMyResult(null);
    const poll = async () => {
      if (stop || tries++ > 40) return;
      const d = await fetchDraw(tier, prev);
      if (d && d.status === 'done') {
        setResult(d.winning || []);
        const b = await fetchMyBet(d.id);
        if (b) setMyResult(b);
      } else setTimeout(poll, 2000);
    };
    poll();
    return () => { stop = true; };
  }, [tier, end]);

  const submit = async () => {
    setMsg('');
    const r = await placeBet(tier, pick, parseInt(amount, 10));
    if (!r.ok) return setMsg(r.message || 'Could not place bet.');
    setBet({ end, pick, amount: parseInt(amount, 10) });
    setMsg('Airdrop placed! Good luck.');
  };

  if (!t) return <GameLoadingSkeleton />;
  const drawing = locked && left > 0;
  const won = myResult && myResult.win;

  return (
    <div style={{ padding: 16 }}>
      <style>{CSS}</style>
      <button onClick={() => nav('/play-time')} className="icon-btn" style={{ marginBottom: 12 }}><ArrowLeft size={20} /></button>
      <h2 style={{ margin: 0 }}>{t.label}</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', margin: '2px 0 0' }}>{`Pick a number from 1 to ${t.max_n}. ${t.win_count} winning numbers are drawn every 10 minutes. Match one and win big! 🎁`}</p>
      
      <Balances status={status} />

      <div className="card" style={{ padding: 16, marginTop: 12, marginBottom: 12, textAlign: 'center', animation: drawing ? 'adGlow 0.8s infinite' : 'none' }}>
        {!drawing ? (
          <>
            <div style={{ fontSize: 12, color: '#64748B' }}>Airdrop closes in</div>
            <div style={{ fontSize: 40, fontWeight: 900 }}>{mmss(left - 10000)}</div>
          </>
        ) : (
          <>
            <div style={{ fontWeight: 900, color: '#EF4444' }}>AIRDROP LOCKED · DRAWING {mmss(left)}</div>
            <div style={{ height: 90, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, position: 'relative', overflow: 'hidden' }}>
              {Array.from({ length: t.win_count }).map((_, i) => (
                <div key={i} style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#F59E0B,#EF4444)',
                  color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: `adBounce ${0.5 + i * 0.1}s infinite` }}>?</div>
              ))}
            </div>
          </>
        )}
      </div>

      {result && !drawing && (
        <div className="card" style={{ padding: 14, marginBottom: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#64748B' }}>Last draw winning numbers</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', margin: '8px 0' }}>
            {result.map((n, i) => (
              <div key={n} style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#F59E0B,#EF4444)',
                color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: `adPop 0.6s ${i * 0.25}s both` }}>{n}</div>
            ))}
          </div>
          {myResult && (
            <div style={{ fontWeight: 800, color: won ? '#16A34A' : '#64748B' }}>
              {won ? `You won ${myResult.payout} credits! (picked ${myResult.pick})` : `You picked ${myResult.pick}. Better luck next draw!`}
            </div>
          )}
        </div>
      )}

      {bet && bet.end === end ? (
        <div className="card" style={{ padding: 14, textAlign: 'center', fontWeight: 800 }}>
          Your airdrop: number {bet.pick} · {bet.amount} credits. Draw at the end of the timer.
        </div>
      ) : (
        <div className="card" style={{ padding: 14, opacity: locked ? 0.5 : 1 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Pick your number {pick ? `(${pick})` : ''}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(44px,1fr))', gap: 6, maxHeight: 240, overflowY: 'auto' }}>
            {Array.from({ length: t.max_n }, (_, i) => i + 1).map((n) => (
              <button key={n} disabled={locked} onClick={() => setPick(n)}
                style={{ padding: '10px 0', borderRadius: 10, border: '1px solid #CBD5E1', fontWeight: 800,
                  background: pick === n ? 'linear-gradient(135deg,#F59E0B,#EF4444)' : '#fff', color: pick === n ? '#fff' : '#0F172A' }}>{n}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input type="number" min="1" value={amount} disabled={locked} onChange={(e) => setAmount(e.target.value)}
              placeholder="Airdrop amount" style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 16 }} />
            <button className="btn" disabled={locked || !pick || !(parseInt(amount, 10) > 0)} onClick={submit} style={{ padding: '10px 16px' }}>Place your airdrop</button>
          </div>
        </div>
      )}
      {msg && <div style={{ marginTop: 10, textAlign: 'center', fontWeight: 700 }}>{msg}</div>}
      <GameInfo game="airdrop" refresh={bet ? bet.end : 0} steps={[
        `Pick your lucky number from 1 to ${t.max_n}.`,
        'Enter your airdrop amount in credits.',
        'Tap Place your airdrop before the timer closes.',
        `A new draw happens every 10 minutes with ${t.win_count} winning numbers.`,
        'If your number is drawn, your prize is added to your balance.',
      ]} />
    </div>
  );
}