import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck } from 'lucide-react';
import { sendResetCode, verifyResetCode, updatePassword, signOut } from '../lib/auth';
import { useToast } from '../components/Toast';
import AuthShell from '../components/auth/AuthShell';
import AuthField from '../components/auth/AuthField';
import PasswordField from '../components/auth/PasswordField';

const friendly = (m) => {
  const t = String(m || '');
  if (/rate limit|too many|only request this after|seconds/i.test(t)) return 'Too many requests. Please wait a few minutes and try again.';
  if (/expired|invalid|token/i.test(t)) return 'That code is wrong or has expired. Request a new one.';
  return t || 'Something went wrong. Please try again.';
};

export default function ForgotPassword() {
  const nav = useNavigate();
  const { show: toast } = useToast();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return undefined;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const send = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) return toast('Enter your email');
    setBusy(true);
    const { error } = await sendResetCode(email);
    setBusy(false);
    if (error) return toast(friendly(error.message));
    toast('If that email has an account, a code is on its way.');
    setWait(60); setStep(2);
  };
  const submitCode = async (e) => {
    e.preventDefault();
    if (code.length < 6) return toast('Enter the code from your email');
    setBusy(true);
    const { error } = await verifyResetCode(email, code);
    setBusy(false);
    if (error) return toast(friendly(error.message));
    setStep(3);
  };
  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast('Password must be at least 6 characters');
    if (newPassword !== confirm) return toast('Passwords do not match');
    setBusy(true);
    const { error } = await updatePassword(newPassword);
    if (error) { setBusy(false); return toast(friendly(error.message)); }
    try { await signOut(); } catch (er) { /* ignore */ }
    setBusy(false);
    toast('Password updated. Please sign in.');
    nav('/signin');
  };

  const footer = <Link to="/signin" style={{ color: 'var(--primary)', fontWeight: 700 }}>Back to sign in</Link>;
  const btn = { width: '100%', padding: 15, fontSize: 15, borderRadius: 14 };

  if (step === 1) {
    return (
      <AuthShell title="Reset password" subtitle="Enter your email to receive a code" footer={footer}>
        <form onSubmit={send}>
          <AuthField icon={Mail} label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit" className="btn-primary" disabled={busy} style={btn}>{busy ? 'Sending…' : 'Send verification code'}</button>
        </form>
      </AuthShell>
    );
  }
  if (step === 2) {
    return (
      <AuthShell title="Enter code" subtitle={'We sent a code to ' + email.trim()} footer={footer}>
        <form onSubmit={submitCode}>
          <AuthField icon={ShieldCheck} label="Verification Code" inputMode="numeric" maxLength={10} placeholder="Code from your email" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} required />
          <button type="submit" className="btn-primary" disabled={busy} style={btn}>{busy ? 'Verifying…' : 'Verify code'}</button>
        </form>
        <button type="button" disabled={wait > 0 || busy} onClick={() => send()} style={{ all: 'unset', display: 'block', textAlign: 'center', width: '100%', marginTop: 14, fontSize: 13, fontWeight: 700, color: wait > 0 ? 'var(--muted)' : 'var(--primary)', cursor: wait > 0 ? 'default' : 'pointer' }}>
          {wait > 0 ? 'Resend code in ' + wait + 's' : 'Resend code'}
        </button>
        <button type="button" onClick={() => { setStep(1); setCode(''); }} style={{ all: 'unset', display: 'block', textAlign: 'center', width: '100%', marginTop: 10, fontSize: 13, color: 'var(--muted)', cursor: 'pointer' }}>Use a different email</button>
      </AuthShell>
    );
  }
  return (
    <AuthShell title="New password" subtitle="Choose a new password" footer={footer}>
      <form onSubmit={resetPassword}>
        <PasswordField label="New Password" placeholder="At least 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <PasswordField label="Confirm Password" placeholder="Repeat the password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        <button type="submit" className="btn-primary" disabled={busy} style={btn}>{busy ? 'Updating…' : 'Update password'}</button>
      </form>
    </AuthShell>
  );
}
