import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Save, Trash2, AlertTriangle } from 'lucide-react';
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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);

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

  const deleteAccount = async () => {
    if (deleteInput !== 'DELETE') {
      showToast('Type DELETE to confirm');
      return;
    }
    setDeleting(true);
    try {
      // Soft-delete: mark profile as deleted + sign out
      await supabase.from('profiles').update({ deleted_at: new Date().toISOString() }).eq('id', user.id);
      await supabase.auth.signOut();
      showToast('Account scheduled for deletion');
      nav('/');
    } catch (err) {
      showToast(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
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

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Lock size={14} /> Password
        </div>
        <button onClick={sendPasswordReset} className="btn-ghost"
          style={{ width: '100%', padding: 12, fontSize: 13 }}>
          Send password reset email
        </button>
      </div>

      <div className="card" style={{ padding: 16, border: '1px solid #FEE2E2' }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, color: '#DC2626' }}>
          <AlertTriangle size={14} /> Danger zone
        </div>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)}
            style={{
              width: '100%', padding: 12, fontSize: 13, fontWeight: 600,
              background: 'none', border: '1px solid #DC2626', color: '#DC2626',
              borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
            <Trash2 size={14} /> Delete account
          </button>
        ) : (
          <>
            <p style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: 1.6, marginBottom: 10 }}>
              This will mark your account for deletion. Orders and history will be removed within 30 days. This cannot be undone.
            </p>
            <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
              Type <b style={{ color: '#DC2626' }}>DELETE</b> to confirm
            </label>
            <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
              placeholder="DELETE"
              style={{ width: '100%', padding: 10, marginTop: 6, marginBottom: 10, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setConfirmDelete(false); setDeleteInput(''); }}
                className="btn-ghost" style={{ flex: 1, padding: 12, fontSize: 13 }}>
                Cancel
              </button>
              <button onClick={deleteAccount} disabled={deleting || deleteInput !== 'DELETE'}
                style={{
                  flex: 1, padding: 12, fontSize: 13, fontWeight: 700, borderRadius: 10,
                  background: deleteInput === 'DELETE' ? '#DC2626' : 'var(--border)',
                  color: '#fff', border: 'none', cursor: deleteInput === 'DELETE' ? 'pointer' : 'not-allowed',
                  opacity: deleting ? 0.6 : 1,
                }}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
