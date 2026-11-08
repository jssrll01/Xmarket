import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { XF_CSS, peso, useMe, XfSkel } from './xfUi';

export default function DemandPolls() {
  const nav = useNavigate();
  const { user, me, reload } = useMe();
  const [polls, setPolls] = useState(null);
  const [mine, setMine] = useState({});
  const [res, setRes] = useState({});
  const [msg, setMsg] = useState({});
  const [fresh, setFresh] = useState({});
  const load = async () => {
    const { data } = await supabase.from('demand_polls').select('*').order('created_at', { ascending: false });
    const list = data || [];
    if (user) {
      const v = await supabase.from('demand_poll_votes').select('poll_id,option_index').eq('user_id', user.id);
      const m = {}; (v.data || []).forEach((x) => { m[x.poll_id] = x.option_index; });
      setMine(m);
    }
    setPolls(list);
    const r = {};
    for (const p of list) { const x = await supabase.rpc('demand_poll_results', { p_poll: p.id }); r[p.id] = x.data || {}; }
    setRes(r);
  };
  // eslint-disable-next-line
  useEffect(() => { load(); }, [user && user.id]);
  const vote = async (p, i) => {
    if (!user) { nav('/signin'); return; }
    const { data, error } = await supabase.rpc('vote_demand_poll', { p_poll: p.id, p_option: i });
    if (error || !data || !data.ok) { setMsg({ ...msg, [p.id]: { bad: true, t: (error && error.message) || (data && data.message) || 'Vote failed.' } }); return; }
    setFresh((f) => ({ ...f, [p.id]: true }));
    setMsg({ ...msg, [p.id]: { t: 'Thanks for voting! ' + peso(data.reward) + ' added to your Xwallet.' } });
    reload(); load();
  };
  return (
    <div className="page-enter xf">
      <style>{XF_CSS}</style>
      <header className="xf-head">
        <button onClick={() => nav(-1)} className="icon-btn" aria-label="Back"><ArrowLeft size={20} /></button>
        <div><h1>Demand Polls</h1><p>Vote on what XMARKET should add. Earn Xwallet rewards.</p></div>
      </header>
      <div className="xf-bal"><span>Xwallet balance</span><b>{peso(me && me.xwallet_balance)}</b></div>
      {polls === null && <XfSkel kind="polls" />}
      {polls && !polls.length && <div className="xf-card xf-empty">No active polls right now.</div>}
      {polls && polls.length > 0 && !polls.some((p) => mine[p.id] === undefined || fresh[p.id]) && <div className="xf-card xf-empty">You have voted on all polls. New polls will show up here.</div>}
      {(polls || []).filter((p) => mine[p.id] === undefined || fresh[p.id]).map((p) => {
        const voted = mine[p.id] !== undefined;
        const r = res[p.id] || {};
        const total = Object.values(r).reduce((a, b) => a + Number(b), 0);
        const m = msg[p.id];
        return (
          <div className="xf-card" key={p.id}><div className="xf-body">
            <div className="xf-meta">Earn {peso(p.reward)} for voting</div>
            <h3>{p.question}</h3>
            {p.description && <p>{p.description}</p>}
            {p.options.map((o, i) => {
              const c = Number(r[String(i)] || 0);
              const pct = total ? Math.round((c / total) * 100) : 0;
              return (
                <button key={i} className={'xf-opt' + (mine[p.id] === i ? ' mine' : '')} disabled={voted} onClick={() => vote(p, i)}>
                  {voted && <i style={{ width: pct + '%' }} />}
                  <span><em style={{ fontStyle: 'normal' }}>{o}{mine[p.id] === i ? ' ✓' : ''}</em>{voted && <em style={{ fontStyle: 'normal', color: '#2563EB' }}>{pct}%</em>}</span>
                </button>
              );
            })}
            <div className="xf-meta" style={{ marginTop: 10 }}>{total} vote{total === 1 ? '' : 's'}</div>
            {m && <div className={m.bad ? 'xf-warn' : 'xf-ok'}>{m.t}</div>}
          </div></div>
        );
      })}
    </div>
  );
}
