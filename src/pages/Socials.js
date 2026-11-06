import React from 'react';
import { Play, Heart, MessageCircle, Share2 } from 'lucide-react';

const pill = { fontSize: 11, fontWeight: 800, color: '#2563EB', background: 'rgba(37,99,235,.12)', padding: '5px 10px', borderRadius: 999 };
const act = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#fff', fontSize: 11, fontWeight: 700 };
const actIcon = { width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' };

export default function Socials() {
  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Socials</h2>
        <span style={pill}>Coming soon</span>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 14px' }}>
        Watch short videos from the community.
      </p>

      <div style={{ height: 'min(64vh, 560px)', aspectRatio: '9 / 16', margin: '0 auto', borderRadius: 22, position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 100%)', boxShadow: '0 16px 32px -18px rgba(15,23,42,.6)' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Play size={30} fill="#fff" />
          </div>
        </div>

        <div style={{ position: 'absolute', right: 12, bottom: 70, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={act}><span style={actIcon}><Heart size={20} /></span>0</div>
          <div style={act}><span style={actIcon}><MessageCircle size={20} /></span>0</div>
          <div style={act}><span style={actIcon}><Share2 size={20} /></span>Share</div>
        </div>

        <div style={{ position: 'absolute', left: 14, right: 70, bottom: 16, color: '#fff' }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>@xmarket</div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>Your video will play here</div>
        </div>
      </div>
    </div>
  );
}
