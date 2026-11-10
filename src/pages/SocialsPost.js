import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { CardListSkeleton } from '../components/Skeleton';
import { PostCard } from './socialsUi';

export default function SocialsPost() {
  const { id } = useParams();
  const nav = useNavigate();
  const { show } = useToast();
  const [p, setP] = useState(undefined);

  const load = useCallback(async () => {
    const { data } = await supabase.rpc('socials_post', { p_id: id });
    setP(data || null);
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const like = async (post) => {
    const { error } = await supabase.rpc('socials_toggle_like', { p_post: post.id });
    if (error) return show(error.message);
    load();
  };
  const share = async (post) => {
    const url = window.location.origin + '/socials/post/' + post.id;
    try {
      if (navigator.share) await navigator.share({ title: 'XMARKET post', url });
      else { await navigator.clipboard.writeText(url); show('Link copied'); }
    } catch (e) { /* cancelled */ }
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 90, maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Post</h2>
      </div>
      {p === undefined && <CardListSkeleton count={1} />}
      {p === null && <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>This post is no longer available.</div>}
      {p && <PostCard p={p} onLike={like} onShare={share} />}
    </div>
  );
}
