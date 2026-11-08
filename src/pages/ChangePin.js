import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const digits = (s) => String(s).replace(/\D/g, '').slice(0, 4);
const inp = { width: '100%', padding: 13, marginBottom: 12, fontSize: 15 };

export default function ChangePin() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show } = useToast();
  const [step, setStep] = useState(1);
  const [pw, setPw] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [busy, setBusy] = useState(false);

  const verify = async () => {
    if (!user || !user.email || !pw) return show('Enter your password.');
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: user.email, password: pw });
    setBusy(false);
    if (error) return show('Wrong password.');
    setPw(''); setStep(2);
  };
  const save = async () => {
    if (!/^\d{4}$/.test(a)) return show('PIN must be 4 digits.');
    if (a !== b) return show('PINs do not match.');
    setBusy(true);
    const { data, error } = await supabase.rpc('xwallet_pin_change', { p_pin: a });
    setBusy(false);
    if (error) return show(error.message);
    if (!data.ok) { if (/password/i.test(data.error)) setStep(1); return show(data.error); }
    show('PIN changed');
    nav('/xwallet', { replace: true });
  };

  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => nav('/xwallet')}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Change PIN</h2>
      </div>
      <div className="card" style={{ padding: 16 }}>
        {step === 1 ? (<>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Confirm your account password to continue.</div>
          <input type="password" autoComplete="current-password" placeholder="Account password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') verify(); }} style={inp} />
          <button className="btn-primary" disabled={busy} onClick={verify} style={{ width: '100%', padding: 13, fontWeight: 800 }}>{busy ? 'Checking…' : 'Continue'}</button>
        </>) : (<>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Enter your new 4-digit PIN, then enter it again to confirm.</div>
          <input type="password" inputMode="numeric" autoComplete="off" placeholder="New PIN" value={a} onChange={(e) => setA(digits(e.target.value))} style={{ ...inp, letterSpacing: 10, textAlign: 'center', fontSize: 22 }} />
          <input type="password" inputMode="numeric" autoComplete="off" placeholder="Confirm new PIN" value={b} onChange={(e) => setB(digits(e.target.value))} style={{ ...inp, letterSpacing: 10, textAlign: 'center', fontSize: 22 }} />
          <button className="btn-primary" disabled={busy} onClick={save} style={{ width: '100%', padding: 13, fontWeight: 800 }}>{busy ? 'Saving…' : 'Change PIN'}</button>
        </>)}
      </div>
    </div>
  );
}
