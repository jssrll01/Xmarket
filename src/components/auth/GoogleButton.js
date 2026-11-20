import React, { useEffect, useRef } from 'react';
import { signInWithGoogleIdToken } from '../../lib/auth';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '352813169104-me7s1ta7fme42ed9qrh1685oo0hrnb31.apps.googleusercontent.com';

const hex = (buf) => Array.from(new Uint8Array(buf), (x) => x.toString(16).padStart(2, '0')).join('');
const rand = () => { const b = new Uint8Array(16); crypto.getRandomValues(b); return hex(b); };
const sha256 = async (s) => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
const friendly = (m) => (/database error|unexpected_failure/i.test(m || '')
  ? 'This Google account cannot be used. Only @gmail.com accounts are accepted.'
  : (m || 'Google sign-in failed. Please try again.'));

export default function GoogleButton({ onDone, onError, text = 'continue_with' }) {
  const box = useRef(null);
  useEffect(() => {
    let alive = true;
    let tries = 0;
    let t;
    const start = async () => {
      if (!alive) return;
      if (!(window.google && window.google.accounts && window.google.accounts.id)) {
        if (++tries > 60) { if (onError) onError('Google sign-in could not load. Check your connection and try again.'); return; }
        t = setTimeout(start, 200);
        return;
      }
      const nonce = rand();
      const hashed = await sha256(nonce);
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        nonce: hashed,
        callback: async (resp) => {
          const { error } = await signInWithGoogleIdToken(resp.credential, nonce);
          if (error) { if (onError) onError(friendly(error.message)); } else if (onDone) onDone();
        },
      });
      if (!box.current) return;
      const w = Math.min(400, Math.max(240, box.current.offsetWidth || 320));
      window.google.accounts.id.renderButton(box.current, { type: 'standard', theme: 'outline', size: 'large', text, shape: 'pill', logo_alignment: 'left', width: w });
    };
    start();
    return () => { alive = false; clearTimeout(t); };
    // eslint-disable-next-line
  }, []);
  return <div ref={box} style={{ display: 'flex', justifyContent: 'center', minHeight: 44, width: '100%' }} />;
}
