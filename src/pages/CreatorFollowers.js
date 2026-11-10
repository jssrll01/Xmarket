import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Avatar } from './socialsUi';
import { card, MUTED } from './creatorUi';
import { NameLabel } from '../components/PerkBadges';

export default function CreatorFollowers() {
  const nav = useNavigate();
  const [rows, setRows] = useState(null);

  useEffect(() => {
    supabase.rpc('creator_my_followers', { p_limit: 200, p_offset: 0 }).then(({ data }) => setRows(data || []));
  }, []);

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 90 }}>
      <button className="icon-btn" aria-label="Back" onClick={() => nav('/creator-studio')} style={{ marginBottom: 14 }}><ArrowLeft size={20} /></button>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 2px 12px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Followers</h2>
        {rows && <span style={{ fontSize: 13, color: MUTED }}>{rows.length} total</span>}
      </div>
      {rows === null && (<div style={{ ...card, padding: 0, overflow: 'hidden' }}>{[0,1,2,3,4,5].map(i => (<div key={i} className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderTop: i ? '1px solid rgba(148,163,184,.25)' : 'none', animationDelay: Math.min(i * 40, 400) + 'ms' }}><div className="sk" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} /><div style={{ flex: 1 }}><div className="sk sk-line" style={{ width: '45%', marginBottom: 8 }} /><div className="sk sk-line" style={{ width: '30%', height: 10 }} /></div></div>))}</div>)}
      {rows && rows.length === 0 && (
        <div style={{ ...card, padding: 30, textAlign: 'center', color: MUTED }}>
          <Users size={34} style={{ opacity: 0.4 }} />
          <div style={{ marginTop: 8, fontSize: 14 }}>No followers yet. Share your posts and referral link to grow.</div>
        </div>
      )}
      {rows && rows.length > 0 && (
        <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderTop: i ? '1px solid rgba(148,163,184,.25)' : 'none' }}>
              <Avatar name={r.username} url={r.avatar_url} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}><NameLabel username={r.username} creator /></div>
                <div style={{ fontSize: 11.5, color: MUTED }}>Followed {new Date(r.at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
