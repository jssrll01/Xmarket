import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'];

export default function BarcodeScanner({ onCode, onClose }) {
  const vid = useRef(null);
  const [err, setErr] = useState('');
  const [manual, setManual] = useState('');
  const supported = typeof window !== 'undefined' && 'BarcodeDetector' in window;

  useEffect(() => {
    if (!supported) return undefined;
    let stream = null, timer = null, stop = false;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
        const v = vid.current;
        v.srcObject = stream;
        await v.play();
        let det;
        try { det = new window.BarcodeDetector({ formats: FORMATS }); } catch (e) { det = new window.BarcodeDetector(); }
        const tick = async () => {
          if (stop) return;
          try {
            const r = await det.detect(v);
            if (r && r[0] && r[0].rawValue) { try { if (navigator.vibrate) navigator.vibrate(30); } catch (e) {} onCode(r[0].rawValue); return; }
          } catch (e) {}
          timer = setTimeout(tick, 200);
        };
        tick();
      } catch (e) { setErr('Camera is not available. Allow camera access, or type the digits below.'); }
    })();
    return () => { stop = true; clearTimeout(timer); if (stream) stream.getTracks().forEach((t) => t.stop()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 6000, background: 'rgba(15,23,42,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#fff', borderRadius: 22, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <b style={{ fontSize: 17 }}>Scan a barcode</b>
          <button type="button" onClick={onClose} aria-label="Close" style={{ padding: 6 }}><X size={20} /></button>
        </div>
        {supported ? (
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#0F172A', aspectRatio: '4 / 3' }}>
            <video ref={vid} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', left: '10%', right: '10%', top: '38%', height: '24%', border: '2px solid #fff', borderRadius: 12, boxShadow: '0 0 0 999px rgba(15,23,42,.35)' }} />
          </div>
        ) : (
          <div style={{ fontSize: 13, color: '#64748B', padding: '4px 0 10px' }}>Live scanning is not supported in this browser. Type the digits printed under the barcode.</div>
        )}
        {err && <div style={{ color: '#DC2626', fontSize: 12.5, marginTop: 8 }}>{err}</div>}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input value={manual} inputMode="numeric" onChange={(e) => setManual(e.target.value)} placeholder="Or type the barcode number" style={{ flex: 1, padding: 11, fontSize: 14, minWidth: 0 }} />
          <button type="button" className="btn-primary" disabled={manual.trim().length < 4} onClick={() => onCode(manual.trim())} style={{ padding: '0 16px', fontWeight: 800 }}>Find</button>
        </div>
      </div>
    </div>
  );
}
