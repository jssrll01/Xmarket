import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, PenSquare, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { PostCard, Avatar, Sk, SkStyle, toggleLike, sharePost } from './socialsUi';

export default function Socials() {
  const nav = useNavigate();
  const { show } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [q, setQ] = useState('');
  const [found, setFound] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const busy = useRef(false);

  const load = useCallback(async (before) => {
    const { data } = await supabase.rpc('socials_feed', { p_before: before || null, p_username: null, p_limit: 10 });
    const rows = data || [];
    setPosts(prev => before ? [...prev, ...rows] : rows);
    setMore(rows.length === 10); setLoading(false); busy.current = false;
  }, []);

  useEffect(() => {
    load(null);
    supabase.rpc('creator_my_application').then(({ data }) => setIsCreator(!!(data && data.application && data.application.status === 'approved')));
  }, [load]);

  useEffect(() => {
    const t = q.trim();
    if (!t) { setFound(null); return undefined; }
    const h = setTimeout(async () => { const { data } = await supabase.rpc('socials_search_creators', { p_q: t.replace(/^@/, '') }); setFound(data || []); }, 250);
    return () => clearTimeout(h);
  }, [q]);

  const like = async (p) => {
    setPosts(a => a.map(x => x.id === p.id ? { ...x, liked: !x.liked, likes: Number(x.likes) + (x.liked ? -1 : 1) } : x));
    const r = await toggleLike(p.id);
    if (r && r.ok) setPosts(a => a.map(x => x.id === p.id ? { ...x, liked: r.liked, likes: r.likes } : x));
  };
  const share = async (p) => { const r = await sharePost(p); if (r === 'copied') show('Link copied'); };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <SkStyle />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, flex: 1 }}>Socials</h2>
        <button className="icon-btn" aria-label="Messages" onClick={() => nav('/messages')}><MessageCircle size={20} /></button>
        {isCreator && <button className="btn-primary" onClick={() => nav('/creator-studio/post')} style={{ padding: '9px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><PenSquare size={15} /> New post</button>}
      </div>
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <Search size={16} style={{ position: 'absolute', left: 13, top: 15, color: 'var(--muted)' }} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search creators by username" style={{ width: '100%', height: 46, padding: '0 38px 0 38px', fontSize: 14 }} />
        {q && <button aria-label="Clear" onClick={() => setQ('')} style={{ position: 'absolute', right: 10, top: 12 }}><X size={18} /></button>}
      </div>

      {found && (
        <div className="card" style={{ padding: '4px 12px', marginBottom: 14 }}>
          {found.length === 0 && <div style={{ padding: 14, fontSize: 13, color: 'var(--muted)' }}>No creators found.</div>}
          {found.map(c => (
            <div key={c.username} onClick={() => nav('/socials/creator/' + c.username)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', cursor: 'pointer' }}>
              <Avatar name={c.username} url={c.avatar_url} /><div style={{ flex: 1 }}><b style={{ fontSize: 14 }}>@{c.username}</b><div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.posts} posts</div></div>
            </div>
          ))}
        </div>
      )}

      {loading && [0, 1].map(i => <Sk key={i} h={380} r={18} style={{ marginBottom: 14 }} />)}
      {!loading && posts.length === 0 && <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}><b style={{ color: 'var(--text)' }}>No posts yet</b><div style={{ fontSize: 13, marginTop: 4 }}>Creator posts will show up here.</div></div>}
      {posts.map(p => <PostCard key={p.id} p={p} onLike={like} onShare={share} />)}
      {more && <button className="btn-ghost" onClick={() => { if (busy.current) return; busy.current = true; load(posts[posts.length - 1].created_at); }} style={{ width: '100%', padding: 12 }}>Load more</button>}
    </div>
  );
}
