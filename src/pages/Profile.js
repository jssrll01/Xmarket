import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Phone, MapPin, Building, Map, Flag, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const nav = useNavigate();
  const { user, profile } = useAuth();

  if (!user) {
    return (
      <div style={{ padding: 24, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Sign in required</div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, maxWidth: 280 }}>
          Please sign in to view and edit your profile.
        </p>
        <button className="btn-primary" onClick={() => nav('/signin')} style={{ padding: '12px 28px', marginBottom: 10 }}>
          Sign in
        </button>
        <button className="btn-ghost" onClick={() => nav('/')} style={{ padding: '10px 24px' }}>
          Go home
        </button>
      </div>
    );
  }

  const Field = ({ icon: Icon, label, value }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px', borderRadius: 14,
      background: 'var(--card)', marginBottom: 10,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: 'var(--bg)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} style={{ color: 'var(--primary)' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600, letterSpacing: 0.3 }}>
          {label}
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)', marginTop: 2, wordBreak: 'break-word' }}>
          {value || '—'}
        </div>
      </div>
    </div>
  );
  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) nav(-1);
    else nav('/');
  };


  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={goBackSafe} className="icon-btn" style={{ marginBottom: 16 }}>
        <ArrowLeft size={20} />
      </button>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 32, fontWeight: 900, letterSpacing: -1,
        }}>
          {(profile?.first_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 14 }}>
          {profile?.first_name} {profile?.last_name}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
          @{profile?.username || 'user'}
        </p>
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 10px 4px' }}>
        Account
      </h3>
      <Field icon={User}    label="Username"   value={profile?.username} />
      <Field icon={Mail}    label="Email"      value={user.email} />
      <Field icon={Phone}   label="Mobile"     value={profile?.phone} />

      <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 10px 4px' }}>
        Delivery Information
      </h3>
      <Field icon={MapPin}   label="Address"   value={profile?.delivery_address} />
      <Field icon={MapPin}   label="Landmark"  value={profile?.nearest_landmark} />
      <Field icon={Flag}     label="Province"  value={profile?.province} />
      <Field icon={Building} label="City"      value={profile?.city} />
      <Field icon={Map}      label="Barangay"  value={profile?.barangay} />

      <button
        className="btn-primary"
        onClick={() => nav('/settings')}
        style={{
          width: '100%', padding: 14, marginTop: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        <Edit3 size={16} /> Edit account settings
      </button>
    </div>
  );
}
