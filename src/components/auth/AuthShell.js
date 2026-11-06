import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './auth.css';

export default function AuthShell({ title, subtitle, children, footer }) {
  const nav = useNavigate();
  return (
    <div className="page-enter auth-page">
      <div className="auth-wrap">
        <button className="icon-btn auth-back" aria-label="Back" onClick={() => {
          const idx = window.history.state?.idx;
          if (typeof idx === 'number' && idx > 0) nav(-1);
          else nav('/', { replace: true });
        }}>
          <ArrowLeft size={20} />
        </button>

        <div className="auth-brand">
          <div className="auth-logo">X</div>
          <div className="auth-wordmark">XMARKET</div>
          <div className="auth-tag">Your World of Great Deals</div>
        </div>

        <div className="auth-card">
          <h2 className="auth-title">{title}</h2>
          {subtitle && <p className="auth-sub">{subtitle}</p>}
          {children}
        </div>

        {footer && <div className="auth-foot">{footer}</div>}
        <div className="auth-secure">🔒 Your information is encrypted and secure</div>
      </div>
    </div>
  );
}
