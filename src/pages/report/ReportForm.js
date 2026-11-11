import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { submitReport } from '../../lib/reports';
import { supabase } from '../../lib/supabase'; // adjust path if needed

export default function ReportForm({ category, title, description }) {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [gmail, setGmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [concern, setConcern] = useState('');
  const [relatedId, setRelatedId] = useState('');
  const [sending, setSending] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Autofill gmail + phone from the user's profile
  useEffect(() => {
    if (!user?.id) return;
    let alive = true;
    (async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('email, phone')
          .eq('id', user.id)
          .single();
        if (!alive) return;
        if (data?.email) setGmail(data.email);
        if (data?.phone) setPhone(data.phone);
      } catch (e) {
        // non-fatal — fall back to auth email
      } finally {
        if (alive) setProfileLoaded(true);
      }
    })();
    return () => { alive = false; };
  }, [user?.id]);

  if (!user) {
    nav('/signin');
    return null;
  }

  const submit = async () => {
    if (!gmail.trim() || !phone.trim() || concern.trim().length < 10) {
      showToast('Fill gmail, phone, and a concern (10+ characters)');
      return;
    }
    setSending(true);
    const { error } = await submitReport({
      userId: user.id,
      category,
      gmail: gmail.trim(),
      phone: phone.trim(),
      concern: concern.trim(),
      relatedId: relatedId.trim() || null,
    });
    setSending(false);
    if (error) { showToast(error.message); return; }
    showToast('Report submitted');
    nav('/my-reports');
  };

  const readonlyInput = {
    width: '100%',
    padding: 12,
    marginTop: 6,
    marginBottom: 12,
    borderRadius: 10,
    border: '1px solid var(--border)',
    fontSize: 14,
    background: '#F3F4F6',
    color: '#6B7280',
    cursor: 'not-allowed',
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{title}</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>
        {description}
      </p>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>
          Gmail <span style={{ fontWeight: 500, opacity: 0.7 }}>(from your account)</span>
        </label>
        <input
          type="email"
          value={gmail}
          readOnly
          disabled
          placeholder={profileLoaded ? 'No email on file' : 'Loading…'}
          style={readonlyInput}
        />

        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>
          Phone number <span style={{ fontWeight: 500, opacity: 0.7 }}>(from your account)</span>
        </label>
        <input
          type="tel"
          value={phone}
          readOnly
          disabled
          placeholder={profileLoaded ? 'No phone on file' : 'Loading…'}
          style={readonlyInput}
        />

        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Related ID (optional)</label>
        <input
          type="text"
          value={relatedId}
          onChange={e => setRelatedId(e.target.value)}
          placeholder="Order #, product, shop name, etc."
          style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }}
        />

        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Your concern</label>
        <textarea
          value={concern}
          onChange={e => setConcern(e.target.value)}
          placeholder="Describe the issue in detail…"
          style={{ width: '100%', padding: 12, marginTop: 6, minHeight: 140, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }}
        />
      </div>

      <button
        onClick={submit}
        disabled={sending}
        className="btn-primary"
        style={{ width: '100%', padding: 14, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: sending ? 0.6 : 1 }}
      >
        <Send size={16} /> {sending ? 'Submitting…' : 'Submit report'}
      </button>
    </div>
  );
}
