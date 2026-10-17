import React, { useState } from 'react';
import { BoxIcon } from './GameIcons';
import { play, fmt } from '../../lib/playtime';
import { usePlay, gateReason, PlayHeader, Balances, BigButton, Notice, ResultModal, GameInfo } from './common';

export default function MysteryBox() {
  const { status, setStatus, error, reload } = usePlay();
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState('');

  const box = status && status.config.boxes ? status.config.boxes.mystery : null;
  const amounts = box ? box.rewards.map(r => r.amount) : [];
  const reason = box ? gateReason(status, 'box', box.cost) : 'Loading…';

  const open = async () => {
    if (opening || reason) return;
    setOpening(true); setMsg(''); setResult(null);
    const t0 = Date.now();
    const res = await play('box', 'mystery');
    if (!res.ok) { setMsg(res.message || 'Could not open the box.'); setOpening(false); reload(); return; }
    setStatus(s => s && { ...s, loyalty_points: res.previous_balance - res.spent });
    setTimeout(() => {
      setOpening(false); setResult(res);
      setStatus(s => s && { ...s, loyalty_points: res.balance });
      reload();
    }, Math.max(0, 1700 - (Date.now() - t0)));
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <PlayHeader title="Box of Mystery" subtitle="Every box hides a prize. Open yours and win up to 10x! 🎁" />
      <Balances status={status} />
      {error && <Notice>{error}</Notice>}
      {status && box && (
        <>
          <div className="card" style={{ padding: 20, textAlign: 'center', marginTop: 20 }}>
            <div className={opening ? 'pt-shake' : ''} style={{ display: 'inline-flex', width: 96, height: 96, borderRadius: 28, alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#F59E0B,#EF4444)', boxShadow: '0 10px 24px rgba(239,68,68,.3)' }}>
              <BoxIcon size={50} color="#fff" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '14px 0 8px' }}>Box of Mystery</h3>
            <div style={{ fontSize: 13.5, lineHeight: 1.9 }}>
              <div>Cost: <b>{fmt(box.cost)} Loyalty Points</b></div>
              <div>Reward: <b>{fmt(Math.min(...amounts))} to {fmt(Math.max(...amounts))} Loyalty Points</b></div>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6 }}>Results are decided securely on our servers.</div>
          </div>

          {(msg || reason) && <Notice>{msg || reason}</Notice>}
          <div style={{ marginTop: 14 }}>
            <BigButton disabled={opening || !!reason} onClick={open}>{opening ? 'Opening…' : 'OPEN BOX'}</BigButton>
          </div>
          <GameInfo game="box" refresh={status.loyalty_points} steps={[
            `Each box costs ${fmt(box.cost)} Loyalty Points.`,
            'Press OPEN BOX and wait for the reveal.',
            'Your reward is added to your balance right away.',
            'Open as many boxes as your balance allows.',
          ]} />
        </>
      )}
      {result && (
        <ResultModal title="Box of Mystery opened" big={`+${fmt(result.reward)}`} sub={`Loyalty Points · Net ${result.reward - result.spent >= 0 ? '+' : ''}${fmt(result.reward - result.spent)} after the ${fmt(result.spent)} cost`}
          actionLabel="Open another" onAction={() => setResult(null)} onClose={() => setResult(null)} />
      )}
    </div>
  );
}
