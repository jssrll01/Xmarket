import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { play, fmt } from '../../lib/playtime';
import { usePlay, gateReason, PlayHeader, Balances, BigButton, Notice, ResultModal } from './common';

const COLOR = { common: '#64748B', rare: '#2563EB', epic: '#7C3AED', legendary: '#F59E0B', mythical: '#EC4899' };
const ORDER = ['common', 'rare', 'epic', 'legendary', 'mythical'];

export default function MysteryBox() {
  const { status, setStatus, error, reload } = usePlay();
  const [tier, setTier] = useState('common');
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState('');

  const box = status ? status.config.boxes[tier] : null;
  const amounts = box ? box.rewards.map(r => r.amount) : [];
  const total = box ? box.rewards.reduce((n, r) => n + r.weight, 0) : 1;
  const top = box ? Math.max(...box.rewards.map(r => r.weight)) : 0;
  const maxAmt = Math.max(...amounts, 0), minAmt = Math.min(...amounts, 0);
  const topChance = box ? box.rewards.find(r => r.amount === maxAmt).weight / total * 100 : 0;
  const reason = box ? gateReason(status, 'box', box.cost) : 'Loading…';
  void top;

  const open = async () => {
    if (opening || reason) return;
    setOpening(true); setMsg(''); setResult(null);
    const t0 = Date.now();
    const res = await play('box', tier);
    if (!res.ok) { setMsg(res.message || 'Could not open the box.'); setOpening(false); reload(); return; }
    setStatus(s => s && { ...s, loyalty_points: res.previous_balance - res.spent });
    setTimeout(() => {
      setOpening(false); setResult(res);
      setStatus(s => s && { ...s, loyalty_points: res.balance, earned_today: s.earned_today + res.earned, boxes_today: s.boxes_today + 1 });
      reload();
    }, Math.max(0, 1700 - (Date.now() - t0)));
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <PlayHeader title="Mystery Box" subtitle="Pick a box, open it, win Loyalty Points." />
      <Balances status={status} />
      {error && <Notice>{error}</Notice>}
      {status && box && (
        <>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '18px 0 6px', scrollbarWidth: 'none' }}>
            {ORDER.map(k => {
              const b = status.config.boxes[k]; const on = tier === k;
              return (
                <button key={k} onClick={() => !opening && setTier(k)} style={{
                  flexShrink: 0, minWidth: 92, padding: '10px 8px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                  border: on ? `2px solid ${COLOR[k]}` : '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)',
                }}>
                  <Gift size={22} color={COLOR[k]} />
                  <div style={{ fontSize: 12, fontWeight: 800, marginTop: 4 }}>{b.label.replace(' Box', '')}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{fmt(b.cost)} pts</div>
                </button>
              );
            })}
          </div>

          <div className="card" style={{ padding: 18, textAlign: 'center', marginTop: 8 }}>
            <div className={opening ? 'pt-shake' : ''} style={{ display: 'inline-flex', width: 84, height: 84, borderRadius: 24, alignItems: 'center', justifyContent: 'center', background: COLOR[tier] }}>
              <Gift size={44} color="#fff" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '12px 0 8px' }}>Mystery Box: {box.label.replace(' Box', '')}</h3>
            <div style={{ fontSize: 13.5, lineHeight: 1.9 }}>
              <div>Cost: <b>{fmt(box.cost)} Loyalty Points</b></div>
              <div>Reward: <b>{fmt(minAmt)}–{fmt(maxAmt)} Loyalty Points</b></div>
              <div>Highest Reward Chance: <b>{topChance % 1 === 0 ? topChance : topChance.toFixed(1)}%</b></div>
            </div>
          </div>

          {(msg || reason) && <Notice>{msg || reason}</Notice>}
          <div style={{ marginTop: 14 }}>
            <BigButton disabled={opening || !!reason} onClick={open}>{opening ? 'Opening…' : 'OPEN BOX'}</BigButton>
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 8 }}>Boxes opened today: {status.boxes_today} / {status.config.limits.daily_boxes}</p>

          <h3 style={{ fontSize: 15, fontWeight: 800, margin: '22px 0 8px' }}>Reward chances</h3>
          <div className="card" style={{ padding: '4px 14px' }}>
            {box.rewards.map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', fontSize: 13, borderBottom: i === box.rewards.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <span style={{ fontWeight: 700 }}>{fmt(r.amount)} Loyalty Points</span>
                <span style={{ color: 'var(--muted)' }}>{((r.weight / total) * 100).toFixed(r.weight / total < 0.01 ? 2 : 0)}%</span>
              </div>
            ))}
          </div>
        </>
      )}
      {result && (
        <ResultModal title={`${result.label} opened`} big={`+${fmt(result.reward)}`} sub={`Loyalty Points · Net ${result.reward - result.spent >= 0 ? '+' : ''}${fmt(result.reward - result.spent)} after the ${fmt(result.spent)} cost`}
          actionLabel="Open another" onAction={() => setResult(null)} onClose={() => setResult(null)} />
      )}
    </div>
  );
}
