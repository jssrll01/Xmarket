import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const BLUE = '#2563EB';
const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const card = { background: 'var(--card, #fff)', border: '1px solid var(--border, #e2e8f0)', borderRadius: 16, padding: 16, marginBottom: 12 };
const inp = { width: '100%', padding: 11, marginBottom: 10, borderRadius: 10, border: '1px solid var(--border, #cbd5e1)', fontSize: 14, boxSizing: 'border-box' };
const btn = { padding: '11px 16px', borderRadius: 10, border: 'none', background: BLUE, color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' };
const ghost = { ...btn, background: 'transparent', color: BLUE, border: '1px solid ' + BLUE };
const COLORS = { pending: '#F59E0B', approved: '#10B981', rejected: '#DC2626' };
const TABS = [['overview', 'Overview'], ['tasks', 'Tasks'], ['studio', 'Content Studio'], ['earnings', 'Earnings']];

export const copyText = async (t) => {
  try { await navigator.clipboard.writeText(t); return true; } catch (e) {
    try {
      const el = document.createElement('textarea'); el.value = t; document.body.appendChild(el); el.select();
      const ok = document.execCommand('copy'); document.body.removeChild(el); return ok;
    } catch (e2) { return false; }
  }
};

function Stat({ label, value, accent }) {
  return (
    <div style={{ ...card, marginBottom: 0, padding: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: accent || 'inherit' }}>{value}</div>
    </div>
  );
}

function Bars({ data }) {
  if (!data.length) return null;
  const max = Math.max(1, ...data.map(d => Number(d.amount)));
  const w = 300 / data.length;
  return (
    <svg viewBox="0 0 300 92" style={{ width: '100%', height: 120 }}>
      {data.map((d, i) => {
        const h = Math.max((Number(d.amount) / max) * 70, 1);
        return (
          <rect key={d.day} x={i * w + 1} y={80 - h} width={Math.max(1, w - 2)} height={h} rx="1.5" fill={BLUE} opacity={Number(d.amount) > 0 ? 1 : 0.15}>
            <title>{d.day}: {peso(d.amount)}</title>
          </rect>
        );
      })}
      <line x1="0" y1="80.5" x2="300" y2="80.5" stroke="#cbd5e1" strokeWidth="0.5" />
      <text x="0" y="90" fontSize="6" fill="#94a3b8">{String(data[0].day).slice(5)}</text>
      <text x="300" y="90" fontSize="6" fill="#94a3b8" textAnchor="end">{String(data[data.length - 1].day).slice(5)}</text>
    </svg>
  );
}

const Pill = ({ s }) => (
  <span style={{ color: '#fff', background: COLORS[s] || '#64748b', borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>{s}</span>
);

export default function CreatorDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState('overview');
  const [d, setD] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [subs, setSubs] = useState([]);
  const [wds, setWds] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const refKey = useRef(null);

  const load = useCallback(async () => {
    const [a, t, s, w] = await Promise.all([
      supabase.rpc('creator_dashboard'),
      supabase.rpc('creator_tasks_list'),
      supabase.rpc('creator_my_submissions'),
      supabase.from('creator_withdrawals').select('*').order('created_at', { ascending: false }).limit(50),
    ]);
    setD(a.data); setTasks(t.data || []); setSubs(s.data || []); setWds(w.data || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  if (!d) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!d.ok) return <div style={{ padding: 24 }}>{d.error || 'Creator access required.'}</div>;

  const refLink = window.location.origin + '/xwallet?ref=' + d.code;
  const copyLink = async () => setMsg((await copyText(refLink)) ? 'Referral link copied.' : 'Could not copy. Long-press the link to copy.');
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: 'XMARKET', text: 'Join XMARKET with my code ' + d.code, url: refLink }); } catch (e) { /* cancelled */ } }
    else copyLink();
  };

  const withdraw = async () => {
    if (busy) return; setMsg('');
    const amt = Number(amount);
    if (!(amt >= 50)) return setMsg('Minimum withdrawal is ₱50.');
    if (amt > Number(d.balance)) return setMsg('Amount exceeds your available balance.');
    if (!refKey.current) refKey.current = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
    setBusy(true);
    const { data, error } = await supabase.rpc('creator_withdraw', { p_amount: amt, p_ref: refKey.current });
    setBusy(false);
    if (error) return setMsg(error.message);
    if (!data.ok) { refKey.current = null; return setMsg(data.error); }
    refKey.current = null; setAmount(''); setMsg('Transferred to your Xwallet.'); load();
  };

  const submitTask = async () => {
    if (busy) return; setMsg(''); setBusy(true);
    const { data, error } = await supabase.rpc('creator_submit_task', { p_task_id: taskId, p_content: content, p_link: url });
    setBusy(false);
    if (error) return setMsg(error.message);
    if (!data.ok) return setMsg(data.error);
    setTaskId(null); setContent(''); setUrl(''); setMsg('Submitted for review.'); load(); setTab('studio');
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <button type="button" onClick={() => nav('/profile')} style={{ background: 'none', border: 'none', color: BLUE, fontWeight: 800, padding: 0, marginBottom: 10, cursor: 'pointer' }}>← Back</button>
      <div style={{ ...card, background: 'linear-gradient(135deg,#2563EB,#60A5FA)', color: '#fff', border: 'none' }}>
        <div style={{ fontSize: 12, opacity: 0.85 }}>Creator Studio</div>
        <div style={{ fontSize: 13, marginTop: 6, opacity: 0.9 }}>Available earnings</div>
        <div style={{ fontSize: 32, fontWeight: 800 }}>{peso(d.balance)}</div>
        <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>Lifetime {peso(d.lifetime)} · Code <b>{d.code}</b></div>
      </div>

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 12 }}>
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => { setTab(id); setMsg(''); }} style={{ ...btn, whiteSpace: 'nowrap', background: tab === id ? BLUE : 'transparent', color: tab === id ? '#fff' : '#64748b', border: '1px solid ' + (tab === id ? BLUE : '#cbd5e1') }}>{label}</button>
        ))}
      </div>
      {msg && <div style={{ ...card, padding: 10, fontSize: 13, color: /copied|Transferred|Submitted/.test(msg) ? '#059669' : '#DC2626' }}>{msg}</div>}

      {tab === 'overview' && (<>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <Stat label="Successful referrals" value={d.successful} accent="#059669" />
          <Stat label="Pending referrals" value={d.pending} accent="#F59E0B" />
          <Stat label="Total commissions" value={peso(d.commissions)} />
          <Stat label="Task earnings" value={peso(d.task_earnings)} />
        </div>
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Commissions, last 30 days</div>
          <Bars data={d.series || []} />
        </div>
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>Creator tools</div>
          <div style={{ fontSize: 12, wordBreak: 'break-all', background: 'rgba(148,163,184,.15)', padding: 10, borderRadius: 10, marginBottom: 10 }}>{refLink}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ ...btn, flex: 1 }} onClick={copyLink}>Copy Referral Link</button>
            <button style={{ ...ghost, flex: 1 }} onClick={share}>Share</button>
          </div>
          <button style={{ ...ghost, width: '100%', marginTop: 8 }} onClick={() => nav('/creator-studio/referrals')}>Open referral dashboard</button>
        </div>
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>Creator profile</div>
          {[['Username', d.profile.username], ['Name', d.profile.name], ['Email', d.profile.email], ['Phone', d.profile.phone]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}><span style={{ color: '#64748b' }}>{k}</span><span>{v || '—'}</span></div>
          ))}
        </div>
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Recent activity</div>
          {(d.activity || []).length === 0 && <div style={{ fontSize: 13, color: '#64748b' }}>No activity yet.</div>}
          {(d.activity || []).map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderTop: i ? '1px solid rgba(148,163,184,.25)' : 'none' }}>
              <span>{a.label}<br /><small style={{ color: '#94a3b8' }}>{new Date(a.at).toLocaleString()}</small></span>
              <b style={{ color: Number(a.amount) >= 0 ? '#059669' : '#DC2626' }}>{Number(a.amount) >= 0 ? '+' : ''}{peso(a.amount)}</b>
            </div>
          ))}
        </div>
      </>)}

      {tab === 'tasks' && (<>
        {tasks.map(t => (
          <div key={t.id} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ fontWeight: 800 }}>{t.title}</div>
              <span style={{ fontSize: 12, fontWeight: 800, color: BLUE }}>{t.kind === 'referral' ? 'Commission' : peso(t.reward)}</span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', margin: '6px 0 10px' }}>{t.description}</p>
            {t.kind === 'referral'
              ? <button style={btn} onClick={() => nav('/creator-studio/referrals')}>Referral</button>
              : <button style={btn} onClick={() => { setTaskId(t.id); setMsg(''); }}>Submit content</button>}
            {taskId === t.id && (
              <div style={{ marginTop: 12 }}>
                <textarea style={{ ...inp, minHeight: 80 }} placeholder="Describe your content (optional)" value={content} onChange={e => setContent(e.target.value)} />
                <input style={inp} placeholder="https:// link to your post or video" value={url} onChange={e => setUrl(e.target.value)} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ ...btn, flex: 1 }} disabled={busy} onClick={submitTask}>{busy ? 'Submitting…' : 'Submit'}</button>
                  <button style={{ ...ghost, flex: 1 }} onClick={() => setTaskId(null)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {tasks.length === 0 && <div style={card}>No tasks available.</div>}
      </>)}

      {tab === 'studio' && (<>
        {subs.length === 0 && <div style={card}>No submissions yet. Pick a task to get started.</div>}
        {subs.map(s => (
          <div key={s.id} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <div style={{ fontWeight: 800 }}>{s.title}</div><Pill s={s.status} />
            </div>
            <div style={{ fontSize: 12, color: '#64748b', margin: '4px 0' }}>{s.description}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Submitted {new Date(s.submitted_at).toLocaleString()}</div>
            {s.content && <p style={{ fontSize: 13, margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{s.content}</p>}
            {s.link && <a href={s.link} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: BLUE, wordBreak: 'break-all' }}>{s.link}</a>}
            {s.feedback && <div style={{ fontSize: 12, marginTop: 8, padding: 8, borderRadius: 8, background: 'rgba(148,163,184,.15)' }}>Admin feedback: {s.feedback}</div>}
            {s.status === 'approved' && <div style={{ fontSize: 13, fontWeight: 800, color: '#059669', marginTop: 6 }}>Earned {peso(s.reward)}</div>}
          </div>
        ))}
      </>)}

      {tab === 'earnings' && (<>
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>Withdraw to Xwallet</div>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>Available {peso(d.balance)} · minimum ₱50 · instant transfer</div>
          <input style={inp} type="number" inputMode="decimal" placeholder="Amount (₱)" value={amount} onChange={e => setAmount(e.target.value)} />
          <button style={{ ...btn, width: '100%' }} disabled={busy} onClick={withdraw}>{busy ? 'Processing…' : 'Withdraw'}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <Stat label="Lifetime earnings" value={peso(d.lifetime)} />
          <Stat label="Total withdrawn" value={peso(d.withdrawn)} />
        </div>
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Withdrawal history</div>
          {wds.length === 0 && <div style={{ fontSize: 13, color: '#64748b' }}>No withdrawals yet.</div>}
          {wds.map(w => (
            <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderTop: '1px solid rgba(148,163,184,.25)' }}>
              <span>To Xwallet<br /><small style={{ color: '#94a3b8' }}>{new Date(w.created_at).toLocaleString()}</small></span>
              <b>-{peso(w.amount)}</b>
            </div>
          ))}
        </div>
      </>)}
    </div>
  );
}
