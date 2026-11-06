import React from 'react';
import './auth.css';

export default function AuthField({ icon: Icon, label, ...inputProps }) {
  return (
    <label className="auth-field">
      <span className="auth-label">{label}</span>
      <span className="auth-control">
        {Icon && <Icon size={18} className="auth-ico" />}
        <input {...inputProps} />
      </span>
    </label>
  );
}
