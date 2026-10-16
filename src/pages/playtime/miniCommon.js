import React, { useState } from 'react';
import { playMini, fmt } from '../../lib/playtime';
import { usePlay, PlayHeader, Balances, BigButton, Notice, ResultModal } from './common';

export function miniGate(status, key) {
  if (!status) return 'Loading…';
  const cfg = status.config.mini && status.config.mini[key];
  if (!cfg) return 'This game is not available right now.';
  if (status.loyalty_points < cfg.cost) return `You need ${fmt(cfg.cost)} Loyalty Points to play.`;
  const used = (status.mini_today && status.mini_today[key]) || 0;
  if (used >= (status.config.limits.daily_mini || 15)) return "You've reached today's limit for this game. Come back tomorrow.";
  return '';
}

export function useMini(key) {
  const base = usePlay();
  const { status, setStatus, reload } = base;
  const [choice, setChoice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState('');
  const cfg = status && status.config.mini ? status.config.mini[key] : null;
  const reason = status ? miniGate(status, key) : 'Loading…';

  const go = async () => {
    if (busy || reason || !choice) return;
    setBusy(true); setMsg(''); setRes(null); setModal(false);
    const t0 = Date.now();
    const r = await playMini(key, choice);
    if (!r.ok) { setMsg(r.message || 'Could not play.'); setBusy(false); reload(); return; }
    // The result is already final on the server; the screen only animates it.
    setStatus(s => s && { ...s, loyalty_points: r.previous_balance - r.spent });
    setTimeout(() => {
      setBusy(false); setRes(r); setModal(true);
      setStatus(s => s && { ...s, loyalty_points: r.balance, mini_today: { ...(s.mini_today || {}), [key]: ((s.mini_today || {})[key] || 0) + 1 } });
      reload();
    }, Math.max(0, 1500 - (Date.now() - t0)));
  };
  return { ...base, gameKey: key, cfg, choice, setChoice, busy, res, modal, setModal, msg, reason, go };
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

export function MiniFrame({ m, title, children }) {
  const { status, error, cfg, reason, busy, res, msg, modal, setModal, go, choice, gameKey } = m;
  const used = status && status.mini_today ? (status.mini_today[gameKey] || 0) : 0;
  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <PlayHeader title={title} subtitle={cfg ? `Cost: ${fmt(cfg.cost)} Loyalty Points / Play` : ''} />
      <Balances status={status} />
      {error && <Notice>{error}</Notice>}
      {status && cfg && (
        <>
          <div style={{ margin: '22px 0 6px' }}>{children}</div>
          <div className="card" style={{ padding: 14, margin: '16px 0', fontSize: 13, lineHeight: 1.9 }}>
            <div>Win chance: <b>{cfg.win_rate}%</b></div>
            <div>A win pays: <b>{fmt(Math.round(cfg.cost * cfg.payout))} Loyalty Points</b> (net +{fmt(Math.round(cfg.cost * cfg.payout) - cfg.cost)})</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>Results are decided securely on our servers.</div>
          </div>
          {(msg || reason) && <Notice>{msg || reason}</Notice>}
          <BigButton disabled={busy || !!reason || !choice} onClick={go}>
            {busy ? 'Playing…' : !choice ? 'Pick your side first' : `Play · ${fmt(cfg.cost)} Loyalty Points`}
          </BigButton>
          <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 8 }}>Played today: {used} / {status.config.limits.daily_mini || 15}</p>
        </>
      )}
      {modal && res && (
        <ResultModal
          title={res.win ? 'You won' : 'Not this time'}
          big={res.win ? `+${fmt(res.earned)}` : 'No win'}
          sub={res.win ? `Loyalty Points · Net +${fmt(res.earned - res.spent)} after the ${fmt(res.spent)} entry` : `You spent ${fmt(res.spent)} Loyalty Points. Better luck next time!`}
          actionLabel="Play again" onAction={() => setModal(false)} onClose={() => setModal(false)} />
      )}
    </div>
  );
}
