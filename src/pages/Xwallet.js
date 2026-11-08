import { Coins } from 'lucide-react';
import { PinGate } from '../components/PinHost';
import React from 'react';
import FeatureRows from '../components/FeatureRows';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Send, Smartphone, ArrowUpRight, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import useWallet from './xw/useWallet';
import { fetchLoyalty } from '../lib/promos';
import { SignIn, Sk, SkStyle, Row, txnItem, peso } from './xw/ui';

const ACTIONS = [
  ['Top-up', Plus, '/xwallet/topup'], ['Send Money', Send, '/xwallet/send'], ['Buy Load', Smartphone, '/xwallet/load'],
  ['Withdraw', ArrowUpRight, '/xwallet/withdraw'], ['Bank', TrendingUp, '/xwallet/bank'], ['History', Clock, '/xwallet/history'],
];

export default function Xwallet() {
  const nav = useNavigate();
  const { user, loading, balance, txns, topups, interest } = useWallet();
  const [pts, setPts] = React.useState(null);
  React.useEffect(() => { if (user) fetchLoyalty(user.id).then(setPts).catch(() => {}); }, [user]);
  if (!user) return <SignIn />;

  const pending = topups.filter(t => t.status === 'pending').reduce((n, t) => n + (Number(t.amount) || 0), 0);
  const moneyIn = txns.filter(t => t.amount > 0).reduce((n, t) => n + Number(t.amount), 0);
  const moneyOut = txns.filter(t => t.amount < 0).reduce((n, t) => n + Math.abs(Number(t.amount)), 0);
  const on = interest && interest.interest_enabled;

  const mini = (title, sub, Icon, to, tag) => (
    <div className="card" onClick={() => nav(to)} style={{ padding: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ width: 34, height: 34, borderRadius: 11, background: '#2563EB1A', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={17} /></span>
        {tag && <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 20, background: on ? '#D1FAE5' : '#FEE2E2', color: on ? '#059669' : '#DC2626' }}>{tag}</span>}
      </div>
      <div style={{ fontWeight: 800, fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{sub}</div>
    </div>
  );

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <SkStyle />
      <PinGate />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav('/', { replace: true })}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Xwallet</h2>
      </div>

      {loading ? (<><Sk h={160} r={22} style={{ marginBottom: 12 }} /><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}><Sk h={96} r={18} /><Sk h={96} r={18} /></div><Sk h={190} r={20} /></>) : (<>
        <div style={{ padding: 20, marginBottom: 12, borderRadius: 22, border: '1px solid #E2E8F0', background: 'linear-gradient(135deg,#FFFFFF 0%,#F1F5F9 60%,#E2E8F0 100%)', boxShadow: '0 14px 34px rgba(15,23,42,.08)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase' }}>Xwallet balance</div>
          <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1, marginTop: 4 }}>{peso(balance)}</div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{user.email}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
            {[['Pending', pending], ['Money in', moneyIn], ['Money out', moneyOut]].map(([k, v]) => (
              <div key={k} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '8px 10px' }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .6 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 800, marginTop: 2 }}>{peso(v)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" onClick={() => nav('/rewards')} style={{ padding: 14, marginBottom: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 40, height: 40, borderRadius: 13, background: '#F59E0B1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}><Coins size={20} color="#D97706" /></span>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 14 }}>Loyalty points</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>Tap to view and exchange</div></div>
          <b style={{ fontSize: 16 }}>{pts === null ? '...' : Number(pts).toLocaleString()} pts</b>
          <ChevronRight size={18} color="#94a3b8" />
        </div>

        <FeatureRows />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {mini('Bank', on ? 'Earning 1.5% p.a.' : 'Daily interest 1.5% p.a.', TrendingUp, '/xwallet/bank', on ? 'ACTIVE' : 'OFF')}
          {mini('History', `${txns.length} records`, Clock, '/xwallet/history')}
        </div>

        

        <div className="card" style={{ padding: '16px 8px', marginBottom: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: 18 }}>
          {ACTIONS.map(([label, Icon, to]) => (
            <button key={label} onClick={() => nav(to)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: 0 }}>
              <span style={{ width: 52, height: 52, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#2563EB', border: '1px solid var(--border)', boxShadow: '3px 3px 8px rgba(163,177,198,.4), -3px -3px 8px #fff' }}><Icon size={22} /></span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{label}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Recent activity</h3>
          {txns.length > 3 && <button onClick={() => nav('/xwallet/history')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center' }}>See all <ChevronRight size={15} /></button>}
        </div>
        {txns.length === 0 && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>No transactions yet.</p>}
        {txns.slice(0, 3).map(t => <Row key={t.id} it={txnItem(t)} onClick={() => nav('/xwallet/history')} />)}

        <div className="card" style={{ padding: 14, marginTop: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Keep your wallet safe</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.8, color: 'var(--muted)' }}>
            • Never share your password or account codes<br />• Double-check the recipient email before sending<br />• Only top up using the payment details shown in the app
          </div>
        </div>
        <div onClick={() => nav('/xcards')} className="card" style={{ padding: 14, marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div><div style={{ fontSize: 14, fontWeight: 800 }}>Xcards gift cards</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Use your balance to buy a gift card</div></div>
          <ChevronRight size={18} color="#94a3b8" />
        </div>
      </>)}
    </div>
  );
}
