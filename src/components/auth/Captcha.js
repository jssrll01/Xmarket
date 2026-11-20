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
      s.onload = () => {
        let n = 0;
        const wait = () => { if (window.turnstile) resolve(window.turnstile); else if (n++ > 30) { loader = null; reject(new Error('captcha-load')); } else setTimeout(wait, 100); };
        wait();
      };
      s.onerror = () => { loader = null; reject(new Error('captcha-load')); };
      document.head.appendChild(s);
    });
  }
  return loader;
}

const hint = (c) => {
  c = String(c || '');
  if (c.indexOf('1102') === 0) return 'This domain is not in your Turnstile hostname list.';
  if (c.indexOf('1101') === 0 || c.indexOf('4000') === 0) return 'The site key is invalid. Check REACT_APP_TURNSTILE_SITE_KEY.';
  return 'Reload the page and try again.';
};

function Turnstile({ onToken, onFail }, ref) {
  const box = useRef(null), wid = useRef(null);
  const [err, setErr] = useState('');
  useImperativeHandle(ref, () => ({
    reset() { onToken(''); try { if (window.turnstile && wid.current != null) window.turnstile.reset(wid.current); } catch (e) {} }
  }), [onToken]);
  useEffect(() => {
    let dead = false;
    loadTurnstile().then((t) => {
      if (dead || !box.current) return;
      const go = () => {
        if (dead || !box.current) return;
        try {
          wid.current = t.render(box.current, {
            sitekey: String(SITE_KEY).trim(), theme: 'auto',
            callback: (tok) => { setErr(''); onToken(tok); },
            'expired-callback': () => onToken(''),
            'error-callback': (c) => { onToken(''); setErr('Security check error ' + c + '. ' + hint(c)); return true; }
          });
        } catch (e) { setErr('Security check failed: ' + (e && e.message ? e.message : e)); }
      };
      if (t.ready) t.ready(go); else go();
    }).catch(() => { if (onFail) onFail(); });
    return () => { dead = true; try { if (window.turnstile && wid.current != null) window.turnstile.remove(wid.current); } catch (e) {} };
  }, []); // eslint-disable-line
  return (
    <div className="auth-captcha">
      <div ref={box} />
      {err && <div className="auth-captcha-err">{err}</div>}
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
const TS = forwardRef(Turnstile), LC = forwardRef(Local);
const Smart = forwardRef((props, ref) => {
  const [fb, setFb] = useState(false);
  return fb ? <LC ref={ref} onToken={props.onToken} /> : <TS ref={ref} onToken={props.onToken} onFail={() => setFb(true)} />;
});
export default SITE_KEY ? Smart : LC;
