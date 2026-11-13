import { money } from '../lib/currency';
import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

const peso = (n) => money(n, 'fixed');

export default function XwalletInterest({ summary, log, onApplied }) {
  const [code, setCode] = useState(() => { try { return (new URLSearchParams(window.location.search).get('ref') || '').toUpperCase(); } catch (e) { return ''; } });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  if (!summary) return null;
  const on = summary.interest_enabled;

  const apply = async () => {
    if (busy || !code.trim()) return;
    setBusy(true); setMsg('');
    const { data, error } = await supabase.rpc('creator_apply_referral', { p_code: code });
    setBusy(false);
    if (error) return setMsg(error.message);
    if (!data.ok) return setMsg(data.error);
    setCode(''); setMsg('Referral code applied. Daily interest is now active.');
    onApplied && onApplied();
  };

  return (
    <div className="card" style={{ padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={16} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800 }}>Daily interest · 1.5% p.a.</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>Credited every day at 12:05 AM on your lowest balance of the day</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 20, background: on ? '#D1FAE5' : '#FEE2E2', color: on ? '#059669' : '#DC2626' }}>{on ? 'ACTIVE' : 'OFF'}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[['Last credit', peso(summary.last_interest)], ['Today so far', on ? '~' + peso(summary.today_projected) : '—'], ['Total earned', peso(summary.accumulated)]].map(([k, v]) => (
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
      {!summary.referral_applied && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border, #EEF2F7)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Have a creator referral code?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="XM-USERNAME"
              style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid var(--border, #cbd5e1)', fontSize: 14, minWidth: 0 }} />
            <button onClick={apply} disabled={busy} style={{ padding: '0 18px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#fff', fontWeight: 800 }}>{busy ? '…' : 'Apply'}</button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>Can be used once only and cannot be changed.</div>
        </div>
      )}
      {msg && <div style={{ fontSize: 12, marginTop: 8, color: msg.startsWith('Referral') ? '#059669' : '#DC2626' }}>{msg}</div>}
    </div>
  );
}
