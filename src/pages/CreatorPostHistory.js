import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Sk, SkStyle, time12 } from './socialsUi';

export default function CreatorPostHistory() {
  const nav = useNavigate();
  const [rows, setRows] = useState(null);
  useEffect(() => { supabase.rpc('creator_my_posts').then(({ data }) => setRows(data || [])); }, []);
  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 100, maxWidth: 560, margin: '0 auto' }}>
      <SkStyle />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav('/creator-studio')}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Post history</h2>
      </div>
      {!rows && [0, 1, 2].map(i => <Sk key={i} h={96} r={16} style={{ marginBottom: 10 }} />)}
      {rows && rows.length === 0 && <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>You have not posted yet.</div>}
      {rows && rows.map(p => (
        <div key={p.id} className="card" onClick={() => p.status === 'active' && nav('/socials/post/' + p.id + '/comments')} style={{ padding: 10, marginBottom: 10, display: 'flex', gap: 12, cursor: p.status === 'active' ? 'pointer' : 'default', opacity: p.status === 'active' ? 1 : 0.6 }}>
          <img src={p.image_url} alt="" style={{ width: 84, height: 84, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{time12(p.created_at)}{p.status !== 'active' ? ' · Removed' : ''}</div>
            <div style={{ fontSize: 13.5, margin: '3px 0 6px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.description}</div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, fontWeight: 700, color: '#475569' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={14} color="#DC2626" /> {p.likes}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MessageCircle size={14} /> {p.comments}</span>
              {Array.isArray(p.links) && p.links.length > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#2563EB' }}>🔗 {p.links.length} link{p.links.length === 1 ? '' : 's'}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
