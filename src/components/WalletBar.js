import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchWallet } from '../lib/xwallet';
import { fetchLoyalty } from '../lib/promos';
import { CoinIcon } from '../pages/playtime/GameIcons';

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
  padding: '12px 4px',
  textAlign: 'center',
};
const iconBox = (grad) => ({
  width: 36, height: 36, borderRadius: 10, background: grad,
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
});
const divider = <div style={{ width: 1, background: 'var(--border)', margin: '10px 0' }} />;
const labelStyle = { fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' };
const subStyle = { fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' };

function Cell({ to, grad, icon, label, sub }) {
  return (
    <Link to={to} style={cell}>
      <div style={iconBox(grad)}>{icon}</div>
      <div style={{ minWidth: 0, maxWidth: '100%' }}>
        <div style={labelStyle}>{label}</div>
        <div style={subStyle}>{sub}</div>
      </div>
    </Link>
  );
}

export default function WalletBar() {
  const { user } = useAuth() || {};
  const [balance, setBalance] = useState(null);
  const [points, setPoints] = useState(null);

  useEffect(() => {
    if (!user) { setBalance(null); setPoints(null); return; }
    let alive = true;
    fetchWallet(user.id).then(b => { if (alive) setBalance(b); }).catch(() => {});
    fetchLoyalty(user.id).then(p => { if (alive) setPoints(p); }).catch(() => {});
    return () => { alive = false; };
  }, [user]);

  return (
    <div style={{ margin: '4px 16px 10px' }}>
      <div style={{ borderRadius: 14, background: 'var(--card)', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'stretch' }}>
        <Cell to="/xwallet" grad="linear-gradient(135deg, #14B8A6, #0F766E)"
          icon={<Wallet size={18} color="#fff" />} label="Xwallet"
          sub={user ? (balance === null ? '...' : '₱' + Number(balance).toFixed(2)) : 'Sign in'} />
        {divider}
        <Cell to="/rewards" grad="linear-gradient(135deg, #F59E0B, #D97706)"
          icon={<CoinIcon size={18} color="#fff" />} label="Loyalty"
          sub={user ? (points === null ? '...' : Number(points).toLocaleString() + ' pts') : 'Earn rewards'} />
        {divider}
        <Cell to="/xcards" grad="linear-gradient(135deg, #6366F1, #06B6D4)"
          icon={<CreditCard size={18} color="#fff" />} label="Xcards" sub="Gift cards" />
        {divider}
        <Cell to="/play-time" grad="linear-gradient(135deg, #F59E0B, #EF4444)"
          icon={<span style={{ fontSize: 18, lineHeight: 1 }}>🎮</span>} label="Play Time" sub="Earn points" />
      </div>
    </div>
  );
}
