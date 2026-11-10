import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Package, CheckSquare, Heart, Store, Newspaper, GraduationCap, Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { XF_CSS, peso, useMe } from './xfUi';

export default function DigitalHub() {
  const { me } = useMe();
  const [st, setSt] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const [a, b, c, d] = await Promise.all([
          supabase.from('price_drops').select('id', { count: 'exact', head: true }).eq('status', 'active').gt('stock', 0),
          supabase.from('digital_products').select('id', { count: 'exact', head: true }).eq('active', true),
          supabase.from('demand_polls').select('id', { count: 'exact', head: true }),
          supabase.from('sponsor_funds').select('raised,target'),
        ]);
        const funds = d.data || [];
        setSt({
          drops: a.count || 0, products: b.count || 0, polls: c.count || 0,
          raised: funds.reduce((s, f) => s + Number(f.raised || 0), 0),
          target: funds.reduce((s, f) => s + Number(f.target || 0), 0),
        });
      } catch (e) { setSt({ drops: 0, products: 0, polls: 0, raised: 0, target: 0 }); }
    })();
  }, []);
  const pct = st && st.target ? Math.min(100, (st.raised / st.target) * 100) : 0;
  const tag = (n, one, many) => (st ? n + ' ' + (n === 1 ? one : many) : null);
  const ITEMS = [
    ['/price-drops', 'Digital Price Drops', 'Limited-time digital deals. Grab them before they are gone.', Zap, tag(st && st.drops, 'live now', 'live now')],
    ['/digital-products', 'Digital Products', 'Buy digital items with your Xwallet and get them delivered digitally.', Package, tag(st && st.products, 'available', 'available')],
    ['/demand-polls', 'Demand Polls', 'Vote on what XMARKET should add next and earn cash for every vote.', CheckSquare, tag(st && st.polls, 'open poll', 'open polls')],
    ['/sponsorships', 'Sponsorships', 'Help fund XMARKET projects. Every contribution is tracked openly.', Heart, null],
    ['/market-shop', 'Market Shop', 'Buy VIP membership for yourself or gift it to a friend.', Store, 'Shop'],
    ['/articles', 'Weekly Articles', 'Read the latest articles published by XMARKET.', Newspaper, 'New weekly'],
    ['/scholarships', 'Scholarships', 'Scholarship opportunities available through XMARKET.', GraduationCap, 'Apply'],
    ['/freelance', 'Freelance Work', 'Freelance work available at XMARKET.', Briefcase, 'Find work'],
  ];
  return (
    <div className="page-enter xf" style={{ paddingBottom: 120 }}>
      <style>{XF_CSS + `
.xf-hub{display:block;padding:16px;text-decoration:none;color:inherit;transition:transform .15s,background .2s}
.xf-hub:active{transform:scale(.98);background:#F5F9FF}
.xf-hub .top{display:flex;align-items:center;gap:14px}
.xf-hub .ic{width:46px;height:46px;border-radius:14px;background:#EFF6FF;border:1px solid #BFDBFE;display:flex;align-items:center;justify-content:center;color:#2563EB;flex:none;animation:xfFloatH 3.4s ease-in-out infinite}
.xf-hub b{display:block;font-size:15px}
.xf-hub p{font-size:12.5px;color:#64748B;margin-top:3px;line-height:1.45}
.xf-hub .tag{display:inline-block;margin-top:12px;padding:4px 10px;border-radius:99px;background:#DBEAFE;color:#1D4ED8;font-size:12px;font-weight:700}
.xf-hub .go{margin-left:auto;color:#3B82F6;font-size:20px;flex:none}
.xf-how{display:flex;gap:12px;padding:10px 0;align-items:flex-start}
.xf-how i{width:26px;height:26px;border-radius:50%;background:#2563EB;color:#fff;font-style:normal;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none}
.xf-how b{font-size:14px;display:block}.xf-how span{font-size:12.5px;color:#64748B}
@keyframes xfFloatH{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.xf-bal{background:linear-gradient(135deg,#2563EB,#4F46E5 65%,#7C3AED)!important;border:0!important;box-shadow:0 18px 30px -18px rgba(37,99,235,.85)}
.xf-bal span{color:rgba(255,255,255,.8)!important}.xf-bal b{color:#fff!important}
.xf-hub{box-shadow:0 12px 24px -20px rgba(15,23,42,.4);position:relative;overflow:hidden}
.xf-hub::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--a,#2563EB)}
.xf-hub .go{transition:transform .2s}.xf-hub:active .go{transform:translateX(4px)}
@keyframes xfPulse{0%{box-shadow:0 0 0 0 rgba(34,197,94,.6)}100%{box-shadow:0 0 0 8px rgba(34,197,94,0)}}
.xf-hub:nth-of-type(1) .tag::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#22C55E;margin-right:6px;animation:xfPulse 1.6s infinite}
.xf-bar{overflow:hidden}
.xf-bar i{background:linear-gradient(90deg,#3B82F6,#7C3AED,#3B82F6)!important;background-size:200% 100%;animation:xfBar 2.5s linear infinite}
@keyframes xfBar{to{background-position:200% 0}}
@media(prefers-reduced-motion:reduce){.xf-hub .tag::before,.xf-bar i{animation:none!important}}
.xf-hub:nth-of-type(1){--a:#B45309}.xf-hub:nth-of-type(1) .ic{background:#FEF3C7;border-color:#FDE68A;color:#B45309}.xf-hub:nth-of-type(1) .tag{background:#FEF3C7;color:#B45309}
.xf-hub:nth-of-type(2){--a:#1D4ED8}.xf-hub:nth-of-type(2) .ic{background:#DBEAFE;border-color:#BFDBFE;color:#1D4ED8}.xf-hub:nth-of-type(2) .tag{background:#DBEAFE;color:#1D4ED8}
.xf-hub:nth-of-type(3){--a:#6D28D9}.xf-hub:nth-of-type(3) .ic{background:#EDE9FE;border-color:#DDD6FE;color:#6D28D9}.xf-hub:nth-of-type(3) .tag{background:#EDE9FE;color:#6D28D9}
.xf-hub:nth-of-type(4){--a:#BE123C}.xf-hub:nth-of-type(4) .ic{background:#FFE4E6;border-color:#FECDD3;color:#BE123C}.xf-hub:nth-of-type(4) .tag{background:#FFE4E6;color:#BE123C}
.xf-hub:nth-of-type(5){--a:#15803D}.xf-hub:nth-of-type(5) .ic{background:#DCFCE7;border-color:#BBF7D0;color:#15803D}.xf-hub:nth-of-type(5) .tag{background:#DCFCE7;color:#15803D}
.xf-hub:nth-of-type(6){--a:#0E7490}.xf-hub:nth-of-type(6) .ic{background:#CFFAFE;border-color:#A5F3FC;color:#0E7490}.xf-hub:nth-of-type(6) .tag{background:#CFFAFE;color:#0E7490}
.xf-hub:nth-of-type(7){--a:#C2410C}.xf-hub:nth-of-type(7) .ic{background:#FFEDD5;border-color:#FED7AA;color:#C2410C}.xf-hub:nth-of-type(7) .tag{background:#FFEDD5;color:#C2410C}
.xf-hub:nth-of-type(8){--a:#4338CA}.xf-hub:nth-of-type(8) .ic{background:#E0E7FF;border-color:#C7D2FE;color:#4338CA}.xf-hub:nth-of-type(8) .tag{background:#E0E7FF;color:#4338CA}
`}</style>
      <header className="xf-head"><div><h1>Digital Hub</h1><p>Drops, products, polls and sponsorships.</p></div></header>
      <div className="xf-bal"><span>Xwallet balance</span><b>{peso(me && me.xwallet_balance)}</b></div>
      {ITEMS.map(([to, t, d, Ic, tg], i) => (
        <Link key={to} to={to} className="xf-card xf-hub" style={{ animationDelay: i * 70 + 'ms' }}>
          <div className="top">
            <div className="ic"><Ic size={22} /></div>
            <div><b>{t}</b></div>
            <span className="go">›</span>
          </div>
          <p>{d}</p>
          {to === '/sponsorships' ? (
            st ? (
              <>
                <div className="xf-bar" style={{ marginBottom: 4 }}><i style={{ width: pct + '%' }} /></div>
                <span className="xf-meta">{st.target ? peso(st.raised) + ' raised of ' + peso(st.target) : 'No fund open yet'}</span>
              </>
            ) : <div className="sk sk-line" style={{ width: '60%', height: 12, marginTop: 12 }} />
          ) : tg ? <span className="tag">{tg}</span>
            : <div className="sk sk-line" style={{ width: '35%', height: 22, marginTop: 12, borderRadius: 99 }} />}
        </Link>
      ))}
    </div>
  );
}
