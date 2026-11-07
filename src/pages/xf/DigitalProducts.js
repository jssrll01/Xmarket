import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Carousel, XF_CSS, peso, useMe } from './xfUi';

export default function DigitalProducts() {
  const nav = useNavigate();
  const { user, me, reload } = useMe();
  const [items, setItems] = useState(null);
  const [orders, setOrders] = useState([]);
  const [qty, setQty] = useState({});
  const [msg, setMsg] = useState({});
  const [busy, setBusy] = useState('');
  const load = async () => {
    const { data } = await supabase.from('digital_products').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    if (user) {
      const r = await supabase.from('digital_orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20);
      setOrders(r.data || []);
    }
  };
  // eslint-disable-next-line
  useEffect(() => { load(); }, [user && user.id]);
  const buy = async (p) => {
    if (!user) { nav('/signin'); return; }
    const q = qty[p.id] || 1;
    setBusy(p.id); setMsg({});
    const { data, error } = await supabase.rpc('buy_digital_product', { p_id: p.id, p_qty: q });
    setBusy('');
    if (error || !data || !data.ok) { setMsg({ [p.id]: { bad: true, t: (error && error.message) || (data && data.message) || 'Purchase failed.' } }); return; }
    setMsg({ [p.id]: { t: 'Purchased. We will send your item soon.' } });
    reload(); load();
  };
  return (
    <div className="page-enter xf">
      <style>{XF_CSS}</style>
      <header className="xf-head">
        <button onClick={() => nav(-1)} className="icon-btn" aria-label="Back"><ArrowLeft size={20} /></button>
        <div><h1>Digital Products</h1><p>Pay with Xwallet. Delivered digitally.</p></div>
      </header>
      <div className="xf-bal"><span>Xwallet balance</span><b>{peso(me && me.xwallet_balance)}</b></div>
      {items === null && <div className="xf-empty">Loading…</div>}
      {items && !items.length && <div className="xf-card xf-empty">No digital products yet.</div>}
      {(items || []).map((p) => {
        const q = qty[p.id] || 1;
        const out = p.stock < 1;
        const m = msg[p.id];
        return (
          <div className="xf-card" key={p.id}>
            <Carousel images={p.images} h={200} />
            <div className="xf-body">
              {p.category && <div className="xf-meta">{p.category}</div>}
              <h3>{p.name}</h3>
              {p.description && <p>{p.description}</p>}
              <div className="xf-price">{peso(p.price)}</div>
              <div className="xf-meta">{out ? 'Out of stock' : p.stock + ' in stock'}</div>
              {!out && (
                <div className="xf-chips" style={{ alignItems: 'center' }}>
                  <button onClick={() => setQty({ ...qty, [p.id]: Math.max(1, q - 1) })}>−</button>
                  <button className="on" style={{ flex: 2 }}>{q}</button>
                  <button onClick={() => setQty({ ...qty, [p.id]: Math.min(p.stock, q + 1) })}>+</button>
                </div>
              )}
              {m && <div className={m.bad ? 'xf-warn' : 'xf-ok'}>{m.t}</div>}
              <button className="xf-btn" disabled={out || busy === p.id} onClick={() => buy(p)}>{out ? 'Out of stock' : busy === p.id ? 'Processing…' : 'Buy · ' + peso(p.price * q)}</button>
            </div>
          </div>
        );
      })}
      {orders.length > 0 && (
        <div className="xf-card"><div className="xf-body">
          <h3>My orders</h3>
          {orders.map((o) => (
            <div className="xf-row" key={o.id}><span>{o.product_name} ×{o.qty}</span><b>{peso(o.total)} · <em style={{ fontStyle: 'normal', color: '#2563EB', textTransform: 'capitalize' }}>{o.status}</em></b></div>
          ))}
        </div></div>
      )}
    </div>
  );
}
