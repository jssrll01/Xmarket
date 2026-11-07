import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { thumb } from '../components/VideoRail';

export default function AdminVideos() {
  const nav = useNavigate();
  const { show } = useToast();
  const [code, setCode] = useState('');
  const [authed, setAuthed] = useState(false);
  const [status, setStatus] = useState('active');
  const [rows, setRows] = useState(null);
  const [cm, setCm] = useState(null);

  const load = async (st, c) => {
    const { data, error } = await supabase.rpc('admin_videos_list', { p_code: c || code, p_status: st, p_limit: 100 });
    if (error) { setAuthed(false); setRows(null); return show(error.message === 'unauthorized' ? 'Wrong admin code.' : error.message); }
    setAuthed(true); setRows(Array.isArray(data) ? data : []);
  };
  const login = () => { if (code.trim()) load(status, code.trim()); };
  const tab = (st) => { setStatus(st); load(st); };
  const setSt = async (v, st) => {
    if (!window.confirm(st === 'removed' ? 'Remove this video from Socials?' : 'Restore this video?')) return;
    const { data, error } = await supabase.rpc('admin_video_set_status', { p_code: code, p_video: v.id, p_status: st });
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    show(st === 'removed' ? 'Video removed' : 'Video restored'); load(status);
  };
  const openCm = async (v) => {
    const { data, error } = await supabase.rpc('admin_video_comments', { p_code: code, p_video: v.id });
    if (error) return show(error.message);
    setCm({ video: v, rows: Array.isArray(data) ? data : [] });
  };
  const delCm = async (c) => {
    const { data, error } = await supabase.rpc('admin_video_comment_delete', { p_code: code, p_comment: c.id });
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    setCm((s) => ({ ...s, rows: s.rows.filter((x) => x.id !== c.id) })); load(status);
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Admin: Videos</h2>
      </div>
      {!authed && (
        <div className="card" style={{ padding: 16 }}>
          <input type="password" value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') login(); }} placeholder="Admin code" style={{ width: '100%', padding: 12, marginBottom: 12, fontSize: 14 }} />
          <button className="btn-primary" onClick={login} style={{ width: '100%', padding: 13, fontWeight: 800 }}>Unlock</button>
        </div>
      )}
      {authed && (<>
        <div className="vp-tabs">
          <button type="button" className={status === 'active' ? 'on' : ''} onClick={() => tab('active')}>Live</button>
          <button type="button" className={status === 'removed' ? 'on' : ''} onClick={() => tab('removed')}>Removed</button>
        </div>
        {rows && rows.length === 0 && <div className="vr-empty">No videos here.</div>}
        {rows && rows.map((v) => (
          <div className="card" key={v.id} style={{ display: 'flex', gap: 12, padding: 10, marginBottom: 10 }}>
            <img src={thumb(v)} alt="" style={{ width: 62, height: 110, objectFit: 'cover', borderRadius: 10, background: '#0F172A', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>@{v.username} <span style={{ fontSize: 11, color: 'var(--muted)' }}>{v.platform}</span></div>
              <div style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title || '(no title)'}</div>
              <div style={{ fontSize: 12 }}>{v.likes} likes · {v.comments} comments</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <button className="btn-ghost" onClick={() => openCm(v)} style={{ padding: '6px 12px', fontSize: 12 }}>Comments</button>
                {status === 'active'
                  ? <button className="btn-ghost" onClick={() => setSt(v, 'removed')} style={{ padding: '6px 12px', fontSize: 12, color: '#DC2626' }}>Remove</button>
                  : <button className="btn-ghost" onClick={() => setSt(v, 'active')} style={{ padding: '6px 12px', fontSize: 12 }}>Restore</button>}
              </div>
            </div>
          </div>
        ))}
      </>)}
      {cm && (
        <div className="vv-ov" onClick={() => setCm(null)}>
          <div className="vv-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="vv-sheet-h"><span>Comments on @{cm.video.username}</span><button type="button" onClick={() => setCm(null)}>✕</button></div>
            <div className="vv-sheet-l">
              {cm.rows.length === 0 && <div className="vr-empty">No comments.</div>}
              {cm.rows.map((c) => (
                <div className="vv-cm" key={c.id}>
                  <div className="b"><b>@{c.username}</b><div>{c.body}</div></div>
                  <button type="button" onClick={() => delCm(c)} style={{ color: '#DC2626', fontWeight: 800, fontSize: 12 }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
