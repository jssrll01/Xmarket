import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Bell, Zap, Tag, ShieldCheck, Sparkles,
  Gift, Clock, Star, Truck
} from 'lucide-react';

const notifs = [
  { icon: Bell, color: '#00d4ff',
    title: 'Welcome to XMARKET!',
    body: 'Enjoy discounted prices on all products. Shop now and save more!' },
  { icon: Zap, color: '#ffd600',
    title: 'Instant Delivery Now Available!',
    body: 'All digital products now support Instant Delivery with no delivery fee. Get your purchase instantly!' },
  { icon: Sparkles, color: '#e539ff',
    title: 'New Arrivals',
    body: 'Check out the newest additions to our MALL and E-Book collections.' },
  { icon: Tag, color: '#00d4ff',
    title: 'Seasonal Vouchers',
    body: 'Limited-time discounts are live on the Home banner. Grab them before they end!' },
  { icon: ShieldCheck, color: '#7b3ff2',
    title: 'Verified Sellers',
    body: 'Look for the blue badge next to store names. All verified sellers are trusted.' },
  { icon: Gift, color: '#e539ff',
    title: 'Free Minor Adjustments',
    body: 'Selected digital services include 1 month of free minor adjustments after delivery.' },
  { icon: Truck, color: '#00d4ff',
    title: 'Meet-up Option Available',
    body: 'Prefer face-to-face? Choose Meet-up at checkout — 3 to 7 days, ₱15 per km.' },
  { icon: Clock, color: '#ffd600',
    title: 'Pre-order Items',
    body: 'Pre-order products ship 7-14 days after confirmation. Look for the PRE-ORDER tag.' },
  { icon: Star, color: '#ffd600',
    title: 'Rate Your Experience',
    body: 'Loved your purchase? Let us know — feedback helps us improve.' },
];

export default function Notifications() {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1 && document.referrer) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={goBack} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 12 }}>Notifications</h2>
      {notifs.map((n, i) => {
        const Icon = n.icon;
        return (
          <div key={i} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 42, height: 42, borderRadius: 14, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-2)',
              boxShadow: 'var(--inset-sm)'
            }}>
              <Icon size={18} color={n.color} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{n.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>{n.body}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
