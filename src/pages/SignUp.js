import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone,
} from 'lucide-react';
import { signUp, signIn } from '../lib/auth';
import { useToast } from '../components/Toast';
import AuthShell from '../components/auth/AuthShell';
import AuthField from '../components/auth/AuthField';
import PasswordField from '../components/auth/PasswordField';
import Captcha from '../components/auth/Captcha';

export default function SignUp() {
  const nav = useNavigate();
  const { show: toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [cap, setCap] = useState('');
  const capRef = useRef(null);
  const [form, setForm] = useState({
    username: '', firstName: '', lastName: '',
    email: '', phone: '', password: '', confirm: '',
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast('Passwords do not match');
    if (form.password.length < 6) return toast('Password must be at least 6 characters');
    if (!cap) return toast('Please complete the security check');
    setBusy(true);
    const { data, error } = await signUp(form, cap);
    setBusy(false);
    if (error) { if (capRef.current) capRef.current.reset(); return toast(error.message); }
    if (!data || !data.session) {
      const r = await signIn(form.email, form.password);
      if (r.error) { toast('Account created. Please sign in.'); nav('/signin'); return; }
    }
    toast('Account created. Welcome to XMARKET!');
    nav('/');
  };


  return (
    <AuthShell
      title="Create account"
      subtitle="Join XMARKET and start shopping"
      footer={<>Already have an account? <Link to="/signin" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign in</Link></>}
    >
      <form onSubmit={onSubmit}>
<fieldset disabled={busy} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <AuthField icon={User} label="Username" placeholder="Choose a username" value={form.username} onChange={set('username')} required />
        <div className="auth-row">
          <AuthField icon={User} label="First Name" placeholder="Juan" value={form.firstName} onChange={set('firstName')} required />
          <AuthField icon={User} label="Last Name" placeholder="Dela Cruz" value={form.lastName} onChange={set('lastName')} required />
        </div>
        <AuthField icon={Mail} label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
        <AuthField icon={Phone} label="Mobile Number" type="tel" placeholder="09XX XXX XXXX" value={form.phone} onChange={set('phone')} required />
        <PasswordField label="Password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} required />
        <PasswordField label="Confirm Password" placeholder="Re-enter your password" value={form.confirm} onChange={set('confirm')} required />
        <Captcha ref={capRef} onToken={setCap} />
        <button
          type="submit"
          className="btn-primary auth-submit"
          disabled={busy || !cap}
          
        >
          {busy ? (<span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><style>{'@keyframes xmspin{to{transform:rotate(360deg)}}'}</style><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'xmspin .7s linear infinite' }} />Creating account…</span>) : 'Create account'}
        </button>
</fieldset>
      </form>
    </AuthShell>
  );
}
