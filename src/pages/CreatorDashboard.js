import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Users, Clock, TrendingUp, Wallet, ChevronRight, ClipboardList, Link2, Calendar, CheckCircle2, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BLUE, MUTED, peso, card, inp, btn, ghost, circBtn, Pill, IconBox, StatCard, Sk, SkStyle, PageSkeleton, copyText, initials } from './creatorUi';

const TABS = [['overview', 'Overview'], ['tasks', 'Tasks'], ['history', 'Content History'], ['earnings', 'Earnings']];

function Bars({ data }) {
  if (!data.length) return null;
  const max = Math.max(1, ...data.map(d => Number(d.amount)));
  const w = 300 / data.length;
  return (
    <svg viewBox="0 0 300 92" style={{ width: '100%', height: 130 }}>
      {data.map((d, i) => {
        const h = Math.max((Number(d.amount) / max) * 70, 1.5);
        return (
          <rect key={d.day} x={i * w + 1} y={80 - h} width={Math.max(1, w - 2)} height={h} rx="2" fill={BLUE} opacity={Number(d.amount) > 0 ? 1 : 0.18}>
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

const NavRow = ({ icon, title, sub, onClick, first }) => (
  <button type="button" onClick={onClick} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 12, padding: '12px 0', background: 'none', border: 'none', borderTop: first ? 'none' : '1px solid rgba(148,163,184,.25)', textAlign: 'left', cursor: 'pointer', color: 'inherit' }}>
    <IconBox icon={icon} />
    <span style={{ flex: 1 }}><b style={{ fontSize: 14 }}>{title}</b><br /><small style={{ color: MUTED }}>{sub}</small></span>
    <ChevronRight size={18} color={MUTED} />
  </button>
);

export default function CreatorDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState('overview');
  const [d, setD] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [subs, setSubs] = useState([]);
  const [wds, setWds] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState('');
  const refKey = useRef(null);

  const load = useCallback(async () => {
    const [a, t, s, w] = await Promise.all([
      supabase.rpc('creator_dashboard'),
      supabase.rpc('creator_tasks_list'),
      supabase.rpc('creator_my_submissions'),
      supabase.from('creator_withdrawals').select('*').order('created_at', { ascending: false }).limit(50),
    ]);
    setD(a.data); setTasks(t.data || []); setSubs(s.data || []); setWds(w.data || []); setLoaded(true);
  }, []);
  useEffect(() => { load(); }, [load]);

  if (!loaded) return <PageSkeleton />;
  if (!d || !d.ok) return <div style={{ padding: 24 }}>{(d && d.error) || 'Creator access required.'}</div>;

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

  const name = d.profile.name || d.profile.username;
  const good = /copied|Transferred/.test(msg);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <div style={{ borderRadius: 24, padding: 18, marginBottom: 14, color: '#fff', background: 'linear-gradient(135deg,#1D4ED8 0%,#2563EB 45%,#60A5FA 100%)', boxShadow: '0 16px 40px rgba(37,99,235,.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button type="button" aria-label="Back" onClick={() => nav('/profile')} style={circBtn}><ArrowLeft size={18} /></button>
          <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: 0.4 }}>Creator Studio</div>
          <button type="button" aria-label="Notifications" onClick={() => nav('/notifications')} style={circBtn}><Bell size={18} /></button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{initials(name)}</div>
          <div><div style={{ fontWeight: 800 }}>{name}</div><div style={{ fontSize: 12, opacity: 0.85 }}>@{d.profile.username} · {d.code}</div></div>
        </div>
        <div style={{ marginTop: 16, fontSize: 12, opacity: 0.85 }}>Available earnings</div>
        <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1 }}>{peso(d.balance)}</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>Lifetime {peso(d.lifetime)}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button type="button" onClick={() => { setTab('earnings'); setMsg(''); }} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: '#fff', color: BLUE, fontWeight: 800, cursor: 'pointer' }}>Withdraw</button>
          <button type="button" onClick={copyLink} style={{ flex: 1, padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,.5)', background: 'rgba(255,255,255,.15)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Copy link</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 2, overflowX: 'auto', marginBottom: 14, borderBottom: '1px solid rgba(148,163,184,.3)' }}>
        {TABS.map(([id, label]) => (
          <button key={id} type="button" onClick={() => { setTab(id); setMsg(''); }} style={{ background: 'none', border: 'none', padding: '10px 14px', whiteSpace: 'nowrap', fontWeight: 800, fontSize: 13, cursor: 'pointer', color: tab === id ? BLUE : MUTED, borderBottom: '3px solid ' + (tab === id ? BLUE : 'transparent') }}>{label}</button>
        ))}
      </div>
      {msg && <div style={{ ...card, padding: 12, fontSize: 13, fontWeight: 700, color: good ? '#059669' : '#DC2626' }}>{msg}</div>}

      {tab === 'overview' && (<>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <StatCard icon={CheckCircle2} label="Successful referrals" value={d.successful} accent="#059669" />
          <StatCard icon={Clock} label="Pending referrals" value={d.pending} accent="#F59E0B" />
          <StatCard icon={TrendingUp} label="Total commissions" value={peso(d.commissions)} />
          <StatCard icon={Wallet} label="Task earnings" value={peso(d.task_earnings)} accent="#7C3AED" />
        </div>
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Performance</div>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>Commissions, last 30 days</div>
          <Bars data={d.series || []} />
        </div>
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>Your referral link</div>
          <div style={{ fontSize: 12, wordBreak: 'break-all', background: 'rgba(148,163,184,.14)', padding: 10, borderRadius: 12, marginBottom: 10 }}>{refLink}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" style={{ ...btn, flex: 1 }} onClick={copyLink}>Copy Referral Link</button>
            <button type="button" aria-label="Share" style={{ ...ghost, padding: '0 16px' }} onClick={share}><Share2 size={16} /></button>
          </div>
        </div>
        <div style={{ ...card, paddingTop: 4, paddingBottom: 4 }}>
          <NavRow first icon={Users} title="Referral dashboard" sub="Pending, successful and commissions" onClick={() => nav('/creator-studio/referrals')} />
          <NavRow icon={ClipboardList} title="Browse tasks" sub="Join tasks and earn rewards" onClick={() => setTab('tasks')} />
          <NavRow icon={ClipboardList} title="New post" sub="Post to XMARKET Socials, once per day" onClick={() => nav('/creator-studio/post')} />
          <NavRow icon={Bell} title="Notifications" sub="Approvals, commissions and updates" onClick={() => nav('/notifications')} />
        </div>
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>Creator profile</div>
          {[['Username', d.profile.username], ['Name', d.profile.name], ['Email', d.profile.email], ['Phone', d.profile.phone]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0' }}><span style={{ color: MUTED }}>{k}</span><span>{v || '—'}</span></div>
          ))}
        </div>
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Recent activity</div>
          {(d.activity || []).length === 0 && <div style={{ fontSize: 13, color: MUTED }}>No activity yet.</div>}
          {(d.activity || []).map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderTop: i ? '1px solid rgba(148,163,184,.25)' : 'none' }}>
              <span>{a.label}<br /><small style={{ color: '#94a3b8' }}>{new Date(a.at).toLocaleString()}</small></span>
              <b style={{ color: Number(a.amount) >= 0 ? '#059669' : '#DC2626' }}>{Number(a.amount) >= 0 ? '+' : ''}{peso(a.amount)}</b>
            </div>
          ))}
        </div>
      </>)}

      {tab === 'tasks' && (<>
        {tasks.map(t => {
          const isRef = t.kind === 'referral';
          const closed = t.deadline && new Date(t.deadline) < new Date();
          return (
            <div key={t.id} style={card}>
              <div style={{ display: 'flex', gap: 12 }}>
                <IconBox icon={isRef ? Users : ClipboardList} color={isRef ? '#059669' : BLUE} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <b style={{ fontSize: 15 }}>{t.title}</b>
                    <b style={{ fontSize: 13, color: BLUE, whiteSpace: 'nowrap' }}>{isRef ? 'Commission' : peso(t.reward)}</b>
                  </div>
                  <p style={{ fontSize: 13, color: MUTED, margin: '4px 0 8px' }}>{t.description}</p>
                  {t.deadline && <div style={{ fontSize: 11, color: closed ? '#DC2626' : MUTED, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}><Calendar size={12} /> {closed ? 'Closed' : 'Until'} {new Date(t.deadline).toLocaleDateString()}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isRef
                      ? <button type="button" style={btn} onClick={() => nav('/creator-studio/referrals')}>Referral</button>
                      : <button type="button" style={{ ...btn, opacity: closed ? 0.5 : 1 }} disabled={closed} onClick={() => nav('/creator-studio/tasks/' + t.id)}>{t.my_status ? 'View task' : 'Participate'}</button>}
                    {t.my_status && <Pill s={t.my_status} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {tasks.length === 0 && <div style={{ ...card, textAlign: 'center', color: MUTED }}>No tasks available right now. Check back soon.</div>}
      </>)}

      {tab === 'history' && (<>
        {subs.length === 0 && <div style={{ ...card, textAlign: 'center', color: MUTED }}>No entries yet. Join a task to get started.</div>}
        {subs.map(s => (
          <div key={s.id} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <b style={{ fontSize: 15 }}>{s.title}</b><Pill s={s.status} />
            </div>
            <div style={{ fontSize: 12, color: MUTED, margin: '4px 0' }}>{s.description}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Submitted {new Date(s.submitted_at).toLocaleString()}</div>
            {s.link && <a href={s.link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: BLUE, wordBreak: 'break-all', marginTop: 8 }}><Link2 size={14} />{s.link}</a>}
            {s.content && <p style={{ fontSize: 13, margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{s.content}</p>}
            {s.feedback && <div style={{ fontSize: 12, marginTop: 8, padding: 10, borderRadius: 10, background: 'rgba(148,163,184,.14)' }}><b>Admin feedback:</b> {s.feedback}</div>}
            {s.status === 'approved' && <div style={{ fontSize: 14, fontWeight: 800, color: '#059669', marginTop: 8 }}>Earned {peso(s.reward)}</div>}
          </div>
        ))}
      </>)}

      {tab === 'earnings' && (<>
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2 }}>Withdraw to Xwallet</div>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>Available {peso(d.balance)} · minimum ₱50 · instant transfer</div>
          <input style={inp} type="number" inputMode="decimal" placeholder="Amount (₱)" value={amount} onChange={e => setAmount(e.target.value)} />
          <button type="button" style={{ ...btn, width: '100%' }} disabled={busy} onClick={withdraw}>{busy ? 'Processing…' : 'Withdraw'}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <StatCard icon={TrendingUp} label="Lifetime earnings" value={peso(d.lifetime)} />
          <StatCard icon={Wallet} label="Total withdrawn" value={peso(d.withdrawn)} accent="#059669" />
        </div>
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Withdrawal history</div>
          {wds.length === 0 && <div style={{ fontSize: 13, color: MUTED }}>No withdrawals yet.</div>}
          {wds.map((w, i) => (
            <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderTop: i ? '1px solid rgba(148,163,184,.25)' : 'none' }}>
              <span>To Xwallet<br /><small style={{ color: '#94a3b8' }}>{new Date(w.created_at).toLocaleString()}</small></span>
              <b>-{peso(w.amount)}</b>
            </div>
          ))}
        </div>
      </>)}
    </div>
  );
}
