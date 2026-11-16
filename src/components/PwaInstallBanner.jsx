import React, { useCallback, useEffect, useState } from 'react';

const KEY = 'xmarket.install-banner';
const WEEK = 7 * 24 * 3600 * 1000;
const standalone = () => {
  try { return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; } catch (e) { return false; }
};
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const snoozed = () => {
  try { return Date.now() - Number(localStorage.getItem(KEY) || 0) < WEEK; } catch (e) { return false; }
};

export default function PwaInstallBanner() {
  const [mode, setMode] = useState(''); // '' | 'prompt' | 'ios'

  const check = useCallback(() => {
    if (window.location.pathname.indexOf('/embed') === 0 || standalone() || snoozed()) { setMode(''); return; }
    if (window.__deferredPrompt) setMode('prompt');
    else if (isIos()) setMode('ios');
    else setMode('');
  }, []);

  useEffect(() => {
    const t = setTimeout(check, 5000);
    const onReady = () => setTimeout(check, 4000);
    window.addEventListener('bip-prompt-ready', onReady);
    return () => { clearTimeout(t); window.removeEventListener('bip-prompt-ready', onReady); };
  }, [check]);

  const install = async () => {
    const p = window.__deferredPrompt;
    if (!p) return;
    try { p.prompt(); await p.userChoice; } catch (e) { /* user closed the prompt */ }
    window.__deferredPrompt = null;
    setMode('');
  };
  const close = () => {
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) { /* storage blocked */ }
    setMode('');
  };

  if (!mode) return null;
  return (
    <div role="dialog" aria-label="Install XMARKET" style={{ position: 'fixed', left: 12, right: 12, bottom: 'calc(84px + env(safe-area-inset-bottom))', zIndex: 900, background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
      <img src="/icons/icon-192.png" alt="" width="40" height="40" style={{ borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <b style={{ fontSize: 14 }}>Install XMARKET</b>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{mode === 'ios' ? 'Tap Share, then Add to Home Screen.' : 'Add it to your home screen for faster shopping.'}</div>
      </div>
      {mode === 'prompt' && <button className="btn-primary" onClick={install} style={{ padding: '8px 14px', flexShrink: 0 }}>Install</button>}
      <button onClick={close} aria-label="Dismiss" style={{ color: 'var(--muted)', padding: 4, fontSize: 20, lineHeight: 1 }}>×</button>
    </div>
  );
}
