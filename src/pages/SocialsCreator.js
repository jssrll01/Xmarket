import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { PostCard, Avatar, Sk, SkStyle, toggleLike, sharePost } from './socialsUi';
import FollowButton from './FollowButton';
import FollowerList from './FollowerList';

export default function SocialsCreator() {
  const { username } = useParams();
  const nav = useNavigate();
  const { show } = useToast();
  const [prof, setProf] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([
      supabase.rpc('socials_creator_profile', { p_username: username }),
      supabase.rpc('socials_feed', { p_before: null, p_username: username, p_limit: 30 }),
    ]).then(([a, b]) => { if (!alive) return; setProf(a.data); setPosts(b.data || []); setLoading(false); });
    return () => { alive = false; };
  }, [username]);

  const like = async (p) => {
    setPosts(a => a.map(x => x.id === p.id ? { ...x, liked: !x.liked, likes: Number(x.likes) + (x.liked ? -1 : 1) } : x));
    const r = await toggleLike(p.id);
    if (r && r.ok) setPosts(a => a.map(x => x.id === p.id ? { ...x, liked: r.liked, likes: r.likes } : x));
  };
  const share = async (p) => { const r = await sharePost(p); if (r === 'copied') show('Link copied'); };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <SkStyle />
      <button className="icon-btn" aria-label="Back" onClick={() => nav('/socials')} style={{ marginBottom: 14 }}><ArrowLeft size={20} /></button>
      {loading && <><Sk h={110} r={20} style={{ marginBottom: 14 }} /><Sk h={360} r={18} /></>}
      {!loading && (!prof || !prof.ok) && <div className="card" style={{ padding: 20, textAlign: 'center' }}>Creator not found.</div>}
      {!loading && prof && prof.ok && (<>
        <div className="card" style={{ padding: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={prof.username} url={prof.avatar_url} size={64} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>@{prof.username}</div>
            <div style={{ display: 'flex', gap: 18, marginTop: 6, fontSize: 13 }}>
              <span><b>{prof.posts}</b> posts</span><span><b>{prof.likes}</b> likes</span>
            </div>
          </div>
        </div>
        {!prof.mine && <FollowButton creatorId={prof.creator_id} initial={prof.following} count={prof.followers} />}
        <FollowerList creatorId={prof.creator_id} />
        {posts.length === 0 && <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>No posts yet.</div>}
        {posts.map(p => <PostCard key={p.id} p={p} onLike={like} onShare={share} />)}
      </>)}
    </div>
  );
}
