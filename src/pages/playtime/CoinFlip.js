import React from 'react';
import { useMini, MiniFrame, Choices } from './miniCommon';

export default function CoinFlip() {
  const m = useMini('coinflip');
  const face = m.busy ? '?' : m.res ? (m.res.outcome === 'heads' ? 'H' : 'T') : 'X';
  return (
    <MiniFrame m={m} title="Head or Tails" howTo={["Choose Heads or Tails.", "Enter your amount, or tap a quick pick.", "Press Toss. The coin flies and the result is decided securely on our servers.", "Win and you get back 1.8x your amount. Lose and it's gone."]}>
      <div style={{ textAlign: 'center' }}>
        <div className={m.busy ? 'pt-flip' : ''} style={{
          width: 110, height: 110, borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44, fontWeight: 900, color: '#92400E', background: 'radial-gradient(circle at 30% 30%, #FDE68A, #F59E0B)',
          boxShadow: '0 10px 24px rgba(245,158,11,.35), inset 0 -4px 8px rgba(0,0,0,.12)',
        }}>{face}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12, fontWeight: 700 }}>
          {m.res && !m.busy ? `It landed on ${m.res.outcome}` : 'Call it: heads or tails'}
        </div>
      </div>
      <Choices options={[{ value: 'heads', label: 'Heads' }, { value: 'tails', label: 'Tails' }]} value={m.choice} onChange={m.setChoice} disabled={m.busy} />
    </MiniFrame>
  );
}
