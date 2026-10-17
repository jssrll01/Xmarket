import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchWallet } from '../lib/xwallet';

const cell = {
  WebkitTapHighlightColor: 'transparent',
  textDecoration: 'none',
  color: 'var(--text)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  flex: 1,
  minWidth: 0,
  padding: '12px 6px',
  textAlign: 'center',
};

const iconBox = (grad) => ({
  width: 36, height: 36, borderRadius: 10, background: grad,
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
});

const divider = <div style={{ width: 1, background: 'var(--border)', margin: '10px 0' }} />;

export default function WalletBar() {
  const { user } = useAuth() || {};
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (!user) { setBalance(null); return; }
    let alive = true;
    fetchWallet(user.id).then(b => { if (alive) setBalance(b); }).catch(() => {});
    return () => { alive = false; };
  }, [user]);

  const label = { fontSize: 13, fontWeight: 800 };
  const sub = { fontSize: 11.5, color: 'var(--muted)', fontWeight: 600, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' };

  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      margin: '4px 16px 10px', borderRadius: 14,
      background: 'var(--card)', border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <Link to="/xwallet" style={cell}>
        <div style={iconBox('linear-gradient(135deg, #14B8A6, #0F766E)')}><Wallet size={18} color="#fff" /></div>
        <div style={{ minWidth: 0, maxWidth: '100%' }}>
          <div style={label}>Xwallet</div>
          <div style={sub}>{user ? (balance === null ? '...' : '₱' + Number(balance).toFixed(2)) : 'Sign in'}</div>
        </div>
      </Link>

      {divider}

      <Link to="/xcards" style={cell}>
        <div style={iconBox('linear-gradient(135deg, #6366F1, #06B6D4)')}><CreditCard size={18} color="#fff" /></div>
        <div style={{ minWidth: 0, maxWidth: '100%' }}>
          <div style={label}>Xcards</div>
          <div style={sub}>Gift cards</div>
        </div>
      </Link>

      {divider}

      <Link to="/play-time" style={cell}>
        <div style={iconBox('linear-gradient(135deg, #F59E0B, #EF4444)')}><span style={{ fontSize: 18, lineHeight: 1 }}>🎮</span></div>
        <div style={{ minWidth: 0, maxWidth: '100%' }}>
          <div style={label}>Play Time</div>
          <div style={sub}>Earn points</div>
        </div>
      </Link>
    </div>
  );
}
