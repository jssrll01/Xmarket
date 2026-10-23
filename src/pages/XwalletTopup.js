import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Upload, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { supabase } from '../lib/supabase';
import { submitTopupBilling } from '../lib/xwallet';

const PAYMENTS = [
  { id: 'gcash', label: 'GCash',
    note: 'Send payment to GCash number 09454408496 (JE*****L C.). Upload your receipt after payment. Scan the QR below.',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790593677/GCash-MyQR-28092026184016.PNG.jpg' },
  { id: 'maya', label: 'Maya',
    note: 'Send payment to Maya number 09454408496 (JE*****L C.). Upload your receipt after payment. Scan the QR below.',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790593882/myqr_1790592093301.jpg' },
  { id: 'gotyme', label: 'Bank Transfer [Gotyme]',
    note: 'Transfer to: Gotyme Bank | Account Name: Jessrell Custodio | Account No: 0152 4915 7462.',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790592841/Screenshot_20260928_183617_GoTyme_PH.jpg' },
];

const FEE_RATE = 0.01;

function InfoNote({ text }) {
  return (
    <div style={{
      marginTop: 10, padding: 10,
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 10, fontSize: 12, lineHeight: 1.5,
      display: 'flex', gap: 8, alignItems: 'flex-start',
    }}>
      <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
      <span>{text}</span>
    </div>
  );
}

export default function XwalletTopup() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const { show: showToast } = useToast();

  const amount = Number(params.get('amount')) || 0;
  const [payment, setPayment] = useState('gcash');
  const [receipt, setReceipt] = useState(null);
  const [sending, setSending] = useState(false);

  const subtotal = amount;
  const fee = +(subtotal * FEE_RATE).toFixed(2);
  const total = +(subtotal + fee).toFixed(2);
  const selected = PAYMENTS.find(p => p.id === payment);

  useEffect(() => {
    if (!user) nav('/signin', { replace: true });
  }, [user, nav]);

  const handleReceipt = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setReceipt({ name: file.name, dataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const confirm = async () => {
    if (!user) return;
    if (!receipt) { showToast('Please upload your payment receipt'); return; }
    setSending(true);
    const { data, error } = await submitTopupBilling({
      userId: user.id,
      email: user.email,
      amount: subtotal,
      payment: selected.label,
      fee,
      total,
      receipt,
    });
    setSending(false);
    if (error) { showToast(error.message); return; }
    showToast('Top-up request submitted. Awaiting admin verification.');
    nav('/xwallet');
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Top-up billing</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>
        Complete your top-up request. Once paid, upload your receipt and confirm.
      </p>

      {/* Email — locked */}
      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Email address</label>
        <input value={user?.email || ''} readOnly
          style={{ width: '100%', padding: 12, marginTop: 6, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--muted)' }} />
      </div>

      {/* Amount — locked */}
      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Amount (₱)</label>
        <input value={subtotal.toFixed(2)} readOnly
          style={{ width: '100%', padding: 12, marginTop: 6, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--muted)' }} />
      </div>

      {/* Payment method */}
      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Payment method</h3>
        {PAYMENTS.map(p => (
          <label key={p.id} style={{ display: 'block', marginBottom: 6, fontSize: 14, cursor: 'pointer' }}>
            <input type="radio" checked={payment === p.id} onChange={() => setPayment(p.id)} style={{ marginRight: 8 }} />
            {p.label}
          </label>
        ))}
        {selected && <InfoNote text={selected.note} />}
        {selected?.qr && (
          <div style={{ marginTop: 10, padding: 16, textAlign: 'center', background: 'var(--card)', borderRadius: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>SCAN TO PAY</div>
            <img src={selected.qr} alt="QR" style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }} />
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
          <span>Subtotal</span><span>₱{subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, color: 'var(--muted)' }}>
          <span>Transaction fee (1%)</span><span>₱{fee.toFixed(2)}</span>
        </div>
        <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
          <span>Total</span><span>₱{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Receipt upload */}
      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Upload payment receipt</h3>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
          Upload your payment receipt so we can verify and process your top-up.
        </div>
        <label className="btn-outline" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: 12, cursor: 'pointer', width: '100%', borderRadius: 10,
          border: '1px dashed var(--border)',
        }}>
          <Upload size={16} />
          {receipt ? receipt.name : 'Upload Payment Receipt'}
          <input type="file" accept="image/*" onChange={handleReceipt} style={{ display: 'none' }} />
        </label>
        {receipt && (
          <button onClick={() => setReceipt(null)}
            style={{ marginTop: 8, fontSize: 12, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}>
            Remove Receipt
          </button>
        )}
      </div>

      <button onClick={confirm} disabled={sending || !receipt} className="btn-primary"
        style={{
          width: '100%', padding: 14, fontSize: 15, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          opacity: (sending || !receipt) ? 0.5 : 1,
        }}>
        <CheckCircle2 size={16} />
        {sending ? 'Submitting…' : 'Confirm payment'}
      </button>
      {!receipt && (
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>
          Upload your payment receipt to enable the confirm button.
        </p>
      )}
    </div>
  );
}
