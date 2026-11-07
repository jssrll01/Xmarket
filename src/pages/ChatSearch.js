import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import VipBadge from '../components/VipBadge';
import './GlobalChat.css';

const COLORS = ['#2563EB', '#059669', '#F59E0B', '#DC2626', '#7C3AED', '#0891B2', '#DB2777'];
const colorOf = (id) => { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return COLORS[h % COLORS.length]; };
const hint = { textAlign: 'center', color: 'var(--muted)', fontSize: 13, padding: '28px 10px' };

export default function ChatSearch() {
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [q, setQ] = useState('');
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState(false);
  const [peer, setPeer] = useState(null);
  const [opening, setOpening] = useState(false);
  const [err, setErr] = useState('');
  const inp = useRef(null);

  useEffect(() => { if (inp.current) inp.current.focus(); }, []);

  useEffect(() => {
    const t = q.trim().replace(/^@/, '');
    if (t.length < 2) { setRows(null); setBusy(false); return undefined; }
    let alive = true;
    setBusy(true);
    const h = setTimeout(async () => {
      const { data } = await supabase.rpc('dm_search_users', { p_q: t });
      if (!alive) return;
      setRows(Array.isArray(data) ? data : []);
      setBusy(false);
    }, 250);
    return () => { alive = false; clearTimeout(h); };
  }, [q]);

  const openDm = async () => {
    if (!peer || opening) return;
    setOpening(true); setErr('');
    const { data, error } = await supabase.rpc('dm_open', { p_other: peer.user_id });
    setOpening(false);
    setPeer(null);
    if (error || !data || !data.ok) { setErr((data && data.error) || 'Could not open the chat.'); return; }
    nav('/messages/' + data.thread_id);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--bg)', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 13, top: 15, color: 'var(--muted)', zIndex: 1 }} />
          <input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users by username" autoComplete="off" maxLength={30} style={{ width: '100%', height: 46, padding: '0 38px', fontSize: 14.5 }} />
          {q && <button aria-label="Clear" onClick={() => setQ('')} style={{ position: 'absolute', right: 10, top: 12 }}><X size={18} /></button>}
        </div>
      </div>

      <div style={{ padding: '0 14px 40px' }}>
        {!authLoading && !user && (
          <div style={hint}>Sign in to message other users.<br /><button className="btn-primary" onClick={() => nav('/signin')} style={{ marginTop: 12, padding: '10px 24px' }}>Sign in</button></div>
        )}
        {err && <div className="gc-error" style={{ padding: '6px 4px' }}>{err}</div>}
        {user && !q.trim() && <div style={hint}>Type at least 2 letters of a username.</div>}
        {busy && <div style={hint}>Searching…</div>}
        {rows && !busy && rows.length === 0 && <div style={hint}>No users found.</div>}
        {rows && rows.map((r) => (
          <div key={r.user_id} onClick={() => setPeer(r)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 4px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
            <span className="gc-av" style={{ background: colorOf(r.user_id) }}>{(r.username || 'X')[0].toUpperCase()}</span>
            <b style={{ fontSize: 14.5 }}>@{r.username}</b>
            {r.is_vip && <VipBadge active />}
          </div>
        ))}
      </div>

      {peer && (
        <div className="gc-ov" onClick={() => setPeer(null)}>
          <div className="gc-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="gc-sheet-av" style={{ background: colorOf(peer.user_id) }}>{(peer.username || 'X')[0].toUpperCase()}</div>
            <div className="gc-sheet-name">@{peer.username}</div>
            <button type="button" className="gc-sheet-btn" onClick={openDm} disabled={opening}>{opening ? 'Opening…' : 'Send message'}</button>
            <button type="button" className="gc-sheet-cancel" onClick={() => setPeer(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
