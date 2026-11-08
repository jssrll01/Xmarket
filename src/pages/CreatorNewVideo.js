import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';

export default function CreatorNewVideo() {
  const nav = useNavigate();
  const { show } = useToast();
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState([]);
  const [pq, setPq] = useState('');
  const [pres, setPres] = useState([]);
  useEffect(() => {
    const t = pq.trim();
    if (t.length < 2) { setPres([]); return undefined; }
    const h = setTimeout(async () => {
      const { data } = await supabase.from('products').select('id,name,images').ilike('name', '%' + t.replace(/[%_,()]/g, ' ') + '%').limit(6);
      setPres(data || []);
    }, 300);
    return () => clearTimeout(h);
  }, [pq]);

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
    const { data, error } = await supabase.rpc('creator_add_video', { p_platform: 'youtube', p_url: u, p_title: title, p_thumb: null, p_products: picked.map((x) => x.id) });
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
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>Tag products (optional, up to 3)</div>
          {picked.map((x) => (
            <div key={x.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, border: '1px solid #BFDBFE', background: '#EFF6FF', borderRadius: 12, marginBottom: 6 }}>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700 }}>{x.name}</span>
              <button type="button" aria-label="Remove product" onClick={() => setPicked(picked.filter((y) => y.id !== x.id))} style={{ color: '#DC2626', fontWeight: 800 }}>✕</button>
            </div>
          ))}
          {picked.length < 3 && <input value={pq} onChange={(e) => setPq(e.target.value)} placeholder="Search products by name" style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }} />}
          {pres.filter((x) => !picked.some((y) => y.id === x.id)).map((x) => (
            <button key={x.id} type="button" onClick={() => { setPicked([...picked, x]); setPq(''); setPres([]); }} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: 8, marginTop: 6, border: '1px solid #E2E8F0', borderRadius: 12, background: '#fff' }}>
              {Array.isArray(x.images) && x.images[0] ? <img src={x.images[0]} alt="" width="38" height="38" loading="lazy" decoding="async" style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover' }} /> : null}
              <span style={{ fontSize: 13.5 }}>{x.name}</span>
            </button>
          ))}
        </div>
        <button className="btn-primary" disabled={busy} onClick={submit} style={{ width: '100%', padding: 13, fontWeight: 800 }}>{busy ? 'Posting…' : 'Post video'}</button>
      </div>
    </div>
  );
}
