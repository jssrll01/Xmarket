import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Avatar } from './socialsUi';

export default function FollowerList({ creatorId }) {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    if (!creatorId) return;
    supabase.rpc('creator_followers_list', { p_creator: creatorId, p_limit: 50 }).then(({ data }) => setRows(data || []));
  }, [creatorId]);
  if (!rows || !rows.length) return null;
  return (
    <div className="card" style={{ padding: 14, marginTop: 14 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 10px' }}>Followers</h3>
      {rows.map((r) => (
        <div key={r.username} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
          <Avatar name={r.username} url={r.avatar_url} size={32} /><b style={{ fontSize: 14 }}>@{r.username}</b>
        </div>
      ))}
    </div>
  );
}
