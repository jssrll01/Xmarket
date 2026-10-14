import React, { useEffect, useState } from 'react';
import { Bell, BellOff, Check, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestPushPermission, isPushSupported, getCurrentPushToken } from '../lib/fcm';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, MonitorSmartphone } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [hasToken, setHasToken] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const supported = isPushSupported();
  const { theme, resolved, setTheme } = useTheme();

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      try {
        const { data } = await supabase
          .from('push_tokens')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        if (alive) setHasToken((data || []).length > 0);
      } catch {}
    })();
    return () => { alive = false; };
  }, [user]);

  const enable = async () => {
    if (!user) {
      setMsg({ type: 'error', text: 'Please sign in first.' });
      return;
    }
    if (!supported) {
      setMsg({ type: 'error', text: 'Push not supported on this device.' });
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await requestPushPermission({ userId: user.id });
    setBusy(false);
    setPermission(typeof Notification !== 'undefined' ? Notification.permission : 'default');

    if (res.ok) {
      setHasToken(true);
      setMsg({ type: 'success', text: 'Notifications enabled. You\'ll get order updates.' });
    } else {
      setMsg({ type: 'error', text: res.error || 'Could not enable notifications.' });
    }
  };

  const disable = async () => {
    if (!user) return;
    if (!confirm('Disable notifications on this device? You can re-enable anytime.')) return;
    setBusy(true);
    try {
      const token = await getCurrentPushToken();
      if (token) {
        await supabase.from('push_tokens').delete().eq('user_id', user.id).eq('token', token);
      }
      setHasToken(false);
      setMsg({ type: 'success', text: 'Notifications disabled for this device.' });
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", padding: 0, color: "var(--muted)", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}><ArrowLeft size={16} /> Return to Home</button>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Settings</h2>

      {/* ─── Appearance ─── */}
      <div className="card" style={{ padding: 16, marginTop: 20, marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Appearance</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
          Currently: <b style={{ textTransform: 'capitalize' }}>{resolved}</b>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { id: 'light',  icon: Sun,                label: 'Light' },
            { id: 'dark',   icon: Moon,               label: 'Dark' },
            { id: 'system', icon: MonitorSmartphone,  label: 'Auto' },
          ].map(({ id, icon: Icon, label }) => {
            const active = theme === id;
            return (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={'btn-ghost' + (active ? ' active' : '')}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  borderRadius: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  background: active ? 'linear-gradient(135deg,#6D8BFF,#8B5CF6)' : undefined,
                  color: active ? '#fff' : undefined,
                  border: '1px solid var(--border)',
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
        Manage your account preferences
      </p>

      {/* PUSH NOTIFICATIONS CARD */}
      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: hasToken ? '#D1FAE5' : '#DBEAFE',
            color: hasToken ? '#065F46' : '#2563EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {hasToken ? <Bell size={20} /> : <BellOff size={20} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800 }}>Push notifications</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
              Get order updates, top-up alerts, and promos
            </div>
          </div>
        </div>

        {/* Status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px',
          borderRadius: 10, background: 'var(--surface-2, #F7F9FC)',
          fontSize: 12.5, fontWeight: 700, marginBottom: 12,
        }}>
          <span>Status:</span>
          {hasToken ? (
            <span style={{ color: '#065F46', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Check size={14} /> Enabled
            </span>
          ) : permission === 'denied' ? (
            <span style={{ color: '#991B1B', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <X size={14} /> Blocked in browser
            </span>
          ) : (
            <span style={{ color: '#92400E' }}>Not enabled</span>
          )}
        </div>

        {msg && (
          <div style={{
            padding: '10px 12px', borderRadius: 10, marginBottom: 12, fontSize: 12.5, fontWeight: 600,
            background: msg.type === 'success' ? '#D1FAE5' : '#FEE2E2',
            color: msg.type === 'success' ? '#065F46' : '#991B1B',
          }}>
            {msg.text}
          </div>
        )}

        {!hasToken && permission !== 'denied' && (
          <button
            onClick={enable}
            disabled={busy || !supported}
            className="btn-primary"
            style={{
              width: '100%', padding: 13, fontSize: 14, fontWeight: 800,
              borderRadius: 12, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              opacity: (busy || !supported) ? 0.6 : 1,
            }}
          >
            <Bell size={16} /> {busy ? 'Enabling…' : 'Enable notifications'}
          </button>
        )}

        {hasToken && (
          <button
            onClick={disable}
            disabled={busy}
            style={{
              width: '100%', padding: 13, fontSize: 14, fontWeight: 800,
              borderRadius: 12, background: '#FEE2E2', color: '#991B1B',
              border: '1px solid #FCA5A5', cursor: busy ? 'wait' : 'pointer',
            }}
          >
            {busy ? '…' : 'Disable on this device'}
          </button>
        )}

        {permission === 'denied' && (
          <div style={{
            padding: 12, borderRadius: 10, background: '#FEF3C7',
            color: '#92400E', fontSize: 12, lineHeight: 1.6,
          }}>
            You've blocked notifications for this site.
            To enable, open your browser settings, find this site, and allow notifications.
          </div>
        )}
      </div>

      {/* Placeholder for future settings */}
      <div className="card" style={{ padding: 16, opacity: 0.5 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>More settings coming soon</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
          Dark mode · Language · Currency
        </div>
      </div>
    </div>
  );
}
