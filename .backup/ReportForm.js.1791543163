import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { submitReport } from '../../lib/reports';

export default function ReportForm({ category, title, description }) {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [gmail, setGmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [concern, setConcern] = useState('');
  const [relatedId, setRelatedId] = useState('');
  const [sending, setSending] = useState(false);

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
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Gmail</label>
        <input
          type="email"
          value={gmail}
          onChange={e => setGmail(e.target.value)}
          placeholder="you@gmail.com"
          style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }}
        />

        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Phone number</label>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="09XX XXX XXXX"
          style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }}
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
