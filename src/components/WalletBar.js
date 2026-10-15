import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, CreditCard, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchWallet } from '../lib/xwallet';

const tap = {
  WebkitTapHighlightColor: 'transparent',
  textDecoration: 'none',
  color: 'var(--text)',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flex: 1,
  minWidth: 0,
  padding: '12px 14px',
};

const iconBox = (grad) => ({
  width: 36, height: 36, borderRadius: 10, background: grad,
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
});

export default function WalletBar() {
  const { user } = useAuth() || {};
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (!user) { setBalance(null); return; }
    let alive = true;
    fetchWallet(user.id).then(b => { if (alive) setBalance(b); }).catch(() => {});
    return () => { alive = false; };
  }, [user]);

  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      margin: '4px 16px 10px', borderRadius: 14,
      background: 'var(--card)', border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <Link to="/xwallet" style={tap}>
        <div style={iconBox('linear-gradient(135deg, #14B8A6, #0F766E)')}>
          <Wallet size={18} color="#fff" />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Xwallet</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginTop: 1 }}>
            {user ? (balance === null ? '...' : '₱' + Number(balance).toFixed(2)) : 'Sign in'}
          </div>
        </div>
        <ChevronRight size={16} color="var(--muted)" />
      </Link>

      <div style={{ width: 1, background: 'var(--border)', margin: '10px 0' }} />

      <Link to="/xcards" style={tap}>
        <div style={iconBox('linear-gradient(135deg, #6366F1, #06B6D4)')}>
          <CreditCard size={18} color="#fff" />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Xcards</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginTop: 1 }}>Gift cards</div>
        </div>
        <ChevronRight size={16} color="var(--muted)" />
      </Link>
    </div>
  );
}
