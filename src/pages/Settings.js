import React, { useEffect, useState } from 'react';
import { Bell, ArrowLeft, Globe, Coins, User, MapPin, Ticket, ShieldCheck, HelpCircle, Headphones, FileText, Lock, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestPushPermission, isPushSupported, getCurrentPushToken } from '../lib/fcm';
import { supabase } from '../lib/supabase';

function Switch({ on, busy, disabled, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      disabled={busy || disabled}
      onClick={() => onChange(!on)}
      style={{
        width: 50, height: 30, borderRadius: 999, border: 'none', padding: 3, flexShrink: 0,
        background: on ? '#16A34A' : '#CBD5E1', cursor: (busy || disabled) ? 'not-allowed' : 'pointer',
        opacity: (busy || disabled) ? 0.6 : 1, transition: 'background .2s',
        display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start',
      }}
    >
      <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
    </button>
  );
}

function Row({ icon: Icon, label, hint, right, onClick, last }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
        borderBottom: last ? 'none' : '1px solid var(--border, #EEF2F7)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{label}</div>
        {hint && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{hint}</div>}
      </div>
      {right !== undefined ? right : (onClick && <ChevronRight size={18} color="var(--muted)" />)}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', letterSpacing: 0.6, textTransform: 'uppercase', margin: '0 4px 8px' }}>{title}</div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

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

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      try {
        const { data } = await supabase.from('push_tokens').select('id').eq('user_id', user.id).limit(1);
        if (alive) setHasToken((data || []).length > 0);
      } catch {}
    })();
    return () => { alive = false; };
  }, [user]);

  const enable = async () => {
    if (!user) { setMsg({ type: 'error', text: 'Please sign in first.' }); return; }
    if (!supported) { setMsg({ type: 'error', text: 'Push notifications are not supported on this device.' }); return; }
    setBusy(true); setMsg(null);
    const res = await requestPushPermission({ userId: user.id });
    setBusy(false);
    setPermission(typeof Notification !== 'undefined' ? Notification.permission : 'default');
    if (res.ok) { setHasToken(true); setMsg({ type: 'success', text: "Notifications enabled. You'll get order updates." }); }
    else setMsg({ type: 'error', text: res.error || 'Could not enable notifications.' });
  };

  const disable = async () => {
    if (!user) return;
    setBusy(true); setMsg(null);
    try {
      const token = await getCurrentPushToken();
      if (token) await supabase.from('push_tokens').delete().eq('user_id', user.id).eq('token', token);
      setHasToken(false);
      setMsg({ type: 'success', text: 'Notifications turned off for this device.' });
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally { setBusy(false); }
  };

  const go = (path) => () => navigate(path);
  const badge = (text) => <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>{text}</span>;

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => navigate('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', padding: 0, color: 'var(--muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}>
        <ArrowLeft size={16} /> Return to Home
      </button>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Settings</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Manage your account and app preferences</p>

      {msg && (
        <div style={{ padding: '10px 12px', borderRadius: 10, marginBottom: 14, fontSize: 12.5, fontWeight: 600, background: msg.type === 'success' ? '#D1FAE5' : '#FEE2E2', color: msg.type === 'success' ? '#065F46' : '#991B1B' }}>
          {msg.text}
        </div>
      )}

      <Section title="Notifications">
        <Row
          icon={Bell}
          label="Push notifications"
          hint={permission === 'denied' ? 'Blocked in your browser settings' : 'Order updates, top-up alerts and promos'}
          last
          right={<Switch on={hasToken} busy={busy} disabled={!supported || permission === 'denied'} onChange={(v) => (v ? enable() : disable())} />}
        />
      </Section>
      {permission === 'denied' && (
        <div style={{ padding: 12, borderRadius: 10, background: '#FEF3C7', color: '#92400E', fontSize: 12, lineHeight: 1.6, margin: '-6px 0 18px' }}>
          You've blocked notifications for this site. To turn them on, open your browser settings, find this site, and allow notifications.
        </div>
      )}

      <Section title="Preferences">
        <Row icon={Globe} label="Language" hint="English is the only supported language" right={badge('English')} />
        <Row icon={Coins} label="Currency" hint="All prices are shown in Philippine Peso" right={badge('PHP (₱)')} last />
      </Section>

      <Section title="Account">
        <Row icon={User} label="Profile" hint="Name, photo and contact details" onClick={go('/profile')} />
        <Row icon={MapPin} label="My account" hint="Addresses and account information" onClick={go('/account')} />
        <Row icon={Ticket} label="Vouchers" hint="Your available vouchers" onClick={go('/vouchers')} />
        <Row icon={ShieldCheck} label="Security reports" hint="Report suspicious activity" onClick={go('/report/security')} last />
      </Section>

      <Section title="Support">
        <Row icon={HelpCircle} label="Help center" hint="Guides and frequently asked questions" onClick={go('/help')} />
        <Row icon={Headphones} label="Customer service" hint="Talk to our support team" onClick={go('/customer-service')} last />
      </Section>

      <Section title="Legal">
        <Row icon={FileText} label="Terms of service" onClick={go('/terms')} />
        <Row icon={Lock} label="Privacy policy" onClick={go('/privacy')} />
        <Row icon={FileText} label="Refund policy" onClick={go('/refund')} last />
      </Section>

      <Section title="About">
        <Row icon={Info} label="XMARKET" hint="Your trusted online marketplace" right={badge('v3.0.0')} last />
      </Section>
    </div>
  );
}
