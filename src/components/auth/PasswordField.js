import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function PasswordField({ label = 'Password', ...props }) {
  const [show, setShow] = useState(false);
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
        <Lock size={18} style={{ color: 'var(--muted)', flexShrink: 0, marginRight: 10 }} />
        <input
          {...props}
          type={show ? 'text' : 'password'}
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
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{ background: 'none', padding: 4, color: 'var(--muted)' }}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  );
}
