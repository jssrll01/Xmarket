import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Avatar } from './socialsUi';
import { NameLabel } from '../components/PerkBadges';

export default function FollowedCreators() {
  const nav = useNavigate();
  const [rows, setRows] = useState(null);
  useEffect(() => { supabase.rpc('socials_following_creators').then(({ data }) => setRows(data || [])); }, []);
  if (!rows || rows.length === 0) return null;
  return (
    <div style={{ marginBottom: 18 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 10px' }}>Creators you follow</h3>
      {rows.map(c => (
        <div key={c.creator_id} className="card" onClick={() => nav('/socials/creator/' + c.username)} style={{ padding: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <Avatar name={c.username} url={c.avatar_url} size={44} />
          <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 14 }}><NameLabel username={c.username} creator /></div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.posts} posts</div></div>
        </div>
      ))}
      <h3 style={{ fontSize: 15, fontWeight: 800, margin: '16px 0 10px' }}>Shops you follow</h3>
    </div>
  );
}
