import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { signIn } from '../lib/auth';
import GoogleButton from '../components/auth/GoogleButton';
import { useToast } from '../components/Toast';
import AuthShell from '../components/auth/AuthShell';
import AuthField from '../components/auth/AuthField';
import PasswordField from '../components/auth/PasswordField';
import Captcha from '../components/auth/Captcha';

export default function SignIn() {
  const nav = useNavigate();
  const { show: toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [cap, setCap] = useState('');
  const capRef = useRef(null);
  const onGoogleDone = () => { toast('Welcome!'); nav('/'); };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!cap) return toast('Please complete the security check');
    setBusy(true);
    const { error } = await signIn(email, password, cap);
    setBusy(false);
    if (error) { if (capRef.current) capRef.current.reset(); return toast(error.message); }
    toast('Welcome back!');
    nav('/');
  };

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
      <div style={{ textAlign: 'center', color: 'var(--text-secondary, #888)', fontSize: 13, margin: '16px 0 12px' }}>or</div>
      <GoogleButton onDone={onGoogleDone} onError={(m) => toast(m)} />
    </AuthShell>
  );
}
