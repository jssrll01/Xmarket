import React, { useEffect, useState } from 'react';
import { CardListSkeleton } from '../components/Skeleton';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Gift, Package, ShieldCheck, Zap } from 'lucide-react';
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
  ['Memberships', (i) => i.vip_days],
  ['Badges', (i) => i.perk_kind === 'verified' || i.perk_kind === 'creator_verified'],
  ['Boosters', (i) => i.perk_kind === 'booster'],
];
const iconFor = (i) => (i.vip_days ? Crown : i.perk_kind === 'booster' ? Zap : i.perk_kind ? ShieldCheck : Package);

const CSS = `
.ms{padding:16px 16px 70px;max-width:560px;margin:0 auto}
.ms-head{display:flex;align-items:center;gap:14px;margin-bottom:8px}
.ms-head h1{font-size:22px;font-weight:700;letter-spacing:-.02em;line-height:1.1;margin:0}
.ms-head p{font-size:12.5px;color:var(--muted);margin:3px 0 0}
.ms-lab{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:24px 2px 12px}
.ms-info{padding:11px 14px;margin:10px 0;font-size:13px;font-weight:600;color:var(--muted);background:var(--bg);box-shadow:var(--inset);border-radius:14px}
.ms-card{background:var(--card);border-radius:18px;padding:14px;margin-bottom:14px;box-shadow:var(--raised-sm)}
.ms-top{display:flex;gap:12px;align-items:flex-start}
.ms-ic{width:48px;height:48px;border-radius:14px;background:var(--bg);box-shadow:var(--inset);display:flex;align-items:center;justify-content:center;color:var(--primary);flex:none;overflow:hidden}
.ms-ic img{width:100%;height:100%;object-fit:cover}
.ms-ic.lg{width:54px;height:54px;border-radius:16px}
.ms-body{min-width:0;flex:1}
.ms-name{font-size:15px;font-weight:600;color:var(--text)}
.ms-desc{font-size:12.5px;color:var(--muted);margin-top:3px;line-height:1.45}
.ms-chip{display:inline-block;margin-top:8px;padding:3px 10px;border-radius:99px;background:var(--bg);box-shadow:var(--inset);font-size:11px;font-weight:600;color:var(--muted)}
.ms-bot{display:flex;align-items:center;justify-content:space-between;margin-top:14px}
.ms-price{font-size:17px;font-weight:700;letter-spacing:-.01em;color:var(--text);font-variant-numeric:tabular-nums}
.ms-act{display:flex;gap:10px;align-items:center}
.ms-gift{width:40px;height:40px;border-radius:50%;border:0;padding:0;background:var(--card);box-shadow:var(--raised-sm);color:var(--muted);display:inline-flex;align-items:center;justify-content:center}
.ms-gift:active{box-shadow:var(--inset)}
.ms-buy{border:0;padding:11px 24px;border-radius:12px;background:var(--primary);color:#fff;font-size:13px;font-weight:600;box-shadow:0 4px 10px -4px rgba(37,99,235,.45)}
.ms-buy:disabled{opacity:.5}
.ms-mine{background:var(--card);box-shadow:var(--raised-sm);border-radius:14px;padding:12px 14px;margin-bottom:10px;font-size:13px}
.ms-ov{position:fixed;inset:0;z-index:4000;background:rgba(15,23,42,.35);display:flex;align-items:flex-end;justify-content:center}
.ms-sheet{width:100%;max-width:560px;background:var(--card);color:var(--text);border-radius:26px 26px 0 0;padding:10px 18px calc(18px + env(safe-area-inset-bottom,0px))}
.ms-grab{width:42px;height:4px;border-radius:99px;background:var(--border);margin:0 auto 16px}
.ms-sh-top{display:flex;gap:14px;align-items:center;margin-bottom:16px}
.ms-sh-name{font-size:17px;font-weight:700;letter-spacing:-.01em}
.ms-sh-sub{font-size:12.5px;color:var(--muted);margin-top:3px;line-height:1.45}
.ms-sum{background:var(--bg);box-shadow:var(--inset);border-radius:16px;padding:2px 16px;margin-bottom:16px}
.ms-sum div{display:flex;justify-content:space-between;align-items:center;padding:11px 0;font-size:13.5px;border-bottom:1px solid var(--border)}
.ms-sum div:last-child{border-bottom:0}
.ms-sum span{color:var(--muted)}.ms-sum b{font-weight:600}
.ms-seg{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:5px;border-radius:16px;background:var(--bg);box-shadow:var(--inset);margin-bottom:14px}
.ms-seg button{border:0;padding:11px 0;border-radius:12px;background:transparent;color:var(--muted);font-size:13.5px;font-weight:600}
.ms-seg button.on{background:var(--card);color:var(--primary);box-shadow:var(--raised-sm)}
.ms-in{width:100%;border:0;outline:0;padding:13px 14px;border-radius:12px;background:var(--bg);box-shadow:var(--inset);font-size:14px;color:var(--text);margin-bottom:10px}
.ms-note{font-size:12px;color:var(--muted);margin:2px 2px 12px;line-height:1.45}
.ms-pay{width:100%;border:0;padding:15px;border-radius:14px;background:var(--primary);color:#fff;font-size:14.5px;font-weight:600;box-shadow:0 6px 14px -6px rgba(37,99,235,.5)}
.ms-pay:disabled{opacity:.6}
.ms-cancel{width:100%;border:0;background:none;margin-top:6px;padding:12px;color:var(--muted);font-weight:600;font-size:14px}
`;

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
    if (rest.length) groups.push(['More items', rest]);
  }

  const row = (it) => {
    const Ic = iconFor(it);
    const days = it.vip_days || it.perk_days;
    return (
      <div key={it.id} className="ms-card">
        <div className="ms-top">
          <span className="ms-ic">{it.image_url ? <img src={imgUrl(it.image_url, 200)} alt="" loading="lazy" decoding="async" /> : <Ic size={22} />}</span>
          <div className="ms-body">
            <div className="ms-name">{it.name}</div>
            {it.description && <div className="ms-desc">{it.description}</div>}
            {days ? <span className="ms-chip">{days} days</span> : null}
          </div>
        </div>
        <div className="ms-bot">
          <b className="ms-price">{peso(it.price)}</b>
          <div className="ms-act">
            {!it.sold_out && <button className="ms-gift" aria-label={'Gift ' + it.name} onClick={() => { if (!user) return nav('/signin'); setGift(true); setSel(it); }}><Gift size={16} /></button>}
            <button className="ms-buy" disabled={it.sold_out} onClick={() => { if (!user) return nav('/signin'); setGift(false); setSel(it); }}>{it.sold_out ? 'Sold out' : 'Buy'}</button>
          </div>
        </div>
      </div>
    );
  };

  const SelIcon = sel ? iconFor(sel) : Package;
  const selDays = sel ? (sel.vip_days || sel.perk_days) : 0;
  const detail = sel ? (sel.perk_kind ? PERK_DESC[sel.perk_kind] : sel.vip_days ? sel.vip_days + ' days of VIP, active right away.' : (sel.description || '')) : '';

  return (
    <div className="page-enter ms">
      <style>{CSS}</style>
      <header className="ms-head">
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <div><h1>Market Shop</h1><p>VIP, badges, boosters and more.</p></div>
      </header>
      {vip && vip.active && <div className="ms-info">VIP active until {day(vip.expires_at)}</div>}
      <PerkStatus />
      {items === null && <CardListSkeleton count={3} />}
      {items && items.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: 'var(--muted)' }}>Nothing for sale yet.</div>}
      {groups.map(([title, list]) => (
        <div key={title}>
          <div className="ms-lab">{title}</div>
          {list.map(row)}
        </div>
      ))}
      {mine.length > 0 && (<>
        <div className="ms-lab">My purchases and gifts</div>
        {mine.map((p) => (
          <div key={p.id} className="ms-mine">
            <b style={{ fontWeight: 600 }}>{p.item_name}</b> · {peso(p.price)} · <span style={{ textTransform: 'capitalize', color: 'var(--muted)' }}>{p.status}</span>
            {p.gift_from && <div style={{ color: '#059669', marginTop: 2 }}>Gift from @{p.gift_from}{p.gift_message ? ': ' + p.gift_message : ''}</div>}
            {p.gift_to && <div style={{ color: 'var(--muted)', marginTop: 2 }}>Sent as a gift to {p.gift_to}{p.gift_message ? ': ' + p.gift_message : ''}</div>}
          </div>
        ))}
      </>)}
      {sel && (
        <div className="ms-ov" onClick={close}>
          <div className="ms-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="ms-grab" />
            <div className="ms-sh-top">
              <span className="ms-ic lg"><SelIcon size={24} /></span>
              <div>
                <div className="ms-sh-name">{sel.name}</div>
                {detail && <div className="ms-sh-sub">{detail}</div>}
              </div>
            </div>
            <div className="ms-sum">
              <div><span>Price</span><b>{peso(sel.price)}</b></div>
              {selDays ? <div><span>Duration</span><b>{selDays} days</b></div> : null}
              {selDays ? <div><span>Stacking</span><b>Adds to current time</b></div> : null}
              <div><span>Paid from</span><b>Xwallet</b></div>
            </div>
            <div className="ms-seg">
              <button className={gift ? '' : 'on'} onClick={() => setGift(false)}>For me</button>
              <button className={gift ? 'on' : ''} onClick={() => setGift(true)}>Gift a friend</button>
            </div>
            {gift && (<>
              <input className="ms-in" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Friend's registered XMARKET email" inputMode="email" autoCapitalize="off" />
              <input className="ms-in" value={msg} maxLength={120} onChange={(e) => setMsg(e.target.value)} placeholder="Message (optional)" />
              <div className="ms-note">You pay for the gift. Your friend gets a notification{selDays ? ' and the time on their account' : ''}.</div>
            </>)}
            <button className="ms-pay" disabled={busy} onClick={buy}>{busy ? 'Processing…' : (gift ? 'Pay and send gift' : 'Pay with Xwallet')}</button>
            <button className="ms-cancel" onClick={close}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
