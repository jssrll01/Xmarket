import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AuthShell({ title, subtitle, children, footer }) {
  const nav = useNavigate();
  return (
    <div className="page-enter" style={{
      minHeight: '100vh',
      padding: '20px 16px 60px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'var(--bg)',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 20 }}>
          <ArrowLeft size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: -0.8,
            background: 'linear-gradient(135deg, var(--primary), var(--purple))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 6,
          }}>
            XMARKET
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Your World of Great Deals</div>
        </div>

        <div className="card" style={{ padding: '28px 22px', borderRadius: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, textAlign: 'center' }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 22, textAlign: 'center' }}>
              {subtitle}
            </p>
          )}
          {children}
        </div>

        {footer && (
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
