import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, Send, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { thumb } from '../components/VideoRail';
import { MentionText, MentionSuggest, replaceMention } from '../components/MsgKit';
import { Avatar } from './socialsUi';
import '../videos.css';

function CommentSheet({ video, onClose, onAdded }) {
  const { show } = useToast();
  const [rows, setRows] = useState(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const { data } = await supabase.rpc('video_comments_list', { p_video: video.id });
    setRows(Array.isArray(data) ? data : []);
  }, [video.id]);
  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, [load]);
  const send = async () => {
    if (busy || !text.trim()) return;
    setBusy(true);
    const { data, error } = await supabase.rpc('video_comment_add', { p_video: video.id, p_body: text });
    setBusy(false);
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    setText(''); onAdded(); load();
  };
  return (
    <div className="vv-ov" onClick={onClose}>
      <div className="vv-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="vv-sheet-h"><span>Comments</span><button type="button" aria-label="Close" onClick={onClose}><X size={20} /></button></div>
        <div className="vv-sheet-l">
          {rows === null && <div className="vr-empty">Loading…</div>}
          {rows && rows.length === 0 && <div className="vr-empty">No comments yet. Comments disappear after 24 hours.</div>}
          {rows && rows.map((c) => (
            <div className="vv-cm" key={c.id}>
              <Avatar name={c.username} url={c.avatar_url} size={32} />
              <div className="b"><b>@{c.username}</b><div><MentionText text={c.body} /></div></div>
            </div>
          ))}
        </div>
        <div className="vv-sheet-f">
          <MentionSuggest text={text} onPick={(u) => setText(replaceMention(text, u))} />
          <div className="row">
            <input value={text} maxLength={300} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Add a comment…" />
            <button className="btn-primary" disabled={busy || !text.trim()} onClick={send} aria-label="Send" style={{ width: 46, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Send size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Player({ v, active, near }) {
  const ref = useRef(null);
  const first = useRef(active);
  const [ready, setReady] = useState(false);
  const tt = v.platform === 'tiktok';
  useEffect(() => {
    if (!ready || !ref.current) return undefined;
    const send = () => {
      const w = ref.current && ref.current.contentWindow;
      if (!w) return;
      if (tt) w.postMessage({ type: active ? 'play' : 'pause', 'x-tiktok-player': true }, '*');
      else w.postMessage(JSON.stringify({ event: 'command', func: active ? 'playVideo' : 'pauseVideo', args: [] }), '*');
    };
    send();
    const t = setTimeout(send, 500);
    return () => clearTimeout(t);
  }, [active, ready, tt]);
  const src = tt
    ? 'https://www.tiktok.com/player/v1/' + v.youtube_id + '?controls=0&progress_bar=0&play_button=0&volume_control=0&fullscreen_button=0&timestamp=0&music_info=0&description=0&rel=0&native_context_menu=0&loop=1&autoplay=' + (first.current ? 1 : 0)
    : 'https://www.youtube-nocookie.com/embed/' + v.youtube_id
      + '?enablejsapi=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=' + v.youtube_id
      + '&autoplay=' + (first.current ? 1 : 0);
  return (
    <div className={'vv-frame' + (v.is_short || tt ? ' short' : '')}>
      <img className="vv-poster" src={thumb(v)} alt="" />
      {near && <iframe ref={ref} className={ready ? 'on' : ''} title={v.title || 'video'} src={src} onLoad={() => setReady(true)} allow="autoplay; encrypted-media" tabIndex={-1} />}
      <div className="vv-shield" />
    </div>
  );
}

export default function VideoViewer() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const u = sp.get('u');
  const nav = useNavigate();
  const { show } = useToast();
  const box = useRef(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [sheet, setSheet] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const a = await supabase.rpc('socials_videos', { p_before: null, p_username: u || null, p_limit: 30, p_id: null });
      let rows = Array.isArray(a.data) ? a.data : [];
      if (!rows.some((v) => v.id === id)) {
        const b = await supabase.rpc('socials_videos', { p_before: null, p_username: null, p_limit: 1, p_id: id });
        if (Array.isArray(b.data) && b.data[0]) rows = [...rows, b.data[0]].sort((x, y) => (x.created_at < y.created_at ? 1 : -1));
      }
      if (!alive) return;
      setActive(Math.max(0, rows.findIndex((v) => v.id === id)));
      setList(rows); setLoading(false);
    })();
    return () => { alive = false; };
  }, [id, u]);

  useEffect(() => {
    if (!loading && box.current) box.current.scrollTop = active * box.current.clientHeight;
  }, [loading]);

  const onScroll = () => {
    const el = box.current;
    if (!el) return;
    const i = Math.round(el.scrollTop / el.clientHeight);
    if (i !== active) setActive(i);
  };

  const patch = (vid, fn) => setList((a) => a.map((x) => (x.id === vid ? { ...x, ...fn(x) } : x)));
  const like = async (v) => {
    patch(v.id, (x) => ({ liked: !x.liked, likes: Number(x.likes) + (x.liked ? -1 : 1) }));
    const { data } = await supabase.rpc('socials_toggle_video_like', { p_video: v.id });
    if (data && data.ok) patch(v.id, () => ({ liked: data.liked, likes: data.likes }));
  };
  const follow = async (v) => {
    const { data, error } = await supabase.rpc('socials_toggle_follow', { p_creator: v.creator_id });
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    setList((a) => a.map((x) => (x.creator_id === v.creator_id ? { ...x, following: data.following, followers: data.followers } : x)));
  };
  const share = async (v) => {
    const url = window.location.href.replace(/\/socials\/video\/.*$/, '/socials/video/' + v.id);
    try {
      if (navigator.share) { await navigator.share({ title: v.title || '@' + v.username, url }); return; }
      await navigator.clipboard.writeText(url); show('Link copied');
    } catch (e) { /* cancelled */ }
  };
  const remove = async (v) => {
    if (!window.confirm('Remove this video?')) return;
    const { data } = await supabase.rpc('creator_remove_video', { p_video: v.id });
    if (data && data.ok) { setList((a) => a.filter((x) => x.id !== v.id)); show('Video removed'); }
  };

  return (
    <div className="vv-root">
      <button type="button" className="vv-back" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
      <div className="vv-scroll" ref={box} onScroll={onScroll}>
        {loading && <div className="vv-item"><div className="vr-empty">Loading…</div></div>}
        {!loading && list.length === 0 && <div className="vv-item"><div className="vv-end"><b>Video not found</b>It may have been removed.</div></div>}
        {list.map((v, i) => (
          <section className="vv-item" key={v.id}>
            <Player v={v} active={i === active} near={Math.abs(i - active) <= 1} />
            <div className="vv-info">
              <div className="vv-user">
                <button type="button" onClick={() => nav('/socials/creator/' + v.username)} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 800 }}>
                  <Avatar name={v.username} url={v.avatar_url} size={34} />@{v.username}
                </button>
                {!v.mine && <button type="button" className={'vv-follow' + (v.following ? ' on' : '')} onClick={() => follow(v)}>{v.following ? 'Following' : 'Follow'}</button>}
              </div>
              {v.title && <div className="vv-title">{v.title}</div>}
              {v.mine && <button type="button" className="vv-rm" onClick={() => remove(v)}>Remove video</button>}
            </div>
            <div className="vv-actions">
              <button type="button" className={v.liked ? 'on' : ''} onClick={() => like(v)}><span className="ic"><Heart size={24} fill={v.liked ? '#fff' : 'none'} /></span>{v.likes}</button>
              <button type="button" onClick={() => setSheet(v)}><span className="ic"><MessageCircle size={24} /></span>{v.comments}</button>
              <button type="button" onClick={() => share(v)}><span className="ic"><Share2 size={22} /></span>Share</button>
            </div>
          </section>
        ))}
        {!loading && list.length > 0 && (
          <section className="vv-item"><div className="vv-end"><b>You reached the end</b>Take a break.</div></section>
        )}
      </div>
      {sheet && <CommentSheet video={sheet} onClose={() => setSheet(null)} onAdded={() => patch(sheet.id, (x) => ({ comments: Number(x.comments) + 1 }))} />}
    </div>
  );
}
