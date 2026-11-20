import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { signIn, signInWithGoogle } from '../lib/auth';
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
  const [gbusy, setGbusy] = useState(false);

  const onGoogle = async () => {
    setGbusy(true);
    const { error } = await signInWithGoogle();
    setGbusy(false);
    if (error) toast(error.message);
  };

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
      <button
        type="button"
        className="btn-primary auth-submit"
        onClick={onGoogle}
        disabled={gbusy}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', color: '#1f1f1f', border: '1px solid #dadce0', marginBottom: 16 }}
      >
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z"/><path fill="#4CAF50" d="M24 44c5.4 0 10.3-2 14-5.3l-6.5-5.3C29.4 35.1 26.8 36 24 36c-5.4 0-9.9-3.4-11.5-8.2l-6.6 5.1C9.9 39.6 16.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-2.9 5.3-5.3 6.9l6.5 5.3C39.6 37.3 44 31.3 44 24c0-1.3-.1-2.7-.4-3.5z"/></svg>
        {gbusy ? 'Connecting…' : 'Continue with Google'}
      </button>
      <div style={{ textAlign: 'center', color: 'var(--text-secondary, #888)', fontSize: 13, margin: '4px 0 16px' }}>or sign in with email</div>
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
