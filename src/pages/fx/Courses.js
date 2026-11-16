import React, { useEffect, useState } from 'react';
import { HubHead, XF_CSS } from '../xf/xfUi';
import { CardListSkeleton } from '../../components/Skeleton';
import { BookOpen, PlayCircle, ChevronDown } from 'lucide-react';
import { fx, S } from '../../lib/fx';

export default function Courses() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  const [open, setOpen] = useState('');
  useEffect(() => {
    fx('fx_courses_list').then((d) => setRows(Array.isArray(d) ? d : [])).catch((e) => { setErr(e.message); setRows([]); });
  }, []);
  return (
    <div className="page-enter xf">
      <style>{XF_CSS}</style>
      <HubHead title="Courses" sub="Learn at your own pace." />
      {err && <div style={S.err}>{err}</div>}
      {rows === null && <CardListSkeleton count={3} />}
      {rows && !rows.length && !err && <div style={{ ...S.card, textAlign: 'center', ...S.muted }}>No courses yet. Check back soon.</div>}
      {(rows || []).map((c) => {
        const isOpen = open === c.id;
        return (
          <div key={c.id} style={S.card}>
            <button type="button" onClick={() => setOpen(isOpen ? '' : c.id)} style={{ all: 'unset', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center', width: '100%' }}>
              {c.cover_url ? <img src={c.cover_url} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} /> : <span style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--bg)', boxShadow: 'var(--inset)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={22} color="var(--primary)" /></span>}
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 700 }}>{c.title}</span>
                <span style={{ display: 'block', ...S.muted }}>{c.lessons.length} {c.lessons.length === 1 ? 'lesson' : 'lessons'}</span>
              </span>
              <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
            </button>
            {isOpen && (
              <div style={{ marginTop: 12 }}>
                {c.description && <p style={{ fontSize: 13.5, lineHeight: 1.5, margin: '0 0 12px', whiteSpace: 'pre-wrap' }}>{c.description}</p>}
                {c.lessons.map((l, i) => (
                  <div key={i} style={{ padding: '10px 0', borderTop: '1px solid rgba(0,0,0,.07)' }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{i + 1}. {l.title}</div>
                    {l.content && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>{l.content}</div>}
                    {l.video_url && <a href={l.video_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}><PlayCircle size={16} /> Open lesson</a>}
                  </div>
                ))}
                {!c.lessons.length && <div style={S.muted}>Lessons are coming soon.</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
