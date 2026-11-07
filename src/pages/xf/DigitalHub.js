import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Package, CheckSquare, Heart } from 'lucide-react';
import { XF_CSS, peso, useMe } from './xfUi';

const ITEMS = [
  ['/price-drops', 'Digital Price Drops', 'Limited items, 1 stock each', Zap],
  ['/digital-products', 'Digital Products', 'Buy digital items with Xwallet', Package],
  ['/demand-polls', 'Demand Polls', 'Vote and earn ₱0.10', CheckSquare],
  ['/sponsorships', 'Sponsorships', 'Help fund XMARKET projects', Heart],
];

export default function DigitalHub() {
  const { me } = useMe();
  return (
    <div className="page-enter xf" style={{ paddingBottom: 120 }}>
      <style>{XF_CSS + `
.xf-hub{display:flex;align-items:center;gap:14px;padding:16px;text-decoration:none;color:inherit;transition:transform .15s,background .2s}
.xf-hub:active{transform:scale(.98);background:#F5F9FF}
.xf-hub .ic{width:46px;height:46px;border-radius:14px;background:#EFF6FF;border:1px solid #BFDBFE;display:flex;align-items:center;justify-content:center;color:#2563EB;flex:none;animation:xfFloatH 3.4s ease-in-out infinite}
.xf-hub b{display:block;font-size:15px}.xf-hub span{font-size:12.5px;color:#64748B}
@keyframes xfFloatH{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}`}</style>
      <header className="xf-head"><div><h1>Digital Hub</h1><p>Drops, products, polls and sponsorships.</p></div></header>
      <div className="xf-bal"><span>Xwallet balance</span><b>{peso(me && me.xwallet_balance)}</b></div>
      {ITEMS.map(([to, t, d, Ic]) => (
        <Link key={to} to={to} className="xf-card xf-hub">
          <div className="ic"><Ic size={22} /></div>
          <div><b>{t}</b><span>{d}</span></div>
        </Link>
      ))}
    </div>
  );
}
