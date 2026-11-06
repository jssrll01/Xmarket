import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';

export default function FollowButton({ creatorId, initial, count, onCount }) {
  const { show } = useToast();
  const [on, setOn] = useState(!!initial);
  const [, setN] = useState(Number(count) || 0);
  const [busy, setBusy] = useState(false);
  const tap = async () => {
    if (busy) return;
    setBusy(true);
    const { data, error } = await supabase.rpc('socials_toggle_follow', { p_creator: creatorId });
    setBusy(false);
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    setOn(data.following); setN(Number(data.followers));
    onCount && onCount(Number(data.followers));
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <button onClick={tap} disabled={busy} className={on ? 'btn-ghost' : 'btn-primary'} style={{ flex: 1, padding: 12, fontSize: 14, fontWeight: 800 }}>{on ? 'Following' : 'Follow'}</button>
      <span style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap' }}><b style={{ color: 'var(--text)' }}>{n}</b> followers</span>
    </div>
  );
}
