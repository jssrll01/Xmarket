import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Shell, SignIn, peso } from './ui';
import useWallet from './useWallet';

const cleanAmt = (v) => { const n = Number(v); return n > 0 && n <= 1000000 ? Math.round(n * 100) / 100 : ''; };

export default function XwQr() {
  const { user } = useWallet();
  const nav = useNavigate();
  const [tab, setTab] = useState('mine');
  const [amt, setAmt] = useState('');
  const [img, setImg] = useState('');
  const [err, setErr] = useState('');
  const vid = useRef(null);
  const email = user && user.email;

  useEffect(() => {
    if (!email) return;
    const a = cleanAmt(amt);
    const url = window.location.origin + '/xwallet/send?to=' + encodeURIComponent(email) + (a ? '&amt=' + a : '');
    QRCode.toDataURL(url, { width: 520, margin: 1, color: { dark: '#1D4ED8', light: '#FFFFFF' } }).then(setImg).catch(() => setImg(''));
  }, [email, amt]);

  useEffect(() => {
    if (tab !== 'scan') return undefined;
    let stream; let timer; let alive = true;
    setErr('');
    (async () => {
      if (!('BarcodeDetector' in window)) { setErr('Scanning is not supported in this browser. Use your phone camera app on the QR, or type the email on the Send page.'); return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (!alive) { stream.getTracks().forEach((t) => t.stop()); return; }
        vid.current.srcObject = stream; await vid.current.play();
        const det = new window.BarcodeDetector({ formats: ['qr_code'] });
        timer = setInterval(async () => {
          try {
            const r = await det.detect(vid.current);
            if (!r.length) return;
            const u = new URL(r[0].rawValue);
            const to = u.searchParams.get('to');
            if (u.pathname !== '/xwallet/send' || !to || !to.includes('@')) { setErr('This is not an XMARKET payment QR.'); return; }
            const a = cleanAmt(u.searchParams.get('amt'));
            clearInterval(timer);
            nav('/xwallet/send?to=' + encodeURIComponent(to) + (a ? '&amt=' + a : ''));
          } catch (e) { /* keep scanning */ }
        }, 400);
      } catch (e) { setErr('Camera access was blocked. Allow the camera and try again.'); }
    })();
    return () => { alive = false; clearInterval(timer); if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, [tab, nav]);

  if (!user) return <SignIn />;
  const tb = (k, l) => <button onClick={() => setTab(k)} style={{ flex: 1, padding: 11, borderRadius: 10, fontWeight: 700, fontSize: 13.5, background: tab === k ? '#2563EB' : '#fff', color: tab === k ? '#fff' : '#1D4ED8', border: '1px solid #BFDBFE' }}>{l}</button>;
  return (
    <Shell title="Pay by QR">
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>{tb('mine', 'My QR / Request')}{tb('scan', 'Scan to pay')}</div>
      <div className="card" style={{ padding: 16, textAlign: 'center' }}>
        {tab === 'mine' && (<>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>Others scan this to send money to you{cleanAmt(amt) ? ' (' + peso(cleanAmt(amt)) + ' requested)' : ''}.</div>
          {img ? <img src={img} alt="Your payment QR" style={{ width: '100%', maxWidth: 280, borderRadius: 14, border: '1px solid #BFDBFE' }} /> : <div className="sk" style={{ height: 260, borderRadius: 14 }} />}
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>{email}</div>
          <input type="number" inputMode="decimal" value={amt} onChange={(e) => setAmt(e.target.value)} placeholder="Request an amount (optional)" style={{ width: '100%', padding: 12, marginTop: 12, fontSize: 14 }} />
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>This QR contains your account email. Only share it with people you want to be paid by.</div>
        </>)}
        {tab === 'scan' && (<>
          <video ref={vid} muted playsInline style={{ width: '100%', borderRadius: 14, background: '#0F172A', minHeight: 240 }} />
          <div style={{ fontSize: 13, color: err ? '#DC2626' : 'var(--muted)', marginTop: 10 }}>{err || 'Point the camera at an XMARKET payment QR. You will confirm the amount before anything is sent.'}</div>
        </>)}
      </div>
    </Shell>
  );
}
