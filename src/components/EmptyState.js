import React from 'react';

export default function EmptyState({ icon: Icon, title, message, action, onAction }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px', textAlign: 'center'
    }}>
      {Icon && (
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--card)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 18, boxShadow: 'var(--raised-sm, 0 2px 6px rgba(0,0,0,0.05))'
        }}>
          <Icon size={32} color="var(--muted)" />
        </div>
      )}
      <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>{title}</h3>
      {message && <p style={{ color: 'var(--muted)', fontSize: 13.5, maxWidth: 280, lineHeight: 1.5, marginBottom: 18 }}>{message}</p>}
      {action && (
        <button className="btn-primary" onClick={onAction} style={{ padding: '12px 22px', fontSize: 14 }}>
          {action}
        </button>
      )}
    </div>
  );
}
