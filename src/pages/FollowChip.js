import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function FollowChip({ creatorId, initial }) {
  const [on, setOn] = useState(!!initial);
  const [busy, setBusy] = useState(false);
  const tap = async (e) => {
    e.stopPropagation();
    if (busy) return;
    const prev = on;
    setBusy(true); setOn(!prev);
    const { data, error } = await supabase.rpc('socials_toggle_follow', { p_creator: creatorId });
    setBusy(false);
    if (error || !data || !data.ok) setOn(prev); else setOn(data.following);
  };
  return (
    <button onClick={tap} disabled={busy} className={on ? 'btn-ghost' : 'btn-primary'}
      style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: 12, fontWeight: 800, borderRadius: 999 }}>
      {on ? 'Following' : 'Follow'}
    </button>
  );
}
