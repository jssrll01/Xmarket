import React, { useRef, useState } from 'react';
import { play, fmt } from '../../lib/playtime';
import { usePlay, gateReason, PlayHeader, Balances, BigButton, Notice, ResultModal, GameInfo } from './common';

const COLORS = ['#2563EB', '#7C3AED', '#0EA5E9', '#6366F1'];

function Wheel({ rewards, rotation, spinning }) {
  const n = rewards.length, seg = 360 / n, cx = 150, cy = 150, r = 140;
  const pt = (a, rad) => [cx + rad * Math.sin(a * Math.PI / 180), cy - rad * Math.cos(a * Math.PI / 180)];
  return (
    <div style={{ position: 'relative', width: 300, maxWidth: '100%', margin: '0 auto' }}>
      <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', zIndex: 2, width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderTop: '22px solid #F59E0B', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.3))' }} />
      <svg viewBox="0 0 300 300" style={{ width: '100%', display: 'block', transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 4.2s cubic-bezier(.12,.6,.1,1)' : 'none', filter: 'drop-shadow(0 8px 18px rgba(37,99,235,.25))' }}>
        {rewards.map((rw, i) => {
          const a1 = i * seg, a2 = (i + 1) * seg, mid = (a1 + a2) / 2;
          const [x1, y1] = pt(a1, r), [x2, y2] = pt(a2, r), [tx, ty] = pt(mid, r * 0.66);
          return (
            <g key={i}>
              <path d={`M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth="2" />
              <text x={tx} y={ty} fill="#fff" fontSize="13" fontWeight="800" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${mid} ${tx} ${ty})`}>{fmt(rw.amount)}</text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r="22" fill="#fff" />
      </svg>
    </div>
  );
}

export default function Spin() {
  const { status, setStatus, error, reload } = usePlay();
  const rotRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState('');

  const cfg = status ? status.config.spin : null;
  const rewards = cfg ? cfg.rewards : [];
  const cost = cfg ? cfg.cost : 5;
  const reason = status ? gateReason(status, 'spin', cost) : 'Loading…';
  const amounts = rewards.map(r => r.amount);

  const spin = async () => {
    if (busy || reason) return;
    setBusy(true); setMsg(''); setResult(null);
    const res = await play('spin');
    if (!res.ok) { setMsg(res.message || 'Could not spin.'); setBusy(false); reload(); return; }
    // The result is already final on the server; the wheel only animates it.
    setStatus(s => s && { ...s, loyalty_points: res.previous_balance - res.spent });
    const seg = 360 / rewards.length;
    const next = Math.ceil(rotRef.current / 360) * 360 + 360 * 5 + (360 - (res.index + 0.5) * seg);
    rotRef.current = next;
    setSpinning(true); setRotation(next);
    setTimeout(() => {
      setSpinning(false); setResult(res); setBusy(false);
      setStatus(s => s && { ...s, loyalty_points: res.balance });
      reload();
    }, 4400);
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <PlayHeader title="Wheels of Fortune" subtitle={`Win up to 20x! Each spin costs ${fmt(cost)} Loyalty Points. Feeling lucky?`} />
      <Balances status={status} />
      {error && <Notice>{error}</Notice>}
      {status && (
        <>
          <div style={{ margin: '26px 0 20px' }}><Wheel rewards={rewards} rotation={rotation} spinning={spinning} /></div>
          <div className="card" style={{ padding: 14, marginBottom: 12, fontSize: 13, lineHeight: 1.9 }}>
            <div>Cost per spin: <b>{fmt(cost)} Loyalty Points</b></div>
            <div>Rewards: <b>{fmt(Math.min(...amounts))} to {fmt(Math.max(...amounts))} Loyalty Points</b></div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>Results are decided securely on our servers.</div>
          </div>
          {(msg || reason) && <Notice>{msg || reason}</Notice>}
          <BigButton disabled={busy || !!reason} onClick={spin}>{busy ? 'Spinning…' : 'Spin Your Fortune'}</BigButton>
          <GameInfo game="spin" refresh={status.loyalty_points} steps={[
            `Each spin costs ${fmt(cost)} Loyalty Points.`,
            'Press Spin Your Fortune. The wheel stops on your prize.',
            'The prize is added to your balance instantly.',
            'Exchange your points for XWallet any time at 1 point = ₱1.',
          ]} />
        </>
      )}
      {result && (
        <ResultModal title="You won" big={`+${fmt(result.reward)}`} sub={`Loyalty Points · Net ${result.reward - result.spent >= 0 ? '+' : ''}${fmt(result.reward - result.spent)} after the ${fmt(result.spent)} entry`}
          actionLabel="Spin again" onAction={() => setResult(null)} onClose={() => setResult(null)} />
      )}
    </div>
  );
}
