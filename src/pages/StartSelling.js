import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Store } from 'lucide-react';

export default function StartSelling() {
  const navigate = useNavigate();
  const SELLER_URL = 'https://www.facebook.com/share/1VCD6m6rz7/';
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: '', email: '', mobile: '', address: '',
    storeName: '', products: '', categories: '', about: ''
  });
  const upd = (k, v) => setForm({ ...form, [k]: v });

  const next = () => {
    if (step === 1) {
      if (!form.fullName || !form.mobile) { alert('Please fill Full Name and Mobile Number'); return; }
    }
    if (step === 2) {
      if (!form.storeName || !form.products) { alert('Please fill Store Name and Products'); return; }
    }
    setStep(step + 1);
  };

  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 12 }}>Start Selling</h2>

      {step === 0 && (
        <div className="card" style={{ padding: 16 }}>
          <Store size={28} color="#00d4ff" />
          <h3 style={{ marginTop: 8, marginBottom: 8 }}>Open your store</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 16 }}>
            Fill in your details to apply as a seller. We'll review and reach out within 24 hours.
          </p>
          <button onClick={() => window.open(SELLER_URL, '_blank', 'noopener,noreferrer')}
            className="btn-primary" style={{ padding: '10px 20px' }}>
            Become a Seller
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ marginBottom: 12 }}>Step 1 — Your Information</h3>
          <div style={{ marginBottom: 10 }}>
            <label>Full Name *</label>
            <input value={form.fullName} onChange={e => upd('fullName', e.target.value)}
              style={{ width: '100%', padding: 10, marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Mobile Number *</label>
            <input type="tel" value={form.mobile} onChange={e => upd('mobile', e.target.value)}
              style={{ width: '100%', padding: 10, marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => upd('email', e.target.value)}
              style={{ width: '100%', padding: 10, marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Address</label>
            <input value={form.address} onChange={e => upd('address', e.target.value)}
              style={{ width: '100%', padding: 10, marginTop: 4 }} />
          </div>
          <button onClick={next} className="btn-primary" style={{ width: '100%', padding: 12 }}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ marginBottom: 12 }}>Step 2 — Proposed Products</h3>
          <div style={{ marginBottom: 10 }}>
            <label>Store Name *</label>
            <input value={form.storeName} onChange={e => upd('storeName', e.target.value)}
              style={{ width: '100%', padding: 10, marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Products You Want to Sell *</label>
            <textarea value={form.products} onChange={e => upd('products', e.target.value)}
              style={{ width: '100%', padding: 10, marginTop: 4 }} rows="3"
              placeholder="e.g. Phone accessories, home appliances..." />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Categories</label>
            <input value={form.categories} onChange={e => upd('categories', e.target.value)}
              style={{ width: '100%', padding: 10, marginTop: 4 }}
              placeholder="e.g. Electronics, Home, Fashion" />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>About Your Store</label>
            <textarea value={form.about} onChange={e => upd('about', e.target.value)}
              style={{ width: '100%', padding: 10, marginTop: 4 }} rows="3" />
          </div>
          <button onClick={next} className="btn-primary" style={{ width: '100%', padding: 12 }}>
            Submit Application
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
          <h3 style={{ marginBottom: 8 }}>Application Received</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 16 }}>
            Thank you, {form.fullName || 'Seller'}! We'll review your application and contact you soon.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '10px 24px' }}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
