import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';

export function ShareCard({ s }) {
  const nav = useNavigate();
  if (!s) return null;
  const go = () => nav(s.type === 'video' ? '/socials/video/' + s.id : '/socials/post/' + s.id + '/comments');
  return (
    <button type="button" onClick={go} style={{ display: 'flex', gap: 10, alignItems: 'center', width: 230, maxWidth: '100%', textAlign: 'left', padding: 8, borderRadius: 14, background: '#fff', color: '#0F172A', border: '1px solid #BFDBFE' }}>
      {s.image ? <img src={s.image} alt="" width="56" height="56" loading="lazy" decoding="async" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} /> : <div style={{ width: 56, height: 56, borderRadius: 10, background: '#EFF6FF', flexShrink: 0 }} />}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#2563EB' }}>{s.type === 'video' ? '▶ Video' : '🖼 Post'} · @{s.username}</div>
        <div style={{ fontSize: 12.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{s.title || 'Open'}</div>
      </div>
    </button>
  );
}

export default function ShareSheet({ type, id, onClose, onExternal }) {
  const { show } = useToast();
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { supabase.rpc('dm_inbox').then(({ data }) => setInbox(Array.isArray(data) ? data.slice(0, 6) : [])); }, []);
  useEffect(() => {
    const t = q.trim();
    if (t.length < 2) { setRows([]); return undefined; }
    let alive = true;
    const h = setTimeout(async () => {
      const { data } = await supabase.rpc('dm_search_users', { p_q: t });
      if (alive) setRows(Array.isArray(data) ? data.slice(0, 8) : []);
    }, 250);
    return () => { alive = false; clearTimeout(h); };
  }, [q]);

  const finish = (data, error, okMsg) => {
    setBusy(false);
    if (error) return show(error.message);
    if (!data || !data.ok) return show((data && data.error) || 'Could not share.');
    show(okMsg); onClose();
  };
  const toGlobal = async () => {
    if (busy) return;
    setBusy(true);
    const { data, error } = await supabase.rpc('global_share', { p_type: type, p_id: id });
    finish(data, error, 'Shared to Global Chat');
  };
  const toThread = async (tid) => {
    if (busy) return;
    setBusy(true);
    const { data, error } = await supabase.rpc('dm_send_share', { p_thread: tid, p_type: type, p_id: id });
    finish(data, error, 'Sent');
  };
  const toUser = async (u) => {
    if (busy) return;
    setBusy(true);
    const o = await supabase.rpc('dm_open', { p_other: u.user_id });
    if (o.error || !o.data || !o.data.ok) { setBusy(false); return show((o.data && o.data.error) || 'Could not open the chat.'); }
    const { data, error } = await supabase.rpc('dm_send_share', { p_thread: o.data.thread_id, p_type: type, p_id: id });
    finish(data, error, 'Sent');
  };

  const row = { display: 'block', width: '100%', textAlign: 'left', padding: '12px 4px', borderBottom: '1px solid #E2E8F0', fontSize: 14, fontWeight: 700, color: '#0F172A' };
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(15,23,42,.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 560, maxHeight: '80vh', overflowY: 'auto', background: '#fff', color: '#0F172A', borderRadius: '24px 24px 0 0', padding: '20px 18px calc(18px + env(safe-area-inset-bottom, 0px))' }}>
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>Share {type === 'video' ? 'video' : 'post'}</div>
        <button type="button" disabled={busy} onClick={toGlobal} style={row}>🌐 Global Chat</button>
        {inbox.map((r) => <button key={r.thread_id} type="button" disabled={busy} onClick={() => toThread(r.thread_id)} style={row}>💬 @{r.name}</button>)}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a user by username" style={{ width: '100%', padding: 12, fontSize: 14, margin: '12px 0 4px' }} />
        {rows.map((u) => <button key={u.user_id} type="button" disabled={busy} onClick={() => toUser(u)} style={row}>@{u.username}</button>)}
        {onExternal && <button type="button" onClick={onExternal} style={{ ...row, color: '#2563EB' }}>🔗 Copy link or share to other apps</button>}
        <button onClick={onClose} style={{ width: '100%', marginTop: 8, padding: 10, color: '#64748B', fontWeight: 700 }}>Cancel</button>
      </div>
    </div>
  );
}
