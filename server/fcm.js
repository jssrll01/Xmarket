import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

let _initialized = false;

function init() {
  if (_initialized || getApps().length) { _initialized = true; return; }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) { console.warn('[fcm] no FIREBASE_SERVICE_ACCOUNT_JSON set'); return; }
  const creds = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  initializeApp({ credential: cert(creds) });
  _initialized = true;
  console.log('[fcm] initialized');
}

/**
 * Send a push to a user's registered devices.
 */
export async function sendPushToUser(sb, userId, { title, body, url, tag }) {
  try {
    init();
    if (!_initialized) return { ok: false, error: 'fcm not initialized' };

    const { data: tokens } = await sb
      .from('push_tokens')
      .select('token')
      .eq('user_id', userId);

    if (!tokens || tokens.length === 0) return { ok: true, sent: 0 };

    const res = await getMessaging().sendEachForMulticast({
      tokens: tokens.map((t) => t.token),
      notification: { title, body },
      data: { url: url || '/', tag: tag || '' },
      webpush: {
        fcmOptions: { link: url || '/' },
        notification: { icon: '/icons/icon-192.png', badge: '/icons/icon-192.png' },
      },
    });

    // Clean up invalid tokens
    const invalid = [];
    res.responses.forEach((r, i) => {
      const code = r.error?.code || '';
      if (/registration-token-not-registered|invalid-argument/.test(code)) {
        invalid.push(tokens[i].token);
      }
    });
    if (invalid.length) {
      await sb.from('push_tokens').delete().in('token', invalid);
      console.log('[fcm] cleaned', invalid.length, 'invalid tokens');
    }

    return { ok: true, sent: res.successCount, failed: res.failureCount };
  } catch (e) {
    console.error('[fcm] send failed:', e);
    return { ok: false, error: e.message };
  }
}
