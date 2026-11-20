import './lib/quiet';
import './lib/fileGuard';
import PwaInstallBanner from './components/PwaInstallBanner';
import FloatPlayerHost from './yt/FloatPlayer';
import { startTrustSeals } from './lib/trustSeals';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__deferredPrompt = e;
  window.dispatchEvent(new Event('bip-prompt-ready'));
});

window.addEventListener('appinstalled', () => {
  window.__deferredPrompt = null;
  window.dispatchEvent(new Event('bip-prompt-ready'));
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}

startTrustSeals();
import('./lib/fcm').then((m) => m.autoRefreshPush && m.autoRefreshPush()).catch(() => {});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
    <PwaInstallBanner />
    <FloatPlayerHost />
  </BrowserRouter>
);

// Global sold-out handler — shows a browser alert as a fallback.
// The Toast context (if mounted) also receives these events.
if (typeof window !== 'undefined') {
  window.addEventListener('xmarket:out-of-stock', (e) => {
    const detail = e?.detail || {};
    const name = detail.name || 'This product';
    const msg = detail.message
      ? detail.message
      : `${name} is sold out and cannot be added to cart.`;
    window.alert(msg);
  });
}


['gesturestart', 'gesturechange', 'gestureend'].forEach((t) => document.addEventListener(t, (e) => e.preventDefault()));
document.addEventListener('touchmove', (e) => { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
