import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { PostCard, Avatar, Sk, SkStyle, toggleLike, sharePost, SocialLinks } from './socialsUi';
import FollowButton from './FollowButton';
import FollowerList from './FollowerList';
import { NameLabel } from '../components/PerkBadges';
import { ProfileVideos } from '../components/VideoRail';

export default function SocialsCreator() {
  const { username } = useParams();
  const nav = useNavigate();
  const { show } = useToast();
  const [prof, setProf] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fc, setFc] = useState(null);
  const [tab, setTab] = useState('posts');

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
  const pin = async (p) => {
    const un = !!p.pinned_at;
    const { data, error } = un ? await supabase.rpc('creator_unpin_post') : await supabase.rpc('creator_pin_post', { p_post: p.id });
    if (error) return show(error.message);
    if (!data || !data.ok) return show((data && data.error) || 'Could not update.');
    const b = await supabase.rpc('socials_feed', { p_before: null, p_username: username, p_limit: 30 });
    setPosts(b.data || []);
    show(un ? 'Post unpinned' : 'Post pinned');
  };
  const openDm = async () => {
    const { data, error } = await supabase.rpc('dm_open', { p_other: prof.creator_id });
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    nav('/messages/' + data.thread_id);
  };

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
            <div style={{ fontSize: 18, fontWeight: 800 }}><NameLabel username={prof.username} creator /></div>
            <div style={{ display: 'flex', gap: 18, marginTop: 6, fontSize: 13 }}>
              <span><b>{prof.posts}</b> posts</span><span><b>{fc ?? Number(prof.followers || 0)}</b> followers</span><span><b>{prof.likes}</b> likes</span>
            </div>
          </div>
        </div>
        {(prof.bio || (prof.socials && Object.keys(prof.socials).length > 0)) && (
          <div className="card" style={{ padding: 14, marginBottom: 14 }}>
            {prof.bio && <div style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{prof.bio}</div>}
            <SocialLinks socials={prof.socials} />
          </div>
        )}
        {!prof.mine && <button className="btn-ghost" onClick={openDm} style={{ width: '100%', padding: 12, marginBottom: 10 }}>Message</button>}
        {!prof.mine && <FollowButton creatorId={prof.creator_id} initial={prof.following} count={prof.followers} onCount={setFc} />}
        {prof.mine && <FollowerList creatorId={prof.creator_id} />}
        <div className="vp-tabs">
          <button type="button" className={tab === 'posts' ? 'on' : ''} onClick={() => setTab('posts')}>Posts</button>
          <button type="button" className={tab === 'videos' ? 'on' : ''} onClick={() => setTab('videos')}>Videos</button>
        </div>
        {tab === 'posts' && posts.length === 0 && <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>No posts yet.</div>}
        {tab === 'posts' && posts.map(p => <PostCard key={p.id} p={p} onLike={like} onShare={share} onPin={pin} />)}
        {tab === 'videos' && <ProfileVideos username={username} />}
      </>)}
    </div>
  );
}
