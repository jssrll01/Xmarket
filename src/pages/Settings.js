import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Return to Home Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'transparent',
          border: '1px solid #333',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontSize: '14px'
        }}
      >
        <ArrowLeft size={18} />
        Return to Home
      </button>

      <h1 style={{ color: '#fff', marginBottom: '20px' }}>Settings</h1>
      
      {/* Your existing settings content goes below */}
      <div style={{ color: '#aaa' }}>
        <p>Manage your account and app preferences here.</p>
      </div>
    </div>
  );
}
