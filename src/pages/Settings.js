import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Moon, Bell, Globe, Shield, Trash2, Download, Info
} from 'lucide-react';
import { useToast } from '../components/Toast';
import useInstallPrompt from '../hooks/useInstallPrompt';

const KEY = 'xmarket.settings';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}

export default function Settings() {
  const navigate = useNavigate();
  const { show: toast } = useToast();
  const install = useInstallPrompt();
  const [s, setS] = useState(() => ({
    darkMode: false,
    notifications: true,
    language: 'en',
    ...load(),
  }));

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(s)); }, [s]);
  useEffect(() => {
    document.documentElement.dataset.theme = s.darkMode ? 'dark' : 'light';
  }, [s.darkMode]);

  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} className={'switch' + (on ? ' on' : '')} aria-pressed={on}>
      <span className="knob" />
    </button>
  );

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ marginBottom: 20 }}>Settings</h2>

      <div className="card" style={{ padding: 4, marginBottom: 14 }}>
        <Row
          icon={<Moon size={18} />}
          title="Dark mode"
          subtitle="Easier on the eyes at night"
          right={<Toggle on={s.darkMode} onClick={() => setS(p => ({ ...p, darkMode: !p.darkMode }))} />}
        />
        <Row
          icon={<Bell size={18} />}
          title="Notifications"
          subtitle="Order updates and promotions"
          right={<Toggle on={s.notifications} onClick={() => setS(p => ({ ...p, notifications: !p.notifications }))} />}
        />
        <Row
          icon={<Globe size={18} />}
          title="Language"
          subtitle={s.language === 'en' ? 'English' : s.language}
          right={
            <select
              value={s.language}
              onChange={e => setS(p => ({ ...p, language: e.target.value }))}
              style={{ padding: '8px 10px' }}
            >
              <option value="en">English</option>
              <option value="tl">Filipino</option>
            </select>
          }
        />
      </div>

      <div className="card" style={{ padding: 4, marginBottom: 14 }}>
        <Row
          icon={<Shield size={18} />}
          title="Privacy & Security"
          subtitle="Password, sessions, and account safety"
          chevron
          onClick={() => navigate('/help/secure-account')}
        />
        <Row
          icon={<Download size={18} />}
          title={install.installed ? 'App installed' : 'Install XMARKET'}
          subtitle={install.canInstall ? 'Tap to install this app' : 'Available from your browser menu'}
          chevron
          onClick={async () => {
            if (install.installed) return toast('Already installed');
            const r = await install.promptInstall();
            if (r === 'unavailable') toast('Use browser menu → Install app');
          }}
        />
        <Row
          icon={<Info size={18} />}
          title="About XMARKET"
          subtitle="Version 1.0.0"
          chevron
          onClick={() => toast('XMARKET — Your World of Great Deals')}
        />
      </div>

      <div className="card" style={{ padding: 4 }}>
        <Row
          icon={<Trash2 size={18} />}
          title="Delete account"
          subtitle="Permanently remove your XMARKET account"
          danger
          chevron
          onClick={() => toast('Please contact Support to delete your account')}
        />
      </div>
    </div>
  );
}

function Row({ icon, title, subtitle, right, chevron, onClick, danger }) {
  return (
    <div
      className="settings-row"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="sr-icon" style={{ color: danger ? '#DC2626' : 'var(--text)' }}>{icon}</div>
      <div className="sr-body">
        <div className="sr-title" style={{ color: danger ? '#DC2626' : 'var(--text)' }}>{title}</div>
        {subtitle && <div className="sr-sub">{subtitle}</div>}
      </div>
      <div className="sr-right">{right || (chevron ? <span style={{ color: 'var(--muted)' }}>›</span> : null)}</div>
    </div>
  );
}
