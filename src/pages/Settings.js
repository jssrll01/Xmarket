import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Bell, BellOff, Check, X, Sun, Moon, MonitorSmartphone,
  Globe, Coins, ShieldCheck, Trash2, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { requestPushPermission, isPushSupported } from '../lib/fcm';
import { useToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

const LS_KEY = 'xmarket_settings';

const DEFAULT_SETTINGS = {
  language: 'en',
  currency: 'PHP',
  notif_orders: true,
  notif_promos: true,
  notif_chat: true,
  notif_email: false,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
}
function saveSettings(s) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
}

/* ─── Row building blocks ─── */
function Section({ title, children }) {
  return (
    <div className="set-section">
      <div className="set-section-title">{title}</div>
      <div className="set-card">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, sub, right, onClick, danger }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag className={'set-row' + (danger ? ' danger' : '')} onClick={onClick} type={onClick ? 'button' : undefined}>
      {Icon && (
        <span className="set-row-icon">
          <Icon size={17} color={danger ? '#DC2626' : 'var(--primary)'} />
        </span>
      )}
      <div className="set-row-label">
        <div className="set-row-title">{label}</div>
        {sub && <div className="set-row-sub">{sub}</div>}
      </div>
      {right ?? (onClick && <ChevronRight size={16} color="var(--muted)" />)}
    </Tag>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      className={'set-toggle' + (value ? ' on' : '')}
      onClick={() => onChange(!value)}
      role="switch"
      aria-checked={value}
      type="button"
    >
      <span className="set-toggle-knob" />
    </button>
  );
}

export default function SettingsPage() {
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const { show: showToast } = useToast();
  const { theme, resolved, setTheme } = useTheme();

  const [settings, setSettings] = useState(loadSettings);
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [hasToken, setHasToken] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);

  const supported = isPushSupported();

  // persist settings
  useEffect(() => { saveSettings(settings); }, [settings]);

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

  const upd = (patch) => setSettings((s) => ({ ...s, ...patch }));

  const enablePush = async () => {
    if (!user) { showToast?.('Please sign in first'); return; }
    if (!supported) { showToast?.('Push not supported here'); return; }
    setBusy(true);
    const res = await requestPushPermission({ userId: user.id });
    setBusy(false);
    setPermission(typeof Notification !== 'undefined' ? Notification.permission : 'default');
    if (res.ok) { setHasToken(true); showToast?.('Notifications enabled'); }
    else showToast?.(res.error || 'Could not enable notifications');
  };

  const deleteAccount = async () => {
    if (deleteInput !== 'DELETE') { showToast?.('Type DELETE to confirm'); return; }
    setDeleting(true);
    try {
      await supabase.from('profiles').update({ deleted_at: new Date().toISOString() }).eq('id', user.id);
      await supabase.auth.signOut();
      showToast?.('Account scheduled for deletion');
      navigate('/');
    } catch (err) {
      showToast?.(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <button
        onClick={() => navigate(-1)}
        className="icon-btn"
        style={{ marginBottom: 12 }}
        aria-label="Back"
      >
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>Settings</h2>

      {/* ── Appearance ── */}
      <Section title="Appearance">
        <div className="set-row">
          <span className="set-row-icon"><Sun size={17} color="var(--primary)" /></span>
          <div className="set-row-label">
            <div className="set-row-title">Theme</div>
            <div className="set-row-sub">Currently: {resolved || theme}</div>
          </div>
        </div>
        <div className="set-theme-toggle">
          {[
            { id: 'light', label: 'Light', Icon: Sun },
            { id: 'dark', label: 'Dark', Icon: Moon },
            { id: 'system', label: 'System', Icon: MonitorSmartphone },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              className={'set-theme-btn' + (theme === id ? ' active' : '')}
              onClick={() => setTheme(id)}
              type="button"
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Preferences ── */}
      <Section title="Preferences">
        <Row
          icon={Globe}
          label="Language"
          sub={settings.language === 'en' ? 'English' : 'Filipino'}
          right={
            <select
              className="set-select"
              value={settings.language}
              onChange={(e) => upd({ language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="fil">Filipino</option>
            </select>
          }
        />
        <Row
          icon={Coins}
          label="Currency"
          sub="Used to display prices"
          right={
            <select
              className="set-select"
              value={settings.currency}
              onChange={(e) => upd({ currency: e.target.value })}
            >
              <option value="PHP">₱ PHP</option>
              <option value="USD">$ USD</option>
            </select>
          }
        />
      </Section>

      {/* ── Notifications ── */}
      <Section title="Notifications">
        <Row
          icon={hasToken ? Bell : BellOff}
          label="Push notifications"
          sub={
            permission === 'granted'
              ? 'Enabled on this device'
              : permission === 'denied'
                ? 'Blocked — enable in browser settings'
                : 'Not yet enabled'
          }
          right={
            permission === 'granted'
              ? <span className="set-badge-ok"><Check size={11} /> On</span>
              : supported
                ? <button className="set-mini-btn" onClick={enablePush} disabled={busy}>
                    {busy ? '…' : 'Enable'}
                  </button>
                : <span className="set-badge-off"><X size={11} /> N/A</span>
          }
        />
        <Row
          label="Order updates"
          sub="Status changes on your orders"
          right={<Toggle value={settings.notif_orders} onChange={(v) => upd({ notif_orders: v })} />}
        />
        <Row
          label="Promotions"
          sub="Deals, flash sales, bundles"
          right={<Toggle value={settings.notif_promos} onChange={(v) => upd({ notif_promos: v })} />}
        />
        <Row
          label="Chat messages"
          sub="Seller replies and questions"
          right={<Toggle value={settings.notif_chat} onChange={(v) => upd({ notif_chat: v })} />}
        />
        <Row
          label="Email"
          sub="Send to {email}"
          right={<Toggle value={settings.notif_email} onChange={(v) => upd({ notif_email: v })} />}
        />
      </Section>

      {/* ── Security ── */}
      <Section title="Security">
        <Row
          icon={ShieldCheck}
          label="Change password"
          sub="We'll email a reset link"
          onClick={async () => {
            if (!user?.email) { showToast?.('No email on file'); return; }
            const { error } = await supabase.auth.resetPasswordForEmail(user.email);
            showToast?.(error ? error.message : 'Reset link sent');
          }}
        />
      </Section>

      {/* ── Danger zone ── */}
      <Section title="Danger zone">
        <Row
          icon={Trash2}
          label="Delete account"
          sub="Permanently schedules deletion"
          danger
          onClick={() => setConfirmDelete(true)}
        />
      </Section>

      <div className="set-footer">
        XMARKET · v1.0
      </div>

      {/* Confirm delete modal (typed confirmation) */}
      {confirmDelete && (
        <div className="set-confirm-backdrop" onClick={() => !deleting && setConfirmDelete(false)}>
          <div className="set-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="set-confirm-icon"><AlertTriangle size={22} color="#DC2626" /></div>
            <div className="set-confirm-title">Delete your account?</div>
            <div className="set-confirm-msg">
              This schedules your account for deletion. Type <b>DELETE</b> to confirm.
            </div>
            <input
              autoFocus
              className="set-confirm-input"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Type DELETE"
            />
            <div className="set-confirm-actions">
              <button
                className="set-confirm-cancel"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="set-confirm-danger"
                onClick={deleteAccount}
                disabled={deleting || deleteInput !== 'DELETE'}
              >
                {deleting ? 'Deleting…' : 'Delete account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
