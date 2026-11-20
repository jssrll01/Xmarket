import React, { useState } from 'react';
import { usePrefs } from '../../lib/prefs';
import { Card } from './PrefUi';

const THEMES = [['light', 'Light'], ['dark', 'Dark'], ['system', 'System']];

export default function PrefAppearance() {
  const [p, set] = usePrefs();
  const [v, setV] = useState(p.font);
  const commit = () => set({ font: v });
  return (
    <Card title="Appearance">
      <div role="radiogroup" aria-label="Theme" style={{ display: 'flex', gap: 6, background: '#F1F5F9', padding: 4, borderRadius: 14 }}>
        {THEMES.map(([k, l]) => (
          <button key={k} type="button" role="radio" aria-checked={p.theme === k} onClick={() => set({ theme: k })}
            style={{ flex: 1, padding: '9px 4px', borderRadius: 11, fontWeight: 700, fontSize: 14, background: p.theme === k ? '#fff' : 'transparent', boxShadow: p.theme === k ? '0 1px 4px rgba(15,23,42,.15)' : 'none' }}>{l}</button>
        ))}
      </div>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <b style={{ fontSize: 15 }}>Text size</b><span style={{ color: 'var(--muted, #64748B)' }}>{v}%</span>
      </div>
      <input type="range" min="85" max="130" step="5" value={v} aria-label="Text size" style={{ width: '100%', marginTop: 8 }}
        onChange={(e) => setV(Number(e.target.value))} onPointerUp={commit} onKeyUp={commit} onBlur={commit} />
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted, #64748B)' }}><span style={{ fontSize: 12 }}>A</span><span style={{ fontSize: 22 }}>A</span></div>
      {p.font !== 100 && <button type="button" className="link" style={{ color: '#2563EB', fontWeight: 700, marginTop: 6 }} onClick={() => { setV(100); set({ font: 100 }); }}>Reset to 100%</button>}
    </Card>
  );
}
