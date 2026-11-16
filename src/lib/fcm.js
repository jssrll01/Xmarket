import { supabase } from './supabase';
export { isPushSupported } from './fcm.legacy';

const PUB = 'BPUM5APrsAz0cP128blqtMRsPsqB-JAO2G-Tg0FvfAtv1ZpnyVdcI1Sqq5g6kdL_i8qeWfZer7qyN0voH2y4U0A';
const SW_URL = '/service-worker.js';

function toKey(s) {
  const p = '='.repeat((4 - (s.length % 4)) % 4);
  const raw = atob((s + p).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}
function sameKey(buf, key) {
  if (!buf) return false;
  const a = new Uint8Array(buf);
  return a.length === key.length && a.every((v, i) => v === key[i]);
}
async function getReg() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  try {
    await navigator.serviceWorker.register(SW_URL);
    return await navigator.serviceWorker.ready;
  } catch (e) {
    return null;
  }
}
const pack = (sub) => {
  const j = sub.toJSON();
  return JSON.stringify({ endpoint: j.endpoint, keys: j.keys });
};
async function subscribe(reg) {
  const key = toKey(PUB);
  let sub = await reg.pushManager.getSubscription();
  if (sub && !sameKey(sub.options && sub.options.applicationServerKey, key)) {
    try { await sub.unsubscribe(); } catch (e) {}
    sub = null;
  }
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
  return sub;
}

export async function requestPushPermission({ userId }) {
  if (!userId) return { ok: false, error: 'Missing userId' };
  if (!('Notification' in window)) return { ok: false, error: 'Notifications not supported' };
  if (Notification.permission === 'denied') return { ok: false, error: 'Notifications blocked. Enable in browser settings.' };
  if (Notification.permission !== 'granted') {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return { ok: false, error: 'Permission denied' };
  }
  const reg = await getReg();
  if (!reg) return { ok: false, error: 'Push is not supported here. On iPhone, add the app to the Home Screen first.' };
  let sub;
  try { sub = await subscribe(reg); } catch (e) { return { ok: false, error: 'Subscribe error: ' + e.message }; }
  const token = pack(sub);
  const { error } = await supabase
    .from('push_tokens')
    .upsert({ user_id: userId, token, platform: 'web', updated_at: new Date().toISOString() }, { onConflict: 'user_id,token' });
  if (error) return { ok: false, error: 'Save failed: ' + error.message, token };
  return { ok: true, token };
}

export async function getCurrentPushToken() {
  try {
    if (!('serviceWorker' in navigator)) return null;
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg && (await reg.pushManager.getSubscription());
    return sub ? pack(sub) : null;
  } catch (e) {
    return null;
  }
}

export async function setupForegroundHandler(handler) {
  if (!('serviceWorker' in navigator)) return () => {};
  const f = (e) => {
    if (e.data && e.data.type === 'xm-push') {
      const p = e.data.payload || {};
      try { handler({ notification: { title: p.title, body: p.body }, data: { url: p.url } }); } catch (err) {}
    }
  };
  navigator.serviceWorker.addEventListener('message', f);
  return () => navigator.serviceWorker.removeEventListener('message', f);
}

// One-time silent move of old Firebase subscribers to Web Push.
export function autoRefreshPush() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  let done = false;
  try { done = localStorage.getItem('xm_wp1') === '1'; } catch (e) {}
  if (done) return;
  supabase.auth.onAuthStateChange((ev, session) => {
    const u = session && session.user;
    if (!u || done || (ev !== 'SIGNED_IN' && ev !== 'INITIAL_SESSION')) return;
    done = true;
    setTimeout(async () => {
      try {
        const { data } = await supabase.from('push_tokens').select('id,token').eq('user_id', u.id);
        const rows = data || [];
        const old = rows.filter((r) => String(r.token).charAt(0) !== '{');
        const has = rows.some((r) => String(r.token).charAt(0) === '{');
        if (old.length && !has) {
          const res = await requestPushPermission({ userId: u.id });
          if (res.ok) await supabase.from('push_tokens').delete().eq('user_id', u.id).in('id', old.map((r) => r.id));
        }
        localStorage.setItem('xm_wp1', '1');
      } catch (e) {}
    }, 2000);
  });
}
