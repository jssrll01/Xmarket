import { GameLoadingSkeleton } from '../../components/Skeleton';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TopupButton from '../../components/TopupButton';
import { fetchTiers, fetchDraw, fetchLastDraw, fetchMyBets, fetchBetHistory, fetchLockSeconds, placeBet } from '../../lib/airdrop';
import { peso } from '../../lib/playtime';
import { usePlay } from './common';

const MAX_BETS = 5;
const hms = (ms) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, '0')).join(':');
};
const CSS = `
.ad{padding:16px 16px 70px;max-width:560px;margin:0 auto}
.ad h2{margin:0;font-size:22px;font-weight:700;letter-spacing:-.02em}
.ad-sub{font-size:12.5px;color:var(--muted);margin:3px 0 14px;line-height:1.45}
.ad-bal{display:flex;align-items:center;padding:12px 12px 12px 16px;border-radius:14px;background:var(--bg);box-shadow:var(--inset)}
.ad-bal span{font-size:13px;color:var(--muted);margin-right:auto}
.ad-bal b{font-size:18px;font-variant-numeric:tabular-nums}
.ad-card{background:var(--card);border-radius:18px;padding:16px;margin-top:14px;box-shadow:var(--raised-sm)}
.ad-lab{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
.ad-time{font-family:ui-monospace,Menlo,monospace;font-size:34px;font-weight:700;margin-top:6px;text-align:center;font-variant-numeric:tabular-nums}
.ad-lock{text-align:center;font-weight:700;color:#B45309}
.ad-balls{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:12px 0 6px}
.ad-ball{width:42px;height:42px;border-radius:50%;background:var(--card);box-shadow:var(--raised-sm);display:flex;align-items:center;justify-content:center;font-weight:700}
.ad-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(44px,1fr));gap:8px;max-height:240px;overflow-y:auto;padding:4px;margin-top:10px}
.ad-n{border:0;padding:10px 0;border-radius:10px;background:var(--card);box-shadow:var(--raised-sm);font-weight:700;color:var(--text)}
.ad-n.on{background:var(--bg);box-shadow:var(--inset);color:var(--primary)}
.ad-n:disabled{opacity:.5}
.ad-row{display:flex;gap:10px;margin-top:14px}
.ad-in{flex:1;min-width:0;border:0;outline:0;padding:12px 14px;border-radius:12px;background:var(--bg);box-shadow:var(--inset);font-size:16px;color:var(--text)}
.ad-btn{border:0;padding:12px 18px;border-radius:12px;background:var(--primary);color:#fff;font-weight:600;font-size:13.5px;box-shadow:0 4px 10px -4px rgba(37,99,235,.45)}
.ad-btn:disabled{opacity:.5}
.ad-msg{margin-top:10px;text-align:center;font-weight:600;font-size:13px}
.ad-li{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px}
.ad-li:last-child{border-bottom:0}
.ad-li small{display:block;color:var(--muted);font-size:11px;margin-top:2px}
.ad-ok{color:#059669;font-weight:700}.ad-no{color:var(--muted)}
.ad-steps{margin:8px 0 0;padding-left:18px;font-size:13px;line-height:1.7;color:var(--text)}
`;

export default function Airdrop() {
  const nav = useNavigate();
  const { tier } = useParams();
  const { user } = useAuth();
  const { status, reload } = usePlay();
  const [t, setT] = useState(null);
  const [lock, setLock] = useState(10);
  const [now, setNow] = useState(Date.now());
  const [pick, setPick] = useState(null);
  const [amount, setAmount] = useState('10');
  const [mine, setMine] = useState([]);
  const [last, setLast] = useState(null);
  const [lastBets, setLastBets] = useState([]);
  const [hist, setHist] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const uid = user && user.id;

  const slot = t ? t.draw_minutes * 60000 : 0;
  const end = slot ? Math.floor(now / slot) * slot + slot : 0;
  const left = end - now;
  const locked = slot > 0 && left <= lock * 1000;
  const amt = parseInt(amount, 10);

  useEffect(() => {
    fetchTiers().then((l) => {
      const x = l.find((y) => y.key === tier);
      setT(x ? { ...x, draw_minutes: x.draw_minutes || 180 } : null);
    });
    fetchLockSeconds().then(setLock);
  }, [tier]);
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 500); return () => clearInterval(i); }, []);

  const refresh = useCallback(async () => {
    if (!t || !uid) return;
    const d = await fetchDraw(tier, end);
    setMine(d ? await fetchMyBets(d.id, uid) : []);
    const l = await fetchLastDraw(tier);
    setLast(l);
    setLastBets(l ? await fetchMyBets(l.id, uid) : []);
    setHist(await fetchBetHistory(tier, uid));
  }, [t, uid, tier, end]);
  useEffect(() => { refresh(); const i = setInterval(refresh, 30000); return () => clearInterval(i); }, [refresh]);

  const submit = async () => {
    if (busy) return;
    setBusy(true); setMsg('');
    const r = await placeBet(tier, pick, amt);
    setBusy(false);
    if (!r.ok) { setMsg(r.message || 'Could not place your airdrop.'); return; }
    setMsg('Airdrop placed! Good luck.'); setPick(null);
    reload(); refresh();
  };

  if (!t) return <GameLoadingSkeleton />;
  const hours = t.draw_minutes / 60;
  const every = hours >= 1 ? hours + (hours === 1 ? ' hour' : ' hours') : t.draw_minutes + ' minutes';
  const drawing = locked && left > 0;
  const full = mine.length >= MAX_BETS;
  const wonTotal = lastBets.reduce((n, b) => n + (b.win ? Number(b.payout) : 0), 0);

  return (
    <div className="page-enter ad">
      <style>{CSS}</style>
      <button onClick={() => nav('/play-time')} className="icon-btn" aria-label="Back" style={{ marginBottom: 12 }}><ArrowLeft size={20} /></button>
      <h2>{t.label}</h2>
      <p className="ad-sub">{`Pick a number from 1 to ${t.max_n}. ${t.win_count} winning numbers are drawn every ${every}. Bets use your Xwallet balance.`}</p>

      <div className="ad-bal"><span>Xwallet balance</span><b>{status ? peso(status.xwallet_balance) : '…'}</b><TopupButton /></div>

      <div className="ad-card">
        <div className="ad-lab" style={{ textAlign: 'center' }}>{drawing ? 'Locked, drawing soon' : 'Airdrop closes in'}</div>
        <div className="ad-time">{drawing ? hms(left) : hms(left - lock * 1000)}</div>
        {drawing && <div className="ad-lock">Betting is locked for this draw</div>}
      </div>

      {last && (
        <div className="ad-card" style={{ textAlign: 'center' }}>
          <div className="ad-lab">Latest draw winning numbers</div>
          <div className="ad-balls">{(last.winning || []).map((n) => <div key={n} className="ad-ball">{n}</div>)}</div>
          {lastBets.length > 0 && (
            <div style={{ fontWeight: 700, fontSize: 13 }} className={wonTotal > 0 ? 'ad-ok' : 'ad-no'}>
              {wonTotal > 0 ? `You won ${peso(wonTotal)}` : 'No win this time. Better luck next draw!'}
            </div>
          )}
        </div>
      )}

      <div className="ad-card" style={{ opacity: locked ? 0.55 : 1 }}>
        <div className="ad-lab">Your airdrops this draw: {mine.length} of {MAX_BETS}</div>
        {mine.map((b) => <div className="ad-li" key={b.id}><span>Number {b.pick}</span><b>{peso(b.amount)}</b></div>)}
        {!full && (
          <>
            <div style={{ fontWeight: 700, marginTop: 12 }}>Pick your number {pick ? `(${pick})` : ''}</div>
            <div className="ad-grid">
              {Array.from({ length: t.max_n }, (_, i) => i + 1).map((n) => (
                <button key={n} disabled={locked} onClick={() => setPick(n)} className={'ad-n' + (pick === n ? ' on' : '')}>{n}</button>
              ))}
            </div>
            <div className="ad-row">
              <input className="ad-in" type="number" min="1" inputMode="numeric" value={amount} disabled={locked} onChange={(e) => setAmount(e.target.value)} placeholder="Amount in ₱" />
              <button className="ad-btn" disabled={busy || locked || !pick || !(amt > 0)} onClick={submit}>{busy ? 'Placing…' : 'Place airdrop'}</button>
            </div>
          </>
        )}
        {full && <div className="ad-msg ad-no">You have placed all {MAX_BETS} airdrops for this draw.</div>}
        {msg && <div className="ad-msg">{msg}</div>}
      </div>

      <div className="ad-card">
        <div className="ad-lab">Your bets, last 24 hours</div>
        {hist.length === 0 && <div className="ad-msg ad-no">No bets yet.</div>}
        {hist.map((b) => (
          <div className="ad-li" key={b.id}>
            <span>Number {b.pick} · {peso(b.amount)}<small>{new Date(b.created_at).toLocaleString()}</small></span>
            <b className={b.win ? 'ad-ok' : 'ad-no'}>{b.win === null || b.win === undefined ? 'Pending' : b.win ? '+' + peso(b.payout) : 'Lost'}</b>
          </div>
        ))}
      </div>

      <div className="ad-card">
        <div className="ad-lab">How to play</div>
        <ol className="ad-steps">
          <li>{`Pick a number from 1 to ${t.max_n}.`}</li>
          <li>Enter an amount. It is paid from your Xwallet.</li>
          <li>{`Place up to ${MAX_BETS} airdrops per draw before the timer closes.`}</li>
          <li>{`A draw happens every ${every} with ${t.win_count} winning numbers.`}</li>
          <li>Winnings are added to your Xwallet. Bet history clears after 24 hours.</li>
        </ol>
      </div>
    </div>
  );
}
