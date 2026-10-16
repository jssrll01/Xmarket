import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchStatus, fetchGameHistory, fmt, peso } from '../../lib/playtime';

export function usePlay() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    const s = await fetchStatus();
    if (s && s.ok) { setStatus(s); setError(''); }
    else setError((s && s.message) || 'Could not load Play Time.');
  }, []);
  useEffect(() => {
    if (authLoading) return;
    if (!user) { nav('/signin', { replace: true }); return; }
    reload();
  }, [user, authLoading, nav, reload]);
  return { user, status, setStatus, error, reload };
}

export function gateReason(status, game, cost) {
  if (!status) return 'Loading…';
  if (status.loyalty_points < cost) return `You need ${fmt(cost)} Loyalty Points to play.`;
  return '';
}

export function PlayHeader({ title, subtitle, back }) {
  const nav = useNavigate();
  return (
    <div style={{ marginBottom: 14 }}>
      <button onClick={() => nav(back || '/play-time')} className="icon-btn" style={{ marginBottom: 12 }}><ArrowLeft size={20} /></button>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: 'var(--muted)' }}>{subtitle}</p>}
    </div>
  );
}

export function Balances({ status }) {
  const box = (grad) => ({ borderRadius: 16, padding: 14, color: '#fff', background: grad, position: 'relative', overflow: 'hidden' });
  const lab = { fontSize: 11, fontWeight: 700, opacity: 0.9, textTransform: 'uppercase', letterSpacing: 0.6, display: 'flex', alignItems: 'center', gap: 6 };
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={box('linear-gradient(135deg,#2563EB,#7C3AED)')}>
          <div style={lab}><Coins size={14} /> Loyalty Points</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6 }}>{status ? fmt(status.loyalty_points) : '…'}</div>
        </div>
        <div style={box('linear-gradient(135deg,#10B981,#059669)')}>
          <div style={lab}><Wallet size={14} /> XWallet Balance</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6 }}>{status ? peso(status.xwallet_balance) : '…'}</div>
        </div>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--muted)', textAlign: 'center', marginTop: 8 }}>1 Loyalty Point = ₱1 XWallet balance</div>
    </>
  );
}

export function BigButton({ disabled, onClick, children }) {
  return (
    <button onClick={onClick} disabled={disabled} className={disabled ? '' : 'btn-primary'}
      style={{
        width: '100%', padding: 15, fontSize: 15, fontWeight: 800, borderRadius: 14, border: 'none',
        background: disabled ? '#CBD5E1' : undefined, color: disabled ? '#fff' : undefined,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}>{children}</button>
  );
}

export function Notice({ children, tone }) {
  const warn = tone !== 'ok';
  return (
    <div style={{ padding: '10px 12px', borderRadius: 10, margin: '12px 0', fontSize: 12.5, fontWeight: 600,
      background: warn ? '#FEF3C7' : '#D1FAE5', color: warn ? '#92400E' : '#065F46' }}>{children}</div>
  );
}

export function ResultModal({ title, big, sub, actionLabel, onAction, onClose }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="pt-pop" style={{ width: '100%', maxWidth: 340, background: 'var(--bg, #fff)', borderRadius: 20, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.6 }}>{title}</div>
        <div style={{ fontSize: 34, fontWeight: 900, margin: '10px 0 4px', color: 'var(--primary)' }}>{big}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18 }}>{sub}</div>
        <button className="btn-primary" onClick={onAction} style={{ width: '100%', padding: 13, borderRadius: 12, fontWeight: 800, marginBottom: 8 }}>{actionLabel}</button>
        <button className="btn-ghost" onClick={onClose} style={{ width: '100%', padding: 12 }}>Close</button>
      </div>
    </div>
  );
}

const TITLES = { spin: 'Spin the Wheel', box: 'Mystery Box', exchange: 'Coin Exchange', coinflip: 'Coin Flip', color: 'Color Game', hilo: 'Hi-Lo', redblack: 'Red or Black', adjust: 'Admin adjustment' };

export function HistoryRow({ t }) {
  const title = TITLES[t.game] || t.game;
  const parts = [];
  if (t.spent > 0) parts.push([`-${fmt(t.spent)} Loyalty Points`, '#DC2626']);
  if (t.earned > 0) parts.push([`+${fmt(t.earned)} Loyalty Points`, '#059669']);
  if (Number(t.wallet_credit) > 0) parts.push([`+${peso(t.wallet_credit)} XWallet`, '#059669']);
  return (
    <div className="card" style={{ padding: 12, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 800 }}>{title}</div>
        <div style={{ textAlign: 'right' }}>
          {parts.map(([txt, color]) => <div key={txt} style={{ fontSize: 12.5, fontWeight: 800, color }}>{txt}</div>)}
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, lineHeight: 1.6 }}>
        {new Date(t.created_at).toLocaleString()}<br />
        Balance {fmt(t.prev_balance)} → {fmt(t.new_balance)} · <span title={t.id}>ID {String(t.id).slice(0, 8).toUpperCase()}</span>
      </div>
    </div>
  );
}

export function GameInfo({ game, steps, refresh }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    let alive = true;
    fetchGameHistory(game, 5).then(r => { if (alive) setRows(r); });
    return () => { alive = false; };
  }, [game, refresh]);
  return (
    <>
      <h3 style={{ fontSize: 15, fontWeight: 800, margin: '24px 0 8px' }}>How to play</h3>
      <div className="card" style={{ padding: '6px 14px' }}>
        {(steps || []).map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', fontSize: 13, lineHeight: 1.5, borderBottom: i === steps.length - 1 ? 'none' : '1px solid var(--border)' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 800, margin: '22px 0 8px' }}>Your recent plays</h3>
      {rows.length === 0
        ? <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: 14 }}>No plays yet.</p>
        : rows.map(t => <HistoryRow key={t.id} t={t} />)}
    </>
  );
}
