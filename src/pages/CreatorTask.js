import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle2, Link2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BLUE, MUTED, peso, card, inp, btn, circBtn, Pill, Sk, SkStyle } from './creatorUi';

export default function CreatorTask() {
  const { id } = useParams();
  const nav = useNavigate();
  const [d, setD] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase.rpc('creator_task_get', { p_id: id });
    setD(data); setLoaded(true);
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const wrap = { maxWidth: 640, margin: '0 auto', padding: 16 };

  if (!loaded) return (
    <div style={wrap}><SkStyle />
      <Sk h={150} r={24} style={{ marginBottom: 14 }} />
      <Sk h={120} r={18} style={{ marginBottom: 12 }} />
      <Sk h={150} r={18} style={{ marginBottom: 12 }} />
      <Sk h={200} r={18} />
    </div>
  );
  if (!d || !d.ok) return (
    <div style={wrap}>
      <button type="button" onClick={() => nav('/creator-studio')} style={{ ...circBtn, background: BLUE }}><ArrowLeft size={18} /></button>
      <div style={{ ...card, marginTop: 14 }}>{(d && d.error) || 'Task not available.'}</div>
    </div>
  );

  const t = d.task;
  const subs = d.submissions || [];
  const closed = t.deadline && new Date(t.deadline) < new Date();
  const pending = subs.some(s => s.status === 'pending');
  const done = subs.some(s => s.status === 'approved');
  const maxEntries = t.max_entries || 5;
  const used = subs.filter(s => s.status !== 'rejected').length;
  const pendingCount = subs.filter(s => s.status === 'pending').length;
  const locked = closed || used >= maxEntries || pendingCount >= 3;
  const reqs = String(t.requirements || '').split('\n').map(x => x.trim()).filter(Boolean);

  void pending; void done;
  const submit = async () => {
    if (busy) return; setMsg('');
    if (!/^https?:\/\//i.test(url.trim())) return setMsg('Enter a valid link starting with http:// or https://');
    setBusy(true);
    const { data, error } = await supabase.rpc('creator_submit_task', { p_task_id: id, p_content: note, p_link: url });
    setBusy(false);
    if (error) return setMsg(error.message);
    if (!data.ok) return setMsg(data.error);
    setUrl(''); setNote(''); setMsg('Entry submitted. Please wait for review.'); load();
  };

  return (
    <div style={wrap}>
      <div style={{ borderRadius: 24, padding: 18, marginBottom: 14, color: '#fff', background: 'linear-gradient(135deg,#1D4ED8 0%,#2563EB 45%,#60A5FA 100%)', boxShadow: '0 16px 40px rgba(37,99,235,.35)' }}>
        <button type="button" aria-label="Back" onClick={() => nav('/creator-studio')} style={circBtn}><ArrowLeft size={18} /></button>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 14 }}>Creator task</div>
        <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{t.title}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          <span style={{ background: '#fff', color: BLUE, borderRadius: 20, padding: '5px 12px', fontWeight: 800, fontSize: 13 }}>Reward {peso(t.reward)}</span>
          {t.deadline && <span style={{ background: 'rgba(255,255,255,.2)', borderRadius: 20, padding: '5px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={13} />{closed ? 'Closed' : 'Until'} {new Date(t.deadline).toLocaleDateString()}</span>}
        </div>
      </div>

      {t.description && (
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>About this task</div>
          <p style={{ fontSize: 14, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{t.description}</p>
        </div>
      )}

      {reqs.length > 0 && (
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>Requirements</div>
          {reqs.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 14, padding: '5px 0', lineHeight: 1.45 }}>
              <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: 1 }} /><span>{r}</span>
            </div>
          ))}
        </div>
      )}

      {t.notes && (
        <div style={{ ...card, background: 'rgba(37,99,235,.07)', borderColor: 'rgba(37,99,235,.25)' }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6, color: BLUE }}>Notes</div>
          <p style={{ fontSize: 14, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{t.notes}</p>
        </div>
      )}

      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2 }}>Submit your entry</div>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>
          {closed ? 'This task is closed.' : used >= maxEntries ? 'You reached the entry limit for this task.' : pendingCount >= 3 ? 'You have 3 entries waiting for review.' : `Entries used ${used} of ${maxEntries}. Paste the link to your finished work.`}
        </div>
        <div style={{ position: 'relative' }}>
          <Link2 size={16} color={MUTED} style={{ position: 'absolute', left: 13, top: 15 }} />
          <input style={{ ...inp, paddingLeft: 38 }} placeholder="https:// link to your entry" value={url} disabled={locked} onChange={e => setUrl(e.target.value)} />
        </div>
        <textarea style={{ ...inp, minHeight: 80 }} placeholder="Message to the reviewer (optional)" value={note} disabled={locked} onChange={e => setNote(e.target.value)} />
        {msg && <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: /submitted/i.test(msg) ? '#059669' : '#DC2626' }}>{msg}</div>}
        <button type="button" style={{ ...btn, width: '100%', opacity: locked ? 0.5 : 1 }} disabled={locked || busy} onClick={submit}>{busy ? 'Submitting…' : 'Submit entry'}</button>
      </div>

      {subs.length > 0 && (
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Your entries</div>
          {subs.map((s, i) => (
            <div key={s.id} style={{ padding: '10px 0', borderTop: i ? '1px solid rgba(148,163,184,.25)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <small style={{ color: '#94a3b8' }}>{new Date(s.submitted_at).toLocaleString()}</small><Pill s={s.status} />
              </div>
              <a href={s.link} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: BLUE, wordBreak: 'break-all' }}>{s.link}</a>
              {s.feedback && <div style={{ fontSize: 12, marginTop: 6, padding: 8, borderRadius: 8, background: 'rgba(148,163,184,.14)' }}>Admin feedback: {s.feedback}</div>}
              {s.status === 'approved' && <div style={{ fontWeight: 800, color: '#059669', marginTop: 4 }}>Earned {peso(s.reward)}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
