import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { signIn } from '../lib/auth';
import { useToast } from '../components/Toast';
import AuthShell from '../components/auth/AuthShell';
import AuthField from '../components/auth/AuthField';
import PasswordField from '../components/auth/PasswordField';

export default function SignIn() {
  const nav = useNavigate();
  const { show: toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) return toast(error.message);
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
        <button
          type="submit"
          className="btn-primary"
          disabled={busy}
          style={{ width: '100%', padding: 15, fontSize: 15, borderRadius: 14 }}
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
}
