import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import CreatorDashboard from './CreatorDashboard';

const box = { background: 'var(--card, #fff)', border: '1px solid var(--border, #e2e8f0)', borderRadius: 16, padding: 18, marginBottom: 14 };
const inp = { width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border, #cbd5e1)', fontSize: 14, boxSizing: 'border-box' };
const lbl = { fontSize: 12, fontWeight: 700, color: 'var(--muted, #64748b)' };
const btn = { width: '100%', padding: 13, borderRadius: 12, border: 'none', background: '#2563EB', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' };

export default function CreatorStudio() {
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const { data: d } = await supabase.rpc('creator_my_application');
    setData(d); setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!pw) return setMsg('Enter your XMARKET password.');
    if (pw !== pw2) return setMsg('Passwords do not match.');
    setBusy(true);
    const { data: r, error } = await supabase.rpc('creator_submit_application', { p_password: pw });
    setBusy(false);
    if (error) return setMsg(error.message);
    if (!r.ok) return setMsg(r.error);
    setPw(''); setPw2('');
    load();
  };

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!data) return <div style={{ padding: 24 }}>Please sign in to continue.</div>;
  const p = data.profile || {}; const a = data.application;

  const wrap = { maxWidth: 520, margin: '0 auto', padding: 16 };
  const head = (<>
    <button type="button" onClick={() => nav('/profile')} style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 800, padding: 0, cursor: 'pointer' }}>← Back</button>
    <h2 style={{ fontSize: 22, fontWeight: 800, margin: '4px 0 14px' }}>Creator Studio</h2>
  </>);

  if (a && a.status === 'pending') return (
    <div style={wrap}>{head}<div style={box}><h3 style={{ marginTop: 0 }}>Application pending</h3><p>Please wait for verification.</p></div></div>
  );
  if (a && a.status === 'approved') return <CreatorDashboard />;
  // eslint-disable-next-line no-constant-condition
  if (false) return (
    <div style={wrap}>{head}<div style={box}><h3 style={{ marginTop: 0 }}>Approved</h3>
      <p>Your referral code: <b>{a.referral_code}</b></p>
      <p style={{ color: 'var(--muted, #64748b)', fontSize: 13 }}>The dashboard is coming in the next update.</p></div></div>
  );
  if (a && a.status === 'suspended') return (
    <div style={wrap}>{head}<div style={box}><h3 style={{ marginTop: 0 }}>Access suspended</h3>{a.note && <p>{a.note}</p>}</div></div>
  );

  return (
    <div style={wrap}>{head}
      {a && a.status === 'rejected' && (
        <div style={{ ...box, borderColor: '#DC2626' }}><b style={{ color: '#DC2626' }}>Application rejected.</b>{a.note && <p style={{ margin: '6px 0 0' }}>{a.note}</p>}<p style={{ margin: '6px 0 0', fontSize: 13 }}>You can apply again below.</p></div>
      )}
      <form style={box} onSubmit={submit}>
        {[['Username', p.username], ['First name', p.first_name], ['Last name', p.last_name], ['Account ID', p.account_id], ['Phone', p.phone], ['Email', p.email]].map(([k, v]) => (
          <div key={k}><label style={lbl}>{k}</label><input style={{ ...inp, background: 'rgba(148,163,184,.15)' }} value={v || ''} readOnly /></div>
        ))}
        <label style={lbl}>XMARKET password</label>
        <input style={inp} type="password" autoComplete="current-password" value={pw} onChange={e => setPw(e.target.value)} />
        <label style={lbl}>Confirm password</label>
        <input style={inp} type="password" autoComplete="current-password" value={pw2} onChange={e => setPw2(e.target.value)} />
        {msg && <p style={{ color: '#DC2626', fontSize: 13, margin: '0 0 10px' }}>{msg}</p>}
        <button style={btn} disabled={busy} type="submit">{busy ? 'Submitting…' : 'Submit Details'}</button>
      </form>
    </div>
  );
}
