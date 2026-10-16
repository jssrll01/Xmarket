import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RotateCw, Gift, Repeat, History as HistoryIcon, ChevronRight, Coins, Palette, ArrowUpDown, Spade } from 'lucide-react';
import { fetchHistory, fmt } from '../../lib/playtime';
import { usePlay, gateReason, PlayHeader, Balances, ProgressBar, HistoryRow } from './common';
import { miniGate } from './miniCommon';

export default function PlayTime() {
  const nav = useNavigate();
  const { status, error } = usePlay();
  const [recent, setRecent] = useState([]);
  useEffect(() => { fetchHistory(5).then(setRecent); }, []);

  let games = [];
  if (status) {
    const boxes = Object.values(status.config.boxes);
    const minBox = Math.min(...boxes.map(b => b.cost));
    games = [
      { to: '/play-time/spin', title: 'Spin the Wheel', desc: 'Spin for Loyalty Points', cost: status.config.spin.cost, game: 'spin', Icon: RotateCw, grad: 'linear-gradient(135deg,#2563EB,#7C3AED)' },
      { to: '/play-time/mystery-box', title: 'Mystery Box', desc: '5 boxes, from Common to Mythical', cost: minBox, game: 'box', Icon: Gift, grad: 'linear-gradient(135deg,#F59E0B,#EF4444)', from: true },
    ];
    const mini = status.config.mini || {};
    const minis = [
      ['coinflip', '/play-time/coin-flip', 'Coin Flip', 'Call heads or tails', Coins, 'linear-gradient(135deg,#F59E0B,#D97706)'],
      ['color', '/play-time/color-game', 'Color Game', 'Pick the winning color', Palette, 'linear-gradient(135deg,#EC4899,#8B5CF6)'],
      ['hilo', '/play-time/hi-lo', 'Hi-Lo', 'Higher or lower card', ArrowUpDown, 'linear-gradient(135deg,#06B6D4,#2563EB)'],
      ['redblack', '/play-time/red-or-black', 'Red or Black', 'Guess the card color', Spade, 'linear-gradient(135deg,#475569,#EF4444)'],
    ].filter(x => mini[x[0]]).map(x => ({
      to: x[1], title: x[2], desc: x[3] + ' · ' + mini[x[0]].win_rate + '% win chance', cost: mini[x[0]].cost,
      game: 'mini', key: x[0], Icon: x[4], grad: x[5],
    }));
    games = games.concat(minis);
  }

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <PlayHeader title="Play Time" subtitle="Play daily, earn Loyalty Points, exchange them for XWallet." back="/" />
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
                  <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4, color: off ? '#92400E' : 'var(--primary)' }}>
                    {off ? reason : `${g.from ? 'From ' : 'Cost: '}${fmt(g.cost)} Loyalty Points${g.from ? '' : ' / draw'}`}
                  </div>
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

          <h3 style={{ fontSize: 16, fontWeight: 800, margin: '24px 0 10px' }}>Today</h3>
          <div className="card" style={{ padding: 14 }}>
            <ProgressBar label="Rewards earned" value={status.earned_today} max={status.config.limits.daily_earn_limit} text={`${fmt(status.earned_today)} / ${fmt(status.config.limits.daily_earn_limit)}`} />
            <ProgressBar label="Spins" value={status.spins_today} max={status.config.limits.daily_spins} text={`${status.spins_today} / ${status.config.limits.daily_spins}`} />
            <ProgressBar label="Boxes opened" value={status.boxes_today} max={status.config.limits.daily_boxes} text={`${status.boxes_today} / ${status.config.limits.daily_boxes}`} />
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
