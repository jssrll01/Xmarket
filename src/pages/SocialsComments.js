import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { Avatar, Sk, SkStyle, time12 } from './socialsUi';
import VipBadge from '../components/VipBadge';

export default function SocialsComments() {
  const { id } = useParams();
  const nav = useNavigate();
  const { show } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [reply, setReply] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.rpc('socials_comments', { p_post: id });
    setRows(data || []); setLoading(false);
  }, [id]);
  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, [load]);

  const send = async () => {
    if (busy || !text.trim()) return;
    setBusy(true);
    const { data, error } = await supabase.rpc('socials_add_comment', { p_post: id, p_parent: reply ? reply.id : null, p_body: text });
    setBusy(false);
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    setText(''); setReply(null); load();
  };

  const tops = rows.filter(c => !c.parent_id);
  const kids = (pid) => rows.filter(c => c.parent_id === pid);

  const Item = ({ c, child }) => (
    <div style={{ display: 'flex', gap: 10, marginTop: child ? 10 : 14 }}>
      <Avatar name={c.username} size={child ? 28 : 36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '8px 12px' }}>
          <div style={{ fontWeight: 800, fontSize: 13 }}>@{c.username}{c.is_vip && <VipBadge active />}{c.is_creator && <span style={{ marginLeft: 6, fontSize: 9, background: '#2563EB', color: '#fff', padding: '2px 6px', borderRadius: 8, verticalAlign: 'middle' }}>CREATOR</span>}</div>
          <div style={{ fontSize: 14, marginTop: 2, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{c.body}</div>
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--muted)', padding: '4px 8px', alignItems: 'center' }}>
          <span>{time12(c.created_at)}</span>
          <button onClick={() => setReply(c)} style={{ fontWeight: 800, fontSize: 11, color: 'var(--muted)' }}>Reply</button>
                  </div>
      </div>
    </div>
  );

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 220 }}>
      <SkStyle />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Comments</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--muted)', marginBottom: 6 }}><Clock size={13} /> Comments disappear 24 hours after they are written.</div>
      {loading && [0, 1, 2].map(i => <Sk key={i} h={64} r={16} style={{ marginTop: 14 }} />)}
      {!loading && rows.length === 0 && <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}><b style={{ color: 'var(--text)' }}>No comments yet</b><div style={{ fontSize: 13, marginTop: 4 }}>Be the first to comment.</div></div>}
      {tops.map(c => (
        <div key={c.id}>
          <Item c={c} />
          <div style={{ marginLeft: 46 }}>{kids(c.id).map(k => <Item key={k.id} c={k} child />)}</div>
        </div>
      ))}
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 84, background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '8px 12px 10px', zIndex: 1000 }}>
        {reply && <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between', padding: '0 4px 6px' }}>Replying to @{reply.username}<button onClick={() => setReply(null)} style={{ fontWeight: 800 }}>Cancel</button></div>}
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={text} maxLength={300} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder={reply ? 'Write a reply…' : 'Write a comment…'} style={{ flex: 1, height: 44, padding: '0 14px', fontSize: 14 }} />
          <button className="btn-primary" disabled={busy || !text.trim()} onClick={send} aria-label="Send" style={{ width: 46, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
}
