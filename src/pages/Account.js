import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Save, ShieldCheck, BadgeCheck, Package, Heart,
  Sparkles, Wallet, Pencil,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Account() {
  const nav = useNavigate();
  const { user, profile: authProfile } = useAuth();
  const { show: showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, points: 0 });
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Redirect if not signed in
  useEffect(() => {
    if (!user) nav('/signin', { replace: true });
  }, [user, nav]);

  // load profile + counts
  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      setLoading(true);
      const [{ data: p }, { count: orderCount }, { count: wishCount }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('buyer_id', user.id),
        supabase.from('wishlists').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);
      if (!alive) return;
      setProfile(p || null);
      setStats({
        orders: orderCount || 0,
        wishlist: wishCount || 0,
        points: Number(p?.loyalty_points) || 0,
      });
      setFirstName(p?.first_name || user.user_metadata?.first_name || '');
      setLastName(p?.last_name || user.user_metadata?.last_name || '');
      setPhone(p?.phone || '');
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user]);

  if (!user) return null;

  const initials = ((firstName || user.email || '?').trim()[0] || '?').toUpperCase();

  const save = async () => {
    setSaving(true);
    // update both auth metadata + profiles row
    await supabase.auth.updateUser({ data: { first_name: firstName, last_name: lastName } });
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      phone,
      email: user.email,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) showToast?.(error.message);
    else {
      showToast?.('Profile updated');
      setEditing(false);
      setProfile((prev) => ({ ...(prev || {}), first_name: firstName, last_name: lastName, phone }));
    }
  };

  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) nav(-1);
    else nav('/');
  };

  const verified = !!profile?.status && profile.status === 'active' && profile?.loyalty_tier;

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={goBackSafe} className="icon-btn"><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, flex: 1 }}>Account</h2>
      </div>

      {/* Identity hero */}
      <div className="acc-hero">
        <div className="acc-hero-glow" />
        <div className="acc-avatar">
          <span>{initials}</span>
        </div>
        <div className="acc-hero-info">
          <div className="acc-hero-name">
            {(firstName || lastName) ? `${firstName} ${lastName}`.trim() : (user.email?.split('@')[0] || 'You')}
            {verified && <BadgeCheck size={16} color="#10B981" className="acc-verified" />}
          </div>
          <div className="acc-hero-email">{user.email}</div>
          {profile?.loyalty_tier && (
            <span className="acc-tier-pill">
              <Sparkles size={10} /> {profile.loyalty_tier}
            </span>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="acc-stats">
        <button className="acc-stat" onClick={() => nav('/orders')}>
          <Package size={16} color="var(--primary)" />
          <div className="acc-stat-num">{stats.orders}</div>
          <div className="acc-stat-label">Orders</div>
        </button>
        <button className="acc-stat" onClick={() => nav('/wishlist')}>
          <Heart size={16} color="#EF4444" />
          <div className="acc-stat-num">{stats.wishlist}</div>
          <div className="acc-stat-label">Wishlist</div>
        </button>
        <button className="acc-stat" onClick={() => nav('/xwallet')}>
          <Wallet size={16} color="#10B981" />
          <div className="acc-stat-num">{stats.points}</div>
          <div className="acc-stat-label">Points</div>
        </button>
      </div>

      {/* Profile form */}
      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800 }}>Profile</div>
          {!editing ? (
            <button className="acc-edit-btn" onClick={() => setEditing(true)}>
              <Pencil size={13} /> Edit
            </button>
          ) : (
            <button className="acc-edit-btn" onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </button>
          )}
        </div>

        {!editing ? (
          <div className="acc-info">
            <div className="acc-info-row">
              <span className="acc-info-label">Name</span>
              <span className="acc-info-value">{(firstName || lastName) ? `${firstName} ${lastName}`.trim() : '—'}</span>
            </div>
            <div className="acc-info-row">
              <span className="acc-info-label">Email</span>
              <span className="acc-info-value">{user.email || '—'}</span>
            </div>
            <div className="acc-info-row">
              <span className="acc-info-label">Phone</span>
              <span className="acc-info-value">{phone || '—'}</span>
            </div>
            <div className="acc-info-row">
              <span className="acc-info-label">Tier</span>
              <span className="acc-info-value">{profile?.loyalty_tier || 'Starter'}</span>
            </div>
            <div className="acc-info-row">
              <span className="acc-info-label">Wallet</span>
              <span className="acc-info-value money">₱{Number(profile?.xwallet_balance || 0).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="acc-form">
            <label className="acc-field">
              <span>First name</span>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Juan" />
            </label>
            <label className="acc-field">
              <span>Last name</span>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dela Cruz" />
            </label>
            <label className="acc-field">
              <span>Phone</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63 9…" inputMode="tel" />
            </label>
            <label className="acc-field disabled">
              <span>Email</span>
              <input value={user.email || ''} disabled />
            </label>
            <button className="btn-brand acc-save" onClick={save} disabled={saving}>
              <Save size={15} /> {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        )}
      </div>

      {/* Verified hint */}
      {!verified && (
        <div className="acc-hint">
          <ShieldCheck size={16} color="var(--primary)" />
          <div>
            <div style={{ fontWeight: 800, fontSize: 13 }}>Get verified</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
              Verify your phone and email to unlock higher tiers.
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="acc-loading" />
      )}
    </div>
  );
}
