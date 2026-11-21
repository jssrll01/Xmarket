import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { verifyLoginCode, resendLoginCode } from '../../lib/auth';
import { useToast } from '../Toast';
import AuthShell from './AuthShell';
import AuthField from './AuthField';

export default function LoginCode({ email, onDone, onBack }) {
  const { show: toast } = useToast();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(60);

  useEffect(() => {
    if (wait <= 0) return undefined;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const submit = async (e) => {
    e.preventDefault();
    if (code.length !== 6 || busy) return;
    setBusy(true);
    const { error } = await verifyLoginCode(email, code);
    setBusy(false);
    if (error) {
      setCode('');
      return toast(/expired|invalid/i.test(error.message || '') ? 'That code is wrong or expired. Use the newest email, or ask for a new code.' : error.message);
    }
    onDone();
  };
  const resend = async () => {
    if (wait > 0) return;
    const { error } = await resendLoginCode(email);
    if (error) return toast(error.message);
    setWait(60);
    toast('A new code was sent.');
  };

  return (
    <AuthShell
      title="Check your email"
      subtitle={'We sent a 6-digit code to ' + email}
      footer={<button type="button" onClick={onBack} style={{ background: 'none', border: 0, color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Use a different account</button>}
    >
      <form onSubmit={submit}>
        <AuthField icon={ShieldCheck} label="Verification code" type="tel" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} required />
        <button type="submit" className="btn-primary auth-submit" disabled={busy || code.length !== 6}>
          {busy ? 'Checking…' : 'Verify and sign in'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13 }}>
        <button type="button" onClick={resend} disabled={wait > 0} style={{ background: 'none', border: 0, color: 'var(--primary)', fontWeight: 700, cursor: wait > 0 ? 'default' : 'pointer', opacity: wait > 0 ? 0.6 : 1 }}>
          {wait > 0 ? 'Resend code in ' + wait + 's' : 'Resend code'}
        </button>
      </div>
    </AuthShell>
  );
}
