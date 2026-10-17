import React from 'react';
import { useMini, MiniFrame, Choices } from './miniCommon';

const rank = (n) => ({ 1: 'A', 11: 'J', 12: 'Q', 13: 'K' }[n] || String(n));

function Card({ text, pulse }) {
  return (
    <div className={pulse ? 'pt-pulse' : ''} style={{
      width: 84, height: 118, borderRadius: 14, background: '#fff', border: '1px solid var(--border)',
      boxShadow: '0 8px 20px rgba(0,0,0,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 38, fontWeight: 900, color: text === '?' ? '#94A3B8' : '#1E293B',
    }}>{text}</div>
  );
}

export default function HiLo() {
  const m = useMini('hilo');
  const done = m.res && !m.busy;
  return (
    <MiniFrame m={m} title="Hilo" howTo={["A card is drawn. Ace is the lowest and King is the highest.", "Choose whether the next card will be Higher or Lower.", "Enter your bet and press Deal.", "A correct guess returns 1.8x your bet."]}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <Card text={done ? rank(m.res.cur) : '?'} pulse={m.busy} />
          <span style={{ fontSize: 22, color: 'var(--muted)' }}>→</span>
          <Card text={done ? rank(m.res.next) : '?'} pulse={m.busy} />
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12, fontWeight: 700 }}>
          {done ? `${rank(m.res.cur)} then ${rank(m.res.next)}: ${m.res.outcome === 'hi' ? 'Higher' : 'Lower'}` : 'Will the next card be higher or lower? (A is lowest, K is highest)'}
        </div>
      </div>
      <Choices options={[{ value: 'hi', label: 'Higher' }, { value: 'lo', label: 'Lower' }]} value={m.choice} onChange={m.setChoice} disabled={m.busy} />
    </MiniFrame>
  );
}
