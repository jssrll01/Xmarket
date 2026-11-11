import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ProductGridSkeleton } from '../components/Skeleton';

function Card({ m, onPlay }) {
  return (
    <button type="button" onClick={() => onPlay(m)} className="card" style={{ padding: 0, overflow: 'hidden', textAlign: 'left', color: 'inherit' }}>
      <img src={'https://img.youtube.com/vi/' + m.youtube_id + '/mqdefault.jpg'} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, height: 34, overflow: 'hidden' }}>{m.title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>{[m.year, m.duration, m.channel].filter(Boolean).join(' · ')}</div>
      </div>
    </button>
  );
}

export default function YtApp() {
  const nav = useNavigate();
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [play, setPlay] = useState(null);
  const [web, setWeb] = useState(null);
  const [webErr, setWebErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.rpc('yt_titles_list').then(({ data, error }) => {
      if (error || !data || data.ok === false) { setErr('Could not load the list.'); setRows([]); return; }
      setRows(data.items || []);
    });
  }, []);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (rows || []).filter((m) => !t || (m.title + ' ' + (m.genres || []).join(' ') + ' ' + (m.channel || '')).toLowerCase().includes(t));
  }, [rows, q]);

  const searchWeb = async (e) => {
    e.preventDefault();
    const t = q.trim();
    if (!t || busy) return;
    setBusy(true); setWebErr(''); setWeb(null);
    const { data, error } = await supabase.rpc('yt_search', { p_q: t });
    setBusy(false);
    if (error || !data || data.ok === false) { setWebErr((data && data.error) || 'Search failed.'); return; }
    setWeb(data.items || []);
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 70 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>YouTube Premium</h2>
      </div>
      <form onSubmit={searchWeb} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <label style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--muted)' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search titles or YouTube" style={{ width: '100%', height: 44, padding: '0 12px 0 36px', fontSize: 15, border: 'none', borderRadius: 14, background: 'var(--card)', color: 'var(--text)', boxShadow: 'var(--inset)' }} />
        </label>
        <button className="btn-primary" type="submit" disabled={busy || !q.trim()} style={{ padding: '0 14px', fontWeight: 800 }}>{busy ? '...' : 'Search YT'}</button>
      </form>

      {webErr && <div className="card" style={{ padding: 14, textAlign: 'center', color: 'var(--muted)', marginBottom: 12 }}>{webErr}</div>}
      {web && (
        <>
          <div style={{ fontWeight: 800, margin: '4px 0 8px' }}>From YouTube</div>
          {web.length === 0 && <div style={{ color: 'var(--muted)', padding: 12 }}>No results.</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
            {web.map((m) => <Card key={m.id} m={m} onPlay={setPlay} />)}
          </div>
          <div style={{ fontWeight: 800, margin: '4px 0 8px' }}>Library</div>
        </>
      )}

      {rows === null && <ProductGridSkeleton count={6} />}
      {err && <div className="card" style={{ padding: 16, textAlign: 'center', color: 'var(--muted)' }}>{err}</div>}
      {rows && !err && list.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: 'var(--muted)' }}>No titles found.</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {list.map((m) => <Card key={m.id} m={m} onPlay={setPlay} />)}
      </div>

      {play && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <button aria-label="Close player" onClick={() => setPlay(null)} style={{ position: 'absolute', top: 'calc(12px + env(safe-area-inset-top, 0px))', right: 12, width: 40, height: 40, borderRadius: 99, border: 0, background: 'rgba(255,255,255,.18)', color: '#fff', display: 'grid', placeItems: 'center', zIndex: 2 }}><X size={20} /></button>
          <style>{'@media (orientation: landscape){.yt-frame{aspect-ratio:auto!important;height:100%!important}}'}</style>
          <div className="yt-frame" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
            <iframe title={play.title} src={'https://www.youtube-nocookie.com/embed/' + play.youtube_id + '?autoplay=1&rel=0&playsinline=1'} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
          </div>
        </div>
      )}
    </div>
  );
}
