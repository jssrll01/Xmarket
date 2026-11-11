import React from 'react';
import { TrendingUp } from 'lucide-react';
import XwalletInterest from '../XwalletInterest';
import useWallet from './useWallet';
import { Shell, SignIn, Sk, SkStyle, peso } from './ui';

export default function XwBank() {
  const { user, loading, balance, interest, interestLog, refresh } = useWallet();
  if (!user) return <SignIn />;
  const on = interest && interest.interest_enabled;
  const rows = [
    ['Annual rate', '1.5% p.a.'], ['Calculated on', 'Lowest balance of the day'], ['Credited', 'Every day at 12:05 AM'],
    ['Status', on ? 'Active' : 'Off. Apply a creator code to start'], ['Current balance', peso(balance)],
  ];
  return (
    <Shell title="Bank">
      <SkStyle />
      {loading ? (<><Sk h={190} r={18} style={{ marginBottom: 12 }} /><Sk h={160} r={18} /></>) : (<>
        <div className="card" style={{ padding: 18, marginBottom: 16, background: 'linear-gradient(135deg,#FFFFFF,#EEF2FF)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}><TrendingUp size={15} color="#2563EB" /> TOTAL INTEREST EARNED</div>
          <div style={{ fontSize: 34, fontWeight: 900, marginTop: 4, color: '#059669' }}>{peso(interest ? interest.accumulated : 0)}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[['Last credit', peso(interest ? interest.last_interest : 0)], ['Today so far', on ? '~' + peso(interest ? interest.today_projected : 0) : '—']].map(([k, v]) => (
              <div key={k} style={{ flex: 1, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '8px 10px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 800, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <XwalletInterest summary={interest} log={[]} onApplied={refresh} />
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>How it works</div>
          {rows.map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderTop: i ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
              <span style={{ color: 'var(--muted)' }}>{k}</span><b style={{ textAlign: 'right' }}>{v}</b>
            </div>
          ))}
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>Interest history</h3>
        {interestLog.length === 0 && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>No interest credited yet.</p>}
        {interestLog.map(l => (
          <div key={l.id} className="card" style={{ padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontWeight: 700, fontSize: 13 }}>{l.day}</div><div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>On lowest balance {peso(l.eligible_balance)}</div></div>
            <b style={{ color: '#059669' }}>+{peso(l.interest)}</b>
          </div>
        ))}
      </>)}
    </Shell>
  );
}
