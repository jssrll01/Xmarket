import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Building, Map, Flag,
  Gift, Heart, Settings, ChevronRight, Package, Home, ArrowLeft, Ticket
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const nav = useNavigate();
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, following: 0, extra: null });

  useEffect(() => {
    if (!user) return;
    let alive = true;
    const count = (t, col) => supabase.from(t).select('id', { count: 'exact', head: true }).eq(col, user.id).then(r => r.count || 0);
    Promise.all([
      count('orders', 'buyer_id'), count('wishlists', 'user_id'), count('seller_follows', 'user_id'),
      supabase.from('profiles').select('loyalty_points, loyalty_tier, xwallet_balance, created_at').eq('id', user.id).maybeSingle(),
    ]).then(([orders, wishlist, following, p]) => {
      if (alive) setStats({ orders, wishlist, following, extra: p.data });
    }).catch(() => {});
    return () => { alive = false; };
  }, [user]);

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
        {[['Orders', stats.orders, '/orders'], ['Wishlist', stats.wishlist, '/wishlist'], ['Following', stats.following, '/following']].map(([k, v, to]) => (
          <Link key={k} to={to} className="card" style={{ padding: '12px 8px', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>{v}</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>{k}</div>
          </Link>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
        <Link to="/rewards" className="card" style={{ padding: 14, textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Loyalty points</div>
          <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>{stats.extra?.loyalty_points ?? 0}</div>
          {stats.extra?.loyalty_tier && <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2, textTransform: 'capitalize' }}>{stats.extra.loyalty_tier} tier</div>}
        </Link>
        <Link to="/xwallet" className="card" style={{ padding: 14, textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Xwallet</div>
          <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>₱{Number(stats.extra?.xwallet_balance || 0).toFixed(2)}</div>
          {stats.extra?.created_at && <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>Member since {new Date(stats.extra.created_at).toLocaleDateString()}</div>}
        </Link>
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
      <Link to="/orders" style={menuRow}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Package size={18} color="var(--primary)" /> My orders
        </span>
        <ChevronRight size={16} color="var(--muted)" />
      </Link>
      <Link to="/vouchers" style={menuRow}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Ticket size={18} color="var(--primary)" /> Vouchers
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
