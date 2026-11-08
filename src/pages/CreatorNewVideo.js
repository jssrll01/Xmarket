import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';

export default function CreatorNewVideo() {
  const nav = useNavigate();
  const { show } = useToast();
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const u = url.trim();
    if (!u) return show('Paste your YouTube link.');
    setBusy(true);
    let title = null;
    const sm = u.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/i);
    const check = sm ? 'https://www.youtube.com/watch?v=' + sm[1] : u;
    try {
      const r = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(check));
      if (!r.ok) { setBusy(false); return show('That video is private, removed, or cannot be embedded.'); }
      const j = await r.json();
      title = j.title || null;
    } catch (e) { /* check skipped, the server still validates the link */ }
    const { data, error } = await supabase.rpc('creator_add_video', { p_platform: 'youtube', p_url: u, p_title: title, p_thumb: null });
    setBusy(false);
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    show('Video posted!');
    nav('/socials');
  };

  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Post a video</h2>
      </div>
      <div className="card" style={{ padding: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>YouTube video link</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." autoCapitalize="off" autoCorrect="off" style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, fontSize: 14 }} />
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 14 }}>
          YouTube videos and Shorts are allowed. Post it on YouTube first, then paste the link here. Only your own videos. Up to 5 videos per day.
        </div>
        <button className="btn-primary" disabled={busy} onClick={submit} style={{ width: '100%', padding: 13, fontWeight: 800 }}>{busy ? 'Posting…' : 'Post video'}</button>
      </div>
    </div>
  );
}
