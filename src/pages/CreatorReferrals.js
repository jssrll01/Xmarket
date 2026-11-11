import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, ShoppingBag, TrendingUp, Users, RotateCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BLUE, MUTED, peso, card, circBtn, StatCard, copyText, PageSkeleton } from './creatorUi';

export default function CreatorReferrals() {
  const nav = useNavigate();
  const [s, setS] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState('');
  const load = useCallback(async () => { const { data } = await supabase.rpc('creator_referral_stats'); setS(data); setLoaded(true); }, []);
  useEffect(() => { load(); }, [load]);

  if (!loaded) return <PageSkeleton />;
  if (!s || !s.ok) return <div style={{ padding: 24 }}>{(s && s.error) || 'Creator access required.'}</div>;

  const link = window.location.origin + '/xwallet?ref=' + s.code;
  const total = Number(s.pending) + Number(s.successful);
  const rate = total ? Math.round((Number(s.successful) / total) * 100) : 0;
  const copy = async () => setMsg((await copyText(link)) ? 'Referral link copied.' : 'Could not copy. Long-press the link to copy.');

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <div style={{ borderRadius: 24, padding: 18, marginBottom: 14, color: '#fff', background: 'linear-gradient(135deg,#1D4ED8 0%,#2563EB 45%,#60A5FA 100%)', boxShadow: '0 16px 40px rgba(37,99,235,.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button type="button" aria-label="Back" onClick={() => nav('/creator-studio')} style={circBtn}><ArrowLeft size={18} /></button>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Referrals</div>
          <span style={{ width: 38 }} />
        </div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 16 }}>Your referral code</div>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 1 }}>{s.code}</div>
        <div style={{ fontSize: 11, wordBreak: 'break-all', opacity: 0.9, margin: '8px 0 12px' }}>{link}</div>
        <button type="button" onClick={copy} style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: '#fff', color: BLUE, fontWeight: 800, cursor: 'pointer' }}>Copy Referral Link</button>
      </div>
      {msg && <div style={{ ...card, padding: 12, fontSize: 13, fontWeight: 700, color: '#059669' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <StatCard icon={Clock} label="Pending referrals" value={s.pending} accent="#F59E0B" />
        <StatCard icon={CheckCircle2} label="Successful referrals" value={s.successful} accent="#059669" />
        <StatCard icon={ShoppingBag} label="Referral purchases" value={`${s.orders} · ${peso(s.purchases)}`} />
        <StatCard icon={TrendingUp} label="Total commissions" value={peso(s.commissions)} accent="#059669" />
        <StatCard icon={Users} label="Conversion rate" value={rate + '%'} accent="#7C3AED" />
        <StatCard icon={RotateCcw} label="Reversed orders" value={s.reversed} accent={Number(s.reversed) ? '#DC2626' : MUTED} />
      </div>

      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Your referrals</div>
        {(s.referrals || []).length === 0 && <div style={{ fontSize: 13, color: MUTED }}>No referrals yet. Share your link to get started.</div>}
        {(s.referrals || []).map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: i ? '1px solid rgba(148,163,184,.25)' : 'none', fontSize: 13 }}>
            <div><b>{r.user}</b><br /><small style={{ color: '#94a3b8' }}>{new Date(r.applied_at).toLocaleDateString()} · {r.orders} orders</small></div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: '#fff', background: r.status === 'successful' ? '#10B981' : '#F59E0B', borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>{r.status}</span>
              <div style={{ fontWeight: 800, marginTop: 3 }}>{peso(r.commission)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
