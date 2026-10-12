import { getToken, onMessage } from 'firebase/messaging';
import { supabase } from './supabase';
import { getMessagingSafe, VAPID_KEY } from './firebase';

const SW_URL = '/firebase-messaging-sw.js';

async function ensureServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register(SW_URL, { scope: '/' });
    await navigator.serviceWorker.ready;
    return reg;
  } catch (e) {
    console.warn('[fcm] SW register failed:', e);
    return null;
  }
}

export async function requestPushPermission({ userId }) {
  if (!userId) return { ok: false, error: 'Missing userId' };
  if (!('Notification' in window)) return { ok: false, error: 'Notifications not supported' };
  if (Notification.permission === 'denied') return { ok: false, error: 'Notifications blocked. Enable in browser settings.' };

  // Ask for permission
  if (Notification.permission !== 'granted') {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return { ok: false, error: 'Permission denied' };
  }

  // Register SW first
  const reg = await ensureServiceWorker();
  if (!reg) return { ok: false, error: 'Service worker failed' };

  // Get FCM token
  const messaging = await getMessagingSafe();
  if (!messaging) return { ok: false, error: 'Firebase messaging unsupported on this device' };

  let token;
  try {
    token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: reg,
    });
  } catch (e) {
    return { ok: false, error: 'Token error: ' + e.message };
  }

  if (!token) return { ok: false, error: 'No token returned' };

  // Save to Supabase
  try {
    const { error } = await supabase
      .from('push_tokens')
      .upsert(
        { user_id: userId, token, platform: 'web', updated_at: new Date().toISOString() },
        { onConflict: 'user_id,token' }
      );
    if (error) throw error;
  } catch (e) {
    return { ok: false, error: 'Save failed: ' + e.message, token };
  }

  return { ok: true, token };
}

export async function getCurrentPushToken() {
  const messaging = await getMessagingSafe();
  if (!messaging) return null;
  try {
    return await getToken(messaging, { vapidKey: VAPID_KEY });
  } catch {
    return null;
  }
}

export async function setupForegroundHandler(handler) {
  const messaging = await getMessagingSafe();
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    try { handler(payload); } catch (e) { console.warn(e); }
  });
}

export function isPushSupported() {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    window.isSecureContext
  );
}
