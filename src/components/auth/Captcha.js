import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';

const SITE_KEY = process.env.REACT_APP_TURNSTILE_SITE_KEY;
const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let loader;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SRC; s.async = true; s.defer = true;
      s.onload = () => resolve(window.turnstile);
      s.onerror = () => { loader = null; reject(new Error('captcha-load')); };
      document.head.appendChild(s);
    });
  }
  return loader;
}

function Turnstile({ onToken }, ref) {
  const box = useRef(null), wid = useRef(null);
  const [err, setErr] = useState(false);
  useImperativeHandle(ref, () => ({
    reset() { onToken(''); try { if (window.turnstile && wid.current != null) window.turnstile.reset(wid.current); } catch (e) {} }
  }), [onToken]);
  useEffect(() => {
    let dead = false;
    loadTurnstile().then((t) => {
      if (dead || !box.current) return;
      wid.current = t.render(box.current, {
        sitekey: SITE_KEY, theme: 'auto',
        callback: (tok) => onToken(tok),
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken('')
      });
    }).catch(() => setErr(true));
    return () => { dead = true; try { if (window.turnstile && wid.current != null) window.turnstile.remove(wid.current); } catch (e) {} };
  }, []); // eslint-disable-line
  return (
    <div className="auth-captcha">
      <div ref={box} />
      {err && <div className="auth-captcha-err">Could not load the security check. Check your connection and reload.</div>}
    </div>
  );
}

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const makeCode = () => Array.from({ length: 5 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');

function Local({ onToken }, ref) {
  const [code, setCode] = useState(makeCode), [val, setVal] = useState('');
  const cv = useRef(null);
  const refresh = useCallback(() => { setCode(makeCode()); setVal(''); onToken(''); }, [onToken]);
  useImperativeHandle(ref, () => ({ reset: refresh }), [refresh]);
  useEffect(() => {
    const c = cv.current; if (!c) return;
    const g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height);
    g.fillStyle = 'rgba(100,116,139,.12)'; g.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < 6; i++) { g.strokeStyle = 'rgba(37,99,235,' + (0.25 + Math.random() * 0.3) + ')'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(Math.random() * c.width, Math.random() * c.height); g.lineTo(Math.random() * c.width, Math.random() * c.height); g.stroke(); }
    g.font = '700 26px monospace'; g.textBaseline = 'middle';
    code.split('').forEach((ch, i) => { g.save(); g.translate(14 + i * 24, 24 + (Math.random() * 8 - 4)); g.rotate((Math.random() - 0.5) * 0.5); g.fillStyle = '#1e3a8a'; g.fillText(ch, 0, 0); g.restore(); });
  }, [code]);
  const change = (e) => { const v = e.target.value.toUpperCase(); setVal(v); onToken(v === code ? 'local-ok' : ''); };
  return (
    <div className="auth-captcha">
      <span className="auth-label"><ShieldCheck size={14} style={{ verticalAlign: -2, marginRight: 4 }} />Security check: type the code</span>
      <div className="auth-captcha-row">
        <canvas ref={cv} width={140} height={48} aria-label="Captcha code" />
        <button type="button" className="auth-captcha-refresh" onClick={refresh} aria-label="New code"><RefreshCw size={16} /></button>
        <input className="auth-captcha-in" value={val} onChange={change} placeholder="Code" maxLength={5} autoComplete="off" autoCapitalize="characters" spellCheck="false" />
      </div>
    </div>
  );
}

export const CAPTCHA_MODE = SITE_KEY ? 'turnstile' : 'local';
export default forwardRef(SITE_KEY ? Turnstile : Local);
