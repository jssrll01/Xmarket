import React from 'react';
import { Send } from 'lucide-react';

const SAMPLE = [
  { name: 'XMARKET', text: 'Welcome to the Global Chat! Say hi to everyone.', time: '9:00 AM', color: '#2563EB' },
  { name: 'Mika', text: 'Hello! Any good deals today?', time: '9:02 AM', color: '#059669' },
  { name: 'Jun', text: 'Check the Flash Sale, it ends tonight.', time: '9:03 AM', color: '#F59E0B' },
  { name: 'Ara', text: 'Thanks! Just grabbed one.', time: '9:05 AM', color: '#DC2626' },
];

const pill = { fontSize: 11, fontWeight: 800, color: '#2563EB', background: 'rgba(37,99,235,.12)', padding: '5px 10px', borderRadius: 999 };

export default function GlobalChat() {
  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Global Chat</h2>
        <span style={pill}>Coming soon</span>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 14px' }}>
        An open forum where every XMARKET user can talk together.
      </p>

      <div className="card" style={{ padding: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          Preview (sample messages)
        </div>

        {SAMPLE.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: m.color, color: '#fff', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {m.name[0]}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>
                {m.name} <span style={{ color: 'var(--muted)', fontWeight: 600 }}> {m.time}</span>
              </div>
              <div style={{ fontSize: 13, background: '#F4F6FA', border: '1px solid var(--border)', borderRadius: '4px 14px 14px 14px', padding: '8px 12px', marginTop: 4, display: 'inline-block' }}>
                {m.text}
              </div>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <input
            disabled
            placeholder="Chat opens soon..."
            style={{ flex: 1, minWidth: 0, padding: '11px 14px', borderRadius: 999, border: '1px solid var(--border)', background: '#F4F6FA', fontSize: 14 }}
          />
          <button disabled className="btn-primary" aria-label="Send" style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, padding: 0 }}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
