import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { CardListSkeleton } from '../components/Skeleton';

export default function YtGate({ children }) {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [ok, setOk] = useState(null);
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { nav('/signin', { replace: true }); return; }
    setOk(false);
  }, [user, loading, nav]);

  const submit = async (e) => {
    e.preventDefault();
    if (busy || pin.length !== 6) return;
    setBusy(true); setErr('');
    const { data, error } = await supabase.rpc('yt_pin_check', { p_pin: pin });
    setBusy(false); setPin('');
    if (error || !data) { setErr('Could not check the PIN. Try again.'); return; }
    if (data.ok) setOk(true); else setErr(data.error || 'Wrong PIN.');
  };

  if (loading || ok === null) return <div style={{ padding: 16 }}><CardListSkeleton count={2} /></div>;
  if (ok) return children;
  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <button className="icon-btn" aria-label="Back" onClick={() => (window.history.state && window.history.state.idx > 0 ? nav(-1) : nav('/digital-hub', { replace: true }))} style={{ marginBottom: 12 }}><ArrowLeft size={20} /></button>
      <form onSubmit={submit} className="card" style={{ padding: 24, textAlign: 'center' }}>
        <Lock size={34} color="var(--primary)" />
        <div style={{ fontWeight: 800, fontSize: 18, margin: '10px 0 6px' }}>YouTube Premium</div>
        <div style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 14 }}>Enter the 6-digit PIN to continue.</div>
        <input type="password" inputMode="numeric" autoComplete="off" maxLength={6} value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} aria-label="PIN"
          style={{ width: '100%', height: 48, textAlign: 'center', fontSize: 22, letterSpacing: 8, border: 'none', borderRadius: 14, background: 'var(--card)', color: 'var(--text)', boxShadow: 'var(--inset)' }} />
        {err && <div style={{ color: '#d33', fontSize: 13, marginTop: 10 }}>{err}</div>}
        <button className="btn-primary" type="submit" disabled={busy || pin.length !== 6} style={{ width: '100%', padding: 13, fontWeight: 800, marginTop: 14 }}>{busy ? 'Checking...' : 'Unlock'}</button>
      </form>
    </div>
  );
}
