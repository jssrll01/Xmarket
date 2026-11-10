import { supabase } from '../../lib/supabase';
import { GameListSkeleton } from '../../components/Skeleton';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Repeat, History as HistoryIcon, Lock } from 'lucide-react';
import { WheelIcon, BoxIcon } from './GameIcons';
import { fetchHistory, fmt, peso } from '../../lib/playtime';
import { usePlay, gateReason, HistoryRow } from './common';

const CSS = `
.ar{padding:16px 16px 70px;max-width:560px;margin:0 auto}
.ar-head{display:flex;align-items:center;gap:14px;margin-bottom:18px}
.ar-head h1{font-size:22px;font-weight:700;letter-spacing:-.02em;line-height:1.1;margin:0}
.ar-head p{font-size:12.5px;color:var(--muted);margin:3px 0 0}
.ar-panel{background:var(--card);border-radius:22px;padding:12px;box-shadow:var(--raised)}
.ar-score{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ar-lcd{background:var(--bg);box-shadow:var(--inset);border-radius:16px;padding:12px 14px;min-width:0}
.ar-lcd span{display:block;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.ar-lcd b{display:block;margin-top:6px;font-family:ui-monospace,Menlo,monospace;font-size:23px;font-weight:700;letter-spacing:.03em;font-variant-numeric:tabular-nums;color:var(--text);overflow:hidden;text-overflow:ellipsis}
.ar-rate{font-size:11.5px;color:var(--muted);text-align:center;margin:10px 0 2px}
.ar-lab{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:26px 2px 12px;display:flex;justify-content:space-between;align-items:center}
.ar-lab a{display:flex;align-items:center;gap:5px;color:var(--primary);letter-spacing:0;text-transform:none;font-size:12.5px;font-weight:600;text-decoration:none}
.ar-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.ar-g{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;padding:16px 10px 14px;border-radius:22px;background:var(--card);box-shadow:var(--raised-sm);text-decoration:none;color:inherit}
.ar-g:active{box-shadow:var(--inset)}
.ar-g.low .ar-dome{opacity:.75}
.ar-dome{width:72px;height:72px;border-radius:50%;background:var(--bg);box-shadow:var(--inset);display:flex;align-items:center;justify-content:center;margin-bottom:6px}
.ar-dome i{width:52px;height:52px;border-radius:50%;background:var(--card);box-shadow:var(--raised-sm);display:flex;align-items:center;justify-content:center;font-style:normal}
.ar-t{font-size:13.5px;font-weight:600;color:var(--text);line-height:1.25}
.ar-n{font-size:11px;color:var(--muted);line-height:1.35;display:flex;align-items:center;justify-content:center;gap:4px}
.ar-x{margin-top:4px;padding:3px 11px;border-radius:99px;background:var(--bg);box-shadow:var(--inset);font-family:ui-monospace,Menlo,monospace;font-size:11.5px;font-weight:700;color:var(--primary)}
.ar-g.off{background:var(--bg);box-shadow:var(--inset);opacity:.7}
.ar-g.off .ar-dome{box-shadow:none}
.ar-g.off .ar-dome i{box-shadow:none;background:transparent}
.ar-ex{width:100%;margin-top:16px;padding:15px 16px;border:0;border-radius:16px;background:var(--card);color:var(--text);box-shadow:var(--raised-sm);display:flex;align-items:center;gap:10px;font-size:14.5px;font-weight:600}
.ar-ex:active{box-shadow:var(--inset)}
.ar-ex svg{color:var(--primary)}
.ar-ex span{margin-left:auto;font-family:ui-monospace,Menlo,monospace;font-size:12px;color:var(--muted)}
.ar-steps{list-style:none;background:var(--card);border-radius:16px;box-shadow:var(--raised-sm);padding:4px 16px}
.ar-steps li{display:flex;gap:14px;padding:12px 0;border-bottom:1px solid var(--border);font-size:13px;line-height:1.45}
.ar-steps li:last-child{border-bottom:0}
.ar-steps i{font-style:normal;font-family:ui-monospace,Menlo,monospace;font-size:12px;color:var(--muted);width:18px}
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
    const box = status.config.boxes && status.config.boxes.mystery;
    games = [{ to: '/play-time/spin', title: 'Wheels of Fortune', note: 'Spin to win', tag: 'Up to 20x', cost: status.config.spin.cost, game: 'spin', Icon: WheelIcon }];
    if (box) games.push({ to: '/play-time/mystery-box', title: 'Box of Mystery', note: 'Open for a prize', tag: 'Up to 10x', cost: box.cost, game: 'box', Icon: BoxIcon });
    [
      ['airdrop', 'Airdrop', '4x'], ['mega', 'Mega Airdrop', '6x'], ['ultra', 'Ultra Airdrop', '11x'],
      ['max', 'Max Airdrop', '16x'], ['extreme', 'Extreme Airdrop', '16x'], ['nightmare', 'Nightmare Airdrop', '26x'],
    ].filter(a => airOn && airOn.includes(a[0])).forEach(a => games.push({ to: '/play-time/airdrop/' + a[0], title: a[1], note: 'Draws every ' + ({ airdrop: '3 hours', mega: '3 hours', ultra: '6 hours', max: '6 hours', extreme: '12 hours', nightmare: '12 hours' }[a[0]] || '3 hours'), tag: a[2], cost: 0, game: 'airdrop', Icon: BoxIcon }));
  }

  return (
    <div className="page-enter ar">
      <style>{CSS}</style>
      <header className="ar-head">
        <button className="icon-btn" aria-label="Back" onClick={() => nav('/')}><ArrowLeft size={20} /></button>
        <div><h1>Play Time</h1><p>Play, earn points, exchange for Xwallet.</p></div>
      </header>

      <div className="ar-panel">
        <div className="ar-score">
          <div className="ar-lcd"><span>Loyalty points</span><b>{status ? fmt(status.loyalty_points) : '—'}</b></div>
          <div className="ar-lcd"><span>Xwallet</span><b>{status ? peso(status.xwallet_balance) : '—'}</b></div>
        </div>
        <div className="ar-rate">1 Loyalty Point = ₱1 Xwallet balance</div>
      </div>
      {error && <div style={{ color: '#991B1B', fontSize: 13, marginTop: 12 }}>{error}</div>}
      {!status && !error && <div style={{ marginTop: 20 }}><GameListSkeleton /></div>}

      {status && (<>
        <div className="ar-lab">Games</div>
        <div className="ar-grid">
          {games.map(g => {
            const reason = gateReason(status, g.game, g.cost);
            const off = !!reason && g.game === 'mini';
            const body = (<>
              <span className="ar-dome"><i><g.Icon size={22} color="var(--text)" /></i></span>
              <div className="ar-t">{g.title}</div>
              <div className="ar-n">{off ? <><Lock size={11} />{reason}</> : g.note}</div>
              <span className="ar-x">{g.tag}</span>
            </>);
            return <Link key={g.to} to={g.to} className={'ar-g' + (off ? ' low' : '')}>{body}</Link>;
          })}
        </div>

        <button className="ar-ex" onClick={() => nav('/play-time/exchange')}>
          <Repeat size={17} /> Points Exchange <span>1 pt = ₱1</span>
        </button>

        <div className="ar-lab">How it works</div>
        <ol className="ar-steps">
          {['Pick a game and play with your Loyalty Points.', 'Winnings are added to your balance right away.', 'Exchange points for Xwallet any time: 1 point = ₱1.', 'Use your Xwallet balance for XMARKET purchases.'].map((s, i) => <li key={i}><i>0{i + 1}</i>{s}</li>)}
        </ol>

        <div className="ar-lab">Recent activity <Link to="/play-time/history"><HistoryIcon size={14} />View all</Link></div>
        {recent.length === 0
          ? <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: 16 }}>No activity yet. Pick a game to get started.</p>
          : recent.map(t => <HistoryRow key={t.id} t={t} />)}
      </>)}
    </div>
  );
}
