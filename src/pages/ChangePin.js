import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Delete, Lock, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const CSS = `
.cp{padding:16px 16px 40px;max-width:480px;margin:0 auto}
.cp-head{display:flex;align-items:center;gap:12px;margin-bottom:18px}
.cp-card{background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:20px;box-shadow:0 18px 30px -24px rgba(37,99,235,.5);animation:cpUp .4s cubic-bezier(.2,.8,.2,1) both}
.cp-steps{display:flex;gap:6px;margin-bottom:18px}
.cp-steps i{flex:1;height:5px;border-radius:99px;background:#DBEAFE;overflow:hidden;position:relative}
.cp-steps i.on::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#60A5FA,#2563EB);animation:cpFill .5s ease both}
.cp-ic{width:56px;height:56px;border-radius:18px;background:#EFF6FF;border:1px solid #BFDBFE;color:#2563EB;display:flex;align-items:center;justify-content:center;margin:0 auto 12px}
.cp h3{text-align:center;font-size:18px;font-weight:800}
.cp p{text-align:center;font-size:13px;color:#64748B;margin:6px 0 16px;line-height:1.5}
.cp-in{width:100%;padding:13px 14px;border-radius:12px;border:1px solid #CBD5E1;font-size:15px;margin-bottom:10px}
.cp-in:focus{outline:none;border-color:#3B82F6;box-shadow:0 0 0 3px rgba(59,130,246,.18)}
.cp-in.bad{border-color:#F87171}
.cp-dots{display:flex;justify-content:center;gap:14px;margin:6px 0 20px}
.cp-dots b{width:54px;height:62px;border-radius:16px;border:2px solid #BFDBFE;background:#F8FAFF;display:flex;align-items:center;justify-content:center;transition:all .18s}
.cp-dots b.f{border-color:#2563EB;background:#EFF6FF}
.cp-dots b.f::after{content:"";width:14px;height:14px;border-radius:50%;background:#2563EB;animation:cpPop .2s ease both}
.cp-dots.err{animation:cpShake .35s}
.cp-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.cp-pad button{height:56px;border-radius:16px;border:1px solid #E2E8F0;background:#fff;font-size:21px;font-weight:700;color:#0F172A;display:flex;align-items:center;justify-content:center;transition:transform .12s,background .15s}
.cp-pad button:active{transform:scale(.94);background:#EFF6FF}
.cp-pad button.x{border:none;background:transparent;color:#64748B}
.cp-btn{width:100%;padding:14px;border-radius:14px;background:linear-gradient(135deg,#3B82F6,#2563EB);color:#fff;font-weight:700;font-size:14.5px;box-shadow:0 10px 20px -12px rgba(37,99,235,.75);transition:transform .15s,opacity .2s}
.cp-btn:disabled{opacity:.5}.cp-btn:not(:disabled):active{transform:scale(.98)}
.cp-ok{text-align:center;padding:24px 0}
.cp-ok .ic{width:72px;height:72px;border-radius:50%;background:#16A34A;color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;animation:cpPop .45s ease both}
@keyframes cpUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes cpFill{from{transform:translateX(-100%)}to{transform:none}}
@keyframes cpPop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
@keyframes cpShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
@media(prefers-reduced-motion:reduce){.cp *{animation:none!important;transition:none!important}}
`;

export default function ChangePin() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show } = useToast();
  const [step, setStep] = useState(1);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const [done, setDone] = useState(false);

  const back = () => { if (window.history.length > 1) nav(-1); else nav('/settings', { replace: true }); };

  const verify = async () => {
    if (!user || !user.email) return show('Please sign in again.');
    if (!pw || !pw2) return show('Enter your password twice.');
    if (pw !== pw2) return show('The two passwords do not match.');
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: user.email, password: pw });
    setBusy(false);
    if (error) return show('Wrong password.');
    setPw(''); setPw2(''); setStep(2);
  };

  const save = async (first, second) => {
    setBusy(true);
    const { data, error } = await supabase.rpc('xwallet_pin_change', { p_pin: first });
    setBusy(false);
    if (error) { setB(''); return show(error.message); }
    if (!data.ok) { setB(''); if (/password/i.test(data.error)) setStep(1); return show(data.error); }
    setDone(true);
    setTimeout(back, 1400);
  };

  const press = (d) => {
    if (busy || done) return;
    if (step === 2) {
      const n = (a + d).slice(0, 4); setA(n);
      if (n.length === 4) setTimeout(() => setStep(3), 180);
    } else if (step === 3) {
      const n = (b + d).slice(0, 4); setB(n);
      if (n.length === 4) {
        if (n !== a) {
          setErr(true); show('PINs do not match. Try again.');
          setTimeout(() => { setErr(false); setB(''); }, 400);
        } else save(a, n);
      }
    }
  };
  const del = () => { if (step === 2) setA(a.slice(0, -1)); else if (step === 3) setB(b.slice(0, -1)); };
  useEffect(() => {
    if (step !== 2 && step !== 3) return undefined;
    const h = (e) => { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') del(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const val = step === 2 ? a : b;
  const pwBad = pw2 && pw !== pw2;
  return (
    <div className="page-enter cp">
      <style>{CSS}</style>
      <div className="cp-head">
        <button className="icon-btn" aria-label="Back" onClick={back}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Change PIN</h2>
      </div>
      <div className="cp-card">
        <div className="cp-steps"><i className="on" /><i className={step >= 2 ? 'on' : ''} /><i className={step >= 3 ? 'on' : ''} /></div>
        {done ? (
          <div className="cp-ok"><div className="ic"><Check size={36} /></div><h3>PIN changed</h3><p>Your new PIN is ready to use.</p></div>
        ) : step === 1 ? (<>
          <div className="cp-ic"><Lock size={26} /></div>
          <h3>Verify it's you</h3>
          <p>Enter your account password twice to continue.</p>
          <input className="cp-in" type="password" autoComplete="current-password" placeholder="Account password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <input className={'cp-in' + (pwBad ? ' bad' : '')} type="password" autoComplete="current-password" placeholder="Confirm account password" value={pw2} onChange={(e) => setPw2(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') verify(); }} />
          {pwBad && <div style={{ color: '#DC2626', fontSize: 12.5, marginBottom: 8 }}>Passwords do not match.</div>}
          <button className="cp-btn" disabled={busy || !pw || pw !== pw2} onClick={verify}>{busy ? 'Checking…' : 'Continue'}</button>
        </>) : (<>
          <div className="cp-ic"><ShieldCheck size={26} /></div>
          <h3>{step === 2 ? 'Create new PIN' : 'Confirm new PIN'}</h3>
          <p>{step === 2 ? 'Choose a 4-digit PIN for your Xwallet.' : 'Enter the same PIN again.'}</p>
          <div className={'cp-dots' + (err ? ' err' : '')}>{[0, 1, 2, 3].map((i) => <b key={i} className={i < val.length ? 'f' : ''} />)}</div>
          <div className="cp-pad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => <button key={d} onClick={() => press(d)}>{d}</button>)}
            <button className="x" onClick={() => { if (step === 3) { setB(''); setStep(2); setA(''); } }} aria-label="Start over" style={{ fontSize: 12.5 }}>{step === 3 ? 'Start over' : ''}</button>
            <button onClick={() => press('0')}>0</button>
            <button className="x" onClick={del} aria-label="Delete"><Delete size={22} /></button>
          </div>
        </>)}
      </div>
    </div>
  );
}
