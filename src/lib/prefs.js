import { useSyncExternalStore } from 'react';
import { prefsCfg } from './prefsConfig';
import '../prefs.css';

const KEY = 'xm_prefs_v1';
const subs = new Set();
let cur = null;
let inited = false;
let mo = null;
const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

function load() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) { saved = null; }
  const conn = typeof navigator !== 'undefined' ? navigator.connection : null;
  return { theme: 'system', font: 100, saver: !!(conn && conn.saveData), haptics: true, ...(saved || {}) };
}
export const getPrefs = () => { if (!cur) cur = load(); return cur; };
const resolve = (t) => (t === 'system' ? (mq && mq.matches ? 'dark' : 'light') : t);

const tuneOne = (n) => {
  if (n.getAttribute('data-xs')) return;
  n.setAttribute('data-xs', '1');
  if (n.tagName === 'IMG') { n.loading = 'lazy'; n.decoding = 'async'; }
  else {
    n.preload = 'none';
    if (n.autoplay) { n.autoplay = false; n.removeAttribute('autoplay'); try { n.pause(); } catch (e) {} }
  }
};
const tune = (root) => { if (root.querySelectorAll) root.querySelectorAll('img,video').forEach(tuneOne); };
function watchSaver(on) {
  if (on && !mo && document.body) {
    tune(document.body);
    mo = new MutationObserver((list) => list.forEach((r) => r.addedNodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      if (n.matches('img,video')) tuneOne(n); else tune(n);
    })));
    mo.observe(document.body, { childList: true, subtree: true });
  }
  if (!on && mo) { mo.disconnect(); mo = null; }
}

export function applyPrefs() {
  if (typeof document === 'undefined') return;
  const p = getPrefs();
  const el = document.documentElement;
  const th = resolve(p.theme);
  el.setAttribute('data-xm-theme', th);
  el.setAttribute('data-xm-mode', prefsCfg.themeMode);
  if (prefsCfg.themeMode === 'data-theme') el.setAttribute('data-theme', th);
  if (prefsCfg.themeMode === 'class') el.classList.toggle('dark', th === 'dark');
  el.style.zoom = p.font === 100 ? '' : String(p.font / 100);
  el.setAttribute('data-saver', p.saver ? 'on' : 'off');
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) {
    if (!m.dataset.orig) m.dataset.orig = m.getAttribute('content') || '#ffffff';
    m.setAttribute('content', th === 'dark' ? '#0f1115' : m.dataset.orig);
  }
  watchSaver(p.saver);
}

export function setPrefs(patch) {
  cur = { ...getPrefs(), ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(cur)); } catch (e) {}
  applyPrefs();
  subs.forEach((f) => f());
}
const subscribe = (f) => { subs.add(f); return () => subs.delete(f); };
export function usePrefs() { return [useSyncExternalStore(subscribe, getPrefs), setPrefs]; }

export function haptic(ms = 10) {
  try { if (getPrefs().haptics && navigator.vibrate) navigator.vibrate(ms); } catch (e) {}
}

export function initPrefs() {
  if (inited || typeof window === 'undefined') return;
  inited = true;
  applyPrefs();
  if (mq && mq.addEventListener) mq.addEventListener('change', () => { if (getPrefs().theme === 'system') applyPrefs(); });
  document.addEventListener('pointerdown', (e) => {
    if (!getPrefs().haptics) return;
    const t = e.target && e.target.closest ? e.target.closest('button,a,[role="button"],summary') : null;
    if (t && !t.disabled) haptic(8);
  }, { capture: true, passive: true });
}
