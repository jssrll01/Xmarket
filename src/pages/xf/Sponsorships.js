import React, { useEffect, useState } from 'react';
import HubSearch from './HubSearch';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { XF_CSS, peso, useMe, XfSkel } from './xfUi';
import TopupButton from '../../components/TopupButton';

export default function Sponsorships() {
  const nav = useNavigate();
  const { user, me, reload } = useMe();
  const [funds, setFunds] = useState(null);
  const [amt, setAmt] = useState({});
  const [msg, setMsg] = useState({});
  const [busy, setBusy] = useState('');
  const [q, setQ] = useState('');
  const hit = (s) => !q.trim() || String(s || '').toLowerCase().includes(q.trim().toLowerCase());
  const load = async () => {
    const { data } = await supabase.from('sponsor_funds').select('*').order('created_at', { ascending: false });
    setFunds(data || []);
  };
  useEffect(() => { load(); }, []);
  const give = async (f) => {
    if (!user) { nav('/signin'); return; }
    const a = Number(amt[f.id] || 0);
    if (!(a >= 5)) { setMsg({ [f.id]: { bad: true, t: 'Minimum is ₱5.' } }); return; }
    setBusy(f.id);
    const { data, error } = await supabase.rpc('sponsor_contribute', { p_fund: f.id, p_amount: a });
    setBusy('');
    if (error || !data || !data.ok) { setMsg({ [f.id]: { bad: true, t: (error && error.message) || (data && data.message) || 'Failed.' } }); return; }
    setMsg({ [f.id]: { t: 'Thank you! ' + peso(a) + ' contributed.' } });
    setAmt({ ...amt, [f.id]: '' });
    reload(); load();
  };
  return (
    <div className="page-enter xf">
      <style>{XF_CSS}</style>
      <header className="xf-head">
        <button onClick={() => nav(-1)} className="icon-btn" aria-label="Back"><ArrowLeft size={20} /></button>
        <div><h1>Sponsorships</h1><p>Help fund XMARKET projects with your Xwallet.</p></div>
      </header>
      <button type="button" onClick={() => nav('/sponsorships/donors')} style={{ width: '100%', marginBottom: 12, padding: 13, border: 0, borderRadius: 14, background: 'var(--card)', color: 'var(--primary)', boxShadow: 'var(--raised-sm)', fontWeight: 700, fontSize: 14 }}>View donors list</button>
      <div className="xf-bal"><span>Xwallet balance</span><b>{peso(me && me.xwallet_balance)}</b><TopupButton /></div>
      <HubSearch value={q} onChange={setQ} placeholder="Search sponsorships" />
      {funds === null && <XfSkel kind="fund" />}
      {funds && !funds.length && <div className="xf-card xf-empty">No fund is open right now.</div>}
      {(funds || []).filter((f) => hit((f.title || '') + ' ' + (f.project || ''))).map((f) => {
        const pct = Math.min(100, (Number(f.raised) / Number(f.target || 1)) * 100);
        const m = msg[f.id];
        return (
          <div className="xf-card" key={f.id}><div className="xf-body">
            <h3>{f.title}</h3>
            <div className="xf-bar"><i style={{ width: pct + '%' }} /></div>
            <div className="xf-row" style={{ border: 0, padding: '2px 0' }}><b style={{ color: '#1D4ED8' }}>{peso(f.raised)} raised</b><span>Target {peso(f.target)} · {Math.floor(pct)}%</span></div>
            <div className="xf-sec">
              {f.project && <><h4>Project</h4><p>{f.project}</p></>}
              {f.purpose && <><h4>Purpose</h4><p>{f.purpose}</p></>}
              {f.details && <><h4>Where the funds go</h4><p>{f.details}</p></>}
            </div>
            {f.images && f.images.length > 0 && (
              <><h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#3B82F6', margin: '14px 0 0' }}>Transparency</h4>
                <div className="xf-gal">{f.images.map((s, k) => <a key={k} href={s} target="_blank" rel="noreferrer"><img decoding="async" src={s} alt="" loading="lazy" /></a>)}</div></>
            )}
            <label className="xf-lab">Contribute (min ₱5)</label>
            <div className="xf-chips" style={{ marginTop: 0 }}>
              {[5, 10, 20, 50].map((v) => <button key={v} className={Number(amt[f.id]) === v ? 'on' : ''} onClick={() => setAmt({ ...amt, [f.id]: v })}>₱{v}</button>)}
            </div>
            <input className="xf-in" style={{ marginTop: 10 }} type="number" min="5" inputMode="decimal" placeholder="Other amount" value={amt[f.id] || ''} onChange={(e) => setAmt({ ...amt, [f.id]: e.target.value })} />
            {m && <div className={m.bad ? 'xf-warn' : 'xf-ok'}>{m.t}</div>}
            <button className="xf-btn" disabled={busy === f.id} onClick={() => give(f)}>{busy === f.id ? 'Processing…' : 'Contribute from Xwallet'}</button>
          </div></div>
        );
      })}
    </div>
  );
}
