import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Package, CheckSquare, Heart, Store, Newspaper, GraduationCap, Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { peso, useMe } from './xfUi';

const CSS = `
.hb{padding:16px 16px 120px;max-width:560px;margin:0 auto}
.hb-head h1{font-size:22px;font-weight:700;letter-spacing:-.02em;line-height:1.1;margin:0}
.hb-head p{font-size:12.5px;color:var(--muted);margin:3px 0 0}
.hb-bal{display:flex;justify-content:space-between;align-items:center;margin:16px 0 18px;padding:13px 16px;border-radius:14px;background:var(--bg);box-shadow:var(--inset)}
.hb-bal span{font-size:13px;color:var(--muted)}
.hb-bal b{font-size:17px;font-weight:700;color:var(--text);font-variant-numeric:tabular-nums}
.hb-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.hb-t{display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:18px;background:var(--card);box-shadow:var(--raised-sm);text-decoration:none;color:inherit;min-height:112px}
.hb-t:active{box-shadow:var(--inset)}
.hb-ic{width:40px;height:40px;border-radius:12px;background:var(--bg);box-shadow:var(--inset);display:flex;align-items:center;justify-content:center;color:var(--primary)}
.hb-n{font-size:13.5px;font-weight:600;color:var(--text);line-height:1.25}
.hb-g{margin-top:auto;font-size:11.5px;font-weight:600;color:var(--muted)}
.hb-bar{height:6px;border-radius:99px;background:var(--bg);box-shadow:var(--inset);overflow:hidden;margin-top:auto}
.hb-bar i{display:block;height:100%;background:var(--primary);border-radius:99px}
`;

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
    ['/price-drops', 'Price Drops', Zap, tag(st && st.drops, 'live now', 'live now')],
    ['/digital-products', 'Digital Products', Package, tag(st && st.products, 'available', 'available')],
    ['/demand-polls', 'Demand Polls', CheckSquare, tag(st && st.polls, 'open poll', 'open polls')],
    ['/sponsorships', 'Sponsorships', Heart, st ? (st.target ? Math.round(pct) + '% funded' : 'No fund open') : null],
    ['/market-shop', 'Market Shop', Store, 'VIP, badges, more'],
    ['/articles', 'Weekly Articles', Newspaper, 'New weekly'],
    ['/scholarships', 'Scholarships', GraduationCap, 'Apply'],
    ['/freelance', 'Freelance Work', Briefcase, 'Find work'],
  ];
  return (
    <div className="page-enter hb">
      <style>{CSS}</style>
      <header className="hb-head"><h1>Digital Hub</h1><p>Drops, products, polls and more.</p></header>
      <div className="hb-bal"><span>Xwallet balance</span><b>{peso(me && me.xwallet_balance)}</b></div>
      <div className="hb-grid">
        {ITEMS.map(([to, t, Ic, tg]) => (
          <Link key={to} to={to} className="hb-t">
            <span className="hb-ic"><Ic size={20} /></span>
            <span className="hb-n">{t}</span>
            {to === '/sponsorships' && st && st.target > 0
              ? <span className="hb-bar"><i style={{ width: pct + '%' }} /></span>
              : tg ? <span className="hb-g">{tg}</span>
                : <span className="sk sk-line" style={{ width: 70, height: 12, borderRadius: 99, marginTop: 'auto' }} />}
          </Link>
        ))}
      </div>
    </div>
  );
}
