import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../lib/auth';

export default function UserMenu() {
  const nav = useNavigate();
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, [open]);

  if (!user) {
    return (
      <button className="icon-btn" onClick={() => nav('/signin')} title="Sign in">
        <User size={20} />
      </button>
    );
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="icon-btn" onClick={() => setOpen(o => !o)}>
        <User size={20} />
      </button>
      {open && (
        <div className="dd-menu" style={{ right: 0, left: 'auto', minWidth: 180, position: 'absolute', top: '100%', marginTop: 8 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{profile?.username || user.email}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{user.email}</div>
          </div>
          <button className="dd-item" onClick={() => { setOpen(false); nav('/orders'); }}>
            <Package size={14} /> My Orders
          </button>
          <button className="dd-item" onClick={async () => { setOpen(false); await signOut(); nav('/'); }}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
