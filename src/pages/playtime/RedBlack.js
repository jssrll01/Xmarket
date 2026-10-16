import React from 'react';
import { useMini, MiniFrame, Choices } from './miniCommon';

const rank = (n) => ({ 1: 'A', 11: 'J', 12: 'Q', 13: 'K' }[n] || String(n));
const SUIT = { hearts: '♥', diamonds: '♦', spades: '♠', clubs: '♣' };

export default function RedBlack() {
  const m = useMini('redblack');
  const done = m.res && !m.busy;
  const red = done && (m.res.suit === 'hearts' || m.res.suit === 'diamonds');
  return (
    <MiniFrame m={m} title="Red or Black" howTo={["Choose Red or Black.", "Enter your bet, or tap a quick amount.", "Press Play. A card is drawn from a standard deck.", "If the card color matches, you get back 1.8x your bet."]}>
      <div style={{ textAlign: 'center' }}>
        <div className={m.busy ? 'pt-pulse' : ''} style={{
          width: 96, height: 134, borderRadius: 14, margin: '0 auto', background: '#fff', border: '1px solid var(--border)',
          boxShadow: '0 8px 20px rgba(0,0,0,.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, color: done ? (red ? '#DC2626' : '#1E293B') : '#94A3B8',
        }}>
          <div style={{ fontSize: 38 }}>{done ? rank(m.res.rank) : '?'}</div>
          <div style={{ fontSize: 34 }}>{done ? SUIT[m.res.suit] : ''}</div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12, fontWeight: 700 }}>
          {done ? `The card was ${m.res.outcome}` : 'Will the card be red or black?'}
        </div>
      </div>
      <Choices options={[{ value: 'red', label: 'Red' }, { value: 'black', label: 'Black' }]} value={m.choice} onChange={m.setChoice} disabled={m.busy} />
    </MiniFrame>
  );
}
