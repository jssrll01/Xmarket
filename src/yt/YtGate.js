import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { CardListSkeleton } from '../components/Skeleton';
import { APPLY_PATH } from './ytConfig';

const GOOD = ['approved', 'active', 'accepted', 'verified', 'creator', 'live'];
const PENDING = ['pending', 'submitted', 'review', 'in_review', 'under_review'];

const statusOf = (x, d = 0) => {
  if (x == null || d > 3) return '';
  if (Array.isArray(x)) { for (const i of x) { const s = statusOf(i, d + 1); if (s) return s; } return ''; }
  if (typeof x === 'object') {
    const s = x.status || x.state || x.application_status;
    if (typeof s === 'string' && s) return s.toLowerCase();
    for (const v of Object.values(x)) { if (v && typeof v === 'object') { const r = statusOf(v, d + 1); if (r) return r; } }
  }
  return '';
};
const flagged = (x, d = 0) => {
  if (!x || typeof x !== 'object' || d > 3) return false;
  if (Array.isArray(x)) return x.some((i) => flagged(i, d + 1));
  if (x.is_creator === true || x.creator === true || x.approved === true || x.is_approved === true || x.has_creator === true) return true;
  return Object.values(x).some((v) => v && typeof v === 'object' && flagged(v, d + 1));
};

async function checkCreator() {
  let raw = '';
  let status = '';
  try {
    const a = await supabase.rpc('creator_my_application');
    if (a.error) raw = 'error: ' + a.error.message;
    else {
      raw = JSON.stringify(a.data);
      status = statusOf(a.data);
      if (flagged(a.data) || GOOD.includes(status)) return { ok: true, raw, status };
    }
  } catch (e) { raw = 'exception: ' + e.message; }
  if (!status) {
    try {
      const d = await supabase.rpc('creator_dashboard');
      const v = d && d.data;
      if (!d.error && v && typeof v === 'object' && !Array.isArray(v) && v.ok !== false && v.code) return { ok: true, raw, status };
    } catch (e) { /* not a creator */ }
  }
  return { ok: false, raw, status };
}

export default function YtGate({ children }) {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [st, setSt] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user) { nav('/signin', { replace: true }); return; }
    let alive = true;
    checkCreator().then((r) => { if (alive) setSt(r); });
    return () => { alive = false; };
  }, [user, loading, nav]);

  if (loading || st === null) return <div style={{ padding: 16 }}><CardListSkeleton count={2} /></div>;
  if (st.ok) return children;

  const pending = PENDING.includes(st.status);
  return (
    <div style={{ padding: 16, maxWidth: 420, margin: '40px auto' }}>
      <div className="card" style={{ padding: 22, textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Creator account required</div>
        <div style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
          {pending
            ? 'Your creator application is ' + st.status.replace(/_/g, ' ') + '. YT Premium unlocks as soon as it is approved.'
            : 'YT Premium is for XMARKET creators. Create your creator account to unlock it.'}
        </div>
        <button className="btn-primary" type="button" onClick={() => nav(APPLY_PATH)} style={{ width: '100%', padding: 13, fontWeight: 800 }}>
          {pending ? 'View my application' : 'Become a creator'}
        </button>
        <button className="btn-ghost" type="button" onClick={() => nav('/')} style={{ width: '100%', padding: 12, marginTop: 8 }}>
          Back to Home
        </button>
        <div style={{ marginTop: 14, fontSize: 10.5, color: 'var(--muted)', wordBreak: 'break-all' }}>
          Account check: {(st.raw || 'no response').slice(0, 140)}
        </div>
      </div>
    </div>
  );
}
