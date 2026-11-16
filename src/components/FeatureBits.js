import { money } from '../lib/currency';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useFeatures } from '../lib/features';
import { VIP_PRICE, VIP_DAYS } from '../lib/vip';

export function DeliveryEstimate({ preorder }) {
  const { on, cfg } = useFeatures();
  if (!on('delivery_estimate')) return null;
  const c = cfg('delivery_estimate');
  const lo = preorder ? c.pre_min : c.min;
  const hi = preorder ? c.pre_max : c.max;
  if (!lo || !hi) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 12.5, color: 'var(--muted)' }}>
      <Truck size={14} color="var(--primary)" />
      <span>Estimated delivery: <b style={{ color: 'var(--text)' }}>{lo}-{hi} days</b>{preorder ? ' (pre-order)' : ''}</span>
    </div>
  );
}

export function ProfileProgress() {
  const nav = useNavigate();
  const [d, setD] = useState(null);
  useEffect(() => {
    let alive = true;
    Promise.resolve(supabase.rpc('profile_progress')).then(({ data }) => { if (alive) setD(data || null); }, () => {});
    return () => { alive = false; };
  }, []);
  if (!d || !d.ok || !d.enabled || Number(d.pct) >= 100) return null;
  const pct = Math.max(0, Math.min(100, Number(d.pct) || 0));
  const next = (d.missing || []).slice(0, 3).map((m) => m.l).join(', ');
  return (
    <button type="button" onClick={() => nav('/account')} className="card" style={{ display: 'block', width: '100%', textAlign: 'left', padding: 14, marginBottom: 12, cursor: 'pointer', color: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <b style={{ fontSize: 14 }}>Your profile is {pct}% complete</b>
        <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>Finish</span>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: 'var(--bg)', boxShadow: 'var(--inset)', overflow: 'hidden', marginTop: 10 }}>
        <div style={{ width: pct + '%', height: '100%', borderRadius: 99, background: 'var(--primary)', transition: 'width .4s' }} />
      </div>
      {next && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>Add: {next}</div>}
    </button>
  );
}

export function PricePerDay() {
  const { on } = useFeatures();
  if (!on('price_per_day') || !VIP_DAYS) return null;
  return <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, opacity: 0.95 }}>Only {money(VIP_PRICE / VIP_DAYS, 'fixed')}/day</div>;
}

export function FlashCountdown({ onRotate }) {
  const [ends, setEnds] = useState(null);
  const [now, setNow] = useState(Date.now());
  const cb = useRef(onRotate); cb.current = onRotate;
  const busy = useRef(false);
  const last = useRef(0);
  const endsRef = useRef(null);
  const tick = useCallback(async () => {
    if (busy.current || Date.now() - last.current < 5000) return;
    busy.current = true; last.current = Date.now();
    let e = null;
    try {
      const { data } = await supabase.rpc('flash_tick');
      e = data && data.on && data.ends_at ? new Date(data.ends_at).getTime() : null;
    } catch (err) { e = null; }
    busy.current = false;
    const changed = endsRef.current !== null && e !== endsRef.current;
    endsRef.current = e; setEnds(e);
    if (changed && cb.current) cb.current();
  }, []);
  useEffect(() => { tick(); }, [tick]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (ends && now >= ends) tick(); }, [ends, now, tick]);
  if (!ends) return null;
  const rem = Math.max(0, ends - now);
  const p = (n) => String(n).padStart(2, '0');
  const txt = p(Math.floor(rem / 3600000)) + ':' + p(Math.floor((rem % 3600000) / 60000)) + ':' + p(Math.floor((rem % 60000) / 1000));
  return (
    <div className="fs-unit">
      <div className="fs-unit-num" style={{ fontVariantNumeric: 'tabular-nums' }}>{txt}</div>
      <div className="fs-unit-lab">New deals in</div>
    </div>
  );
}
