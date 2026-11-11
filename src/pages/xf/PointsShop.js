import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { XF_CSS, peso, useMe } from './xfUi';

// The rewards list. Used by the Points Shop page and shown inside the Loyalty Points page.
export function PointsShopList({ hideBalance, onRedeemed }) {
  const nav = useNavigate();
  const { user, reload } = useMe();
  const [items, setItems] = useState(null);
  const [pts, setPts] = useState(0);
  const [msg, setMsg] = useState({});
  const [busy, setBusy] = useState('');
  const load = async () => {
    const { data } = await supabase.from('points_rewards').select('*').order('cost');
    setItems(data || []);
    const p = await supabase.rpc('my_points');
    setPts(Number(p.data || 0));
  };
  // eslint-disable-next-line
  useEffect(() => { load(); }, [user && user.id]);
  const redeem = async (r) => {
    if (!user) { nav('/signin'); return; }
    if (!window.confirm('Spend ' + r.cost + ' points for ' + r.title + '?')) return;
    setBusy(r.id);
    const { data, error } = await supabase.rpc('redeem_points_reward', { p_id: r.id });
    setBusy('');
    if (error || !data || !data.ok) { setMsg({ [r.id]: { bad: true, t: (error && error.message) || (data && data.message) || 'Failed.' } }); return; }
    setMsg({ [r.id]: { t: peso(r.wallet_amount) + ' added to your Xwallet.' } });
    reload(); load();
    if (onRedeemed) onRedeemed();
  };
  return (
    <>
      <style>{XF_CSS}</style>
      {!hideBalance && <div className="xf-bal"><span>Your points</span><b>{pts.toLocaleString()}</b></div>}
      {items === null && <div className="sk" style={{ height: 120, borderRadius: 16 }} />}
      {items && !items.length && <div className="xf-card xf-empty">No rewards yet.</div>}
      {(items || []).map((r) => {
        const out = r.stock !== null && r.stock < 1;
        const low = pts < r.cost;
        const m = msg[r.id];
        return (
          <div className="xf-card" key={r.id}><div className="xf-body">
            <h3>{r.title}</h3>
            {r.description && <p>{r.description}</p>}
            <div className="xf-price">{r.cost.toLocaleString()} pts</div>
            {low && !out && <div className="xf-meta">You need {(r.cost - pts).toLocaleString()} more points</div>}
            {m && <div className={m.bad ? 'xf-warn' : 'xf-ok'}>{m.t}</div>}
            <button className="xf-btn" disabled={out || low || busy === r.id} onClick={() => redeem(r)}>{out ? 'Out of stock' : busy === r.id ? 'Redeeming\u2026' : 'Redeem'}</button>
          </div></div>
        );
      })}
    </>
  );
}

export default function PointsShop() {
  const nav = useNavigate();
  return (
    <div className="page-enter xf">
      <style>{XF_CSS}</style>
      <header className="xf-head">
        <button onClick={() => nav(-1)} className="icon-btn" aria-label="Back"><ArrowLeft size={20} /></button>
        <div><h1>Points Shop</h1><p>Spend your loyalty points on rewards.</p></div>
      </header>
      <PointsShopList />
    </div>
  );
}
