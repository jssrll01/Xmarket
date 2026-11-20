import React, { useEffect, useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { haptic } from '../lib/prefs';

const state = new Map();
const subs = new Map();
let pend = new Set();
let timer = null;

const put = (id, s) => { state.set(id, s); (subs.get(id) || []).forEach((f) => f(s)); };
function flush() {
  const ids = [...pend];
  pend = new Set();
  timer = null;
  supabase.rpc('review_helpful_counts', { p_ids: ids }).then(({ data }) => {
    ids.forEach((id) => put(id, (data && data[id]) || { count: 0, mine: false }));
  });
}

export default function HelpfulVote({ id }) {
  const key = String(id);
  const [s, setS] = useState(state.get(key) || null);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const f = (v) => setS(v);
    subs.set(key, [...(subs.get(key) || []), f]);
    if (state.has(key)) setS(state.get(key));
    else { pend.add(key); if (!timer) timer = setTimeout(flush, 40); }
    return () => { subs.set(key, (subs.get(key) || []).filter((x) => x !== f)); };
  }, [key]);
  if (!s) return null;
  const vote = async () => {
    haptic(12);
    setMsg('');
    const prev = s;
    put(key, { count: prev.count + (prev.mine ? -1 : 1), mine: !prev.mine });
    const { data, error } = await supabase.rpc('review_helpful_toggle', { p_review: key });
    if (error || !data || !data.ok) { put(key, prev); setMsg((data && data.error) || 'Could not save your vote.'); return; }
    put(key, { count: data.count, mine: data.mine });
  };
  return (
    <div style={{ marginTop: 8 }}>
      <button type="button" onClick={vote} aria-pressed={s.mine} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99, fontSize: 13, fontWeight: 700, border: '1px solid ' + (s.mine ? '#2563EB' : 'var(--border, #E2E8F0)'), background: s.mine ? '#EFF6FF' : '#fff', color: s.mine ? '#2563EB' : 'var(--muted, #64748B)' }}>
        <ThumbsUp size={14} /> Helpful{s.count > 0 ? ' (' + s.count + ')' : ''}
      </button>
      {msg && <span style={{ marginLeft: 8, fontSize: 12, color: '#DC2626' }}>{msg}</span>}
    </div>
  );
}
