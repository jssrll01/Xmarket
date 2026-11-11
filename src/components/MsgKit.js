import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { KINDS, EMOJI } from '../lib/useReactions';
import '../msgkit.css';

const TAIL = /(^|\s)@([A-Za-z0-9_.]{2,30})$/;
export const replaceMention = (text, user) => String(text || '').replace(/(^|\s)@([A-Za-z0-9_.]{1,30})$/, (m, a) => a + '@' + user + ' ');

export function MentionText({ text }) {
  const parts = String(text || '').split(/(@[A-Za-z0-9_.]{2,30})/g);
  return parts.map((p, i) => (/^@[A-Za-z0-9_.]{2,30}$/.test(p) ? <b key={i} className="mk-mention">{p}</b> : <React.Fragment key={i}>{p}</React.Fragment>));
}

export function MentionSuggest({ text, onPick }) {
  const [rows, setRows] = useState([]);
  const m = TAIL.exec(text || '');
  const q = m ? m[2] : '';
  useEffect(() => {
    if (!q) { setRows([]); return undefined; }
    let alive = true;
    const h = setTimeout(async () => {
      const { data } = await supabase.rpc('dm_search_users', { p_q: q });
      if (alive) setRows(Array.isArray(data) ? data.slice(0, 5) : []);
    }, 200);
    return () => { alive = false; clearTimeout(h); };
  }, [q]);
  if (!q || !rows.length) return null;
  return (
    <div className="mk-suggest">
      {rows.map((r) => <button type="button" key={r.user_id} onClick={() => onPick(r.username)}>@{r.username}</button>)}
    </div>
  );
}

export const ReplyQuote = ({ name, text }) => (
  <div className="mk-quote"><b>@{name || 'user'}</b><span>{text}</span></div>
);

export function ReactionChip({ s, mine, onTap }) {
  if (!s || !s.total) return null;
  const top = Object.entries(s.counts || {}).sort((a, b) => b[1] - a[1]).slice(0, 3);
  return (
    <div style={{ textAlign: mine ? 'right' : 'left' }}>
      <button type="button" className={'mk-chip' + (s.mine ? ' on' : '')} onClick={onTap}>
        {top.map(([k]) => <span key={k}>{EMOJI[k]}</span>)}<b>{s.total}</b>
      </button>
    </div>
  );
}

export function MsgMenu({ current, text, onReact, onReply, onClose }) {
  const copy = async () => { try { await navigator.clipboard.writeText(text || ''); } catch (e) { /* ignore */ } onClose(); };
  return (
    <div className="mk-ov" onClick={onClose}>
      <div className="mk-menu" onClick={(e) => e.stopPropagation()}>
        <div className="mk-emojis">
          {KINDS.map(([k, e]) => (
            <button key={k} type="button" aria-label={k} className={current === k ? 'on' : ''} onClick={() => onReact(current === k ? null : k)}>{e}</button>
          ))}
        </div>
        <div className="mk-actions">
          <button type="button" onClick={onReply}>↩ Reply</button>
          <button type="button" onClick={copy}>⧉ Copy</button>
        </div>
      </div>
    </div>
  );
}

export function useLongPress(cb, ms = 450) {
  const t = useRef(null);
  const start = useRef(null);
  const clear = () => { if (t.current) { clearTimeout(t.current); t.current = null; } };
  return (item) => ({
    'data-lp': '1',
    onPointerDown: (e) => {
      start.current = { x: e.clientX, y: e.clientY };
      clear();
      t.current = setTimeout(() => { t.current = null; if (navigator.vibrate) navigator.vibrate(12); cb(item); }, ms);
    },
    onPointerMove: (e) => {
      if (start.current && (Math.abs(e.clientX - start.current.x) > 8 || Math.abs(e.clientY - start.current.y) > 8)) clear();
    },
    onPointerUp: clear,
    onPointerCancel: clear,
    onPointerLeave: clear,
    onContextMenu: (e) => e.preventDefault(),
  });
}
