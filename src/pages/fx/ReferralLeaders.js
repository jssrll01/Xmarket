import { CardListSkeleton as LoadSk } from '../../components/Skeleton';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import { fx, S } from '../../lib/fx';
import { money } from '../../lib/currency';

export default function ReferralLeaders() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { fx('fx_ref_board').then(setD).catch((e) => setErr(e.message)); }, []);
  const target = d ? Number(d.target) : 50;
  const have = d ? Number(d.my_unredeemed) : 0;
  return (
    <div className="page-enter" style={S.page}>
      <Link to="/digital-hub" style={S.back}><ArrowLeft size={16} /> Featured</Link>
      <h1 style={S.h1}>Referral Leaders</h1>
      <p style={S.sub}>The creator with the most active referrals each week earns a Referral Leader badge.</p>
      {err && <div style={S.err}>{err}</div>}
      {!d && !err && <LoadSk count={3} />}
      {d && (
        <>
          <div style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}><Trophy size={18} color="var(--primary)" /> Your Referral Leader badges: {d.my_badges}</div>
            <div style={S.bar}><i style={{ display: 'block', height: '100%', width: Math.min(100, (have / target) * 100) + '%', background: 'var(--primary)', borderRadius: 99 }} /></div>
            <div style={{ ...S.muted, marginTop: 6 }}>{have} / {target} badges. Collect {target} to automatically exchange them for {money(d.payout, 'fixed')} in creator earnings.</div>
            <div style={{ ...S.muted, marginTop: 4 }}>Your active referrals this week: <b>{d.my_active}</b></div>
          </div>
          <div style={{ ...S.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', margin: '16px 0 8px' }}>This week (UTC {d.week_start} to {d.week_end})</div>
          {!d.standings.length && <div style={{ ...S.card, ...S.muted, textAlign: 'center' }}>No active referrals yet this week.</div>}
          {d.standings.map((r, i) => (
            <div key={i} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 10, padding: 12, outline: r.me ? '2px solid var(--primary)' : 'none' }}>
              <b style={{ width: 24 }}>{i + 1}</b>
              <span style={{ flex: 1, fontWeight: 600 }}>@{r.username || 'creator'}{r.me ? ' (you)' : ''}</span>
              <b>{r.active_count}</b>
            </div>
          ))}
          <div style={S.muted}>An active referral is someone you referred who placed a paid order this week.</div>
          {d.past.length > 0 && <div style={{ ...S.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', margin: '16px 0 8px' }}>Past Referral Leaders</div>}
          {d.past.map((r, i) => (
            <div key={i} style={{ ...S.card, display: 'flex', gap: 10, padding: 12 }}>
              <span style={{ flex: 1 }}>Week of {r.week_start}: <b>@{r.username || 'creator'}</b>{r.me ? ' (you)' : ''}</span>
              <span style={S.muted}>{r.active_count} active</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
