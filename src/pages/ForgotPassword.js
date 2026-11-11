import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, KeyRound } from 'lucide-react';
import { sendResetCode, verifyResetCode, updatePassword } from '../lib/auth';
import { useToast } from '../components/Toast';
import AuthShell from '../components/auth/AuthShell';
import AuthField from '../components/auth/AuthField';
import PasswordField from '../components/auth/PasswordField';

export default function ForgotPassword() {
  const nav = useNavigate();
  const { show: toast } = useToast();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const sendCode = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await sendResetCode(email);
    setBusy(false);
    if (error) return toast(error.message);
    toast('Check your email for the code.');
    setStep(2);
  };

  const submitCode = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await verifyResetCode(email, code);
    setBusy(false);
    if (error) return toast(error.message);
    setStep(3);
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast('Password must be at least 6 characters');
    setBusy(true);
    const { error } = await updatePassword(newPassword);
    setBusy(false);
    if (error) return toast(error.message);
    toast('Password updated. Please sign in.');
    nav('/signin');
  };

  const footer = <Link to="/signin" style={{ color: 'var(--primary)', fontWeight: 700 }}>Back to sign in</Link>;

  if (step === 1) {
    return (
      <AuthShell title="Reset password" subtitle="Enter your email to receive a code" footer={footer}>
        <form onSubmit={sendCode}>
          <AuthField icon={Mail} label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <button type="submit" className="btn-primary" disabled={busy} style={{ width: '100%', padding: 15, fontSize: 15, borderRadius: 14 }}>
            {busy ? 'Sending…' : 'Send verification code'}
          </button>
        </form>
      </AuthShell>
    );
  }

  if (step === 2) {
    return (
      <AuthShell title="Enter code" subtitle={`We sent a code to ${email}`} footer={footer}>
        <form onSubmit={submitCode}>
          <AuthField icon={ShieldCheck} label="Verification Code" inputMode="numeric" placeholder="6-digit code" value={code} onChange={e => setCode(e.target.value)} required />
          <button type="submit" className="btn-primary" disabled={busy} style={{ width: '100%', padding: 15, fontSize: 15, borderRadius: 14 }}>
            {busy ? 'Verifying…' : 'Verify code'}
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="New password" subtitle="Choose a new password" footer={footer}>
      <form onSubmit={resetPassword}>
        <PasswordField label="New Password" placeholder="At least 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        <button type="submit" className="btn-primary" disabled={busy} style={{ width: '100%', padding: 15, fontSize: 15, borderRadius: 14 }}>
          {busy ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthShell>
  );
}
