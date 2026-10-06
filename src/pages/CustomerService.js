import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone, Mail, Send } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function CustomerService() {
  const navigate = useNavigate();
  const { show: showToast } = useToast();
  const [form, setForm] = useState({ email: '', concern: '' });
  const [sending, setSending] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.email.trim() || !form.concern.trim()) {
      showToast('Please fill in all fields');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ email: '', concern: '' });
      showToast('Your message has been sent');
    }, 900);
  };

  return (
    <div style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ marginBottom: 6 }}>Customer Service</h2>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
        We are here to help you with orders, payments, returns, and account concerns.
      </p>

      <div className="card" style={{ padding: 14, marginBottom: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
        <MessageCircle size={20} />
        <div>
          <div style={{ fontWeight: 700 }}>Live Chat</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Response within 24 hours</div>
        </div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Phone size={20} />
        <div>
          <div style={{ fontWeight: 700 }}>Call Support</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>+63 9454408496</div>
        </div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Mail size={20} />
        <div>
          <div style={{ fontWeight: 700 }}>Email Us</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>xmarket_official@gmail.com</div>
        </div>
      </div>

      <h3 style={{ marginBottom: 10, fontSize: 15 }}>Send Us a Message</h3>

      <div className="card" style={{ padding: 16 }}>
        <label>Email Address</label>
        <input
          type="email"
          value={form.email}
          onChange={e => upd('email', e.target.value)}
          placeholder="you@example.com"
          style={{ width: '100%', padding: 12, marginTop: 4, marginBottom: 12 }}
        />

        <label>Your Concern</label>
        <textarea
          value={form.concern}
          onChange={e => upd('concern', e.target.value)}
          placeholder="Tell us what you need help with..."
          rows="5"
          style={{ width: '100%', padding: 12, marginTop: 4, marginBottom: 12 }}
        />

        <button
          onClick={submit}
          disabled={sending}
          className="btn-primary"
          style={{
            width: '100%', padding: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
        >
          {sending ? (
            <>
              <span className="spinner" /> Sending...
            </>
          ) : (
            <>
              <Send size={16} /> Send Message
            </>
          )}
        </button>
      </div>
    </div>
  );
}
