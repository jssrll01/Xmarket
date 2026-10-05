import React from 'react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Yes', cancelLabel = 'Cancel' }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 250,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, animation: 'fadeIn 0.2s ease'
    }}>
      <div className="card" style={{ padding: 20, maxWidth: 340, width: '100%' }}>
        <h3 style={{ marginBottom: 8, fontSize: 17 }}>{title}</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 13, lineHeight: 1.5, marginBottom: 18 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} className="btn-ghost" style={{ flex: 1, padding: 12 }}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="btn-primary" style={{ flex: 1, padding: 12 }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
