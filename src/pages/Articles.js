import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { imgUrl } from '../lib/img';

const when = (d) => new Date(d).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', year: 'numeric' });

export default function Articles() {
  const nav = useNavigate();
  const [rows, setRows] = useState(null);
  const [art, setArt] = useState(null);
  const [loadingArt, setLoadingArt] = useState(false);

  useEffect(() => { supabase.rpc('articles_list').then(({ data }) => setRows(Array.isArray(data) ? data : [])); }, []);

  const read = async (id) => {
    setLoadingArt(true);
    const { data } = await supabase.rpc('article_get', { p_id: id });
    setLoadingArt(false);
    if (data) setArt(data);
  };

  if (art) {
    return (
      <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
        <button className="icon-btn" aria-label="Back to articles" onClick={() => setArt(null)} style={{ marginBottom: 12 }}><ArrowLeft size={20} /></button>
        {art.cover_url && <img src={imgUrl(art.cover_url, 900)} alt="" style={{ width: '100%', borderRadius: 14, marginBottom: 12 }} />}
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>{art.title}</h2>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14 }}>{art.author ? art.author + ' · ' : ''}{when(art.published_at)}</div>
        <div style={{ fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{art.body}</div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Weekly Articles</h2>
      </div>
      {rows === null && <div style={{ textAlign: 'center', padding: 30, color: 'var(--muted)' }}>Loading…</div>}
      {rows && rows.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: 'var(--muted)' }}>No articles yet.</div>}
      {loadingArt && <div style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: 8 }}>Opening…</div>}
      {rows && rows.map((a) => (
        <div key={a.id} className="card" onClick={() => read(a.id)} style={{ padding: 0, marginBottom: 12, overflow: 'hidden', cursor: 'pointer' }}>
          {a.cover_url && <img src={imgUrl(a.cover_url, 700)} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }} />}
          <div style={{ padding: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 15.5 }}>{a.title}</div>
            {a.summary && <div style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 6px' }}>{a.summary}</div>}
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{a.author ? a.author + ' · ' : ''}{when(a.published_at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
