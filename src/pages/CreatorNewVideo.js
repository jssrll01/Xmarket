import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';

export default function CreatorNewVideo() {
  const nav = useNavigate();
  const { show } = useToast();
  const [platform, setPlatform] = useState('youtube');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const tt = platform === 'tiktok';

  const submit = async () => {
    const u = url.trim();
    if (!u) return show('Paste your ' + (tt ? 'TikTok' : 'YouTube') + ' link.');
    let title = null;
    let thumb = null;
    setBusy(true);
    if (tt) {
      if (!/tiktok\.com\/@[^/]+\/video\/\d{10,25}/i.test(u)) {
        setBusy(false);
        return show('Paste the full TikTok link (tiktok.com/@name/video/...). Short links are not supported.');
      }
      try {
        const r = await fetch('https://www.tiktok.com/oembed?url=' + encodeURIComponent(u));
        if (r.ok) { const j = await r.json(); title = j.title || null; thumb = j.thumbnail_url || null; }
      } catch (e) { /* preview skipped, the server still validates the link */ }
    } else {
      const sm = u.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/i);
      const check = sm ? 'https://www.youtube.com/watch?v=' + sm[1] : u;
      try {
        const r = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(check));
        if (!r.ok) { setBusy(false); return show('That video is private, removed, or cannot be embedded.'); }
        const j = await r.json();
        title = j.title || null;
      } catch (e) { /* check skipped, the server still validates the link */ }
    }
    const { data, error } = await supabase.rpc('creator_add_video', { p_platform: platform, p_url: u, p_title: title, p_thumb: thumb });
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
        <div className="vp-tabs" style={{ marginTop: 0 }}>
          <button type="button" className={!tt ? 'on' : ''} onClick={() => setPlatform('youtube')}>YouTube</button>
          <button type="button" className={tt ? 'on' : ''} onClick={() => setPlatform('tiktok')}>TikTok</button>
        </div>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>{tt ? 'TikTok video link' : 'YouTube video link'}</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={tt ? 'https://www.tiktok.com/@name/video/...' : 'https://www.youtube.com/watch?v=...'} autoCapitalize="off" autoCorrect="off" style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, fontSize: 14 }} />
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 14 }}>
          {tt
            ? 'Post it on TikTok first, then paste the full link here. If you only have a short link (vm.tiktok.com), open it in your browser and copy the full address. Only your own videos. One video per day.'
            : 'YouTube videos and Shorts are allowed. Post it on YouTube first, then paste the link here. Only your own videos. One video per day.'}
        </div>
        <button className="btn-primary" disabled={busy} onClick={submit} style={{ width: '100%', padding: 14, fontWeight: 800 }}>{busy ? 'Posting…' : 'Post video'}</button>
      </div>
    </div>
  );
}
