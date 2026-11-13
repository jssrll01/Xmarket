import { money } from '../lib/currency';
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { rpcPin } from '../lib/pinBus';

const peso = (n) => money(n, 'fixed');
const left = (iso) => {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return null;
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? h + 'h ' + m + 'm' : m + 'm';
};

const css = '@keyframes rpPop{0%{transform:scale(.85);opacity:0}100%{transform:none;opacity:1}}';

export function PacketBubble({ m, onClaimed, onToast }) {
  const p = m.packet;
  const [sheet, setSheet] = useState(null);
  const [busy, setBusy] = useState(false);
  const [thx, setThx] = useState(false);
  const [thanked, setThanked] = useState(!!(m.packet && m.packet.thanked));
  if (!p) return <div style={{ padding: 12, fontSize: 13, color: 'var(--muted)' }}>🧧 Red packet (expired)</div>;

  const expired = p.status === 'refunded' || (p.status === 'open' && !left(p.expires_at));
  const canClaim = !p.mine && p.status === 'open' && !expired;
  const state = p.status === 'claimed' ? 'Claimed' : expired ? 'Expired' : p.mine ? 'Waiting to be claimed' : 'Tap to open';

  const claim = async () => {
    if (!canClaim || busy) return;
    setBusy(true);
    const { data, error } = await supabase.rpc('dm_packet_claim', { p_packet: p.id });
    setBusy(false);
    if (error) { onToast(error.message); return; }
    if (!data || !data.ok) { onToast((data && data.error) || 'Could not claim.'); onClaimed(); return; }
    setSheet(data.amount);
    onClaimed();
  };

  const thank = async () => {
    if (thx) return;
    setThx(true);
    const { data, error } = await supabase.rpc('dm_packet_thank', { p_packet: p.id });
    if (error || !data || !data.ok) { setThx(false); onToast((error && error.message) || (data && data.error) || 'Could not send.'); return; }
    setThanked(true); onClaimed(); onToast('Thank-you sent');
  };

  return (
    <>
      <style>{css}</style>
      <div onClick={claim} role={canClaim ? 'button' : undefined} style={{ width: 210, borderRadius: 18, overflow: 'hidden', cursor: canClaim ? 'pointer' : 'default', opacity: p.status === 'open' && !expired ? 1 : 0.6, boxShadow: '0 10px 22px -14px rgba(220,38,38,.8)' }}>
        <div style={{ padding: '14px 14px 10px', background: 'linear-gradient(135deg,#EF4444,#DC2626)', color: '#fff' }}>
          <div style={{ fontSize: 30, lineHeight: 1 }}>🧧</div>
          <div style={{ fontWeight: 800, fontSize: 15, marginTop: 6 }}>{p.note || 'Good luck!'}</div>
        </div>
        <div style={{ padding: '7px 14px', background: '#FEF3C7', color: '#92400E', fontSize: 11.5, fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
          <span>{busy ? 'Opening…' : state}</span>
          {p.status === 'open' && !expired && <span>{left(p.expires_at)} left</span>}
        </div>
      </div>
      {sheet !== null && (
        <div onClick={() => setSheet(null)} style={{ position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(15,23,42,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 320, borderRadius: 24, background: '#fff', padding: 24, textAlign: 'center', animation: 'rpPop .22s ease-out both' }}>
            <div style={{ fontSize: 54 }}>🧧</div>
            <div style={{ fontSize: 15, fontWeight: 800, marginTop: 6 }}>You received a red packet!</div>
            <div style={{ fontSize: 34, fontWeight: 900, color: '#DC2626', margin: '8px 0' }}>{peso(sheet)}</div>
            <button className="btn-primary" onClick={() => setSheet(null)} style={{ width: '100%', marginTop: 10, padding: 13, fontWeight: 800 }}>Done</button>
          </div>
        </div>
      )}
    </>
  );
}

export function PacketCreate({ thread, onClose, onDone, onToast }) {
  const [amt, setAmt] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const send = async () => {
    const a = Number(amt);
    if (!a || a < 1 || a > 5000) { onToast('Enter ₱1 to ₱5,000.'); return; }
    setBusy(true);
    const { data, error } = await rpcPin('dm_packet_create', { p_thread: thread, p_amount: a, p_note: note || null });
    setBusy(false);
    if (error) { onToast(error.message); return; }
    if (!data || !data.ok) { onToast((data && data.error) || 'Could not send.'); return; }
    onDone();
  };
  const inp = { width: '100%', padding: 12, marginTop: 6, marginBottom: 12, fontSize: 14 };
  const lbl = { fontSize: 12, fontWeight: 700, color: 'var(--muted)' };
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(15,23,42,.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 560, background: '#fff', borderRadius: '24px 24px 0 0', padding: '20px 18px calc(18px + env(safe-area-inset-bottom, 0px))' }}>
        <div style={{ fontSize: 18, fontWeight: 900 }}>🧧 Send a red packet</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', margin: '4px 0 14px' }}>The amount is taken from your Xwallet now. If it is not opened within 12 hours it is returned to you.</div>
        <label style={lbl}>Amount (₱1 to ₱5,000)</label>
        <input type="number" inputMode="decimal" value={amt} onChange={(e) => setAmt(e.target.value)} placeholder="0.00" style={inp} />
        <label style={lbl}>Message (optional)</label>
        <input value={note} maxLength={60} onChange={(e) => setNote(e.target.value)} placeholder="Good luck!" style={inp} />
        <button className="btn-primary" disabled={busy} onClick={send} style={{ width: '100%', padding: 14, fontSize: 15, fontWeight: 800 }}>{busy ? 'Sending…' : 'Send red packet'}</button>
        <button onClick={onClose} style={{ width: '100%', marginTop: 8, padding: 10, color: 'var(--muted)', fontWeight: 700 }}>Cancel</button>
      </div>
    </div>
  );
}
