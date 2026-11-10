import React, { useEffect, useState } from 'react';
import { CardListSkeleton } from '../components/Skeleton';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { rpcPin, showReceipt } from '../lib/pinBus';
import { imgUrl } from '../lib/img';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { PerkStatus } from '../components/PerkBadges';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const day = (d) => new Date(d).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', year: 'numeric' });
const EMAIL = /^\S+@\S+\.\S+$/;
const PERK_DESC = {
  verified: 'A verified badge next to your name in Global Chat, messages and post comments.',
  creator_verified: 'A verified badge on your creator account, shown on your posts, videos and creator profile. Approved creators only.',
  booster: 'Earn ×2 loyalty points on your purchases while it is active.'
};
const SECTIONS = [
  ['VIP membership', (i) => i.vip_days],
  ['Badges', (i) => i.perk_kind === 'verified' || i.perk_kind === 'creator_verified'],
  ['Boosters', (i) => i.perk_kind === 'booster'],
];
const BORDER = '1px solid #E5E7EB';

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

  const groups = [];
  if (items) {
    const used = new Set();
    SECTIONS.forEach(([title, test]) => {
      const list = items.filter((i) => test(i));
      list.forEach((i) => used.add(i.id));
      if (list.length) groups.push([title, list.sort((a, b) => (a.vip_days || 0) - (b.vip_days || 0))]);
    });
    const rest = items.filter((i) => !used.has(i.id));
    if (rest.length) groups.push(['Other', rest]);
  }

  const Row = ({ it }) => {
    const days = it.vip_days || it.perk_days;
    return (
      <div style={{ background: '#fff', border: BORDER, borderRadius: 14, padding: 14, marginBottom: 10 }}>
        {it.image_url && <img src={imgUrl(it.image_url, 400)} alt="" loading="lazy" decoding="async" style={{ width: '100%', aspectRatio: '2', objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} />}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>{it.name}</div>
            {it.description && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.45 }}>{it.description}</div>}
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', whiteSpace: 'nowrap' }}>{peso(it.price)}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          {days ? <span style={{ fontSize: 11.5, fontWeight: 600, color: '#475569', background: '#F1F5F9', padding: '3px 10px', borderRadius: 99 }}>{days} days</span> : <span />}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!it.sold_out && <button aria-label={'Gift ' + it.name} onClick={() => { if (!user) return nav('/signin'); setGift(true); setSel(it); }} style={{ width: 38, height: 38, borderRadius: 99, border: BORDER, background: '#fff', color: '#475569', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}><Gift size={16} /></button>}
            <button className="btn-primary" disabled={it.sold_out} onClick={() => { if (!user) return nav('/signin'); setGift(false); setSel(it); }} style={{ padding: '9px 22px', fontWeight: 600, fontSize: 13 }}>{it.sold_out ? 'Sold out' : 'Buy'}</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Market Shop</h2>
      </div>
      {vip && vip.active && (
        <div style={{ padding: '10px 14px', marginBottom: 10, fontSize: 13, fontWeight: 600, color: '#475569', background: '#F8FAFC', border: BORDER, borderRadius: 12 }}>
          VIP active until {day(vip.expires_at)}
        </div>
      )}
      <PerkStatus />
      {items === null && <CardListSkeleton count={3} />}
      {items && items.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: 'var(--muted)' }}>Nothing for sale yet.</div>}
      {groups.map(([title, list]) => (
        <div key={title}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)', margin: '22px 2px 10px' }}>{title}</div>
          {list.map((it) => <Row key={it.id} it={it} />)}
        </div>
      ))}
      {mine.length > 0 && (<>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)', margin: '26px 2px 10px' }}>My purchases and gifts</div>
        {mine.map((p) => (
          <div key={p.id} style={{ background: '#fff', border: BORDER, borderRadius: 12, padding: 12, marginBottom: 8, fontSize: 13 }}>
            <b style={{ fontWeight: 600 }}>{p.item_name}</b> · {peso(p.price)} · <span style={{ textTransform: 'capitalize', color: 'var(--muted)' }}>{p.status}</span>
            {p.gift_from && <div style={{ color: '#059669', marginTop: 2 }}>Gift from @{p.gift_from}{p.gift_message ? ': ' + p.gift_message : ''}</div>}
            {p.gift_to && <div style={{ color: 'var(--muted)', marginTop: 2 }}>Sent as a gift to {p.gift_to}{p.gift_message ? ': ' + p.gift_message : ''}</div>}
          </div>
        ))}
      </>)}
      {sel && (
        <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(15,23,42,.5)', display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: '#fff', color: '#0F172A', borderRadius: '20px 20px 0 0', padding: '20px 18px calc(18px + env(safe-area-inset-bottom, 0px))' }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{sel.name}</div>
            <div style={{ fontWeight: 600, color: '#475569', margin: '4px 0 8px' }}>{peso(sel.price)} from your Xwallet</div>
            {sel.perk_kind && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 12 }}>{PERK_DESC[sel.perk_kind]} Lasts {sel.perk_days} days and adds to any time you already have.</div>}
            {sel.vip_days && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 12 }}>{sel.vip_days} days of VIP, active right away. It adds to any VIP time already active.</div>}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
              <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} /> Send as a gift to a friend
            </label>
            {gift && (<>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Friend's registered XMARKET email" inputMode="email" autoCapitalize="off" style={{ width: '100%', padding: 12, marginBottom: 8, fontSize: 14 }} />
              <input value={msg} maxLength={120} onChange={(e) => setMsg(e.target.value)} placeholder="Message (optional)" style={{ width: '100%', padding: 12, marginBottom: 6, fontSize: 14 }} />
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>You pay for the gift. Your friend gets a notification{sel.vip_days ? ' and the VIP time on their account' : ''}.</div>
            </>)}
            <button className="btn-primary" disabled={busy} onClick={buy} style={{ width: '100%', padding: 14, fontWeight: 600 }}>{busy ? 'Processing…' : (gift ? 'Pay and send gift' : 'Pay with Xwallet')}</button>
            <button onClick={close} style={{ width: '100%', marginTop: 8, padding: 10, color: 'var(--muted)', fontWeight: 600 }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
