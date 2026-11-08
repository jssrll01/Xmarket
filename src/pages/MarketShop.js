import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { rpcPin, showReceipt } from '../lib/pinBus';
import { imgUrl } from '../lib/img';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function MarketShop() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show } = useToast();
  const [items, setItems] = useState(null);
  const [mine, setMine] = useState([]);
  const [sel, setSel] = useState(null);
  const [gift, setGift] = useState(false);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const a = await supabase.rpc('market_list');
    setItems(Array.isArray(a.data) ? a.data : []);
    if (user) { const b = await supabase.rpc('market_my'); setMine(Array.isArray(b.data) ? b.data : []); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const close = () => { setSel(null); setGift(false); setEmail(''); setMsg(''); };
  const buy = async () => {
    if (!user) return nav('/signin');
    if (gift && !email.trim()) return show('Enter your friend\'s email.');
    setBusy(true);
    const { data, error } = await rpcPin('market_buy', { p_item: sel.id, p_email: gift ? email : null, p_message: gift ? msg : null });
    setBusy(false);
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    close(); load();
    if (data.receipt) showReceipt(data.receipt); else show('Purchase complete');
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Market Shop</h2>
      </div>
      {items === null && <div style={{ textAlign: 'center', padding: 30, color: 'var(--muted)' }}>Loading…</div>}
      {items && items.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: 'var(--muted)' }}>Nothing for sale yet.</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {items && items.map((it) => (
          <div key={it.id} className="card" style={{ padding: 10, display: 'flex', flexDirection: 'column' }}>
            {it.image_url && <img src={imgUrl(it.image_url, 400)} alt="" loading="lazy" decoding="async" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 12, marginBottom: 8 }} />}
            <div style={{ fontWeight: 800, fontSize: 14 }}>{it.name}</div>
            {it.description && <div style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 6px' }}>{it.description}</div>}
            <div style={{ fontWeight: 900, color: '#2563EB', margin: 'auto 0 8px' }}>{peso(it.price)}</div>
            <button className="btn-primary" disabled={it.sold_out} onClick={() => setSel(it)} style={{ padding: 10, fontWeight: 800, fontSize: 13 }}>{it.sold_out ? 'Sold out' : 'Buy'}</button>
          </div>
        ))}
      </div>
      {mine.length > 0 && (<>
        <div style={{ fontWeight: 800, fontSize: 15, margin: '20px 0 8px' }}>My purchases and gifts</div>
        {mine.map((p) => (
          <div key={p.id} className="card" style={{ padding: 12, marginBottom: 8, fontSize: 13 }}>
            <b>{p.item_name}</b> · {peso(p.price)} · <span style={{ textTransform: 'capitalize' }}>{p.status}</span>
            {p.gift_from && <div style={{ color: '#059669' }}>🎁 Gift from @{p.gift_from}{p.gift_message ? ': ' + p.gift_message : ''}</div>}
            {p.gift_to && <div style={{ color: 'var(--muted)' }}>Sent as a gift to {p.gift_to}</div>}
          </div>
        ))}
      </>)}
      {sel && (
        <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(15,23,42,.5)', display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: '#fff', borderRadius: '22px 22px 0 0', padding: '20px 18px calc(18px + env(safe-area-inset-bottom, 0px))' }}>
            <div style={{ fontWeight: 900, fontSize: 17 }}>{sel.name}</div>
            <div style={{ fontWeight: 900, color: '#2563EB', margin: '4px 0 12px' }}>{peso(sel.price)} from your Xwallet</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
              <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} /> Send as a gift to a friend
            </label>
            {gift && (<>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Friend's XMARKET email" autoCapitalize="off" style={{ width: '100%', padding: 12, marginBottom: 8, fontSize: 14 }} />
              <input value={msg} maxLength={120} onChange={(e) => setMsg(e.target.value)} placeholder="Message (optional)" style={{ width: '100%', padding: 12, marginBottom: 8, fontSize: 14 }} />
            </>)}
            <button className="btn-primary" disabled={busy} onClick={buy} style={{ width: '100%', padding: 14, fontWeight: 800 }}>{busy ? 'Processing…' : 'Pay with Xwallet'}</button>
            <button onClick={close} style={{ width: '100%', marginTop: 8, padding: 10, color: 'var(--muted)', fontWeight: 700 }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
