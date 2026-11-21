import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { signIn } from '../lib/auth';
import { useToast } from '../components/Toast';
import AuthShell from '../components/auth/AuthShell';
import AuthField from '../components/auth/AuthField';
import PasswordField from '../components/auth/PasswordField';
import Captcha from '../components/auth/Captcha';
import LoginCode from '../components/auth/LoginCode';

export default function SignIn() {
  const nav = useNavigate();
  const { show: toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState('pw');
  const [cap, setCap] = useState('');
  const capRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!cap) return toast('Please complete the security check');
    setBusy(true);
    const { error, needsCode } = await signIn(email, password, cap);
    setBusy(false);
    if (error) { if (capRef.current) capRef.current.reset(); return toast(error.message); }
    if (needsCode) { setStep('code'); return; }
    toast('Welcome back!');
    nav('/');
  };

  if (step === 'code') {
    return <LoginCode email={email.trim().toLowerCase()} onBack={() => { setStep('pw'); setCap(''); }} onDone={() => { toast('Welcome back!'); nav('/'); }} />;
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back to XMARKET"
      footer={<>Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create one</Link></>}
    >
      <form onSubmit={onSubmit}>
        <AuthField
          icon={Mail}
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <PasswordField
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
          <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700 }}>
            Forgot password?
          </Link>
        </div>
        <Captcha ref={capRef} onToken={setCap} />
        <button
          type="submit"
          className="btn-primary auth-submit"
          disabled={busy || !cap}
          
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
}
