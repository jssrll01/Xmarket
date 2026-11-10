import React, { useEffect, useState } from 'react';
import { CardListSkeleton } from '../components/Skeleton';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Gift } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { rpcPin, showReceipt } from '../lib/pinBus';
import { imgUrl } from '../lib/img';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { PerkStatus } from '../components/PerkBadges';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const day = (d) => new Date(d).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', year: 'numeric' });
const EMAIL = /^\S+@\S+\.\S+$/;
const PERK_LABEL = { verified: 'Verified badge', creator_verified: 'Creator verified badge', booster: 'Cashback booster ×2' };
const PERK_DESC = {
  verified: 'A verified badge next to your name in Global Chat, messages and post comments.',
  creator_verified: 'A verified badge on your creator account, shown on your posts, videos and creator profile. Approved creators only.',
  booster: 'Earn ×2 loyalty points on your purchases while it is active.'
};

export default function MarketShop() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show } = useToast();
  const [items, setItems] = useState(null);
  const [mine, setMine] = useState([]);
  const [vip, setVip] = useState(null);
  const [sel, setSel] = useState(null);
  const [gift, setGift] = useState(false);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const a = await supabase.rpc('market_list');
    setItems(Array.isArray(a.data) ? a.data : []);
    if (user) {
      const b = await supabase.rpc('market_my');
      setMine(Array.isArray(b.data) ? b.data : []);
      const c = await supabase.rpc('vip_status');
      setVip(c.data || null);
    }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const close = () => { if (busy) return; setSel(null); setGift(false); setEmail(''); setMsg(''); };
  const buy = async () => {
    if (!user) return nav('/signin');
    if (gift && !EMAIL.test(email.trim())) return show('Enter your friend\'s registered email.');
    setBusy(true);
    const { data, error } = await rpcPin('market_buy', { p_item: sel.id, p_email: gift ? email.trim() : null, p_message: gift && msg.trim() ? msg.trim() : null });
    setBusy(false);
    if (error) return show(error.message);
    if (!data.ok) { if (data.error !== 'Cancelled') show(data.error); return; }
    setSel(null); setGift(false); setEmail(''); setMsg('');
    load();
    window.dispatchEvent(new Event('xmarket:perks-changed'));
    window.dispatchEvent(new Event('xmarket:vip-changed'));
    if (data.receipt) showReceipt(data.receipt); else show('Purchase complete');
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Market Shop</h2>
      </div>
      {vip && vip.active && (
        <div className="card" style={{ padding: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#92400E', background: '#FEF3C7' }}>
          <Crown size={16} /> VIP active until {day(vip.expires_at)}
        </div>
      )}
      <PerkStatus />
      {items === null && <CardListSkeleton count={3} />}
      {items && items.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: 'var(--muted)' }}>Nothing for sale yet.</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {items && items.map((it) => (
          <div key={it.id} className="card" style={{ padding: 10, display: 'flex', flexDirection: 'column' }}>
            {it.image_url && <img src={imgUrl(it.image_url, 400)} alt="" loading="lazy" decoding="async" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 12, marginBottom: 8 }} />}
            {it.vip_days && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start', padding: '2px 8px', borderRadius: 99, background: '#FEF3C7', color: '#92400E', fontSize: 11, fontWeight: 800, marginBottom: 6 }}><Crown size={12} /> {it.vip_days} days VIP</div>}
            <div style={{ fontWeight: 800, fontSize: 14 }}>{it.name}</div>
            {it.perk_kind && <div style={{ fontSize: 11, fontWeight: 800, color: '#92400E', margin: '0 0 2px' }}>{PERK_LABEL[it.perk_kind]} · {it.perk_days} days</div>}
            {it.description && <div style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 6px' }}>{it.description}</div>}
            <div style={{ fontWeight: 900, color: '#2563EB', margin: 'auto 0 8px' }}>{peso(it.price)}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn-primary" disabled={it.sold_out} onClick={() => { if (!user) return nav('/signin'); setGift(false); setSel(it); }} style={{ flex: 1, padding: 10, fontWeight: 800, fontSize: 13 }}>{it.sold_out ? 'Sold out' : 'Buy'}</button>
              {!it.sold_out && <button aria-label={'Gift ' + it.name} onClick={() => { if (!user) return nav('/signin'); setGift(true); setSel(it); }} style={{ flex: 1, padding: 10, fontWeight: 800, fontSize: 13, borderRadius: 99, border: '1.5px solid #2563EB', color: '#2563EB', background: '#fff', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: 5 }}><Gift size={14} /> Gift</button>}
            </div>
          </div>
        ))}
      </div>
      {mine.length > 0 && (<>
        <div style={{ fontWeight: 800, fontSize: 15, margin: '20px 0 8px' }}>My purchases and gifts</div>
        {mine.map((p) => (
          <div key={p.id} className="card" style={{ padding: 12, marginBottom: 8, fontSize: 13 }}>
            <b>{p.item_name}</b> · {peso(p.price)} · <span style={{ textTransform: 'capitalize' }}>{p.status}</span>
            {p.gift_from && <div style={{ color: '#059669' }}>Gift from @{p.gift_from}{p.gift_message ? ': ' + p.gift_message : ''}</div>}
            {p.gift_to && <div style={{ color: 'var(--muted)' }}>Sent as a gift to {p.gift_to}{p.gift_message ? ': ' + p.gift_message : ''}</div>}
          </div>
        ))}
      </>)}
      {sel && (
        <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(15,23,42,.5)', display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: '#fff', color: '#0F172A', borderRadius: '22px 22px 0 0', padding: '20px 18px calc(18px + env(safe-area-inset-bottom, 0px))' }}>
            <div style={{ fontWeight: 900, fontSize: 17 }}>{sel.name}</div>
            <div style={{ fontWeight: 900, color: '#2563EB', margin: '4px 0 6px' }}>{peso(sel.price)} from your Xwallet</div>
            {sel.perk_kind && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 10 }}>{PERK_DESC[sel.perk_kind]} Lasts {sel.perk_days} days and adds to any time you already have.</div>}
            {sel.vip_days && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 10 }}>{sel.vip_days} days of VIP, active right away. It adds to any VIP time already active.</div>}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
              <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} /> Send as a gift to a friend
            </label>
            {gift && (<>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Friend's registered XMARKET email" inputMode="email" autoCapitalize="off" style={{ width: '100%', padding: 12, marginBottom: 8, fontSize: 14 }} />
              <input value={msg} maxLength={120} onChange={(e) => setMsg(e.target.value)} placeholder="Message (optional)" style={{ width: '100%', padding: 12, marginBottom: 6, fontSize: 14 }} />
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>You pay for the gift. Your friend gets a notification{sel.vip_days ? ' and the VIP time on their account' : ''}.</div>
            </>)}
            <button className="btn-primary" disabled={busy} onClick={buy} style={{ width: '100%', padding: 14, fontWeight: 800 }}>{busy ? 'Processing…' : (gift ? 'Pay and send gift' : 'Pay with Xwallet')}</button>
            <button onClick={close} style={{ width: '100%', marginTop: 8, padding: 10, color: 'var(--muted)', fontWeight: 700 }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
