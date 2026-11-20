import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { signOut } from '../lib/auth';
import { useToast } from '../components/Toast';
import AuthShell from '../components/auth/AuthShell';
import AuthField from '../components/auth/AuthField';

const friendly = (m) => {
  const t = String(m || '');
  if (/rate limit|too many|only request this after|seconds/i.test(t)) return 'Too many requests. Please wait a minute and try again.';
  if (/expired|invalid|token/i.test(t)) return 'That code is wrong or has expired. Request a new one.';
  return t || 'Something went wrong. Please try again.';
};

export default function VerifyEmail() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { show: toast } = useToast();
  const [email, setEmail] = useState((params.get('email') || '').trim().toLowerCase());
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(60);
  const hasEmail = !!params.get('email');

  useEffect(() => {
    if (wait <= 0) return undefined;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const verify = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast('Enter your email');
    if (code.length < 6) return toast('Enter the code from your email');
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code, type: 'signup' });
    if (error) { setBusy(false); return toast(friendly(error.message)); }
    try { await signOut(); } catch (er) { /* ignore */ }
    setBusy(false);
    toast('Email verified. Please sign in.');
    nav('/signin');
  };
  const resend = async () => {
    if (!email.trim()) return toast('Enter your email');
    setBusy(true);
    const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim().toLowerCase() });
    setBusy(false);
    if (error) return toast(friendly(error.message));
    toast('A new code is on its way.');
    setWait(60);
  };

  const footer = <Link to="/signin" style={{ color: 'var(--primary)', fontWeight: 700 }}>Back to sign in</Link>;
  const btn = { width: '100%', padding: 15, fontSize: 15, borderRadius: 14 };
  return (
    <AuthShell title="Verify your email" subtitle={hasEmail ? 'We sent a code to ' + email : 'Enter your email and the code we sent'} footer={footer}>
      <form onSubmit={verify}>
        {!hasEmail && <AuthField icon={Mail} label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />}
        <AuthField icon={ShieldCheck} label="Verification Code" inputMode="numeric" maxLength={10} placeholder="Code from your email" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} required />
        <button type="submit" className="btn-primary" disabled={busy} style={btn}>{busy ? 'Verifying…' : 'Verify email'}</button>
      </form>
      <button type="button" disabled={wait > 0 || busy} onClick={resend} style={{ all: 'unset', display: 'block', textAlign: 'center', width: '100%', marginTop: 14, fontSize: 13, fontWeight: 700, color: wait > 0 ? 'var(--muted)' : 'var(--primary)', cursor: wait > 0 ? 'default' : 'pointer' }}>
        {wait > 0 ? 'Resend code in ' + wait + 's' : 'Resend code'}
      </button>
    </AuthShell>
  );
}
