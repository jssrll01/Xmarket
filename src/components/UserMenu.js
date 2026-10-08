import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Heart, Gift, Users, Settings, LogOut, Ticket } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function UserMenu() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const go = (path) => { setOpen(false); nav(path); };

  const signOut = async () => {
    try { await supabase.auth.signOut(); } catch {}
    setOpen(false);
    nav('/');
  };

  const row = {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 16px', fontSize: 14, fontWeight: 600,
    color: 'inherit', cursor: 'pointer',
    background: 'none', border: 'none', width: '100%', textAlign: 'left',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="icon-btn" onClick={() => setOpen(o => !o)} aria-label="Account menu">
        <User size={20} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 44, right: 0, zIndex: 200,
          width: 240, borderRadius: 14, overflow: 'hidden',
          background: 'var(--card)', border: '1px solid var(--border)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}>
          {user ? (
            <>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>
                  {user.user_metadata?.first_name || user.email?.split('@')[0] || 'User'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{user.email}</div>
              </div>

              <button style={row} onClick={() => go('/profile')}>
                <User size={16} /> Profile
              </button>
              <button style={row} onClick={() => go('/orders')}>
                <Package size={16} /> Orders
              </button>
              <button style={row} onClick={() => go('/wishlist')}>
                <Heart size={16} /> Wishlist
              </button>
              <button style={row} onClick={() => go('/rewards')}>
                <Gift size={16} /> Loyalty Points
              </button>
              <button style={row} onClick={() => go('/vouchers')}>
                <Ticket size={16} /> My Vouchers
              </button>
              <button style={row} onClick={() => go('/following')}>
                <Users size={16} /> Following
              </button>
              <button style={row} onClick={() => go('/account')}>
                <Settings size={16} /> Account settings
              </button>

              <div style={{ borderTop: '1px solid var(--border)' }} />
              <button style={{ ...row, color: '#DC2626' }} onClick={signOut}>
                <LogOut size={16} /> Sign out
              </button>
            </>
          ) : (
            <>
              <button style={row} onClick={() => go('/signin')}>
                <User size={16} /> Sign in
              </button>
              <button style={row} onClick={() => go('/signup')}>
                <User size={16} /> Create account
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
