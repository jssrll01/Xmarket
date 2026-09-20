import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 12 }}>About XMARKET</h2>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 8 }}>Who We Are</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>
          XMARKET is your one-stop marketplace for great deals across electronics,
          fashion, home, beauty, and more. We connect buyers with trusted sellers
          and deliver the products you love — fast, safe, and at prices you'll enjoy.
        </p>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 8 }}>Our Mission</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>
          <span style={{ color: '#00d4ff', fontWeight: 700 }}>More Products. Lower Prices.</span>{' '}
          We aim to make online shopping accessible, affordable, and trustworthy
          for every Filipino household.
        </p>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginBottom: 8 }}>What We Offer</h3>
        <ul style={{ color: 'var(--text-dim)', fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Verified sellers and authentic products</li>
          <li>Multiple payment options (COD, GCash, Maya, Bank Transfer)</li>
          <li>Flexible delivery — Pick-up, Standard, or Express</li>
          <li>Seasonal vouchers and exclusive discounts</li>
          <li>Responsive 24-hour customer support</li>
        </ul>
      </div>
    </div>
  );
}
