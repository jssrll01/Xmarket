import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import '../videos.css';

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
export const thumb = (x) => (typeof x === 'string' ? 'https://i.ytimg.com/vi/' + x + '/hqdefault.jpg' : (x.platform === 'tiktok' ? (x.thumb_url || BLANK) : 'https://i.ytimg.com/vi/' + x.youtube_id + '/hqdefault.jpg'));

function useVideos(username, limit) {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    let alive = true;
    supabase.rpc('socials_videos', { p_before: null, p_username: username || null, p_limit: limit, p_id: null })
      .then(({ data }) => { if (alive) setRows(Array.isArray(data) ? data : []); });
    return () => { alive = false; };
  }, [username, limit]);
  return rows;
}

const Card = ({ v, onOpen }) => (
  <button type="button" className="vr-card" onClick={onOpen}>
    <img src={thumb(v)} alt="" loading="lazy" />
    <span className="vr-play"><Play size={14} fill="#fff" color="#fff" /></span>
    <span className="vr-meta"><b>@{v.username}</b>{v.title && <i>{v.title}</i>}</span>
  </button>
);

export default function VideoRail() {
  const nav = useNavigate();
  const rows = useVideos(null, 10);
  if (!rows || rows.length === 0) return null;
  return (
    <div className="vr-wrap">
      <div className="vr-head">Videos</div>
      <div className="vr-rail">
        {rows.map((v) => <Card key={v.id} v={v} onOpen={() => nav('/socials/video/' + v.id)} />)}
      </div>
    </div>
  );
}

export function ProfileVideos({ username }) {
  const nav = useNavigate();
  const rows = useVideos(username, 30);
  if (!rows) return <div className="vr-empty">Loading…</div>;
  if (rows.length === 0) return <div className="vr-empty">No videos yet.</div>;
  return (
    <div className="vr-grid">
      {rows.map((v) => <Card key={v.id} v={v} onOpen={() => nav('/socials/video/' + v.id + '?u=' + encodeURIComponent(username))} />)}
    </div>
  );
}
