import React from 'react';
import { TrendingUp } from 'lucide-react';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function XwalletInterest({ summary, log }) {
  if (!summary) return null;
  return (
    <div className="card" style={{ padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={16} /></div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>Daily interest · 1.5% p.a.</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>Credited every day at 12:05 AM on your lowest balance of the day</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[['Last credit', peso(summary.last_interest)], ['Today so far', '~' + peso(summary.today_projected)], ['Total earned', peso(summary.accumulated)]].map(([k, v]) => (
          <div key={k} style={{ background: 'var(--bg, #f1f5f9)', borderRadius: 12, padding: '8px 10px' }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>{k}</div>
            <div style={{ fontSize: 13.5, fontWeight: 800, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>
      {log.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {log.slice(0, 7).map(l => (
            <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 0', borderTop: '1px solid var(--border, #EEF2F7)' }}>
              <span style={{ color: 'var(--muted)' }}>{l.day} · on {peso(l.eligible_balance)}</span>
              <b style={{ color: '#059669' }}>+{peso(l.interest)}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
