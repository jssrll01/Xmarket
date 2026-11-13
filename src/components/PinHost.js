import { money } from '../lib/currency';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { bus } from '../lib/pinBus';

const box = { position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(15,23,42,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 };
const card = { width: '100%', maxWidth: 340, background: '#fff', borderRadius: 22, padding: 22, textAlign: 'center' };
const inp = { width: '100%', padding: 13, fontSize: 22, letterSpacing: 10, textAlign: 'center', marginBottom: 10 };
const digits = (s) => String(s).replace(/\D/g, '').slice(0, 4);
const peso = (n) => money(n, 'fixed');
const LABEL = { transfer: 'Send Money', withdraw: 'Withdrawal', load: 'Buy Load', market: 'Market Shop' };

function SetForm({ onDone }) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!/^\d{4}$/.test(a)) return setErr('PIN must be 4 digits.');
    if (a !== b) return setErr('PINs do not match.');
    setBusy(true);
    const { data, error } = await supabase.rpc('xwallet_pin_set', { p_pin: a, p_old: null });
    setBusy(false);
    if (error) return setErr(error.message);
    if (!data.ok) return setErr(data.error);
    onDone(a);
  };
  return (
    <>
      <input type="password" inputMode="numeric" autoComplete="off" placeholder="New PIN" value={a} onChange={(e) => setA(digits(e.target.value))} style={inp} />
      <input type="password" inputMode="numeric" autoComplete="off" placeholder="Repeat PIN" value={b} onChange={(e) => setB(digits(e.target.value))} style={inp} />
      {err && <div style={{ color: '#DC2626', fontSize: 12.5, marginBottom: 8 }}>{err}</div>}
      <button className="btn-primary" disabled={busy} onClick={save} style={{ width: '100%', padding: 13, fontWeight: 800 }}>{busy ? 'Saving…' : 'Set PIN'}</button>
    </>
  );
}

export function PinGate() {
  const [need, setNeed] = useState(false);
  useEffect(() => {
    supabase.rpc('xwallet_pin_status').then(({ data }) => { if (data && data.ok && !data.has_pin) setNeed(true); });
  }, []);
  if (!need) return null;
  return (
    <div style={box}><div style={card}>
      <div style={{ fontSize: 38 }}>🔒</div>
      <div style={{ fontWeight: 900, fontSize: 18, margin: '6px 0' }}>Secure your Xwallet</div>
      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.5 }}>Set a 4-digit PIN. You will need it to send money, withdraw and buy load.</div>
      <SetForm onDone={() => setNeed(false)} />
    </div></div>
  );
}

async function makeBlob(r) {
  const c = document.createElement('canvas');
  c.width = 720; c.height = 1000;
  const x = c.getContext('2d');
  x.fillStyle = '#2563EB'; x.fillRect(0, 0, 720, 1000);
  x.fillStyle = '#fff'; x.fillRect(40, 120, 640, 840);
  x.textAlign = 'center';
  x.font = '800 40px sans-serif'; x.fillText('XMARKET', 360, 80);
  x.fillStyle = '#059669'; x.beginPath(); x.arc(360, 200, 38, 0, 7); x.fill();
  x.fillStyle = '#fff'; x.font = '800 44px sans-serif'; x.fillText('✓', 360, 215);
  x.fillStyle = '#0F172A'; x.font = '800 30px sans-serif'; x.fillText('Transaction Successful', 360, 290);
  x.font = '900 60px sans-serif'; x.fillText(peso(r.total), 360, 370);
  const rows = [['Type', LABEL[r.kind] || r.kind], ['To', r.party || '-'], ['Amount', peso(r.amount)], ['Fee', peso(r.fee)],
    ['Date', new Date(r.created_at).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })], ['Receipt no.', r.receipt_no]];
  let y = 450;
  rows.forEach(([k, v]) => {
    x.textAlign = 'left'; x.fillStyle = '#64748B'; x.font = '600 24px sans-serif'; x.fillText(k, 80, y);
    x.textAlign = 'right'; x.fillStyle = '#0F172A'; x.font = '700 24px sans-serif'; x.fillText(String(v).slice(0, 28), 640, y);
    x.fillStyle = '#E2E8F0'; x.fillRect(80, y + 20, 560, 2);
    y += 72;
  });
  x.textAlign = 'center'; x.fillStyle = '#94A3B8'; x.font = '600 20px sans-serif'; x.fillText('Thank you for using XMARKET Xwallet', 360, 930);
  return new Promise((res) => c.toBlob(res, 'image/png'));
}

export default function PinHost() {
  const [req, setReq] = useState(null);
  const [pin, setPin] = useState('');
  const [rc, setRc] = useState(null);
  const [img, setImg] = useState(null);

  useEffect(() => {
    bus.ask = async (resolve) => {
      const { data } = await supabase.rpc('xwallet_pin_status');
      setPin('');
      setReq({ resolve, mode: data && data.ok && !data.has_pin ? 'set' : 'verify' });
    };
    bus.receipt = (r) => setRc(r);
    return () => { bus.ask = null; bus.receipt = null; };
  }, []);

  useEffect(() => {
    if (!rc) { setImg(null); return undefined; }
    let url = null;
    makeBlob(rc).then((b) => { url = URL.createObjectURL(b); setImg({ url, blob: b }); });
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [rc]);

  const done = (v) => { if (req) req.resolve(v); setReq(null); };
  const share = async () => {
    if (!img) return;
    const f = new File([img.blob], rc.receipt_no + '.png', { type: 'image/png' });
    try {
      if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title: 'XMARKET receipt' }); return; }
    } catch (e) { return; }
    const a = document.createElement('a'); a.href = img.url; a.download = rc.receipt_no + '.png'; a.click();
  };

  return (
    <>
      {req && (
        <div style={box}><div style={card}>
          <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>{req.mode === 'set' ? 'Set your Xwallet PIN' : 'Enter your PIN'}</div>
          {req.mode === 'set' ? (
            <>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Create a 4-digit PIN to continue.</div>
              <SetForm onDone={(p) => done(p)} />
            </>
          ) : (
            <>
              <input autoFocus type="password" inputMode="numeric" autoComplete="off" placeholder="••••" value={pin} onChange={(e) => setPin(digits(e.target.value))} style={{ ...inp, margin: '12px 0' }} />
              <button className="btn-primary" disabled={pin.length !== 4} onClick={() => done(pin)} style={{ width: '100%', padding: 13, fontWeight: 800 }}>Confirm</button>
            </>
          )}
          <button onClick={() => done(null)} style={{ width: '100%', marginTop: 8, padding: 10, color: 'var(--muted)', fontWeight: 700 }}>Cancel</button>
        </div></div>
      )}
      {rc && (
        <div style={box} onClick={() => setRc(null)}><div style={{ ...card, maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
          {img ? <img decoding="async" src={img.url} alt="Receipt" style={{ width: '100%', borderRadius: 12, marginBottom: 12 }} /> : <div style={{ padding: 40 }}>Preparing receipt…</div>}
          <button className="btn-primary" onClick={share} style={{ width: '100%', padding: 13, fontWeight: 800 }}>Share or save receipt</button>
          <button onClick={() => setRc(null)} style={{ width: '100%', marginTop: 8, padding: 10, color: 'var(--muted)', fontWeight: 700 }}>Close</button>
        </div></div>
      )}
    </>
  );
}
