import React, { useEffect, useState } from 'react';
import { CardListSkeleton } from '../components/Skeleton';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Newspaper } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { imgUrl } from '../lib/img';

const when = (d) => new Date(d).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', year: 'numeric' });
const mins = (t) => Math.max(1, Math.round(String(t || '').split(/\s+/).filter(Boolean).length / 200));

// Light formatting: "# " heading, "- " bullets, "> " quote, blank line = new paragraph
function Body({ text }) {
  const blocks = String(text || '').replace(/\r/g, '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((b, i) => {
    if (b.startsWith('# ')) return <h3 key={i} style={{ fontSize: 19, fontWeight: 800, margin: '26px 0 8px', lineHeight: 1.3 }}>{b.slice(2)}</h3>;
    if (b.split('\n').every((l) => l.trim().startsWith('- '))) {
      return (
        <ul key={i} style={{ margin: '0 0 16px', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {b.split('\n').map((l, k) => (
            <li key={k} style={{ display: 'flex', gap: 10, fontSize: 16, lineHeight: 1.65 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: '#2563EB', marginTop: 10, flexShrink: 0 }} />
              <span style={{ wordBreak: 'break-word' }}>{l.trim().slice(2)}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (b.startsWith('> ')) {
      return (
        <blockquote key={i} style={{ margin: '20px 0', padding: '14px 16px', borderLeft: '4px solid #2563EB', background: '#EFF6FF', borderRadius: '0 12px 12px 0', fontSize: 16.5, fontWeight: 600, lineHeight: 1.6, color: '#1E3A8A' }}>
          {b.split('\n').map((l) => l.replace(/^>\s?/, '')).join(' ')}
        </blockquote>
      );
    }
    return <p key={i} style={{ fontSize: 16, lineHeight: 1.8, margin: '0 0 16px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#1F2937' }}>{b}</p>;
  });
}

export default function Articles() {
  const nav = useNavigate();
  const [rows, setRows] = useState(null);
  const [art, setArt] = useState(null);
  const [loadingArt, setLoadingArt] = useState(false);

  useEffect(() => { supabase.rpc('articles_list').then(({ data }) => setRows(Array.isArray(data) ? data.slice().sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0)) : [])); }, []);

  const read = async (id) => {
    setLoadingArt(true);
    const { data } = await supabase.rpc('article_get', { p_id: id });
    setLoadingArt(false);
    if (data) { setArt(data); window.scrollTo(0, 0); }
  };

  if (art) {
    const initial = String(art.author || 'X').trim().charAt(0).toUpperCase();
    return (
      <div className="page-enter" style={{ paddingBottom: 70 }}>
        <div style={{ padding: '16px 16px 12px' }}>
          <button className="icon-btn" aria-label="Back to articles" onClick={() => setArt(null)}><ArrowLeft size={20} /></button>
        </div>

        {art.cover_url && (
          <div style={{ padding: '0 16px' }}>
            <img src={imgUrl(art.cover_url, 1000)} alt="" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 18, boxShadow: '0 10px 28px rgba(15,23,42,.18)' }} />
          </div>
        )}

        <div style={{ padding: '18px 18px 0' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, background: '#DBEAFE', color: '#1D4ED8', fontSize: 11.5, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            <Newspaper size={12} /> Weekly Article
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.2, margin: '12px 0 14px', wordBreak: 'break-word' }}>{art.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid #E2E8F0' }}>
            <span style={{ width: 38, height: 38, borderRadius: 99, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, flexShrink: 0 }}>{initial}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{art.author || 'XMARKET'}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {when(art.published_at)} <span>·</span> <Clock size={12} /> {mins(art.body)} min read
              </div>
            </div>
          </div>

          {art.summary && (
            <div style={{ margin: '18px 0 20px', padding: '14px 16px', borderRadius: 14, background: 'linear-gradient(135deg,#EFF6FF,#F5F3FF)', border: '1px solid #DBEAFE', fontSize: 16, fontWeight: 600, lineHeight: 1.6, color: '#1E293B' }}>
              {art.summary}
            </div>
          )}

          <div style={{ marginTop: art.summary ? 0 : 18 }}><Body text={art.body} /></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '28px 0 16px', color: '#94A3B8' }}>
            <span style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>END OF ARTICLE</span>
            <span style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          </div>
          <button className="btn-primary" onClick={() => { setArt(null); window.scrollTo(0, 0); }} style={{ width: '100%', padding: 14, fontWeight: 800 }}>Back to articles</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Weekly Articles</h2>
      </div>
      {rows === null && <CardListSkeleton count={3} />}
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
