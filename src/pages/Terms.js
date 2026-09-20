import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const sections = [
  { h: '1. Acceptance of Terms', p: 'By using XMARKET, you agree to these terms and all applicable laws. If you do not agree, please discontinue use of the platform.' },
  { h: '2. Orders & Payments', p: 'All orders are subject to availability and confirmation of payment. Prices and availability are subject to change without notice.' },
  { h: '3. Shipping & Delivery', p: 'Delivery timelines depend on the method selected — Pick-up, Standard, or Express. Delays caused by couriers or unforeseen events are outside our control.' },
  { h: '4. Prohibited Use', p: 'You agree not to misuse the platform, engage in fraudulent activity, or attempt to disrupt our services or those of other users.' },
  { h: '5. Intellectual Property', p: 'All content, logos, and materials on XMARKET are owned by us or our partners and may not be reproduced without permission.' },
  { h: '6. Changes to Terms', p: 'We may update these terms at any time. Continued use of the platform after changes means you accept the updated terms.' },
];

export default function Terms() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 12 }}>Terms & Conditions</h2>
      {sections.map((s, i) => (
        <div key={i} className="card" style={{ padding: 14, marginBottom: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{s.h}</div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>{s.p}</div>
        </div>
      ))}
    </div>
  );
}
