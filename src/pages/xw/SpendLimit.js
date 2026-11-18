import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { peso } from './ui';

export default function SpendLimit({ refreshKey }) {
  const [st, setSt] = useState(null);
  const [val, setVal] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const load = useCallback(async () => {
    const { data } = await supabase.rpc('xwallet_spend_status');
    if (data) setSt(data);
  }, []);
  useEffect(() => { load(); }, [load, refreshKey]);
  const save = async (v) => {
    setBusy(true); setMsg('');
    const { error } = await supabase.rpc('xwallet_set_spend_limit', { p_limit: v });
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setVal(''); setMsg(v ? 'Limit saved.' : 'Limit removed.'); load();
  };
  const lim = st && Number(st.limit) > 0 ? Number(st.limit) : 0;
  const spent = st ? Number(st.spent) || 0 : 0;
  const pct = lim ? Math.min(100, Math.round((spent / lim) * 100)) : 0;
  const over = lim && spent >= lim;
  return (
    <div className="card" style={{ padding: 14, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <b style={{ fontSize: 14 }}>Monthly spending limit</b>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{lim ? peso(spent) + ' of ' + peso(lim) : 'No limit set'}</span>
      </div>
      {lim > 0 && (
        <div style={{ height: 8, borderRadius: 8, background: '#E2E8F0', marginTop: 10, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', background: over ? '#DC2626' : pct >= 80 ? '#F59E0B' : '#2563EB' }} />
        </div>
      )}
      <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 8 }}>
        Counts purchases, buy load, transfers and market buys this month. Resets on the 1st. Leave it empty for no limit.
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <input type="number" inputMode="decimal" min="0" value={val} onChange={(e) => setVal(e.target.value)} placeholder={lim ? 'New limit' : 'Set a monthly limit'}
          style={{ flex: 1, minWidth: 0, height: 40, padding: '0 12px', fontSize: 14 }} />
        <button className="btn-primary" disabled={busy || !(Number(val) > 0)} onClick={() => save(Number(val))} style={{ padding: '0 16px', fontWeight: 800 }}>Save</button>
        {lim > 0 && <button className="btn-ghost" disabled={busy} onClick={() => save(null)} style={{ padding: '0 12px' }}>Remove</button>}
      </div>
      {msg && <div style={{ fontSize: 12, marginTop: 8, color: msg.startsWith('Limit') ? '#059669' : '#DC2626' }}>{msg}</div>}
    </div>
  );
}
