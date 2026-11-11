import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import './auth.css';

export default function PasswordField({ label = 'Password', ...props }) {
  const [show, setShow] = useState(false);
  return (
    <label className="auth-field">
      <span className="auth-label">{label}</span>
      <span className="auth-control">
        <Lock size={18} className="auth-ico" />
        <input {...props} type={show ? 'text' : 'password'} />
        <button type="button" className="auth-eye" onClick={() => setShow(s => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  );
}
