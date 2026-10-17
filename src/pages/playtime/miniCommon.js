import React, { useState } from 'react';
import { playMini, fmt } from '../../lib/playtime';
import { usePlay, PlayHeader, Balances, BigButton, Notice, ResultModal, GameInfo } from './common';

export function miniGate(status, key, bet) {
  if (!status) return 'Loading…';
  const cfg = status.config.mini && status.config.mini[key];
  if (!cfg) return 'This game is not available right now.';
  const min = cfg.min_bet || 1;
  if (status.loyalty_points < min) return `You need at least ${fmt(min)} Loyalty Points to play.`;
  if (bet !== undefined) {
    if (!bet || bet < min) return `Minimum amount is ${fmt(min)} Loyalty Points.`;
    if (bet > status.loyalty_points) return `Your amount is more than your balance (${fmt(status.loyalty_points)} points).`;
  }
  return '';
}

export function useMini(key) {
  const base = usePlay();
  const { status, setStatus, reload } = base;
  const [choice, setChoice] = useState(null);
  const [bet, setBetText] = useState('10');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState('');
  const cfg = status && status.config.mini ? status.config.mini[key] : null;
  const betNum = parseInt(bet, 10) || 0;
  const reason = status ? miniGate(status, key, betNum) : 'Loading…';
  const setBet = (v) => setBetText(String(v).replace(/[^0-9]/g, '').slice(0, 9));

  const go = async () => {
    if (busy || reason || !choice) return;
    setBusy(true); setMsg(''); setRes(null); setModal(false);
    const t0 = Date.now();
    const r = await playMini(key, choice, betNum);
    if (!r.ok) { setMsg(r.message || 'Could not play.'); setBusy(false); reload(); return; }
    // The result is already final on the server; the screen only animates it.
    setStatus(s => s && { ...s, loyalty_points: r.previous_balance - r.spent });
    setTimeout(() => {
      setBusy(false); setRes(r); setModal(true);
      setStatus(s => s && { ...s, loyalty_points: r.balance });
      reload();
    }, Math.max(0, 1500 - (Date.now() - t0)));
  };
  return { ...base, gameKey: key, cfg, choice, setChoice, bet, betNum, setBet, busy, res, modal, setModal, msg, reason, go };
}

export function Choices({ options, value, onChange, disabled, cols }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols || options.length}, 1fr)`, gap: 8, marginTop: 16 }}>
      {options.map(o => {
        const on = value === o.value;
        return (
          <button key={o.value} disabled={disabled} onClick={() => onChange(o.value)} style={{
            padding: '12px 6px', borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: 13,
            border: on ? '2px solid var(--primary)' : '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: disabled ? 0.6 : 1,
          }}>
            {o.swatch && <span style={{ width: 26, height: 26, borderRadius: '50%', background: o.swatch, border: '1px solid rgba(0,0,0,.15)' }} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

const DESC = {
  coinflip: 'Call it in the air! One toss, two sides, and a 1.8x win. 🪙',
  color: 'Six colors, one roll. Match the winning color and win 1.8x. 🎨',
  hilo: 'Higher or lower? Read the next card and win 1.8x. 🃏',
  redblack: 'Red or black? Call the card and win 1.8x. ♥️♠️',
};

export function MiniFrame({ m, title, howTo, children }) {
  const { status, error, cfg, reason, busy, res, msg, modal, setModal, go, choice, gameKey, bet, betNum, setBet } = m;
  const payout = cfg ? cfg.payout : 1.8;
  const win = Math.floor(betNum * payout + 1e-9);
  const min = cfg ? cfg.min_bet || 1 : 1;
  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <PlayHeader title={title} subtitle={DESC[gameKey] || 'Choose a side and play.'} />
      <Balances status={status} />
      {error && <Notice>{error}</Notice>}
      {status && cfg && (
        <>
          <div style={{ margin: '22px 0 6px' }}>{children}</div>

          <div className="card" style={{ padding: 14, margin: '16px 0 12px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>{gameKey === 'coinflip' ? 'Your stake' : 'Your bet'} (Loyalty Points)</div>
            <input value={bet} inputMode="numeric" disabled={busy} onChange={e => setBet(e.target.value)}
              style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid var(--border)', fontSize: 20, fontWeight: 800 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {[5, 10, 20, 50, 100].map(v => (
                <button key={v} disabled={busy} onClick={() => setBet(v)} style={{ padding: '7px 13px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{v}</button>
              ))}
              <button disabled={busy} onClick={() => setBet(status.loyalty_points)} style={{ padding: '7px 13px', borderRadius: 999, border: '1px solid var(--primary)', background: 'var(--card)', color: 'var(--primary)', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>Max</button>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.8 }}>
              <div>A win returns <b>{payout}x</b> your bet.</div>
              {betNum >= min && <div>If you win: get back <b>{fmt(win)}</b> (net <b style={{ color: '#059669' }}>+{fmt(win - betNum)}</b>)</div>}
              {betNum >= min && <div>If you lose: <b style={{ color: '#DC2626' }}>-{fmt(betNum)}</b></div>}
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>Minimum {gameKey === 'coinflip' ? 'stake' : 'bet'} {fmt(min)}. Results are decided securely on our servers.</div>
            </div>
          </div>

          {(msg || reason) && <Notice>{msg || reason}</Notice>}
          <BigButton disabled={busy || !!reason || !choice} onClick={go}>
            {busy ? 'Playing…' : !choice ? 'Pick your side first' : ({coinflip:'Toss',color:'Roll the dice',hilo:'Deal',redblack:'Deal'})[gameKey] || 'Play'}
          </BigButton>
          <GameInfo game={gameKey} refresh={status.loyalty_points} steps={howTo} />
        </>
      )}
      {modal && res && (
        <ResultModal
          title={res.win ? 'You won' : 'Not this time'}
          big={res.win ? `+${fmt(res.earned - res.spent)}` : `-${fmt(res.spent)}`}
          sub={res.win ? `You played ${fmt(res.spent)} and got back ${fmt(res.earned)} Loyalty Points` : `You played ${fmt(res.spent)} Loyalty Points. Better luck next time!`}
          actionLabel="Play again" onAction={() => setModal(false)} onClose={() => setModal(false)} />
      )}
    </div>
  );
}
