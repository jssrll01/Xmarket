import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const sections = [
  { h: 'Information We Collect', p: 'Name, contact details, and delivery address.' },
  { h: 'How We Use It', p: 'To process orders, provide customer support, and improve our services.' },
  { h: 'Sharing', p: 'We share data only with sellers and delivery partners as needed to fulfill orders.' },
  { h: 'Third-Party Links', p: 'Our platform may link to third-party sites. We are not responsible for their privacy practices.' },
  { h: 'Children\'s Privacy', p: 'XMARKET is not intended for children under 13. We do not knowingly collect data from them.' },
  { h: 'Updates to this Policy', p: 'We may update this policy from time to time. Continued use implies acceptance of the updated version.' },
];

export default function Privacy() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 12 }}>Privacy Policy</h2>
      {sections.map((s, i) => (
        <div key={i} className="card" style={{ padding: 14, marginBottom: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{s.h}</div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>{s.p}</div>
        </div>
      ))}
    </div>
  );
}
