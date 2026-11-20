import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Gem, Receipt } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { buyGameCredit } from '../lib/xwallet';
import useWallet from './xw/useWallet';
import { Sheet, Confirm, SignIn, Sk, peso, dt, STATUS } from './xw/ui';

const IDS_KEY = 'gc.ids';
const readIds = () => { try { return JSON.parse(localStorage.getItem(IDS_KEY) || '{}'); } catch (e) { return {}; } };
const saveIds = (game, pid, zid) => { try { const o = readIds(); o[game] = { pid, zid }; localStorage.setItem(IDS_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ } };

const CSS = `
.gc{padding:16px 16px 70px;max-width:560px;margin:0 auto}
.gc-top{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.gc-top h2{font-size:21px;font-weight:800;margin:0;flex:1;letter-spacing:-.02em}
.gc-hero{position:relative;overflow:hidden;border-radius:22px;padding:18px;margin-bottom:18px;color:#fff;background:linear-gradient(135deg,#2563EB 0%,#7C3AED 100%);box-shadow:0 10px 24px rgba(79,70,229,.28)}
.gc-hero:after{content:"";position:absolute;right:-30px;top:-30px;width:130px;height:130px;border-radius:50%;background:rgba(255,255,255,.12)}
.gc-hero small{display:block;font-size:12.5px;font-weight:600;color:#fff;opacity:.92}
.gc-hero b{display:block;color:#fff;font-size:26px;font-weight:800;margin-top:2px;font-variant-numeric:tabular-nums}
.gc-hero p{font-size:12.5px;line-height:1.45;color:#fff;opacity:.95;margin:8px 0 0;max-width:80%}
.gc-chips{display:flex;gap:8px;overflow-x:auto;padding:4px 2px 12px;margin-bottom:6px;scrollbar-width:none}
.gc-chips::-webkit-scrollbar{display:none}
.gc-chip{flex:0 0 auto;display:flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;border:0;background:var(--card);box-shadow:var(--raised-sm);font-weight:800;font-size:13px;color:var(--text)}
.gc-chip.on{background:var(--primary);color:#fff}
.gc-h{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin:6px 2px 10px}
.gc-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.gc-it{display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:18px;border:0;background:var(--card);box-shadow:var(--raised-sm);text-align:left;min-height:104px;color:var(--text)}
.gc-it:active{box-shadow:var(--inset)}
.gc-gem{width:34px;height:34px;border-radius:11px;display:flex;align-items:center;justify-content:center;background:var(--bg);box-shadow:var(--inset);color:var(--primary)}
.gc-nm{font-weight:700;font-size:13.5px;line-height:1.3}
.gc-pr{margin-top:auto;font-weight:900;font-size:16px;color:#DC2626}
.gc-empty{text-align:center;color:var(--muted);font-size:13px;padding:22px 0}
.gc-ord{padding:13px 14px;border-radius:18px;background:var(--card);box-shadow:var(--raised-sm);margin-bottom:10px;border-left:4px solid var(--c,#64748B)}
.gc-row{display:flex;justify-content:space-between;gap:8px;font-size:13.5px}
.gc-sub{font-size:12px;color:var(--muted);margin-top:4px}
.gc-st{display:inline-block;font-size:11px;font-weight:800;padding:3px 10px;border-radius:999px;color:#fff;text-transform:capitalize}
.gc-note{font-size:12px;margin-top:8px}
.gc-sum{border-radius:16px;padding:12px 14px;background:var(--bg);box-shadow:var(--inset);margin:4px 0 14px}
.gc-qty{display:flex;align-items:center;gap:14px;margin:6px 0 14px}
.gc-qty b{font-size:19px;min-width:30px;text-align:center}
.gc-tot{display:flex;justify-content:space-between;font-weight:900;font-size:17px;margin:2px 0 14px}
.gc-in{width:100%;box-sizing:border-box;padding:13px 14px;margin:6px 0 12px;font-size:14px;border-radius:14px}
.gc-lbl{font-size:12px;font-weight:700;color:var(--muted)}
.gc-fine{font-size:11.5px;color:var(--muted);margin-top:12px;line-height:1.45}
`;

const GridSk = () => (
  <div className="gc-grid">{[0, 1, 2, 3, 4, 5].map((i) => <Sk key={i} h={104} r={18} />)}</div>
);

export default function GameCredits() {
  const nav = useNavigate();
  const { show } = useToast();
  const { user, balance, refresh } = useWallet();
  const [games, setGames] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [game, setGame] = useState('');
  const [pick, setPick] = useState(null);
  const [qty, setQty] = useState(1);
  const [pid, setPid] = useState('');
  const [zid, setZid] = useState('');
  const [ask, setAsk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('game_credit_orders').select('*').order('created_at', { ascending: false }).limit(20);
    setOrders(data || []);
    setOrdersLoading(false);
  }, [user]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [g, i] = await Promise.all([
        supabase.from('game_credit_games').select('*').order('sort'),
        supabase.from('game_credit_items').select('*').order('sort'),
      ]);
      if (!alive) return;
      const gl = g.data || [];
      setGames(gl); setItems(i.data || []);
      if (gl.length) setGame((cur) => cur || gl[0].code);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);
  useEffect(() => { loadOrders(); }, [loadOrders]);

  if (!user) return <SignIn />;

  const g = games.find((x) => x.code === game) || null;
  const list = items.filter((x) => x.game === game);
  const total = pick ? Math.round(Number(pick.price) * qty * 100) / 100 : 0;

  const open = (it) => {
    const saved = readIds()[it.game] || {};
    setPick(it); setQty(1); setPid(saved.pid || ''); setZid(saved.zid || '');
  };
  const check = () => {
    if (pid.trim().length < 4) return show('Enter your User ID');
    if (g && g.needs_zone && !/^[0-9]{1,8}$/.test(zid.trim())) return show('Enter your Zone ID (numbers only)');
    if (total > balance) return show('Insufficient Xwallet balance');
    setAsk(true);
  };
  const submit = async () => {
    setAsk(false);
    setBusy(true);
    const { error } = await buyGameCredit(pick.id, qty, pid.trim(), g && g.needs_zone ? zid.trim() : '');
    setBusy(false);
    if (error) return show(error.message || String(error));
    saveIds(pick.game, pid.trim(), zid.trim());
    show('Order placed. We will top up your account shortly.');
    setPick(null); refresh(); loadOrders();
  };

  return (
    <div className="page-enter gc">
      <style>{CSS}</style>
      <div className="gc-top">
        <button className="icon-btn" aria-label="Back" onClick={() => (window.history.state && window.history.state.idx > 0 ? nav(-1) : nav('/', { replace: true }))}><ArrowLeft size={20} /></button>
        <h2>Game Credits</h2>
      </div>

      <div className="gc-hero">
        <small>Xwallet balance</small>
        <b>{peso(balance)}</b>
        <p>Top up diamonds and credits for your favorite games. Pay with Xwallet, delivered in minutes.</p>
      </div>

      {loading ? (
        <>
          <div className="gc-chips">{[110, 130, 120].map((w, i) => <Sk key={i} h={42} w={w} r={999} style={{ flex: '0 0 auto' }} />)}</div>
          <GridSk />
        </>
      ) : (
        <>
          <div className="gc-chips">
            {games.map((x) => (
              <button key={x.code} type="button" onClick={() => setGame(x.code)} className={'gc-chip' + (game === x.code ? ' on' : '')}>
                {x.name}
              </button>
            ))}
          </div>
          <div className="gc-h">Choose an amount</div>
          <div className="gc-grid">
            {list.map((it) => (
              <button key={it.id} type="button" className="gc-it" onClick={() => open(it)}>
                <span className="gc-gem"><Gem size={18} /></span>
                <span className="gc-nm">{it.name}</span>
                <span className="gc-pr">{peso(it.price)}</span>
              </button>
            ))}
          </div>
          {list.length === 0 && <div className="gc-empty">Nothing available for this game right now.</div>}
        </>
      )}

      <div className="gc-h" style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 6 }}><Receipt size={14} /> My orders</div>
      {ordersLoading ? (
        <>{[0, 1].map((i) => <Sk key={i} h={92} r={18} style={{ marginBottom: 10 }} />)}</>
      ) : (
        <>
          {orders.length === 0 && <div className="gc-empty">No orders yet.</div>}
          {orders.map((o) => {
            const c = STATUS[o.status] || (o.status === 'cancelled' ? '#DC2626' : '#64748B');
            return (
              <div key={o.id} className="gc-ord" style={{ '--c': c }}>
                <div className="gc-row"><b>{o.item_name}{o.qty > 1 ? ' x' + o.qty : ''}</b><b>{peso(o.total)}</b></div>
                <div className="gc-sub">ID {o.player_id}{o.zone_id ? ' (' + o.zone_id + ')' : ''} · {dt(o.created_at)}</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="gc-st" style={{ background: c }}>{o.status}</span>
                  <span className="gc-sub" style={{ margin: 0 }}>{o.code}</span>
                </div>
                {o.status === 'cancelled' && <div className="gc-note" style={{ color: '#DC2626' }}>Cancelled and refunded to your Xwallet.{o.admin_note ? ' ' + o.admin_note : ''}</div>}
                {o.status === 'completed' && o.admin_note && <div className="gc-note" style={{ color: 'var(--muted)' }}>{o.admin_note}</div>}
              </div>
            );
          })}
        </>
      )}

      {pick && (
        <Sheet title={pick.name} onClose={() => setPick(null)}>
          <div className="gc-sum">
            <div className="gc-row"><span style={{ color: 'var(--muted)' }}>{g ? g.name : ''}</span><b>{peso(pick.price)} each</b></div>
          </div>
          <label className="gc-lbl">Quantity</label>
          <div className="gc-qty">
            <button type="button" className="icon-btn" aria-label="Less" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={18} /></button>
            <b>{qty}</b>
            <button type="button" className="icon-btn" aria-label="More" onClick={() => setQty((q) => Math.min(20, q + 1))}><Plus size={18} /></button>
          </div>
          <label className="gc-lbl">{g ? g.id_label : 'User ID'}</label>
          <input className="gc-in" value={pid} onChange={(e) => setPid(e.target.value)} placeholder="Your in-game User ID" inputMode="text" autoComplete="off" />
          {g && g.needs_zone && (<>
            <label className="gc-lbl">Zone ID</label>
            <input className="gc-in" value={zid} onChange={(e) => setZid(e.target.value.replace(/\D/g, ''))} placeholder="e.g. 2001" inputMode="numeric" autoComplete="off" />
          </>)}
          <div className="gc-tot"><span>Total</span><span>{peso(total)}</span></div>
          <button className="btn-primary" disabled={busy} onClick={check} style={{ width: '100%', padding: 14, fontSize: 14 }}>{busy ? 'Processing...' : 'Pay with Xwallet'}</button>
          <div className="gc-fine">Check your User ID{g && g.needs_zone ? ' and Zone ID' : ''} carefully. Orders are delivered manually and usually within minutes. If we cannot deliver, you are refunded to your Xwallet.</div>
        </Sheet>
      )}
      {ask && pick && <Confirm title="Confirm purchase" message={pick.name + (qty > 1 ? ' x' + qty : '') + ' for ' + peso(total) + ' to ID ' + pid.trim() + (g && g.needs_zone ? ' (' + zid.trim() + ')' : '') + '?'} onCancel={() => setAsk(false)} onConfirm={submit} busy={busy} />}
    </div>
  );
}
