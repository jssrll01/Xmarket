import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { Avatar } from './socialsUi';
import { NameLabel } from '../components/PerkBadges';
import { PacketBubble, PacketCreate } from '../components/RedPacket';
import { ShareCard } from '../components/ShareSheet';
import useReactions from '../lib/useReactions';
import { MentionText, MentionSuggest, replaceMention, ReplyQuote, ReactionChip, MsgMenu, useLongPress } from '../components/MsgKit';

const hm = (d) => new Date(d).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const DAY_MS = 24 * 60 * 60 * 1000;

export default function DmInbox() {
  const nav = useNavigate();
  const [rows, setRows] = useState(null);
  useEffect(() => {
    let alive = true;
    const load = () => supabase.rpc('dm_inbox').then(({ data }) => { if (alive) setRows(Array.isArray(data) ? data.filter(r => r.last_text) : []); });
    load();
    return () => { alive = false; };
  }, []);
  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60, maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav('/socials')}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Messages</h2>
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', margin: '-6px 0 12px' }}>Chats are deleted automatically after 24 hours.</div>
      {rows === null && [0, 1, 2].map(i => <div key={i} className="sk" style={{ height: 68, borderRadius: 16, marginBottom: 10 }} />)}
      {rows && rows.length === 0 && <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 13.5 }}>No messages yet. Open a creator's profile and tap Message to start a chat.</div>}
      {rows && rows.map(r => (
        <div key={r.thread_id} className="card" onClick={() => nav('/messages/' + r.thread_id)} style={{ padding: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <Avatar name={r.name} url={r.avatar} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}><NameLabel username={r.name} verified /></div>
            <div style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.last_text}</div>
          </div>
          {r.unread > 0 && <span style={{ background: '#2563EB', color: '#fff', borderRadius: 99, minWidth: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, padding: '0 6px' }}>{r.unread}</span>}
        </div>
      ))}
    </div>
  );
}

export function DmChat() {
  const { tid } = useParams();
  const nav = useNavigate();
  const { show } = useToast();
  const [d, setD] = useState(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [pk, setPk] = useState(false);
  const [menu, setMenu] = useState(null);
  const [reply, setReply] = useState(null);
  const lp = useLongPress((m) => setMenu(m));
  const rx = useReactions('dm', d && d.messages ? d.messages.map((m) => m.id) : []);
  const end = useRef(null);
  const typedAt = useRef(0);
  const last = useRef(0);
  const load = useCallback(async () => {
    const { data } = await supabase.rpc('dm_thread', { p_thread: tid });
    setD(data && data.ok ? { ...data, messages: (data.messages || []).filter(m => Date.now() - new Date(m.created_at).getTime() < DAY_MS) } : { ok: false });
  }, [tid]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const n = d && d.messages ? d.messages.length : 0;
    if (n !== last.current) { last.current = n; if (end.current) end.current.scrollIntoView({ behavior: 'smooth' }); }
  }, [d]);
  const send = async () => {
    const b = text.trim();
    if (!b || busy) return;
    setBusy(true);
    const { data, error } = await supabase.rpc('dm_send', { p_thread: tid, p_body: b, p_reply: reply ? reply.id : null });
    setBusy(false);
    if (error) return show(error.message);
    if (!data.ok) return show(data.error);
    setText(''); setReply(null); load();
  };
  const typing = () => {
    const n = Date.now();
    if (n - typedAt.current < 3000) return;
    typedAt.current = n;
    supabase.rpc('dm_typing', { p_thread: tid }).then(() => {});
  };
  const wrap = { display: 'flex', flexDirection: 'column', height: '100dvh', maxWidth: 560, margin: '0 auto' };
  if (!d) return <div style={wrap}><div className="sk" style={{ height: 60, margin: 16, borderRadius: 16 }} /></div>;
  if (!d.ok) return <div style={{ padding: 16 }}><button className="icon-btn" aria-label="Back" onClick={() => nav('/messages')}><ArrowLeft size={20} /></button><div className="card" style={{ padding: 20, textAlign: 'center', marginTop: 14 }}>Conversation not found.</div></div>;
  return (
    <div style={wrap}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderBottom: '1px solid #E2E8F0', background: '#fff' }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav('/messages')}><ArrowLeft size={20} /></button>
        <Avatar name={d.other.name} url={d.other.avatar} />
        <div><div style={{ fontWeight: 800, fontSize: 15 }}><NameLabel username={d.other.name} verified /></div>{d.other_typing && <div style={{ fontSize: 11.5, color: '#2563EB', fontWeight: 700 }}>typing...</div>}</div>
      </div>
      <div style={{ padding: '6px 12px', textAlign: 'center', fontSize: 11.5, color: '#64748B', background: '#F1F5F9' }}>Messages disappear 24 hours after they are sent.</div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 8, background: '#F8FAFC' }}>
        {d.messages.length === 0 && <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginTop: 30 }}>Say hello 👋</div>}
        {d.messages.map(m => {
          const mine = m.sender === d.me;
          const lm = d.messages.filter((x) => x.sender === d.me).slice(-1)[0];
          const seen = mine && lm && lm.id === m.id && d.other_read_at && new Date(d.other_read_at) >= new Date(m.created_at);
          return (
            <div key={m.id} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              {m.kind === 'packet' ? <PacketBubble m={m} onClaimed={load} onToast={show} /> : m.kind === 'share' && m.share ? <ShareCard s={m.share} /> : m.kind === 'thanks' ? <div style={{ padding: '10px 14px', borderRadius: 16, background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D', fontSize: 14, fontWeight: 800 }}>🙏 {m.body}</div> : <div style={{ padding: '9px 13px', borderRadius: 16, background: mine ? '#2563EB' : '#fff', color: mine ? '#fff' : '#0F172A', border: mine ? 'none' : '1px solid #E2E8F0', fontSize: 14, lineHeight: 1.45, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} {...lp(m)}>{m.reply_text && <ReplyQuote name={m.reply_name} text={m.reply_text} />}<MentionText text={m.body} /></div>}
              <div style={{ fontSize: 10.5, color: 'var(--muted)', textAlign: mine ? 'right' : 'left', marginTop: 2 }}>{hm(m.created_at)}{seen ? ' · Seen' : ''}</div>
              <ReactionChip s={rx.map[m.id]} mine={mine} onTap={() => rx.set(m.id, rx.map[m.id] && rx.map[m.id].mine ? null : 'like')} />
            </div>
          );
        })}
        <div ref={end} />
      </div>
      {reply && (<div className="mk-replybar" style={{ margin: 0, borderRadius: 0 }}><span>Replying to <b>{reply.sender === d.me ? 'yourself' : '@' + d.other.name}</b>: {String(reply.body).slice(0, 60)}</span><button type="button" aria-label="Cancel reply" onClick={() => setReply(null)}>✕</button></div>)}
      <div style={{ background: '#fff', padding: '0 10px' }}><MentionSuggest text={text} onPick={(u) => setText(replaceMention(text, u))} /></div>
      <div style={{ display: 'flex', gap: 8, padding: 10, borderTop: '1px solid #E2E8F0', background: '#fff' }}>
        <button type="button" aria-label="Red packet" onClick={() => setPk(true)} style={{ width: 46, height: 46, borderRadius: '50%', fontSize: 22, flexShrink: 0, background: '#FEE2E2' }}>🧧</button>
        <input value={text} maxLength={1000} onChange={e => { setText(e.target.value); typing(); }} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder="Write a message…" style={{ flex: 1, padding: '11px 14px', borderRadius: 99, border: '1px solid #CBD5E1', fontSize: 14 }} />
        <button className="btn-primary" disabled={busy || !text.trim()} onClick={send} aria-label="Send" style={{ width: 46, height: 46, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Send size={18} /></button>
      </div>
      {menu && (
        <MsgMenu current={rx.map[menu.id] && rx.map[menu.id].mine} text={menu.body}
          onReact={(k) => { rx.set(menu.id, k); setMenu(null); }}
          onReply={() => { setReply(menu); setMenu(null); }}
          onClose={() => setMenu(null)} />
      )}
      {pk && <PacketCreate thread={tid} onClose={() => setPk(false)} onDone={() => { setPk(false); load(); }} onToast={show} />}
    </div>
  );
}
