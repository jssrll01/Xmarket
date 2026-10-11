import React from 'react';

export default function StockModal({ open, message, onClose }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 18,
          padding: 24, width: '100%', maxWidth: 400,
          boxShadow: '0 20px 48px rgba(15,23,42,0.35)',
          textAlign: 'center',
        }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: '#FEE2E2', color: '#DC2626',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px', fontSize: 26, fontWeight: 900,
        }}>
          ⚠
        </div>
        <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>
          Cannot checkout
        </div>
        <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.55, marginBottom: 20 }}>
          {message}
        </div>
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: 13, borderRadius: 12,
            background: '#2563EB', color: '#fff',
            fontSize: 15, fontWeight: 800,
            border: 'none', cursor: 'pointer',
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
