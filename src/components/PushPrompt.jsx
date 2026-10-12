import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { requestPushPermission, isPushSupported } from '../lib/fcm';

export default function PushPrompt({ userId }) {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPushSupported()) return;
    if (Notification.permission === 'granted') return;
    if (localStorage.getItem('xmarket.push.dismissed') === '1') return;
    // Only show after a delay so it doesn't interrupt the first paint
    const id = setTimeout(() => setShow(true), 8000);
    return () => clearTimeout(id);
  }, []);

  const accept = async () => {
    if (!userId) return;
    setBusy(true);
    const res = await requestPushPermission({ userId });
    setBusy(false);
    if (res.ok) {
      setShow(false);
      localStorage.setItem('xmarket.push.accepted', '1');
    } else {
      setShow(false);
      localStorage.setItem('xmarket.push.dismissed', '1');
      if (res.error) console.warn('[push]', res.error);
    }
  };

  const dismiss = () => {
    localStorage.setItem('xmarket.push.dismissed', '1');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', top: 16, left: 16, right: 16, zIndex: 9100,
      background: '#fff', border: '1px solid #E2E8F0',
      borderRadius: 16, padding: 14,
      boxShadow: '0 12px 32px rgba(15,23,42,0.15)',
      display: 'flex', alignItems: 'center', gap: 12,
      maxWidth: 480, margin: '0 auto',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: '#DBEAFE', color: '#2563EB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Bell size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
          Enable notifications
        </div>
        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
          Get order updates and top-up alerts even when the app is closed
        </div>
      </div>
      <button
        onClick={accept}
        disabled={busy}
        style={{
          background: '#2563EB', color: '#fff',
          padding: '9px 14px', borderRadius: 10,
          fontSize: 13, fontWeight: 800, border: 'none',
          cursor: busy ? 'wait' : 'pointer',
        }}
      >
        {busy ? '…' : 'Enable'}
      </button>
      <button onClick={dismiss} style={{ padding: 4, color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>
        <X size={16} />
      </button>
    </div>
  );
}
