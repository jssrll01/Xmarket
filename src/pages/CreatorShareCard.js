import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';

const IMG = 'https://res.cloudinary.com/bvw3okdf/image/upload/v1794045447/f7wp6kuxtrauehi6dbiw.jpg';

export default function CreatorShareCard() {
  const nav = useNavigate();
  const { show } = useToast();
  const cv = useRef(null);
  const [code, setCode] = useState(null);
  const [state, setState] = useState(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    supabase.rpc('creator_my_application').then(({ data }) => {
      const a = data && data.application;
      setState(a ? a.status : 'none');
      setCode(a && a.referral_code ? a.referral_code : '');
    });
  }, []);

  useEffect(() => {
    if (!code || state !== 'approved') return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = cv.current; if (!c) return;
      const w = img.naturalWidth, h = img.naturalHeight;
      c.width = w; c.height = h;
      const x = c.getContext('2d');
      x.drawImage(img, 0, 0, w, h);
      const pw = w * 0.62, ph = h * 0.15, px = (w - pw) / 2, py = h - ph - h * 0.05, r = ph / 2;
      x.save();
      x.shadowColor = 'rgba(15,23,42,.35)'; x.shadowBlur = w * 0.02; x.shadowOffsetY = w * 0.008;
      x.fillStyle = '#FFFFFF';
      x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + pw, py, px + pw, py + ph, r); x.arcTo(px + pw, py + ph, px, py + ph, r); x.arcTo(px, py + ph, px, py, r); x.arcTo(px, py, px + pw, py, r); x.closePath(); x.fill();
      x.restore();
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillStyle = '#64748B'; x.font = '600 ' + Math.round(ph * 0.22) + 'px system-ui, sans-serif';
      x.fillText('USE MY REFERRAL CODE', w / 2, py + ph * 0.28);
      x.fillStyle = '#1D4ED8'; x.font = '800 ' + Math.round(ph * 0.42) + 'px system-ui, sans-serif';
      x.fillText(code, w / 2, py + ph * 0.68);
      setReady(true);
    };
    img.onerror = () => setErr('Could not load the card image. Check your connection and try again.');
    img.src = IMG;
  }, [code, state]);

  const blob = () => new Promise((res, rej) => { try { cv.current.toBlob((b) => (b ? res(b) : rej(new Error('fail'))), 'image/jpeg', 0.92); } catch (e) { rej(e); } });
  const download = async () => {
    try {
      const b = await blob(); const u = URL.createObjectURL(b);
      const a = document.createElement('a'); a.href = u; a.download = 'xmarket-referral-' + code + '.jpg'; a.click();
      setTimeout(() => URL.revokeObjectURL(u), 4000);
    } catch (e) { show('Could not save the image.'); }
  };
  const share = async () => {
    try {
      const b = await blob();
      const file = new File([b], 'xmarket-referral.jpg', { type: 'image/jpeg' });
      const text = 'Join XMARKET and use my referral code ' + code;
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text }); return; }
      if (navigator.share) { await navigator.share({ text, url: window.location.origin }); return; }
      download();
    } catch (e) { /* cancelled */ }
  };

  const wrap = { padding: 16, paddingBottom: 60, maxWidth: 560, margin: '0 auto' };
  const head = <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}><button className="icon-btn" aria-label="Back" onClick={() => nav('/creator-studio')}><ArrowLeft size={20} /></button><h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Referral share card</h2></div>;
  if (state === null) return <div style={wrap}>{head}<div className="sk" style={{ height: 300, borderRadius: 18 }} /></div>;
  if (state !== 'approved') return <div style={wrap}>{head}<div className="card" style={{ padding: 20, textAlign: 'center' }}>Only approved creators have a referral card.</div></div>;
  if (!code) return <div style={wrap}>{head}<div className="card" style={{ padding: 20, textAlign: 'center' }}>You don't have a referral code yet.</div></div>;
  return (
    <div className="page-enter" style={wrap}>
      {head}
      <div className="card" style={{ padding: 12 }}>
        {!ready && !err && <div className="sk" style={{ height: 300, borderRadius: 14 }} />}
        {err && <div style={{ padding: 20, textAlign: 'center', color: '#DC2626', fontSize: 13 }}>{err}</div>}
        <canvas ref={cv} style={{ width: '100%', height: 'auto', borderRadius: 14, display: ready ? 'block' : 'none' }} />
        <button className="btn-primary" disabled={!ready} onClick={share} style={{ width: '100%', padding: 14, fontSize: 14, marginTop: 12 }}>Share card</button>
        <button className="btn-ghost" disabled={!ready} onClick={download} style={{ width: '100%', padding: 12, marginTop: 8 }}>Save image</button>
      </div>
    </div>
  );
}
