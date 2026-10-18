import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, CreditCard, Gift, Ticket } from 'lucide-react';
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
  padding: '12px 6px',
  textAlign: 'center',
};

const iconBox = (grad) => ({
  width: 36, height: 36, borderRadius: 10, background: grad,
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
});

const divider = <div style={{ width: 1, background: 'var(--border)', margin: '10px 0' }} />;
const labelStyle = { fontSize: 13, fontWeight: 800 };
const subStyle = { fontSize: 11.5, color: 'var(--muted)', fontWeight: 600, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' };
const panel = { flex: '0 0 100%', minWidth: 0, display: 'flex', alignItems: 'stretch', scrollSnapAlign: 'start' };

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
  const scRef = useRef(null);
  const [m, setM] = useState({ left: 0, width: 50 });

  useEffect(() => {
    if (!user) { setBalance(null); setPoints(null); return; }
    let alive = true;
    fetchWallet(user.id).then(b => { if (alive) setBalance(b); }).catch(() => {});
    fetchLoyalty(user.id).then(p => { if (alive) setPoints(p); }).catch(() => {});
    return () => { alive = false; };
  }, [user]);

  const measure = useCallback(() => {
    const el = scRef.current;
    if (!el) return;
    const { scrollWidth, clientWidth, scrollLeft } = el;
    if (scrollWidth <= clientWidth + 2) return;
    const width = (clientWidth / scrollWidth) * 100;
    const progress = scrollLeft / (scrollWidth - clientWidth);
    setM({ left: progress * (100 - width), width });
  }, []);

  useEffect(() => {
    measure();
    const t = setTimeout(measure, 300);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, [measure]);

  return (
    <div style={{ margin: '4px 16px 10px' }}>
      <style>{'.wb-scroll::-webkit-scrollbar{display:none}'}</style>
      <div style={{
        borderRadius: 14, background: 'var(--card)', border: '1px solid var(--border)', overflow: 'hidden',
      }}>
        <div
          ref={scRef}
          onScroll={measure}
          className="wb-scroll"
          style={{
            display: 'flex', overflowX: 'auto', overflowY: 'hidden',
            scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
          }}
        >
          <div style={panel}>
            <Cell to="/xwallet" grad="linear-gradient(135deg, #14B8A6, #0F766E)"
              icon={<Wallet size={18} color="#fff" />} label="Xwallet"
              sub={user ? (balance === null ? '...' : '₱' + Number(balance).toFixed(2)) : 'Sign in'} />
            {divider}
            <Cell to="/xcards" grad="linear-gradient(135deg, #6366F1, #06B6D4)"
              icon={<CreditCard size={18} color="#fff" />} label="Xcards" sub="Gift cards" />
            {divider}
            <Cell to="/play-time" grad="linear-gradient(135deg, #F59E0B, #EF4444)"
              icon={<span style={{ fontSize: 18, lineHeight: 1 }}>🎮</span>} label="Play Time" sub="Earn points" />
          </div>

          <div style={panel}>
            <Cell to="/bundles" grad="linear-gradient(135deg, #2563EB, #7C3AED)"
              icon={<Gift size={18} color="#fff" />} label="Bundle Deals" sub="Save together" />
            {divider}
            <Cell to="/rewards" grad="linear-gradient(135deg, #F59E0B, #D97706)"
              icon={<CoinIcon size={18} color="#fff" />} label="Loyalty Points"
              sub={user ? (points === null ? '...' : Number(points).toLocaleString() + ' pts') : 'Earn rewards'} />
            {divider}
            <Cell to="/vouchers" grad="linear-gradient(135deg, #7C3AED, #EC4899)"
              icon={<Ticket size={18} color="#fff" />} label="Vouchers" sub="Promo codes" />
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', height: 3, width: 64, margin: '8px auto 0', borderRadius: 999, background: 'var(--border)' }}>
        <div className="pill-thumb" style={{ position: 'absolute', top: 0, bottom: 0, left: m.left + '%', width: m.width + '%', borderRadius: 999, transition: 'left .12s ease-out' }} />
      </div>
    </div>
  );
}
