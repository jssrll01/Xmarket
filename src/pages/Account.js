import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User as UserIcon, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Account() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || '');
  const [saving, setSaving] = useState(false);

  if (!user) {
    nav('/signin');
    return null;
  }

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName },
    });
    setSaving(false);
    if (error) showToast(error.message);
    else showToast('Profile updated');
  };

  const sendPasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    if (error) showToast(error.message);
    else showToast('Password reset email sent');
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Account settings</h2>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Email</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <Mail size={14} color="var(--muted)" />
          {user.email}
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>First name</label>
        <input value={firstName} onChange={e => setFirstName(e.target.value)}
          style={{ width: '100%', padding: 10, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />
        <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Last name</label>
        <input value={lastName} onChange={e => setLastName(e.target.value)}
          style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />
        <button onClick={save} disabled={saving} className="btn-primary"
          style={{ width: '100%', padding: 12, marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Save size={14} /> {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Lock size={14} /> Password
        </div>
        <button onClick={sendPasswordReset} className="btn-ghost"
          style={{ width: '100%', padding: 12, fontSize: 13 }}>
          Send password reset email
        </button>
      </div>
    </div>
  );
}
