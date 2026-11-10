import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import PollShare from '../../components/PollShare';
import { XF_CSS, XfSkel } from './xfUi';

export default function PollResults() {
  const nav = useNavigate();
  const [polls, setPolls] = useState(null);
  const [res, setRes] = useState({});
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('demand_polls').select('*').order('created_at', { ascending: false });
      const list = data || [];
      setPolls(list);
      const out = {};
      await Promise.all(list.map(async (p) => {
        const x = await supabase.rpc('demand_poll_results', { p_poll: p.id });
        out[p.id] = x.data || {};
      }));
      setRes(out);
    })();
  }, []);
  return (
    <div className="page-enter xf">
      <style>{XF_CSS}</style>
      <header className="xf-head">
        <button onClick={() => nav(-1)} className="icon-btn" aria-label="Back"><ArrowLeft size={20} /></button>
        <div><h1>Poll Results</h1><p>See how everyone voted.</p></div>
      </header>
      {polls === null && <XfSkel kind="polls" />}
      {polls && !polls.length && <div className="xf-card xf-empty">No polls yet.</div>}
      {(polls || []).map((p) => {
        const r = res[p.id] || {};
        const total = Object.values(r).reduce((a, b) => a + Number(b), 0);
        return (
          <div className="xf-card" key={p.id}><div className="xf-body">
            <h3>{p.question}</h3>
            {p.options.map((o, i) => {
              const c = Number(r[String(i)] || 0);
              const pct = total ? Math.round((c / total) * 100) : 0;
              return (
                <div key={i} className="xf-opt" style={{ pointerEvents: 'none' }}>
                  <i style={{ width: pct + '%' }} />
                  <span><em style={{ fontStyle: 'normal' }}>{o}</em><em style={{ fontStyle: 'normal', color: '#2563EB' }}>{c} · {pct}%</em></span>
                </div>
              );
            })}
            <div className="xf-meta" style={{ marginTop: 10 }}>{total} vote{total === 1 ? '' : 's'}</div>
            <PollShare poll={p} />
          </div></div>
        );
      })}
    </div>
  );
}
