import { supabase } from '../../lib/supabase';
import { GameListSkeleton } from '../../components/Skeleton';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Repeat, History as HistoryIcon, ChevronRight, Lock } from 'lucide-react';
import { WheelIcon, BoxIcon, CoinIcon, PaletteIcon, HiLoIcon, CardsIcon } from './GameIcons';
import { fetchHistory, fmt, peso } from '../../lib/playtime';
import { usePlay, gateReason, HistoryRow } from './common';
import { miniGate } from './miniCommon';

const CSS = `
.pt2{padding:16px 16px 70px;max-width:560px;margin:0 auto}
.pt2-head{display:flex;align-items:center;gap:14px;margin-bottom:20px}
.pt2-head h1{font-size:22px;font-weight:700;letter-spacing:-.02em;line-height:1.1}
.pt2-head p{font-size:12.5px;color:#64748B;margin-top:3px}
.pt2-bal{display:grid;grid-template-columns:1fr 1fr;border:1px solid #E5E7EB;border-radius:14px;background:#fff}
.pt2-bal div{padding:16px}.pt2-bal div+div{border-left:1px solid #E5E7EB}
.pt2-bal span{font-size:10.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#64748B}
.pt2-bal b{display:block;font-size:26px;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums;margin-top:6px}
.pt2-rate{font-size:11.5px;color:#94A3B8;margin:8px 2px 0}
.pt2-lab{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#64748B;margin:28px 0 10px;display:flex;justify-content:space-between;align-items:center}
.pt2-lab a{display:flex;align-items:center;gap:5px;color:#2563EB;letter-spacing:0;text-transform:none;font-size:12.5px;font-weight:600}
.pt2-list{border:1px solid #E5E7EB;border-radius:14px;background:#fff;overflow:hidden}
.pt2-g{display:flex;align-items:center;gap:14px;padding:14px 16px;border-bottom:1px solid #EEF1F5;color:inherit;text-decoration:none}
.pt2-g:last-child{border-bottom:0}
.pt2-ic{width:38px;height:38px;border-radius:10px;border:1px solid #E1E5EB;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#F8FAFC}
.pt2-t{font-size:14.5px;font-weight:600;letter-spacing:-.01em}
.pt2-n{font-size:12px;color:#64748B;margin-top:2px}
.pt2-g.off{opacity:.55}.pt2-g.off .pt2-n{display:flex;align-items:center;gap:5px}
.pt2-x{margin-left:auto;font-size:12px;font-weight:700;font-variant-numeric:tabular-nums;color:#0F172A;white-space:nowrap}
.pt2-ex{width:100%;margin-top:14px;padding:15px 16px;border-radius:12px;background:linear-gradient(135deg,#FFFFFF,#EFF6FF);color:#1D4ED8;border:1px solid #BFDBFE;box-shadow:0 8px 18px -12px rgba(37,99,235,.55);display:flex;align-items:center;gap:10px;font-size:14.5px;font-weight:700;position:relative;overflow:hidden;transition:transform .2s}
.pt2-ex span{margin-left:auto;font-size:12px;color:#3B82F6;font-weight:600}
@keyframes ptUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes ptFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes ptSheen{0%,55%{transform:translateX(-120%)}100%{transform:translateX(320%)}}
.pt2-g{animation:ptUp .5s cubic-bezier(.2,.8,.2,1) both;transition:background .2s,transform .2s}
.pt2-g:nth-child(2){animation-delay:.07s}.pt2-g:nth-child(3){animation-delay:.14s}
.pt2-g:not(.off):hover,.pt2-g:not(.off):active{background:#F5F9FF;transform:translateX(3px)}
.pt2-g:not(.off) .pt2-ic{background:#EFF6FF;border-color:#BFDBFE;animation:ptFloat 3.4s ease-in-out infinite}
.pt2-bal{animation:ptUp .5s both}
.pt2-ex:active{transform:scale(.98)}
.pt2-ex::after{content:"";position:absolute;top:0;left:0;width:35%;height:100%;background:linear-gradient(100deg,transparent,rgba(37,99,235,.14),transparent);animation:ptSheen 5s ease-in-out infinite;pointer-events:none}
@media(prefers-reduced-motion:reduce){.pt2-g,.pt2-ic,.pt2-bal,.pt2-ex::after{animation:none!important}}
.pt2-steps{list-style:none;border-top:1px solid #E5E7EB}
.pt2-steps li{display:flex;gap:14px;padding:13px 0;border-bottom:1px solid #E5E7EB;font-size:13px;line-height:1.45}
.pt2-steps i{font-style:normal;font-family:ui-monospace,Menlo,monospace;font-size:12px;color:#94A3B8;width:18px}
`;

export default function PlayTime() {
  const nav = useNavigate();
  const { status, error } = usePlay();
  const [recent, setRecent] = useState([]);
  useEffect(() => { fetchHistory(5).then(setRecent); }, []);
  const [airOn, setAirOn] = useState(null);
  useEffect(() => { supabase.rpc('airdrop_enabled_tiers').then(r => setAirOn(Array.isArray(r.data) ? r.data : [])); }, []);

  let games = [];
  if (status) {
    const mini = status.config.mini || {};
    const box = status.config.boxes && status.config.boxes.mystery;
    games = [{ to: '/play-time/spin', title: 'Wheels of Fortune', note: 'Spin to win', tag: 'Up to 20x', cost: status.config.spin.cost, game: 'spin', Icon: WheelIcon }];
    if (box) games.push({ to: '/play-time/mystery-box', title: 'Box of Mystery', note: 'Open for a prize', tag: 'Up to 10x', cost: box.cost, game: 'box', Icon: BoxIcon });
    [
      ['airdrop', 'Airdrop', '4x'], ['mega', 'Mega Airdrop', '6x'], ['ultra', 'Ultra Airdrop', '11x'],
      ['max', 'Max Airdrop', '16x'], ['extreme', 'Extreme Airdrop', '16x'], ['nightmare', 'Nightmare Airdrop', '26x'],
    ].filter(a => airOn && airOn.includes(a[0])).forEach(a => games.push({ to: '/play-time/airdrop/' + a[0], title: a[1], note: 'Drawn every 10 minutes', tag: a[2], cost: 0, game: 'airdrop', Icon: BoxIcon }));
    [
      ['coinflip', '/play-time/coin-flip', 'Head or Tails', 'Call heads or tails', CoinIcon],
    ].filter(x => mini[x[0]]).forEach(x => games.push({ to: x[1], title: x[2], note: x[3], tag: `${mini[x[0]].payout}x`, game: 'mini', key: x[0], Icon: x[4] }));
  }

  return (
    <div className="page-enter pt2">
      <style>{CSS}</style>
      <header className="pt2-head">
        <button className="icon-btn" aria-label="Back" onClick={() => nav('/')}><ArrowLeft size={20} /></button>
        <div><h1>Play Time</h1><p>Play, earn points, exchange for Xwallet.</p></div>
      </header>

      <div className="pt2-bal">
        <div><span>Loyalty points</span><b>{status ? fmt(status.loyalty_points) : '—'}</b></div>
        <div><span>Xwallet</span><b>{status ? peso(status.xwallet_balance) : '—'}</b></div>
      </div>
      <div className="pt2-rate">1 Loyalty Point = ₱1 Xwallet balance</div>
      {error && <div style={{ color: '#991B1B', fontSize: 13, marginTop: 12 }}>{error}</div>}
      {!status && !error && <div style={{ marginTop: 20 }}><GameListSkeleton /></div>}

      {status && (<>
        <div className="pt2-lab">Games</div>
        <div className="pt2-list">
          {games.map(g => {
            const reason = g.game === 'mini' ? miniGate(status, g.key) : gateReason(status, g.game, g.cost);
            const off = !!reason;
            const body = (<>
              <span className="pt2-ic"><g.Icon size={20} color="#334155" /></span>
              <div style={{ minWidth: 0 }}>
                <div className="pt2-t">{g.title}</div>
                <div className="pt2-n">{off ? <><Lock size={11} />{reason}</> : g.note}</div>
              </div>
              {off ? null : <><span className="pt2-x">{g.tag}</span><ChevronRight size={16} color="#94A3B8" /></>}
            </>);
            return off ? <div key={g.to} className="pt2-g off" aria-disabled="true">{body}</div> : <Link key={g.to} to={g.to} className="pt2-g">{body}</Link>;
          })}
        </div>

        <button className="pt2-ex" onClick={() => nav('/play-time/exchange')}>
          <Repeat size={17} /> Points Exchange <span>1 pt = ₱1</span>
        </button>

        <div className="pt2-lab">How it works</div>
        <ol className="pt2-steps">
          {['Pick a game and play with your Loyalty Points.', 'Winnings are added to your balance right away.', 'Exchange points for Xwallet any time: 1 point = ₱1.', 'Use your Xwallet balance for XMARKET purchases.'].map((s, i) => <li key={i}><i>0{i + 1}</i>{s}</li>)}
        </ol>

        <div className="pt2-lab">Recent activity <Link to="/play-time/history"><HistoryIcon size={14} />View all</Link></div>
        {recent.length === 0
          ? <p style={{ color: '#64748B', fontSize: 13, textAlign: 'center', padding: 16 }}>No activity yet. Pick a game to get started.</p>
          : recent.map(t => <HistoryRow key={t.id} t={t} />)}
      </>)}
    </div>
  );
}
