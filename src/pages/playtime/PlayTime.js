import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RotateCw, Gift, Repeat, History as HistoryIcon, ChevronRight, Coins, Palette, ArrowUpDown, Spade } from 'lucide-react';
import { fetchHistory, fmt } from '../../lib/playtime';
import { usePlay, gateReason, PlayHeader, Balances, HistoryRow } from './common';
import { miniGate } from './miniCommon';

export default function PlayTime() {
  const nav = useNavigate();
  const { status, error } = usePlay();
  const [recent, setRecent] = useState([]);
  useEffect(() => { fetchHistory(5).then(setRecent); }, []);

  let games = [];
  if (status) {
    const mini = status.config.mini || {};
    const box = status.config.boxes && status.config.boxes.mystery;
    games = [
      { to: '/play-time/spin', title: 'Spin the Wheel', desc: 'Spin for Loyalty Points', note: `Cost: ${fmt(status.config.spin.cost)} Loyalty Points / draw`, cost: status.config.spin.cost, game: 'spin', Icon: RotateCw, grad: 'linear-gradient(135deg,#2563EB,#7C3AED)' },
    ];
    if (box) games.push({ to: '/play-time/mystery-box', title: 'Mystery Box', desc: 'Open the box and see what is inside', note: `Cost: ${fmt(box.cost)} Loyalty Points / box`, cost: box.cost, game: 'box', Icon: Gift, grad: 'linear-gradient(135deg,#F59E0B,#EF4444)' });
    [
      ['coinflip', '/play-time/coin-flip', 'Coin Flip', 'Call heads or tails', Coins, 'linear-gradient(135deg,#F59E0B,#D97706)'],
      ['color', '/play-time/color-game', 'Color Game', 'Pick the winning color', Palette, 'linear-gradient(135deg,#EC4899,#8B5CF6)'],
      ['hilo', '/play-time/hi-lo', 'Hi-Lo', 'Higher or lower card', ArrowUpDown, 'linear-gradient(135deg,#06B6D4,#2563EB)'],
      ['redblack', '/play-time/red-or-black', 'Red or Black', 'Guess the card color', Spade, 'linear-gradient(135deg,#475569,#EF4444)'],
    ].filter(x => mini[x[0]]).forEach(x => games.push({
      to: x[1], title: x[2], desc: x[3], note: `Your bet · from ${fmt(mini[x[0]].min_bet || 1)} Loyalty Points`,
      game: 'mini', key: x[0], Icon: x[4], grad: x[5],
    }));
  }

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <PlayHeader title="Play Time" subtitle="Play, earn Loyalty Points, exchange them for XWallet." back="/" />
      <Balances status={status} />
      {error && <div style={{ color: '#991B1B', fontSize: 13, marginTop: 12 }}>{error}</div>}

      {status && (
        <>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: '22px 0 10px' }}>Games</h3>
          {games.map(g => {
            const reason = g.game === 'mini' ? miniGate(status, g.key) : gateReason(status, g.game, g.cost);
            const off = !!reason;
            const body = (
              <div className="card" style={{ padding: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, opacity: off ? 0.75 : 1 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: off ? '#CBD5E1' : g.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <g.Icon size={22} color="#fff" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{g.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{g.desc}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4, color: off ? '#92400E' : 'var(--primary)' }}>{off ? reason : g.note}</div>
                </div>
                {!off && <ChevronRight size={18} color="var(--muted)" />}
              </div>
            );
            return off
              ? <div key={g.to} aria-disabled="true">{body}</div>
              : <Link key={g.to} to={g.to} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>{body}</Link>;
          })}

          <button className="btn-primary" onClick={() => nav('/play-time/exchange')}
            style={{ width: '100%', padding: 14, borderRadius: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
            <Repeat size={16} /> Exchange Loyalty Points
          </button>

          <h3 style={{ fontSize: 16, fontWeight: 800, margin: '24px 0 10px' }}>How it works</h3>
          <div className="card" style={{ padding: '6px 14px' }}>
            {[
              'Pick a game and play with your Loyalty Points.',
              'Winnings are added to your balance right away.',
              'Exchange points for XWallet any time: 1 point = ₱1.',
              'Use your XWallet balance for XMARKET purchases.',
            ].map((s, i, a) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', fontSize: 13, borderBottom: i === a.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 10px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>Recent activity</h3>
            <Link to="/play-time/history" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              <HistoryIcon size={14} /> View all
            </Link>
          </div>
          {recent.length === 0
            ? <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: 16 }}>No activity yet. Pick a game to get started.</p>
            : recent.map(t => <HistoryRow key={t.id} t={t} />)}
        </>
      )}
    </div>
  );
}
