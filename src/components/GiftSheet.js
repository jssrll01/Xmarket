import React, { useState } from 'react';
import { rpcPin, showReceipt } from '../lib/pinBus';
import { useToast } from './Toast';

const QUICK = [5, 10, 20, 50, 100];

export default function GiftSheet({ type, id, username, onClose }) {
  const { show } = useToast();
  const [amt, setAmt] = useState(10);
  const [custom, setCustom] = useState('');
  const [busy, setBusy] = useState(false);
  const value = custom !== '' ? Number(custom) : amt;

  const send = async () => {
    if (busy) return;
    if (!value || value < 5) return show('Minimum gift is ₱5.');
    if (value > 10000) return show('Maximum gift is ₱10,000.');
    setBusy(true);
    const { data, error } = await rpcPin('gift_creator', { p_type: type, p_id: id, p_amount: value });
    setBusy(false);
    if (error) return show(error.message);
    if (!data || !data.ok) { if (!data || data.error !== 'Cancelled') show((data && data.error) || 'Could not send.'); return; }
    onClose();
    show('Gift sent');
    if (data.receipt) showReceipt(data.receipt);
  };

  const chip = (on) => ({ padding: '10px 16px', borderRadius: 99, fontWeight: 800, fontSize: 14, border: '1px solid ' + (on ? '#2563EB' : '#CBD5E1'), background: on ? '#2563EB' : '#fff', color: on ? '#fff' : '#334155' });
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(15,23,42,.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 560, background: '#fff', color: '#0f172a', borderRadius: '24px 24px 0 0', padding: '20px 18px calc(18px + env(safe-area-inset-bottom, 0px))' }}>
        <div style={{ fontSize: 18, fontWeight: 900 }}>🎁 Gift @{username}</div>
        <div style={{ fontSize: 12.5, color: '#64748B', margin: '4px 0 14px' }}>The amount is taken from your Xwallet. Your 4-digit PIN is required.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {QUICK.map((q) => <button key={q} type="button" onClick={() => { setAmt(q); setCustom(''); }} style={chip(custom === '' && amt === q)}>₱{q}</button>)}
        </div>
        <input type="number" inputMode="decimal" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Custom amount (min ₱5)" style={{ width: '100%', padding: 12, fontSize: 14, marginBottom: 12 }} />
        <button className="btn-primary" disabled={busy} onClick={send} style={{ width: '100%', padding: 14, fontSize: 15, fontWeight: 800 }}>{busy ? 'Sending…' : 'Send ₱' + (value > 0 ? value : 0)}</button>
        <button onClick={onClose} style={{ width: '100%', marginTop: 8, padding: 10, color: '#64748B', fontWeight: 700 }}>Cancel</button>
      </div>
    </div>
  );
}
