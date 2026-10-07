import React from 'react';

export default function AuthField({ icon: Icon, label, ...inputProps }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <span style={{
        display: 'block',
        fontSize: 12.5,
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: 6,
        letterSpacing: 0.2,
      }}>
        {label}
      </span>
      <span style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--card)',
        borderRadius: 14,
        boxShadow: 'var(--inset, inset 2px 2px 6px rgba(0,0,0,0.05))',
        padding: '0 14px',
      }}>
        {Icon && (
          <Icon size={18} style={{ color: 'var(--muted)', flexShrink: 0, marginRight: 10 }} />
        )}
        <input
          {...inputProps}
          style={{
            flex: 1,
            height: 52,
            padding: 0,
            border: 'none',
            background: 'transparent',
            fontSize: 15,
            color: 'var(--text)',
            boxShadow: 'none',
            outline: 'none',
          }}
        />
      </span>
    </label>
  );
}
