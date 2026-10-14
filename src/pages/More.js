import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, ShoppingBag, RotateCcw, FileText, Wallet, Gift,
  Ticket, Users, Star, Settings, HelpCircle, LogOut, Info,
  ShieldCheck, ChevronRight, Package, MessageSquare, MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

const APP_VERSION = '1.0.0';

const GROUPS = [
  {
    title: 'Shop',
    items: [
      { icon: ShoppingBag, label: 'My Orders',      to: '/orders' },
      { icon: Heart,       label: 'Wishlist',       to: '/wishlist' },
      { icon: RotateCcw,   label: 'Returns',        to: '/returns' },
      { icon: MessageSquare, label: 'My Reports',   to: '/reports' },
    ],
  },
  {
    title: 'Wallet & rewards',
    items: [
      { icon: Wallet, label: 'XWallet',   to: '/xwallet' },
      { icon: Gift,   label: 'XCards',    to: '/xcards' },
      { icon: Ticket, label: 'Vouchers',  to: '/vouchers' },
      { icon: Star,   label: 'Rewards',   to: '/rewards' },
    ],
  },
  {
    title: 'Social',
    items: [
      { icon: Users, label: 'Following', to: '/following' },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: MapPin,    label: 'Addresses',   to: '/addresses' },
      { icon: Settings,  label: 'Settings',    to: '/settings' },
      { icon: ShieldCheck, label: 'Account',   to: '/account' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center', to: '/help' },
      { icon: Info,       label: 'About',       to: '/about' },
    ],
  },
];

export default function More() {
  const nav = useNavigate();
  const { user, profile } = useAuth() || {};
  const { show: showToast } = useToast();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) nav(-1);
    else nav('/');
  };

  const doLogout = async () => {
    const { supabase } = await import('../lib/supabase');
    await supabase.auth.signOut();
    showToast?.('Signed out');
    nav('/');
  };

  const initials = (() => {
    const fn = profile?.first_name || '';
    const ln = profile?.last_name || '';
    const base = (fn + ln).trim() || user?.email || '?';
    return base[0].toUpperCase();
  })();

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={goBackSafe} className="icon-btn"><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, flex: 1 }}>More</h2>
      </div>

      {/* Identity card (if signed in) */}
      {user && (
        <button
          className="mr-id-card"
          onClick={() => nav('/account')}
          type="button"
        >
          <div className="mr-id-avatar">
            <span>{initials}</span>
          </div>
          <div className="mr-id-info">
            <div className="mr-id-name">
              {profile?.first_name || user.email?.split('@')[0] || 'You'}
            </div>
            <div className="mr-id-sub">{user.email}</div>
          </div>
          <ChevronRight size={16} color="var(--muted)" />
        </button>
      )}

      {/* Groups */}
      {GROUPS.map((group) => (
        <div key={group.title} className="mr-group">
          <div className="mr-group-title">{group.title}</div>
          <div className="mr-group-card">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.to}
                  className="mr-row"
                  onClick={() => nav(item.to)}
                  type="button"
                >
                  <span className="mr-row-icon">
                    <Icon size={17} color="var(--primary)" />
                  </span>
                  <span className="mr-row-label">{item.label}</span>
                  <ChevronRight size={15} color="var(--muted)" />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Logout */}
      {user && (
        <button
          className="mr-logout"
          onClick={() => setConfirmLogout(true)}
          type="button"
        >
          <LogOut size={16} /> Sign out
        </button>
      )}

      {/* Footer */}
      <div className="mr-footer">
        <div>XMARKET · v{APP_VERSION}</div>
        <div className="mr-footer-sub">© {new Date().getFullYear()} XMARKET</div>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="Sign out?"
        message="You'll need to sign in again to access your cart and orders."
        confirmLabel="Sign out"
        danger
        onCancel={() => setConfirmLogout(false)}
        onConfirm={doLogout}
      />
    </div>
  );
}
