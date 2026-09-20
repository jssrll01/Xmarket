import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const faqs = [
  { q: 'How do I place an order?', a: 'Add items to your cart and tap Proceed to Checkout.' },
  { q: 'What payment methods do you accept?', a: 'COD, GCash, Maya, and Bank Transfer (Gotyme, Seabank/Maribank).' },
  { q: 'How long is delivery?', a: 'Pre-order 7-14 days, Standard 3-7 days, Express 1-2 days.' },
  { q: 'Do you offer vouchers?', a: 'Yes — seasonal vouchers appear on the Home banner and inside the app.' },
  { q: 'Are the products authentic?', a: 'All sellers are verified. Look for the blue verified badge next to the store name.' },
];

export default function Help() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 12 }}>Help Center</h2>
      {faqs.map((f, i) => (
        <div key={i} className="card" style={{ padding: 14, marginBottom: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{f.q}</div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{f.a}</div>
        </div>
      ))}
    </div>
  );
}
