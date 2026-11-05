import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Clock, Lock, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CreatorDashboard from './CreatorDashboard';
import { BLUE, MUTED, card, inp, btn, circBtn, IconBox, Sk, SkStyle } from './creatorUi';

const lbl = { fontSize: 12, fontWeight: 700, color: MUTED };

export default function CreatorStudio() {
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const { data: d } = await supabase.rpc('creator_my_application');
    setData(d); setLoaded(true);
  }, []);
  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault(); setMsg('');
    if (!pw) return setMsg('Enter your XMARKET password.');
    if (pw !== pw2) return setMsg('Passwords do not match.');
    setBusy(true);
    const { data: r, error } = await supabase.rpc('creator_submit_application', { p_password: pw });
    setBusy(false);
    if (error) return setMsg(error.message);
    if (!r.ok) return setMsg(r.error);
    setPw(''); setPw2(''); load();
  };

  const wrap = { maxWidth: 520, margin: '0 auto', padding: 16 };
  const head = (
    <div style={{ borderRadius: 24, padding: 18, marginBottom: 14, color: '#fff', background: 'linear-gradient(135deg,#1D4ED8 0%,#2563EB 45%,#60A5FA 100%)', boxShadow: '0 16px 40px rgba(37,99,235,.35)' }}>
      <button type="button" aria-label="Back" onClick={() => nav('/profile')} style={circBtn}><ArrowLeft size={18} /></button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 24, fontWeight: 800 }}><Sparkles size={22} /> Creator Studio</div>
      <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Earn commissions and task rewards with XMARKET.</div>
    </div>
  );

  if (!loaded) return (
    <div style={wrap}><SkStyle /><Sk h={130} r={24} style={{ marginBottom: 14 }} /><Sk h={420} r={18} /></div>
  );
  if (!data) return <div style={{ padding: 24 }}>Please sign in to continue.</div>;
  const p = data.profile || {}; const a = data.application;

  if (a && a.status === 'approved') return <CreatorDashboard />;

  if (a && a.status === 'pending') return (
    <div style={wrap}>{head}
      <div style={{ ...card, textAlign: 'center', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><IconBox icon={Clock} color="#F59E0B" size={56} /></div>
        <h3 style={{ margin: '14px 0 6px' }}>Application pending</h3>
        <p style={{ margin: 0, color: MUTED }}>Please wait for verification.</p>
      </div>
    </div>
  );
  if (a && a.status === 'suspended') return (
    <div style={wrap}>{head}
      <div style={{ ...card, textAlign: 'center', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><IconBox icon={Lock} color="#6B7280" size={56} /></div>
        <h3 style={{ margin: '14px 0 6px' }}>Access suspended</h3>
        {a.note && <p style={{ margin: 0, color: MUTED }}>{a.note}</p>}
      </div>
    </div>
  );

  return (
    <div style={wrap}>{head}
      {a && a.status === 'rejected' && (
        <div style={{ ...card, borderColor: '#DC2626', display: 'flex', gap: 12 }}>
          <IconBox icon={AlertCircle} color="#DC2626" />
          <div><b style={{ color: '#DC2626' }}>Application rejected</b>{a.note && <p style={{ margin: '4px 0 0', fontSize: 13 }}>{a.note}</p>}<p style={{ margin: '4px 0 0', fontSize: 12, color: MUTED }}>You can apply again below.</p></div>
        </div>
      )}
      <form style={card} onSubmit={submit}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>Creator application</div>
        {[['Username', p.username], ['First name', p.first_name], ['Last name', p.last_name], ['Account ID', p.account_id], ['Phone', p.phone], ['Email', p.email]].map(([k, v]) => (
          <div key={k}><label style={lbl}>{k}</label><input style={{ ...inp, marginTop: 4, background: 'rgba(148,163,184,.14)' }} value={v || ''} readOnly /></div>
        ))}
        <label style={lbl}>XMARKET password</label>
        <input style={{ ...inp, marginTop: 4 }} type="password" autoComplete="current-password" value={pw} onChange={e => setPw(e.target.value)} />
        <label style={lbl}>Confirm password</label>
        <input style={{ ...inp, marginTop: 4 }} type="password" autoComplete="current-password" value={pw2} onChange={e => setPw2(e.target.value)} />
        {msg && <p style={{ color: '#DC2626', fontSize: 13, fontWeight: 700, margin: '0 0 10px' }}>{msg}</p>}
        <button style={{ ...btn, width: '100%', padding: 14 }} disabled={busy} type="submit">{busy ? 'Submitting…' : 'Submit Details'}</button>
        <p style={{ fontSize: 11, color: MUTED, textAlign: 'center', margin: '10px 0 0' }}>Your password is only used to verify your identity and is never stored.</p>
      </form>
    </div>
  );
}
