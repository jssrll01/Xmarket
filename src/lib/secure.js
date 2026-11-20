import { supabase } from './supabase';

export const isGmail = (e) => /^[a-z0-9._%+-]+@gmail\.com$/i.test(String(e || '').trim());

const rand = () => {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
};
export function deviceId() {
  try {
    let id = localStorage.getItem('xm_did');
    if (!/^[a-f0-9]{32}$/.test(id || '')) { id = rand(); localStorage.setItem('xm_did', id); }
    return id;
  } catch (e) { return rand(); }
}
export const withDevice = (o) => {
  const x = o || {};
  const opt = x.options || {};
  return { ...x, options: { ...opt, data: { ...(opt.data || {}), device_id: deviceId() } } };
};

export const safeUrl = (u) => {
  const s = String(u == null ? '' : u).trim();
  if (/^(https?:\/\/|mailto:|tel:|sms:|blob:)/i.test(s)) return s;
  if (s.startsWith('/') && !s.startsWith('//') && !s.includes('\\')) return s;
  return '#';
};
export const safeNext = (p, fallback = '/') => {
  const s = String(p || '');
  return s.startsWith('/') && !s.startsWith('//') && !s.includes('\\') ? s : fallback;
};

const KEYS = ['xm_ship_addr', 'xmarket_cart_v1', 'xmarket.push.accepted', 'xmarket.push.dismissed', 'xm_wp1'];
export function clearLocalSensitive() {
  try { KEYS.forEach((k) => localStorage.removeItem(k)); } catch (e) { /* ignore */ }
  try { sessionStorage.clear(); } catch (e) { /* ignore */ }
  try { if (window.caches) window.caches.keys().then((ks) => ks.forEach((k) => window.caches.delete(k))); } catch (e) { /* ignore */ }
  try { if (navigator.serviceWorker && navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage({ type: 'xm-clear' }); } catch (e) { /* ignore */ }
  try { window.dispatchEvent(new Event('xm-logout')); } catch (e) { /* ignore */ }
}
// Run BEFORE signOut so this device stops receiving the old user's pushes.
export async function logoutCleanup() {
  try {
    const reg = navigator.serviceWorker && (await navigator.serviceWorker.getRegistration());
    const sub = reg && (await reg.pushManager.getSubscription());
    if (sub) {
      const j = sub.toJSON();
      const token = JSON.stringify({ endpoint: j.endpoint, keys: j.keys });
      try { await supabase.from('push_tokens').delete().eq('token', token); } catch (e) { /* ignore */ }
      try { await sub.unsubscribe(); } catch (e) { /* ignore */ }
    }
  } catch (e) { /* ignore */ }
  clearLocalSensitive();
}
