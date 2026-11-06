import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import './GlobalChat.css';

const DAY_MS = 24 * 60 * 60 * 1000;
const COLORS = ['#2563EB', '#059669', '#F59E0B', '#DC2626', '#7C3AED', '#0891B2', '#DB2777'];

const byTime = (a, b) => new Date(a.created_at) - new Date(b.created_at);
const colorOf = (id) => { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return COLORS[h % COLORS.length]; };
const fmtTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
const dayKey = (d) => new Date(d).toDateString();
const dayLabel = (d) => {
  const x = new Date(d);
  if (x.toDateString() === new Date().toDateString()) return 'Today';
  if (x.toDateString() === new Date(Date.now() - DAY_MS).toDateString()) return 'Yesterday';
  return x.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

function Avatar({ m }) {
  const name = m.username || 'X';
  return (
    <div className="gc-av" style={{ background: colorOf(m.user_id) }}>
      {name[0].toUpperCase()}
      {m.avatar_url && <img src={m.avatar_url} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
    </div>
  );
}

export default function GlobalChat() {
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [showDown, setShowDown] = useState(false);
  const listRef = useRef(null);
  const stick = useRef(true);

  const add = useCallback((m) => {
    setMsgs((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m].sort(byTime)));
  }, []);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return undefined; }
    let alive = true;
    const since = new Date(Date.now() - DAY_MS).toISOString();

    supabase.from('global_messages').select('*').gte('created_at', since)
      .order('created_at', { ascending: false }).limit(200)
      .then(({ data, error: err }) => {
        if (!alive) return;
        if (err) {
          setError(err.code === '42P01' || err.code === 'PGRST205'
            ? 'Global Chat is not set up yet.'
            : 'Could not load messages.');
        } else {
          setMsgs((prev) => {
            const map = new Map();
            [...(data || []).reverse(), ...prev].forEach((m) => map.set(m.id, m));
            return [...map.values()].sort(byTime);
          });
        }
        setLoading(false);
      });

    const ch = supabase.channel('global-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'global_messages' }, (p) => { if (alive) add(p.new); })
      .subscribe();

    // hide anything older than 24 hours even before the server cleanup runs
    const tick = setInterval(() => {
      setMsgs((prev) => prev.filter((m) => Date.now() - new Date(m.created_at) < DAY_MS));
    }, 60000);

    return () => { alive = false; supabase.removeChannel(ch); clearInterval(tick); };
  }, [user?.id, add]);

  const onScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    stick.current = near;
    setShowDown(!near);
  };

  const toBottom = () => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };

  useLayoutEffect(() => {
    const el = listRef.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [msgs, loading]);

  const send = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    setSending(true); setError(''); stick.current = true;
    const { data, error: err } = await supabase.from('global_messages').insert({ body }).select().single();
    setSending(false);
    if (err) {
      setError(String(err.message || '').includes('too fast') ? 'You are sending messages too fast.' : 'Could not send. Try again.');
      return;
    }
    setText('');
    add(data);
  };

  const head = (
    <div className="gc-head">
      <h2 className="gc-title">Global Chat</h2>
      <span className="gc-live" aria-label="Live" />
    </div>
  );

  if (!authLoading && !user) {
    return (
      <div className="page-enter gc-page">
        {head}
        <div className="gc-empty">
          <p>Sign in to join the conversation.</p>
          <button className="btn-primary" onClick={() => nav('/signin')} style={{ marginTop: 12, padding: '10px 24px' }}>Sign in</button>
        </div>
      </div>
    );
  }

  const rows = [];
  msgs.forEach((m, i) => {
    const prev = msgs[i - 1];
    const next = msgs[i + 1];
    const newDay = !prev || dayKey(prev.created_at) !== dayKey(m.created_at);
    const first = newDay || prev.user_id !== m.user_id;
    const last = !next || next.user_id !== m.user_id || dayKey(next.created_at) !== dayKey(m.created_at);
    const mine = m.user_id === user?.id;
    if (newDay) rows.push(<div key={'d' + m.id} className="gc-day"><span>{dayLabel(m.created_at)}</span></div>);
    rows.push(
      <div key={m.id} className={'gc-row' + (mine ? ' mine' : '') + (first ? ' first' : '')}>
        {!mine && (last ? <Avatar m={m} /> : <span className="gc-av-spacer" />)}
        <div className="gc-col">
          {!mine && first && <div className="gc-name">{m.username || 'XMARKET user'}</div>}
          <div className="gc-bubble">
            <span className="gc-text">{m.body}</span>
            <span className="gc-time">{fmtTime(m.created_at)}</span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="page-enter gc-page">
      {head}

      <div className="gc-listwrap">
        <div className="gc-list" ref={listRef} onScroll={onScroll}>
          {loading && [0, 1, 2, 3].map((i) => (
            <div key={i} className="gc-row first" style={{ justifyContent: i % 2 ? 'flex-end' : 'flex-start' }}>
              {i % 2 === 0 && <div className="sk" style={{ width: 34, height: 34, borderRadius: '50%' }} />}
              <div className="sk" style={{ width: 150 + i * 28, height: 40, borderRadius: 18 }} />
            </div>
          ))}
          {!loading && !error && msgs.length === 0 && (
            <div className="gc-empty">No messages yet. Say hi to everyone!</div>
          )}
          {rows}
        </div>
        {showDown && (
          <button type="button" className="gc-down" onClick={toBottom} aria-label="Jump to latest">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
        )}
      </div>

      {error && <div className="gc-error">{error}</div>}
      <form className="gc-compose" onSubmit={send}>
        <div className="gc-field">
          <input
            className="gc-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message everyone..."
            maxLength={500}
            autoComplete="off"
          />
          <button type="submit" className="gc-send" aria-label="Send" disabled={!text.trim() || sending}>
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
