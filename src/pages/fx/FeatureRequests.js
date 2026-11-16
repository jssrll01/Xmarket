import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp } from 'lucide-react';
import { fx, S, when } from '../../lib/fx';

export default function FeatureRequests() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  const [isCr, setIsCr] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [busy, setBusy] = useState('');
  const load = useCallback(() => {
    fx('fx_requests_list').then((d) => { setRows(Array.isArray(d) ? d : []); setErr(''); }).catch((e) => { setErr(e.message); setRows([]); });
  }, []);
  useEffect(() => {
    load();
    fx('fx_is_creator').then((v) => setIsCr(v === true)).catch(() => {});
  }, [load]);
  const vote = async (r) => {
    setBusy(r.id); setErr('');
    try { await fx('fx_request_vote', { p_id: r.id }); load(); } catch (e) { setErr(e.message); }
    setBusy('');
  };
  const create = async () => {
    setBusy('new'); setErr('');
    try { await fx('fx_request_create', { p_title: title, p_desc: desc }); setTitle(''); setDesc(''); load(); } catch (e) { setErr(e.message); }
    setBusy('');
  };
  const open = (rows || []).filter((r) => r.is_open);
  const closed = (rows || []).filter((r) => !r.is_open).sort((a, b) => b.votes - a.votes);
  return (
    <div className="page-enter" style={S.page}>
      <Link to="/digital-hub" style={S.back}><ArrowLeft size={16} /> Digital Hub</Link>
      <h1 style={S.h1}>Feature Requests</h1>
      <p style={S.sub}>Vote on what we build next. Each option runs for a week, then the result is shown.</p>
      {err && <div style={S.err}>{err}</div>}
      {isCr && (
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Add a voting option</div>
          <input style={S.input} placeholder="Feature idea (min 5 characters)" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} />
          <textarea style={{ ...S.input, minHeight: 70, resize: 'vertical' }} placeholder="Details (optional)" value={desc} maxLength={500} onChange={(e) => setDesc(e.target.value)} />
          <button type="button" style={{ ...S.btn, opacity: busy === 'new' ? 0.6 : 1 }} disabled={busy === 'new'} onClick={create}>{busy === 'new' ? 'Posting…' : 'Post option'}</button>
          <div style={{ ...S.muted, marginTop: 8 }}>One option per week. Everyone is notified when you post.</div>
        </div>
      )}
      {rows === null && <div style={S.muted}>Loading…</div>}
      {rows && !open.length && !err && <div style={{ ...S.card, textAlign: 'center', ...S.muted }}>No open votes right now.</div>}
      {open.map((r) => (
        <div key={r.id} style={S.card}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{r.title}</div>
          {r.description && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, whiteSpace: 'pre-wrap' }}>{r.description}</div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
            <button type="button" disabled={busy === r.id} onClick={() => vote(r)} style={{ ...S.btn, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', fontSize: 13, background: r.voted ? 'var(--primary)' : 'var(--bg)', color: r.voted ? '#fff' : 'var(--text)', boxShadow: r.voted ? 'none' : 'var(--raised-sm)' }}>
              <ThumbsUp size={15} /> {r.voted ? 'Voted' : 'Vote'}
            </button>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{r.votes} {r.votes === 1 ? 'vote' : 'votes'}</span>
            <span style={{ ...S.muted, marginLeft: 'auto' }}>Ends {when(r.closes_at)}</span>
          </div>
          <div style={{ ...S.muted, marginTop: 6 }}>by @{r.creator || 'creator'}</div>
        </div>
      ))}
      {closed.length > 0 && <div style={{ ...S.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', margin: '18px 0 8px' }}>Results</div>}
      {closed.map((r, i) => (
        <div key={r.id} style={S.card}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
            <span style={{ fontSize: 15, fontWeight: 700, flex: 1 }}>{i === 0 && r.votes > 0 ? '🏆 ' : ''}{r.title}</span>
            <b>{r.votes}</b>
          </div>
          <div style={S.muted}>Closed {when(r.closes_at)} · by @{r.creator || 'creator'}</div>
        </div>
      ))}
    </div>
  );
}
