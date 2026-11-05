import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { copyText } from './CreatorDashboard';

const BLUE = '#2563EB';
const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const card = { background: 'var(--card, #fff)', border: '1px solid var(--border, #e2e8f0)', borderRadius: 16, padding: 16, marginBottom: 12 };

function Stat({ label, value, accent }) {
  return (
    <div style={{ ...card, marginBottom: 0, padding: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: accent || 'inherit' }}>{value}</div>
    </div>
  );
}

export default function CreatorReferrals() {
  const nav = useNavigate();
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState('');
  const load = useCallback(async () => { const { data } = await supabase.rpc('creator_referral_stats'); setS(data); }, []);
  useEffect(() => { load(); }, [load]);

  if (!s) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!s.ok) return <div style={{ padding: 24 }}>{s.error || 'Creator access required.'}</div>;

  const link = window.location.origin + '/xwallet?ref=' + s.code;
  const total = Number(s.pending) + Number(s.successful);
  const rate = total ? Math.round((Number(s.successful) / total) * 100) : 0;
  const copy = async () => setMsg((await copyText(link)) ? 'Referral link copied.' : 'Could not copy. Long-press the link to copy.');

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <button onClick={() => nav('/creator-studio')} style={{ background: 'none', border: 'none', color: BLUE, fontWeight: 800, padding: 0, marginBottom: 10, cursor: 'pointer' }}>← Creator Studio</button>
      <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 12px' }}>Referrals</h2>

      <div style={{ ...card, background: 'linear-gradient(135deg,#2563EB,#60A5FA)', color: '#fff', border: 'none' }}>
        <div style={{ fontSize: 12, opacity: 0.85 }}>Your referral code</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1 }}>{s.code}</div>
        <div style={{ fontSize: 11, wordBreak: 'break-all', opacity: 0.9, margin: '8px 0 10px' }}>{link}</div>
        <button onClick={copy} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#fff', color: BLUE, fontWeight: 800, cursor: 'pointer' }}>Copy Referral Link</button>
      </div>
      {msg && <div style={{ ...card, padding: 10, fontSize: 13, color: '#059669' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <Stat label="Pending referrals" value={s.pending} accent="#F59E0B" />
        <Stat label="Successful referrals" value={s.successful} accent="#059669" />
        <Stat label="Referral purchases" value={`${s.orders} · ${peso(s.purchases)}`} />
        <Stat label="Total commissions" value={peso(s.commissions)} />
        <Stat label="Conversion rate" value={rate + '%'} />
        <Stat label="Reversed orders" value={s.reversed} accent={Number(s.reversed) ? '#DC2626' : undefined} />
      </div>

      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Your referrals</div>
        {(s.referrals || []).length === 0 && <div style={{ fontSize: 13, color: '#64748b' }}>No referrals yet. Share your link to get started.</div>}
        {(s.referrals || []).map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: i ? '1px solid rgba(148,163,184,.25)' : 'none', fontSize: 13 }}>
            <div><b>{r.user}</b><br /><small style={{ color: '#94a3b8' }}>{new Date(r.applied_at).toLocaleDateString()} · {r.orders} orders</small></div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: '#fff', background: r.status === 'successful' ? '#10B981' : '#F59E0B', borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>{r.status}</span>
              <div style={{ fontWeight: 800, marginTop: 3 }}>{peso(r.commission)}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Commission table</div>
        {[['₱100–₱200', '10%', '₱5'], ['₱201–₱500', '15%', '₱9'], ['₱501–₱800', '20%', '₱13'], ['₱801–₱1,000', '25%', '₱16'], ['₱1,001+', '30%', '₱20']].map(([a, b, c]) => (
          <div key={a} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}><span>{a}</span><span>{b} · max {c}</span></div>
        ))}
      </div>
    </div>
  );
}
