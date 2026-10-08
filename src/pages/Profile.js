import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Building, Map, Flag,
  Gift, Heart, Settings, ChevronRight, Package, Home, ArrowLeft, Ticket
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const nav = useNavigate();
  const { user, profile } = useAuth();

  if (!user) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Sign in required</div>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>
          Please sign in to view your profile.
        </p>
        <button className="btn-primary" onClick={() => nav('/signin')} style={{ padding: '10px 24px' }}>
          Sign in
        </button>
      </div>
    );
  }

  const name = profile?.first_name || user.user_metadata?.first_name || user.email?.split('@')[0] || 'User';
  const initial = name.charAt(0).toUpperCase();

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
        <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 2, wordBreak: 'break-word' }}>
          {value || '—'}
        </div>
      </div>
    </div>
  );

  const menuRow = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', marginBottom: 8, borderRadius: 12,
    background: 'var(--card)', textDecoration: 'none', color: 'inherit',
    fontSize: 14, fontWeight: 600, border: '1px solid var(--border)',
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 26, fontWeight: 800,
        }}>
          {initial}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>
            {profile?.first_name} {profile?.last_name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{user.email}</div>
        </div>
        <button
          onClick={() => nav('/')}
          className="icon-btn"
          aria-label="Back to Home"
          style={{ flexShrink: 0 }}
        >
          <Home size={20} />
        </button>
      </div>

      {/* Account info */}
      <h3 style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 10px 4px' }}>
        Account
      </h3>
      <Field icon={User} label="Username" value={profile?.username} />
      <Field icon={Mail} label="Email" value={user.email} />
      <Field icon={Phone} label="Mobile" value={profile?.phone} />

      {/* Address */}
      <h3 style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 10px 4px' }}>
        Delivery Information
      </h3>
      <Field icon={MapPin} label="Address" value={profile?.delivery_address} />
      <Field icon={MapPin} label="Landmark" value={profile?.nearest_landmark} />
      <Field icon={Flag} label="Province" value={profile?.province} />
      <Field icon={Building} label="City" value={profile?.city} />
      <Field icon={Map} label="Barangay" value={profile?.barangay} />

      {/* Menu links */}
      <h3 style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 10px 4px' }}>
        More
      </h3>
      <Link to="/wishlist" style={menuRow}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Heart size={18} color="var(--primary)" /> Wishlist
        </span>
        <ChevronRight size={16} color="var(--muted)" />
      </Link>
      <Link to="/rewards" style={menuRow}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Gift size={18} color="var(--primary)" /> Loyalty Points
        </span>
        <ChevronRight size={16} color="var(--muted)" />
      </Link>
      <Link to="/following" style={menuRow}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <User size={18} color="var(--primary)" /> Following
        </span>
        <ChevronRight size={16} color="var(--muted)" />
      </Link>
      <Link to="/account" style={menuRow}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Settings size={18} color="var(--primary)" /> Account settings
        </span>
        <ChevronRight size={16} color="var(--muted)" />
      </Link>
    </div>
  );
}
