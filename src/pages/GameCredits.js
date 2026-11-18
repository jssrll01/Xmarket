import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { buyGameCredit } from '../lib/xwallet';
import useWallet from './xw/useWallet';
import { Sheet, Confirm, SignIn, peso, dt, STATUS } from './xw/ui';

const IDS_KEY = 'gc.ids';
const readIds = () => { try { return JSON.parse(localStorage.getItem(IDS_KEY) || '{}'); } catch (e) { return {}; } };
const saveIds = (game, pid, zid) => { try { const o = readIds(); o[game] = { pid, zid }; localStorage.setItem(IDS_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ } };

export default function GameCredits() {
  const nav = useNavigate();
  const { show } = useToast();
  const { user, balance, refresh } = useWallet();
  const [games, setGames] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
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

  const lbl = { fontSize: 12, fontWeight: 700, color: 'var(--muted)' };
  const inp = { width: '100%', padding: 12, marginTop: 6, marginBottom: 12, fontSize: 14 };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => (window.history.state && window.history.state.idx > 0 ? nav(-1) : nav('/', { replace: true }))}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, flex: 1 }}>Game Credits</h2>
        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)' }}>{peso(balance)}</span>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 14 }}>
        {games.map((x) => (
          <button key={x.code} type="button" onClick={() => setGame(x.code)}
            style={{ flex: '0 0 auto', padding: '9px 14px', borderRadius: 999, fontWeight: 800, fontSize: 13, background: game === x.code ? 'var(--primary)' : 'var(--card)', color: game === x.code ? '#fff' : 'var(--text)', border: '1px solid var(--border)' }}>{x.name}</button>
        ))}
      </div>

      {loading && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>Loading...</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {list.map((it) => (
          <button key={it.id} type="button" className="card" onClick={() => open(it)} style={{ padding: 14, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 92 }}>
            <span style={{ fontWeight: 800, fontSize: 13.5, lineHeight: 1.3 }}>{it.name}</span>
            <span style={{ marginTop: 'auto', fontWeight: 900, fontSize: 16, color: '#DC2626' }}>{peso(it.price)}</span>
          </button>
        ))}
      </div>
      {!loading && list.length === 0 && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>Nothing available for this game right now.</p>}

      <h3 style={{ fontSize: 15, fontWeight: 800, margin: '22px 0 10px' }}>My orders</h3>
      {orders.length === 0 && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 14, fontSize: 13 }}>No orders yet.</p>}
      {orders.map((o) => (
        <div key={o.id} className="card" style={{ padding: 12, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <b style={{ fontSize: 13.5 }}>{o.item_name}{o.qty > 1 ? ' x' + o.qty : ''}</b>
            <b style={{ fontSize: 13.5 }}>{peso(o.total)}</b>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
            ID {o.player_id}{o.zone_id ? ' (' + o.zone_id + ')' : ''} · {dt(o.created_at)}
          </div>
          <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 999, color: '#fff', background: STATUS[o.status] || (o.status === 'cancelled' ? '#DC2626' : '#64748B'), textTransform: 'capitalize' }}>{o.status}</span>
            <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{o.code}</span>
          </div>
          {o.status === 'cancelled' && <div style={{ fontSize: 12, color: '#DC2626', marginTop: 6 }}>Cancelled and refunded to your Xwallet.{o.admin_note ? ' ' + o.admin_note : ''}</div>}
          {o.status === 'completed' && o.admin_note && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{o.admin_note}</div>}
        </div>
      ))}

      {pick && (
        <Sheet title={pick.name} onClose={() => setPick(null)}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>{g ? g.name : ''} · {peso(pick.price)} each</div>
          <label style={lbl}>Quantity</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '6px 0 12px' }}>
            <button type="button" className="icon-btn" aria-label="Less" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={18} /></button>
            <b style={{ fontSize: 18, minWidth: 28, textAlign: 'center' }}>{qty}</b>
            <button type="button" className="icon-btn" aria-label="More" onClick={() => setQty((q) => Math.min(20, q + 1))}><Plus size={18} /></button>
          </div>
          <label style={lbl}>{g ? g.id_label : 'User ID'}</label>
          <input value={pid} onChange={(e) => setPid(e.target.value)} placeholder="Your in-game User ID" inputMode="text" autoComplete="off" style={inp} />
          {g && g.needs_zone && (<>
            <label style={lbl}>Zone ID</label>
            <input value={zid} onChange={(e) => setZid(e.target.value.replace(/\D/g, ''))} placeholder="e.g. 2001" inputMode="numeric" autoComplete="off" style={inp} />
          </>)}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 16, marginBottom: 12 }}><span>Total</span><span>{peso(total)}</span></div>
          <button className="btn-primary" disabled={busy} onClick={check} style={{ width: '100%', padding: 13, fontSize: 14 }}>{busy ? 'Processing...' : 'Pay with Xwallet'}</button>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 10 }}>Check your User ID{g && g.needs_zone ? ' and Zone ID' : ''} carefully. Orders are delivered manually and usually within minutes. If we cannot deliver, you are refunded to your Xwallet.</div>
        </Sheet>
      )}
      {ask && pick && <Confirm title="Confirm purchase" message={pick.name + (qty > 1 ? ' x' + qty : '') + ' for ' + peso(total) + ' to ID ' + pid.trim() + (g && g.needs_zone ? ' (' + zid.trim() + ')' : '') + '?'} onCancel={() => setAsk(false)} onConfirm={submit} busy={busy} />}
    </div>
  );
}
