import React from 'react';
import { useMini, MiniFrame, Choices } from './miniCommon';

const COLORS = [
  { value: 'red', label: 'Red', swatch: '#EF4444' },
  { value: 'blue', label: 'Blue', swatch: '#3B82F6' },
  { value: 'green', label: 'Green', swatch: '#22C55E' },
  { value: 'yellow', label: 'Yellow', swatch: '#FACC15' },
  { value: 'pink', label: 'Pink', swatch: '#EC4899' },
  { value: 'white', label: 'White', swatch: '#F8FAFC' },
];

export default function ColorGame() {
  const m = useMini('color');
  const shown = m.res && !m.busy ? COLORS.find(c => c.value === m.res.outcome) : null;
  return (
    <MiniFrame m={m} title="Color Game Extreme" howTo={["Pick one of the six colors.", "Enter your bet, or tap a quick amount.", "Press Roll the dice. If the winning color matches yours, you win.", "A win returns 1.8x your bet, added to your balance instantly."]}>
      <div style={{ textAlign: 'center' }}>
        <div className={m.busy ? 'pt-pulse' : ''} style={{
          width: 110, height: 110, borderRadius: 28, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 38, fontWeight: 900, color: '#fff', background: shown ? shown.swatch : '#CBD5E1',
          border: '1px solid rgba(0,0,0,.1)', boxShadow: '0 10px 24px rgba(0,0,0,.12)',
        }}>{shown ? '' : '?'}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12, fontWeight: 700 }}>
          {shown ? `The winning color was ${shown.label}` : 'Pick a color, then play'}
        </div>
      </div>
      <Choices options={COLORS} value={m.choice} onChange={m.setChoice} disabled={m.busy} cols={3} />
    </MiniFrame>
  );
}
