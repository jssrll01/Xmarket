import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { XF_CSS, peso, XfSkel } from './xfUi';

export default function SponsorDonors() {
  const nav = useNavigate();
  const [funds, setFunds] = useState(null);
  const [fund, setFund] = useState(null);
  const [rows, setRows] = useState(null);
  useEffect(() => {
    supabase.from('sponsor_funds').select('id,title').order('created_at', { ascending: false }).then(({ data }) => {
      const l = data || []; setFunds(l); if (l[0]) setFund(l[0].id);
    });
  }, []);
  useEffect(() => {
    if (!fund) return;
    setRows(null);
    supabase.rpc('sponsor_donors', { p_fund: fund }).then(({ data }) => {
      const l = Array.isArray(data) ? data.slice() : [];
      l.sort((a, b) => Number(b.total) - Number(a.total));
      setRows(l);
    });
  }, [fund]);
  return (
    <div className="page-enter xf">
      <style>{XF_CSS}</style>
      <header className="xf-head">
        <button onClick={() => nav(-1)} className="icon-btn" aria-label="Back"><ArrowLeft size={20} /></button>
        <div><h1>Donors</h1><p>Highest contribution first.</p></div>
      </header>
      {funds === null && <XfSkel kind="fund" />}
      {funds && !funds.length && <div className="xf-card xf-empty">No fund is open right now.</div>}
      {funds && funds.length > 1 && (
        <div className="xf-chips" style={{ marginBottom: 12 }}>
          {funds.map((f) => <button key={f.id} className={fund === f.id ? 'on' : ''} onClick={() => setFund(f.id)}>{f.title}</button>)}
        </div>
      )}
      {fund && rows === null && <XfSkel kind="fund" />}
      {rows && !rows.length && <div className="xf-card xf-empty">No donors yet. Be the first.</div>}
      {rows && rows.length > 0 && (
        <div className="xf-card"><div className="xf-body">
          {rows.map((d, i) => (
            <div className="xf-row" key={i}>
              <span><b style={{ display: 'inline-block', width: 26, color: '#64748B' }}>{i + 1}</b>@{d.username}</span>
              <b style={{ color: '#1D4ED8' }}>{peso(d.total)}</b>
            </div>
          ))}
        </div></div>
      )}
    </div>
  );
}
